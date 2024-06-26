
//import different apps and frameworks necessary for your application
const express = require("express");
const {Sequelize, User, Restaurant, Review, Role } = require("./models"); //import all data object models
const cors=require("cors"); //grants security authorization for the front end app to interact with the backend app
const multer=require("multer"); //multer is important for uploading files, which will be necessary when uploading images to the database
const bodyParser = require('body-parser');
const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = '490153988551-ennqdrg2knoqj3rm1encr5vq0f7tlh50.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);




//assigning an express instance to an "app" object, basically making the express app
const app= express();

//Setting the view engine as ejs. The following is unnecessary as angular will handle the frontend
app.set('view engine', 'ejs');


//calling the use function to use cors and json data
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());




//set up multer images uploads, might also delete later
const storage = multer.memoryStorage();
const upload = multer({ storage });








//the following is an example path/route
app.get('/', async (req, res) => { //defining the route
    try {
        
        res.render("index", {name: "Not much here yet!!!"}); //you can many things with res.${function}
        
    }
    catch (error) {
        
    }
})



//might need to delete this later
app.post('/login', async (req, res) => {
    //handle a post log in request
    console.log(req.body.id_token);
    const token = req.body.id_token;
    try{
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID
        });
        const payload = ticket.getPayload();
        const {email, picture, given_name, family_name} = payload;

        console.log(`first name: ${given_name}, family name : ${family_name}, picture url: ${picture}`);

        let user = await User.findOne({email});

        if(!user){
            res.status(200).json({success: true, message: "user doesn't exist!", redirectUrl: "/error"});
        } else {
            res.status(200).json({success: true, message: "user logged in!", redirectUrl: "/dashboard"});
        }
    } catch(err){
        console.error(err);
        res.status(400).json({error: 'invalid token'});
    }
    
});







const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} !`);
});





