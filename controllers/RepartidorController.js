const { Repartidor } = require("../Models/RepartidorModel");
const { Ruta } = require("../Models/RutaModel");
require("../Routes/RepartidorRoute");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Salida } = require("../Models/SalidaModel");
const Utils = require("../Shareds/Utils");

const utils = new Utils();

exports.crearRepartidores = async (req, res) => {
  try {
    let { password1, nombre, telefono, numCasa } = req.body;
    let email = req.body.email;
    let diasAsignados = req.body.diasAsignados;

    const fecha = utils.getFechaDDMMYYYY();

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
      numCasa: numCasa,
      diasAsignados: diasAsignados,
      fechaDeAgregacion: fecha,
    });

    const resultado = await repartidor.save();
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
    if (!isPasswordValid) {
      return res.status(401).send("Contraseña incorrecta");
    }
    console.log("Password recibido:", password1);
    const isPasswordValid = await bcrypt.compare(
      password1,
      repartidor.password1
    );

    if (!isPasswordValid) {
      return res.status(401).send("Contraseña incorrecta");
    }
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

exports.obtenerRepartidoresSinRuta = async (req, res) => {
  try {
    // Excluye el usuario con el rol "admin" de la consulta
    const repartidores = await Repartidor.find();
    if (!repartidores) {
      res
        .status(500)
        .json({ message: "Error al obtener los repartidores ", error });
    }
    const rutas = await Ruta.find();
    if (!rutas) {
      res.status(500).json({ message: "Error al obtener las rutas ", error });
    }

    const repartidoresEnRutas = rutas.map((ruta) =>
      ruta.repartidorId.toString()
    );
    console.log(repartidoresEnRutas);
    const repartidoresSinRutas = repartidores.filter(
      (repartidor) => !repartidoresEnRutas.includes(repartidor._id.toString())
    );
    console.log(repartidoresSinRutas);

    res.status(200).json(repartidoresSinRutas);
  } catch (error) {
    console.log("error de consulta");
    res
      .status(500)
      .json({ message: "Error al obtener los repartidores sin ruta", error });
  }
};

exports.eliminarRepartidor = async (req, res) => {
  try {
    let resultado = await Repartidor.findById(req.params.id);

    if (!resultado) {
      res.status(404).json({ msg: "No existe el Usuario" });
    }

    await Repartidor.findOneAndDelete({ _id: req.params.id });
    res.json({ msg: "Usuario eliminado con exito" });
  } catch (error) {
    console.log(error);
    res.status(500).send("ocurrio un error");
  }
};

exports.actualizaDatos = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, telefono, numCasa, diasAsignados } = req.body;
    let cliente = await Repartidor.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // Actualiza el usuario con los datos proporcionados en el cuerpo de la solicitud
    const usuarioActualizado = await Repartidor.findByIdAndUpdate(
      id,
      { nombre, email, telefono, numCasa, diasAsignados },
      { new: true }
    );

    console.log("Registro exitoso:"); // Mensaje de éxito en la consola

    res.status(200).json({
      mensaje: "Rol actualizado correctamente",
      usuario: usuarioActualizado,
    });
  } catch (error) {
    console.error("Error al actualizar el rol del usuario:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

exports.obtenerRepartidorById = async (req, res) => {
  try {
    const respuesta = await Repartidor.findById(req.params.id);
    if (!respuesta) {
      return res.status(404).json({ msg: "usuario Not Found" });
    }
    res.json(respuesta);
  } catch (error) {
    console.log(error);
    res.status(404).send("ucurrio un error");
  }
};

exports.getObtenerSalidaxClienteId = async (req, res) => {
  try {
    const fecha = utils.getFechaDDMMYYYY();
    const salida = await Salida.find({
      repartidorId: req.params.id,
      fechaSalida: fecha,
    })
      .populate("repartidorId")
      .populate("vehiculoId")
      .populate("puntosDeEntrega.clienteId")
      .exec();
    if (!salida || salida.length === 0) {
      return res
        .status(404)
        .json({ msg: "No se encontró salida para el día de hoy" });
    }
    res.json(salida);
  } catch (error) {
    console.log(error);
    res.status(500).send("Ocurrió un error");
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
