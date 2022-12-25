const pgUser = require("../models/pgUser");
const jwt= require("jsonwebtoken")
let refreshTokens=[]
const authController = {
    render: (req, res, next) => {
        return res.render("userlogin");
    },

    renderRegister: (req, res, next) => {
        return res.render("userregister");
    },
    
    handleRegister: async (req, res, next) => {
        const data = req.body;
        try {
            const result = await pgUser.addUser(data);
            if (typeof result === "string") {
                let mess="username has already existed"
                return res.render("userregister",{data,mess});
            }
            return res.status(200).json({ result: "redirect", url: "/auth/login" });
        } catch (err) {
            console.log(err);
        }
    },

    handleLogin: async (req, res, next) => {
        const data = req.body;
        try {
            const result = await pgUser.checkLoginUser(data);
            if (result !== false) {
                const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '30s',
                });
                const refreshToken = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET);
                refreshTokens.push(refreshToken);
                // res.cookie('token', accessToken).send('cookie set');
                res.cookie("token", accessToken, {maxAge: parseInt(data.time)*1000})
                return res.status(200).json({ result: "redirect", url: "http://localhost:20617/shop"});
            } else {
                return res.status(200).json("Login failed!");
            }
        } catch (err) {
            console.log(err);
        }
    },

    handleLogout: (req, res, next) => {
        res.cookie('token', '', { maxAge: 1 });
        function delete_cookie(name) {
            req.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }
        delete_cookie("token")
        const refreshToken = req.body.token;
        refreshTokens = refreshTokens.filter((refToken) => refToken !== refreshToken);
        return res.render("userlogin");
    },

    findAll: async (req, res, next) => {
        try {
            const data = await pgUser.allUser();
            return res.status(200).json(data);
        } catch (err) {
            return res.status(500).json(err);
        }
    },
};

module.exports = authController;
