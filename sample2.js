const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();
require('dotenv').config();


app.use(bodyParser.urlencoded({extended:true}));

app.get("/", (req,res) =>{
  res.sendFile(__dirname + "/index2.html");
});

var searchWord = "";
//formから送られてきたデータに対する処理
app.post("/", (req,res) => {

  searchWord = req.body.search;
  var videoId = req.body.videoId; 
  var apiKey = process.env.API_KEY;
  const subtitleUrl = "https://subtitles-for-youtube.p.rapidapi.com/subtitles/" + videoId +"?translated=None&type=None&lang=en&rapidapi-key="+ apiKey;

    let request = https.get(subtitleUrl, function (response) {
      let chunks = [];
      
      response.on("data", function (chunk) {
        console.log(chunk);
        chunks.push(chunk);
      });
    
      response.on("end", function () {
        let body = Buffer.concat(chunks);
        // console.log(body);

        const jsonFormatSub = JSON.parse(body);

        const searchedWord = jsonFormatSub.filter((element) => {
          return element.text.includes(searchWord) === true;
        });

        console.log(searchedWord);

        res.write("<p>" + searchedWord[0].text + "</p>");
        res.write(searchedWord[1].text);
        res.send();
        
      });
    });
    
    request.end();
  
});

app.listen(3001, () => {
  console.log("server is running on port 3001");
});
