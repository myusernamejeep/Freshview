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

Template.new.events({
  'click .submit-question': function(e) {
    e.preventDefault();
    var form = $(e.target).parent('form');
    var title = form.find('input[name="title"]').val();
    var content = form.find('textarea[name="content"]').val();
    var tags = form.find('input[name="tags"]').val();
    console.log("tags " + tags);
    if (tags) tags = tags.split(',');
    topic_id = Questions.insert({
    	title: title,
    	content: content,
    	tags: tags
    });
    console.log(topic_id);
  }
});

Template.new.rendered = function() {
	console.log(_.pluck(Tags.find().fetch(), 'name'));
	
};

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
		tags: _.pluck(Tags.find().fetch(), 'name'),
		tokenSeparators: [",", " "],
		allowClear: true
	});
	
});



var Router = new FVRouter;

Meteor.startup(function() {
  Backbone.history.start({pushState:true});
});