import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from "typeorm";
import { Order } from "./Order";
import { Hotel } from "./Hotel";

@Entity('orderitems')
export class OrderItem {

    constructor(){        
    } 

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Hotel, hotel => hotel.orderItems)
    hotel : Hotel;

    @Column("int")
    quantity: number;

    @Column("double")
    price: number;

    @ManyToOne(type => Order, order => order.orderItems)
    order : Order; 
}