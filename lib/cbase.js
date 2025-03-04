//-------------------------------------------------------------------------------------------------
//static public const
//-------------------------------------------------------------------------------------------------
var Signal_Added = "Added";
var Signal_Removed = "Removed";

var Signal_MouseOver = "MouseOver";
var Signal_MouseOut = "MouseOut";
var Signal_MouseDown = "MouseDown";
var Signal_MouseUp = "MouseUp";
var Signal_MouseMove = "MouseMove";
var Signal_Click = "Click";

var Signal_FocusIn = "FocusIn";
var Signal_FocusOut = "FocusOut";
var Signal_KeyDown = "KeyDown";
var Signal_KeyUp = "KeyUp";
var Signal_Change = "Change";

var Signal_Scroll = "Scroll";

var Signal_Render = "Render";

var Signal_Resize = "Resize";

var Signal_Activate = "Activate";
var Signal_Deactivate = "Deactivate";
var Signal_Start = "Start";
var Signal_End = "End";
var Signal_Suspend = "Suspend";
var Signal_Resume = "Resume";
var Signal_Ready = "Ready";

var Signal_SetupMic = "SetupMic";

var Signal_Ignore = "Ignore";
var Signal_Idle = "Idle";
var Signal_Back = "Back";
var Signal_Done = "Done";
var Signal_Delay = "Delay";
var Signal_Once = "Once";
var Signal_Loop = "Loop";
var Signal_Drag = "Drag";
var Signal_Drop = "Drop";
var Signal_Load = "Load";
var Signal_Progress = "Progress";

//-------------------------------------------------------------------------------------------------
//cBase, base function of classes
//-------------------------------------------------------------------------------------------------
function 
cBase(
	vTarget, 
	vKey
) 
{	
	if(vTarget == null)
		return;
	
	//--------------------------------------
	//fake render to be override
	vTarget.fRender = function(vData) 
	{ 	 		
	};
	vTarget.Enabled = true;
	
	//--------------------------------------
	vTarget.fEnable = function(vData)
	{				
		this.mouseEnabled = vData;
		this.Enabled = vData; 
		this.fRender();
	};
	//--------------------------------------
	vTarget.prefix = fPrefix(vKey);
	//--------------------------------------
	vTarget.suffix = fSuffix(vKey);
	//--------------------------------------
	vTarget.name = vKey;	
	
	if (vTarget.timeline == undefined)
		vTarget.type = "Container";
	else
	{
		vTarget.type = "MovieClip";
		vTarget.stop();
	}	
	
	//--------------------------------------
	vTarget.pIndex = function()	
	{		
		if(this.parent)
			return this.parent.getChildIndex(this);
	}; 
	
	//--------------------------------------
	vTarget.pSetIndex = function(vIndex)	
	{
		this.parent.setChildIndex(this, vIndex);
		stage.update();
	}; 
	
	//--------------------------------------
	vTarget.fRaiseToTop = function(vList)
	{
		var i;
		var j;
		
		if (this.parent == null)
			return;
		
		for (i = 0, j = 1; j < vList.length; j++)
		{			
			if (vList[j].pIndex() > vList[i].pIndex())
				i = j;
		}
		vTarget.pSetIndex(vList[i].pIndex());		
	};	
	
	//add default fOnSignal to all item with no handle method, return true
	//to top module
	//class that wish to intercept, override this function to return to parent
	vTarget.fOnSignal = function(
		vTarget, 				//	original target for signal
		vSignal, 				//	signal received
		vData					//	extra data along with signal
	)
	{
		return true;
	}
}	


 
 
 
 
 
 
 
 
 
 
