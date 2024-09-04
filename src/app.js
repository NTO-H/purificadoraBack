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
// const path = require('path')
// app.use(express.json())
const webpush = require('web-push');
const vapidKeys = {
  "publicKey": "BPqUE0OuQtFwPMDzFFttBK-aM3oJePkk_vsQ0OPmRQVJwWYQY1gq1U7mxFPRuSUR85rwBiU1ynfCsExlCIt40fk",

  "privateKey": "UJjeVqP6X5M9EyNLILT4dxYG1TAz2yCaWfBwkOFr2io"
}


webpush.setVapidDetails(
  'mailto:20221136@uthh.edu.mx',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);


const enviarNotification = async (req, res) => {
  const pushSubscription = {
    endpoint: "https://fcm.googleapis.com/fcm/send/cG9WhFIPP3A:APA91bFZ5N5SGliIWMF3wjQdoUdXEgCduuLr2-GUXEan--zTbDbDGxvyzuc0yed1yYlxIXXTpU3_Q810k_n54ATbNpu-ux87i4c2_tq98UNIRDPGhKp6e8RyWXc7EGSgpXOEsTsgfkxL",
    keys: {
      "p256dh": "BFYNEZ1MT-60MYXrHCw5yV5VpwRiwssxn6XBm_uYm3voHIgChwKvdOAejTAn3ICbSxM7jzb__PXmVeaq5t1W2Uw",
      "auth": "WYqIQk0zn75glwwdWzPR4w"
    }
  };
  const payload = {
    notification: {
      title: "¡Nuevas ofertas disponibles!",
      body: "Haz clic para ver las últimas ofertas en nuestro sitio.",
      image: "https://logowik.com/content/uploads/images/angular-new6082.logowik.com.webp",
      actions: [
        { action: "view_offers", title: "Ver ofertas" },
        { action: "dismiss", title: "Descartar" }
      ],
      vibrate: [100, 50, 100]
    }
  };

  try {
    const response = await webpush.sendNotification(pushSubscription, JSON.stringify(payload));
    console.log('Notification sent successfully');
    res.status(200).send('Notification sent successfully');
  } catch (err) {
    console.error('Error sending notification', err);
    res.status(500).send('Error sending notification');
  }
};

app.route('/api/v1/enviar-notification').post(enviarNotification);



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
