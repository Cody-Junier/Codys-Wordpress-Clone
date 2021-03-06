const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const app = express();
const PORT = process.env.PORT || 3002;
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const helpers = require('./utils/helpers');

const sess = {
    secret: 'Super secret secret',
    // ends session after 1 minute, set at 1 minute for testing purposes
    cookie: {
        maxAge:60000
    },
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};
app.use(session(sess));
const hbs = exphbs.create({ helpers });

// using handlebars
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
const routes = require('./controllers');
app.use(routes);


sequelize.sync({ force: false}).then(() =>{
    app.listen(PORT, () => console.log('Now listening'));
});