require('./server/config/config');
const AWS = require('aws-sdk');
const Lectura = require('./server/models/lectura');
const express = require('express');
const mongoose = require('mongoose');

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
let tabla = "Oficina-DHT11"; //Tabla/Dispositivo del cual se van a obtener los datos
//Parametros del query
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
            let fecha = item.Hora.S.split('-');
            let fechaStr = fecha[1] + '/' + fecha[0] + '/' + fecha[2] + ' ' + fecha[3];
            let lectura = new Lectura({
                'nombre': item.Device.S,
                'temperatura': item.Temperatura.S,
                'humedad': item.Humedad.S,
                'auditoria': fechaStr
            });
            /*lectura.save((err, lecturaDB) => {
                if (err) {
                    //Cambiamos el clg por una excepcion???
                    console.log(err);
                } else {
                    console.log(lecturaDB);
                }

            });*/
            console.log(lectura);
        });
    }
});