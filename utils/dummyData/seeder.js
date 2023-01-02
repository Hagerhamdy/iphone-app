const fs = require('fs');
require('colors');
const dotenv = require('dotenv');

const ProductModel = require('../../models/productModel');
const dbConnection = require('../../config/db');

dotenv.config({ path: '../../config.env' });
dbConnection();

const products = JSON.parse(fs.readFileSync('./products.json'));

//insert products from dummy data
const insertData = async () => {
    try {
        await ProductModel.create(products);
        console.log('Products inserted'.green.inverse);
        process.exit();
    } catch (err) {
        console.log(err)
    }
}

//delete all products from dummy data
const deleteData = async () => {
    try {
        await ProductModel.deleteMany();
        console.log('Products deleteed'.red.inverse);
        process.exit();
    } catch (err) {
        console.log(err)
    }
}

//run node seeder.js -i or id
if (process.argv[2] === '-i') {
    insertData();
} else if (process.argv[2] === '-d') {
    deleteData();
}