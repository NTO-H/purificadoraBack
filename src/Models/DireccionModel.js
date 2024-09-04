const mongoose = require("mongoose");

const ColoniaSchema = mongoose.Schema({
  municipioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Municipio",
    required: true,
  },
  colonias: {
    type: [String],
    required: true,
  },
});

const MunicipioSchema = mongoose.Schema({
  municipios: {
    type: [String],
    required: false,
  },
});

module.exports = {
  Colonia: mongoose.model("Colonia", ColoniaSchema),
  Municipio: mongoose.model("Municipio", MunicipioSchema),
};
