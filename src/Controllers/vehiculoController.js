const { Vehiculo } = require("../Models/VehiculoModel");
// require("../Routes/RepartidorRoute");
const { Ruta } = require("../Models/RutaModel");

exports.crearVehiculo = async (req, res) => {
  try {
    const idPurificadora=req.body.idPurificadora;
    let marca = req.body.marca;
    let modelo = req.body.modelo;
    let placas = req.body.placas;
    let diasAsignados = req.body.diasAsignados;
    const record = await Vehiculo.findOne({ placas: placas });
    if (record) {
      return res.status(400).send({ message: "El placas ya está registrado" });
    }
    const vehiculo = new Vehiculo({
      idPurificadora:idPurificadora,
      marca: marca,
      modelo: modelo,
      placas: placas,
      diasAsignados: diasAsignados,

      // Agregar numCasa al objeto usuario
    });

    const resultado = await vehiculo.save();
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
    
    const resultado = await Vehiculo.find();
    res.json(resultado);
  } catch (error) {
    console.log("error de consulta");
  }
};
exports.vehiculosByIdP = async (req, res) => {
  try {
    const idPurificadora = req.params.idPurificadora;

    // Use find instead of findOne to get an array of documents
    let data = await Vehiculo.find({ idPurificadora: idPurificadora });

    if (!data || data.length === 0) {
      return res.status(404).send("No Vehiculos found for the given Purificadora");
    }

    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).send("ocurrió un error");
  }
};


exports.getVehiculosDisponibles = async (req, res) => {
  try {
   
    const vehiculos = await Vehiculo.find();
    if (!vehiculos) {
      res
        .status(500)
        .json({ message: "Error al obtener los vehiculos ", error });
    }
    const rutas = await Ruta.find();
    if (!rutas) {
      res.status(500).json({ message: "Error al obtener las rutas ", error });
    }

    const vehiculosEnRutas = rutas.map((ruta) => ruta.vehiculoId.toString());
    const vehiculosSinRutas = vehiculos.filter(
      (vehiculo) => !vehiculosEnRutas.includes(vehiculo._id.toString())
    );

    res.status(200).json(vehiculosSinRutas);
  } catch (error) {
    console.log("error de consulta");
    res
      .status(500)
      .json({ message: "Error al obtener los Vehiculos sin ruta", error });
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
    const { marca, anio, modelo, placas, diasAsignados } = req.body;
    // Busca y actualiza el usuario en la base de datos
    let cliente = await Vehiculo.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // Actualiza el usuario con los datos proporcionados en el cuerpo de la solicitud
    const vehiculoActualizado = await Vehiculo.findByIdAndUpdate(
      id,
      { marca, anio, modelo, placas, diasAsignados },
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
