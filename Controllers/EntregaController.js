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
        console.log(idPurificadora)
        const nuevaEntrega = new Entrega({ idPurificadora });
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

