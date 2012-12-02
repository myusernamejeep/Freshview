Questions = new Meteor.Collection("questions");
Tags = new Meteor.Collection("tags");
Answers = new Meteor.Collection("answers");

simpleAcl = {
  insert: function() {
    return true;
  },
  update: function() {
    return true;
  },
  remove: function(userId, doc) {
    return userId === doc.userId;
  }
};

Questions.allow(simpleAcl);
Answers.allow(simpleAcl);
Tags.allow(simpleAcl);
Meteor.users.allow(simpleAcl);
