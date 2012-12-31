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
      var tag = Tags.findOne({
        _id : tag.tag_id
      });
      if (tag) {
        tags.push(tag);
      }
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

view_events = {
  'click a.navigation-link': function(e) {
  	e.preventDefault();
    Router.navigate($(e.target).attr('href'), {
      trigger : true
    });
  }
}
