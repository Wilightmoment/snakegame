let map;
let food;
let snake;
let timer;
let initSpeed = 200;
let nowSpeed = initSpeed;
let grade = 0;
let flag = 1;
//地圖
function Map () {
	this.width = 800;
	this.height = 400;
	this.position = 'relative';
	this.backgroundColor = '#EEEEEE';
	this._map;
	this.show = function () {
		this._map = document.createElement('div');
		this._map.style.width = this.width + 'px';
		this._map.style.height = this.height + 'px';
		this._map.style.position = this.position;
		this._map.style.backgroundColor = this.backgroundColor;
		this._map.style.margin = '5px auto';
		document.getElementsByTagName('body')[0].append(this._map);
	}
}


//食物
function Food () {
	this.width = 20;
	this.height = 20;
	this.position = 'absolute';
	this.color = '#FF0000';
	this.x = 0;
	this.y = 0;
	this._food;
	this.show = function () {
		this._food = document.createElement('div');
		this._food.style.width = this.width + 'px';
		this._food.style.height = this.height + 'px';
		this._food.style.position = this.position;
		this._food.style.backgroundColor = this.color;
		this.x = Math.floor(Math.random() * map.width / this.width);
		this.y = Math.floor(Math.random() * map.height / this.height);
		this._food.style.left = this.x * this.width + 'px';
		this._food.style.top = this.y * this.height + 'px';		

		map._map.append(this._food)
	}
}

//蛇
function Snake () {
	this.width = 20;
	this.height = 20;
	this.position = 'absolute';
	this.direct = null;

	this.body = new Array(
		[3, 2, 'black', null],
		[2, 2, 'blue', null],
		[1, 2, 'blue', null]
	);

	this.show = function () {
		for (let i = 0; i < this.body.length; i++){
			if(this.body[i][3] === null){
				this.body[i][3] = document.createElement('div');
				this.body[i][3].style.width = this.width + 'px';
				this.body[i][3].style.height = this.height + 'px';
				this.body[i][3].style.position = this.position;
				this.body[i][3].style.backgroundColor = this.body[i][2];
				map._map.append(this.body[i][3]);
			}
			this.body[i][3].style.left = this.width * this.body[i][0] + 'px';
			this.body[i][3].style.top = this.height * this.body[i][1] + 'px';			
		}		
	}

	this.move = function () {		
		for(let i = this.body.length - 1; i > 0; i--){
			this.body[i][0] = this.body[i - 1][0];
			this.body[i][1] = this.body[i - 1][1];
		}
		switch(this.direct){
			case 'right':
				this.body[0][0] = this.body[0][0] + 1;
				break;
			case 'left':
				this.body[0][0] = this.body[0][0] - 1;
				break;
			case 'up':
				this.body[0][1] = this.body[0][1] - 1;
				break;
			case 'down':
				this.body[0][1] = this.body[0][1] + 1;
				break;
		}
		this.show();
		this.condition();
	}

	this.speed = function () {
		timer = setInterval('snake.move()', initSpeed);
	}

	this.condition = function () {
		//吃蘋果
		if(this.body[0][0] === food.x && this.body[0][1] === food.y){
			grade ++;
			this.body[[this.body.length]] = [0, 0, 'blue', null];
			map._map.removeChild(food._food);
			food.show();
		}
		//撞牆
		if(this.body[0][0] < 0 || this.body[0][0] >= map.width / this.width 
		|| this.body[0][1] < 0 || this.body[0][1] >= map.height / this.height){
			clearInterval(timer);
			alert('Game Over');
			return;
		}
		//自撞
		for(let i = 1 ; i < this.body.length; i++){
			if(this.body[0][0] === this.body[i][0] && this.body[0][1] === this.body[i][1]){
				clearInterval(timer);
				alert('Gamer Over');
				return;
			}
		}
		//加速
		if(grade / 2 === flag){
			clearInterval(timer);
			flag ++;
			nowSpeed = initSpeed / 2;
			timer = setInterval('snake.move()', nowSpeed);
		}
		document.getElementById('grade').innerHTML = '目前分數 ' + grade + '分' + ' 第' + flag + '關'
	}
}

//按下任意鍵開始遊戲
document.onkeydown = function (event) {
	if(snake.direct === null){
		snake.direct = 'right';
		snake.speed();
	}
	//控制方向
	switch(window.event ? window.event.keyCode : event.keyCode){
		case 38:
			snake.direct = snake.body[0][0] === snake.body[1][0] ? snake.direct : 'up';
			break;
		case 40:
			snake.direct = snake.body[0][0] === snake.body[1][0] ? snake.direct : 'down';
			break;
		case 37:
			snake.direct = snake.body[0][1] === snake.body[1][1] ? snake.direct : 'left';
			break;
		case 39:
			snake.direct = snake.body[0][1] === snake.body[1][1] ? snake.direct : 'right';
			break;			
	}
}

window.onload = function () {
	map = new Map();
	map.show();
	food = new Food();
	food.show();
	snake = new Snake();
	snake.show();	
}