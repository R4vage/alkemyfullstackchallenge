import express from "express";
import { addCategory, getCategoryList, removeCategory } from "../controllers/categories.controllers.js";
import checkAuth from "../middleware/checkAuth.js";


const categoryRouter = express.Router();

categoryRouter.get("/", checkAuth, getCategoryList)
categoryRouter.post("/", checkAuth, addCategory)
categoryRouter.delete("/", checkAuth, removeCategory)

export default categoryRouter