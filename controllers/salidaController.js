const { Salida } = require("../Models/SalidaModel");
const moment = require('moment'); // Asegúrate de haber instalado moment

exports.confirmarSalida = async (req, res) => {
    try {
        const { nombreRuta, fechaEntrada } = req.body;
        console.log(req.body);

        // Convertir la fechaEntrada de DD-MM-YYYY a formato correcto para comparación
        const fechaEntradaFormatted = moment(fechaEntrada, 'DD-MM-YYYY').format('DD-MM-YYYY');

        // Encuentra la Salida por nombreRuta y fechaEntrada y actualiza su estado a 'confirmado'
        const salidaActualizada = await Salida.findOneAndUpdate(
            { nombreRuta: nombreRuta, fechaSalida: fechaEntradaFormatted }, // Busca por nombreRuta y fechaSalida
            { estado: 'confirmado' },
            { new: true } // Esto devuelve el documento actualizado
        );

        if (!salidaActualizada) {
            return res.status(404).json({ mensaje: 'Salida no encontrada' });
        }

        res.json({ mensaje: 'Estado actualizado a confirmado', salida: salidaActualizada });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar el estado', error });
    }
};
