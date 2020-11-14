import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Cadastro from "./pages/Cadastrar";
import Profile from "./pages/Profile";
import Pets from "./pages/Pets";
import EsqueceuSenha from "./pages/EsqueceuSenha";
import Landing from './pages/Landing';
import TeacherList from './pages/TeacherList';

import Header from './pages/common/template/header';

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/landing" exact component={Landing} />
        <Route exact path="/study" component={TeacherList} />
        <Route exact path="/register" component={Cadastro} />
        <Route exact path="/remember" component={EsqueceuSenha} />
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/profile" component={Profile} />
        <Route exact path="/profile/:id" component={Profile} />
        <Route exact path="/pets" component={Pets} />
      </Switch>
    </BrowserRouter>
  );
}
