import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import CardCentral from '../../components/CardCentral/index';
import FormHeader from '../../components/FormHeader/index';
import Input from '../../components/Input/index';
import Button from '../../components/Button/index';
import DivAviso from '../../components/DivAviso/index';

import api from "../../services/api";

import "./styles.css";
import PageHeader from "../../components/PageHeader";

export default function Login() {

  const [lembrarUser, setLembrarUser] = useState(localStorage.getItem("lembrarUser") === "true")
  const [pass, setPassword] = useState("");
  const [email, setEmail] = useState(lembrarUser ? localStorage.getItem("email") : "");
  const [catchError, setCatchError] = useState(false);

  const history = useHistory();

  async function handleLogin(e) {
    e.preventDefault();
    
    const credenciais = { email, pass };

    try {
      setCatchError(false);
      const response = await api.post("login", credenciais);

      const { token } = response.data;
      sessionStorage.setItem('token', token);
      if(lembrarUser) {
        localStorage.setItem("email", email);
      }

      setTimeout(() => {
			}, 2000);

      history.push("/dashboard");
    } catch (error) {
      setCatchError(true);
      setTimeout(() => {
				setCatchError(false);
			}, 4000);
    }
  }

  function setLembrarUserStorage(value) {
    localStorage.setItem("lembrarUser", value)
    setLembrarUser(value)
    if(!value) {
      localStorage.removeItem("email")
    }
  }
  //

  return (
    
    <main>
      <PageHeader button1="Sobre" button2="Contato" button3="Cadastrar"
            link1="/about" link2="/contact" link3="/register"/>
      <CardCentral>
        <form className="form-auth" onSubmit={handleLogin}>
          <FormHeader nomeArea="Login">
            <DivAviso.erro value={catchError} text="Email ou senha estão incorretos"/>
          </FormHeader>
          <Input.text value={email} onChange={e => setEmail(e.target.value)} type="text" placeHolder="Email" />
          <Input.text value={pass} onChange={e => setPassword(e.target.value)} type="password" placeHolder="Senha"/>
          <div className="grid">
            <div>
              <input checked={lembrarUser} id="lembrarUsuario" type="checkbox" name="lembrarUsuario" onClick={e => setLembrarUserStorage(e.target.checked)}/>
              <label htmlFor="lembrarUsuario">Lembrar email</label>
            </div>
            <div>
              <a className="a-auth" href={"/remember"}>Esqueceu a senha?</a>
            </div>
          </div>
          <div className="grid">
            <Button.secundario type="button" name="cadastrar" text="Cadastrar" href={"/register"}/>
            <Button.principal type="submit" name="enviar" text="Entrar"/>
          </div> 
        </form>
      </CardCentral>
    </main>
  );
}
