const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
const jw=require('jsonwebtoken');
const repartidoresController=require('../controllers/repartidoresController');


router.put("/actualiza/:id", repartidoresController.actualizaDatos);
router.delete("/deleteRepartidor/:id", repartidoresController.eliminarRepartidor);
router.get("/getDetalles/:id", repartidoresController.obtenerRepartidorById);

router.post('/crearRepartidores',repartidoresController.crearRepartidores);
router.post('/signIn',repartidoresController.Login);
router.get("/obtenerRepartidores", repartidoresController.getRepartidores);
module.exports=router;
