const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const PORT = 3000;
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const AdmZip = require("adm-zip");


app.get("/", (req, res) => {
   res.sendFile(__dirname + "/home.html");
 });
 


 app.post("/", (req, res) => {
   runProject(res,req.body.pName)
 });


 function runProject(res,Data){
    // get folder name from user
let folderName = Data

// join the folder name with path
const dirParth = path.join(__dirname, `${folderName}`)

/* =======================
    Folder Creation
  ========================== */
fs.mkdir(`${folderName}`, (err) =>{
    if(err){
        console.log(err);
    }
})

/* =======================
    html file creation 
  ========================== */
let htmlCode = `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>${folderName}</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
   
   <h2>Welcome To Html Template boilarplet

<script src="app.js"></script>
</body>
</html>`


if(fs.existsSync(`${dirParth}/index.html`)){
     console.log('index.html file already exist');
}else{
    fs.writeFileSync(`${dirParth}/index.html`, `${htmlCode}`, (err) =>{
        if(err){
            console.log(err);
        }
    })
}

/* =======================
    css file creation 
  ========================== */
let cssCode = `*{
   margin: 0;
   padding: 0;
   box-sizing: border-box;
 }
 body{
    font-family: Arial, Helvetica, sans-serif;
 }
 a{
    text-decoration: 'none';
    color: #000;
 }
 ul{
    list-style: none;
 }
`

if(fs.existsSync(`${dirParth}/style.css`)){
    console.log("style.css file alreay exist");
}else{
    fs.writeFileSync(`${dirParth}/style.css`, `${cssCode}`, (err) =>{
        if(err){
            console.log(err);
        }
    })
}

/* =======================
    js file creation 
  ========================== */
if(fs.existsSync(`${dirParth}/app.js`)){
    console.log('app.js file already exist');
}else{
    fs.writeFileSync(`${dirParth}/app.js`, `console.log("hello world")`, (error) =>{
        if(error){
            console.log(error);
        }
    })
}

//=======================================================
// convert to zip folder 

let uploadDir = fs.readdirSync(__dirname+`/${folderName}`)
   let zip = new AdmZip();

   for (let i = 0; i < uploadDir.length; i++) {
      zip.addLocalFile(__dirname+`/${folderName}/`+uploadDir[i])
   }

   let downloadName = `${folderName}.zip`;

   const data = zip.toBuffer();

   zip.writeZip(__dirname+"/"+downloadName)

   res.set('Content-Type', 'application/octet-stream');
   res.set('Content-Disposition', `attachment; filename=${downloadName}`);
   res.set('Content-Length',data.length);
   res.send(data);
 }
 
 app.listen(PORT, () => {
   console.log(`Server is running at ${PORT}`);
 });