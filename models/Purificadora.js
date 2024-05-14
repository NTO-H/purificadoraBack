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
});
module.exports = {
  Purificadora: mongoose.model("Purificadoras", PurificadoraSchema),
};
