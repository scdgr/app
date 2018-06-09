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


sequelize.authenticate().then(() => {
    console.log("Contectou");
}).catch(err => {
    console.error("Não conectou. ", err);
})


var Servers = sequelize.define('Servers', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    server_id: {
        type: Sequelize.STRING,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

Servers.sync()


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




    app.route('/servers')
        .get((req, res) => {
            Servers.findAll().then(servers => {
                res.send(servers);
            }).catch(error => {
                res.status(412).json({ msg: error.message })
            })
        })
        .post((req, res) => {
            Servers.create(req.body).then(result => {
                res.json(result);
            }).catch(error => {
                res.status(412).json({ msg: error.message })
            })
        })
}
