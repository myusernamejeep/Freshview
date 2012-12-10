//Tags view
Template.tagsview.tags = function() {
  return Tags.find();
};

//Tags view single item
Template.tag_item.helpers(view_helpers);

Template.tag_button.events({
  'click .tag-button' : function() {
    console.log(this);
    Router.navigate("questions/tagged/" + this.text, {
      trigger : true
    });
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