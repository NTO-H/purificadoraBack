const express = require("express");
const router = express.Router();

const VehiculoController = require("../Controllers/vehiculoController");

router.put("/actualiza/:id", VehiculoController.actualizaDatos);
router.delete("/deleteVehiculo/:id", VehiculoController.eliminarVehiculo);
router.get("/getDetalles/:id", VehiculoController.obtenerVehiculoById);
router.get("/:idPurificadora", VehiculoController.vehiculosByIdP);

router.post("/crearVehiculo", VehiculoController.crearVehiculo);
router.get("/obtenerVehiculos", VehiculoController.getVehiculos);
router.get("/vehiculosDisponibles", VehiculoController.getVehiculosDisponibles);
module.exports = router;
