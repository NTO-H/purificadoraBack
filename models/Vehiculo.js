const mongoose = require("mongoose");

const VehiculoSchema = mongoose.Schema({
  marca: {
    type: String,
    required: true,
  },
  modelo: {
    type: String,
    required: true,
  },
  anio: {
    type: Number,
    required: true,
  },
  placas: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: false,
  },
  kilometraje: {
    type: Number,
    required: false,
  },
  propietario: {
    type: String,
    required: false,
  },
});

module.exports = {
  Vehiculo: mongoose.model("Vehiculo", VehiculoSchema),
};
