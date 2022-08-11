import express from "express";
import { changeExpense, createNewExpense, getExpenses, removeExpense } from "../controllers/expenses.controller.js";
import checkAuth from "../middleware/checkAuth.js";


const expenseRouter = express.Router();

expenseRouter.get("/", checkAuth, getExpenses)
expenseRouter.post("/", checkAuth, createNewExpense)
expenseRouter.delete("/", checkAuth, removeExpense)
expenseRouter.patch("/", checkAuth, changeExpense)

export default expenseRouter