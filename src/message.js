//-------------------------------------------------------------------------------------------------

window.Message = (function() {

//----------------------------------------------------------------------------------------------------
//	namespace.
//----------------------------------------------------------------------------------------------------
function Message() {}	

var mThisVars = {};

Message.fModuleLoaded = function(
	vId
)
{
	mThisVars.id = vId;
	cMessage();
}

function
cMessage(
) 
{
}

//------------------------------------------------------------------------------------------------- 
//handle signal. //todo. return true to bubble signal to parent, false (default) to stop.
//-------------------------------------------------------------------------------------------------
Message.fOnSignal = function(
	vTarget, 				//	original target for signal
	vSignal, 				//	signal received
	vData					//	extra data along with signal
)
{
	fDbg("Message.fOnSignal = " + vTarget + " , " + vSignal + " , " + vData);
	
	switch (vSignal)
	{
	case Signal_Click:
		switch(vTarget.name)
		{
			case "pbClose":
				mScene[mThisVars.id].visible = false;
			return false;
		}
		break;
	}

	return false;
}

//----------------------------------------------------------------------------------------------------
return Message;
})();
