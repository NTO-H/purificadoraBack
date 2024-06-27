const express = require("express");
const conectarDB = require("./Config/Conexion");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
// creamos el servidor
const app = express();
// conectamos a la base de datos
conectarDB();
const corsOptions = {
  //Lista de URLs clientes permitidas
  origin: [
    "https://purificadora.vercel.app",
    "http://localhost:4200",
    "http://192.168.0.103:4000",
  ],
  credentials: true,
};

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(bodyParser.json());
// Rutas padres
app.use("/autentificacion", require("./Routes/AuthRoute"));
app.use("/purificadoraAdmin", require("./Routes/PurificadoraRoute"));
app.use("/usuarios", require("./Routes/UsuarioRoute"));
app.use("/vehiculos", require("./Routes/VehiculoRoute"));
app.use("/purificadoraRepartidores", require("./Routes/RepartidorRoute"));

module.exports = app;
