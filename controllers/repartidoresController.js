const { Repartidor } = require("../models/repartidor");
require("../routes/repartidores");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.crearRepartidores = async (req, res) => {
  try {
    let password1 = req.body.password1;
    let nombre = req.body.nombre;
    let telefono = req.body.telefono;
    let email = req.body.email;
    let numCasa = req.body.numCasa;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password1, salt);
    const record = await Repartidor.findOne({ email: email });
    if (record) {
      return res.status(400).send({ message: "El email ya está registrado" });
    }

    const repartidor = new Repartidor({
      nombre: nombre,
      email: email,
      telefono: telefono,
      password1: hashedPassword,
      numCasa: numCasa, // Agregar numCasa al objeto usuario
    });

    const resultado = await repartidor.save();
    const { _id } = await resultado.toJSON();


    const token = jwt.sign({ _id: _id }, "secret");


    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    console.log("Registro exitoso:", resultado); // Mensaje de éxito en la consola
    res.json({
      repartidor: resultado._id,
      message: "exitoso",
    });
  } catch (error) {
    res.status(500).send("Error en el servidor: " + error);
    console.log(error);
  }
};

exports.Login = async (req, res) => {
  try {
    const { email, password1 } = req.body;
    const repartidor = await Repartidor.findOne({ email });
    if (!repartidor) return res.status(401).send("El correo no existe");
    // if (usuario) return res.status(200).send("El correo  existe");
    console.log("Password recibido:", password1);
    const isPasswordValid = await bcrypt.compare(
      password1,
      repartidor.password1
    );

    if (!isPasswordValid) return res.status(401).send("Contraseña incorrecta");
    if (!repartidor.rol) {
      return res.status(401).send("El usuario no tiene un rol asignado");
    }
    const token = jwt.sign(
      { _id: repartidor._id, rol: repartidor.rol },
      "secret"
    );
    return res.status(200).json({ token, rol: repartidor.rol });
  } catch (error) {
    console.log("ohh no :", error);
    return res.status(500).send("Error en el servidor: " + error);
  }
};


exports.getRepartidores = async (req, res) => {
  try {
    // Excluye el usuario con el rol "admin" de la consulta
    const resultado = await Repartidor.find();
    res.json(resultado);
  } catch (error) {
    console.log("error de consulta");
  }
};






// exports.getRepartidores = async (req, res) => {
//   try {
//     const resultado = await Repartidor.find();

//     return res.status(200).json({ resultado: resultado });
//   } catch (error) {
//     return res.status(500).send("error en el servidor", error);
//   }
// };
