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

