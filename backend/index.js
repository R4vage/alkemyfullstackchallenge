import * as dotenv from 'dotenv'
import express from "express";
import conectarDb from "./src/config/db.js";
import cors from "cors";
import userRouter from './src/routes/user.routes.js';
import categoryRouter from './src/routes/category.routes.js';
import expenseRouter from './src/routes/expense.routes.js';




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
app.use("/api/categories", categoryRouter);
app.use("/api/expenses", expenseRouter);

const port = process.env.PORT || 4000;
app.listen(port);
