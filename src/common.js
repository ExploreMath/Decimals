//----------------------------------------------------------------------------------------------------
//	Gobal var
//----------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------
//	class name.
//----------------------------------------------------------------------------------------------------
window.Common = (function() {

//----------------------------------------------------------------------------------------------------
//	namespace.
//----------------------------------------------------------------------------------------------------
function Common() {}	

//*Do not remove
var mExtendedClass = null;
var mExtendClass = null;
//*Write your class name here,	and use mSignalDivert for target such as dispatch/player/..
var mSignalDivert = Common;		//this will Change if it's extend by another class
var mThisClass = Common;		//fix class, wont change, for extend use

//*Note special private var key, can inherit from extend but not shared
var mThisVar = {};

//----------------------------------------------------------------------------------------------------
//	Start of class - involve by module or extend
//----------------------------------------------------------------------------------------------------
Common.fModuleLoaded = function(
	vId
)
{			
	//----------------------------------------------------------
	//extend function, do not move. If not using, Comment off
	//	(class name to extend (string), this vId)
	// 	user gobal var if sharing among the classes is required
	//----------------------------------------------------------

	
	//keep record of the id of this module, so that do not required hard coding 
	//	example mScene[mThisVar.id] rather than mScene["DemoLib"]
	mThisVar.id = vId;	
}

//-------------------------------------------------------------------------------------------------
//*DO NOT REMOVE
//	fExtend, use to extend another class and setup the calling
//-------------------------------------------------------------------------------------------------
function
fExtend(
	vClass,
	vId
)
{
	var o;
	var key;
	
	o = window[vClass].fExtend(mExtendClass ? mExtendClass : mThisClass, vId);
	
	mExtendedClass = o[0];
	
	for(key in o[1])
	{
		//*Rename this if you Change the "special private var key"
		mThisVar[key] = o[1][key];			
	}
}

//-------------------------------------------------------------------------------------------------
//*DO NOT REMOVE
//	Engine.fExtend, for primary class able to call and extends this class
//-------------------------------------------------------------------------------------------------
Common.fExtend = function(
	vParentClass,
	vId
)
{
	//*Rename this if you Change the "special private var key"
	mThisVar.id = vId;
	mExtendClass = vParentClass;
	
	mThisClass.fModuleLoaded(vId);
	
	//*Rename this if you Change the "special private var key"
	return [this, mThisVar];
}

//------------------------------------------------------------------------------------------------- 
//*DO NOT REMOVE
//internal pState
//	this decides if the pState is passing to parent class or for itself
//------------------------------------------------------------------------------------------------- 
function 
pState(
	vData
)
{
	if(mExtendClass != null)
		mExtendClass.pForwardState(vData);
	else	
		mThisClass.pState(vData);	
}

//------------------------------------------------------------------------------------------------- 
//*DO NOT REMOVE
//	call from extend class, passing to self pState to handle
//------------------------------------------------------------------------------------------------- 
Common.pForwardState = function(
	vData
)
{
	pState(vData);
}

//------------------------------------------------------------------------------------------------- 
//*DO NOT REMOVE
//external pState
//	this pState allows outside/extend class to reach
//------------------------------------------------------------------------------------------------- 
Common.pState = function(
	vData
)
{
	//switch (vSignal)
	//{		
	//
	//}
	
	//*DO NOT REMOVE (for passing to extend class)
	if(mExtendedClass != null)
		mExtendedClass.pState(vData);
}

//------------------------------------------------------------------------------------------------- 
//*DO NOT REMOVE
//handle signal
//-------------------------------------------------------------------------------------------------
Common.fOnSignal = function(
	vTarget, 				//	original target for signal
	vSignal, 				//	signal received
	vData					//	extra data along with signal
)
{
	fDbg("Common.fOnSignal = " + vTarget + " , " + vSignal + " , " + vData);
	
	var o, p;	
	
	switch (vSignal)
	{		
	case Signal_Click:
		switch (vTarget.name)
		{
		case "cbZoom":
			if(vTarget.Selected == true)
			{
				mScene[mThisVar.id].mcFeatures.visible=false;
				SYS.fDispatch("Engine", "Signal_Zoom", true);
			}
			else
			{
				mScene[mThisVar.id].mcFeatures.visible=true;
				SYS.fDispatch("Engine", "Signal_Zoom", false);
			}
			return false;
			
		case "pbHint":
			mScene["Message"].visible=true;
			return false;
		
		case "pbReset":
			SYS.fDispatch("Engine", "Signal_Reset");
			return false;
		}
		break;
	}
	
	//*DO NOT REMOVE (for passing to extend class)
	if(mExtendedClass != null)
		mExtendedClass.fOnSignal(vTarget, vSignal, vData);
	
	return false;
}

//----------------------------------------------- 
// your own functions {
//----------------------------------------------- 


//----------------------------------------------- 
// }
//----------------------------------------------- 

//----------------------------------------------------------------------------------------------------
return Common;
})();
