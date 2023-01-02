const mongoose = require('mongoose');

const dbConnection = () => {
    //connect to db
    mongoose.connect(process.env.MONGO_KEY)
        .then((conn) => {
            console.log(`db Connected : ${conn.connection.host}`);
        })
        // .catch((err) => {
        //     console.log(`db error : ${err}`);
        //     exit(1);
        // })
}

module.exports = dbConnection;