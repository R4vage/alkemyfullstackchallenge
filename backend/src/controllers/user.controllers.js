import User  from "../models/User.js";
import { createJWT } from "../helpers/createJWT.js";
import jwt from "jsonwebtoken"


//Este controlador crea un nuevo usuario.
const createNewUser = async (req, res) => {
    
    const { email } = req.body; // se extrae el email
    const existUser = await User.findOne ({email: email})
    if (existUser) {
        return res.status(400).json({msg: "Usuario ya está registrado", error:true})
    } //Si ya existe devuelve un error
    
    try{
        const user = new User(req.body)
        user.categories = [ //Creamos 5 categorias por defecto. Probabablemetne le deje la opcion al usuario de eliminarlas si asi lo desea
            {
                name: "Investment",
                color: "Green"
            },
            {
                name: "Transport",
                color: "Red"
            },
            {
                name: "Food",
                color: "Orange"
            },
            {
                name: "Services",
                color: "Blue"
            },
            {
                name: "Others",
                color: "Yellow"
            }
        ]
        
        await user.save();        
        res.json({
            msg: "Usuario creado con exito"
        });
    } catch(error) {
        return res.status(400).json({
            msg: `Lo sentimos, ocurrio un error al crear el usuario. Por favor, comunique el siguiente codigo a un administrador ${error}`, error:true
        })
    }
};

const authenticate = async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email: email }); //Buscamos al usuario
    if (!user) {
        return res.status(400).json({msg: "El usuario no está registrado" , error: true}); //Si no está, devolvemos un error
    }

    if (await user.checkPassword(password)) {
        return res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: createJWT(user._id) // Aca va el token, con un timer, ya que este si tiene que expirar
        })
    } else {
        return res.status(400).json({msg: "La contraseña es incorrecta" , error: true})
    }
};







export {createNewUser, authenticate}