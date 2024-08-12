const Purificadoras = require("../Models/PurificadoraModel");
const { Ruta } = require("../Models/RutaModel");
const { Repartidor } = require("../Models/RepartidorModel");
const { Vehiculo } = require("../Models/VehiculoModel");

const { Salida } = require("../Models/SalidaModel");
const { Usuario } = require("../Models/UsuarioModel");
require("../Routes/PurificadoraRoute");
const Utils = require("../Shareds/Utils");
const util = new Utils();


exports.obtenePuricadoras = async (req, res) => {
  try {
    const purificadoras = await Purificadoras.find();
if(purificadoras){
  console.log("Consulta exitosa");
}


    res.json(purificadoras);
  } catch (error) {
    console.log("error de consulta");
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

exports.eliminarPuricadora = async (req, res) => {
  try {
    let usuario = await Purificadoras.findById(req.params.id);

    if (!usuario) {
      res.status(404).json({ msg: "No existe el Usuario" });
    }

    await Purificadoras.findOneAndDelete({ _id: req.params.id });
    res.json({ msg: "Usuario eliminado con exito" });
  } catch (error) {
    console.log(error);
    res.status(500).send("ocurrio un error");
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

// exports.registroPuntoEntregaEnRuta = async (req, res) => {
exports.cliente = async (req, res) => {
  try {
    console.log("Contenido de req.body:", req.body);
    let { puntosDeEntrega } = req.body;

    // Validar que puntosDeEntrega existe y es un arreglo
    if (!puntosDeEntrega || !Array.isArray(puntosDeEntrega)) {
      puntosDeEntrega = [req.body];
    }
    // Validar que puntosDeEntrega existe y es un arreglo
    if (!puntosDeEntrega || !Array.isArray(puntosDeEntrega)) {
      return res.status(400).json({
        message:
          "El formato de los puntos de entrega no es válido o está ausente",
      });
    }
    // Busca la ruta por su IDRura
    let ruta = await Ruta.findById(req.params.id);
    if (!ruta) {
      return res.status(404).json({ message: "No se encontró la ruta" });
    }

    const formattedPuntosDeEntrega = puntosDeEntrega.map((punto) => {
      // Validar que los campos necesarios existen
      if (!punto.clienteId) {
        throw new Error("Formato de punto de entrega inválido");
      }

      return {
        clienteId: punto.clienteId.toString(), // Extraer el _id del cliente y convertir a cadena
      };
    });

    // Agregar los nuevos puntos de entrega al arreglo de puntos de entrega
    ruta.puntosDeEntrega.push(...formattedPuntosDeEntrega);

    // Guardar la ruta actualizada
    const rutaActualizada = await ruta.save();

    res.status(201).json({
      message: "Punto de entrega agregado con éxito",
      ruta: rutaActualizada,
    });
  } catch (error) {
    console.error("Error al agregar el punto de entrega:", error);
    res
      .status(500)
      .json({ message: "Error al agregar el punto de entrega", error });
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

exports.updatePurificadora = async (req, res) => {
  try {
    const {
      nombre,
      email,
      purificadoraNombre,
      calle,
      numero,
      estado,
      codigoPostal,
      longitud,
      latitud,
      telefono,
    } = req.body;

    let purificadora = await Purificadoras.findById(req.params.id);

    if (!purificadora) {
      res.status(404).json({ msg: "No existe el Usuario" });
    }
    purificadora.nombre = nombre;
    purificadora.email = email;
    purificadora.purificadoraNombre = purificadoraNombre;
    purificadora.calle = calle;
    purificadora.numero = numero;
    purificadora.estado = estado;
    purificadora.codigoPostal = codigoPostal;
    purificadora.longitud = longitud;
    purificadora.latitud = latitud;
    purificadora.telefono = telefono;

    purificadora = await Purificadoras.findOneAndUpdate(
      { _id: req.params.id },
      purificadora,
      { new: true }
    );
    res.json(purificadora);
  } catch (error) {
    console.log(error);
    res.status(500).send("ocurrio un error");
  }
};

exports.crearRuta = async (req, res) => {
  try {
    const {
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

function obtenerFechaYYYYMMDD() {
  let fecha = new Date();
  let año = fecha.getFullYear();
  let mes = String(fecha.getMonth() + 1).padStart(2, "0");
  let dia = String(fecha.getDate()).padStart(2, "0");

  return `${dia}-${mes}-${año}`;
}

// !Importate :Hacer modificaciones de datos
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

    const formattedPuntosDeEntrega = puntosDeEntrega.map((item) => ({
      colonia: item.colonia,
      clientes: item.clienteId.map((id) => ({ clienteId: id.toString() })),
    }));
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

exports.updateSalidaCantidad=async(req,res)=>{
  try {
    const { idSalida, clienteId, cantidad } = req.body;
console.log(req.body);
    // Aquí actualizarías la cantidad en la base de datos según idSalida y clienteId
    const salida = await Salida.findById(idSalida);

    if (!salida) {
      return res.status(404).json({ msg: "Salida no encontrada" });
    }

    const puntoEntrega = salida.puntosDeEntrega.find(p => p.clienteId.toString() === clienteId);

    if (!puntoEntrega) {
      return res.status(404).json({ msg: "Cliente no encontrado en la salida" });
    }

    puntoEntrega.cantidadEntregada = cantidad;
    await salida.save();

    res.json({ msg: "Cantidad actualizada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Ocurrió un error");
  }

}

exports.RepartidoresyVehículosDisponibles = async (req, res) => {
  try {
    // Obtén la fecha y el día actual
    const fechaActual = util.getFechaDDMMYYYY();
    const diaActual = obtieneDiaActual();

    console.log(`Fecha actual: ${fechaActual}`);
    console.log(`Día actual: ${diaActual}`);

    // Obtener todos los repartidores y vehículos disponibles para el día actual
    const repartidores = await Repartidor.find().exec();

    const vehiculos = await Vehiculo.find().exec();

    console.log(`Repartidores encontrados: ${repartidores.length}`);
    console.log(`Vehículos encontrados: ${vehiculos.length}`);

    // Obtener las salidas registradas para el día actual
    const salidasHoy = await Salida.find({ fechaSalida: fechaActual })
      .populate("repartidorId")
      .populate("vehiculoId")
      .exec();

    console.log(`Salidas registradas hoy: ${salidasHoy.length}`);

    // Obtener rutas asignadas para el día actual
    const rutas = await Ruta.find({ diasAsignados: diaActual })
      .populate("repartidorId")
      .populate("vehiculoId")
      .exec();

    console.log(`Rutas asignadas hoy: ${rutas.length}`);

    // Crear conjuntos de IDs de repartidores y vehículos ocupados
    const repartidoresOcupados = new Set([
      ...salidasHoy.map(salida => salida.repartidorId._id.toString()),
      ...rutas.map(ruta => ruta.repartidorId._id.toString())
    ]);

    const vehiculosOcupados = new Set([
      ...salidasHoy.map(salida => salida.vehiculoId._id.toString()),
      ...rutas.map(ruta => ruta.vehiculoId._id.toString())
    ]);

    console.log(`Repartidores ocupados: ${[...repartidoresOcupados].length}`);
    console.log(`Vehículos ocupados: ${[...vehiculosOcupados].length}`);

    // Filtrar los repartidores y vehículos que están disponibles para el día actual
    const repartidoresDisponibles = repartidores.filter(repartidor =>
      !repartidoresOcupados.has(repartidor._id.toString()) &&
      repartidor.diasAsignados.includes(diaActual)
    );

    const vehiculosDisponibles = vehiculos.filter(vehiculo =>
      !vehiculosOcupados.has(vehiculo._id.toString()) &&
      vehiculo.diasAsignados.includes(diaActual)
    );

    console.log(`Repartidores disponibles después del filtro: ${repartidoresDisponibles.length}`);
    console.log(`Vehículos disponibles después del filtro: ${vehiculosDisponibles.length}`);

    // Responder con los repartidores y vehículos disponibles
    res.json({
      repartidores: repartidoresDisponibles,
      vehiculos: vehiculosDisponibles,
    });
  } catch (error) {
    console.error("Error en obtener repartidores y vehículos disponibles:", error);
    res.status(500).send("Ocurrió un error");
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

// !
exports.addSalida = async (req, res) => {
  try {
    const {
      nombreRuta,
      repartidorId,
      vehiculoId,
      puntosDeEntrega,
      cantidadBotellas,
    } = req.body;

    const formattedPuntosDeEntrega = puntosDeEntrega.map((clienteId) => ({
      clienteId: clienteId.toString(), // Convertir clienteId a cadena
    }));

    const fecha = util.getFechaDDMMYYYY();
    // Crear una nueva instancia del modelo Ruta
    const nuevaRuta = new Salida({
      nombreRuta,
      repartidorId,
      vehiculoId,
      estado: "enviado",
      puntosDeEntrega: formattedPuntosDeEntrega,
      cantidadBotellas: cantidadBotellas,
      diasSalida: obtieneDiaActual(),
      fechaSalida: fecha,
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

exports.getClienteDisponiblesByColonia = async (req, res) => {
  try {
    // Consultar todas las rutas
    let rutas = await Ruta.find();

    // Extraer los IDs de clientes que están en las rutas
    const clientesEnRutas = new Set(
      rutas.flatMap((ruta) =>
        ruta.puntosDeEntrega.map((punto) => punto.clienteId.toString())
      )
    );

    // Consultar todos los clientes en la colonia especificada
    let clientesEnColonia = await Usuario.find({
      colonia: req.body.colonia,
      rol: { $ne: "ADMINPG" },
    });

    if (clientesEnColonia.length === 0) {
      return res.status(404).json({
        message: "No hay clientes disponibles para la colonia especificada.",
      });
    }

    // Marcar cada cliente como seleccionado u ocupado
    const clientesConEstado = clientesEnColonia.map((cliente) => {
      return {
        ...cliente.toObject(), // Convertir el cliente a objeto plano para agregar nuevos campos
        seleccionado: clientesEnRutas.has(cliente._id.toString()),
        ocupado: clientesEnRutas.has(cliente._id.toString()),
      };
    });

    res.status(200).json(clientesConEstado);
  } catch (error) {
    console.error(error); // Agrega un log detallado para la depuración
    if (!res.headersSent) {
      // Verifica si los encabezados ya han sido enviados
      res
        .status(500)
        .json({ message: "Error al obtener los clientes disponibles", error });
    }
  }
};


exports.getClienteDisponibles = async (req, res) => {
  try {
    // consultar todos las rutas
    let rutas = await Ruta.find();

    // const formattedPuntosDeEntrega = rutas.map((clienteId) => ({
    //   clienteId: clienteId.toString(), // Convertir clienteId a cadena
    // }));

    // // tomar todos los clientes de las rutas
    const clientesEnRutas = [
      ...new Set(
        rutas.flatMap((rutas) =>
          rutas.puntosDeEntrega.map((punto) => punto.clienteId.toString())
        )
      ),
    ];

    // let cientes = await Cliente.find({ _id: { $ne: "ADMINPG" } });

    let clientesDisponibles = await Usuario.find({
      $and: [{ _id: { $nin: clientesEnRutas } }, { rol: { $ne: "ADMINPG" } }],
    });

    if (clientesDisponibles.length == 0) {
      res.status(404).json({ msg: "No hay clientes disponibles" });
    }

    // filtrar los clientes que no están en rutas

    console.log(clientesDisponibles);
    // const clientesDisponibles = clientes.filter((cliente) => {});

    res.status(200).json(clientesDisponibles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// exports.registroRuta = async (req, res) => {
//   try {
//     const {
//       nombreRuta,
//       repartidorId,
//       vehiculoId,
//       fechaInicio,
//       estado,
//       puntosDeEntrega,
//       diasAsignados,
//     } = req.body;

//     // Formatear puntosDeEntrega correctamente
//     const formattedPuntosDeEntrega = [];

//     puntosDeEntrega.forEach((punto) => {
//       // Iterar sobre cada array interno de clienteIds
//       punto.clienteId.forEach((clienteIdArray) => {
//         // Iterar sobre cada clienteId dentro del array
//         clienteIdArray.forEach((clienteId) => {
//           formattedPuntosDeEntrega.push({
//             municipio: punto.municipio,
//             colonia: punto.colonia,
//             clienteId: clienteId.toString(), // Convertir clienteId a cadena
//           });
//         });
//       });
//     });

//     // Crear una nueva instancia del modelo Ruta
//     const nuevaRuta = new Ruta({
//       nombreRuta,
//       repartidorId,
//       vehiculoId,
//       fechaInicio: fechaInicio ? new Date(fechaInicio) : undefined,
//       estado,
//       puntosDeEntrega: formattedPuntosDeEntrega,
//       diasAsignados,
//     });

//     // Guardar la nueva ruta en la base de datos
//     const rutaGuardada = await nuevaRuta.save();
//     console.log(rutaGuardada);
//     res.status(201).json(rutaGuardada);
//   } catch (error) {
//     console.error("Error al agregar la ruta:", error);
//     res.status(500).json({ message: "Error al agregar la ruta", error });
//   }
// };
// controllers/rutaController.js

// controllers/rutaController.js

exports.getDiasDisponibles = async (req, res) => {
  try {
    const rutaId = req.params.id;

    // Buscar la ruta por ID
    const ruta = await Ruta.findById(rutaId);
    if (!ruta) {
      return res.status(404).json({ message: "Ruta no encontrada" });
    }

    // Buscar repartidor y vehículo
    const repartidor = await Repartidor.findById(ruta.repartidorId);
    if (!repartidor) {
      return res.status(404).json({ message: "Repartidor no encontrado" });
    }

    const vehiculo = await Vehiculo.findById(ruta.vehiculoId);
    if (!vehiculo) {
      return res.status(404).json({ message: "Vehículo no encontrado" });
    }

    // Obtener los días asignados a la ruta actual
    const diasAsignadosRuta = new Set(ruta.diasAsignados);

    // Buscar todas las rutas que no sean la actual
    const otrasRutas = await Ruta.find({
      _id: { $ne: rutaId },
      $or: [
        { repartidorId: ruta.repartidorId },
        { vehiculoId: ruta.vehiculoId },
      ],
    });

    // Obtener los días ocupados por el repartidor y el vehículo en otras rutas
    const diasOcupados = new Set();

    otrasRutas.forEach((otraRuta) => {
      otraRuta.diasAsignados.forEach((dia) => {
        if (
          otraRuta.repartidorId.equals(ruta.repartidorId) ||
          otraRuta.vehiculoId.equals(ruta.vehiculoId)
        ) {
          diasOcupados.add(dia);
        }
      });
    });

    // Determinar todos los días de la semana
    const todosLosDias = [
      "lunes",
      "martes",
      "miercoles",
      "jueves",
      "viernes",
      "sabado",
      "domingo",
    ];

    // Determinar los días disponibles que no están en los días asignados ni ocupados
    const diasDisponibles = todosLosDias.filter(
      (dia) => !diasAsignadosRuta.has(dia) && !diasOcupados.has(dia)
    );

    res.json({
      diasAsignados: Array.from(diasAsignadosRuta),
      diasOcupados: Array.from(diasOcupados),
      diasDisponibles,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener los días disponibles", error });
  }
};
