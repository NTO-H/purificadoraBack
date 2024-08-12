const { Colonia, Municipios } = require("../Models/DireccionModel");
const { Usuario } = require("../Models/UsuarioModel");
const {Ruta}= require("../Models/RutaModel");

require("../Routes/DireccionRoute");
exports.getMunicipios = async (req, res) => {
  try {
    const municipios = await Municipios.find();
    res.json(municipios);
  } catch (error) {
    res.Colonia(500).json({ error: error.message });
  }
};

exports.getColonias = async (req, res) => {
  try {
    console.log("llego");
    const colonias = await Colonia.find();
    if (colonias.length === 0) {
      console.log("No se encontraron colonias");
    } else {
      console.log("Colonias encontradas:", colonias);
    }
    res.status(200).json(colonias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getColoniasByMunicipio = async (req, res) => {
  try {
    // const idMunicipio = req.params.id.toString();
   
    const colonias = await Colonia.find({ municipio: req.body.municipio });

    res.status(200).json(colonias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getColoniasByMunicipioByClientes = async (req, res) => {
  try {
    const municipio = req.body.municipio;
    console.log("Buscando colonias por municipio: ", municipio);

    // Obtén todas las colonias distintas para el municipio especificado
    const colonias = await Usuario.distinct('colonia', { municipio });

    // Filtra las colonias excluyendo aquellas donde todos los usuarios ya están asignados a rutas
    const coloniasDisponibles = [];

    for (const colonia of colonias) {
      const usuariosEnColonia = await Usuario.find({ municipio, colonia }).select('_id');

      const usuariosIds = usuariosEnColonia.map(usuario => usuario._id);

      // Verifica si hay algún usuario en esta colonia que no esté asignado a una ruta
      const rutasConUsuarios = await Ruta.find({ 'puntosDeEntrega.clienteId': { $in: usuariosIds } });

      const usuariosAsignadosIds = rutasConUsuarios.flatMap(ruta => ruta.puntosDeEntrega.map(entrega => entrega.clienteId));

      const usuariosNoAsignados = usuariosIds.filter(id => !usuariosAsignadosIds.includes(id.toString()));

      // Si hay usuarios no asignados en esta colonia, se considera disponible
      if (usuariosNoAsignados.length > 0) {
        coloniasDisponibles.push(colonia);
      }
    }

    console.log("Colonias disponibles: ", coloniasDisponibles);
    res.json({ colonias: coloniasDisponibles });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las colonias', error });
  }
};
// exports.getColoniasByMunicipioByClientes = async (req, res) => {
//   // console.log("llego");
//   try {
//     const municipio = req.body.municipio;
//     console.log("Buscando colonias por municipio: ", municipio)
//     // Encuentra usuarios por municipio y extrae las colonias
//       // Obtén las colonias distintas para el municipio especificado
//     const colonias = await Usuario.distinct('colonia', { municipio: req.body.municipio });
    
//     console.log("colonias encontradas: ", colonias);
//     // Extrae colonias únicas
//     // const colonias = [...new Set(usuarios.map(user => user.colonia))];
    
//     res.json({ colonias });
//   } catch (error) {
//     res.status(500).json({ message: 'Error al obtener las colonias', error });
//   }
// };

exports.getClientesByColoniaMunicipio = async (req, res) => {
  try   {
    const { colonia, municipio } = req.params;

    // Validar parámetros
    if (!colonia || !municipio) {
      return res.status(200).json({ error: "Faltan parámetros de consulta" });
    }

    // Consulta en la base de datos
    const clientes = await Usuario.find({ colonia, municipio });

    // Enviar respuesta
    res.json(clientes);
  } catch (error) {
    console.error("Error al consultar clientes:", error);
    res.status(500).json({ error: "Error al consultar clientes" });
  }
};

// Ruta para obtener colonias por nombre de municipio
// router.get('/colonias/:municipio', async (req, res) => {
//   try {
//     const municipio = req.params.municipio;
//     const colonias = await Colonia.find({ municipio: municipio });

//     if (colonias.length === 0) {
//       return res.status(404).json({ message: "No se encontraron colonias para este municipio." });
//     }

//     res.json(colonias);
//   } catch (error) {
//     res.status(500).json({ message: "Error al obtener las colonias", error });
//   }
// });


exports.getClientesByColonia = async (req, res) => {
  try {
    const { municipio, colonia } = req.query;

    // Validar parámetros
    if (!municipio || !colonia) {
      return res.status(200).json({ error: "Faltan parámetros de consulta" });
    }

    // Consulta en la base de datos
    const clientes = await Usuario.find({ municipio, colonia });
  
  
    //
    // Enviar respuesta ddddh [[dnnn]]
    res.status(200).json(clientes);
  } catch (error) {
    console.error("Error al consultar clientes:", error);
    res.status(500).json({ error: "Error al consultar clientes" });
  }
};
