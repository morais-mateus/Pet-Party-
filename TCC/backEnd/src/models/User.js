const mongoose = require("../database");
const bcrypt = require("bcryptjs");
const PointSchema = require ('../utils/PointSchema');
const UserSchema =  new mongoose.Schema(
  {
    nome: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
     descricao: {
      type: String,
    },
    telefone: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
   
    passwordresetoken: {
      type: String,
      select: true,
    },
    avatar: {
      nome: {
        type: String,
        default: "default.png",
      },
      path: { type: String, default: "default.png" },
    },
    passwordtokensexpires: {
      type: Date,
      select: false,
    },
    usuario_validado: {
      type: Boolean,
    },
    cpf: {
      type: String,
      required: true,
    },
    user_cuidador: {
      type: Boolean,
    },
    
    endereco: {
          rua: {
            type: String,
          },
          numero: {
            type: String,
          }, 
          cep: {
            type: String,
          },
          cidade: {
             type: String,
          },
          estado:{
            type: String,
          },
          bairro:{
            type: String,
          },
          


        },

    location:{
      type: PointSchema,
      index: '2dsphere',
  
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toObject: {
      getters: true,
      setter: true,
      virtuals: true,
    },
    toJSON: {
      getters: true,
      setter: true,
      virtuals: true,
    },
  }
);


UserSchema.virtual("url").get(function () {
  return `http://localhost:3333/files/${this.avatar.path}`;
});




// transformando a senha do usuario em hash antes de enviar para o banco

UserSchema.pre("save", async function (next) {
  const salt = bcrypt.genSaltSync(10);
  const hash = await bcrypt.hash(this.password, salt);
  this.password = hash;
  next();
});

const UserModel = mongoose.model("tb_users", UserSchema);
export default UserModel;
