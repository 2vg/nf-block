'use strict'

const fs = require('fs'),
      Tx = require('twxauth'),
      Twit = require('twit'),
      consumerKey = "3nVuSoBZnx6U4vzUxf5w", //Twitter for Android
      consumerSecret = "Bcs59EFbbsdF6Sl9Ng71smgStWEGwXXKSjYvPVt7qys",
      username = "Your Twitter Username",
      password = "Your Twitter Password";

(async() => {
  let following, follower;
  
  const credentials = await Tx.twxauth(consumerKey, consumerSecret, username, password);
  
  const T = new Twit({
    consumer_key:         consumerKey,
    consumer_secret:      consumerSecret,
    access_token:         credentials.accessToken,
    access_token_secret:  credentials.accessTokenSecret,
  });
  
  following = await T.get('friends/ids', { screen_name: username, stringify_ids: true, count: 5000 })
    .catch(async(err) => {
      console.log(err);
    })
    .then(async(res) => {
      return res.data.ids;
    });
  
  follower = await T.get('followers/ids', { screen_name: username, stringify_ids: true, count: 5000 })
    .catch(async(err) => {
      console.log(err);
    })
    .then(async(res) => {
      return res.data.ids;
    });
  
  for(const v of following) {
    const i = follower.indexOf(v);
    
    if(i >= 0) {
      follower.splice(i, 1);
    }
  }
  
  for(const v of follower) {
    await T.post('blocks/create', { id: v })
      .catch(async(err) => {
        console.log(err);
      })
      .then(async(res) => {
        T.post('blocks/destroy', { id: v })
      });
  }
  
  console.log("all done.");
})();