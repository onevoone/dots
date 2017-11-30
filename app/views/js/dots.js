var fs = require('fs');
var path = require('path');

var data = null;
var name_p = null;//имя игрока
var dot_pos = null;//позиция точки
var dot_status = null;//статус точки
var dots_db = [];//список точек

module.exports.clear_db = function() {
	let dir = path.join(__dirname, '../data/dotsDB.json');
	fs.writeFileSync(dir, JSON.stringify([]));
}

module.exports.checkdot = function(req) {

	data = JSON.parse(req);
	name_p = data.name;	//имя игрока
	dot_pos = data.pos;	//новая точка игрока

	dots_db = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/dotsDB.json')));

	dot_status = "ok";

	/*if (dots_db.length !== 0) { //если база точек не пуста
		for (let i=0; i<dots_db.length; i++) { //проверяем, имеется ли такая точка в БД
			if (dots_db[i].pos === dot_pos) {
				dot_status = "error";
				console.log("dot already registered: ", dot_pos);
				req = JSON.stringify({"status": "error", "pos": data.pos, "name": data.name});
				break;
			} else {
				dot_status = "ok";
			}
		}

		if (dot_status === "ok") { //если точка не занята, добавляем ее в БД*/
			dots_db.push(data);
			let dir = path.join(__dirname, '../data/dotsDB.json');
			fs.writeFileSync(dir, JSON.stringify(dots_db));
			req = JSON.stringify({"status": "ok", "pos": data.pos, "name": data.name});
			console.log("new dot registered: ", req);
	//}
	
	//} else {	//если база точек пуста (первая точка), записываем новую точку
		/*let dir = path.join(__dirname, '../data/dotsDB.json');
		fs.writeFileSync(dir, JSON.stringify([data]));
		req = JSON.stringify({"status": "ok", "pos": data.pos, "name": data.name});
		console.log("new dot registered: ", req);*/
	//}
	// console.log(req);

	return req;
}