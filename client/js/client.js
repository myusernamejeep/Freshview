if (typeof Handlebars !== 'undefined') {
  Handlebars.registerHelper('truncate', function(count, text) {
    if (! _.isString(text))
      text = '';
	if (text.length < count) {
	  return text;
	} else {
	  return text.substring(0, count - 3) + "...";
	}
  });
}

Template.freshview.helpers({
  renderPage : function() {
    var name = Session.get('main_template_name');
    var templateName = name + "view";
    if(Session.equals('main_template_name', 'question')) {
      console.log(Session.get('question_id'));
      Questions.update({
        _id: Session.get('question_id')
      }, {
        $inc: {
          views: 1
        }
      });
    }
    if (Template[templateName])
      return new Handlebars.SafeString(Template[templateName]());
    else
      return new Handlebars.SafeString(Template['questionsview']());
  }
});



Template.groupview.groups = function() {
  return [{
    group_link : 'questions', group_name : 'Questions'
  }, {
    group_link : 'tags', group_name : 'Tags'
  }, {
    group_link : 'users', group_name : 'Users'
  }, {
    group_link : 'badges', group_name : 'Badges'
  }, {
    group_link : 'unanswered', group_name : 'UnAnswered'
  }];
};

Template.groupview.events({
  'click a' : function(e) {
    e.preventDefault();
    Router.navigate($(e.target).attr('href'), {
      trigger : true
    });
  }
});

//@ft:on
Template.topbar.helpers({
  logined : function() {
    return Meteor.user();
  }, member : function() {
    return Meteor.user();
  }
});

Template.topbar.events({
  'click #fb-login' : function() {
    Meteor.loginWithFacebook({
    }, function(err) {
      console.log(err);
    });
  }, 'click #btn-logout' : function() {
    Meteor.logout();
  }
});

FVRouter = Backbone.Router.extend({
  //@ft:off
  routes : {
    ":group" : 'show_group', 
    "questions/:id" : 'show_question',
    "questions/tagged/:id" : 'show_questions_with_tag',
    "users/:id" : 'show_user'
  },
  //@ft:on
  show_group : function(group) {
    Session.set('main_template_name', group);
  }, show_question : function(id) {
    Session.set('main_template_name', 'question');
    Session.set('question_id', id);
  }, show_questions_with_tag : function(tag_text) {
    Session.set('main_template_name', 'questions');
    Session.set('tag_text', tag_text);
  }, show_user : function(user_id) {
    Session.set('main_template_name', 'user');
    Session.set('user_id', user_id);
  }
});


var Router = new FVRouter;

Meteor.startup(function() {
  Meteor.subscribe('allUserData');
  Backbone.history.start({
    pushState : true
  });
});

Meteor.subscribe('tags', function() {
  var select = $('#new-question-form').find('input[name="tags"]').select2({
    id : '_id', createSearchChoice : function(term, data) {
      console.log('term' + term);
      console.log(data);
      if ($(data).filter(function() {
        return this.text.localeCompare(term) === 0;
      }).length === 0) {
        return {
          _id : term, text : term
        };
      }
    }, data : Tags.find().fetch(), multiple : true
  });
});
