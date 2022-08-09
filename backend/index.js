import * as dotenv from 'dotenv'
import express from "express";
import conectarDb from "./src/config/db.js";
import cors from "cors";
import userRouter from './src/routes/user.routes.js';




dotenv.config({ path: "./.env" });

const app = express();

app.use(express.json());

conectarDb();

const whiteList = ["http://localhost:4000"];

const corsOption = { //deshabilitado, pero lo dejo dando vueltas por si quieren implementarlo
    origin: function (origin, callback) {
      console.log(origin);
        callback(null, true);
    }
};
  
app.use(cors(corsOption));

app.use("/api/user", userRouter);

const port = process.env.PORT || 4000;
app.listen(port);
