import express from "express";
import { addCategory, changeCategory, getCategoryList, removeCategory } from "../controllers/categories.controllers.js";
import checkAuth from "../middleware/checkAuth.js";


const categoryRouter = express.Router();

categoryRouter.get("/", checkAuth, getCategoryList)
categoryRouter.post("/", checkAuth, addCategory)
categoryRouter.delete("/", checkAuth, removeCategory)
categoryRouter.patch("/", checkAuth, changeCategory)

export default categoryRouter