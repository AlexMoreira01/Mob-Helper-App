import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { User } from "./Users";


@Entity("orders")
class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: "user_id" })
    user:User

    @Column()
    name_product: string;

    @Column()
    patrimony: string;

    @Column()
    department: string;

    @Column()
    location: string;

    @Column()
    address_access: string;

    @Column()
    description: string;

    @Column()
    status: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

}

export { Order }
