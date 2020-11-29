const mongoose = require("../database");
const bcrypt = require("bcryptjs");

const AgendamentoSchema = mongoose.Schema(
  {
    data: {
      allowNull:false,
      type: Date,
    },  
    id_usuario:{
      type: String,
    },
    id_prestador:{
      type:String,
    },
    created_at: {
      type: Date,
      default: Date.now
    },
    updated_at: {
      type: Date,
      default: Date.now
    },

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

AgendamentoSchema.virtual("url").get(function() {
  console.log("teste"); 
 
});

// transformando a senha do usuario em hash antes de enviar para o banco

const AgendamentoModel = mongoose.model("tb_agendamento",AgendamentoSchema);
export default AgendamentoModel;
