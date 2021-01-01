const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();
require('dotenv').config();


app.use(bodyParser.urlencoded({extended:true}));
console.log("1")

app.get("/", (req,res) =>{
  res.sendFile(__dirname + "/index.html");
});

//formから送られてきたデータに対する処理
app.post("/", (req,res) => {
  console.log("2");

  let searchWord = req.body.search.toLowerCase(); 
  const apiKey = process.env.API_KEY;
  let TedUrl = "https://bestapi-ted-v1.p.rapidapi.com/transcriptFreeText?size=1&text=" + searchWord + "&rapidapi-key="+ apiKey;

//tedURlからvideoIdを取得　そしてそのidからサムネイルを描画
    let request = https.request(TedUrl, function (response) {
      console.log("3")

      let chunks = [];
      
      response.on("data", function (chunk) {
        console.log("4");

        // console.log(chunk);
        chunks.push(chunk);
      });
    
      response.on("end", function () {
        console.log("5");

        let body = Buffer.concat(chunks);

        const jsonFormatData = JSON.parse(body);
        let youTubeID = jsonFormatData[0].youTubeID;

         let imgUrl = "https://img.youtube.com/vi/" + youTubeID + "/hqdefault.jpg";
         
         let subtitleUrl = "https://subtitles-for-youtube.p.rapidapi.com/subtitles/" + youTubeID + "?translated=None&type=None&lang=en&rapidapi-key="+ apiKey
         

        //  上で取得したvideoIdから字幕を取得　かつ、検索ワードから該当の字幕箇所を取り出し描画 TedUrlがendまで行ってからここの処理を走るように
        //  https.get(subtitleUrl, (response) => {
       
           let req2 = https.get(subtitleUrl, function (res2) {
            console.log("6");

             let chunks2 = [];
           
             res2.on("data", function (chunk2) {
               chunks2.push(chunk2);
             });
           
             res2.on("end", function () {
              console.log("7");

               let body2 = Buffer.concat(chunks2);
       
               const SubtitleData = JSON.parse(body2);
               console.log("8");

              
       
               const subtitleWord = SubtitleData.filter((element) => {
                 return element.text.includes(searchWord) === true;
               });
               console.log("--------------Target here----------------");
       
               console.log(subtitleWord);

              //  res2.write(subtitleWord[0].text);
              res.write("<h1>" + subtitleWord[0].text + "</h1>");
              res.write("<img src=" + imgUrl + "/>");
               res.send();
             });
           });
           
           req2.end();
         
        // res.send()
      });
    });
    
    request.end();




  // })
});

app.listen(3000, () => {
  console.log("server is running on port 3002");
});


// react + node + 