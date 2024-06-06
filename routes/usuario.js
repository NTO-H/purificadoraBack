const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
const jw=require('jsonwebtoken');
const usuarioController=require('../controllers/usuarioController');

router.get('/admin',usuarioController.adminRoute);
router.get('/cliente',usuarioController.clienteRoute);
router.put('/actualizaRol/:id',usuarioController.actualizaRolUsuario);
router.put('/actualiza/:id',usuarioController.actualizaDatos);
router.delete("/deleteCliente/:id", usuarioController.eliminarCliente);
router.get('/getDetalles/:id',usuarioController.obtenerUsuarioById)

// router.get('/getUserBy/:id',usuarioController.obtenerUsuarioById)

router.put('/actualizaxCorreo',usuarioController.actualizarPasswordxCorreo)
router.put('/actualizaxPregunta',usuarioController.actualizarPasswordxPregunta)
// router.delete("/deleteCliente/:id", usuarioController.eliminarCliente);
router.post('/token',usuarioController.BuscaUsuarioByToken)
router.get('/buscaUsuarioByCorreo/:correo',usuarioController.buscaUsuarioByCorreo)
router.post('/correo',usuarioController.BuscaUsuarioByCorreo)
router.get('/miPerfil/:correo',usuarioController.perfilUsuario)
router.get('/getUsuarios',usuarioController.obtenerUsuarios)
router.post('/respuesta',usuarioController.BuscaUsuarioByPreguntayRespuesta)
router.post('/signUp',usuarioController.crearUsuario);
router.post('/signIn',usuarioController.Login);
router.get('/',usuarioController.obtenerUsuarios);
module.exports=router;

