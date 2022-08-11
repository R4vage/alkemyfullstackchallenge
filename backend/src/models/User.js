import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema(
    {
      // aca va toda la estructura de la tabla usuario
      name: {
        type: String,
        required: true, // hace que este campo sea obligatorio
        trim: true // te quita los espacios de adelante y de atras
      },
      lastName: {
        type: String,
        required: true,
        trim: true
      },
      password: {
        type: String,
        required: true, 
        trim: true
      },
      email: {
        type: String,
        required: true, 
        trim: true,
        unique: true
      },
      categories: [
        {//Agregué categories, ya que de acuerdo al challenge es un plus poder categorizar los gastos
            name: {
                type: String,
                required: true, 
                trim: true, 
            },

            color: {
                type: String,
                required: true,
                trim: true 
            }
        },
    ],
    },
    {
      timestamps: true // crea 2 columnas, una de creado y otra de actualizado
    }
  );


  userSchema.pre("save", async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt); // el this hace referencia al objeto del User
  });

userSchema.methods.checkPassword = async function (passwordForm) {
    return await bcrypt.compare(passwordForm, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
