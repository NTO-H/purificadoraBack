const { Salida } = require("../Models/SalidaModel");
const { Ruta } = require("../Models/RutaModel");

const moment = require("moment"); // Asegúrate de haber instalado moment

function obtenerFechaYYYYMMDD() {
  let fecha = new Date();
  let año = fecha.getFullYear();
  let mes = String(fecha.getMonth() + 1).padStart(2, "0");
  let dia = String(fecha.getDate()).padStart(2, "0");

  return `${dia}-${mes}-${año}`;
}


exports.updateSalida = async (req, res) => {
  try {
    const { id } = req.params;

    const nombreRuta = req.body.nombreRuta;
    const repartidorId = req.body.repartidorId._id.toString();
    const vehiculoId = req.body.vehiculoId._id.toString();
    const cantidadBotellas = req.body.cantidadBotellas;
    const estado = req.body.estado;

    // Buscar la ruta existente por ID
    const salidaExistente = await Salida.findById(id);

    if (!salidaExistente) {
      return res.status(404).json({ message: "Ruta no encontrada" });
    }

    const updatedSalida = await Salida.findOneAndUpdate(
      { _id: id },
      { nombreRuta, estado, repartidorId, vehiculoId, cantidadBotellas },
      { new: true }
    );

    res.status(200).json(updatedSalida);
  } catch (error) {
    console.error("Error al actualizar la salida:", error);
    res.status(500).json({ message: "Error al actualizar la ruta", error });
  }
};

exports.updateSalidaCantidad = async (req, res) => {
  try {
    const { idSalida, clienteId, cantidad } = req.body;
    console.log(req.body);
    // Aquí actualizarías la cantidad en la base de datos según idSalida y clienteId
    const salida = await Salida.findById(idSalida);

    if (!salida) {
      return res.status(404).json({ msg: "Salida no encontrada" });
    }

    const puntoEntrega = salida.puntosDeEntrega.find(
      (p) => p.clienteId.toString() === clienteId
    );

    if (!puntoEntrega) {
      return res
        .status(404)
        .json({ msg: "Cliente no encontrado en la salida" });
    }

    puntoEntrega.cantidadEntregada = cantidad;
    await salida.save();

    res.json({ msg: "Cantidad actualizada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Ocurrió un error");
  }
};

exports.confirmarSalida = async (req, res) => {
  try {
    const { nombreRuta, fechaEntrada } = req.body;
    console.log(req.body);

    // Convertir la fechaEntrada de DD-MM-YYYY a formato correcto para comparación
    const fechaEntradaFormatted = moment(fechaEntrada, "DD-MM-YYYY").format(
      "DD-MM-YYYY"
    );

    // Encuentra la Salida por nombreRuta y fechaEntrada y actualiza su estado a 'confirmado'
    const salidaActualizada = await Salida.findOneAndUpdate(
      { nombreRuta: nombreRuta, fechaSalida: fechaEntradaFormatted }, // Busca por nombreRuta y fechaSalida
      { estado: "confirmado" },
      { new: true } // Esto devuelve el documento actualizado
    );

    if (!salidaActualizada) {
      return res.status(404).json({ mensaje: "Salida no encontrada" });
    }

    res.json({
      mensaje: "Estado actualizado a confirmado",
      salida: salidaActualizada,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar el estado", error });
  }
};

exports.getObtenerRutasXdia = async (req, res) => {
  try {
    let diasSemana = [
      "domingo",
      "lunes",
      "martes",
      "miercoles",
      "jueves",
      "viernes",
      "sabado",
    ];
    let fecha = new Date(); //Con la clase date obtendremos el dia
    let diaSemana = diasSemana[fecha.getDay()];

    // Obtener todas las rutas asignadas al día específico
    const rutas = await Ruta.find({ diasAsignados: diaSemana })
      .populate("repartidorId")
      .populate("vehiculoId")
      .populate("puntosDeEntrega.clienteId")
      .exec();
    if (!rutas || rutas.length === 0) {
      return res
        .status(404)
        .json({ msg: "No se encontraron rutas para el día de hoy" });
    }

    // Iterar sobre las rutas para verificar si hay una salida registrada
    const rutasConSalidas = await Promise.all(
      rutas.map(async (ruta) => {
        const salida = await Salida.findOne({
          nombreRuta: ruta.nombreRuta,
          fechaSalida: obtenerFechaYYYYMMDD(),
        })
          .populate("repartidorId")
          .populate("vehiculoId")
          .populate("puntosDeEntrega.clienteId")
          .exec();

        if (salida) {
          // Si existe una salida, retornar los datos de la salida
          return {
            ...salida.toObject(),
            diasAsignados: salida.diasSalida,
            cantidadBotellas: salida.cantidadBotellas,
            estado: salida.estado,
            fechaSalida: salida.fechaSalida,
            esSalida: true,
          };
        } else {
          // Si no existe una salida, retornar los datos de la ruta
          return {
            ...ruta.toObject(),
            esSalida: false,
          };
        }
      })
    );

    res.json(rutasConSalidas);
  } catch (error) {
    console.log(error);
    res.status(500).send("Ocurrió un error");
  }
};

function obtieneDiaActual() {
  let diasSemana = [
    "domingo",
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado",
  ];
  let fecha = new Date(); //Con la clase date obtendremos el dia
  let dia = diasSemana[fecha.getDay()];
  return `${dia}`;
}

exports.addSalida = async (req, res) => {
  try {
    const {
      nombreRuta,
      repartidorId,
      vehiculoId,
      puntosDeEntrega,
      cantidadBotellas,
    } = req.body;
    // console.log(req.body);

    // Formatea los puntos de entrega
    const formattedPuntosDeEntrega = puntosDeEntrega.map((item) => {
      if (!item.clienteId) {
        return {
          cantidadEntregada: item.cantidadEntregada || 0, // Valor predeterminado si no se proporciona
          clienteId: item,
        };
      }
      return {
        cantidadEntregada: item.cantidadEntregada || 0, // Valor predeterminado si no se proporciona
        // clienteId: mongoose.Types.ObjectId(item.clienteId), // Convierte 'clienteId' a ObjectId
      };
    });
    // Crear una nueva instancia del modelo Ruta
    const nuevaRuta = new Salida({
      nombreRuta,
      repartidorId,
      vehiculoId,
      estado: "enviado",
      puntosDeEntrega: formattedPuntosDeEntrega,
      cantidadBotellas: cantidadBotellas,
      diasSalida: obtieneDiaActual(),
      fechaSalida: obtenerFechaYYYYMMDD(),
    });

    // Guardar la nueva ruta en la base de datos
    const rutaGuardada = await nuevaRuta.save();
    // console.log(rutaGuardada);
    res.status(201).json(rutaGuardada);
  } catch (error) {
    console.error("Error al agregar la ruta:", error);
    res.status(500).json({ message: "Error al agregar la ruta", error });
  }
};
exports.updateEstadoSalida = async (req, res) => {
  try {
    const { id } = req.params; // Obtener el ID de la ruta desde los parámetros de la URL

    const { estado } = req.body; // Obtener el nuevo estado desde el cuerpo de la solicitud
    console.log(id);

    const rutaActualizada = await Salida.findByIdAndUpdate(
      id,
      { estado },
      { new: true } // Devuelve el documento modificado
    );

    if (!rutaActualizada) {
      return res.status(404).json({ message: "Salida no encontrada" });
    }
    // console.log(rutaActualizada);
    res.status(200).json(rutaActualizada);
  } catch (error) {
    console.error("Error al actualizar el estado de la ruta:", error);
    res
      .status(500)
      .json({ message: "Error al actualizar el estado de la ruta", error });
  }
};
//


//! npm install moment


// const moment = require('moment');

// exports.updateSalida = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { nombreRuta, repartidorId, vehiculoId, cantidadBotellas, estado } = req.body;

//     // Buscar la ruta existente por ID
//     const salidaExistente = await Salida.findById(id);

//     if (!salidaExistente) {
//       return res.status(404).json({ message: "Ruta no encontrada" });
//     }

//     // Preparar los campos a actualizar
//     const updateFields = {
//       nombreRuta,
//       repartidorId: repartidorId._id.toString(),
//       vehiculoId: vehiculoId._id.toString(),
//       cantidadBotellas,
//       estado,
//     };

//     // Obtener la fecha y hora actual
//     const now = moment();

//     // Actualizar la marca de tiempo según el estado, formateada
//     switch (estado) {
//       case 'enviada':
//         updateFields.tiempoEnviada = now.format('YYYY-MM-DD HH:mm');
//         break;
//       case 'recibida':
//         updateFields.tiempoRecibida = now.format('YYYY-MM-DD HH:mm');
//         break;
//       case 'finalizada':
//         updateFields.tiempoFinalizada = now.format('YYYY-MM-DD HH:mm');
//         break;
//       case 'confirmada':
//         updateFields.tiempoConfirmada = now.format('YYYY-MM-DD HH:mm');
//         break;
//     }

//     // Actualizar la salida con los nuevos valores
//     const updatedSalida = await Salida.findOneAndUpdate(
//       { _id: id },
//       updateFields,
//       { new: true }
//     );

//     res.status(200).json(updatedSalida);
//   } catch (error) {
//     console.error("Error al actualizar la salida:", error);
//     res.status(500).json({ message: "Error al actualizar la ruta", error });
//   }
// };
