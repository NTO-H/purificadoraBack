const Purificadora = require("../models/Purificadora");

require("../routes/purificadoras");

exports.registroPurificadora = async (req, res) => {
  try {
    let nombre = req.body.nombre;
    let telefono = req.body.telefono;
    let email = req.body.email; // Cambio de 'email' a 'email'
    let longitud = req.body.longitud; // Agregar longitud
    let latitud = req.body.latitud; // Agregar latitud

    let purificadora = req.body.purificadora;
    let calle = req.body.calle;
    let codigoPostal = req.body.codigoPostal;
    let estado = req.body.estado;
    let numero = req.body.numero;



    const Purificadora = new Purificadora({
      nombre: nombre,
      email: email,
      telefono: telefono,
      purificadora: purificadora,
      calle: calle,
      password1: hashedPassword,
      longitud: longitud, // Agregar longitud al objeto usuario
      latitud: latitud, // Agregar latitud al objeto usuario
      codigoPostal: codigoPostal, // Agregar numCasa al objeto usuario4
      estado: estado,
      numero: numero,
    });

    const resultado = await Purificadora.save();
    console.log("Registro exitoso:", resultado); // Mensaje de éxito en la consola
    res.json({
      Purificadora: resultado._id,
      message: "exitoso",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor: " + error);
  }
};
