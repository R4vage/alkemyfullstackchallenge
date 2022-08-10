import mongoose from "mongoose";

const expenseSchema = mongoose.Schema({ //Probablemente habria sido mejor usar SQL, pero por una cuestion de tiempos decidí usar mongoDB
    name: {
        type: String,
        required: true, 
        trim: true 
    },
    
    value: {
        type: Number, //Tengo que decidir como manejar los decimales
        required: true,
        trim: true 
    },

    date: {
        type: Date,
        required: true
    }, 

    categoryName: {
        type: String,
        ref: "User.categories"
    },

    userID: {
        type: String,
        required: true,
        ref: "User"
    }
})

const Expense = mongoose.model("Expense", expenseSchema);
export default Expense