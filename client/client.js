Template.freshview.topics = function() {
  return Topics.find({});
};

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
  'submit form': function(e) {
    e.preventDefault();
    data = formData(e.currentTarget);
    console.log(data);
    topic_id = Topics.insert(data);
    console.log(topic_id);
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


var Router = new FVRouter;

Meteor.startup(function() {
  Backbone.history.start({pushState:true});
});