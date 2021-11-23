# Lucky Draw APIs (Grofer's assignment)
# Hosted at: https://luckydrawapi.herokuapp.com/
## services and tools: nodeJs, ExpressJs; database: mongoDB
* NodeJs: 16.13.0
* ExpressJs: 4.17.1
* Mongoose: 6.0.5
* bcryptJs: 2.4.3
* dotenv: 1.0.0
* jsonwebtoken: 8.5.1
* @happi/joi: 15.0.3

# 
* SignUp
  * use "/api/user/signup"
  * Require 3 parameters in body
    * 'name' : "pheobe",
    * 'email' : "pheobe@gjak.com",
    * 'password' : "pheobe@9460" 
# 
* Login
  * use "/api/user/login"
  * Require 2 parameters in body
     * 'email' : "pheobe@gjak.com",
     * 'password' : "pheobe@9460"
  * Returns JWT token(named as "auth-token")
  
# 
* Buy event tickets
  * use "/api/user/buyTickets
  * Require 2 parameter in body
     * 'email' : "pheobe@gjak.com"
     * 'boughtTickets' : 4     //Number of tickets bought by the  user
  * Require 1 parameter in header
     * 'auth-token' : JWT token // to check whether user is logged in or not
  * Updates user's total tickets (previous tickets + newly bought tickets) at the database
  * Return user's total number to tickets
  
# 
* Get active and upcomming events 
   * use "/api/user/events"
   * Returns list of active events and upcomming events
   * Say today's date is currDate, active date of event is activeDate and close date of event is closeDate
     * Active Events: if (currDate < closeDate)
     * Upcomming Events: if (currDate < activeDate)
     
# 
* Participate in an event
   * use '/api/user/participate'
   * Takes two parameters in body
     * Email of that user: 'email' : "pheobe@gjak.com"
     * ID of event in which user want to participate: 'eventId : id'
   * Takes one parameter in header
     * 'auth-token' : JWT token
   * Steps
     * First checks if user have availabe tickets to participate in that event
     * Now, it checks whether that event is active or not
     * Checks whether user has already participated in that event
   * If all conditions above comes to be true then that event will be added to eventList of user and that user will be added to participantsList of event
   * And, at last the ticket count of user will be reduced by one
   
# 
* Show last week's events and their winners
  * use '/api/user/winners'
  * Returns a list of events of last week and their winners
# 
* Announce winner
  * use '/api/user/announce'
  * This API can be called everyday at 8am and for all the events which ended a day before calling the API, winners will be announced
  * The algorithm picks a random participant and assigns him/her the winner of that event
  * Calling this API multiple times a day will not cause an error because first it checks whether their exists a winner for that event before running the algorithm
  * After successfully calculating the winner, the winner will be added to event at database
    
