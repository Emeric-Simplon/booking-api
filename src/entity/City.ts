import {Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn} from "typeorm";
import { Hotel } from "./Hotel";

@Entity('cities')
export class City {

    constructor(name, hotel){
       this.name = name;
       this.hotel = hotel;
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @OneToMany(type => Hotel, hotel => hotel.city) // note: we will create author property in the Photo class below
    hotel: Hotel[];
}