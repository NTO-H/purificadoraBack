const express = require("express");
const router = express.Router();
const salidaController = require("../controllers/salidaController");

// Ruta para guardar una nueva entrega
// router.put('/confirmar', salidaController.confirmarSalida);
router.put('/confirmar', salidaController.confirmarSalida);

module.exports = router;
