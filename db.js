const mongoose = require("mongoose");

mongoose.set('useUnifiedTopology', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);

class Database {

    constructor(){
        this.connect();
    }
    connect() {
        mongoose.connect("mongodb+srv://Tetra:147258369@tetra-app.xqlnz.mongodb.net/Tetra?retryWrites=true&w=majority")
            .then(() => {
                console.log("DB is connected :)");
            })
            .catch((err) => {
                console.log("DB is not connected :(" + err)
            })
    };
};

module.exports = new Database();