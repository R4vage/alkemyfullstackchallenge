import express from "express";
import { createNewExpense, getExpenses } from "../controllers/expenses.controller.js";
import checkAuth from "../middleware/checkAuth.js";


const expenseRouter = express.Router();

expenseRouter.get("/", checkAuth, getExpenses)
expenseRouter.post("/", checkAuth, createNewExpense)

export default expenseRouter