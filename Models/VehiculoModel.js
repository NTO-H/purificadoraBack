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
  diasAsignados: { type: Array, required: false },

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
