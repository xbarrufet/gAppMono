/**
 * Created by xavierbarrufet on 16/4/16.
 */


var sampleData = function() {

    //GARDEN CENTERS **********************************
    var gardenCenter1 = {
        name:"Garden Bordas",
        gardenCenterAddress: {
            address: "Carretera de la platja 5",
            city:"Gavà",
            province:"Barcelona",
            PO:"08850"
        },
        admin: "josepg@gbordas.cat"
    };
    var gardenCenter2 = {
        name:"Terra Nostra",
        gardenCenterAddress: {
            address: "Carretera de San Adrián a la Roca (BV-5001) km 7,3",
            city:"Montcada",
            province:"Barcelona",
            PO:"08110"
        },
        admin: "terra_nostra@gmail.com"
    };

    var gardenCenter3 = {
        name:"Flor de Maig",
        gardenCenterAddress: {
            address: "Avinguda de la Flor de Maig, 64",
            city:"Cerdanyola",
            province:"Barcelona",
            PO:"08290"
        },
        admin: "flodemaig_admin@yahoo.com"
    };

    //CLIENTS **********************************
    var clientGarden11 = {
        name:"David Teixidor",
        clientAddress: {
            address: "Passeig Maragall 23 1 1",
            city:"Gava",
            province:"Barcelona",
            PO:"08850"
        },
        phone:"936627843",
        email: "dteixidor@telefonica.net"
    };
    var clientGarden12 = {
        name:"Victor Liza",
        clientAddress: {
            address: "Merce 8 2 4",
            city:"Castelldefels",
            province:"Barcelona",
            PO:"08860"
        },
        phone:"667239941",
        email: "machacante99@gmai.com"
    };
    
    var clientGarden21 = {
        name:"Daniel Franco",
        clientAddress: {
            address: "C/ Jaume I 40 6º 3º",
            city:"Montcada",
            province:"Barcelona",
            PO:"08110"
        },
        phone:"935753781",
        email: "dfranco2@gmail.com"
    };
    var clientGarden22 = {
        name:"Ajuntament De Cerdanyola",
        clientAddress: {
            address: "C/ Moreres 23",
            city:"Cerdanyola",
            province:"Barcelona",
            PO:"08290"
        },
        phone:"677228192",
        email: "ajuntament@cedanyola.net"
    };

    var clientGarden31 = {
        name:"Salvador Lorca",
        clientAddress: {
            address: "C/ Clavell 28",
            city:"Montcada",
            province:"Barcelona",
            PO:"08290"
        },
        phone:"6700001140",
        email: "salva1966@gmail.com"
    };
    var clientGarden32 = {
        name:"Graham Bellavi",
        clientAddress: {
            address: "C/ Espronceda 2",
            city:"Cerdanyola",
            province:"Barcelona",
            PO:"08860"
        },
        phone:"667239941",
        email: "gbellavi_766@gmail.com"
    };

    //GARDENS **********************************
    var garden111 = {
        service: {
            dayOfWeek: 1,
            tasks: [{
                taskId: "0001",
                taskDescription: "Podar setos"
                },
                {
                taskId: "0002",
                taskDescription: "Limpiar hojas"
                }]
        }
    };
    var garden112 = {
        gardenAddress: {
            address: "C/ Aiguablava 12",
            city: "Gava",
            province: "Barcelona",
            PO: "08860"
        },
        service: {
            dayOfWeek: 2,
            tasks: [{
                taskId: "0001",
                taskDescription: "Podar setos"
                },
                {
                    taskId: "0002",
                    taskDescription: "Limpiar hojas"
                },
                {
                    taskId: "0003",
                    taskDescription: "Cortar cesped"
                }
            ]
        }
    };
    var garden121 = {

        service: {
            dayOfWeek: 3,
            tasks: [{
                taskId: "0001",
                taskDescription: "Podar setos"
            },
                {
                    taskId: "0002",
                    taskDescription: "Limpiar hojas"
                }]
        }
    }

    var garden211 = {
        services: {
            dayOfWeek: 1,
            tasks: [{
                taskId: "0001",
                taskDescription: "Podar setos"
            },
                {
                    taskId: "0002",
                    taskDescription: "Limpiar hojas"
                }]
        }
    }

    var garden31 = {
        services: {
            dayOfWeek: 1,
            tasks: [
                {taskId: "0001", taskDescription: "Poda de plantas, arbustos y arboles."},
                {taskId: "0002", taskDescription: "Abonado"},
                {taskId: "0003", taskDescription: "Siega de césped"},
                {taskId: "0005", taskDescription: "Tratamiento fitosanitario"},
                {taskId: "0007", taskDescription: "Limpieza de las instalaciones exteriores e interiores"}
            ]
        }
    }
    var garden32 = {
        services: {
            dayOfWeek: 2,
            tasks: [
                {taskId: "0001", taskDescription: "Poda de plantas, arbustos y arboles."},
                {taskId: "0003", taskDescription: "Siega de césped"},
                {taskId: "0004", taskDescription: "Eliminación de malas hierbas."},
                {taskId: "0006", taskDescription: "Control y programación de riego automático."}
            ]
        }
    }


    //Special tasks ********************************
    var specialTask111_1 = {
        topic:"Reparar muro caseta",
        description:"El muro de la caseta de herramientas ha caido, reparacion"
    }

    var specialTask111_2 = {
        topic:"Plantar palmera",
        description:"Plantacion de palmera en la zona oeste de la puerta"
    }

    var specialTask121_1 = {
        topic:"Arreglar Riego",
        description:"Arreglar sistema de riego de toda la finca"
    }


    var specialTask31 = {
        topic:"Cambiar aspersores",
        description:"Cambiar todos los aspersores por el nuevo modelo de Garden"
    }

    var specialTask32 = {
        topic:"Plantar palmera",
        description:"Plantacion de palmera en la zona oeste de la puerta"
    }



    var user1 = {
        email: "xbarrufetm@gmail.com",
        password:"1234",
        name: "Xavier Barrufet",
        type: "GARDEN",
        fakeId:"999ae629287af8eb1a2f4c0a"
    }

    var user2 = {
        email: "daniel.psn@gmail.com",
        password:"4321",
        name: "Daniel Plasencia",
        type: "CLIENT",
        fakeId:"999ae629287af8eb1a2f4c0b"

    }

    var newUser = {
        email: "josep32Hxn@yahoo.com",
        password:"0000",
        name: "Josep Hoxan",
        type: "GARDEN",
        admin: false
    }




    return {
        gardenCenter1:gardenCenter1,
        gardenCenter2:gardenCenter2,
        gardenCenter3:gardenCenter3,

        clientGarden11:clientGarden11,
        clientGarden12:clientGarden12,
        clientGarden21:clientGarden21,
        clientGarden22:clientGarden12,

        clientGarden31:clientGarden31,
        clientGarden32:clientGarden32,
        
        garden111:garden111,
        garden112:garden112,
        garden121:garden121,
        garden211:garden211,
        garden31:garden31,
        garden32:garden32,
        specialTask111_1:specialTask111_1,
        specialTask111_2:specialTask111_2,
        specialTask121_1:specialTask121_1,
        specialTask31:specialTask31,
        specialTask32:specialTask32,
        
        IMG_Riego:'./backend/9-test/img/riegoIMG.jpg',

        user1: user1,
        user2: user2,
        newUser: newUser
    }

}();

module.exports = sampleData;

