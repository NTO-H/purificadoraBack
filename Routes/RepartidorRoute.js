const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jw = require("jsonwebtoken");
const RepartidorController = require("../Controllers/RepartidorController");

router.put("/actualiza/:id", RepartidorController.actualizaDatos);
router.delete("/deleteRepartidor/:id", RepartidorController.eliminarRepartidor);
router.get("/getDetalles/:id", RepartidorController.obtenerRepartidorById);
router.get(
  "/getObtenerSalidaxClienteId/:id",
  RepartidorController.getObtenerSalidaxClienteId
);

router.post("/crearRepartidores", RepartidorController.crearRepartidores);
router.post("/signIn", RepartidorController.Login);
router.get("/obtenerRepartidores", RepartidorController.getRepartidores);
module.exports = router;
