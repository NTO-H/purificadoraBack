const express = require("express");
const router = express.Router();

const vehiculoController = require("../controllers/vehiculoController");

router.put("/actualiza/:id", vehiculoController.actualizaDatos);
router.delete("/deleteVehiculo/:id", vehiculoController.eliminarVehiculo);
router.get("/getDetalles/:id", vehiculoController.obtenerVehiculoById);

router.post("/crearVehiculo", vehiculoController.crearVehiculo);
router.get("/obtenerVehiculos", vehiculoController.getVehiculos);
module.exports = router;
