const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
var cookieParser = require('cookie-parser');
const dotenv =require('dotenv');

const app=express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
// const io = new Server(server)

const shopR=require("./routes/shop")
const PORT = 20617;

app.engine(
    "hbs",
    exphbs.engine({
        extname: "hbs",
        defaultLayout: "main.hbs",
        partialsDir: [path.join(__dirname, "views/partials")],
        helpers: {},
    })
);



dotenv.config();
app.set("view engine", "hbs");

app.use(cookieParser());
app.use("/public/css", express.static("public/css"));
app.use("/public/js", express.static("public/js"));
app.use(express.static(path.join(__dirname, "js")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const io=new Server(server,{
    cors:{
        origin:"http://localhost:20617",
        methods:["GET","POST"]
    }
})


app.use("/shop",shopR)

io.on('connection',(socket)=>{
    console.log("connect")
  })
//

app.use((err, req, res, next) => {
    const statusCode = err.statusCode | 500;
    res.status(statusCode).send(err.message);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/`);
});
