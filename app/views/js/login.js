var fs = require('fs');
var path = require('path');

module.exports.color = function() {
    return Math.floor(Math.random() * 6) + 1;
}

var count = 1;

module.exports.create = function() {
	var uName = "Player" + count++;

	return uName;
}

module.exports.checkuser = function(data) {
	  var newUser = null;
	  var statusName = null;
	  var allUsers = [];

	  var newUser = data.name;
	  var sessionID = data.sessionID;

	  var allUsers = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/user.json')));

	  for (let i=0; i<allUsers.length; i++) { //проверяем, есть ли уже в базе пользователь с таким именем, если нет, записываем
	  	var user = allUsers[i].name;
	  	// console.log(allUsers[i].name);
	  	if (user === newUser) {
	  		statusName = "error";
	  		console.log("user already registered: ", user);
	  		break;
	  	} else {
	  		statusName = "ok";
	  	}
	  }

	  if (statusName === "ok") {
	  	let data = ({"name": newUser});
	  	allUsers.push({"name": newUser, "sessionID": sessionID});
	  	// console.log(allUsers);
	  	var dir = path.join(__dirname, '../data/user.json');
	  	fs.writeFileSync(dir, JSON.stringify(allUsers));
	  }
	  // console.log("status new name : ", statusName);
	  var response = {statusName, newUser, sessionID};

  return response;
}
