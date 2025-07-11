import express from "express";
import dotenv from "dotenv";

import connectToMongoDB from './src/config/dbConnect.js';
import router from './src/routers/url.routers.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;


app.use(express.json());



app.use('/', router);

app.listen(PORT, () => {
    connectToMongoDB();
    console.log("Server is running...");
});