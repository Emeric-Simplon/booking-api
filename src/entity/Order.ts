import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { OrderItem } from "./OrderITem";
import { Customer } from "./Customer";
import { Payment } from "./Payment";

@Entity('orders')
export class Order {

    constructor() {
    }

    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(type => OrderItem, orderItem => orderItem.order)
    orderItems: OrderItem[];

    @Column("text")
    date: Date;

    @Column("double")
    totalAmount: number;

    @ManyToOne(type => Customer, customer => customer.orders)
    customer: Customer;

    @OneToOne(type => Payment, payment => payment.order)
    payment: Payment;
}