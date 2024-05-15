const express = require('express');
const conectarDB = require('./config/conexion');
const cors = require('cors');

// creamos el servidor
const app = express();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// conectamos a la base de datos
conectarDB();

const corsOptions = {
    origin: [ 'https://purificadora.vercel.app', 'http://localhost:4200' ],  // Lista de URLs permitidas
    credentials: true,
};










app.use(cookieParser());
app.use(cors(corsOptions));
app.use(bodyParser.json());


// Rutas
app.use("/purificadoraAdmin", require("./routes/purificadoras"));
app.use('/usuarios', require('./routes/usuario'));
app.use("/purificadoraRepartidores", require("./routes/repartidores"));
// Puerto de escucha
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log("El servidor está corriendo perfectamente en el puerto", PORT);
});
