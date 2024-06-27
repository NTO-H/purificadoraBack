const mongoose = require("mongoose");

const PurificadoraSchema = mongoose.Schema({
  nombre: {
    type: String,
  },
  email: { type: String },


  
  purificadoraNombre: { type: String },
  calle: { type: String },
  numero: { type: String },
  estado: { type: String },
  codigoPostal: { type: String },
  longitud: { type: String },
  latitud: { type: String },
  telefono: { type: String },
  usuario: {
    type: String,
    required: false,
  },
  password1: {
    type: String,
    required: false,
  },
  fechaDeRegistro: {
    type: Date,
    default: Date.now(),
  }, estatus: {
    type: String,
    required: false,
    default: "Activo",
  },

  rol: {
    type: String,
    required: false,
    default: "admPurificadora",
  },
});
module.exports = {
  Purificadora: mongoose.model("Purificadoras", PurificadoraSchema),
};
