import jwt from "jsonwebtoken";

const createJWT = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    //.sign es un metodo que te permite generar un JWT
    expiresIn: "5d"
  });
};

export {createJWT};