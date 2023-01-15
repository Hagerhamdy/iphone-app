const path = require('path');

const express = require('express');
const cors = require('cors');
const compression = require('compression');
const dotenv = require('dotenv');
const morgan = require('morgan');


dotenv.config({ path: 'config.env' });
const { exit } = require('process');
const dbConnection = require('./config/db');

const ApiError = require('./utils/ApiError');
const globalError = require('./middlewares/GlobalErrorMiddleware');
const mountRoutes = require('./routers');
const {webhookCheckout} = require('./services/orderService');


//express app
const app = express();

//enable cors
app.use(cors());
app.options('*', cors()); //enable pre-flight 'edit image'

//compress all responses
app.use(compression());

//checkout webhook
app.post('/webhook-checkout', express.raw({ type: 'application/json' }), webhookCheckout)


//connect db
dbConnection();

//middlewares
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    console.log(`mode : ${process.env.NODE_ENV}`);
} else {
    console.log(`mode : ${process.env.NODE_ENV}`);
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'uploads')));

//Mount routes
mountRoutes(app);


app.all('*', (req, res, next) => {
    next(new ApiError(`Can't find this route ${req.originalUrl}`, 400))
})

//global error express handler
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(8000, () => {
    console.log(`app listening on port ${PORT}`);
})

process.on('unhandledRejection', (err) => {
    console.error(`UnhandledRejectin Errors ${err.message || err.name}`);
    server.close(() => {
        exit(1);
    });
})  