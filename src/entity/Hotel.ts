import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { OrderItem } from "./OrderITem";
import { City } from "./City";

@Entity('hotels')
export class Hotel {

    constructor(name, description, currentPrice,
        stars, phone, adress,
        quantity, photoName, city) {
        this.name = name;
        this.description = description;
        this.currentPrice = currentPrice;

        this.stars = stars;
        this.phone = phone;
        this.adress = adress;

        this.quantity = quantity;
        this.photoName = photoName;
        this.city = city;
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column('text')
    description: string;
    
    @Column("double")
    currentPrice: number;

    @Column("int")
    stars: number;

    @Column("text")
    phone: string;

    @Column("text")
    adress: string;

    @Column("int")
    quantity: number;

    @Column("text")
    photoName: string;

    @ManyToOne(type => City, city => city.hotel)
    city: City;

    @ManyToOne(type => OrderItem, orderItem => orderItem.hotel)
    orderItems: OrderItem[];

    toString() {
        return this.id + " " + this.name + " " + this.description + " " + this.currentPrice + " " + this.quantity;
    }
}