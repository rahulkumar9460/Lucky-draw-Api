const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var moment = require('moment');
moment().format();

const User = require('../model/User');
const Event = require('../model/Event');
const {registerValidation, loginValidation} = require('../validation');
const { date } = require('@hapi/joi');


//Register
router.post('/signup', async (req, res) => {

    //validate data before making a user
    const { error } = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    //checing if user already exists in our database
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exists');

    //password hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //creating a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    try {
        const savedUser = await user.save();
        res.status(200).send({ user: user._id });
    } catch (err) {
        res.status(400).send(err);
    }
});

//Login
router.post('/login', async (req, res) => {
    //validate data
    const { error } = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //checing if user exists in our database
    const user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(400).send('No account for this email');

    //checking if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send("Password is incorrect");

    //creating and assignning a jwt token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.status(200).header('auth-token', token).send({ user: user, 'auth-token': token });

});

//get active and upcomming events
router.get('/events', async (req, res) => {
    const currDate = Date.now();
    

    try {
        //active event : startDate < currdate and endDate > currdate
        const params1 = { activeDate: { $lte: currDate }, closeDate: { $gte: currDate } };
        const activeEvents = await Event.find(params1);

        //upcomming event : startDate > currdate
        const params2 = { activeDate: { $gte: currDate } };
        const upcommingEvents = await Event.find(params2);
        res.status(200).send({activeEvents: activeEvents, upcommingEvents: upcommingEvents});
    } catch (err) {
        res.status(400).send(err);
    }

});

//get events of past week and their winners
router.get('/winners', async (req, res) => {
    const currDate = new Date();

    //date of past week's sunday
    let lastSundayDate = new Date();
    lastSundayDate.setDate((currDate.getDate() - (currDate.getDay()) % 7 ));

    //date of past week's monday
    let lastMondayDate = new Date();
    lastMondayDate.setDate((currDate.getDate() - (currDate.getDay() + 6) % 7) - 7);
    //console.log(lastSundayDate, lastMondayDate);

    try {
        const params = { closeDate: { $gte: lastMondayDate, $lte: lastSundayDate } };
        const pastWeekEvents = await Event.find(params);
        res.status(200).send(pastWeekEvents);

    } catch (err) {
        res.status(400).send(err);
    }
    
    
});

//announce winner
router.get('/announce', async (req, res) => {
    const currDate = new Date();

    let lastDate = new Date();
    lastDate.setDate( currDate.getDate() - 1 );

    let nextDate = new Date();
    nextDate.setDate( currDate.getDate() + 1 );

    try{
        const params = { closeDate: { $gte: lastDate, $lt: currDate } };
        let endingEvents = await Event.find(params);

        for(let i=0; i<endingEvents.length; i++){
            let endingEvent = endingEvents[i];

            //If no one participated in that event
            if(endingEvent.participants.length == 0)continue;

            //if result has already announced 
            if(endingEvent.winner.email != null)continue;

            //computing winner
            const winnerIdx = getRndInteger(0, endingEvent.participants.length);
            let winner = endingEvent.participants[winnerIdx];

            //updating winner details
            const myQuery = {_id : endingEvent._id};
            const newParams = { $set: {winner : winner}};
            const updatedEvent = await Event.updateOne(myQuery, newParams);
            
            //console.log(winner);
        }

        res.status(200).send("winners announced succesfully");

    } catch (err) {
        res.status(400).send(err);
    }

});

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

module.exports = router;