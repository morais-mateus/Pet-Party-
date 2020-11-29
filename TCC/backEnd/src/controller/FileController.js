import User from "../models/User";
import Pet from "../models/Pet";
import jwt from "jsonwebtoken";
import PetController from "./PetController";
let user ;
class FileController {
  
  async store(req, res) {

    try{
    const { id } = jwt.decode(req.header("token"));
    const { originalname: name, filename: path } = req.file;
    const update =  {avatar:{nome: name, path}};
    await User.updateOne({_id:id},update);
    
    //teste
    console.log(await User.find({ _id: id }));
    return res.json("Foto Atualizada!");
    }
    catch (error){
      return res.status(400).json('Erro ao subir a imagem' + error);
    }
   

  
}


}

export default new FileController();
