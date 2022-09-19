require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cargouber.zqcvgga.mongodb.net/Shipping?retryWrites=true&w=majority`;

const {authRouter} = require('./routers/authRouter');
const {usersRouter} = require('./routers/usersRouter');
const {trucksRouter} = require('./routers/trucksRouter');
const {loadsRouter} = require('./routers/loadsRouter');
const {appRouter} = require('./routers/appRouter');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(morgan('tiny'));
app.use(express.static('public'));

app.use('/', appRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/trucks', trucksRouter);
app.use('/api/loads', loadsRouter);

app.set('view engine', 'ejs');
app.set('views', './src/views');

(async () => {
    try {
        const port = process.env.PORT || 3000;
        await mongoose.connect(uri);
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`)
        });
    } catch (err) {
        console.log(`Error on server startup: ${err}`);
    }
})();