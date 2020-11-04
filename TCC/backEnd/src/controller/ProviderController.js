import User from "../models/User";

class ProviderController {


  async mostrarCuidadores(req, res) {
    const teste = await User.find({ user_cuidador: true }).select(['nome', 'email', 'url', 'avatar']);
    return res.json(teste);
  }

  async index(req, res) {

    try {

      const { latitude, longitude, distancia } = req.query;
      console.log(latitude, longitude);
      const providers = await User.find({
        user_cuidador: {
          $in: true,
        },
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
            $maxDistance: distancia,
          },
        },
      });

      var teste = calcKM(-23.944806,-46.855806,-23.9426486,-46.3285584);
      console.log("-->"+teste);

      let providersList = providers.slice()
      let List = [];
      for (var i = 0; i < providersList.length; i++) {
        let numero = parseInt(calcKM(latitude, longitude, providersList[i].location.coordinates[1], providersList[i].location.coordinates[0]));
        providersList[i].km = numero;
        List.push({ "nome": providersList[i].nome, "km": numero, "_id": providersList[i]._id, "url": providersList[i].url, "telefone": providersList[i].telefone });
      }
      return res.json(List);
    }

    catch (err) {
      return res
        .status(400)
        .send({ error: "Falha Buscar  Usuario" } + err);
    }



    // transformar em KM
    function calcKM(lat1, lon1, lat2, lon2) {
      var R = 6371; // km
      var dLat = toRad(lat2 - lat1);
      var dLon = toRad(lon2 - lon1);
      var lat1 = toRad(lat1);
      var lat2 = toRad(lat2);

      var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c;
      return d;
    }
    // Converts numeric degrees to radians
    function toRad(Value) {
      return Value * Math.PI / 180;
    }



  }







}


export default new ProviderController();