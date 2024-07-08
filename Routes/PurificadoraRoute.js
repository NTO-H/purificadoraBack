const express = require("express");

const router = express.Router();
const PurificadoraController = require('../Controllers/PurificadoraController');
router.post("/agregacionPurificadora",PurificadoraController.registroPurificadora);

router.post("/crearRuta/", PurificadoraController.registroRuta);
router.post("/addSalida/", PurificadoraController.addSalida);
router.post(
  "/crearPuntoCliente/:id",
  PurificadoraController.registroPuntoEntregaEnRuta
);

router.delete("/deleteRuta/:id", PurificadoraController.eliminarRuta);

router.delete(
  "/deletePuntoEntrega/:id",
  PurificadoraController.eliminarPuntoEntrega
);
router.get(
  "/getDetallesRutaById/:id",
  PurificadoraController.getDetalleRutaById
);
router.get("/getRutasSalidasXdia/", PurificadoraController.getObtenerRutasXdias);
router.get("/getPuricadoras", PurificadoraController.obtenePuricadoras);
router.get("/getRutas", PurificadoraController.obteneRutas);
router.delete(
  "/deletePurificadora/:id",
  PurificadoraController.eliminarPuricadora
);


router.put("/updateRuta/:id", PurificadoraController.actualizarRuta);

router.put("/updatePurificadora/:id",PurificadoraController.updatePurificadora);

module.exports = router;