const mongoose = require("mongoose");

const RepartidoresSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  email: {
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
  },fechaDeAgregacion: {
    type: Date,
    default: Date.now(),
  },
  rol: {
    type: String,
    required: true,
    default: "repartidor",
  },
});



module.exports = {
  Repartidor: mongoose.model("Repartidores", RepartidoresSchema)
};


