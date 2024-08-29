const express = require("express");
const router = express.Router();
const salidaController = require("../Controllers/salidaController");

// actualiza el estado de la salida actual
router.put("/salida/:id", salidaController.updateSalida);
// actualiza el estado de la salida actual
router.put("/salidacantidad/", salidaController.updateSalidaCantidad);
// router.put('/confirmar', salidaController.confirmarSalida);
router.put('/confirmar', salidaController.confirmarSalida);
// obtener salidas o rutas por dia actual ,aplica la logica de la conducional if-else,
router.get("/salidaActual/", salidaController.getObtenerRutasXdia);
// obtener salidas o rutas por dia actual ,aplica la logica de la conducional if-else,
router.get("/salidaActual/:idPurificadora", salidaController.getObtenerRutasXdiaByIdPurificadora);
// crear salida
router.post("/salida/", salidaController.addSalida);

router.put("/salidaEstado/:id", salidaController.updateEstadoSalida);

module.exports = router;
