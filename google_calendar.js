const express = require("express");
const app = express();
const session = require("express-session"); // Add this line
const port = 8000;
const passport = require("passport");
var GoogleStrategy = require("passport-google-oauth20").Strategy;
const Meeting = require("google-meet-api").meet;

const clientID =
    "549406432516-4800q06ehbindcne047ilgdmdr2igoqc.apps.googleusercontent.com";
const clientSecret = "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";

// Add this middleware to set up sessions
app.use(
    session({
        secret: "your-secret-key", // replace with a strong secret key
        resave: false,
        saveUninitialized: true,
    })
);

passport.use(
    new GoogleStrategy(
        {
            clientID: clientID,
            clientSecret: clientSecret,
            callbackURL: "http://localhost:8000/auth/callback",
        },
        function (accessToken, refreshToken, profile, cb) {
            Meeting({
                clientId: clientID,
                clientSecret: clientSecret,
                refreshToken: refreshToken,
                date: "2023-12-25",
                time: "11:59",
                summary: "summary",
                location: "location",
                description: "description",
                checking: 0,
            })
                .then(function (result) {
                    console.log(result);
                })
                .catch((error) => {
                    console.log(error);
                });
            return cb(null, profile);
        }
    )
);

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

app.use(passport.initialize());
app.use(passport.session());

app.get(
    "/auth/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    function (req, res) {
        res.redirect("/new-meeting");
    }
);

app.get(
    "/auth/google",
    passport.authenticate("google", {
        scope: ["profile", "https://www.googleapis.com/auth/calendar"],
        accessType: "offline",
        prompt: "consent",
    })
);

app.get("/", function (req, res) {
    res.send("done");
});

app.get("/new-meeting", function (req, res) {
    if (req.isAuthenticated()) {
        res.send("New meeting link generated!");
    } else {
        res.redirect("/auth/google");
    }
});

app.listen(port, function (err) {
    if (err) {
        console.log("something wrong in starting server !!!");
        return;
    }
    return console.log("server is up and running on port ", port);
});
