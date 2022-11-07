import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

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

    @CreateDateColumn()
    created_at: Date;

}

export { User }
