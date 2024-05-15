const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
const jw=require('jsonwebtoken');
const repartidoresController=require('../controllers/repartidoresController');

router.post('/crearRepartidores',repartidoresController.crearRepartidores);
router.post('/signIn',repartidoresController.Login);

module.exports=router;
