const mongoose = require('mongoose');
mongoose.set("strictQuery", false);

const dbConnection = () => {
    //connect to db
    mongoose.connect(process.env.MONGO_KEY, { useNewUrlParser: true })
        .then((conn) => {
            console.log(`db Connected : ${conn.connection.host}`);
        })
        // .catch((err) => {
        //     console.log(`db error : ${err}`);
        //     exit(1);
        // })
}

module.exports = dbConnection;