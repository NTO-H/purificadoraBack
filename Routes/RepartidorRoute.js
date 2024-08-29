const express = require("express");
const router = express.Router();
const RepartidorController = require("../Controllers/RepartidorController");

router.post("/repartidor", RepartidorController.crearRepartidores);
// obenter clientes no regitradas en una ruta
router.get(
  "/repartidoresExRutas/",
  RepartidorController.obtenerRepartidoresSinRuta
);
router.put("/actualiza/:id", RepartidorController.actualizaDatos);
router.delete("/deleteRepartidor/:id", RepartidorController.eliminarRepartidor);
router.get("/getDetalles/:id", RepartidorController.obtenerRepartidorById);
router.get("/:idPurificadora", RepartidorController.repartidoresByIdP);
// router.get("/clientes/:id", RepartidorController.getClientes);
router.get(
  "/getObtenerSalidaxClienteId/:id",
  RepartidorController.getObtenerSalidaxClienteId
);

// router.get("/repartidores/:idPurificadora", PurificadoraController.puricadoraByid);


router.post("/signIn", RepartidorController.Login);
router.get("/repartidores", RepartidorController.getRepartidores);
module.exports = router;




