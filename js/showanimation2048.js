function showNumberWithAnimation(x, y ,randNumber){
	var numberCell = $('#number-cell-'+ x + '-' + y);

	numberCell.css('background-color', getNumberBackgroundColor( randNumber ));
	numberCell.css('color', getNumberColor( randNumber ));
	numberCell.text( randNumber );

	numberCell.animate({
		width : cellSideLength,
		height : cellSideLength,
		top : getTop( x, y ),
		left : getLeft( x, y )
	}, 50);
}

function showMoveAnimation(fromX, fromY, toX, toY){
	var numberCell = $('#number-cell-'+ fromX + '-' + fromY);
	numberCell.animate({
		top: getTop( toX, toY ),
		left: getLeft( toX, toY )
	},200);
}
function updateScore(score){
	$('#score').text(score);
}
$(function(){
	$("#newgameBtn").on('click', function(){
		updateScore(0);
	});
});