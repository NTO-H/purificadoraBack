const { Ruta } = require("../Models/RutaModel");
const { Repartidor } = require("../Models/RepartidorModel");
const { Vehiculo } = require("../Models/VehiculoModel");

const { Salida } = require("../Models/SalidaModel");
const { Usuario } = require("../Models/UsuarioModel");
const Utils = require("../Shareds/Utils");
const util = new Utils();
require("../Routes/RutaRoute");

exports.crearRuta = async (req, res) => {
  try {
    const {
      idPurificadora,
      nombreRuta,
      repartidorId,
      vehiculoId,
      fechaInicio,
      estado,
      puntosDeEntrega,
      diasAsignados,
    } = req.body;
    console.table(req.body.puntosDeEntrega);
    // console.table(req);

    // Verificar si ya existe una ruta con ese nombre
    const existencia = await Ruta.find({ nombreRuta: nombreRuta });

    // Si existe alguna ruta con ese nombre, devolver un mensaje de error
    if (existencia.length > 0) {
      return res
        .status(409)
        .json({ message: "Ya existe una ruta con ese nombre" });
    }

    const formattedPuntosDeEntrega = [];

    puntosDeEntrega.forEach((punto) => {
      if (Array.isArray(punto.clienteId)) {
        punto.clienteId.forEach((clienteId) => {
          formattedPuntosDeEntrega.push({
            colonia: punto.colonia,
            clienteId: clienteId.toString(), // Convertir clienteId a ObjectId
          });
        });
      } else {
        formattedPuntosDeEntrega.push({
          colonia: punto.colonia,
          clienteId: clienteId.toString(), // Convertir clienteId a ObjectId
        });
      }
    });
    // Crear una nueva instancia del modelo Ruta
    const nuevaRuta = new Ruta({
      idPurificadora:idPurificadora,
      nombreRuta,
      repartidorId,
      vehiculoId,
      fechaInicio: fechaInicio ? new Date(fechaInicio) : undefined,
      estado,
      puntosDeEntrega: formattedPuntosDeEntrega,
      diasAsignados,
    });
    // console.table(nuevaRuta);

    // Guardar la nueva ruta en la base  de datos
    const rutaGuardada = await nuevaRuta.save();
    // console.log(rutaGuardada);
    res.status(201).json(rutaGuardada);
  } catch (error) {
    console.error("Error al agregar la ruta:", error);
    res.status(500).json({ message: "Error al agregar la ruta", error });
  }
};

exports.eliminarRuta = async (req, res) => {
  try {
    let ruta = await Ruta.findById(req.params.id);

    if (!ruta) {
      res.status(404).json({ msg: "No existe el Ruta" });
    }

    await Ruta.findOneAndDelete({ _id: req.params.id });
    res.json({ msg: "Ruta eliminado con exito" });
  } catch (error) {
    console.log(error);
    res.status(500).send("ocurrio un error");
  }
};

exports.deleteClientRute = async (req, res) => {
  try {
    const puntoEntregaId = req.params.id;
    // Busca todas las rutas que contienen el punto de entrega con el id específico
    const rutas = await Ruta.find({ "puntosDeEntrega._id": puntoEntregaId });
    if (!rutas || rutas.length === 0) {
      return res
        .status(404)
        .json({ msg: "No se encontró el punto de entrega en ninguna ruta" });
    }

    // Itera sobre las rutas encontradas (puede haber más de una) para encontrar y eliminar el punto de entrega
    for (let i = 0; i < rutas.length; i++) {
      const ruta = rutas[i];
      ruta.puntosDeEntrega = ruta.puntosDeEntrega.filter(
        (punto) => punto._id.toString() !== puntoEntregaId
      );
      await ruta.save();
    }

    res.json({ msg: "Punto de entrega eliminado con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Ocurrió un error");
  }
};

exports.getDetalleRutaById = async (req, res) => {
  try {
    const ruta = await Ruta.findById(req.params.id)
      .populate("repartidorId")
      .populate("vehiculoId")
      .populate("puntosDeEntrega.clienteId")
      .exec();
    if (!ruta) {
      return res.status(404).json({ msg: "ruta Not Found" });
    }
    res.json(ruta);
  } catch (error) {
    console.log(error);
    res.status(404).send("ucurrio un error");
  }
};
exports.byIdPurificadora = async (req, res) => {
  try {
    console.log(req.params.idPurificadora)
    const ruta = await Ruta.find({"idPurificadora":req.params.idPurificadora})
      .populate("repartidorId")
      .populate("vehiculoId")
      .populate("puntosDeEntrega.clienteId")
      .exec();
    if (!ruta) {
      return res.status(404).json({ msg: "ruta Not Found" });
    }
    res.json(ruta);
  } catch (error) {
    console.log(error);
    res.status(404).send("ucurrio un error");
  }
};

exports.actualizarRuta = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombreRuta,
      repartidorId,
      vehiculoId,
      diasAsignados,
      puntosDeEntrega,
    } = req.body;
    // Encuentra la ruta por ID
    let ruta = await Ruta.findById(id);
    if (!ruta) {
      return res.status(404).json({ message: "Ruta no encontrada" });
    }
    const formattedPuntosDeEntrega = [];

    puntosDeEntrega.forEach((punto) => {
      if (Array.isArray(punto.clienteId)) {
        punto.clienteId.forEach((clienteId) => {
          formattedPuntosDeEntrega.push({
            colonia: punto.colonia,
            clienteId: clienteId.toString(), // Convertir clienteId a ObjectId
          });
        });
      } else {
        formattedPuntosDeEntrega.push({
          colonia: punto.colonia,
          clienteId: clienteId.toString(), // Convertir clienteId a ObjectId
        });
      }
    });
    // Verificar si ya existe una ruta con ese nombre y con un ID diferente
    const existencia = await Ruta.findOne({
      nombreRuta: nombreRuta,
      _id: { $ne: id },
    });
    if (existencia) {
      return res
        .status(409)
        .json({ message: "Ya existe una ruta con ese nombre" });
    }

    // Actualiza los campos de la ruta
    ruta.nombreRuta = nombreRuta;
    ruta.repartidorId = repartidorId;
    ruta.vehiculoId = vehiculoId;
    ruta.diasAsignados = diasAsignados;
    ruta.puntosDeEntrega = formattedPuntosDeEntrega;

    // Guarda los cambios en la base de datos
    const rutaActualizada = await ruta.save();
    console.log(rutaActualizada);
    res.status(200).json(rutaActualizada);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error del servidor", error: error.message });
  }
};
// Get rutas by repartidor ID
exports.getRutasPorRepartidor = async (req, res) => {
  try {
    console.log(req.params.id);
    const rutas = await Ruta.find({ repartidorId: req.params.id });
    // Extraer todos los días asignados y obtener los días únicos
    const dias = [...new Set(rutas.flatMap((ruta) => ruta.diasAsignados))];

    res.json(dias);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRutasPorVehiculo = async (req, res) => {
  try {
    console.log(req.params.id);
    const rutas = await Ruta.find({ vehiculoId: req.params.id });
    // Extraer todos los días asignados y obtener los días únicos
    const dias = [...new Set(rutas.flatMap((ruta) => ruta.diasAsignados))];

    res.json(dias);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.obteneRutas = async (req, res) => {
  try {
    const rutas = await Ruta.find()
      .populate("repartidorId")
      .populate("vehiculoId")
      .populate("puntosDeEntrega.clienteId")
      .exec();
    res.json(rutas);
  } catch (error) {
    console.log("error de consulta");
  }
};
exports.obteneRutas = async (req, res) => {
  try {
    const idPurificadora = req.params.idPurificadora;

    // Use find instead of findOne to get an array of documents
    const rutas = await Ruta.find({ idPurificadora: idPurificadora })
      .populate("repartidorId")
      .populate("vehiculoId")
      .populate("puntosDeEntrega.clienteId")
      .exec();
    res.json(rutas);
  } catch (error) {
    console.log("error de consulta");
  }
};
