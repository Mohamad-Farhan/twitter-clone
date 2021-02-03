const mongoose = require("mongoose");
require('dotenv').config()

mongoose.set('useUnifiedTopology', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);

class Database {

    constructor(){
        this.connect();
    }
    connect() {
        mongoose.connect(process.env.DB)
            .then(() => {
                console.log("DB is connected :)");
            })
            .catch((err) => {
                console.log("DB is not connected :(" + err)
            })
    };
};

module.exports = new Database();