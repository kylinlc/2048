//board 棋盘格  board[i][j]表示每个格子的值 “ 第i行 第j列 ”
var board = new Array();
var score = 0;
var hasConflicted = new Array();

//触摸 位移变量声明
var startX = 0;
var startY = 0;
var endX = 0;
var endY = 0;

$(document).ready(function(){
	prepareForMobile();
	newgame();
	score = 0;
	updateScore(score);
});

//为响应式设置宽高
function prepareForMobile(){
	if ( documentWidth > 768 ) {
		gridContainerWidth = 500;
		cellSideLength = 100;
		cellSpace = 20;
	}

	var aa = $('#grid-container').css('width', gridContainerWidth - cellSpace*2);
	$('#grid-container').css('height', gridContainerWidth - cellSpace*2);
	$('#grid-container').css('padding', cellSpace);
	$('#grid-container').css('border-radius', gridContainerWidth*0.02);

	$('.grid-cell').css('width', cellSideLength);
	$('.grid-cell').css('height', cellSideLength);
	$('.grid-cell').css('border-radius', cellSideLength*0.02);
}

function newgame(){
	//初始化棋盘格
	init();
	//随机两个格子生成数字
	generateOneNumber();
	generateOneNumber();
}

function init(){
	for(var i=0; i<4; i++){
		for(var j=0; j<4; j++){

			var gridCell = $("#grid-cell-"+ i + "-" + j);
			gridCell.css('top',getTop(i,j));
			gridCell.css('left',getLeft(i,j));
		}
	}

	for(var i=0; i<4; i++){
		board[i] = new Array();
		hasConflicted[i] = new Array();
 		for(var j=0; j<4; j++){
			//board为一个二维数组，存储每一个小方块的值
			board[i][j] = 0;
			hasConflicted[i][j] = false;
		}
	}
	
	updateBoardView();

	score = 0;
}

//根据board值，更新前端页面上的方格的值
function updateBoardView(){
	$(".number-cell").remove();
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			$("#grid-container").append('<div class="number-cell" id="number-cell-'+ i + '-' + j +'"></div>');
			var theNumberCell = $('#number-cell-'+ i + '-' + j);

			if( board[i][j] == 0 ){
				theNumberCell.css('width', '0px');
				theNumberCell.css('height', '0px');
				theNumberCell.css('top', getTop(i, j) + cellSideLength/2);
				theNumberCell.css('left', getLeft(i, j) + cellSideLength/2);
			}else{
				theNumberCell.css('width', cellSideLength);
				theNumberCell.css('height', cellSideLength);
				theNumberCell.css('top', getTop(i, j));
				theNumberCell.css('left', getLeft(i, j));
				//根据方块数字的不同，变换方块的背景颜色
				theNumberCell.css('background-color', getNumberBackgroundColor( board[i][j] ));
				//根据方块数字的不同，变换方块字体颜色
				theNumberCell.css('color', getNumberColor( board[i][j] ));
				//每个方块上显示的数字
				theNumberCell.text( board[i][j] );
			}

			hasConflicted[i][j] = false;
		}
	}

	$('.number-cell').css('line-height', cellSideLength + 'px');
	$('.number-cell').css('font-size', cellSideLength*0.6);
}

//随机找空闲格子生成一个数字
function generateOneNumber(){
	if( nospace( board ) ){
		return false;
	}

	//随机一个位置
	var randX = parseInt( Math.floor( Math.random() * 4 ) );
	var randY = parseInt( Math.floor( Math.random() * 4 ) );

	//生成随机数的优化 随机生成50次 若50次之内找不到 就手动给其安排一个空位
	var times = 0;
	while( times < 50 ){
		if( board[randX][randY] == 0 ){
			//生成的随机位为空位置，跳出死循环
			break;
		}

		randX = parseInt( Math.floor( Math.random() * 4 ) );
		randY = parseInt( Math.floor( Math.random() * 4 ) );
	}
	if(times == 50){
		for (var i = 0; i < 4; i++) {
			for(var j = 0; j < 4; j++){
				if ( board[i][j] == 0 ) {
					randX = i;
					randY = j;
				}
			}
		}
	}

	//随机一个数字(2或4)
	var randNumber = Math.random() < 0.5 ? 2 : 4;
	//在随机的位置显示随机的数字
	board[randX][randY] = randNumber;
	showNumberWithAnimation(randX, randY, randNumber);

	return true;
}

//游戏结束
function isGameOver(){
	if( nospace( board ) && nomove( board )){
		gameOver();
	}
}

function gameOver(){
	alert("GAME OVER!");
}

//pc端键盘上下左右事件
$(document).keydown( function( event ) {
	switch( event.keyCode ){
		case 37://left
			//取消上下左右键的默认事件 即滚动滚动条
			event.preventDefault();
			if( moveLeft() ){
				setTimeout('generateOneNumber()', 210);
				setTimeout('isGameOver()', 300);
			}
			break;
		case 38://up
			event.preventDefault();
			if( moveUp() ){
				setTimeout('generateOneNumber()', 210);
				setTimeout('isGameOver()', 300);
			}
			break;
		case 39://right
			event.preventDefault();
			if( moveRight() ){
				setTimeout('generateOneNumber()', 210);
				setTimeout('isGameOver()', 300);
			}
			break;
		case 40://down
			event.preventDefault();
			if( moveDown() ){
				setTimeout('generateOneNumber()', 210);
				setTimeout('isGameOver()', 300);
			}
			break;
		default:
			break;
	}
});

//移动端触摸事件
document.addEventListener('touchstart', function(event){
	startX = event.touches[0].pageX;
	startY = event.touches[0].pageY;
});

document.addEventListener('touchmove', function(event){
	event.preventDefault();
});

document.addEventListener('touchend', function(event){
	endX = event.changedTouches[0].pageX;
	endY = event.changedTouches[0].pageY;

	var changeX = endX - startX;
	var changeY = endY - startY;

	if( Math.abs( changeX ) < documentWidth*0.2 && Math.abs( changeY ) < documentWidth*0.2){
		return;
	}

	//changeX > changeY 在x轴上移动 即左右移动
	if( Math.abs( changeX ) >= Math.abs( changeY ) ){

		if( changeX > 0 ){
			//move Right
			if( moveRight() ){
				setTimeout('generateOneNumber()', 210);
				setTimeout('isGameOver()', 300);
			}			
		}else{
			//move Left
			if( moveLeft() ){
				setTimeout('generateOneNumber()', 210);
				setTimeout('isGameOver()', 300);
			}
		}
	}
	//y轴上移动 即上下移动
	else{

		if( changeY > 0 ){
			//move Down
			if( moveDown() ){
				setTimeout('generateOneNumber()', 210);
				setTimeout('isGameOver()', 300);
			}
		}else{
			//move Up
			if( moveUp() ){
				setTimeout('generateOneNumber()', 210);
				setTimeout('isGameOver()', 300);
			}
		}
	}
});

//left + right 的操作 与当前方块的同一行上的不同列的方块进行比较
function moveLeft(){
	if( !canMoveLeft( board ) ){
		return false;
	}

	//can move left
	for (var i = 0; i < 4; i++) {
		//左边第一排，可以不动,从左边第一排开始考虑
		for (var j = 1; j < 4; j++) {
			if( board[i][j] != 0 ){
				//left + right  遍历的k 是 列数  从k列到 j列 (i行是不动的)
				//遍历 和每个方块的同一排的前三列  noBlockHorizontal(i, k , j, board):第i行 从j这一列到k这一列 没有障碍物
				for (var k = 0; k < j; k++) {
					//该方块的前列方块为空 且 没有障碍物 noBlockHorizontal(从左向右 从上向下 k在左)
					if( board[i][k] == 0 && noBlockHorizontal(i, k , j, board ) ){
						//move 从i，j 移动到i，k
						showMoveAnimation( i, j, i, k );
						board[i][k] = board[i][j];
						board[i][j] = 0;

						continue;
					}
					//该方块的前列方块有与其相等的 且 没有障碍物
					else if( board[i][k] == board[i][j] && noBlockHorizontal(i, k , j, board ) && !hasConflicted[i][k] ){
						//move
						showMoveAnimation( i, j, i, k );
						//add
						board[i][k] += board[i][j];
						board[i][j] = 0;
						//add score (score的值就是两个方格相加的值 即 board[i][k]);  updareScore() 更新前端页面上的score值 
						//因为分数相加会有动画 所以此函数放在showanimation.js里
						score += board[i][k];
						updateScore(score);

						hasConflicted[i][k] = true;

						continue;
					}
				}
			}
		}	
	}

	setTimeout("updateBoardView()", 200);
	return true;
}

function moveRight(){
	if( !canMoveRight( board ) ){
		return false;
	}

	//can move right  i：第i行
	for(var i = 0; i < 4; i++){
		//从右向左遍历
		for (var j = 2; j >= 0; j--) {
			if ( board[i][j] != 0 ){
				//遍历 当前格的右侧 从右向左遍历
				for (var  k = 3; k > j; k--) {
					//该方块的右侧方块为空 且 没有障碍物 noBlockHorizontal(从左向右 j在左)
					if ( board[i][k] == 0 && noBlockHorizontal(i, j , k, board ) ){
						//move 从i，j 移动到i，k
						showMoveAnimation(i, j, i, k);
						board[i][k] = board[i][j];
						board[i][j] = 0;

						continue;
					}
					//该方块的右侧方块有与其相等的 且 没有障碍物
					else if( board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board ) && !hasConflicted[i][k] ){
						//move
  						showMoveAnimation(i, j, i, k);
						//add
						board[i][k] += board[i][j];
						board[i][j] = 0;
						//add score
						score += board[i][k];
						updateScore(score);

						hasConflicted[i][k] = true; 

						continue;
					}
				}
			}
		}
	}

	setTimeout("updateBoardView()", 200);
	return true;
}

//up + down 的操作 与当前方块的同一列上的不同行的方块进行比较
function moveUp(){
	if( !canMoveUp( board ) ){
		return false;
	}

	for (var j = 0; j < 4; j++) {
		for (var i = 1; i < 4; i++) {
			if ( board[i][j] != 0 ) {
				//up + down  遍历的k 是 行数  从k行到 i行 (j列是不动的)
				for (var k = 0; k < i; k++) {
					//noBlockHorizontal(j, k, i, board)  从上向下  第j列的格子 从k行到i行无障碍 
					if ( board[k][j] == 0 && noBlockVertical(j, k, i, board) ){
						//move
						showMoveAnimation(i, j, k, j);
						board[k][j] = board[i][j];
						board[i][j] = 0;

						continue;
					}
					else if( board[k][j] == board[i][j] && noBlockVertical(j, k, i, board) && !hasConflicted[k][j] ){
						//move
						showMoveAnimation(i, j, k, j);
						//add
						board[k][j] += board[i][j];
						board[i][j] = 0;
						//add score
						score += board[k][j];
						updateScore(score);

						hasConflicted[k][j] = true;

						continue;
					}
				}
			}
		}
	}
	setTimeout("updateBoardView()", 200);
	return true;  
}

function moveDown(){
	if( !canMoveDown( board ) ){
		return false;
	}

	for (var j = 0; j < 4; j++) {
		for (var i = 2; i >= 0; i--) {
			if(board[i][j] !== 0){
				for (var k = 3; k > i; k--) {
					if( board[k][j] == 0 && noBlockVertical(j, i, k, board) ){
						//move
						showMoveAnimation(i, j, k, j);
						board[k][j] = board[i][j];
						board[i][j] = 0;

						continue;
					}
					else if( board[k][j] == board[i][j] && noBlockVertical(j, i, k, board) && !hasConflicted[k][j] ){
						//move
						showMoveAnimation(i, j, k, j);
						//add
						board[k][j] += board[i][j];
						board[i][j] = 0;
						//add score
						score += board[k][j];
						updateScore(score);

						hasConflicted[k][j] = true;

						continue;
					}
				}
			}
		}
	}
	setTimeout("updateBoardView()", 200);
	return true; 
}


