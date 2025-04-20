// import { cookieJwtAuth } from './middleware/cookieJwtAuth';
require('dotenv').config();
const { cookieJwtAuth, openUserprofile } = require('./middleware/cookieJwtAuth');

const hbs = require('hbs');
const nodemailer = require('nodemailer');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const mongodb = require('mongodb');
const { ObjectId } = require('mongodb');
const bcripyt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');


const app = express();

const publicDirectoryPath = path.join(__dirname, '../Public');
console.log(publicDirectoryPath)
app.use(express.static(publicDirectoryPath));
app.use(express.static(__dirname + '/Public')); //for static css and js files

app.use('/css', express.static(__dirname + '/Public/css'));
app.use('/js', express.static(__dirname + '/Public/js'));
app.use('/img', express.static(__dirname + '/Public/img'));

//to be able to recieve json form frontend
app.use(cookieParser());
app.use(express.json());

// hbs.registerPartials(partialsPath);
hbs.registerPartials(__dirname + '/Templates/partials'); //for partials



app.set('views', './src/Views')
app.set('view engine', 'hbs');
mongoose.set('strictQuery', false);


let port = process.env.PORT || 3000;

//database 
const MongoClient = mongodb.MongoClient;
const databaseName = 'davidcy360africa';

//mongodb custom id
const objectID = mongodb.ObjectId;
const id = new objectID();

const uri = process.env.MONGODB_URL;

mongoose.connect(uri).then(() => {
    console.log('connected');
})

const User = mongoose.model('User', {
    firstName: { type: String },
    middleName: { type: String },
    lastName: { type: String },
    email: { type: String },
    password: { type: String },
    address: [String],
    paymentMethods: [{
        name: { type: String },
        type: { type: String },
        url: { type: String }
    }],
    orders: [{
        quantity: { type: Number },
        type: [{
            name: { type: String },
            image: { type: String },
            size: { type: String },
            materialType: [String],
            materialImage: { type: String },
            buttonNumber: { type: String },
        }],
    }],
})


async function mongooseSaveToDataBase({ firstName, middleName, lastName, email, password }) {
    //hash password
    let hashedPassword = await bcripyt.hash(password, 8);

    let me = new User({
        firstName,
        middleName,
        lastName,
        email,
        password: hashedPassword
    })

    me.save().then(() => {
        console.log(me);
    }).catch((error) => {
        console.log('unable to save', error);
    })
}


//jwt
const jwtFunctionSigning = (userLoginDetails) => {
    const token = jwt.sign(userLoginDetails, 'thisismykey', { expiresIn: "24h" });

    res.cookie("token", token, {
        httpOnly: true,
        signed: true,
        secure: true
    })
}



//hbs template



//home page
app.get('', (req, res) => {
    res.render('index', {
        username: 'User',
    });
})


//signup and login page
app.get('/login', (req, res) => {
    res.render('login', {
        username: 'User',
    });
})


//signup and login page
app.get('/en/account', (req, res) => {
    res.render('profile', {
        username: 'User',
    });
})



let userVerificationCode = '';
let newUserDetailsToBeSaved = {};

//send verification email
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'davidcy360africa@gmail.com',
        pass: 'fajc hklm ptjc jmrj'
    }
});


function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}


//sign up user
app.post('/login', (req, res) => {

    const userdata = req.body;
    if (!userdata) return res.status(400).send({ status: 'failed' });

    // Usage:
    const customRandomInt = getRandomInteger(100000, 900000);
    userVerificationCode = customRandomInt;

    //assign to be saved in database
    newUserDetailsToBeSaved = userdata;


    //send confirmation mail
    let mailOptions = {
        from: 'davidcy360africa@gmail.com',
        to: userdata.email,
        subject: 'Confirmation Code',
        text: `Thank you for signing up ${userdata.firstName}. Your one time confirmation code is ${userVerificationCode}.`
    };

    // validate email save to data
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return res.status(400).send({ status: 'failed' });
        } else {
            //if okay
            return res.status(200).send({ status: 'sucess' });
            // console.log(userdata);
        }
    });
})



app.post('/verification', (req, res) => {
    const userVerificationInput = req.body;

    if (!userVerificationInput) return res.status(400).send({ status: 'failed' });


    //confirm
    if (userVerificationInput.userVerificationInput.toString() !== userVerificationCode.toString()) {
        return res.status(400).send({ status: 'failed' });
    }

    //save new user to database
    mongooseSaveToDataBase(newUserDetailsToBeSaved);
    return res.status(200).send({ status: 'sucess', });
});


//savedUserLogin
app.post('/userLogin', (req, res) => {
    const user = req.body;

    if (!user) return res.status(400).send({ status: 'failed' });

    const userEmail = user.email;
    const userPassword = user.password;

    User.findOne({ email: userEmail }).then(async (databaseUser) => {
        //if user not found

        let userTokenInfo = {
            firstName: databaseUser.firstName,
            middleName: databaseUser.middleName,
            lastName: databaseUser.lastName,
            email: databaseUser.email,
            password: databaseUser.password
        }

        //check password
        const isMatch = await bcripyt.compare(userPassword, databaseUser.password);
        if (!isMatch) {
            //user password does not match
            return res.status(400).send({ status: 'failed' });
        }

        //set cookies for token
        const token = jwt.sign(userTokenInfo, 'thisismynewcourse');

        res.cookie("token", token, {
            httpOnly: true,
            // signed: true,
            // secure: true
        }).status(200).send({ status: 'sucess' })


    }).catch((error) => {
        //user not found
        return res.status(400).send({ status: 'failed' });
    });
})



//view user profile
app.post('/user/profile', cookieJwtAuth, (req, res) => {
    //authenfied user
    res.status(200).send({ status: 'authentified' });
});




app.use('/user/profile/details', cookieJwtAuth, (req, res) => {
    //authenfied user
    // const userRequiredData = findUserDetails(req.user.email);
    User.findOne({ email: req.user.email }).then(async (databaseUser) => {

        if (databaseUser == undefined) return res.status(400).send({ data: 'failed' });

        res.status(200).send({ data: databaseUser });

    }).catch((error) => {
        //user not found
        return undefined;
    });

});



// edith profile page 
app.get('/en/profile', (req, res) => {
    res.render('edithProfile', {
        username: 'User',
    });
})


// edith password page 
app.get('/en/Account-EditPassword', (req, res) => {
    res.render('edithPassword', {
        username: 'User',
    });
})


// add address page 
app.get('/en/Account-AddAddress', (req, res) => {
    res.render('addAddress', {
        username: 'User',
    });
})




//support page
app.get('/en/overview', (req, res) => {
    res.render('support-overview', {
        username: 'User',
    });
})


//support page
app.get('/en/delivery-time-cost', (req, res) => {
    res.render('delivery-time-cost', {
        username: 'User',
    });
})


//authenticate open user details (for profile name edith)
app.post('/edith/myProfile', cookieJwtAuth, (req, res) => {
    //authentified
    res.status(200).send({ status: 'success' });
})

//authenticate open user details (for password)
app.post('/edith/myPassword', cookieJwtAuth, (req, res) => {
    //authentified
    res.status(200).send({ status: 'success' });
})




//updat user name, middle, last name
app.post('/edith/user/details', cookieJwtAuth, (req, res) => {
    // const userRequiredData = findUserDetails(req.user.email);
    User.findOne({ email: req.user.email }).then(async (databaseUser) => {

        if (databaseUser == undefined) return res.status(400).send({ data: 'failed' });


        //update database 

        res.status(200).send({ data: databaseUser });

    }).catch((error) => {
        //user not found
        return undefined;
    });
})




app.listen(port, () => {
    console.log('server is up on port 3000');
})