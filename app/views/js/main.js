var app = angular.module('points', ['ngWebSocket']);

app.run(function($rootScope) {

});

/*app.factory('MyData', function($websocket) {
  // Open a WebSocket connection
  var ws = $websocket('ws://127.0.0.1:80');

  var collection = [];

  ws.onOpen(function() {
	 console.log("Connected to server");
	 ws.send(JSON.stringify("Client connected"));
  });

  ws.onClose(function() {
	 console.log("Disconnected from server");
  });

  ws.onError(function() {
	 console.log("Server error");
  });

  ws.onMessage(function(message) {
	 collection.push(JSON.parse(message.data));
  });

  var methods = {
	 collection: collection,
	 get: function() {
		ws.send(JSON.stringify({ name: name }));
	 }
  };

  return methods;
});*/

app.service('changeClass', function($rootScope) {
	var id_dot = null;
	var class_dot = null;
	
	this.setBlue = function(data) {	//задаем точке синий цвет
		id_dot = angular.element(document.getElementById(data));
		angular.element(id_dot).removeAttr("class");
		angular.element(id_dot).addClass("dot_full_blue");
	};
	this.setRed = function(data) {	//задаем точке красный цвет
		id_dot = angular.element(document.getElementById(data));
		angular.element(id_dot).removeAttr("class");
		angular.element(id_dot).addClass("dot_full_red");
	};
	this.blockDot = function() {	// блокируем поле для хода противника
		class_dot = angular.element(document.getElementsByClassName("_dot_empty"));
		angular.element(class_dot).removeAttr("class");
		angular.element(class_dot).addClass("_dot_empty_blocked");
	};
	this.unblockDot = function() {	//разблокируем поле для хода
		class_dot = angular.element(document.getElementsByClassName("_dot_empty_blocked"));
		angular.element(class_dot).removeAttr("class");
		angular.element(class_dot).addClass("_dot_empty");
	};
});

app.factory('MyService', ['$q', '$rootScope', '$log', function($q, $rootScope, $log) {
	var Service = [];

	var ws = new WebSocket("ws://127.0.0.1:80");
	ws.onopen = function(){  
		console.log("Connected to server");
	};
	ws.onmessage = function(message) {
		listener(message.data);
	};
	function sendRequest(request) {
		ws.send(request);
	}
	function listener(data) {
		messageObj = JSON.parse(data);
		console.log("Received data from websocket: ", messageObj);
		$rootScope.$apply(function() {
			Service.push(messageObj);
			$rootScope.$broadcast("checkData", Service);
		});
	}
	return  {
		sendRequest: sendRequest,
		Service
	}
}]);

app.controller('mainCtrl', [ 'MyService', 'changeClass', '$scope', '$http', '$rootScope', '$timeout', function(MyService, changeClass, $scope, $http, $rootScope, $timeout) {
	
	$scope.nameplayer = null;
	$scope.dotr = [];
	$scope.dotc = [];

	for(var y=0; y<20; y++) {	//постройка игрового поля
		for(var x=0; x<20; x++) {
			$scope.dotc.push({pos: y + "." + x});
		}
		$scope.dotr.push([$scope.dotc]);
		$scope.dotc = [];
	}

	$scope.registername = function(nameplayer) {	//Логирование
		$scope.nameplayer = nameplayer;
		console.log("Your name: " + $scope.nameplayer);
	}

	$scope.fillDot = function(event, data) {	//отправка данных точки
			let req = JSON.stringify({"pos": data.pos, "name": $scope.nameplayer});
			console.log("req: ", req);
			MyService.sendRequest(req);
	}

	$scope.$on("checkData", function(event, data) {
		var res_name = null;
		var res_pos = null;
		var res_ws = null;
		res_ws = MyService.Service; //полученные данные с вебсокета

		$timeout(function () {
			res_name = res_ws[res_ws.length-1].name;
			res_pos = res_ws[res_ws.length-1].pos;
			
			if (res_name === $scope.nameplayer) {	//определяем отправителя
				changeClass.setBlue(res_pos);	// блокируем поле для заполнения и передаем ход противнику
				changeClass.blockDot();
				$scope.turn = "Ход противника."
			}

			if (res_name !== $scope.nameplayer) {	//если клиент не автор предыдущих отправленных данных
				changeClass.unblockDot();	//открываем поле для хода
				$scope.turn = "Ваш ход."

				for (let i=0; i<$scope.dotr.length; i++) {//по полученным данным ищем указанную точку
					let first = $scope.dotr[i];
					for (let j=0; j<first.length; j++) {
						let second = first[j];
						for (let k=0; k<second.length; k++) {
							let third = second[k];
							if (res_pos === third.pos) {
								let forign_dot = third.pos;
								changeClass.setRed(forign_dot);	// помечаем точку как ход противника
								break;
							}
						}
					}
				}
			}

		}, 100);
	});

	




	/*$scope.login = function(name) {
		var data = {name: name};
		$http.post('/', data)
			.then(function(res) {
				console.log(res);
				if (res.data.statusName === "error") {
					$scope.checkLogin = "Пользователь с таким именем уже в игре, выберите другое имя!";
					$scope.alertlogin = true;
				} else {
					window.location.assign('game.html');
					$scope.urname = res.data.newUser;
				}
			});
	}*/


}]);