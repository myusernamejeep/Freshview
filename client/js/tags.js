//Tags view
Template.tagsview.tags = function() {
  return Tags.find();
};

//Tags view single item
Template.tag_item.helpers(view_helpers);

Template.tag_button.events({
  'click .tag-button' : function() {
    Router.navigate("questions/tagged/" + this.text, {
      trigger : true
    });
  }
});

Template.sidebar_tags_view.helpers(view_helpers);
Template.sidebar_tags_view.events(view_events);
Template.sidebar_tags_view.tags = function() {
  return Tags.find();
};

