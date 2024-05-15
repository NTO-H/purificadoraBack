const {Repartidor} = require("../models/repartidor");
require("../routes/repartidores");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");



exports.crearRepartidores = async (req, res) => {
    try {
      console.log("req.body:", req.body); // Agrega este registro
      let password1 = req.body.password1;
      console.log("password=>:", password1); // Agrega este registro
      let nombre = req.body.nombre;
      console.log("nombre=> :", nombre); // Agrega este registro
      let telefono = req.body.telefono;
      let email = req.body.email; // Cambio de 'email' a 'email'
      let pregunta = req.body.pregunta;
      let respuesta = req.body.respuesta;
      let longitud = req.body.longitud; // Agregar longitud
      let latitud = req.body.latitud; // Agregar latitud
      let numCasa = req.body.numCasa; // Agregar numCasa
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password1, salt);


      const record = await Repartidor.findOne({ email: email });
      if (record) {
        return res.status(400).send({ message: "El email ya está registrado" });
      }
      
      const repartidor = new Repartidor({
        nombre: nombre,
        email: email,
        telefono: telefono,
        pregunta: pregunta,
        respuesta: respuesta,
        password1: hashedPassword,
        longitud: longitud, // Agregar longitud al objeto Repartidor
        latitud: latitud, // Agregar latitud al objeto usuario
        numCasa: numCasa // Agregar numCasa al objeto usuario
      });
  
      const resultado = await repartidor.save();
      const { _id } = await resultado.toJSON();
      const token = jwt.sign({ _id: _id }, "secret");
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });
  
      console.log("Registro exitoso:", resultado); // Mensaje de éxito en la consola
      res.json({
        repartidor: resultado._id,
        message: "exitoso",
      });
    } catch (error) {
        res.status(500).send("Error en el servidor: " + error);
      console.log(error);
    }
  };
  
  exports.Login = async (req, res) => {
    try {
      const { email, password1 } = req.body;
      const repartidor = await Repartidor.findOne({ email });
      if (!repartidor) return res.status(401).send("El correo no existe");
      // if (usuario) return res.status(200).send("El correo  existe");
      console.log("Password recibido:", password1);
      const isPasswordValid = await bcrypt.compare(password1, repartidor.password1);
      
  
      if (!isPasswordValid) return res.status(401).send("Contraseña incorrecta");
  
      // Verificar si el UsuarioRepartidor tiene un rol
      if (!repartidor.rol) {
        // Si el UsuarioRepartidor no tiene un rol, enviar un mensaje de error
        return res.status(401).send("El usuario no tiene un rol asignado");
      }
  
      // Si el usuario tiene un rol, firmar el token JWT con el rol incluido
      const token = jwt.sign({ _id: repartidor._id, rol: repartidor.rol }, "secret");
      return res.status(200).json({ token, rol: repartidor.rol });
    } catch (error) {
      console.log("ohh no :",error);
      return res.status(500).send("Error en el servidor: " + error);
      
    }
  };  