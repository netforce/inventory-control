var updates = {

	"merge": function(doc, req){
		var updates = JSON.parse(req.body);
		log(updates);
		for(var field in updates){
			doc[field] = updates[field];
		}
		var msg = 'Updated successfully';
		return [doc, msg];
	}



};



var inventory_comments = {
   "_id": "_design/inventory_comments",
   "_rev": "11-e2e142c8b39fc2424230d7cc097e62a5",
   "language": "javascript",
   "views": {
       "all": {
           "map": "function(doc) {\n  emit(doc._id, doc);\n}"
       },
       "categories": {
           "map": "function(doc) {\n  for(var cat in doc.categories){\n    emit(doc.categories[cat], doc);\n  }\n}"
       }
   },
   "updates": {
       "add_comment": "function(doc, req){ var comment = JSON.parse(req.body); log(comment); doc[comment.datetime + '~' + comment.user.logon_name] = comment; return [doc, 'Comment added to item: ' + doc._id]; }"
   }
};


//Add a comment to a document.
function(doc, req){
	var comment = JSON.parse(req.body);
	log(comment);
	doc[comment.datetime + "~" + comment.user.logon_name] = comment;
	return [doc, "Comment added to item: " + doc._id];
}