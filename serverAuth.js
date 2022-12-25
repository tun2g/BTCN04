const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const jwt =require('jsonwebtoken');
const dotenv =require('dotenv');
var cookieParser = require('cookie-parser');
const {Server}=require("Socket.io")
const http=require("http")
const authR=require("./routes/auth")



const app = express();
const server=http.createServer(app)
const io=new Server(server)
dotenv.config();
app.use(cookieParser());
app.engine(
    "hbs",
    exphbs.engine({
        extname: "hbs",
        defaultLayout: "main.hbs",
        partialsDir: [path.join(__dirname, "views/partials")],
        helpers: {},
    })
);

app.set("view engine", "hbs");

app.use("/public/css", express.static("public/css"));
app.use("/public/js", express.static("public/js"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//
let refreshTokens = [];

app.post('/refreshToken', (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
    console.log(err, data);
    if (err) res.sendStatus(403);
    const accessToken = jwt.sign(
      { username: data.username },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: '150s',
      }
    );
    res.json({ accessToken });
  });
});


app.use("/auth",authR)



app.use((err, req, res, next) => {
    const statusCode = err.statusCode | 500;
    res.status(statusCode).send(err.message);
});

const PORT = 3113;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/`);
});
