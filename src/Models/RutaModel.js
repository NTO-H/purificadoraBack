const mongoose = require("mongoose");

// Define el esquema para puntos de entrega
const PuntoDeEntregaSchema = mongoose.Schema({
  colonia: { type: String, required: true },
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: "Usuarios" },
});

// Define el esquema para la ruta
const RutaSchema = mongoose.Schema({
  idPurificadora: { type: mongoose.Schema.Types.ObjectId, ref: "Purificadoras" },
  nombreRuta: { type: String, unique: true, required: true },
  repartidorId: {type: mongoose.Schema.Types.ObjectId,ref: "Repartidores",required: true},
  vehiculoId: {type: mongoose.Schema.Types.ObjectId,ref: "Vehiculo",required: true},
  puntosDeEntrega: [PuntoDeEntregaSchema],
  diasAsignados: { type: Array, required: false },
});

module.exports = {
  Ruta: mongoose.model("Ruta", RutaSchema),
};
