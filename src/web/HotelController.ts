import { Body, Controller, Get, Post, Delete, Put, Req, Res, Params, UploadedFile } from 'routing-controllers';
import { Hotel } from "../entity/Hotel";
import { City } from "../entity/City";
import { Connection } from 'typeorm/connection/Connection';

import { Connect } from "../bdd/Connect";

import * as fs from 'fs';

@Controller()
export class HotelController {

  connection: Promise<Connection>;

  constructor() {
    // generates a connection using `ormconfig.json`
    this.connection = Connect.getConnect();
  }

  @Get("/hotel/:id")
  async Get(@Params() id: number, @Req() request: any, @Res() response: any) {
    try {
      const connection = await this.connection;
      let hotelRepository = connection.getRepository(Hotel);
      let hotel = await hotelRepository.findOne(id);
      if (hotel) return hotel;
      else {
        response.status = 404;      // ToDo à finir la gestion des codes erreu
        response.message = "hotel not found in database";
        return response;
      }
    }
    catch (Error) {
      console.log(Error.message);
      return Error.message;
    }
  }

  @Get("/hotels")
  async getAll() {
    try {
      const connection = await this.connection;
      let hotelRepository = connection.getRepository(Hotel);
      if (hotelRepository) return hotelRepository.find();
      else return "database empty";
    }
    catch (Error) {
      console.log(Error.message);
      return Error.message;
    }
  }

  @Get("/selectedHotels")
  async getSelectedHotels() {
    try {
      const connection = await this.connection;
      const products = await connection.getRepository(Hotel)
        .createQueryBuilder("hotel")
        .where("hotel.selected = :flag", { flag: true })
        .getMany();
      if (products) return products;
      else return "No products with option selected in database";
    }
    catch (Error) {
      console.log(Error.message);
      return Error.message;
    }
  }

  @Get("/promotionHotels")
  async getPromotionHotels() {
    try {
      const connection = await this.connection;
      const hotels = await connection.getRepository(Hotel)
        .createQueryBuilder("hotel")
        .where("hotel.promotion = :flag", { flag: true })
        .getMany();
      if (hotels) return hotels;
      else return "No hotels with option promotion in database";
    }
    catch (Error) {
      console.log(Error.message);
      return Error.message;
    }
  }

  @Get("/availableHotels")
  async getAvailableHotels() {
    try {
      const connection = await this.connection;
      const hotels = await connection.getRepository(Hotel)
        .createQueryBuilder("hotel")
        .where("hotel.available = :flag", { flag: true })
        .getMany();
      if (hotels) return hotels;
      else return "No hotels with option available in database";
    }
    catch (Error) {
      console.log(Error.message);
      return Error.message;
    }
  }

  @Post("/hotel")
  async post(@Body() body: any) {
    try {
      const hotel = new Hotel(body.name, body.description, body.currentPrice,
        body.stars,  body.phone,   body.adress,
        body.quantity, body.photoName, body.city);
      const connection = await this.connection;
      let cityRepository = connection.getRepository(City);
      if (body.city) {
        let city = await cityRepository.findOne(body.city.id); // Recup city à partir de son id
        hotel.city = city;
      }
      else hotel.city = null;
      let hotelRepository = connection.getRepository(Hotel);
      let ok = await hotelRepository.save(hotel);
      if (ok) return hotel;
      else return "Impossible to post hotel";
    }
    catch (Error) {
      console.log(Error.message);
      return Error.message;
    }
  }

  @Put("/hotels/:id")
  async put(@Body() body: any, @Params() id: number) {
    try {
      const connection = await this.connection;
      let hotelRepository = connection.getRepository(Hotel);

      let newHotel = await hotelRepository.findOne(id);
      if (!newHotel) return "this hotel doesnt exist";
      newHotel.name = body.name;
      newHotel.description = body.description;
      newHotel.currentPrice = body.currentPrice;

      newHotel.phone = body.phone;
      newHotel.adress = body.adress;
      newHotel.stars = body.stars;

      newHotel.photoName = body.photoName;
      newHotel.quantity = body.quantity;
      newHotel.city = body.city;

      let ok = await hotelRepository.save(newHotel);
      if (ok) return newHotel;
      else return "impossible to update this data in database";
    }
    catch (Error) {
      console.log(Error.message);
      return Error.message;
    }
  }

  @Delete("/hotel/:id")
  async delete(@Params() id: number) {
    try {
      const connection = await this.connection;
      let hotelRepository = connection.getRepository(Hotel);
      let ok = await hotelRepository.delete(id);

      if (ok.affected == 1) return "hotel deleted";
      else return "not found this hotel in db";
    }
    catch (Error) {
      console.log(Error.message);
      return Error.message;
    }
  }

  //Affichage d'une photo côté front
  @Get("/photoHotel/:id")
  async getPhoto(@Req() request: any, @Res() response: any, @Params() id: number) {
    try {
      const connection = await this.connection;
      let hotelRepository = connection.getRepository(Hotel);
      let hotel = await hotelRepository.findOne(id);
      let image = fs.readFileSync(process.env['HOME'] + "/ecom/hotels/" + hotel.photoName);
      response.type = 'image/png | image/jpeg';
      response.body = image;
      return response;
    }
    catch (Error) {
      console.log(Error.message);
      return Error.message;
    }
  }

  //Récupération d'une photo côté front pour l'ajouter dans le rep dédié côté back
  @Post("/uploadPhoto/:id")
  async uploadPhoto(@UploadedFile("file") file: any, @Params() id: number) {
    try {
      const connection = await this.connection;
      let hotelRepository = connection.getRepository(Hotel);
      let hotel = await hotelRepository.findOne(id);
      if (hotel) {
        fs.writeFileSync(process.env['HOME'] + "/booking/hotels/" + file.originalname, file.buffer); //ToDo si fichier existe
        //sous entend que les reps booking et hotels existent ToDO prévoir leur création avec injection de la photo par défaut
        hotel.photoName = file.originalname;
        let ok = hotelRepository.save(hotel);
        if (ok) return "upload ok";
        else return "pb with update hotel/photo";
      }
    }
    catch (Error) {
      console.log(Error.message);
      return Error.message;
    }
  }

  // @Post("/generate")
  // async generate(){   // TODO si base de donné vide alors valider la génération des datas + ajouter sécurité ici ou désactiver... 
  //   const connection = await this.connection;    
  //   //ajout de catégories
  //   const smartphone = new Category("SmartPhone","Tel mobile",null);    
  //   const laptop = new Category("LapTop","pc portbale & fixe",null);    
  //   const tablet = new Category("Tablet","Tablet Graphique",null);    
  //   let categoryRepository = connection.getRepository(Category);
  //   await categoryRepository.save(smartphone);  
  //   await categoryRepository.save(laptop);  
  //   await categoryRepository.save(tablet);    

  //   //ajout de produits
  //   const s8 = new Hotel("s8","samsung s8",250,true,true,true,0,'unknown.png',smartphone);
  //   const s9 = new Hotel("s9","samsung s9",300,true,true,true,0,'unknown.png',smartphone);
  //   const iphone = new Hotel("iphone","iphone x",250,true,true,true,0,'unknown.png',smartphone);
  //   let productRepository = connection.getRepository(Hotel);
  //   await productRepository.save(s8);  
  //   await productRepository.save(s9); 
  //   await productRepository.save(iphone); 

  //   const pc1 = new Hotel("pc1","dell",350,true,true,true,0,'unknown.png',laptop);
  //   const pc2 = new Hotel("pc2","sony",450,true,true,true,0,'unknown.png',laptop);
  //   await productRepository.save(pc1);  
  //   await productRepository.save(pc2);

  //   const tab = new Hotel("tablet","samsung galaxy",250,true,true,true,0,'unknown.png',tablet);
  //   await productRepository.save(tab);  

  //   //Ajout d'un client
  //   const dupont = new Customer("dupont","dup","dupont@gmail.com","2 chemin gris", "0616325421");
  //   let customerRepository = connection.getRepository(Customer);
  //   await customerRepository.save(dupont);

  //   return "Generate data in database ok";    
  // }   
}