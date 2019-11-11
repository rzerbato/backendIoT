//==============================
//  Puerto
//==============================
process.env.PORT = process.env.PORT || 3000;

//==============================
//  Entorno
//==============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//==============================
//  Base de Datos
//==============================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/iot';
} else {
    urlDB = 'mongodb + srv: //rzerbato:arc1030q@iot-px8ih.gcp.mongodb.net/test?retryWrites=true&w=majority';
}
process.env.URLDB = urlDB;