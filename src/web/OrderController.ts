import {Body, Controller, Post, Get, Params} from 'routing-controllers';
import { Hotel} from "../entity/Hotel";
import {Connection} from 'typeorm/connection/Connection';

import {Connect} from "../bdd/Connect";

import { Customer } from '../entity/Customer';
import { Order } from '../entity/Order';
import { OrderItem } from '../entity/OrderITem';

@Controller()
export class OrderController {

  connection: Promise<Connection>;

  constructor() {
    // generates a connection using `ormconfig.json`
    this.connection = Connect.getConnect();
  }

  @Get("/orders/:id")
  async getAll(@Params()id:number) {
    try{
      const connection = await this.connection;
      let orderRepository = connection.getRepository(Order);
      let order = await orderRepository.findOne(id);
      if(order)   return order;
      else return "order not found in db";
    }
    catch(Error){
      console.log(Error.message);
      return Error.message;
    }
  }

  @Post("/orders")
  async post(@Body() body: any) {   
    try { 
      const connection = await this.connection; 
      let customer = new Customer(body.client.name,body.client.username,body.client.email,
                                  body.client.address,body.client.phoneNumber);   
      let customerRepository = connection.getRepository(Customer);
      await customerRepository.save(customer);  //Client crée et sauvergardé

      let order = new Order();
      order.customer = customer;
      order.date = new Date();
      order.totalAmount = body.totalAmount;
      
      let orderRepository = connection.getRepository(Order);  
      await orderRepository.save(order);  //commande crée et sauvegardé

      let total = 0;
      let productRepository = connection.getRepository(Hotel);
      let orderItemRepository = connection.getRepository(OrderItem);

      for(let i=0 ; i<body.products.length ; i++){
          let orderItem = new OrderItem();            //on crée une commande minifiée
          orderItem.order = order;                    //association avec la commande en cours
          let hotel:Hotel = await productRepository.findOne(body.hotels[i].id); //on récupère le produit correspondant
          orderItem.hotel = hotel;                //association avec le produit correspondant 
          orderItem.price = body.hotels[i].price;                  //insertion du prix envoyé
          orderItem.quantity = body.hotels[i].quantity;            //insertion de la quantité envoyé
          orderItemRepository.save(orderItem);        //sauvegarde d'une commande minifiée
          total += body.hotels[i].quantity * hotel.currentPrice; 
      }
      
      order.totalAmount = total;
      return order;    
    }
    catch(Error){
      console.log(Error.message);
      return Error.message;
    }
  }
}