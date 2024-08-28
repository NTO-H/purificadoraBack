const express = require("express");
const conectarDB = require("./Server/Conexion");
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
    "https://fd1v4w8b-4200.usw3.devtunnels.ms/",
    // "http://192.168.0.114:4200",
  ],
  credentials: true,
};

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(bodyParser.json());
// Rutas padres

// Ruta para inicio de sesión
app.use("/autentificacion", require("./Routes/AuthRoute"));
// Ruta para acciones con rol de Administrador de la pagina
app.use("/adminPage", require("./Routes/PrivadoRoute"));
// Ruta para acciones con rol de Administrador
app.use("/purificadoraAdmin", require("./Routes/PurificadoraRoute"));
// Ruta para acciones con rol de Administrador
app.use("/usuarios", require("./Routes/UsuarioRoute"));
// Ruta para acciones con rol de Administrador
app.use("/direccion", require("./Routes/DireccionRoute"));
// Ruta para acciones con rol de Administrador
app.use("/vehiculos", require("./Routes/VehiculoRoute"));
// Ruta para acciones con rol de Reparitor
app.use("/purificadoraRepartidores", require("./Routes/RepartidorRoute"));
app.use("/ruta", require("./Routes/RutaRoute"));
app.use("/salidas", require("./Routes/SalidaRouter"));
app.use("/entrega", require("./Routes/entregaRouter"));

module.exports = app;
