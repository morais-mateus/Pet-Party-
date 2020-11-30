import React, { useState } from 'react';
import './styles.css';

const FormHeader = (props) => {
    return(
        <header className="cabecalho-formulario">
            <p>{props.nomeArea}</p>
            <hr className="hr-formulario"/>
            {props.children}
        </header>
    );
}

export default FormHeader;