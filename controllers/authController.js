const { Usuario } = require("../models/Usuario");
const { Repartidor } = require("../models/repartidor");
const { Purificadora } = require("../models/Purificadora");
require("../routes/usuario");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.Login = async (req, res) => {
  try {
    const { email, password1 } = req.body;

    let usuario;
    usuario = await Usuario.findOne({ email });

    if (!usuario) {
      usuario = await Repartidor.findOne({ email });
      if (!usuario) {
        usuario = await Purificadora.findOne({ email });
      }
    }
    if (!usuario) return res.status(401).send("El correo no existe");
    // if (usuario) return res.status(200).send("El correo  existe");
    console.log("Password recibido:", password1);
    const isPasswordValid = await bcrypt.compare(password1, usuario.password1);
    if (!isPasswordValid) return res.status(401).send("Contraseña incorrecta");

    // Verificar si el usuario tiene un rol
    if (!usuario.rol) {
      // Si el usuario no tiene un rol, enviar un mensaje de error
      return res.status(401).send("El usuario no tiene un rol asignado");
    }

    // Si el usuario tiene un rol, firmar el token JWT con el rol incluido
    const token = jwt.sign({ _id: usuario._id, rol: usuario.rol }, "secret");
    return res.status(200).json({ token, rol: usuario.rol });
  } catch (error) {
    console.log("ohh no :", error);
    return res.status(500).send("Error en el servidor: " + error);
  }
};
