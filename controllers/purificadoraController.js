const Purificadora = require("../Models/PurificadoraModel");
const { Ruta } = require("../Models/RutaModel");
const { Salida } = require("../Models/SalidaModel");
require("../Routes/PurificadoraRoute");

exports.registroPurificadora = async (req, res) => {
  try {
    let { nombre } = req.body;
    let { telefono } = req.body.telefono;
    let { email } = req.body.email; // Cambio de 'email' a 'email'
    let { longitud } = req.body.longitud; // Agregar longitud
    let { latitud } = req.body.latitud; // Agregar latitud
    let { purificadoraNombre } = req.body.purificadoraNombre;
    let { calle } = req.body.calle;
    let { codigoPostal } = req.body.codigoPostal;
    let { estado } = req.body.estado;
    let { numero } = req.body.numero;
    let usuario = "";
    let password1 = "";
    let estatus = "";

    const record = await Purificadora.findOne({ email: email });
    if (record) {
      return res.status(400).send({ message: "El correo ya está registrado" });
    }

    const purificadoraAdmin = new Purificadora({
      nombre: nombre,
      email: email,
      telefono: telefono,
      purificadoraNombre: purificadoraNombre,
      calle: calle,
      longitud: longitud,
      latitud: latitud,
      codigoPostal: codigoPostal,
      estado: estado,
      numero: numero,
      estatus: estatus,
      usuario: usuario,
      password1: password1,
    });

    const resultado = await purificadoraAdmin.save();
    console.log("Registro exitoso:", resultado); // Mensaje de éxito en la consola
    res.json({
      purificadoraAdmin: resultado._id,
      message: "exitoso",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor: " + error);
  }
};

exports.obtenePuricadoras = async (req, res) => {
  try {
    const purificadoras = await Purificadora.find();
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
    let usuario = await Purificadora.findById(req.params.id);

    if (!usuario) {
      res.status(404).json({ msg: "No existe el Usuario" });
    }

    await Purificadora.findOneAndDelete({ _id: req.params.id });
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

// Controlador: PurificadoraController.js

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
      if (
        // !punto.municipio ||
        // !punto.colonia ||
        // !punto.clienteId ||
        !punto.clienteId
      ) {
        throw new Error("Formato de punto de entrega inválido");
      }

      return {
        // municipio: punto.municipio,
        // colonia: punto.colonia,
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
      // puntosDeEntrega,
    } = req.body;
    // Encuentra la ruta por ID
    let ruta = await Ruta.findById(id);
    if (!ruta) {
      return res.status(404).json({ message: "Ruta no encontrada" });
    }

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
    // ruta.puntosDeEntrega = puntosDeEntrega;

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

    let purificadora = await Purificadora.findById(req.params.id);

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

    purificadora = await Purificadora.findOneAndUpdate(
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
    console.table(req.body);
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
      // Iterar sobre cada array interno de clienteIds
      punto.clienteId.forEach((clienteIdArray) => {
        // Iterar sobre cada clienteId dentro del array
        clienteIdArray.forEach((clienteId) => {
          formattedPuntosDeEntrega.push({
            // municipio: punto.municipio,
            // colonia: punto.colonia,
            clienteId: clienteId.toString(), // Convertir clienteId a cadena
          });
        });
      });
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
    console.table(nuevaRuta);

    // Guardar la nueva ruta en la base de datos
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
    "miércoles",
    "jueves",
    "viernes",
    "sábado",
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

    const formattedPuntosDeEntrega = puntosDeEntrega.map((clienteId) => ({
      clienteId: clienteId.toString(), // Convertir clienteId a cadena
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
//
exports.updateEstadoSalida = async (req, res) => {
  try {
    const { id } = req.params; // Obtener el ID de la ruta desde los parámetros de la URL
    const { estado } = req.body; // Obtener el nuevo estado desde el cuerpo de la solicitud
    console.log(estado);
    
    const rutaActualizada = await Salida.findByIdAndUpdate(
      id,
      { estado },
      { new: true } // Devuelve el documento modificado
    );

    if (!rutaActualizada) {
      return res.status(404).json({ message: "Ruta no encontrada" });
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
//
exports.updateSalida = async (req, res) => {
  try {
    const { id } = req.params; // Obtener el ID de la ruta desde los parámetros de la URL
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

    // Buscar la ruta existente por ID
    const rutaExistente = await Salida.findById(id);

    if (!rutaExistente) {
      return res.status(404).json({ message: "Ruta no encontrada" });
    }

    // Actualizar los campos de la ruta existente con los nuevos datos
    rutaExistente.nombreRuta = nombreRuta;
    rutaExistente.repartidorId = repartidorId;
    rutaExistente.vehiculoId = vehiculoId;
    rutaExistente.puntosDeEntrega = formattedPuntosDeEntrega;
    rutaExistente.cantidadBotellas = cantidadBotellas;
    rutaExistente.diasSalida = obtieneDiaActual();
    rutaExistente.fechaSalida = obtenerFechaYYYYMMDD();

    // Guardar los cambios en la base de datos
    const rutaActualizada = await rutaExistente.save();

    res.status(200).json(rutaActualizada);
  } catch (error) {
    console.error("Error al actualizar la ruta:", error);
    res.status(500).json({ message: "Error al actualizar la ruta", error });
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
        });

        if (salida) {
          // Si existe una salida, retornar los datos de la salida
          return {
            ...ruta.toObject(),
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



    

  const fecha=Utils.getFechaDDMMYYYY();
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
