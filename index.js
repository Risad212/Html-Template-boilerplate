const fs = require('fs')
const path = require('path')
const express = require('express')
const AdmZip = require('adm-zip')
const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/home.html')
})

app.post('/', express.text(), (req, res) => {
  let projectName = req.body
  runProject(res, projectName)
})

async function runProject(res, projectName) {
  // join the folder name with path
  const dirPath = path.join(__dirname, `${projectName}`)

  /* =======================
    Folder Creation
  ========================== */

  fs.mkdirSync(`${projectName}`, (err) => {
    if (err) {
      console.log(err)
    }
  })

  /* =======================
    html file creation 
  ========================== */
  let htmlCode = `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>${projectName}</title>
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

  if (fs.existsSync(`${dirPath}/index.html`)) {
    console.log('index.html file already exist')
  } else {
    fs.writeFileSync(`${dirPath}/index.html`, `${htmlCode}`, (err) => {
      if (err) {
        console.log(err)
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

  if (fs.existsSync(`${dirPath}/style.css`)) {
    console.log('style.css file alreay exist')
  } else {
    fs.writeFileSync(`${dirPath}/style.css`, `${cssCode}`, (err) => {
      if (err) {
        console.log(err)
      }
    })
  }

  /* =======================
    js file creation 
  ========================== */
  if (fs.existsSync(`${dirPath}/app.js`)) {
    console.log('app.js file already exist')
  } else {
    fs.writeFileSync(
      `${dirPath}/app.js`,
      `console.log("hello world")`,
      (error) => {
        if (error) {
          console.log(error)
        }
      }
    )
  }

  //=======================================================
  // convert to zip folder

  const zip = new AdmZip()
  await zip.addLocalFolderPromise(dirPath)
  res.set('Content-Type', 'application/zip')
  res.set('Content-Disposition', `attachment; filename=${projectName}.zip`)
  res.end(await zip.toBufferPromise())
  fs.rmSync(dirPath, { recursive: true, force: true })
}

// extarnal css file Added
app.get('/home.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.css'))
})

//=====================================================
const PORT = process.env.PORT ?? 3000
app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`)
})