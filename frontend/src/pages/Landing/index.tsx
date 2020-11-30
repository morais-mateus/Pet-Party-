import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom'
import api from '../../services/api';

import logoImg from '../../assets/images/Logopet.png';
import landingImg from '../../assets/images/logosempp.png';

import loginIcon from '../../assets/images/icons/entrar.svg';
import addUserIcon from '../../assets/images/icons/adduser.svg';
import redHeartIcon from '../../assets/images/icons/red-heart2.png';

import './styles.css';
import PageHeader from '../../components/PageHeader';


function Landing(){
    const [totalConnections, setTotalConnections] = useState(0);

  
    useEffect(() => {
        api.get("userQtd").then(response => {
            setTotalConnections(response.data);
        })
      }, [])

    return (
     <div id="page-landing">
         <header>
        <Link to="/about">Sobre</Link>
        <Link to="/contact">Contato</Link>
         </header>
         <div id="page-landing-content" className="container">
             <div className="logo-container">
                 <img src={logoImg} alt="PetParty"/>
                 <h2> O lugar onde nenhum pet fica de fora da festa!</h2>
             </div>

             <img 
                src={landingImg} 
                alt="Plataforma de auxilio" 
                className="hero-image"/>

            <div className="buttons-container">
                <Link to="/login" className="login">
                    <img src={loginIcon} alt="Entrar"/>
                    Entrar
                </Link>

                <Link to="/register" className="register">
                    <img src={addUserIcon} alt="Cadastrar"/>
                    Cadastrar
                </Link>
                
            </div>

            <span className="total-connections">
                 Um total de {totalConnections} usuários cadastrados  <img src={redHeartIcon} alt="Coração roxo"/>

            </span>
         </div>
     </div>  
    )
}

export default Landing