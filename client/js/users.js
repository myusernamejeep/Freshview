//Users View
Template.usersview.helpers(view_helpers);
Template.usersview.users = function() {
  return Meteor.users.find();
};

//Users view single item
Template.user_item.helpers(view_helpers);
Template.user_item.events(view_events);
Template.user_item.helpers({
  tagof : function() {
    return Tags.findOne({
      _id : this.tag_id
    });
  }
});

//User Detail view
Template.userview.helpers(view_helpers);
Template.userview.events(view_events);
Template.userview.helpers({
  user : function() {
    return Meteor.users.findOne({
      _id : Session.get('user_id')
    });
  }, limit_answers : function() {
    var user_id = Session.get('user_id');
    var answers = Answers.find({user_id:user_id}, {sort: {votes: -1}});
    return answers.fetch().slice(0, 5);
  }, limit_questions : function() {
    var user_id = Session.get('user_id');
    var questions = Questions.find({user_id:user_id}, {sort: {votes: -1}});
    return questions.fetch().slice(0, 5);
  }, limit_tags : function() {
  	var user_id = Session.get('user_id');
    var user = Meteor.users.findOne({
      _id : Session.get('user_id')
    }, { fields : { 'tags': 1 } });
    if (user && user['tags']) {
      var tagids = user['tags'].slice(0, 5);
      var tags = Tags.find({_id : {
    	$in: _.pluck(tagids, "tag_id")
      }}).fetch();
      _.each(tagids, function(tagid){
        var tag = _.find(tags, function(tag){ return tag['_id'] === tagid['tag_id']; });
        if (tag) {
          tagid['text'] = tag['text'];
        } else {
          tagid['text'] = tagid['tag_id'];
        }
        
      });
      return tagids;
    }
  }
});

Template.user_info.helpers(view_helpers);