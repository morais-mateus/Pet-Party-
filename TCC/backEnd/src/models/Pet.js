const mongoose = require("../database");
const bcrypt = require("bcryptjs");

const PetSchema = mongoose.Schema(
  {
    nome: {
      type: String,
      require: true
    },
    id_dono: {
      type: String,
      require: true
    },
    idade:{
      type: String,
      require:true
    },  
    tipo_pet:{
      type:String,
      require:true
    },
    porte:{
      type: String
    },
    raca:{
      type: String
    },
    avatar: {
      nome: {
        type: String,
        default: "defaultpet.png"
      },
      path: { type: String, default: "defaultpet.png" }
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    toObject: {
      getters: true,
      setter: true,
      virtuals: true
    },
    toJSON: {
      getters: true,
      setter: true,
      virtuals: true
    }
  }
);

PetSchema.virtual("url").get(function () {
  return `http://localhost:3333/files/${this.avatar.path}`;
});



const PetModel= mongoose.model("tb_pet", PetSchema);
export default PetModel;
