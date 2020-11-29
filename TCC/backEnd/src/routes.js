import { Router } from "express";
import multer from "multer";
import authMiddleware from "./middlewares/auth";
import multerConfig from "./config/multer";


import PetController from "./controller/PetController";
import UserController from "./controller/UserController";
import SessionController from "./controller/SessionController";
import FileController from "./controller/FileController";
import ProviderController from "./controller/ProviderController";



const routes = new Router();
const upload = multer(multerConfig);


routes.post("/user/create", UserController.CriarUsuar);
routes.post("/login", SessionController.store);
routes.post("/resetPassword", SessionController.resetPassword);
routes.post("/forgot", SessionController.forgotPassword);


routes.get("/userQtd", SessionController.QtdUser);

routes.get("/info", UserController.infoUser);
routes.get("/info/cuidador",UserController.infoCuidador);

//PET
routes.get("/pets", PetController.index);
routes.post("/pet/create", PetController.store);
routes.put("/pet/update", PetController.update);
routes.delete("/pet/delete", PetController.delete);

// Pesquisa
routes.get("/searchProviders", ProviderController.index);
routes.get("/endereco", ProviderController.maps);

//routes.use(authMiddleware); // midleware de verificação do token do usuario 
//todas as rotas que estão abaixo passará pela autenticação

routes.get("/providers", ProviderController.mostrarCuidadores);
routes.put("/user/update", UserController.update);
routes.put("/user/update/password", UserController.resetSenha);
routes.post("/files", upload.single("file"), FileController.store);

export default routes;
