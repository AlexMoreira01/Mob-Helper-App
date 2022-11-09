import "reflect-metadata";
import "dotenv/config";

import express, { response } from 'express';

import cors from 'cors';

import AppDataSource from "./database";

import { hash, compare } from "bcryptjs";

AppDataSource; // Conexão
const app = express();

app.use(express.json())

app.use(cors())

import { User } from "./database/entities/Users";
import { Order } from "./database/entities/Orders";
import { Conclusion } from "./database/entities/Conclusion";

const usersRepository = AppDataSource.getRepository(User)
const ordersRepository = AppDataSource.getRepository(Order)
const conclusionRepository = AppDataSource.getRepository(Conclusion)

// Login
app.post('/login', async (request, response) => {
    const { email, password } = request.body;

    const user = await usersRepository
        .createQueryBuilder("user")
        .select(["user.id", "user.name", "user.email", "user.password", "user.industry_code", "user.isAdmin", "user.isLogged"])
        .where("user.email = :email")
        .setParameters({ email })
        .getOne()

    if (!user) {
        return response.status(400).json({
            "erro": "Email or password incorrect!"
        });
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
        return response.status(400).json({
            "erro": "Email or password incorrect!"
        });
    }

    await usersRepository
        .createQueryBuilder()
        .update()
        .set({
            isLogged: true
        })
        .where("id = :id")
        .setParameters({ id: user.id })
        .execute();

    const userLogged = {
        id: user.id,
        name: user.name,
        email: user.email,
        industry_code: user.industry_code,
        isAdmin: user.isAdmin,
    }

    return response.json(userLogged);

    // console.log(request.body)
    // return response.json(request.body);
})

app.get('/logout/:id', async (request, response) => {
    const id = request.params.id;

    await usersRepository
        .createQueryBuilder()
        .update()
        .set({
            isLogged: false
        })
        .where("id = :id")
        .setParameters({ id })
        .execute();

    return response.status(200).json();
})

app.post('/login/register', async (request, response) => {

    const { name, password, email, industry_code } = request.body;

    const userAlreadyExists = await usersRepository.findOneBy({ email })

    if (userAlreadyExists) {
        return response.status(400).json({
            "erro": "Usuário ja existente!"
        });
    }

    const passwordHash = await hash(password, 8);

    const createUser = await usersRepository.create({
        name,
        password: passwordHash,
        email,
        industry_code
    })

    await usersRepository.save(createUser);

    return response.status(201).send();

})

// Users
app.get('/users', async (request, response) => {
    const allUsers = await usersRepository
        .createQueryBuilder("user")
        .select(["user.id", "user.name", "user.email", "user.industry_code", "user.isAdmin"])
        .getMany()

    return response.json(allUsers);
})

app.get('/user/:id', async (request, response) => {

    const userID = request.params.id;

    const id = Number(userID);

    const user = await usersRepository
        .createQueryBuilder("user")
        .select(["user.id", "user.name", "user.email", "user.industry_code", "user.isAdmin"])
        .where("user.id = :id")
        .setParameters({ id })
        .getOne()

    if (!user) {
        return response.status(400).json({
            "erro": "Usuário inexistente!"
        });
    }

    return response.json(user);

})

app.get('/user/email/:email', async (request, response) => {

    const email = request.params.email;

    const user = await usersRepository
        .createQueryBuilder("user")
        .select(["user.id", "user.name", "user.email", "user.industry_code", "user.isAdmin"])
        .where("user.email = :email")
        .setParameters({ email })
        .getOne()

    if (!user) {
        return response.status(400).json({
            "erro": "Usuário inexistente!"
        });
    }

    return response.json(user);

})

// Orders
app.post('/orders/:id/user', async (request, response) => {
    const user_id = Number(request.params.id);

    const { name_product, patrimony, department, location, address_access, description } = request.body;

    const createOrder = await ordersRepository.create({
        user_id,
        name_product,
        patrimony,
        department,
        location,
        address_access,
        description,
        status: 'open'
    })

    await ordersRepository.save(createOrder);

    return response.status(201).json();
})

app.post('/orders/:type', async (request, response) => {
    const statusType = request.params.type;

    const { id, is_admin } = request.body;

    const userId = Number(id);

    const user = await usersRepository
        .createQueryBuilder("user")
        .select([
            "user.id",
            "user.name",
            "user.email",
            "user.industry_code",
            "user.isAdmin"
        ])
        .where("user.id = :userId")
        .setParameters({ userId })
        .getOne()

    if (!user) {
        return response.status(400).json({
            "erro": "Usuário inexistente!"
        });
    }

    if (is_admin) {
        const orders = await ordersRepository
            .createQueryBuilder("order")
            .select([
                "order.id",
                "order.user_id",
                "order.patrimony",
                "order.status",
                "order.created_at"
            ])
            .where("order.status = :statusType")
            .setParameters({ statusType })
            .orderBy("order.created_at", "DESC")
            .getMany()

        return response.json(orders);
    }
    else {
        const orders = await ordersRepository
            .createQueryBuilder("order")
            .select([
                "order.id",
                "order.user_id",
                "order.patrimony",
                "order.status",
                "order.created_at"
            ])
            .where("order.status = :statusType")
            .andWhere("order.user_id = :userId")
            .setParameters({ statusType, userId })
            .orderBy("order.created_at", "DESC")
            .getMany()

        return response.json(orders);
    }
})

app.get('/order/:id', async (request, response) => {
    const id = request.params.id;

    const idOrder = Number(id);

    const order = await ordersRepository
        .createQueryBuilder("order")
        .innerJoin("order.user", "user")
        .select([
            "order.id",
            "order.user_id",
            "order.name_product",
            "order.patrimony",
            "order.department",
            "order.location",
            "order.address_access",
            "order.description",
            "order.status",
            "order.created_at",

            "order.name_admin",
            "order.sla",
            "order.solution",
            "order.success",
            "order.updated_at",

            "user.name",
        ])
        .where("order.id = :idOrder")
        .setParameters({ idOrder })
        .getOne()

    return response.json(order);
})

app.put('/order/update/:id', async (request, response) => {
    const orderId = request.params.id;
    const { adminName, sla, success, solution } = request.body;

    const id = Number(orderId);

    const update = await ordersRepository
        .createQueryBuilder()
        .update()
        .set({
            status: 'closed',
            name_admin: adminName,
            sla,
            success,
            solution,
        })
        .where("id = :id")
        .setParameters({ id })
        .execute();

    return response.status(201).json();
})

app.delete('/order/:id', async (request, response) => {
    const id = Number(request.params.id);

    const orderRemove = await ordersRepository.findOneBy({ id })

    await ordersRepository.remove(orderRemove)

    return response.status(200).json();
})


export { app };
