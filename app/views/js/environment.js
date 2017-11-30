var fs = require('fs');
var path = require('path');

var data = null;
var name_p = null;	//имя игрока
var dot_pos = null;	//позиция точки
var dot_status = null;	//статус точки
var dots_db = [];	//список точек
var x = 0;
var y = 0;

var inc_x = 0;
var inc_y = 0;
var dec_x = 0;
var dec_y = 0;
var inc_ = 0;
var dec_ = 0;
var def_x = 0;
var def_y = 0;
var max = 19;
var min = 0;

var inc_dec = [];
var new_dots = [];

module.exports.calc = function(req) {

	var matched_dots_of_one_author = [];

	data = JSON.parse(req);
	name_p = data.name;	//имя игрока
	dot_pos = data.pos;	//новая точка игрока

	dots_db = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/dotsDB.json')));

	for (let i=0; i<dots_db.length; i++) {
		
		inc_dec = [];	// очищаем
		new_dots = [];	// очищаем
		console.log("main dot: ", dots_db[i].pos);	//позиция точки, автора последнего хода
		console.log("main dot author: ", dots_db[i].name); //имя автора последнего хода
		dot_pos = dots_db[i].pos;
		def_x = JSON.parse(dot_pos.split('.')[0]);
		def_y = JSON.parse(dot_pos.split('.')[1]);

		x = def_x;
		y = def_y;

		if (def_x === min) {	// если X === 0
			inc_x = ++x;	// x+1
			dec_x = x;		// x
			inc_y = ++y;	// y+1
			dec_y = y-2;	// y-1

			inc_dec.push(dec_x);
			inc_dec.push(def_x);
			inc_dec.push(inc_x);
			inc_dec.push(dec_y);
			inc_dec.push(def_y);
			inc_dec.push(inc_y);

			for (let i=0; i<3; i++) {
				let new_x = JSON.parse(inc_dec[i]);
				for (let j=3; j<6; j++) {
					let new_y = JSON.parse(inc_dec[j]);
					let new_dot = new_x + "." + new_y;
					new_dots.push(new_dot);
				}
			}

		} else if (def_x === max) {	// если X === 19
			inc_x = x;		// x
			dec_x = x-1;	// x-1
			inc_y = ++y;	// y+1
			dec_y = y-2;	// y-1

			inc_dec.push(dec_x);
			inc_dec.push(def_x);
			inc_dec.push(inc_x);
			inc_dec.push(dec_y);
			inc_dec.push(def_y);
			inc_dec.push(inc_y);

			for (let i=0; i<3; i++) {
				let new_x = JSON.parse(inc_dec[i]);
				for (let j=3; j<6; j++) {
					let new_y = JSON.parse(inc_dec[j]);
					let new_dot = new_x + "." + new_y;
					new_dots.push(new_dot);
				}
			}

		} else if (def_y === max) {
			inc_x = ++x;	// x+1
			dec_x = x-2;	// x-1
			inc_y = y;		// y
			dec_y = y-1;	// y-1

			inc_dec.push(dec_x);
			inc_dec.push(def_x);
			inc_dec.push(inc_x);
			inc_dec.push(dec_y);
			inc_dec.push(def_y);
			inc_dec.push(inc_y);

			for (let i=0; i<3; i++) {
				let new_x = JSON.parse(inc_dec[i]);
				for (let j=3; j<6; j++) {
					let new_y = JSON.parse(inc_dec[j]);
					let new_dot = new_x + "." + new_y;
					new_dots.push(new_dot);
				}
			}

		} else if (def_y === min) {
			inc_x = ++x;	// x+1
			dec_x = x-2;	// x-1
			inc_y = ++y;	// y+1
			dec_y = y;		// y

			inc_dec.push(dec_x);
			inc_dec.push(def_x);
			inc_dec.push(inc_x);
			inc_dec.push(dec_y);
			inc_dec.push(def_y);
			inc_dec.push(inc_y);

			for (let i=0; i<3; i++) {
				let new_x = JSON.parse(inc_dec[i]);
				for (let j=3; j<6; j++) {
					let new_y = JSON.parse(inc_dec[j]);
					let new_dot = new_x + "." + new_y;
					new_dots.push(new_dot);
				}
			}

		} else {
			inc_x = ++x;	// x+1
			dec_x = x-2;	// x-1
			inc_y = ++y;	// y+1
			dec_y = y-2;	// y-1

			inc_dec.push(dec_x);
			inc_dec.push(def_x);
			inc_dec.push(inc_x);
			inc_dec.push(dec_y);
			inc_dec.push(def_y);
			inc_dec.push(inc_y);

			for (let i=0; i<3; i++) {
				let new_x = JSON.parse(inc_dec[i]);
				for (let j=3; j<6; j++) {
					let new_y = JSON.parse(inc_dec[j]);
					let new_dot = new_x + "." + new_y;
					new_dots.push(new_dot);
				}
			}
		}

		console.log("new dots for verific: ", new_dots);

		
		for (let k=0; k<dots_db.length; k++) {
			for (let h=0; h<new_dots.length; h++) {
				if (h === 4) {
					h++;
				} else {
					if (new_dots[h] === dots_db[k].pos) {// если точки соседние, записываем соседнюю совпавшую точку
						console.log("found nearest dot!");
						console.log("closest dot: ", new_dots[h]);	// позиция соседней точки
						console.log("author of closest dot: ", dots_db[k].name); // имя автора соседней точки
						
						if (dots_db[k].name === dots_db[i].name) { //если автор последней точки поставленной на поле === автору соседней точки, записваемв массив
							matched_dots_of_one_author.push({"closest_dot": new_dots[h], "main_dot": dots_db[i].pos, "author":  dots_db[i].name});
						}	
					}
				}
				
			}
		}
		console.log("matched_dots_of_one_author: " , matched_dots_of_one_author);
	}
	return req;
}