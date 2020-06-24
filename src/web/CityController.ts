import {Body, Controller, Get, Post, Delete, Put, Req, Res, Params} from 'routing-controllers';
import {City} from "../entity/City";
import {Connection} from 'typeorm/connection/Connection';

import {Connect} from "../bdd/Connect";

@Controller()
export class CityController {

  connection: Promise<Connection>;

  constructor() {
    // generates a connection using `ormconfig.json`
    this.connection = Connect.getConnect();
    //this.connection = createConnection();
  }

  @Get("/cities/:id")          
  async Get(@Params() id:number){
    try {
      const connection = await this.connection;
      let cityRepository = connection.getRepository(City);
      let city = await cityRepository.findOne(id);
      if(city)    return city;    
      else return "City not in db";
    }
    catch(Error){
      console.log(Error.message);
      return Error.message;
    }
  }

  @Get("/cities/:id/hotels")          
  async getProductsByCat(@Params() id:number){
    try {
      const connection = await this.connection;
      let hotels = await connection.createQueryBuilder()
                    .relation(City, "hotels")
                    .of(id) 
                    .loadMany();
      if(hotels)    return hotels;
      else return "hotels of this City not in db";
    }
    catch(Error){
      console.log(Error.message);
      return Error.message;
    }
  }

  @Get("/cities")
  async getAll(@Req() request: any, @Res() response: any) {
    try {
      const connection = await this.connection;
      let cityRepository = connection.getRepository(City);
      let cities = cityRepository.find();
      if(cities)  return cities;
      else return "table of cities empty in db";
    }
    catch(Error){
      console.log(Error.message);
      return Error.message;
    }
  }

  @Post("/city")
  async post(@Body() body: any) {  
    const city = new City(body.name,body.hotels);    
    const connection = await this.connection;
    let categoryRepository = connection.getRepository(City);
    await categoryRepository.save(city);
    return city;
  }
/*
  @Put("/City/:id")
  async put(@Body() body: any, @Params()id:number){
    const connection = await this.connection;
    let categoryRepository = connection.getRepository(City);

    let newCategory = await categoryRepository.findOne(body.id);
    newCategory.name = body.name;
    newCategory.description= body.description;    

    await categoryRepository.save(newCategory);
    return newCategory;   
  }

  @Delete("/City/:id")
  async delete(@Params() id:number){
    const connection = await this.connection;
    let categoryRepository = connection.getRepository(City);
    let City = await categoryRepository.delete(id);
    return City;    
  }*/
}