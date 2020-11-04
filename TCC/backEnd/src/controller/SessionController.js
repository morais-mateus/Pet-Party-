import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import authConfig from "../config/auth";
import User from "../models/User";
import crypto from "crypto";
import mailer from "../config/mailer";

class SessionController {

  // LOGIN
  async store(req, res) {

    const { email, pass } = await req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(400).json({ error: "Email não cadastrado!" });
    }

    //cryptografa a senha que o usuario digitou e compara com a do usuario

    let result = bcrypt.compareSync(pass, user.password);

    if (!result) {
      return res.status(400).json("Senha invalida! ");
    }
    const { id, nome } = user;
    return res.json({
      user: {
        id,
        nome,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret),
    });
  }
  // ESQUECI A SENHA
  async forgotPassword(req, res) {
    const { email } = req.body;
    const emailreset = await User.findOne({ email });

    console.log("result -->" + emailreset);

    try {
      if (!emailreset) {
        return res.status(402).json({ error: " Email Invalido" });
      } else {
        const token = crypto.randomBytes(3).toString("hex");

        // tempo de expiração do token de recuperacao;
        const now = new Date();
        console.log("hora atual" + now.getHours());
        now.setHours(now.getHours() + 1);
        console.log("" + now);
        var _id = emailreset._id;
        const update = { passwordresetoken: token, passwordresetexpires: now };
        const filter = { _id };
        await User.updateOne(filter, update);

        const mail = await mailer.sendMail(
          {
            to: email,
            subject: " Esqueceu a sua Senha ?",
            template: "auth/forgot_password",
            context: { token },
          },
          (err) => {
            if (err)
              res.status(400).json({ error: " Error ao enviar o email" + err });
            else {
              return res.status(200).json({ error: " Email Enviado!" + err });
            }
          }
        );
        console.log(mail);
      }
    } catch (error) {
      return res
        .status(400)
        .send({ error: "Erro ao recuperar a senha" } + error);
    }
  }
  // RESET PASSWORD
  async resetPassword(req, res) {
    const { email, token, password } = req.body;

    try {
      const user = await User.findOne({ email }).select(
        "+passwordresetoken passwordresetexpires"
      );

      if (!user) {
        return res.status(400).json({ error: "Email não cadastrado!" });
      }

      if (token !== user.passwordresetoken)
        return res.status(400).send({ error: " Tokenee invalido!" });

      const now = new Date();

      if (now > user.passwordresetexpires)
        return res
          .status(400)
          .send({ error: " Token expirado, favor fazer uma nova requisição" });

      user.password = password;

      await user.save();
      res.send();
    } catch (err) {
      return res.status(400).json({ error: "Error ao resetar a senha " } + err);
    }
  }


  // LOGIN
  async QtdUser(req, res) {

    try {
      const qtd = await User.find().countDocuments();
      return res.json(qtd);
      
    } catch (err) {
      return res.json(103);
    }
  }




}

export default new SessionController();
