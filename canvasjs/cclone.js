//-------------------------------------------------------------------------------------------------
//To clone the Object, requires to write the function of the createJS's class
//and the setTransform detail, clones are set to visible false default due to it appearing 
//on including the src on the html.
//-------------------------------------------------------------------------------------------------

(function (lib, img, cjs, ss) {

 
(lib.ReturnClone = function(vData) {
	this.initialize();
	
	switch(vData)
	{
		case "Thousands":
			this.toReturn = new lib.mc_cbModel_Thousands();
			this.toReturn.setTransform(128.8,45,1,0.999);
			break;
		case "Thousands1":
			this.toReturn = new lib.mc_cbModel_Thousands1();
			this.toReturn.setTransform(128.8,0,1,0.999);
			break;		
			
		case "Hundreds":
			this.toReturn = new lib.mc_cbModel_Hundreds();
			this.toReturn.setTransform(89.8,45,1,0.999);

			break;
		case "Hundreds1":
			this.toReturn = new lib.mc_cbModel_Hundreds1();
			this.toReturn.setTransform(102,0,1,0.999);
			break;
		
		case "Tens":
			this.toReturn = new lib.mc_cbModel_Tens();
			this.toReturn.setTransform(0,48.1,4,3.997);
			
			break;	
		case "Tens1":
			this.toReturn = new lib.mc_cbModel_Tens1();
			this.toReturn.setTransform(0,0.1,1,0.999);			
			break;	
			
		case "Ones":
			this.toReturn = new lib.mc_cbModel_Ones();
			this.toReturn.setTransform(84.6,48);
			break;
		case "Ones1":
			this.toReturn = new lib.mc_cbModel_Ones1();
			this.toReturn.setTransform(42.3,48);
			break;
			
		case "Tenths":
			this.toReturn = new lib.mc_cbModel_Tenths();
			this.toReturn.setTransform(42.3,0,4,4);
			break;
		case "Tenths1":
			this.toReturn = new lib.mc_cbModel_Tenths1();
			this.toReturn.setTransform(84.6,0);
			break;
			
		case "Hundredths":
			this.toReturn = new lib.mc_cbModel_Hundredths();
			this.toReturn.setTransform(126.9,48.1,1,0.999);
			break;
		case "Hundredths1":
			this.toReturn = new lib.mc_cbModel_Hundredths1();
			this.toReturn.setTransform(126.9,0.1,1,0.999);
			break;
	}	
	this.toReturn.visible = false;
	
	return this.toReturn;

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,70,70);
 
 
})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{});
var lib, images, createjs, ss;
 
 
 
 
 
 
 
 
