const { Vehiculo } = require("../models/vehiculo");
require("../routes/repartidores");

exports.crearVehiculo = async (req, res) => {
  try {
    let marca = req.body.marca;
    let modelo = req.body.modelo;
    let anio = req.body.anio;
    let placas = req.body.placas;
    const record = await Vehiculo.findOne({ placas: placas });
    if (record) {
      return res.status(400).send({ message: "El anio ya está registrado" });
    }
    const vehiculo = new Vehiculo({
      marca: marca,
      anio: anio,
      modelo: modelo,
      placas: placas, // Agregar numCasa al objeto usuario
    });

    const resultado = await vehiculo.save();
    // const { _id } = await Vehiculo.toJSON();

    console.log("Registro exitoso:", resultado); // Mensaje de éxito en la consola
    res.json({
      vehiculo: resultado._id,
      message: "exitoso",
    });
  } catch (error) {
    res.status(500).send("Error en el servidor: " + error);
    console.log(error);
  }
};

exports.getVehiculos = async (req, res) => {
  try {
    // Excluye el usuario con el rol "admin" de la consulta
    const resultado = await Vehiculo.find();
    res.json(resultado);
  } catch (error) {
    console.log("error de consulta");
  }
};

exports.eliminarVehiculo = async (req, res) => {
  try {
    let resultado = await Vehiculo.findById(req.params.id);

    if (!resultado) {
      res.status(404).json({ msg: "No existe el Usuario" });
    }

    await Vehiculo.findOneAndDelete({ _id: req.params.id });
    res.json({ msg: "Usuario eliminado con exito" });
  } catch (error) {
    console.log(error);
    res.status(500).send("ocurrio un error");
  }
};

exports.actualizaDatos = async (req, res) => {
  try {

     
    const { id } = req.params;
    const { marca, anio, modelo, placas } = req.body;
    // Busca y actualiza el usuario en la base de datos
    let cliente = await Vehiculo.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // Actualiza el usuario con los datos proporcionados en el cuerpo de la solicitud
    const vehiculoActualizado = await Vehiculo.findByIdAndUpdate(
      id,
      { marca, anio, modelo, placas },
      { new: true }
    );

    console.log("Registro exitoso:"); // Mensaje de éxito en la consola

    res.status(200).json({
      mensaje: "Datos actualizado correctamente",
      vehiculo: vehiculoActualizado,
    });
  } catch (error) {
    console.error("Error al actualizar:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

exports.obtenerVehiculoById = async (req, res) => {
  try {
    const respuesta = await Vehiculo.findById(req.params.id);
    if (!respuesta) {
      return res.status(404).json({ msg: "usuario Not Found" });
    }
    res.json(respuesta);
  } catch (error) {
    console.log(error);
    res.status(404).send("ucurrio un error");
  }
};