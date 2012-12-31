//Question lists
Template.questionsview.helpers({
  //@ft:off
  questions : function() {
    var tag_text = Session.get('tag_text');
    if (tag_text) {
      var tag = Tags.findOne({text:tag_text});
      var tag_id = 0;
      if (tag) tag_id = tag._id;
      return Questions.find({'tags.tag_id': tag_id});
    }
    console.log(Questions.find().fetch());
    return Questions.find();
  },
  is_tagged_questions: function() {
    return Session.get('tag_text');
  }
  //@ft:on
});

//QUestion list item
Template.question_item.helpers(view_helpers);
Template.question_item.events(view_events);


//Single question view
Template.questionview.helpers(view_helpers);
Template.questionview.events(view_events);
Template.questionview.helpers({
  question_id : function() {
    return Session.get('question_id');
  }, question : function() {
    var questionId = Session.get('question_id');
    // // check if the user hasn't visited this question already
    // var user = Meteor.users.findOne({_id:Meteor.userId(),questionsVisited:{$ne:questionId}});
// 
    // if (user) {
      // // otherwise, increment the question view count and add the question to the user's visited page
      // Meteor.users.update({_id:Meteor.userId()},{$addToSet:{questionsVisited:questionId}});
      // Questions.update({_id: questionId}, {$inc: {views: 1}});
    // }
    
    return Questions.findOne({
      _id : questionId
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
    if (!Meteor.userId()) return;
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
  'click .comments' : function(e) {
    var commentLink = e.target;
    if (!$(commentLink).hasClass('comments-link')) {
      return;
    }
    var comment = e.currentTarget;
    $(commentLink).hide();
    $(comment).find('.comment-form').show();
  }, 
  'click .icon-remove-sign' : function(e) {
    var question_id = $(e.target).data('question-id');
    //@ft:off
    Questions.update({_id:question_id, 'comments._id':this._id}, {
      $pull: {comments: {_id:this._id}}
    });
  },
  //@ft:on
  'click .answer' : function(e) {
    var answerBox = e.currentTarget;
    if (!Meteor.userId()) return;
    var content = $(answerBox).find('.input-add-answer').val();
    if (!content)
      return;
    //@ft:off
    answer_id = Answers.insert({
      content : content, 
      user_id : Meteor.userId(), 
      question_id : this._id,
      created : new Date(), 
      updated : new Date()
    });
    Questions.update({_id:this._id}, {
      $addToSet : {answers: answer_id}
    });
    Meteor.users.update({_id:Meteor.userId()}, {
      $addToSet : {answers: answer_id}
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
      $addToSet : {votes: {
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
      $addToSet : {votes: {
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

//Create new question
//@ft:off
Template.newview.rendered = function() {
  var select = $('#new-question-form').find('input[name="tags"]').select2({
    id : '_id', createSearchChoice : function(term, data) {
      if ($(data).filter(function() {
        return this.text.localeCompare(term) === 0;
      }).length === 0) {
        return {
          _id : term, text : term
        };
      }
    }, data : Tags.find().fetch(), multiple : true
  });
  var editor = new wysihtml5.Editor("wysihtml5-textarea", { // id of textarea element
    toolbar:      "wysihtml5-toolbar", // id of toolbar element
    parserRules:  wysihtml5ParserRules // defined in parser rules set 
  });
};

Template.newview.events({
  //@ft:on
  'click .submit-question' : function(e) {
    e.preventDefault();
    if (!Meteor.userId()) return;
    var form = $(e.target).parent('form');
    var title = form.find('input[name="title"]').val();
    var content = form.find('textarea[name="content"]').val();
    if (!content) return;
    if (!title) return;
    var tags = form.find('input[name="tags"]').val();
    if (tags)
      tags = tags.split(',');
    tagIds = [];
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
    //@ft:on
    topic_id = Questions.insert({
      title : title, content : content, tags : tagIds, user_id : Meteor.userId(), created : new Date(), updated : new Date(), views: 0
    });

    Meteor.users.update({
      _id : Meteor.userId()
    }, {
      $addToSet : {
        'questions' : {
          question_id : topic_id
        }
      }
    });

    _.each(tagIds, function(tagId) {
      var tag_id = tagId['tag_id'];
      //@ft:off
      if (Meteor.users.find({  _id : Meteor.userId(), 'tags.tag_id' : tag_id  }, {fields:{_id:1, tags:1}}).count()) {
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
        $push : {  questions : {question_id:topic_id} }
      });
    });
    
    Router.navigate("questions/" + topic_id, {
      trigger : true
    });
  }
});
