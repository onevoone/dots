var http = require('http');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var express = require('express');

var checklogin = require(path.join(__dirname, 'views/js/login'));//подключение директив
var dotsjs = require(path.join(__dirname, 'views/js/dots'));
var environment = require(path.join(__dirname, 'views/js/environment'));

var jsonParser = bodyParser.json();//Json парсер для получения ответа от пост запроса в виде json
var app = express(); // иннициализация express
app.use(express.static(path.join(__dirname, 'views')));//статические страницы и стили
var server = http.createServer(app)//создание сервера

//----------- Регистрация при помощи express и использования сессии ------------------//
var dataUser = {};//Вход нового пользователя
app.post("/", jsonParser, function (req, res) {
	 //проверяем имя новго пользователя
	dataUser = {"sessionID": req.sessionID, "name": req.body.name};
	var checked = checklogin.checkuser(dataUser);
	console.log("New user connected: ", checked);
		 // if (checked.statusName === "ok") {
			  // createsocket();
		 // }
	res.send(checked);
});

const WebSocket = require('ws');	//создание WS
const wss = new WebSocket.Server({ server });

wss.broadcast = function broadcast(data) {
	wss.clients.forEach(function each(client) {
		if (client.readyState === WebSocket.OPEN) {
			client.send(data);
		}
	});
};

wss.on('connection', function connection(ws, req) {
	console.log("User connected");

	ws.on('message', function incoming(message) {
		wss.clients.forEach(function each(client) {
			if (client !== ws && client.readyState === WebSocket.OPEN) {
				var senddata = dotsjs.checkdot(message);	//проверяем точку в БД
				var envi = environment.calc(message);	//
				client.send(senddata);
			}
			console.log("request: " + message);
			client.send(message);
		});
	});

	ws.on('close', function(reasonCode, description) {
		dotsjs.clear_db();
		console.log('User disconnected');
	});
});

server.listen(80, '127.0.0.1', function() {
	console.log('Сервер запущен', server.address().address, ":", server.address().port);
});
