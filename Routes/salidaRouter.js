const express = require("express");
const router = express.Router();
const salidaController = require("../Controllers/salidaController");

// Ruta para guardar una nueva entrega
// router.put('/confirmar', salidaController.confirmarSalida);
router.put('/confirmar', salidaController.confirmarSalida);
// obtener salidas o rutas por dia actual ,aplica la logica de la conducional if-else,
router.get("/salidaActual/", salidaController.getObtenerRutasXdia);
// crear salida
router.post("/salida/", salidaController.addSalida);

router.put("/salidaEstado/:id", salidaController.updateEstadoSalida);

module.exports = router;
