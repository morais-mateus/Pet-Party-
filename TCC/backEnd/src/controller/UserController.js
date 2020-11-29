
import User from "../models/User";
import Pet from "../models/Pet";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class UserController {

  async CriarUsuar(req, res) {

    try {

      const userExists = await User.findOne({ email: req.body.email });
      // valida se o email já estava cadastrado

      if (userExists) {
        return res.status(400).send({ error: "Email já cadastrado no Banco!" });
      }

      const { nome, email, cpf, descricao, user_cuidador, password, telefone, latitude, longitude, rua,numero,cep,cidade, estado, bairro } = req.body;
      const location = {
        type: 'Point',
        coordinates: [longitude, latitude],
      };
      const endereco =
      {
        rua,
        numero,
        cep,
        estado,
        bairro,
        cidade,
      };
      // criar usuário s
      const user = await User.create({
        nome,
        email,
        user_cuidador,
        cpf,
        password,
        telefone,
        location,
        descricao,
        endereco,
      })

      return res.json(user);
    } catch (err) {
      return res
        .status(400)
        .send({ error: "Falha ao Cadastrar Usuario" } + err);
    }
  }
  // METODO ATUALIZACAO DE DADOS
  async update(req, res) {
  try{
    const { id } = jwt.decode(req.header("token"));
    const user = await User.findById({_id: id});
    console.log(user);
    await user.updateOne(req.body);
    const retorno = await User.findById({_id:id});
    return res.json(retorno);
  } 
  catch (err) {
    return res
      .status(400)
      .send({ error: "Falha ao atualizar o  Usuario" } + err);
  }
  }

  async resetSenha(req,res){
    try {
      const { id } = jwt.decode(req.header("token"));
      const user = await User.findById({_id: id}).select('+password');
      console.log(user);
    // verificação da senha no banco
      const { oldpassword} = req.body;
      if (
        oldpassword &&
        !bcrypt.compareSync(req.body.oldpassword, user.password)
      ) {
          return res.status(400).json("Bad request. Password don't match ");
      }    
      // Transformando a nova senha em hash para enviar para o banco
      const salt = bcrypt.genSaltSync(10);
      const hash = await bcrypt.hash(req.body.password, salt);
      req.body.password = hash;
      await user.updateOne(req.body);
      return res.json("Senha Trocada!");
    } catch (error) {
      return res
      .status(400)
      .send({ error: "Falha ao Trocar a senha" } + error);
  }
    
   
  }


  // Buscando Infomações do Usuario
  async infoUser(req, res) {
    const { id } = jwt.decode(req.header("token"));
    console.log("ID-->" + id);
    const user = await User.findById(id);
    console.log("User-->" + user);
    return res.json(user);
  }


  async infoCuidador(req, res) {
    const id = req.header("_id");
    console.log(id);
    const user = await User.findById(id);
    const pets = await Pet.find({ id_dono: id });
    console.log("Cuidador" + user);
    return res.json({user,pets});
  }

}

export default new UserController();
