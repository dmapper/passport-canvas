# Passport-Canvas

[Passport](http://passportjs.org/) strategy for authenticating with [Canvas](https://canvas.instructure.com/)
using the OAuth 2.0 API.

This module lets you authenticate using Canvas in your Node.js applications.
By plugging into Passport, Canvas authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install passport-canvas

## Usage

#### Configure Strategy

The Canvas authentication strategy authenticates users using a GitHub account
and OAuth 2.0 tokens.  The strategy requires a `verify` callback, which accepts
these credentials and calls `done` providing a user, as well as `options`
specifying a client ID, client secret, and callback URL.

    passport.use(new CanvasStrategy({
        clientID: CANVAS_CLIENT_ID,
        clientSecret: CANVAS_CLIENT_SECRET,
        callbackURL: "http://127.0.0.1:3000/auth/canvas/callback",
        providerURL: "https://canvas.instructure.com",
        providerName: "canvas"
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ canvasUserId: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'canvas'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/canvas',
      passport.authenticate('canvas'));

    app.get('/auth/canvas/callback', 
      passport.authenticate('canvas', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2011-2013 Jared Hanson <[http://jaredhanson.net/](http://jaredhanson.net/)>

