const express = require('express')


const router = express.Router()
const purificadoraController=require("../controllers/purificadoraController")





router.post("/agregacionPurificadora",purificadoraController.registroPurificadora
);

module.exports = router;

