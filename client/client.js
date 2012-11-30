Template.freshview.questions = function() {
  return Questions.find({});
};

Template.groupview.groups = function() {
  return [
  	{ group_link:'questions', group_name:'Questions'},
  	{ group_link:'tags', group_name:'Tags'},
  	{ group_link:'users', group_name:'Users'},
  	{ group_link:'badges', group_name:'Badges'},
  	{ group_link:'unanswered', group_name:'Answered'}
  ];
}

Template.freshview.events({
  'click .new-topic': function (e) {
    e.preventDefault();
    Router.navigate('new');
  }
});

formData = function(form) {
  var data = {};
  var array = $(form).serializeArray();
  _.each(array, function(objField){
    data[objField.name] = objField.value;
  });
  return data;
}

usernameof = function(userId) {
  var _ref;
  return (_ref = Meteor.users.findOne({
    _id: userId
  })) != null ? _ref.profile.name : void 0;
};

userphotoof = function(userid) {
  var _ref;
  return (_ref = Meteor.users.findOne({
    _id: userId
  })) != null ? "https://graph.facebook.com/" + _ref.profile.facebook.username + "/picture" : void 0;
};


view_helpers = {
  usernameof: function() {
    return usernameof(this.user_id);
  },
  userphotoof: function(size) {
    return userphotoof(this.user_id);
  }
};

Template.question_item.helpers(view_helpers);
Template.question_item.helpers({
  tags: function() {
  	var tagIds = this.tags;
  	var tags = [];
  	_.each(tagIds, function(tag){
  		console.log(tag);
  		tags.push(Tags.findOne({_id:tag.tag_id}));
  	});
  	console.log(tags);
  	return tags;
  }
});

Template.new.events({
  'click .submit-question': function(e) {
    e.preventDefault();
    var form = $(e.target).parent('form');
    var title = form.find('input[name="title"]').val();
    var content = form.find('textarea[name="content"]').val();
    var tags = form.find('input[name="tags"]').val();
    if (tags) tags = tags.split(',');
    tagIds = [];
    _.each(tags, function(id){
      if(!Tags.find({text:id}).count() && !Tags.find({id:id}).count()) {
      	var insert_id = Tags.insert({
      	  text: id
      	});
      	tagIds.push({tag_id: insert_id});
      } else {
      	tagIds.push({tag_id: insert_id});
      }
    });
    
    topic_id = Questions.insert({
    	title: title,
    	content: content,
    	tags: tagIds,
    	user_id: Meteor.userId()
    });
    console.log(topic_id);
  }
});

Template.topbar.helpers({
  logined: function() {
    return Meteor.user();
  },
  member: function() {
    return Meteor.user();
  }
});

Template.topbar.events({
  'click #fb-login': function() {
    Meteor.loginWithFacebook({
    }, function(err){
    	console.log(err);
    });
  }
});

FVRouter = Backbone.Router.extend({
  routes: {
    "new": "createNew"
  },
  createNew: function() {
    $('body').html(Template.new());
  }
});

Meteor.subscribe('tags', function () {
	var select = $('#new-question-form').find('input[name="tags"]').select2({
		id: '_id',
		createSearchChoice:function(term, data) { 
			console.log('term' + term);
			console.log( data);
			if ($(data).filter(function() { return this.text.localeCompare(term)===0; }).length===0) {return {_id:term, text:term};} },
		data: Tags.find().fetch(),
		multiple: true
	});
});



var Router = new FVRouter;

Meteor.startup(function() {
  Backbone.history.start({pushState:true});
});