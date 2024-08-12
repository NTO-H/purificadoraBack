    const express = require("express");
    const router = express.Router();
    // const { guardarEntrega } = require("../controllers/entregaController");
    const entregaController = require("../controllers/entregaController");

    // Ruta para guardar una nueva entrega
    router.post("/", entregaController.guardarEntrega);

    module.exports = router;
