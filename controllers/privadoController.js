const {Purificadoras} = require("../Models/PurificadoraModel");
exports.getPurificadoras = async (req, res) => {
  try {
    let purificadoras = await Purificadoras.find();

    res.status(200).json(purificadoras);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};





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

    const record = await Purificadoras.findOne({ email: email });
    if (record) {
      return res.status(400).send({ message: "El correo ya está registrado" });
    }

    const purificadoraAdmin = new Purificadoras({
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
