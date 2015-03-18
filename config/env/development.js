/**
 * Expose
 */

module.exports = {
  db: "mongodb://localhost:27017/meetmarket",
  facebook: {
    clientID: "1458988301053397",
    clientSecret: "b7292741b1599d17d35a9c67b3d8e83c",
    callbackURL: "http://localhost:3030/auth/facebook/callback"
    // callbackURL: https://shop-socialbutterfly.rhcloud.com/auth/facebook/callback
  },
  google: {
    clientID: "ID",
    clientSecret: "SECRET",
    callbackURL: "http://localhost:3030/auth/google/callback"
  }
};