const express = require("express");

const router = express.Router();
const purificadoraController = require("../controllers/purificadoraController");
router.post(
  "/agregacionPurificadora",
  purificadoraController.registroPurificadora
);

router.post("/crearRuta/", purificadoraController.registroRuta);

router.delete("/deleteRuta/:id", purificadoraController.eliminarRuta);
router.get("/getDetallesRutaById/:id", purificadoraController.getDetalleRutaById);

router.get("/getPuricadoras", purificadoraController.obtenePuricadoras);
router.get("/getRutas", purificadoraController.obteneRutas);
router.delete("/deletePurificadora/:id",purificadoraController.eliminarPuricadora);

router.put("/updatePurificadora/:id",purificadoraController.updatePurificadora);

module.exports = router;
