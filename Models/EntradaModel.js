const mongoose = require("mongoose");

// Define el esquema para puntos de entrega

const PuntoDeEntregaSchema = mongoose.Schema({
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: "Usuarios" },
});
// Define el esquema para la ruta
const EntradaSchema = mongoose.Schema({
  idPurificadora: { type: mongoose.Schema.Types.ObjectId, ref: "Purificadoras" },

  nombreRuta: {type: String,required: true},
  repartidorId: {type: mongoose.Schema.Types.ObjectId,ref: "Repartidores",required: true,},
  vehiculoId: {type: mongoose.Schema.Types.ObjectId,ref: "Vehiculo",required: true,},
  estado: {type: String,enum: ["enviado", "recibido", "en_espera", "en_transito", "finalizada","confirmado"],required: false,default: "en_espera",},
  cantidadBotellas: {type: Number,required: false,default: 0,},
  cantidadBotellasSobrantes: {type: Number,required: false,default: 0,},
  contados: {type: Number,required: false,default: 0,},
  puntosDeEntrega: [PuntoDeEntregaSchema],
  diasEntrada: { type: String, required: false },
  fechaEntrada: {type: String,required: false,default: null,   },
});

module.exports = {
  Entrega: mongoose.model("Entrega", EntradaSchema),
};
