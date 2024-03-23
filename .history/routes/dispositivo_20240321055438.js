// rutas para producto
const express = require("express");
const router = express.Router();
const dispositivoController = require('../controllers/dispositivoController');
//api/producto
// router.put('/cambiarEstadoLed',dispositivoController.actualizaEstadoLed)
router.get('/obtenerEstadoLed',dispositivoController.estadoled)                            
router.get('/obtenerEstadoValancin',dispositivoController.estadoValancin)
router.get('/obtenerEstadoCarrucel',dispositivoController.estadoCarrucel)
router.put('/cambiarEstadoLed', dispositivoController.actualizaEstadoLed);
router.put('/cambiarEstadoCarrucel', dispositivoController.actualizaEstadoCarrucel);
router.put('/cambiarEstadoValancin', dispositivoController.actualizaEstadoValancin);
router.put('/cambiarEstadoMusica', dispositivoController.actualizaEstadoMusuca);
router.get('/', dispositivoController.obtenerDispositivos);

module.exports=router;
