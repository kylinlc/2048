//documentWidth屏幕宽度  gridContainerWidth棋盘宽度  cellSideLength棋格宽度  cellSpace棋格间距
var documentWidth = window.screen.availWidth;
var gridContainerWidth = 0.92 * documentWidth;
var cellSideLength = 0.18 * documentWidth;
var cellSpace = 0.04 * documentWidth;

function getTop(i, j){
	return cellSpace + i*(cellSpace + cellSideLength);
}

function getLeft(i, j){
	return cellSpace + j*(cellSpace + cellSideLength);
}

function getNumberBackgroundColor( number ){
	switch( number ){
		case 2 : return "#eee4da"; break;
		case 4 : return "#ede0c8"; break;
		case 8 : return "#f2b179"; break;
		case 16 : return "#f59563"; break;
		case 32 : return "#f67c5f"; break;
		case 64 : return "#f65e3b"; break;
		case 128 : return "#edcf72"; break;
		case 256 : return "#edcc61"; break;
		case 512 : return "#9c0"; break;
		case 1024 : return "#33b5e5"; break;
		case 2048 : return "#09c"; break;
		case 4096 : return "#a6c"; break;
		case 8192 : return "#93c"; break;
	}

	return "black";
}

function getNumberColor(number){
	if( number <= 4 ){
		return "#776e65";
	}

	return "white";
}

function nospace( board ){
	for(var i = 0; i < 4; i++){
		for (var j = 0; j < 4; j++) {
			if( board[i][j] == 0 ){
				return false;
			}
		}
	}

	return true;
}

function canMoveLeft( board ){
	for (var i = 0; i < 4; i++) {
		//左边第一排，可以不动,从左边第一排开始考虑
		for (var j = 1; j < 4; j++) {
			if( board[i][j] != 0 ){
				if( board[i][j-1] == 0 || board[i][j-1] == board[i][j] ){
					return true;
				}
			}
		}	
	}

	//一遍循环下来，发现没有符合移动条件的，返回false
	return false;
}

function canMoveRight( board ){
	for (var i = 0; i < 4; i++) {
		//右数第一排 不动 从右遍历
		for (var j = 2; j >= 0; j--) {
			if( board[i][j] != 0 ){
				//当前块和右侧块相等 或右侧块为空
				if( board[i][j+1] == 0 || board[i][j+1] == board[i][j] ){
					return true;
				}
			}
		}	
	}

	//一遍循环下来，发现没有符合移动条件的，返回false
	return false;
}

function canMoveUp( board ){
	for (var j = 0; j < 4; j++) {
		//上边第二排开始扫描
		for (var i = 1; i < 4; i++) {
			if( board[i][j] != 0 ){
				//当前块和上方块相等 或上方块为空
				if( board[i-1][j] == 0 || board[i-1][j] == board[i][j] ){
					return true;
				}
			}
		}	
	}

	//一遍循环下来，发现没有符合移动条件的，返回false
	return false;
}

function canMoveDown( board ){
	for (var j = 0; j < 4; j++) {
		//下数最后一排  从下遍历
		for (var i = 2; i >= 0; i--) {
			if( board[i][j] != 0 ){
				//当前块和下方块相等 或下方块为空
				if( board[i+1][j] == 0 || board[i+1][j] == board[i][j] ){
					return true;
				}
			}
		}	
	}

	//一遍循环下来，发现没有符合移动条件的，返回false
	return false;
}

function nomove(){
	if( canMoveLeft( board ) || canMoveRight( board ) || canMoveUp( board ) || canMoveDown( board ) ){
		return false;
	}

	return true;
}

//row当前行 从col1列到col2列 (从左向右)
function noBlockHorizontal( row , col1 , col2 , board ){
    for( var i = col1 + 1 ; i < col2 ; i ++ )
        if( board[row][i] != 0 )
            return false;
    return true;
}

//col当前列 从row1行到row2列行 (从上向下)
function noBlockVertical( col , row1 , row2 , board ){
    for( var i = row1 + 1 ; i < row2 ; i ++ )
        if( board[i][col] != 0 )
            return false;
    return true;
}