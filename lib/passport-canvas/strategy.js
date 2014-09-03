/**
 * Module dependencies.
 */
var util = require('util')
  , OAuth2Strategy = require('passport-oauth').OAuth2Strategy
  , InternalOAuthError = require('passport-oauth').InternalOAuthError;


/**
 * `Strategy` constructor.
 *
 * The Canvas authentication strategy authenticates requests by delegating to
 * Canvas using the OAuth 2.0 protocol.
 *
*/
function Strategy(options, verify) {

  options = options || {};
  options.providerURL = options.providerURL || 'https://canvas.instructure.com';
  options.providerName = options.providerName || 'canvas';

  var providerURL = options.providerURL;

  options.tokenURL = providerURL + "/login/oauth2/token";
  options.authorizationURL = providerURL + "/login/oauth2/auth";

  OAuth2Strategy.call(this, options, verify);

  this.name = options.providerName;
  options.sessionKey = "oauth:" + this.name;
  this._userProfileURL = providerURL + "/api/v1/users/self/profile";

}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);


/**
 * Retrieve user profile from Canvas.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `canvas`
 *   - `email`            the user's Canvas email
 *   - `name`             the user's Canvas username
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  var self = this;

  this._oauth2.get(this._userProfileURL, accessToken, function (err, body, res) {
    if (err) { return done(new InternalOAuthError('failed to fetch user profile', err)); }
    
    try {
      var json = JSON.parse(body);
      
      var profile = {
        provider: self.name,
        name: json.name,
        email: json.primary_email,
        canvasUserId: json.id
      };

      profile._raw = body;
      profile._json = json;
      
      done(null, profile);
    } catch(e) {
      done(e);
    }
  });
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
