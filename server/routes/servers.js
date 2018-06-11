module.exports = (app) => {
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
        });
    app.get('/server/:id', (req, res) => {
        Servers.findOne({
            where: {
                server_id: req.params.server_id
            }
        }).then(result => res.send(result))
            .catch(err => res.status(412).json({ msg: error.message }));
    })

}