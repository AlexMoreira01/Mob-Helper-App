import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Conclusion } from "./Conclusion";
import { Order } from "./Orders";

@Entity("users")
class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    industry_code: string;

    @Column()
    isAdmin: boolean;

    @Column()
    isLogged: boolean;

    @OneToMany((type) => Order, (orders) => orders.user_id)
    order: Order 

    @OneToMany((type) => Conclusion, (conclusion) => conclusion.admin_id)
    conclusion: Conclusion 

    @CreateDateColumn()
    created_at: Date;

}

export { User }
