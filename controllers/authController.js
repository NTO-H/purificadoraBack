const { Usuario } = require("../Models/UsuarioModel");
const { Repartidor } = require("../Models/RepartidorModel");
const { Purificadora } = require("../Models/PurificadoraModel");
const mongoose = require("mongoose");
require("../Routes/UsuarioRoute");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.Login = async (req, res) => {
  try {
    const { email, password1 } = req.body;
    let usuario;

    console.log("correo recibido:", email);
    console.log("password recibido:", password1);

    // Verificar la conexión a la base de datos
    if (!mongoose.connection.readyState) {
      console.error("Error de conexión a la base de datos");
      return res
        .status(500)
        .json({ message: "Error de conexión a la base de datos" });
    }

    usuario = await Usuario.findOne({ email });
    if (!usuario) {
      usuario = await Repartidor.findOne({ email });
      if (!usuario) {
        usuario = await Purificadora.findOne({ email });
      }
    }


    if (!usuario) {
      console.log("El correo no existe");
      return res.status(401).json({ message: "El correo no existe" });
    }

    const isPasswordValid = await bcrypt.compare(password1, usuario.password1);
    if (!isPasswordValid) {
      console.log("Contraseña incorrecta");
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Verificar si el usuario tiene un rol
    if (!usuario.rol) {
      console.log("El usuario no tiene un rol asignado");
      return res
        .status(401)
        .json({ message: "El usuario no tiene un rol asignado" });
    }

    // Si el usuario tiene un rol, firmar el token JWT con el rol incluido
    const token = jwt.sign({ _id: usuario._id, rol: usuario.rol }, "secret");
    return res.status(200).json({ token, rol: usuario.rol });
  } catch (error) {
    console.log("Error en el servidor:", error);
    return res.status(500).json({ message: "Error en el servidor: " + error });
  }
};
