import express from "express";
import { createNewExpense, getExpenses, removeExpense } from "../controllers/expenses.controller.js";
import checkAuth from "../middleware/checkAuth.js";


const expenseRouter = express.Router();

expenseRouter.get("/", checkAuth, getExpenses)
expenseRouter.post("/", checkAuth, createNewExpense)
expenseRouter.delete("/", checkAuth, removeExpense)

export default expenseRouter