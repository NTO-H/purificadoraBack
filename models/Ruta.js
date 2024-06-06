const mongoose=require( "mongoose");

// Define el esquema para puntos de entrega
const PuntoDeEntregaSchema = mongoose.Schema({
  municipio: { type: String, required: true },
  colonia: { type: String, required: true },
  clienteId: { type: String, required: true },
});

// Define el esquema para la ruta
const RutaSchema = mongoose.Schema({
  nombreRuta: { type: String, required: true },
  repartidorId: { type: String, required: true },
  vehiculoId: { type: String, required: true },
  fechaInicio: { type: Date, required: false },
  fechaFin: { type: Date, required: false },
  estado: {
    type: String,
    enum: ["pendiente", "en_curso", "finalizada"],
    required: false,
  },
  puntosDeEntrega: [PuntoDeEntregaSchema],
  diasAsignados: { type: Array, required: false },
});

module.exports={
    Ruta:mongoose.model("Ruta", RutaSchema)
}