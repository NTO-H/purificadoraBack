const { Purificadora } = require("../models/Purificadora");

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
