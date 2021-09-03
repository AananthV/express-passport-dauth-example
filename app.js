const express = require('express')
const passport = require('passport')
const { default: DAuthStrategy } = require('passport-delta-oauth2')

const app = express()
const port = 3000

const DAUTH_CLIENT_ID = 'l3g2JXfJmcSIRGl2'
const DAUTH_CLIENT_SECRET = '1~C-DA_Kgqk8_pZauukiGxbYEULGm8p8'
const DAUTH_CALLBACK_URL = 'http://localhost:3000/auth/dauth/callback'

passport.use(
    new DAuthStrategy({
        clientID: DAUTH_CLIENT_ID,
        clientSecret: DAUTH_CLIENT_SECRET,
        callbackURL: DAUTH_CALLBACK_URL
    },
        (accessToken, refreshToken, profile, cb) => {
            return cb(null, profile)
        }
    ))

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

app.use(require('cookie-parser')());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req, res) => {
    res.send(`<a href="https://auth.delta.nitt.edu/authorize?client_id=${DAUTH_CLIENT_ID}&redirect_uri=${encodeURIComponent(DAUTH_CALLBACK_URL)}&response_type=code&grant_type=authorization_code&state=sdafsdghb&scope=email+openid+profile+user&nonce=bscsbascbadcsbasccabs">Login with DAuth</a>`)
})

app.get(
    '/auth/dauth/callback',
    passport.authenticate('dauth', { failureRedirect: '/', scope: 'user' }),
    (req, res) => {
        res.json(req.user)
    }
)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})