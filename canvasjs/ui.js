//-------------------------------------------------------------------------------------------------

window.UI = (function() {

//----------------------------------------------------------------------------------------------------
//	namespace.
//----------------------------------------------------------------------------------------------------
function UI() {}	

var mThisVars = {};

UI.fModuleLoaded = function(
	vId
)
{
	mThisVars.id = vId;
	cUI();
}

function
cUI(
) 
{
}

//------------------------------------------------------------------------------------------------- 
//handle signal. //todo. return true to bubble signal to parent, false (default) to stop.
//-------------------------------------------------------------------------------------------------
UI.fOnSignal = function(
	vTarget, 				//	original target for signal
	vSignal, 				//	signal received
	vData					//	extra data along with signal
)
{
	switch (vSignal)
	{
	case Signal_Click:
		switch(vTarget.name)
		{
			case "pbGo":
				mScene["Title"].visible = false;
				Engine.fStart();
			return false;
		}
		break;
	}

	return false;
}

//----------------------------------------------------------------------------------------------------
return UI;
})();
