import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import api from "../../services/api";

import CardCentral from '../../components/CardCentral/index';
import FormHeader from '../../components/FormHeader/index';
import Input from '../../components/Input/index';
import Button from '../../components/Button/index';
import DivAviso from '../../components/DivAviso/index';

import "./styles.css";

export default function EsqueceuSenha() {
	const [email, setEmail] = useState("");
	const [token, setToken] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const [validacaoEmail, setValidacaoEmail] = useState(true);
	const [validacaoPassword, setValidacaoPassword] = useState(true);
	const [validacaoConfirmPassword, setValidacaoConfirmPassword] = useState(true);
	const [catchSuccess, setCatchSuccess] = useState(false);
	const [catchError, setCatchError] = useState(false);
	const [catchErrorTrocaSenha, setCatchErrorTrocaSenha] = useState(false);
	
	const [emailEnviado, setEmailEnviado] = useState(false);

	const history = useHistory();

	async function enviarEmail(e) {
		e.preventDefault();

		if(validaEmail(email)) {
			let dados = { email };
			try {
				setCatchSuccess(false);
				const response = await api.post("forgot", dados);

				setCatchSuccess(true);
				setEmailEnviado(true);
				setTimeout(() => {
					setCatchSuccess(false);
				}, 4000);
			}
			catch(error) {
				setCatchError(true);
				setTimeout(() => {
					setCatchError(false);
				}, 4000);
			}
		}
		else if(email === '') {
			setCatchError(true);
			setTimeout(() => {
				setCatchError(false);
			}, 4000);
		}
	}

	async function trocarSenha(e) {
		e.preventDefault();

		let valida = true;
		valida = validaSenha(password) && valida;
		valida = validaConfirmSenha(password) && valida;

		if(valida) {
			let dados = { email, token, password };
			try {
				setCatchSuccess(false);
				setCatchError(false);
				const response = await api.post("resetPassword", dados);

				setCatchSuccess(true);
				setTimeout(() => {
					setCatchSuccess(false);
				}, 4000);
				history.push("/");
			}
			catch(error) {
				setCatchErrorTrocaSenha(true);
				setTimeout(() => {
					setCatchErrorTrocaSenha(false);
				}, 4000);
			}
		}
		else {
			setCatchError(true);
			setTimeout(() => {
				setCatchError(false);
			}, 4000);
		}
	}

	function validaEmail(email) {
		setValidacaoEmail(!!email.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi));
		if(email === '') return false;
		return validacaoEmail;
	}

	function validaSenha(password) {
		setPassword(password);
		validaConfirmSenha(password);
		setValidacaoPassword(!!password.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/));
		if (password === '') return false;
		return validacaoPassword;
	}
	
	function validaConfirmSenha(password) {
		setValidacaoConfirmPassword(confirmPassword === password);
		if (confirmPassword === '') return false;
		return validacaoConfirmPassword;
	}

	const TrocarSenhaStructure = () => {
		if(emailEnviado) {
			return(
				<>
					<Input.text type="text" value={token} onChange={e => setToken(e.target.value)} placeHolder="Token" />
					<Input.text type="password" value={password} validado={validaSenha} onBlur={e => validaSenha(password)} onChange={e => setPassword(e.target.value)} placeHolder="Nova senha" />
					<DivAviso.validacao value={!validacaoPassword && password !== ''} text="Sua nova senha deve ter no mínimo 8 caracteres, pelo menos 1 letra, 1 número e 1 caractere especial." />
					<Input.text type="password" value={confirmPassword} validado={validaConfirmSenha} onBlur={e => validaConfirmSenha(confirmPassword)} onChange={e => setConfirmPassword(e.target.value)} placeHolder="Confirmar nova senha" />
					<DivAviso.validacao value={!validacaoConfirmPassword && confirmPassword !== ''} text="Você deve digitar a mesma senha digitada no campo acima." />
				</>
			);
		}
		return <></> 
	}

	return (
		<main>
			<CardCentral>
				<form className="form-auth" onSubmit={!emailEnviado ? enviarEmail : trocarSenha}>
				<FormHeader nomeArea="recuperação de senha">
					<DivAviso.sucesso value={catchSuccess} text="Email enviado."/>
					<DivAviso.erro value={catchError} text={email === '' ? "Preencha os campos!" : "Este email não está registrado."}/>
					<DivAviso.erro value={catchErrorTrocaSenha} text={"Token inválido."}/>
				</FormHeader>
				<div className="descricao-formulario">
					<div>
						{!emailEnviado 
						? 
						'Para prosseguir por favor digite seu email no campo abaixo que enviaremos as instrucões para recuperação da sua senha'
						:
						'Preencha o campo Token com o valor enviado ao seu email'}
					</div>
				</div>
				<Input.text type="email" value={email} validado={validacaoEmail} onBlur={e => validaEmail(email)} onChange={e => setEmail(e.target.value)} placeHolder="Email" disabled={emailEnviado} />
				<DivAviso.validacao value={!validacaoEmail && email !== ''} text="Por favor, digite um email válido." />
				{!emailEnviado
				?
				<></>
				:
				<>
					<Input.text type="text" value={token} onChange={e => setToken(e.target.value)} placeHolder="Token" />
					<Input.text type="senha" value={password} validado={validaSenha} onBlur={e => validaSenha(password)} onChange={e => setPassword(e.target.value)} placeHolder="Nova senha" />
					<DivAviso.validacao value={!validacaoPassword && password !== ''} text="Sua nova senha deve ter no mínimo 8 caracteres, pelo menos 1 letra, 1 número e 1 caractere especial." />
					<Input.text type="confirmSenha" value={confirmPassword} validado={validaConfirmSenha} onBlur={e => validaConfirmSenha(confirmPassword)} onChange={e => setConfirmPassword(e.target.value)} placeHolder="Confirmar nova senha" />
					<DivAviso.validacao value={!validacaoConfirmPassword && confirmPassword !== ''} text="Você deve digitar a mesma senha digitada no campo acima." />
				</>}
				<div className="grid">
					<Button.secundario type="button" nome="voltar" text="Voltar" href={"/"}/>
					<Button.principal type="submit" name="enviar" text="Enviar"/>
				</div>
				</form>
			</CardCentral>
		</main>
	);
}
