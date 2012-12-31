Meteor.startup(function() {

  Meteor.publish("tags", function() {
    return Tags.find();
  });

  //Prod
  // if (!Accounts.loginServiceConfiguration.findOne({
    // service : 'facebook'
  // })) {
    // Accounts.loginServiceConfiguration.insert({
      // service : 'facebook',
      // appId : "497675416943953",
      // secret : "fe188886366e28f4f6d3645744b892ab"
    // });
// 
  // }
  
  //Dev
  if (!Accounts.loginServiceConfiguration.findOne({
    service : 'facebook'
  })) {
    Accounts.loginServiceConfiguration.insert({
      service : 'facebook',
      appId : "504528589581167",
      secret : "0c060d906ffa8195b2dc516d6d7f32ea"
    });

  }

  Meteor.publish("allUserData", function() {
    return Meteor.users.find({}, {
      fields : {
        'questions' : 1,
        'tags': 1,
        'answers': 1,
        'createdAt': 1,
        'questionsVisited': 1
      }
    });
  });

  Accounts.onCreateUser(function(options, user) {
    if (options.profile) {// maintain the default behavior
      user.profile = options.profile;
    }
    // get profile data from Facebook
    var result = Meteor.http.get("https://graph.facebook.com/me", {
      params : {
        access_token : user.services.facebook.accessToken
      }
    });
    if (!result.error && result.data) {
      // if successfully obtained facebook profile, save it off
      user.profile.facebook = result.data;
    }
    return user;
  });
});
