const bodyParser = require('body-parser');
const Sequelize = require('sequelize');


config = {
    database: 'bot',
    username: '',
    password: '',
    params: {
        dialect: 'sqlite',
        storage: 'db.sqlite',
        define: {
            underscored: true
        }
    }
}

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config.params
)

const servers = require('./routes/servers.js');
sequelize.authenticate().then(() => {
    console.log("Contectou");
}).catch(err => {
    console.error("Não conectou. ", err);
})

var db = {};

db.Servers = sequelize.define('Servers', {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        primarykey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

db.TempChannles = sequelize.define('TempChannel', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    channel_id: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    channel_name: {
        type: Sequelize.STRING,
        allowNull: false,
    }
})

db.Servers.hasMany(TempChannles);
db.TempChannles.belongsTo(Servers);


module.exports = (app) => {
    app.set('json spaces', 2);
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use((req, res, next) => {
        res.header('Access-Contorl-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT PATCH, DELETE');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    })

    app.listen(3003, () => {
        console.log(`"API" listening on port: 3003...`);
    });
    servers(app);


}
