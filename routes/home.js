const router = require('express').Router();
const verify = require('./verifyToken');
const User = require('../model/User');
const Event = require('../model/Event');

router.get('/home', verify,  (req, res) => {
    res.status(200).send("Validation Sucessful");
});

//request of buying ticket by user
router.post('/buyTickets', verify, async (req, res) =>{
    //no of tickets user bought
    const boughtTickets = req.body.boughtTickets;
    const user = await User.findOne({ email: req.body.email });

    try {
        //no of tickets that user already have
        const prevTickets = user.tickets;
        const myQuery = {email : user.email};
        const newParams = { $set: {tickets : prevTickets + boughtTickets}};

        //update new number of tickets for that user
        const updatedUser = await User.updateOne(myQuery, newParams);

        //return user email and his tickets
        res.status(200).send({ user: user.email, tickets: prevTickets+boughtTickets });
    } catch (err) {
        res.status(400).send(err);
    }
    
}); 

//request to participate in an event by user
router.post('/participate', verify, async (req, res) => {
    const event = await Event.findOne({ _id : req.body.eventId });
    const user = await User.findOne({ email: req.body.email });

    try{
        //Check if user have tickets
        if(user.tickets == 0){
            res.status(400).send("Please buy some tickets first");
            return;
        }
        
        let participants = event.participants;
        const newParticipant = { email : user.email, name : user.name };
        
        //check if user has already participated
        for(let participant of participants){
            if(participant.email == newParticipant.email){
                res.status(400).send("Already participated");
                return;
            }
        }

        participants.push(newParticipant);

        const query1 = { _id: event._id };
        const params1 = { $set: {participants: participants } };
        const updatedEvent = await Event.updateOne(query1, params1);

        let eventListFromUser = user.events;
        eventListFromUser.push({ _id: event._id, name: event.name });

        const query2 = {email : user.email};
        const params2 = { $set: {tickets : user.tickets-1, events : eventListFromUser } };
        const updatedUser = await User.updateOne(query2, params2);

        res.status(200).send("participation in event sucessfull");

    } catch  (err) {
        res.status(400).send(err);
    }


});



module.exports = router;