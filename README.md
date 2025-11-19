To run the Backend , type the following commands : 
```npm install ```

Create env file from .env.example file with your credential 

```node index.js ```
or 
```nodemon index.js```


To run the Frontend (Backend Must be Running Successfully : ) type the following commands in the terminal : 

```npm install ```
(installing necessary dependencies and sub dependencies)

```npm run dev ```
( to start the frontend server , default on port 5173)
<!-- Backend : 
Cors  -->

<!-- Future Work  -->
1. Add User Profession 
2. Make automatically creating the soltic database in the user system (from db.js)
3. remove secure:false from cookie in index.js for production 
4. Make the chat more relevant by providing user wishlist , user's recent travel history , profession etc . 
5. If the model is suggesting some places , location what it must suggest e.g. Must visit sites with their timeline (best time to visit  , if their is ticket for that place ) , it should show hotels (with ratings , review , prices , room availability , checkin checkout timings ) , food options nearby , crowd timing , weather , must carry things , historial importance of that place (if available) , must do things in that place (what most people do their , most popular food or anything ) , How can we travel from current place to that place 
6. Live Trip Monitoring (guiding for that place , tracking the user's trip details and guiding or suggesting him things e.g say i just dropped at mahabodhi temple in gaya ..... so it will automatically show / suggest me some food options / hotel nearby ....it will show me go to this hotel check in there rest till 2pm (say ) and then visit to mahabodhi temple (will show what to do inside the temple , top attraction and other thins) , then go to there ... and once we complete something (we can give the user a button on clicking to which he can respond whether he has done this task or not , say he visited the temple then he will respond to us by clicking on the button ) it's live planning my trip ... ) ............... this will start once he clicks let's start the trip (he can see the detailed roadmap and we will showing him the step by step roadmap )
e.g. click's let's start the trip (for gaya): 
    1. fetches current location
    2. suggest to onboard to the train (with all the persons and luggage , cautionery things)(will show the train timing if he has booked with us) (or show options to book trains )
    3. Asks the user ( if he has successfully visited gaya (can verify it with user location)) by showing a button if he responds yes (move to step4 ) ... if not shows his journey for gaya if uncomplete or if he dropped to wrong location shows way to reach gaya from that location 
    4.once he drops in gaya (checks his timing ) and accordingly plans the things .. say it's late night (he arrived ) ... agent will ask whether you want to stay there , want to eat some food (show food options nearby) or would directly like to move to bodhgaya (will briefly show how it will be travelling routes , where i can get the local auto's routes , metro's buses and other ) 
    5. once he arrives in bodh gaya ... may ask his choice (food , rest (how many hours  , helps to check in hotel (shows hotel prices nearby or best prices(according to the trip budget) ) )) then plans the next things say visit to this place at this time (can show descriptive text take auto from there (with in this price range ) and reach this place , must do things at that place ) and once the user responds that he has visited that places will ask 
    what next to the user (say next place , have food ,  )
    user select: next place ... show travelling details for that place and asks what next once user click he has arrived on that place , asks what next (travel guide at that place ) , once user click he has completed his travelling on that place  , asks what next (e.g travel to next place , go to hotel , have food ) .... 

    some everytime available option : pause trip , end trip , increase budget , resume trip . ( i message max would also be there along with the user button inputs for more enhanced feedbacks ).