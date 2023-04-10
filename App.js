const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require('body-parser')


const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    gender: {
        type: String,
        required: false
    }
});

const User = module.exports = mongoose.model('User', userSchema);




const port = 5000
mongoose.connect("mongodb+srv://Awais-007:54626587@mean-db.h23eivz.mongodb.net/mean-course?retryWrites=true&w=majority")
    .then(() => {
        console.log('connected');
    })
    .catch(() => {
        console.log('connection failed');
    })


app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
    next()

})

app.set("view engine", "hbs");
app.set("views", "./view")
app.use(express.static(__dirname + "/public"))

app.get("/", (req, res) => {
    res.render("index")
});
app.get("/add", (req, res) => {
    res.render("add")
});
// app.get("/search", (req, res) => {
//     res.render("search")
// });
app.get("/update", (req, res) => {
    res.render("update", { mesg: true })
});


app.get("/view", (req, res) => {
    User.find().then((result) => {
        res.render("view", { data: result });
    })
        .catch((error) => {
            console.log(error)
        });


});


app.get("/addstudent", (req, res) => {

    User.findOne({
        $or: [
            { email: req.query.email },
            { phone: req.query.phone }
        ]
    })
        .then((result) => {
            if (result) {
                res.render("add", { checkmesg: true })

            }
            else {
                const user = new User({
                    name: req.query.name,
                    phone: req.query.phone,
                    email: req.query.email,
                    gender: req.query.gender,

                });

                user.save().then((result) => {
                    res.render("add", { mesg: true })

                })
                    .catch((error) => {
                        console.log(error)
                    });

            }
        })
        .catch((error) => {
            console.log(error)
        });

});

//  UPDATE SEARCH

app.get("/updatesearch", (req, res) => {
    User.findOne({ phone: req.query.phone })
        .then((result) => {
            if (result != null) {
                res.render("update", { mesg1: true, mesg2: false, mesg: false, data: result })

            }
            else {
                res.render("update", { mesg1: false, mesg: true, mesg2: true })
            }
        })
        .catch((error) => {
            console.log(error)
        });
})

// UPDATE STUDENT

app.get("/updatestudent", (req, res) => {
    // fetch data

    User.findOneAndUpdate(
        { phone: req.query.phone }, { $set: { name: req.query.name } },
    ).then((result) => {
        res.render("update", { umesg: true, mesg: true })

    })
        .catch((error) => {
            console.log(error)
        });


});

app.get("/delete", (req, res) => {
    const userId = req.query.userId;
    User.deleteOne({ _id: userId }).then((result) => {
        User.find().then((result) => {
            res.render("view", { data: result });
        })
            .catch((error) => {
                console.log(error)
            });
    })
        .catch((error) => {
            console.log(error)
        });

})

//Create Server
app.listen(port, (err) => {
    if (err)
        throw err
    else
        console.log("Server is running at port %d:", port);
});