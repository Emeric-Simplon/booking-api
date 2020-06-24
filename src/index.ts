import "reflect-metadata";
import {createKoaServer} from 'routing-controllers';

import {OrderController} from "./web/OrderController";
import { HotelController } from "./web/HotelController";
import { CityController } from "./web/CityController";

var cors = require('kcors');

const app = createKoaServer({
    controllers: [HotelController,CityController,OrderController]
});
 
app.use(cors());

const port = process.env.PORT || 3000;

app.listen(port);

