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
    "https://purificadoras.vercel.app",
    // "http://localhost:4200", //!prueba local
  ],
  credentials: true,
};

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(bodyParser.json());
// Rutas padres

// Ruta raíz que muestra "Hola Mundo"
app.get("/", (req, res) => {
  res.send("Hola Mundo 🎉");
});

app.use("/ruta", require("./Routes/RutaRoute"));
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
app.use("/salida", require("./Routes/SalidaRouter"));
app.use("/entrega", require("./Routes/EntregaRouter"));

module.exports = app;
