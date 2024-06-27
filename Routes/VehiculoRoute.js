const express = require("express");
const router = express.Router();

const VehiculoController = require("../Controllers/VehiculoController");

router.put("/actualiza/:id", VehiculoController.actualizaDatos);
router.delete("/deleteVehiculo/:id", VehiculoController.eliminarVehiculo);
router.get("/getDetalles/:id", VehiculoController.obtenerVehiculoById);

router.post("/crearVehiculo", VehiculoController.crearVehiculo);
router.get("/obtenerVehiculos", VehiculoController.getVehiculos);
module.exports = router;



