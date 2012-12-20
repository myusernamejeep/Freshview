wysihtml5.commands.insertQuote = {
  // exec usually behaves like a toggle
  // if the format is applied then undo it (and vica versa)
  exec: function(composer, command) {
  	var doc           = composer.doc,
  		selectedNode  = composer.selection.getSelectedNode(),
  		tempClassName =  "_wysihtml5-temp-" + new Date().getTime(),
  		tempElement,
  		blockquote = $(selectedNode).parent('blockquote');
  		
  	if (blockquote.length && composer.commands.support(command)) {
  		doc.execCommand(command, false, null);
      	return;
  	}
  	composer.commands.exec("formatBlock", "div", tempClassName);
  	tempElement = doc.querySelector("." + tempClassName);
  	
  	var childNodes = $(tempElement).children();
  	console.log($(tempElement));
  	console.log(childNodes);
  	
  },

  // usually returns a truthy value when the command is applied to the current selection
  // a falsy when the current selection isn't formatted with <foo>
  state: function(composer, command) {
     var selectedNode = composer.selection.getSelectedNode();
  	 return wysihtml5.dom.getParentElement(selectedNode, { nodeName: "blockquote" });
  },

};