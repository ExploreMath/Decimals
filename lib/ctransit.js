//-------------------------------------------------------------------------------------------------
//List of effect can be view at 
//http://www.createjs.com/docs/tweenjs/classes/Ease.html
//common use:
//	createjs.Ease.bounceOut
//	createjs.Ease.linear
//-------------------------------------------------------------------------------------------------
function 
cTransit(
)
{	
}

//-------------------------------------------------------------------------------------------------
cTransit.fStartTransit = function(
	vObject,							//	object to manage
	vComplete,							//	Pass in complete function name to call
	vPropDefault,						//	default start property, example {x:10 , y:50}
	vPropEnd,							//	property to change with value, example {x:10 , y:50}
	vFunc,								//	transition function to use
	vDuration,							//	in ms; duration to perform transition
	vCount								//	count to do; if 0, unlimited
)
{
	var vCurrentCount = 0;
	
	vCount = typeof vCount !== 'undefined' ? vCount : 1;
			
	var o = {};
	o = {
			vObject : vObject,
			vComplete : vComplete,
			vPropDefault : vPropDefault,
			vPropEnd : vPropEnd,
			vFunc : vFunc,
			vDuration : vDuration,
			vCount : vCount,
			vCurrentCount : vCurrentCount
		}
	
	handleComplete([o]);
		
	function
	handleComplete(
		vData
	) 
	{		
		vData[0].vCurrentCount++;
       
		if((vData[0].vCurrentCount > vData[0].vCount) && (vData[0].vCount != 0))
		{
			createjs.Tween.removeTweens(vData[0].vObject);
			
			if(vData[0].vComplete != null)
				return vData[0].vComplete();
		}
		else
		{
			//set obj to original place, prep for loop
			for(key in vData[0].vPropDefault)
				vData[0].vObject[key] = vData[0].vPropDefault[key];
				
			//start the transition using tween
			createjs.Tween.get(vData[0].vObject)			
				.to(vData[0].vPropEnd, vData[0].vDuration, vData[0].vFunc)
				.call(handleComplete, [vData]);						
		}				
	};	
};

//-------------------------------------------------------------------------------------------------
cTransit.fEndTransit = function(
	vObject							//	object to manage
)
{
	//remove only 1 tween, incase createjs has object using tween and gets removed
	if((vObject != null) && (vObject != undefined))			
		createjs.Tween.removeTweens(vObject);	
	else
		createjs.Tween.removeAllTweens();	
};












