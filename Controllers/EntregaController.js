// const { Entrega } = require("../models/Entrega");
const { Entrega } = require("../Models/EntradaModel");

exports.guardarEntrega = async (req, res) => {
    try {
        const nuevaEntrega = new Entrega(req.body);
        const entregaGuardada = await nuevaEntrega.save();
        res.status(201).json({
            mensaje: "Entrega guardada exitosamente",
            entrega: entregaGuardada
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al guardar la entrega",
            error: error.message
        });
    }
};
exports.guardarEntregaByIdPurificadora = async (req, res) => {
    try {
        const idPurificadora = req.params.idPurificadora;
        console.log(idPurificadora);

        // Buscar todas las entregas correspondientes al idPurificadora
        const resultado = await Entrega.find({ idPurificadora: idPurificadora }).populate("repartidorId")
            .populate("vehiculoId")
            .populate("puntosDeEntrega.clienteId");;

        // Devolver el resultado como un arreglo
        res.status(200).json(resultado);

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener las entregas",
            error: error.message
        });
    }
};
