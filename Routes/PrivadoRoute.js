const express = require("express");
const router = express.Router();

const PrivadoController = require("../Controllers/privadoController");

// obtner todas las purificaciones
router.get("/purificadoras", PrivadoController.getPurificadoras);

router.post("/purificadora", PrivadoController.registroPurificadora);
module.exports = router;

