import Expense from "../models/Expense.js";
import User from "../models/User.js";


const getCategoryList = async (req, res) => { //Para pedir el listado de categorias
    const {user} = req //Este user viene dado por el checkAuth
    const categoryList = await User.findOne({userID: user._id}).select("categories -_id") //Buscamos la categoryList del usuario, y le sacamos la info que no nos sirve
    if (!categoryList){
        res.status(400).json({ msg:"Listado de categorias no encontrado", error: true})
    } else { res.json(categoryList.categories) }
}

const addCategory = async (req, res) => { //Para refinar habria que limitar la cantidad de categorias. La organización de los gastos pasa a tener menos sentido cuando se tiene demasiadas categorias.
    const {user} = req
    const { categoryName, categoryColor } = req.body
    const userFound = await User.findOne({userID: user._id}) //arrancamos buscando la lista
    if (!userFound){
        res.status(400).json({ msg: "Usuario no encontrado" , error: true})
    }
    const categoryExists = userFound.categories.find(category => category.name === categoryName); //Nos aseguramos que el item no exista
    if(!categoryExists || userFound.categories === []){
        userFound.categories.push({name: categoryName, color: categoryColor}) //Agregamos la categoria a la lista
        try {
            await userFound.save(); //Guardamos la nueva lista
            res.status(201).json({msg: "Categoria creada exitosamente"});
        } catch (error) {
            return res.status(409).json({msg: `Ocurrió un error: ${error}` , error: true})
        }
    } else {
        return res.status(400).json({msg:"La categoria ya existe" , error: true})
    }
}


const removeCategory = async (req, res) => {
    const {user} = req
    const { categoryName } = req.body
    const foundUser = await User.findOne({userID: user._id})
    if (!foundUser){
        res.status(400).json({ msg: "Usuario no encontrado" , error: true})
    }
    const categoryExists = foundUser.categories.findIndex(category => category.name === categoryName); //Aca nos aseguramos que la categoria exista, y extraemos su index
    if(categoryExists !== -1){
        const expenseList = await Expense.aggregate([
            {$match: {userID: `${user._id}`, categoryName:foundUser.categories[categoryExists].name}},

        ]);
        console.log(expenseList)
        if (expenseList.length !== 0){
            return res.status(400).json({msg:"Hay gastos en esta categoria, por favor, eliminelos, o cambielos de categoria", error:true})
        }
        foundUser.categories.splice(categoryExists, 1); //Sacamos la categoria del listado
        try { 
            await foundUser.save(); //Guardamos el listado
            res.status(201).json({msg: "Categoria eliminada exitosamente"}); //Le puse un 201 en vez de un 204 para poder mandar un json de respuesta, personalmente prefiero ver que reciba algo
        } catch (error) {
            return res.status(409).json({msg: `Ocurrió un error: ${error}` , error: true});
        }
    } else {
        return res.status(400).json({msg:"La categoria no existe" , error: true});
    }
} 

export {getCategoryList, addCategory, removeCategory}