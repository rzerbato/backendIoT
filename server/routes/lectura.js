const express = require('express');
const app = express();
const Lectura = require('../models/lectura');


/**
 * Servicio que retorna todas las lecturas del dispositivo pasado por parametro y,
 * en caso de no pasar ningun dispositivo retorna las lecturas de todos los dispositivos
 */
app.get('/lecturas', function(req, res) {
    if (req.query.dispositivo) {
        console.log('aca1');

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
        console.log('aca2');

        Lectura.find({})
            .exec((err, lecturas) => {
                if (err) {
                    console.log('aca3');

                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                console.log('aca4');
                console.log(lecturas);
                res.json({
                    ok: true,
                    lecturas
                });
            })
    }
});



app.get('/ultimaLectura', function(req, res) {
    if (req.query.dispositivo) {
        Lectura.find({ "nombre": req.query.dispositivo })
            .sort({ $natural: -1 })
            .limit(1)
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

        return res.status(400).json({
            ok: false,
            err: 'Debe pasar un dispositivo como parametro'
        });
    }


});



module.exports = app;