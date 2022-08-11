import Expense from "../models/Expense.js";
import User from "../models/User.js";


const getExpenses = async (req, res) => { //Para pedir el listado de gastos. Este controller es solo para QA/Development. No usar en el frontend.
    const {user} = req //Este user viene dado por el checkAuth
    const expenseList = await Expense.find({userID: user._id}).select("-__v -userID") //Buscamos las expense del usuario, y le sacamos la info que no nos sirve
    if (!expenseList || expenseList.length === 0){
        res.status(400).json({ msg: "No hay gastos" , error:true})
    } else {
        res.json(expenseList)
    }
}


const createNewExpense = async (req, res) => {
    const {user} = req //Este user viene dado por el checkAuth
    const {categoryID} = req.body; // se extrae el email
    const userFound = await User.findOne({userID: user._id});
    const categoryExists = userFound.categories.find(category => category._id.toString() === categoryID);
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

const removeExpense = async (req, res) => { 
    const {user} = req
    const { expenseID } = req.body
    const expense = await Expense.findOne({userID: user._id, _id:expenseID}) //ID mayuscula
    if (!expense){
        res.status(400).json({ msg: "Gasto no encontrado" , error:true})
    } else {
        try { 
            await expense.delete(); //Eliminamos
            res.status(201).json({msg: "Gasto eliminado exitosamente"}); //Le puse un 201 en vez de un 204 para poder mandar un json de respuesta, personalmente prefiero ver que reciba algo
        } catch (error) {
            return res.status(409).json({msg: `Ocurrió un error: ${error}` , error:true})
        }
    } 
}

const changeExpense = async (req, res) => { 
    const {user} = req
    const { expenseID, newExpenseName, newExpenseValue, newExpenseDate, newCategory } = req.body
    const expense = await Expense.findOne({userID: user._id, _id:expenseID}) //ID mayuscula
    if (!expense){
        res.status(400).json({ msg: "Gasto no encontrado" , error:true})
    } else {
        if ((!newExpenseName || newExpenseName === expense.name) && 
            (!newExpenseValue || newExpenseValue === expense.value) &&
            (!newExpenseDate || newExpenseDate === expense.date) &&
            (!newCategory) || newCategory === expense.categoryID)
            {return  res.status(400).json({ msg: "No hay cambios a realizar" , error:true})
        } else {
            if (newExpenseName && newExpenseName !== expense.name){
                expense.name = newExpenseName
            };
            if (newExpenseValue && newExpenseValue !== expense.value){
                expense.value = newExpenseValue
            };
            if (newExpenseDate && newExpenseDate !== expense.date){
                expense.date = newExpenseDate
            };
            if (newCategory && newCategory !== expense.categoryID){
                const userFound = await User.findOne({userID: user._id}); //Podria catchear el error de que no encuentre al usuario, pero seria un caso extremo, que se daria solo si el usuario es eliminado intencionalmente de la base de datos, pero no sus gastos
                const categoryExists = userFound.categories.find(category => category.name === newCategory);
                if (categoryExists){
                    expense.categoryID = newCategory
                } else {
                    return res.status(400).json({msg:"La categoría no existe", error:true})
                }
            };
            try { 
                await expense.save(); //Eliminamos
                res.status(201).json({msg: "Gasto modificado exitosamente"}); //Le puse un 201 en vez de un 204 para poder mandar un json de respuesta, personalmente prefiero ver que reciba algo
            } catch (error) {
                return res.status(409).json({msg: `Ocurrió un error: ${error}` , error:true})
            }
        }
    } 
}


export {createNewExpense, getExpenses, removeExpense, changeExpense}