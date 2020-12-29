const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const { json } = require("body-parser");
const app = express();
require('dotenv').config();


app.use(bodyParser.urlencoded({extended:true}));

app.get("/", (req,res) =>{
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req,res) => {

  let searchWord = req.body.search;
  const apiKey = process.env.API_KEY;
  const url = "https://bestapi-ted-v1.p.rapidapi.com/transcriptFreeText?size=1&text=" + searchWord + "&rapidapi-key="+ apiKey;


  https.get(url, (response) => {

    let req = https.request(url, function (response) {
      let chunks = [];
    
      response.on("data", function (chunk) {
        console.log(chunk);
        chunks.push(chunk);
      });
    
      response.on("end", function () {
        var body = Buffer.concat(chunks);
        console.log(body);

        const jsonFormat = JSON.parse(body);
        console.log(jsonFormat[0].youTubeID);

        let youTubeID = jsonFormat[0].youTubeID;

        let imgUrl = "https://img.youtube.com/vi/" + youTubeID + "/hqdefault.jpg";



        res.send("<img src=" + imgUrl + ">")
        
      });
    });
    
    req.end();



    // let stockData = ''; // Initialize an empty variable for the data
 
    // response.on("data", function(data){
    //   stockData += data; // this function gets called about 4 times.
    // });
 
    
  })
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
