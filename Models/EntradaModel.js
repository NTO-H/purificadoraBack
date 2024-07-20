const mongoose = require("mongoose");

// Define el esquema para puntos de entrega

const PuntoDeEntregaSchema = mongoose.Schema({
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: "Usuarios" },
});
// Define el esquema para la ruta
const EntradaSchema = mongoose.Schema({
  nombreRuta: { type: String, required: true },
  repartidorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Repartidores",
    required: true,
  },
  vehiculoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehiculo",
    required: true,
  },
  estado: {
    type: String,
    enum: ["enviado", "recibido", "en_espera", "en_transito", "finalizada"],
    required: false,
    default: "en_espera",
  },
  cantidadBotellas: {
    type: Number,
    required: false,
    default: 0, // Valor predeterminado de 0
  },
  cantidadBotellasSobrantes: {
    type: Number,
    required: false,
    default: 0, // Valor predeterminado de 0
  },
  contados: {
    type: Number,
    required: false,
    default: 0, // Valor predeterminado de 0
  },
  puntosDeEntrega: [PuntoDeEntregaSchema],
  diasEntrada: { type: String, required: false },
  fechaEntrada: {
    type: String,
    required: false,
    default: null, // Establece la fecha actual como valor predeterminado
  }
});

module.exports = {
  Salida: mongoose.model("Salida", EntradaSchema),
};
