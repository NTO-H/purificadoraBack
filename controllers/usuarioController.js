const {Usuario} = require("../models/Usuario");
require("../routes/usuario");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");



exports.Login = async (req, res) => {
  try {
    const { email, password1 } = req.body;
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(401).send("El correo no existe");
    // if (usuario) return res.status(200).send("El correo  existe");
    console.log("Password recibido:", password1);
    const isPasswordValid = await bcrypt.compare(password1, usuario.password1);
    

    if (!isPasswordValid) return res.status(401).send("Contraseña incorrecta");

    // Verificar si el usuario tiene un rol
    if (!usuario.rol) {
      // Si el usuario no tiene un rol, enviar un mensaje de error
      return res.status(401).send("El usuario no tiene un rol asignado");
    }

    // Si el usuario tiene un rol, firmar el token JWT con el rol incluido
    const token = jwt.sign({ _id: usuario._id, rol: usuario.rol }, "secret");
    return res.status(200).json({ token, rol: usuario.rol });
  } catch (error) {
    console.log("ohh no :",error);
    return res.status(500).send("Error en el servidor: " + error);
    
  }
};




exports.perfilUsuario = async (req, res) => {
  
  try {
    const correo = req.params.correo;
    // Buscar el usuario por correo en la base de datos
    const usuario = await Usuario.findOne({ correo });
    // Verificar si el usuario existe
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    // Devolver los datos del perfil del usuario
    return res.status(200).json({ datos: usuario });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: 'Error en el servidor' });
  }

};


// ruta de verificacion de tipo de acceso
exports.VerificaTipoRolAcceso = (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(403).json({ message: "Token no proporcionado" });
  }

  jwt.verify(token, "secret_key", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token inválido" });
    }

    req.user = decoded;
    next();
  });
};

// Middleware para verificar el token y el rol del usuario
exports.verifyTokenAndRole = (role) => (req, res, next) => {
  // Verificar si el usuario está autenticado
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "Acceso denegado. Debes iniciar sesión." });
  }

  // Verificar si el usuario tiene el rol adecuado
  if (req.user.role !== role) {
    return res
      .status(403)
      .json({ message: `Acceso denegado. Debes ser ${role}.` });
  }

  // Si el usuario está autenticado y tiene el rol adecuado, continuar con la siguiente función
  next();
};


// Ruta protegida para administradores
exports.adminRoute = exports.verifyTokenAndRole("administrador");
// Ruta protegida para clientes
exports.clienteRoute = exports.verifyTokenAndRole("cliente");

exports.EstadoUsuario = async (req, res) => {
  try {
    const cookie = req.cookies["jwt"];
    if (!cookie) {
      return res.status(401).send({
        message: "no autentificado",
      });
    }
    const claims = jwt.verfy(cookie, "secret");
    if (!claims) {
      return res.status(401).send({
        message: "no  autentificado",
      });
    }
    const usuario = await Usuario.findOne({ _id: claims._id });
    if (!usuario) {
      return res.status(401).send({
        message: "Usuario no encontrado",
      });
    }

    const { password, ...data } = await usuario.toJSON();
    res.send(data);
  } catch (error) {
    return res.status(401).send({
      message: "no autentificado",
    });
  }
};

exports.crearUsuario = async (req, res) => {
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
    const record = await Usuario.findOne({ email: email });
    if (record) {
      return res.status(400).send({ message: "El email ya está registrado" });
    }
    const usuario = new Usuario({
      nombre: nombre,
      email: email,
      telefono: telefono,
      pregunta: pregunta,
      respuesta: respuesta,
      password1: hashedPassword,
      longitud: longitud, // Agregar longitud al objeto usuario
      latitud: latitud, // Agregar latitud al objeto usuario
      numCasa: numCasa // Agregar numCasa al objeto usuario
    });

    const resultado = await usuario.save();
    const { _id } = await resultado.toJSON();
    const token = jwt.sign({ _id: _id }, "secret");
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    console.log("Registro exitoso:", resultado); // Mensaje de éxito en la consola
    res.json({
      usuario: resultado._id,
      message: "exitoso",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor: " + error);
  }
};






exports.obtenerUsuarioById = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ msg: "usuario Not Found" });
    }
    res.json(usuario);
  } catch (error) {
    console.log(error);
    res.status(404).send("ucurrio un error");
  }
};


exports.buscaUsuarioByCorreo = async (req, res) => {
  try {
    let usuario = await Usuario.findOne({ correo: req.params.correo }, { _id: 1 });
    if (usuario) {
      res.json({ usuarioId: usuario._id });
    } else {
      res.json({ msg: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};







exports.BuscaUsuarioByCorreo = async (req, res) => {
  try {
    const {correo }= req.body;

    const usuario = await Usuario.findOne({correo} );
    if (!usuario) {
      return res
        .status(404)
        .json({ message: "usuario con este correo no encontrado" });
     
    }
    res.json(usuario)

  } catch (error) {
    console.log(error);
    res.status(404).send("ocurrio un error");
  }
};








exports.BuscaUsuarioByToken = async (req, res) => {
  try {
    const {correo,token }= req.body;

    const usuario = await Usuario.findOne({correo:correo,token:token} );
   console.log(usuario);
    if (!usuario) {
      return res
        .status(404)
        .json({ message: "usuario no encontrado" });
     
    }
    res.json(usuario)

  } catch (error) {
    console.log(error);
    res.status(404).send("ocurrio un error");
  }
};

exports.BuscaUsuarioByPreguntayRespuesta = async (req, res) => {
  try {
    const {pregunta,respuesta }= req.body;

    const usuario = await Usuario.findOne({pregunta:pregunta,respuesta:respuesta} );
   console.log(usuario);
    if (!usuario) {
      return res
        .status(404)
        .json({ message: "usuario no encontrado" });
     
    }
    res.json(usuario)

  } catch (error) {
    console.log(error);
    res.status(404).send("ocurrio un error");
  }
};

// exports.obtenerUsuarios = async (req, res) => {
//   try {
//     const usuarios = await Usuario.find();
//     res.json(usuarios);
//   } catch (error) {
//     console.log("error de consulta");
//   }
// };

exports.obtenerUsuarios = async (req, res) => {
  try {
    // Excluye el usuario con el rol "admin" de la consulta
    const usuarios = await Usuario.find({ rol: { $ne: "admin" } });
    res.json(usuarios);
  } catch (error) {
    console.log("error de consulta");
  }
};

exports.actualizarPasswordxCorreo = async (req, res) => {
  try {
    let correo = req.body.correo;
    let token = req.body.token;
    let nuevaPassword = req.body.nueva;

    // Verificar si nuevaPassword está definido y no es una cadena vacía
    if (!nuevaPassword || typeof nuevaPassword !== 'string') {
      console.log(nuevaPassword)
      return res.status(400).json({ message: 'La nueva contraseña es inválida' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(nuevaPassword, salt);

    const usuario = await Usuario.findOne({ correo: correo, token: token });

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Actualiza la contraseña del usuario en la base de datos
    usuario.password = hashedPassword;
    await usuario.save();

    // Devuelve una respuesta exitosa
    res.status(200).json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    // Maneja los errores y devuelve una respuesta de error
    console.error(error);
    res.status(500).json({ message: "Ocurrió un error al actualizar la contraseña" });
  }
};



exports.actualizarPasswordxPregunta = async (req, res) => {
  try {
    let pregunta = req.body.pregunta;
    let respuesta = req.body.respuesta;
    let nuevaPassword = req.body.nueva;
console.log("pregunta=>",pregunta)
console.log("respuesta=>",respuesta)
console.log("nuevaPassword=>",nuevaPassword)
    // Verificar si nuevaPassword está definido y no es una cadena vacía
    if (!nuevaPassword || typeof nuevaPassword !== 'string') {
      console.log(nuevaPassword)
      return res.status(400).json({ message: 'La nueva contraseña es inválida' });
    }

    // Encripta la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(nuevaPassword, salt);

    // Busca el usuario por correo y token
    const usuario = await Usuario.findOne({ pregunta: pregunta, respuesta: respuesta });

    // Si no se encuentra el usuario, devuelve un mensaje de error
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Actualiza la contraseña del usuario en la base de datos
    usuario.password = hashedPassword;
    await usuario.save();

    // Devuelve una respuesta exitosa
    res.status(200).json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    // Maneja los errores y devuelve una respuesta de error
    console.error(error);
    res.status(500).json({ message: "Ocurrió un error al actualizar la contraseña" });
  }
};





exports.eliminarUsuario = async (req, res) => {
  try {
    let usuario = await Usuario.findById(req.params.id);

    if (!usuario) {
      res.status(404).json({ msg: 'No existe el Usuario' });
    }
    
    await Usuario.findOneAndDelete({ _id: req.params.id });
    res.json({ msg: 'Usuario eliminado con exito' });
    
  } catch (error) {
    console.log(error);
    res.status(500).send('ocurrio un error');
  }
}

exports.listarSecretas = async (req, res) => {
  try {
    // Obtener todas las preguntas secretas
    const preguntas = await PreguntasSecretas.find();

    // // Verificar si se obtuvieron preguntas
    // if (preguntas.length === 0) {
    //   // No se encontraron preguntas
    //   console.log('No se encontraron preguntas secretas');
    //   return res.status(404).json({ error: 'No se encontraron preguntas secretas' });
    // }

    // Devolver las preguntas como respuesta JSON
    res.json(preguntas);
  } catch (error) {
    // Manejar errores
    console.error('Error al obtener las preguntas secretas:', error);
    res.status(500).json({ error: 'Error al obtener las preguntas secretas' });
  }
};






// exports.obtenerPreguntasSecretas = async (req, res) => {


//   console.log("Preguntas secretas encontradas:"); // Agregamos este console.log para verificar las preguntas secretas encontradas

//   try {
//     const question = await PreguntasSecretas.find();
//     console.log("Preguntas secretas encontradas:", question); // Agregamos este console.log para verificar las preguntas secretas encontradas
//     res.json(question);
//   } catch (error) {
//     console.error("Error al obtener las preguntas secretas:", error);
//     res.status(500).json({ error: "Error interno del servidor" });
//   }
// }


// Ruta para actualizar el rol de un usuario
exports.actualizaRolUsuario=async (req, res) => {
  const { id } = req.params;
  const { rol } = req.body;

  try {
    // Busca y actualiza el usuario en la base de datos
    const usuarioActualizado = await Usuario.findByIdAndUpdate(id, { rol: rol }, { new: true });

    if (!usuarioActualizado) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.status(200).json({ mensaje: 'Rol actualizado correctamente', usuario: usuarioActualizado });
  } catch (error) {
    console.error('Error al actualizar el rol del usuario:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};