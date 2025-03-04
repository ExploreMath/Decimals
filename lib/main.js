//-------------------------------------------------------------------------------------------------
// Declare
// 
// Set the Project's requirement and declare the .js files to be loaded
//
//------------------------------------------------------------------------------------------------- 
//gobal var
//------------------------------------------------------------------------------------------------- 
var mStageSize;
var mFPS;
var mLastpState;

//------------------------------------------------------------------------------------------------- 
// PIXEL_RATIO for resizing purpose
//------------------------------------------------------------------------------------------------- 
var PIXEL_RATIO = (function () 
{
	var ctx = document.createElement("canvas").getContext("2d"),
		dpr = window.devicePixelRatio || 1,
		bsr = ctx.webkitBackingStorePixelRatio ||
			ctx.mozBackingStorePixelRatio ||
			ctx.msBackingStorePixelRatio ||
			ctx.oBackingStorePixelRatio ||
			ctx.backingStorePixelRatio || 1;	
	return dpr / bsr;
})();
	
window.MAIN = (function() {
	
function MAIN() {}	

//-------------------------------------------------------------------------------------------------
// Project's setting
//------------------------------------------------------------------------------------------------- 
mFPS = 24;
mStageSize = new createjs.Point(1024, 768);  
  
MAIN.fInit = function(
) 
{	
	SYS.fInit();	 
	
	SYS.fAddDefinition("src/common.js");	 
	SYS.fAddDefinition("src/cclone.js");	 
	SYS.fAddDefinition("src/engine.js");
	SYS.fAddDefinition("src/message.js");
	SYS.fAddDefinition("src/ui.js");
}

MAIN.fModule = function(
)
{
	SYS.fStartModule("canvasjs/ui_canvas.js", "UI", "Common");
	//change here//
	SYS.fStartModule("canvasjs/placevaluechart_sub10_10_canvas.js", "Grouping", "Engine");	
	//==========//
	SYS.fStartModule("canvasjs/mcmessage_canvas.js", "Message", "Message");
	SYS.fStartModule("canvasjs/title_canvas.js", "Title", "UI");
}
	
//-------------------------------------------------------------------------------------------------
//	create custom Text border here, and when setting textfield to input, set 2nd var to true
//	example textfield.SetInput(true, true);
//-------------------------------------------------------------------------------------------------
MAIN.fTextBorderStyle = function(
)
{
	var vBorder; 
	vBorder = new createjs.Shape();
	vBorder.graphics.beginStroke("#000");
	vBorder.graphics.setStrokeStyle(1);
	
	return vBorder;
}
 
//----------------------------------------------------------------------------------------------------
return MAIN;
})();
 
 
 
 
 
 
 
 
 
 
