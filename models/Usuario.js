const mongoose = require("mongoose");

const UsuarioSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  }, email: {
    type: String,
    unique: true,
    required: true
  },
  password1: {
    type: String,
    required: true,
  },
  
  longitud: {
    type: String,
  },
  latitud: {
    type: String,
  },
  telefono: {
    type: String,
    required: true,
  },

  numCasa: {
    type: String,
    required: true,
  },


  token: {
    type: String, required: false,
  },
  pregunta: {
    type: String,
    required: false,
  },
  respuesta: {
    type: String,
    required: false,



  },
  rol: {
    type: String,
    required: true,
    default: "cliente",
  },
});



module.exports = {
  Usuario: mongoose.model("Usuarios", UsuarioSchema)
};


