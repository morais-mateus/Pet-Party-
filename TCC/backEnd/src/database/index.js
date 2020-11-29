const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://user:user@petpartycluster-wf3sj.mongodb.net/test?retryWrites=true&w=majority',{useNewUrlParser: true,useUnifiedTopology: true,autoIndex: false, useFindAndModify: false  });

mongoose.Promise = global.Promise;

module.exports = mongoose;