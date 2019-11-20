require('./server/config/config');
const AWS = require('aws-sdk');
const Lectura = require('./server/models/lectura');
const express = require('express');
const mongoose = require('mongoose');
const moment = require('moment');

//Cargo las credenciales a la API AWS
AWS.config.loadFromPath('./credenciales.json');

//Conecto la DB
mongoose.connect(process.env.URLDB, (err, res) => {
    if (err) throw err;
    console.log('Base de datos ONLINE!');

});



/**
 * Obtengo los datos de AWS y lo grabo en la DB propia
 */
var dynamodb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });


//esta funcion es para el sleep
setInterval(function () { 

console.log('Holis');
    let tabla = "Oficina01"; //Tabla/Dispositivo del cual se van a obtener los datos
    //Parametros del query
    //Hay que hacer el select filtrando por el campo count todos los registros desde la ultima lectura.
    var params = {
        ExpressionAttributeValues: {
            ":v1": {
                S: "D01"
            }
        },
        KeyConditionExpression: "Device = :v1",
        Limit: 1,
        ScanIndexForward: false,
        TableName: tabla
    };

    //Ejecuto el query a AWS
    dynamodb.query(params, function(err, data) {
        if (err) {
            //Fallo el query
            //Cambiamos el clg por una excepcion???
            console.log(err, err.stack);
        } else {
            //Recorro el resultado y grabo cada registro en la DB propia
            data.Items.forEach(function(item) {
                let dateObject = moment(new Date());
                dateObject.subtract(3, 'hours');
                let auditoria = dateObject.format("YYYY-MM-DD, HH:mm:ss");
                let lectura = new Lectura({
                    'nombre': item.Device.S,
                    'temperatura': item.Temperatura.S,
                    'humedad': item.Humedad.S,
                    'fecha': item.Count.N,
                    'auditoria': auditoria
                });
                lectura.save((err, lecturaDB) => {
                    if (err) {
                        //Cambiamos el clg por una excepcion???
                        console.log(err);
                    } else {
                        console.log(lecturaDB);
                    }
                });
            });
        }
    });
}, 60000); 