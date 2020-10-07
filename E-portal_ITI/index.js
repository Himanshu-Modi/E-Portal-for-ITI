const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const cors = require('cors');
var multer = require('multer');
const path = require('path');


var fs = require('fs');


const storageEngine = multer.diskStorage({
    destination: './uploads',
    filename: function (req, file, fn) {
        fn(null, new Date().getTime().toString() + '-' + file.fieldname + path.extname(file.originalname));
    }

})
const upload = multer({ storage: storageEngine });


mongoose.connect('mongodb://localhost:27017/Minor', { useNewUrlParser: true }, function (error) {
    //console.log(error);
});

const server = express();
server.use(cors());

server.use(express.static('build'));
server.use(bodyParser.json());   // for JSON data body
server.use(bodyParser.urlencoded({ extended: false }))  // for urlencoded data body
server.use(express.static('uploads'));

const Personel1Schema = new Schema({

    AadharNo: String,
    NameofApplicant: String,
    FathersName: String,
    email: String,
    ContactNumber: String

});

const Personel2Schema = new Schema({
    email: String,
    DateOfBirth: String,
    PanCardNo: String,
    PPA1: String,
    PPA2: String,
    PCITY: String,
    PSTATE: String

});
const LandSchema = new Schema({
    email: String,
    LandSize: String,
    LL1: String,
    LL2: String,
    LCITY: String,
    LSTATE: String

});
const DocumentSchema = new Schema({
    email: String,
    PhotoURL: String,
    AadharURL: String,
    PanCardURL: String,
    OwnershipURL: String

});
const CheckSchema = new Schema({
    email: String,
    PhotoStatus:String,
    PhotoSDate:String,
    PhotoUDate:String,

    AadharStatus:String,
    AadharSDate:String,
    AadharUDate:String,

    PANStatus:String,
    PANSDate:String,
    PANUDate:String,

    LandStatus:String,
    LandSDate:String,
    LandUDate:String,
    verdict:Boolean
    

});


const Personel1 = mongoose.model('Personel1', Personel1Schema);
const Personel2 = mongoose.model('Personel2', Personel2Schema);
const Land = mongoose.model('Land', LandSchema);
const Documents = mongoose.model('Documents', DocumentSchema);
const Check = mongoose.model('Checkstatus', CheckSchema);


server.post('/image', upload.single('avatar'), function (req, res, next) {
    // req.file is the `avatar` file
    console.log(req.file)
    // req.body will hold the text fields, if there were any
    res.json(req.file)

})
server.get('/personel1/:id', function (req, res) {
    Personel1.findOne({ email: req.params.id }, function (err, docs) {
        res.json(docs);
    })
})
server.get('/db', function (req, res) {
    Personel1.find({}, function (err, docs) {
        res.json(docs);
    })
})
server.get('/documents', function (req, res) {
    Documents.find({}, function (err, docs) {
        res.json(docs);
    })
})

server.get('/personel2/:id', function (req, res) {
    Personel2.findOne({ email: req.params.id }, function (err, docs) {
        res.json(docs);
    })
})

server.get('/land/:id', function (req, res) {
    Land.findOne({ email: req.params.id }, function (err, docs) {
        res.json(docs);
    })
})

server.get('/document/:id', function (req, res) {
    Documents.findOne({ email: req.params.id }, function (err, docs) {
        res.json(docs);
    })
})


server.get('/checkstatus/:id', function (req, res) {
    Check.findOne({ email: req.params.id }, function (err, docs) {
        if(docs){
        res.json(docs);
        }
        else{
            let newdocs= new Check();
            newdocs.email=req.params.id;
            newdocs.PhotoStatus="Pending";
            newdocs.AadharStatus="Pending";
            newdocs.PANStatus="Pending";
            newdocs.LandStatus="Pending";
            newdocs.PhotoSDate="Not Submitted";
            newdocs.AadharSDate="Not Submitted";
            newdocs.PANSDate="Not Submitted";
            newdocs.LandSDate="Not Submitted";
            newdocs.PhotoUDate="Not verified";
            newdocs.AadharUDate="Not verified";
            newdocs.PANUDate="Not verified";
            newdocs.LandUDate="Not verified";
            newdocs.save();
            res.json(newdocs);

        }
    })
})



server.post("/personel1save", function (req, res) {
    let personel1 = req.body;
    Personel1.findOne({ email: personel1.email }, function (err, docs) {
        if (docs) {

            Personel1.findOneAndUpdate({ email: req.body.email }, personel1, function (err, doc) {
                // this will contain db object
            })
        }
        else {
            let personel2 = new Personel1(req.body);
            personel2.save();
        }
    })
    

})
server.post("/personel2save", function (req, res) {
    let personel1 = req.body;
    Personel2.findOne({ email: personel1.email }, function (err, docs) {
        if (docs) {

            Personel2.findOneAndUpdate({ email: req.body.email }, personel1, function (err, doc) {
                 // this will contain db object
            })
        }
        else {
            let personel2 = new Personel2(req.body);
            personel2.save();
        }
    })
})
server.post("/landsave", function (req, res) {
    let personel1 = req.body;
    Land.findOne({ email: personel1.email }, function (err, docs) {
        if (docs) {

            Land.findOneAndUpdate({ email: req.body.email }, personel1, function (err, doc) {
                // this will contain db object
            })
        }
        else {
            let personel2 = new Land(req.body);
            personel2.save();
        }
    })
    
})


server.post("/documentsave", function (req, res) {
    let personel1 = req.body;
   
    Documents.findOne({ email: personel1.email }, function (err, docs) {
        if (docs) {

            Documents.findOneAndUpdate({ email: req.body.email }, personel1, function (err, doc) {
                 // this will contain db object
            })
        }
        else {
            let personel2 = new Documents(req.body);
            personel2.save();
        }
    })

})

server.post("/checkstatus", function (req, res) {
    let personel1 = req.body;

    
    Check.findOne({ email: personel1.email }, function (err, docs) {
        if (docs) {

            Check.findOneAndUpdate({ email: req.body.email }, personel1, function (err, doc) {
                
                // this will contain db object
            
            })
        }
    
    })

})

server.post("/photostatus", function (req, res) {
    let p1 = req.body;
   
    Check.findOne({ email: p1.email }, function (err, docs) {
        if (docs) {
            let newdocs=docs;
            newdocs.PhotoStatus=p1.PhotoStatus;
            newdocs.PhotoUDate=p1.PhotoUDate;


            Check.findOneAndUpdate({ email: req.body.email }, newdocs, function (err, doc) {
                 // this will contain db object
            })
        }
    
    })

})

server.post("/aadharstatus", function (req, res) {
    let p1 = req.body;
   
    Check.findOne({ email: p1.email }, function (err, docs) {
        if (docs) {
            let newdocs=docs;
            newdocs.AadharStatus=p1.AadharStatus;
            newdocs.AadharUDate=p1.AadharUDate;


            Check.findOneAndUpdate({ email: req.body.email }, newdocs, function (err, doc) {
                 // this will contain db object
            })
        }
    
    })

})

server.post("/panstatus", function (req, res) {
    let p1 = req.body;
   
    Check.findOne({ email: p1.email }, function (err, docs) {
        if (docs) {
            let newdocs=docs;
            newdocs.PANStatus=p1.PANStatus;
            newdocs.PANUDate=p1.PANUDate;


            Check.findOneAndUpdate({ email: req.body.email }, newdocs, function (err, doc) {
                 // this will contain db object
            })
        }
    
    })

})

server.post("/landstatus", function (req, res) {
    let p1 = req.body;
   
    Check.findOne({ email: p1.email }, function (err, docs) {
        if (docs) {
            let newdocs=docs;
            newdocs.LandStatus=p1.LandStatus;
            newdocs.LandUDate=p1.LandUDate;


            Check.findOneAndUpdate({ email: req.body.email }, newdocs, function (err, doc) {
                 // this will contain db object
            })
        }
    
    })

})

server.get("/verdict/:id", function (req, res) {
   
    Check.findOne({ email: req.params.id }, function (err, docs) {
        if (docs) {
            let newdocs=docs;
           if (newdocs.LandStatus=="Verified" && newdocs.AadharStatus=='Verified' && newdocs.PhotoStatus=="Verified" && newdocs.PANStatus=="Verified" ){
         
            newdocs.verdict=true;
           }
           else{
            newdocs.verdict=false;
           }
            Check.findOneAndUpdate({ email: req.params.id }, newdocs, function (err, doc) {
                 // this will contain db object
                 res.json(doc);
                 console.log(doc);
            })
        }
    
    })

})



server.listen(8080, function () {
    console.log("server started")
})