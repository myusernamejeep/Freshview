Template.questionsview.questions = function() {
  return Questions.find();
};

Template.tagsview.tags = function() {
  return Tags.find();
};

Template.usersview.users = function() {
  return Meteor.users.find();
};

Template.groupview.groups = function() {
  return [{
    group_link : 'questions',
    group_name : 'Questions'
  }, {
    group_link : 'tags',
    group_name : 'Tags'
  }, {
    group_link : 'users',
    group_name : 'Users'
  }, {
    group_link : 'badges',
    group_name : 'Badges'
  }, {
    group_link : 'unanswered',
    group_name : 'UnAnswered'
  }];
};

Template.freshview.helpers({
  is_questions_view : function() {
    return Session.get('main_template_name') === 'questions';
  },
  is_new_view : function() {
    return Session.get('main_template_name') === 'new';
  },
  is_tags_view : function() {
    return Session.get('main_template_name') === 'tags';
  },
  is_users_vew : function() {
    return Session.get('main_template_name') === 'users';
  }
});

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

userphotoof = function(userId) {
  var _ref;
  return ( _ref = Meteor.users.findOne({
    _id : userId
  })) != null ? "https://graph.facebook.com/" + _ref.profile.facebook.username + "/picture" :
  void 0;
};

view_helpers = {
  usernameof : function() {
    return usernameof(this.user_id);
  },
  userphotoof : function(size) {
    return userphotoof(this.user_id);
  },
  fromnow : function(t) {
    return moment.utc(t).fromNow();
  },
  count : function(items) {
    return items.length;
  }
};

Template.question_item.helpers(view_helpers);
Template.question_item.helpers({
  tags : function() {
    var tagIds = this.tags;
    var tags = [];
    _.each(tagIds, function(tag) {
      tags.push(Tags.findOne({
        _id : tag.tag_id
      }));
    });
    return tags;
  }
});

Template.tag_item.helpers(view_helpers);

Template.usersview.helpers(view_helpers);

Template.
new  .events({
  'click .submit-question' : function(e) {
    e.preventDefault();
    var form = $(e.target).parent('form');
    var title = form.find('input[name="title"]').val();
    var content = form.find('textarea[name="content"]').val();
    var tags = form.find('input[name="tags"]').val();
    if (tags)
      tags = tags.split(',');
    tagIds = [];
    _.each(tags, function(id) {
      if (!id) {
        return;
      }
      if (!Tags.findOne({
        text : id
      }) && !Tags.findOne({
        _id : id
      })) {
        var insert_id = Tags.insert({
          text : id
        });
        tagIds.push({
          tag_id : insert_id
        });
      } else {
        console.log(id);
        tagIds.push({
          tag_id : id
        });
      }
    });

    topic_id = Questions.insert({
      title : title,
      content : content,
      tags : tagIds,
      user_id : Meteor.userId(),
      created : new Date(),
      updated : new Date()
    });

    _.each(tagIds, function(tagId) {
      Tags.update({
        _id : tagId['tag_id']
      }, {
        $push : {
          question_ids : tagId['tag_id']
        }
      });
    });
  }
});

Template.topbar.helpers({
  logined : function() {
    return Meteor.user();
  },
  member : function() {
    return Meteor.user();
  }
});

Template.topbar.events({
  'click #fb-login' : function() {
    Meteor.loginWithFacebook({
    }, function(err) {
      console.log(err);
    });
  },
  'click #btn-logout' : function() {
    Meteor.logout();
  }
});

FVRouter = Backbone.Router.extend({
  routes : {
    ":group" : 'show_group'
  },
  show_group : function(group) {
    Session.set('main_template_name', group);
  }
});

Meteor.subscribe('tags', function() {
  var select = $('#new-question-form').find('input[name="tags"]').select2({
    id : '_id',
    createSearchChoice : function(term, data) {
      console.log('term' + term);
      console.log(data);
      if ($(data).filter(function() {
        return this.text.localeCompare(term) === 0;
      }).length === 0) {
        return {
          _id : term,
          text : term
        };
      }
    },
    data : Tags.find().fetch(),
    multiple : true
  });
});

var Router = new FVRouter;

Meteor.startup(function() {
  Backbone.history.start({
    pushState : true
  });
});
