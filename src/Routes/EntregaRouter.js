    const express = require("express");
    const router = express.Router();
    // const { guardarEntrega } = require("../controllers/entregaController");
    const entregaController = require("../Controllers/EntregaController");

    // Ruta para guardar una nueva entrega
    router.post("/", entregaController.guardarEntrega);
    router.get("/:idPurificadora", entregaController.guardarEntregaByIdPurificadora);
    // return this.http.get(`${environment.api}/entrega/entregas`+idPurificadora);

    module.exports = router;
