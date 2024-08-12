const express = require("express");

const router = express.Router();
const PurificadoraController = require("../Controllers/PurificadoraController");

// crear salida
router.post("/salida/", PurificadoraController.addSalida);
// actualiza el estado de la salida actual
router.put("/salida/:id", PurificadoraController.updateSalida);
// agregar nuevo cliente en la ruta con relacion muchos(clientes) a uno(ruta) por id de ruta
// actualiza el estado de la salida actual
router.put("/salidacantidad/", PurificadoraController.updateSalidaCantidad);
// agregar nuevo cliente en la ruta con relacion muchos(clientes) a uno(ruta) por id de ruta
router.post("/cliente/:id", PurificadoraController.cliente);
// crear ruta
router.post("/ruta/", PurificadoraController.crearRuta);
// eliminar una ruta regitrada
router.delete("/ruta/:id", PurificadoraController.eliminarRuta);
// eliminar el cliente en la ruta con relacion muchos(clientes) a uno(ruta) por id de ruta y cliente
router.delete("/clienteRuta/:id", PurificadoraController.deleteClientRute);
//obtener los detalles de una ruta por id
router.get("/ruta/:id", PurificadoraController.getDetalleRutaById);
// obtener todas rutas regitradas
router.get("/rutas", PurificadoraController.obteneRutas);
// actualizar ruta por id
router.put("/ruta/:id", PurificadoraController.actualizarRuta);
// obtener salidas o rutas por dia actual ,aplica la logica de la conducional if-else,
router.get("/salidaActual/", PurificadoraController.getObtenerRutasXdia);
// obtener los clientes disponibles para ser agregados a una ruta
router.get("/clientesDisponibles", PurificadoraController.getClienteDisponibles);
router.post("/clientesDisponiblesByColonia/", PurificadoraController.getClienteDisponiblesByColonia);
router.get("/diasDisponiblesByRuta/:id", PurificadoraController.getDiasDisponibles);
// obtener los repartidores y vehiculos disponibles para ser agregados a una salida
router.get("/repartidoresYvehiculosDisponibles/", PurificadoraController.RepartidoresyVehículosDisponibles);


router.get("/byRepartidor/:id", PurificadoraController.getRutasPorRepartidor);
router.get("/byVehiculo/:id", PurificadoraController.getRutasPorVehiculo);

router.put("/salidaEstado/:id", PurificadoraController.updateEstadoSalida);

router.get("/purificadoras/", PurificadoraController.obtenePuricadoras);

router.delete(
  "/deletePurificadora/:id",
  PurificadoraController.eliminarPuricadora
);

router.put(
  "/updatePurificadora/:id",
  PurificadoraController.updatePurificadora
);

module.exports = router;
