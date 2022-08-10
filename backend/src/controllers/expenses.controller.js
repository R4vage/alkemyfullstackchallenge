import Expense from "../models/Expense.js";
import User from "../models/User.js";


const getExpenses = async (req, res) => { //Para pedir el listado de gastos. Este controller es solo para QA/Development. No usar en el frontend.
    const {user} = req //Este user viene dado por el checkAuth
    const expenseList = await Expense.find({userID: user._id}).select("-__v -userID") //Buscamos la expenseList del usuario, y le sacamos la info que no nos sirve
    if (!expenseList || expenseList.length === 0){
        res.status(400).json({ msg: "No hay gastos" , error:true})
    } else {
        res.json(expenseList)
    }
}


const createNewExpense = async (req, res) => {
    const {user} = req //Este user viene dado por el checkAuth
    const {categoryName} = req.body; // se extrae el email
    const userFound = await User.findOne({userID: user._id});
    const categoryExists = userFound.categories.find(category => category.name === categoryName);
    if (categoryExists){
        try{
            const expense = new Expense({...req.body, userID:user._id})
            await expense.save();
            res.json({
                msg: "Gasto creado con exito"
            });

        } catch(error) {
            return res.status(400).json({
                msg: `Lo sentimos, ocurrio un error al crear el gasto. Por favor, comunique el siguiente codigo a un administrador ${error}`
            , error:true})
        }
    } else {
        return res.status(400).json({msg:"La categoría no existe", error:true})
    }
};

export {createNewExpense, getExpenses}