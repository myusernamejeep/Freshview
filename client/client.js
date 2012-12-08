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

Template.questionsview.helpers({
  //@ft:off
  questions : function() {
    var tag_text = Session.get('tag_text');
      if (tag_text) {
        var tag = Tags.findOne({text:tag_text});
        var tag_id = 0;
        if (tag) tag_id = tag._id;
        console.log(tag_id);
        return Questions.find({'tags.tag_id': tag_id});
      }
      return Questions.find();
    }
  //@ft:on
});

Template.tagsview.tags = function() {
  return Tags.find();
};

Template.usersview.users = function() {
  return Meteor.users.find();
};

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

formData = function(form) {
  var data = {};
  var array = $(form).serializeArray();
  _.each(array, function(objField) {
    data[objField.name] = objField.value;
  });
  return data;
}
usernameof = function(userId) {
  var _ref;
  return ( _ref = Meteor.users.findOne({
    _id : userId
  })) != null ? _ref.profile.name :
  void 0;
};

questionof = function(question_id) {
  return Questions.findOne({
    _id : question_id
  });
}
userphotoof = function(userId) {
  var _ref;
  return ( _ref = Meteor.users.findOne({
    _id : userId
  })) != null ? "https://graph.facebook.com/" + _ref.profile.facebook.username + "/picture" :
  void 0;
};

create_today = function() {
  var today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  return today;
};

create_tomorrow = function() {
  var today = new create_today();
  var tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  return tomorrow;
};

view_helpers = {
  usernameof : function() {
    return usernameof(this.user_id);
  }, userphotoof : function(size) {
    return userphotoof(this.user_id);
  }, questionof : function() {
    return questionof(this.question_id);
  }, fromnow : function(t) {
    return moment.utc(t).fromNow();
  }, countof : function(items) {
    if (items)
      return items.length;
    return 0;
  }, tagsof : function() {
    var tagIds = this.tags;
    var tags = [];
    _.each(tagIds, function(tag) {
      tags.push(Tags.findOne({
        _id : tag.tag_id
      }));
    });
    return tags;
  }, counttoday : function(items) {
    var today = create_today();
    var tomorrow = create_tomorrow();
    if (items) {
      return _.filter(items, function(item) {
        var created = new Date(item.created);
        return created > today && tomorrow > created;
      }).length;
    }
    return 0;
  }
};

Template.question_item.helpers(view_helpers);

Template.tag_item.helpers(view_helpers);

Template.tag_button.events({
  'click .tag-button' : function() {
    console.log(this);
    Router.navigate("questions/tagged/" + this.text, {
      trigger : true
    });
  }
});

Template.usersview.helpers(view_helpers);

Template.user_item.helpers(view_helpers);
Template.user_item.helpers({
  tagof : function() {
    return Tags.findOne({
      _id : this.tag_id
    });
  }
});
Template.userview.helpers(view_helpers);
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
  }
});

Template.userview.events({

});

Template.questionview.helpers(view_helpers);
Template.questionview.helpers({
  question_id : function() {
    return Session.get('question_id');
  }, question : function() {
    return Questions.findOne({
      _id : Session.get('question_id')
    });
  }, answers : function() {
    return Answers.find({
      question_id : Session.get('question_id')
    });
  }
});
Template.questionview.events({
  'click .btn-add-comment' : function(e) {
    e.preventDefault();
    var form = $(e.target).parent('div');
    var content = form.find('.input-add-comment').val();
    if (!content)
      return;
    //@ft:off
    Questions.update({_id:this.question_id}, {
      $push : {
        'comments' : {
          content: content,
          created: new Date(),
          user_id: Meteor.userId(),
          _id: Meteor.uuid()
        }
      }
    });
  },
  'click .comment' : function(e) {
    var comment = e.currentTarget;
    $(comment).find('.comment-group').show();
  }, 
  'click .icon-remove-sign' : function(e) {
    var question_id = $(e.target).data('question-id');
    console.log("questionid" + question_id);
    //@ft:off
    Questions.update({_id:question_id, 'comments._id':this._id}, {
      $pull: {comments: {_id:this._id}}
    });
  },
  //@ft:on
  'click .answer' : function(e) {
    var answerBox = e.currentTarget;
    var content = $(answerBox).find('.input-add-answer').val();
    console.log(content);
    if (!content)
      return;
    //@ft:off
    console.log(this.data);
    answer_id = Answers.insert({
      content : content, 
      user_id : Meteor.userId(), 
      question_id : this._id,
      created : new Date(), 
      updated : new Date()
    });
    Questions.update({_id:this._id}, {
      $push : {answers: answer_id}
    });
    Meteor.users.update({_id:Meteor.userId()}, {
      $push : {answers: answer_id}
    });
  },
  'click .question-vote-down': function() {
    if (!Questions.find({_id:this._id, 'votes.user_id':Meteor.userId()}).count()) {
      return;
    }
    Questions.update({_id:this._id, 'votes.user_id':Meteor.userId()}, {
      $pull: {votes: {user_id:Meteor.userId()}}
    });
  },
  'click .question-vote-up': function() {
    if (Questions.find({_id:this._id, 'votes.user_id':Meteor.userId()}).count()) {
      return;
    }
    Questions.update({_id:this._id}, {
      $push : {votes: {
        user_id: Meteor.userId(),
        created: new Date()
      }}      
    })
  },
  'click .answer-vote-up': function() {
    if (Answers.find({_id:this._id, 'votes.user_id':Meteor.userId()}).count()) {
      return;
    }
    Answers.update({_id:this._id}, {
      $push : {votes: {
        user_id: Meteor.userId(),
        created: new Date()
      }}      
    })
  },
  'click .answer-vote-down': function() {
    if (!Answers.find({_id:this._id, 'votes.user_id':Meteor.userId()}).count()) {
      return;
    }
    Answers.update({_id:this._id, 'votes.user_id':Meteor.userId()}, {
      $pull: {votes: {user_id:Meteor.userId()}}
    });
  },
  //@ft:on
});

//@ft:off
Template.newview.events({
  //@ft:on
  'click .submit-question' : function(e) {
    e.preventDefault();
    var form = $(e.target).parent('form');
    var title = form.find('input[name="title"]').val();
    var content = form.find('textarea[name="content"]').val();
    var tags = form.find('input[name="tags"]').val();
    if (tags)
      tags = tags.split(',');
    tagIds = [];
    console.log('get tags:');
    console.log(tags);
    _.each(tags, function(id) {
      if (!id) {
        return;
      }
      //@ft:off
      if (!Tags.findOne({ text : id }) && !Tags.findOne({ _id : id })) {
        var insert_id = Tags.insert({ text : id });
        tagIds.push({ tag_id : insert_id });
      } else {
        tagIds.push({ tag_id : id });
      }
    });
    console.log('get tagIds:');
    console.log(tagIds);
    //@ft:on
    topic_id = Questions.insert({
      title : title, content : content, tags : tagIds, user_id : Meteor.userId(), created : new Date(), updated : new Date(), views: 0
    });

    console.log('push topic to user');
    Meteor.users.update({
      _id : Meteor.userId()
    }, {
      $push : {
        'questions' : {
          question_id : topic_id
        }
      }
    });

    _.each(tagIds, function(tagId) {
      var tag_id = tagId['tag_id'];
      //@ft:off
      if (Meteor.users.find({  _id : Meteor.userId(), 'tags.tag_id' : tag_id  }, {fields:{_id:1, tags:1}}).count()) {
        console.log('inc');
        Meteor.users.update({ _id : Meteor.userId(), 'tags.tag_id' : tag_id }, {
          $inc : { 'tags.$.count' : 1 }
        });
        console.log('inc finish');
      } else {
        console.log('push');
        Meteor.users.update({
          _id : Meteor.userId()
        }, {
          $push : { 'tags' : { tag_id : tag_id, count : 1 } }
        });
        console.log('push finish');
      }
      console.log("update questions in tags");
      Tags.update({ _id : tag_id }, {
        $push : {  questions : {question_id:topic_id, created : new Date()} }
      });
    });
    
    Router.navigate("questions/" + topic_id, {
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

var Router = new FVRouter;

Meteor.startup(function() {
  Meteor.subscribe('allUserData');
  Backbone.history.start({
    pushState : true
  });
});
