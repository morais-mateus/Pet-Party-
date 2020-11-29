import User from "../models/User";
import jwt from "jsonwebtoken";

class MatchController {
 
 
  async Match(req, res) {
    let { id } = jwt.decode(req.header("token")); // pegando o token  do user vindo do header

    const { id_anfitriao, status } = await req.body;
    await User.updateOne(
      { _id: id },
      { $push: { matchId: { id_anfitriao, status } } }
    );
    
    await User.updateOne(
      { _id: id_anfitriao },
      { $push: { matchId: { id_anfitriao: id, status } } }
    );

    return res.json({ id, id_anfitriao });
  }

  async MatchPendentes(req, res) {
    const { id } = jwt.decode(req.header("token")); // pegando o token  do user vindo do header
    const user = await User.findOne({ _id: id });

    const { matchId } = await User.findById(id);

    return res.json(matchId);
  }

  async MatchRefuse(req, res) {
    const { id } = jwt.decode(req.header("token")); // pegando o token  do user vindo do header
    const { idUser, match } = await req.body;
    console.log(id);

    const newdata = {
      status: "Recusado",
    };

    await User.update(
      {
        _id: id,
        "matchId._id": match,
      },
      { $set: { "matchId.$": newdata } }
    );
    
    await User.update(
      {
        _id: idUser,
        "matchId.id_anfitriao": id,
      },
      { $set: { "matchId.$": newdata } }
    );

    // const user = await (await User.findOne({ _id: id }).select(['matchId']));

    return res.json("ok");
  }
}

export default new MatchController();
