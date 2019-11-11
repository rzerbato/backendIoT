const express = require('express');
const app = express();
const Lectura = require('../models/lectura');

app.get('/dispositivos', function(req, res) {

    //console.log(req.query.dispositivo);
    //let filtroDispositivo = '"nombre": "' + req.query.dispositivo + '"' || '';
    //console.log(filtroDispositivo);
    if (req.query.dispositivo) {
        Lectura.find({ "nombre": req.query.dispositivo })
            .exec((err, lecturas) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    lecturas
                });
            })
    } else {
        Lectura.find({})
            .exec((err, lecturas) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    lecturas
                });
            })
    }
});

module.exports = app;