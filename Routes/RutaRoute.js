const express = require("express");

const router = express.Router();
const RutaController=require("../Controllers/RutaController");
// crear ruta


router.get("/:idPurificadora", RutaController.byIdPurificadora);
router.post("/", RutaController.crearRuta);
// eliminar una ruta regitrada
//obtener los detalles de una ruta por id
// obtener todas rutas regitradas
router.get("/", RutaController.obteneRutas);
router.get("/:id", RutaController.getDetalleRutaById);
// actualizar ruta por id
router.put("/:id", RutaController.actualizarRuta);
// eliminar el cliente en la ruta con relacion muchos(clientes) a uno(ruta) por id de ruta y cliente
router.delete("/clienteRuta/:id", RutaController.deleteClientRute);
router.delete("/ruta/:id", RutaController.eliminarRuta);
router.get("/byRepartidor/:id", RutaController.getRutasPorRepartidor);
router.get("/byVehiculo/:id", RutaController.getRutasPorVehiculo);

module.exports = router;
