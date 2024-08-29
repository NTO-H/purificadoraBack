const express = require("express");
const router = express.Router();
const DireccionController = require("../Controllers/DireccionController");

router.get("/municipio/", DireccionController.getMunicipios);

router.get("/colonias/", DireccionController.getColonias);

router.post("/coloniasByMunicipio/", DireccionController.getColoniasByMunicipio);
router.post("/getColoniasByMunicipioByClientes/", DireccionController.getColoniasByPurificadoraByClientes);
// router.post("/getColoniasByMunicipioByClientes/", DireccionController.getColoniasByMunicipioByClientes);

router.get("/clientesByColonia/:id", DireccionController.getClientesByColonia);
router.get(
  "/clientesByColonia/:colonia/municipio/:municipio",
  DireccionController.getClientesByColonia
);

module.exports = router;
