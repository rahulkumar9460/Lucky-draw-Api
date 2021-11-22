# Lucky Draw APIs
# Hosted at: https://luckydrawapi.herokuapp.com/
1. SignUp
  * use "/api/user/signup
  * Require 3 parameters in body
    * 'name' : "pheobe",
    * 'email' : "pheobe@gjak.com",
    * 'password' : "pheobe@9460"

2. Login
  * use "/api/user/login
  * Require 2 parameters in body
     * 'email' : "pheobe@gjak.com",
     * 'password' : "pheobe@9460"
  * Returns JWT token(named as "auth-token")

3. Buy event tickets
  * use "/api/user/buyTickets
  * Require 2 parameter in body
     * 'email' : "pheobe@gmail.com"
     * 'boughtTickets' : 4     //Number of tickets bought by the  user
  * Require 1 paramete in header
     * 'auth-token' : JWT token // to check whether user is logged in or not
  * Updates user's total tickets (previous tickets + newly bought tickets) at the database
  * Return user's total number to tickets

4. Get active and upcomming events 
   * use "/api/user/events"
   * Returns list of active events and upcomming events
   * Say today's date is currDate, active date of event is activeDate and close date of event is closeDate
    * Active Events: if (currDate < closeDate)
    * Upcomming Events: if (currDate < activeDate)
 
5. Participate in an event
   * use '/api/user/participate"
   * Takes two parameters in body
    * Email of that user: 'email' : "pheobe@gjak.com"
    * ID of event in which user want to participate: 'eventId : id'
   * Takes one parameter in header
    * 'auto-token' : JWT token
   * Steps
    1. First checks if user have availabe tickets to participate in that event
    2. Now, it checks whether that event is active or not
    3. Checks whether user has already participated in that event
   * If all conditions above comes to be true then that event will be added to eventList of user and that user will be added to participantsList of event
   * And, at last the ticket count of user will be reduced by one
    
