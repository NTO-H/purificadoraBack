const express = require("express");

const router = express.Router();
const purificadoraController = require("../controllers/purificadoraController");

router.post(
  "/agregacionPurificadora",
  purificadoraController.registroPurificadora
);

router.get("/getPuricadoras", purificadoraController.obtenePuricadoras);
router.delete("/deletePurificadora/:id",purificadoraController.eliminarPuricadora);
router.put("/updatePurificadora/:id",purificadoraController.updatePurificadora);

module.exports = router;
