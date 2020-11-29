import User from "../models/User";
import jwt from "jsonwebtoken";
import axios from "axios";

class ProviderController {


  async mostrarCuidadores(req, res) {
    const teste = await User.find({ user_cuidador: true }).select(['nome', 'email', 'url', 'avatar']);
    return res.json(teste);
  }

  async index(req, res) {
    const { id } = jwt.decode(req.header("token"));
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
        List.push({ "nome": providersList[i].nome, "km": numero, "_id": providersList[i]._id, "url": providersList[i].url, "telefone": providersList[i].telefone,"coordinates": providersList[i].location });
      }
     
     console.log(providersList[0]._id, "--", id);
     
      if( providersList[0]._id == id) {
          List.shift();
          console.log("removido o primeiro ");
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

  async maps(req, res) {
    try {
      const end = req.header("endereco");
      const apiResponse = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${end}&key=AIzaSyBTiJt25rmCY2qjSzNaZ1t3XM34HrZJ-i0`);
      const {results} = apiResponse.data;
      return res.json(results);
   
    } catch (err) {
      return res.json("Nao foi possivel realizar o calculo no maps");
    }
  }
  



}


export default new ProviderController();
