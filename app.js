const express = require("express");
const conectarDB = require("./config/conexion");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
// creamos el servidor
const app = express();



// conectamos a la base de datos
conectarDB();

const corsOptions = {
  origin: ["https://purificadora.vercel.app", "http://localhost:4200"], // Lista de URLs permitidas
  credentials: true,
};

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Rutas padres
app.use("/purificadoraAdmin", require("./routes/purificadoras"));
app.use("/usuarios", require("./routes/usuario"));
app.use("/vehiculos", require("./routes/vehiculo"));
app.use("/purificadoraRepartidores", require("./routes/repartidores"));

module.exports=app;