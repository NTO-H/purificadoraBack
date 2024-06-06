const { Purificadora } = require("../models/Purificadora");
const{ Ruta}=require("../models/Ruta");
require("../routes/purificadoras");

exports.registroPurificadora = async (req, res) => {
  try {
    let nombre = req.body.nombre;
    let telefono = req.body.telefono;
    let email = req.body.email; // Cambio de 'email' a 'email'
    let longitud = req.body.longitud; // Agregar longitud
    let latitud = req.body.latitud; // Agregar latitud
    let purificadoraNombre = req.body.purificadoraNombre;
    let calle = req.body.calle;
    let codigoPostal = req.body.codigoPostal;
    let estado = req.body.estado;
    let numero = req.body.numero;
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
    const rutas = await Ruta.find();
    res.json(rutas);
  } catch (error) {
    console.log("error de consulta");
  }
};
exports.getDetalleRutaById = async (req, res) => {
  try {
    const ruta = await Ruta.findById(req.params.id);
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
    purificadora.email=email;
    purificadora.purificadoraNombre = purificadoraNombre;
    purificadora.calle=calle;
    purificadora.numero = numero;
    purificadora.estado=estado;
    purificadora.codigoPostal=codigoPostal;
    purificadora.longitud=longitud;
    purificadora.latitud = latitud;
    purificadora.telefono=telefono;

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






exports.registroRuta = async (req, res) => {
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

    // Formatear puntosDeEntrega correctamente
    const formattedPuntosDeEntrega = puntosDeEntrega.flatMap((punto) =>
      punto.clienteId.map((clienteId) => ({
        municipio: punto.municipio,
        colonia: punto.colonia,
        clienteId: clienteId.toString(), // Convertir clienteId a cadena
      }))
    );

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
    

    // Guardar la nueva ruta en la base de datos
    const rutaGuardada = await nuevaRuta.save();
    console.log(rutaGuardada);
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
