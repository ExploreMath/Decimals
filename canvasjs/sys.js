var canvas, stage;
var mScene = {};
var mTempFocusTarget = null;
var mFocusTarget = null;
var mCurrentAudio = null;
var mIsMobilePlatform;

window.SYS = (function() {

//----------------------------------------------------------------------------------------------------
//	namespace.
//----------------------------------------------------------------------------------------------------	
function SYS() {}	

//----------------------------------------------------------------------------------------------------
//	private SYS var
//----------------------------------------------------------------------------------------------------
//standard var
var mImportKB = {};
var mUsePlatformKeyboard = false;
var mMouseTarget = null;
var mDownTarget = null;
var vMobileOrientation;
var mMousePos = new createjs.Point(0,0);
var mDeviceNativeInput = null;	//added since remove of jquery usage of $(input)

//var for handlers
var mSoundList = [];			//list of all sound object
var mModuleIndex = [];			//track module layer and signal dispatch sequence
var mPlayerTracker = [];		//player tracker
var mSoundTracker = [];			//sound tracker
var mTimerTracker = [];			//timer tracker
var mTimerTrackerID = 0;		//ID counting for timer
var mSoundInstanceTackerN = 0;	//N counter for sound

var mDefinition = {};

var mURL;
var mPath;
var mFoldername;
var mLoadingScreen = null;
//create worker to control module que loading
//var mQueWorker = new Worker('./lib/queworker.js');

var mQueWorker = [];
var mCurrentLoad = null;

//----------------------------------------------------------------------------------------------------
//	
//----------------------------------------------------------------------------------------------------

mDefinition.ToLoad = 0;
mDefinition.Loaded = 0;
mDefinition.OffSetX = 0;

mURL = document.location.pathname;
mPath = mURL.substring(mURL.indexOf('/'), mURL.lastIndexOf('/'));
mFoldername = mPath.match(/([^\/]*)\/*$/)[1];

//----------------------------------------------------------------------------------------------------
//	SYS to send 0% progress first to RP viewer to retain loading animation
//----------------------------------------------------------------------------------------------------
try{
	window.parent.postMessage({ event: "progress.value.change", value: "0%"}, "*");	
}catch(err){}
			
//----------------------------------------------------------------------------------------------------
//	property pUrl; url that cModule belongs to.
//----------------------------------------------------------------------------------------------------
SYS.pUrl = mURL;

//----------------------------------------------------------------------------------------------------
//	property pPath; path portion of url.
//----------------------------------------------------------------------------------------------------
SYS.pPath = mPath;

//----------------------------------------------------------------------------------------------------
//	property pFolder; folder portion of url.
//----------------------------------------------------------------------------------------------------
SYS.pFolder = mFoldername;

//----------------------------------------------------------------------------------------------------
//	property pUsePlatformKeyboard; set if to use Platform native Keyboard on mobile device (qwerty)
//	to set it before SYS.fInit
//----------------------------------------------------------------------------------------------------
SYS.pUsePlatformKeyboard = function(
	vBool
) 
{
	mUsePlatformKeyboard = vBool; 
}

//----------------------------------------------------------------------------------------------------
//	property pMousePos; return the mMousePos and prevent override of var name mMousePos 
//----------------------------------------------------------------------------------------------------
SYS.pMousePos = function(
) 
{
	return mMousePos;
}

//----------------------------------------------------------------------------------------------------
//	property pSoundList; return the soundlist and prevent override of var name mSoundList 
//----------------------------------------------------------------------------------------------------
SYS.pSoundList = function(
) 
{
	return mSoundList;
}

//-------------------------------------------------------------------------------------------------
//	include .js class into project
//-------------------------------------------------------------------------------------------------
SYS.fAddDefinition = function(
	vUrl // path of js
) 
{
	mDefinition.ToLoad++;	
	cScriptLoading(vUrl);
}

//----------------------------------------------------------------------------------------------------
//	Data is using sessionStorage, it stores the data for only the session. The data is deleted when 
//	the user closes the specific browser tab.
//----------------------------------------------------------------------------------------------------
//	whether has named data in sessionStorage.
//----------------------------------------------------------------------------------------------------
SYS.fHasData = function(
	vName 							//	name of data to get
)
{
	if (typeof(Storage) !== "undefined") 
	{
		if(sessionStorage[vName] != undefined)
			return true;
		else	
			return false;
	} 
	else 	
		throw ("Storage not supported");	
}

//-------------------------------------------------------------------------------------------------
//	set/clear named data in sessionStorage. Data is stored in "contents" property of "data".
//-------------------------------------------------------------------------------------------------
SYS.fSetData = function(
	vName,							//	name of data to set
	vData							//	data to set to; if null clear
) 
{
	if(vData == undefined)
		vData = null;
	
	if (typeof(Storage) !== "undefined") 
	{
		if(vData != null)
			sessionStorage.setItem(vName, vData);
		else
			sessionStorage.removeItem(vName);
	} 
	else 	
		throw ("Storage not supported");	
}

//----------------------------------------------------------------------------------------------------
//	get named data in sessionStorage. Data is stored in "contents" property of "data".
//----------------------------------------------------------------------------------------------------
SYS.fGetData = function(
	vName,							//	name of data to get
	vData							//	default to return if not found
)
{
	if (typeof(Storage) !== "undefined") 
	{
		if(vData == undefined)
			vData = null;	
			
		if ((sessionStorage[vName] != undefined) || (vData != null))
		{
			if ((sessionStorage.getItem(vName) == null) && (vData != null))
				sessionStorage.setItem(vName, vData);
			
			return sessionStorage.getItem(vName);	
		} 
		else	
			return undefined;
	} 
	else 	
		throw ("Storage not supported");	
}

//----------------------------------------------------------------------------------------------------
//	clear all data in sessionStorage
//----------------------------------------------------------------------------------------------------
SYS.fClearData = function(
)
{
	if (typeof(Storage) !== "undefined") 	
		sessionStorage.clear();	
	else 	
		throw ("Storage not supported");	
}

//----------------------------------------------------------------------------------------------------
//	LTM is using localStorage, it has no expiration date. The data will not be deleted when the 
//	browser is closed, and will be available the next day, week, or year.
//----------------------------------------------------------------------------------------------------
//	whether has named data in long Term storage/memory(localStorage).
//----------------------------------------------------------------------------------------------------
SYS.fHasLTM = function(
	vName 							//	name of data to get
)
{
	if (typeof(Storage) !== "undefined") 
	{
		if(localStorage[vName] != undefined)
			return true;
		else	
			return false;
	} 
	else 	
		throw ("Storage not supported");	
}

//-------------------------------------------------------------------------------------------------
//	set/clear named data in long Term storage/memory(localStorage). Data is stored in "contents" 
//	property of "data".
//-------------------------------------------------------------------------------------------------
SYS.fSetLTM = function(
	vName,							//	name of data to set
	vData							//	data to set to; if null clear
) 
{
	if(vData == undefined)
		vData = null;
	
	if (typeof(Storage) !== "undefined") 
	{
		if(vData != null)
			localStorage.setItem(vName, vData);
		else
			localStorage.removeItem(vName);
	} 
	else 	
		throw ("Storage not supported");	
}

//----------------------------------------------------------------------------------------------------
//	get named data in long Term storage/memory(localStorage). Data is stored in "contents" 
//	property of "data".
//----------------------------------------------------------------------------------------------------
SYS.fGetLTM = function(
	vName,							//	name of data to get
	vData							//	default to return if not found
)
{
	if (typeof(Storage) !== "undefined") 
	{
		if(vData == undefined)
			vData = null;	
			
		if ((localStorage[vName] != undefined) || (vData != null))
		{
			if ((localStorage.getItem(vName) == null) && (vData != null))
				localStorage.setItem(vName, vData);
			
			return localStorage.getItem(vName);	
		} 
		else	
			return undefined;
	} 
	else 	
		throw ("Storage not supported");	
}

//----------------------------------------------------------------------------------------------------
//	clear all data in sessionStorage
//----------------------------------------------------------------------------------------------------
SYS.fClearLTM = function(
)
{
	if (typeof(Storage) !== "undefined") 	
		localStorage.clear();	
	else 	
		throw ("Storage not supported");	
}

//-------------------------------------------------------------------------------------------------
//	calculate the shapes's size from regx,y and return rectangle (0, 0, width, height).
//	check starts from Anchor Point, if shape width exceed above Anchor Point, will not be checked.
//	More for getting height than width, height is from Anchor Point onward
//	The right loop is to ensure height on the right side is checked too incase right height is 
//	higher, which in turn also returns the width during the height check.
//-------------------------------------------------------------------------------------------------
SYS.fCalculateShapeBound = function(
	vShape
) 
{
	var i = 0;
	var j;
	var vPixelLooper = 1;	
	var vLeft = -24;	//must be power of 3 since is checking per 3 pixel
	var vRight = 24;	//must be power of 3 since is checking per 3 pixel
	var vHitPass;	
	var vWidth = 0;
	
	while( i < vPixelLooper) //height mover
	{
		j = 0;
		vHitPass = false;
		while(j >= vLeft) //search left
		{
			if(vShape.hitTest(j, i))
			{				
				vHitPass = true;
				if(j <= vLeft)	//hit at end of left, add more to check if size is bigger
					vLeft = vLeft - 9;	//add left range (9 pixel width, 3 Point checking)
			}			
			j = j - 3; 	//check next 3rd pixel		
		}
		
		j = 0;
		while(j <= vRight) //search right	
		{
			if(vShape.hitTest(j, i))
			{				
				if(vWidth < j)
					vWidth = j; //store further's width
					
				vHitPass = true;
				if(j >= vRight)	//hit at end of right, add more to check if size is bigger
					vRight = vRight + 9;	//add right range (9 pixel width, 3 Point checking)
			}
			j = j + 3; //check next 3rd pixel	
		}
		
		i = i + 1; //next pixel height (increase by per pixel else will miss)
		
		if(vHitPass == true)	//hit on this height, move to next height					
			vPixelLooper++;			
	}
	return (new createjs.Rectangle(0, 0, vWidth, vPixelLooper));	
}

//-------------------------------------------------------------------------------------------------
// Build a loading screen above
//-------------------------------------------------------------------------------------------------
SYS.fStartLoadingUI = function(
	vSize,
	vText
) 
{
	var i;
	var j;
	var o;
	var p;
	var q;

	if(mLoadingScreen)	
	{
		//change text of small size loading
		if ((vSize == "small") && (vText != undefined) && (mLoadingScreen.name == "small"))
		{
			o = document.getElementById("LoadingTextDisplay"); 
			o.innerHTML = "Loading... " + vText;
		}		
		
		//change of existing loading size
		if(mLoadingScreen.name != vSize) 
			SYS.fEndLoadingUI();
		else
			return;
	}
		
	switch(vSize)
	{	
		case "small":		
			mLoadingScreen = document.createElement('div');
			mLoadingScreen.name = "small";
			mLoadingScreen.style.width = canvas.width + "px";
			mLoadingScreen.style.height = canvas.height + "px";
			
			o = document.createElement('div');
			o.className = "loadersmall";
			
			p = document.createElement('p');
			p.id = "LoadingTextDisplay";
			
			if(vText != undefined)
				p.innerHTML = "Loading... " + vText;
			else
				p.innerHTML = "Loading...";
			
			p.style.fontSize = "small";
			p.style.font = "arial,serif";
			
			q = document.createElement('div');
			q.style.width = canvas.width + "px";
			q.style.height = "40px";
			
			mLoadingScreen.appendChild(q);
			mLoadingScreen.appendChild(o);
			mLoadingScreen.appendChild(p);			
			document.body.appendChild(mLoadingScreen);
					
			mLoadingScreen.style.left = "0px";
			mLoadingScreen.style.top = "0px"; 
			mLoadingScreen.style.position = "absolute";	
			
			o.style.left = "5px";
			o.style.top = "5px";
			o.style.position = "absolute";
		
			p.style.left = "40px";
			p.style.top = "0px";
			p.style.position = "absolute";
			
			q.style.left = "0px";
			q.style.top = "0px";
			q.style.position = "absolute";
			
			q.style.backgroundColor = 'orange';
			break;
			
		default:
			mLoadingScreen = document.createElement('div');
			mLoadingScreen.name = "big";
			mLoadingScreen.style.width = canvas.width + "px";
			mLoadingScreen.style.height = canvas.height + "px";
			
			o = document.createElement('div');
			o.className = "loaderbig";			
			o.style.width = o.style.height = (canvas.width / 3) + "px";			
			mLoadingScreen.appendChild(o);
			
			p = document.createElement('p');
			p.id = "LoadingTextDisplay";
			
			j = 0;
			for(i = 0 ; i < mModuleIndex.length ; i++)
			{
				if(mModuleIndex[i].Loaded == true)
				{
					j += (100 / mModuleIndex.length);
				}
			}
			
			//if(vText != undefined)
				p.innerHTML = "Loading... " + Math.floor(j) + "%";
			//else
				//p.innerHTML = "Loading...";
				
			try{
				window.parent.postMessage({ event: "progress.value.change", value: Math.floor(j).toString() + "%"}, "*");	
			}catch(err){}
				
			//p.style.fontSize = (canvas.width / 20) > 70 ? 70 : (canvas.width / 20) + "px";
			p.style.fontSize = (parseInt(stage.canvas.height) / 10) + "px";
			p.style.font = "arial,serif";
			mLoadingScreen.appendChild(p);
			
			document.body.appendChild(mLoadingScreen);
		
			o.style.left = (canvas.width / 2) - (((canvas.width / 3) / 2) + 15) + "px";
			o.style.top = (canvas.height / 2) - (((canvas.width / 3) / 2) + 15) + "px";			
			o.style.position = "absolute";
		
			p.style.left = ((canvas.width / 2) - (parseInt(stage.canvas.width) / 4.5)) + "px";
			p.style.top = ((canvas.height / 100) * 85) - (parseInt(stage.canvas.height) / 10) + "px";
			p.style.position = "absolute";
			
			mLoadingScreen.style.left = "0px";
			mLoadingScreen.style.top = "0px"; 
			mLoadingScreen.style.position = "absolute";	
				
			mLoadingScreen.style.backgroundColor = 'white';
			break;
	}	
	fResize();
}

//-------------------------------------------------------------------------------------------------
// Build a loading screen above
//-------------------------------------------------------------------------------------------------
SYS.fEndLoadingUI = function(
) 
{
	if(mLoadingScreen == null)	
		return;
	
	mLoadingScreen.parentNode.removeChild(mLoadingScreen);
	mLoadingScreen = null;
}

function slowAlert() {
  console.log(lib);
}

//-------------------------------------------------------------------------------------------------
// simple getscript method to remove jquery dependent
//-------------------------------------------------------------------------------------------------
SYS.getScript = function(
	source
)
{
    var jsElm;
	var prior;
	
	jsElm = document.createElement('script');
	prior = document.getElementsByTagName('script')[0];	
	
	jsElm.type = "application/javascript";
	
	jsElm.addEventListener("load", fWaitSrc);
	
	//document.body.appendChild(jsElm);
	prior.parentNode.insertBefore(jsElm, prior);
	jsElm.src = source;	
}

//-------------------------------------------------------------------------------------------------
// simple get method to remove jquery dependent
//-------------------------------------------------------------------------------------------------
SYS.get = function(
	source, 
	callback
)
{
	var result;
	var xhr;
				
	if (window.XMLHttpRequest)
	{											
		//ActiveXObject is available only on IE browser & use in IE to Loaded local file
		//using XMLHttpRequest not possible to Loaded local file for IE
		if (window.ActiveXObject !== undefined)
			xhr = new window.ActiveXObject( "Microsoft.XMLHTTP" );
		else
			xhr = new window.XMLHttpRequest();
		
		xhr.onreadystatechange = function() 
		{		
			if ((typeof xhr.responseText === "string" ) && (xhr.responseText != "") && (xhr.readyState == 4))
			{
				result = xhr.responseText;
				if(callback) 
					callback(result); 
			}
		}
		xhr.open("GET",source,true);
		xhr.send(null);
	}
}

//-------------------------------------------------------------------------------------------------
//	Init (Event, keyboard & resize)
//-------------------------------------------------------------------------------------------------
SYS.fInit = function (	
) 
{	
	var i;
	var o;	
	
	//working in android, but not in ios
	document.querySelector("meta[name=viewport]").setAttribute('content', 'width=device-width, initial-scale=1.0');
	
	canvas = document.getElementById("canvas");		
	stage = new createjs.Stage(canvas);
	
	createjs.Ticker.setFPS(mFPS);
	createjs.Ticker.addEventListener("tick", stage);
	
	stage.enableMouseOver(20);
	createjs.Touch.enable(stage);

	mIsMobilePlatform = fmobileAndTabletcheck();
	
	//handle Touch(mobile) event
	window.addEventListener("touchmove", fWindowTouchMove); 
	window.addEventListener("touchend", fTouchClick); 
	window.addEventListener("touchstart", fWindowTouchDown); 					

	//handle window event
	window.addEventListener("mousemove", fWindowMouseMove);
	window.addEventListener("click", fWindowClick);
	window.addEventListener("dblclick", fWindowDbClick);
	window.addEventListener("mousedown", fWindowMouseDown); 
	
	window.document.onkeydown = SYS.keyPressed;
		
	if(mUsePlatformKeyboard)
	{
		mDeviceNativeInput = document.createElement("Input");
		mDeviceNativeInput.type = "text";
		mDeviceNativeInput.style.position = "absolute";
		mDeviceNativeInput.style.left = "0px";
		mDeviceNativeInput.style.top = "0px";
		mDeviceNativeInput.style.width = "0px";
		document.body.appendChild(mDeviceNativeInput); 
		mDeviceNativeInput.style.visibility = "hidden";			
	}
	
	fSetUpKeyboard();
	
	//after setup
	fResize();
	
	if(mIsMobilePlatform)	
		vMobileOrientation = -1;
	else
		vMobileOrientation = window.orientation;	
		
	window.addEventListener('resize', fResize, false);
}

//-------------------------------------------------------------------------------------------------
//start recursive depth casing classes, fCreate of adobe flash
//-------------------------------------------------------------------------------------------------
SYS.fCreate = function(
	vData
)
{
	if (vData.timeline == undefined)
		vData.type = "Container";
	else
	{
		vData.type = "MovieClip";
		vData.stop();
	}
	for (var key in vData) {	
		if(fPrefix(String(key)) == "xIgnore")
			vData[key].name = "xIgnore";		
		
		var type = String(key).toLowerCase().substr(0, 2);

		switch(type)
		{
			case "mc":
			case "pb":			
			case "cb":			
			case "rb":			
			case "hs":
			case "sv":
			case "sb":
			case "hs":
			case "tf":
			case "ct":
				cBase(vData[key], key);
				switch(type)
				{								
					case "rb":
						cRadioButton(vData[key]);
						break;
					case "cb":	
						cCheckBox(vData[key]);
						break;
					case "pb":	
						cPushButton(vData[key]);					
						break;
					case "sv":	
						cScrollView(vData[key]);					
						break;
					case "sb":
						cScrollbar(vData[key]);						
						break;
					case "hs":
						cHotSpot(vData[key]);						
						break;
					case "mc":
						cMovieClip(vData[key]);
						break;
					case "tf":
						cTextField(vData[key]);
						break;						
				}					
				if (fTweenChild(vData[key]) > 0)				
					SYS.fCreate(vData[key]);						
				break;
		}
	}
	return;
}

//-------------------------------------------------------------------------------------------------
// Dispatching signal to fOnSignal
// Signal will be dispatch to higher level if current layer does not handle
//		level is determine by the loading sequence of module
//-------------------------------------------------------------------------------------------------
SYS.fDispatch = function(
	vTarget, 	//	(cObject) target to dispatch signal to
	vSignal,	//	signal to dispatch; if null, discard
	vData		//	data to dispatch with signal
)
{
	var i;
	var o, p, q;
	
	if ((vSignal == Signal_Progress) || (vSignal == Signal_Done) || (vSignal == Signal_Added))
	{
		p = fPlayerSignalChanger(vTarget, vSignal, vData);
		if(p != null)
		{
			vTarget = p[0];
			vSignal = p[1];
			vData = p[2];
		}		
	}
	
	if(vSignal == null)
		return;	
		
	if(vData == undefined)
		o = null;
	else
		o = vData;
	
	//if target can receive, send to target	
	if(vTarget)	
		if(vTarget.fOnSignal != undefined)
		{
			p = vTarget.fOnSignal(vTarget, vSignal, o);
			
			if(p == false)
				return;
		}
		
	//target can not receive or target wish to bubble to higher level	
	//which module class vTarget belongs to, dispatch signal to Class	
	for(i = 0 ; i < mModuleIndex.length ; i++)
	{
		if(mModuleIndex[i] == vTarget)
			break;
		else if(mModuleIndex[i].Reference != undefined)
			if(mModuleIndex[i].Reference.contains(vTarget))			
				break;	
	}				
		
	while(i > -1)		
	{	
		if(mModuleIndex[i] == undefined)
		{
			if(i > -1)
				i -= 1;
			else
				break;
		}
		else
		{
			if(mModuleIndex[i].Reference != undefined)	
			{
				p = mModuleIndex[i].Class;

				if ((mScene[mModuleIndex[i].Id].visible == true) && (mScene[mModuleIndex[i].Id].Enabled == true))
					try {			
						q = window[p].fOnSignal(vTarget, vSignal, o);	
						
						if((q != undefined) && (q == false))
							break;				
					}
					catch(err) {								
					}
				i -= 1;
			}
			else
				i -= 1;
		}
	}
}

//-------------------------------------------------------------------------------------------------
// Loads a js module and dispatch to fModuleLoaded of the given class
//-------------------------------------------------------------------------------------------------
SYS.fStartLoader = function	(
	vCaller,
	vDispatchSignal,
	vUrl,
	vId
)
{
	var o = {Id : vId, 
			Url : vUrl,
			DispatchSignal : vDispatchSignal,
			Caller : vCaller,
			Method : "Loader"};	
	
	SYS.fStartLoadingUI("small", vId);
		
	mQueWorker.push(o);	
	fRunQue();
	//mQueWorker.postMessage({"cmd" : "load", "data" : o}); // Send filename to our worker.
}

//-------------------------------------------------------------------------------------------------
// Loads a js module and dispatch to fModuleLoaded of the given class
//-------------------------------------------------------------------------------------------------
SYS.fLoaderDone = function	(
	vId
)
{
	fCreateSoundInstance();	
	
	mCurrentLoad = null;	
	fRunQue();
	//mQueWorker.postMessage({"cmd" : "done", "data" : vId}); // Send filename to our worker.	
}

//-------------------------------------------------------------------------------------------------
// Loads a js module and dispatch to fModuleLoaded of the given class
//-------------------------------------------------------------------------------------------------
SYS.fStartModule = function	(
	vUrl, 
	vId,
	vClass
)
{
	fDbg("vUrl = " + vUrl);
	
	var o = {Id : vId, 
			Url : vUrl,
			Class: vClass,
			Loaded : false,
			Method : "Module"};	
	
	mModuleIndex.push(o);	
	SYS.fStartLoadingUI();
		
	SYS.fStartLoadingUI();	
		
	mQueWorker.push(o);	
	fRunQue();
	
	//cModule(mCurrentLoad.Url, mCurrentLoad.Id, mCurrentLoad.Class);
	//mQueWorker.postMessage({"cmd" : "load", "data" : o}); // Send filename to our worker.
}

//-------------------------------------------------------------------------------------------------
// end module by Id or null for last Loaded module
//-------------------------------------------------------------------------------------------------
SYS.fEndModule = function (
	vId
)
{
	if(vId != null)
	{
		for(i = 0 ; i < mModuleIndex.length ; i++)
		{
			if(mModuleIndex[i].Id == vId)
			{
				stage.removeChild(mScene[mModuleIndex[i].Id]);
				mModuleIndex.splice(i, 1);       
				return;
			}
		}
	}
	else //last module
	{
		stage.removeChild(mScene[mModuleIndex[mModuleIndex.length - 1].Id]);
		mModuleIndex.pop();
	}
}

//----------------------------------------------------------------------------------------------------
//	start playing movieclip from vBegin to vEnd.
//----------------------------------------------------------------------------------------------------
SYS.fStartPlayer = function(
	vTarget,									//	(cObject) target to dispatch signal to
	vProgressSignal,							//	signal to dispatch on progress; if null, none
	vCompleteSignal,							//	signal to dispatch on completion; if null, none
	vMovieClip,									//	(MovieClip/cMovieClip) object to manage
	vBegin,										//	(String/int) play from; if null, current
	vEnd,										//	(String/int) play to; if null, stop; if -1, end
	vCount										//	count to do; if 0, unlimited
)
{	
	var o = {vTarget : vTarget,
			vProgressSignal : vProgressSignal,
			vCompleteSignal : vCompleteSignal,
			vMovieClip : vMovieClip,
			vBegin : (((vBegin == undefined) || (vBegin == null)) ? vMovieClip.pCurrentFrame() : vBegin),
			vEnd : (vEnd == undefined ? null : vEnd),
			vCount : (vCount == undefined ? 1 : (vCount == 0 ? "loop" : vCount))
			};
			
	SYS.fEndPlayer(null, null, vMovieClip);		
			
	if(o.vEnd == -1)
		o.vEnd = vMovieClip.pTotalFrames();		
		
	if ((o.vBegin == o.vEnd) || (o.vEnd == null))
	{
		//make sure it's stop at the vEnd and also to fCreate the frame		
		if((o.vEnd == null) && (o.vBegin != null))
		{
			o.vEnd = "FrameChangeOnlyFromPlayer";
			mPlayerTracker.push(o);			
			vMovieClip.fStop(o.vBegin);
		}
		else if(vCompleteSignal != null)		
			SYS.fDispatch(o.vTarget, vCompleteSignal);			
	}	
	else
	{			
		if(o.vCount != "loop")
			o.vCount = o.vCount - 1;

		mPlayerTracker.push(o);			
		vMovieClip.fPlay(o.vBegin, o.vEnd);
	}	
}

//----------------------------------------------------------------------------------------------------
//	end player for target/signal.
//----------------------------------------------------------------------------------------------------
SYS.fEndPlayer = function(
	vTarget,							//	(cObject) target to match; if null, any
	vCompleteSignal,					//	signal to match; if null, any
	vMovieClip							//	(MovieClip/cMovieClip) object to match; if null, any
)
{
	var i, j;
	var o, p, key;

	o = {};
	//----------------------------------------------------------------------------------------------------
	if(vTarget == undefined)
		vTarget = null;
	
	if(vCompleteSignal == undefined)
		vCompleteSignal = null;
		
	if(vMovieClip == undefined)
		vMovieClip = null;
	
	//----------------------------------------------------------------------------------------------------		
	if(vTarget != null)
		o.vTarget = vTarget;
		
	if(vCompleteSignal != null)
		o.vCompleteSignal = vCompleteSignal;
		
	if(vMovieClip != null)
		o.vMovieClip = vMovieClip;	
	
	j = 0;	
	for(key in o)	
		j++;	
		
	//----------------------------------------------------------------------------------------------------	
	if (j == 0)	
	{
		for(i = 0 ; i < mPlayerTracker.length ; i++)
			mPlayerTracker[i].vMovieClip.fEnd();
		
		mPlayerTracker = [];	
	}
	else
	{
		for(i = 0 ; i < mPlayerTracker.length ; i++)
		{
			p = true;
			for(key in o)	
			{
				if(mPlayerTracker[i][key] != o[key])
					p = false;
			}
			
			if(p)
			{
				mPlayerTracker[i].vMovieClip.fEnd();
				mPlayerTracker.splice(i, 1);
				
				i = i - 1; //reset the i to go through all again
			}
		}	
	}
}

//----------------------------------------------------------------------------------------------------
//	start playing sound from url
//	*Array type vUrl unable to use count 0
//----------------------------------------------------------------------------------------------------
SYS.fStartSound = function(
	vTarget,								//	(cObject) target to dispatch signal to
	vSignal,								//	signal to dispatch on completion; if null, none
	vUrl,									//	(String/Array) url of sound to load
	vCount									//	count to play; if 0, unlimited
)
{
	//put everything in Array
	if(Array.isArray(vUrl) != true)	
		vUrl = [vUrl];
	
	var o = {vTarget : vTarget,
			vSignal : vSignal,
			vUrl : vUrl,
			vCount : (vCount == undefined ? 1 : vCount),
			vQue : 0
			};
			
	if(o.vCount != 0)	
	{
		o.instances = playSound(vUrl[0]);
		o.instances.addEventListener("complete", fSoundTrackerHandle);		
	}
	else
	{
		//count is 0, loop unlimited times, so don't add the listener to it
		o.instances = playSound(vUrl[0], -1);
	}	
	
	o.vCount = o.vCount - 1;
	mSoundTracker.push(o);
}

//----------------------------------------------------------------------------------------------------
//	end for target/signal.
//----------------------------------------------------------------------------------------------------
SYS.fEndSound = function(
	vTarget,								//	(cObject) target to match; if null, any
	vSignal									//	signal to match; if null, any
)
{
	var i, j;
	var o, p, key;

	o = {};
	//----------------------------------------------------------------------------------------------------
	if(vTarget == undefined)
		vTarget = null;
	
	if(vSignal == undefined)
		vSignal = null;
	
	//----------------------------------------------------------------------------------------------------		
	if(vTarget != null)
		o.vTarget = vTarget;
		
	if(vSignal != null)
		o.vSignal = vSignal;
	
	j = 0;	
	for(key in o)	
		j++;	
		
	//----------------------------------------------------------------------------------------------------	
	if (j == 0)	
	{
		for(i = 0 ; i < mSoundTracker.length ; i++)
			mSoundTracker[i].instances.stop();
		
		mSoundTracker = [];	
	}
	else
	{
		for(i = 0 ; i < mSoundTracker.length ; i++)
		{
			p = true;
			for(key in o)	
			{
				if(mSoundTracker[i][key] != o[key])
					p = false;
			}

			if(p)
			{
				mSoundTracker[i].instances.stop();				
				mSoundTracker.splice(i, 1);
				
				i = -1; //reset the i to go through all again
			}
		}
	}
}

//----------------------------------------------------------------------------------------------------
//	start timer.
//----------------------------------------------------------------------------------------------------
SYS.fStartTimer = function(
	vTarget,									//	(cObject) target to dispatch signal to
	vSignal,									//	signal to dispatch on completion
	vDuration,									//	in ms; duration to delay; if 0, next enterframe
	vCount,										//	count to do; if 0, unlimited
	vDelay										//	in ms; initial delay
)
{	
	var p;	
	var o = {vTarget : vTarget,
			vSignal : vSignal,
			vDuration : (vDuration == undefined ? 0 : vDuration),
			vCount : (vCount == undefined ? 1 : (vCount == 0 ? "loop" : vCount)),
			vDelay : (vDelay == undefined ? 0 : vDelay),
			vId : mTimerTrackerID
			};
	
	//all start with timeout first to handle off and delay require		
	p = setTimeout(fTimerHandler, o.vDuration + o.vDelay, mTimerTrackerID);
	
	if(o.vCount != "loop")
		o.vCount = o.vCount - 1;
		
	o.TimerID = p;
		
	mTimerTrackerID = mTimerTracker.length;
	
	mTimerTracker.push(o);
}

//----------------------------------------------------------------------------------------------------
//	end timer for target/signal.
//----------------------------------------------------------------------------------------------------
SYS.fEndTimer = function(
	vTarget,									//	(cObject) target to match; if null, any
	vSignal										//	signal to match; if null, any
)
{
	var i, j;
	var o, p, key;

	o = {};
	//----------------------------------------------------------------------------------------------------
	if(vTarget == undefined)
		vTarget = null;
	
	if(vSignal == undefined)
		vSignal = null;
	
	//----------------------------------------------------------------------------------------------------		
	if(vTarget != null)
		o.vTarget = vTarget;
		
	if(vSignal != null)
		o.vSignal = vSignal;
	
	j = 0;	
	for(key in o)	
		j++;	
		
	//----------------------------------------------------------------------------------------------------	
	if (j == 0)	
	{
		for(i = 0 ; i < mTimerTracker.length ; i++)
		{
			clearTimeout(mTimerTracker[i].TimerID);
			clearInterval(mTimerTracker[i].TimerID);
		}
		mTimerTracker = [];	
		//reset Timer ID
		mTimerTrackerID = 0;
	}
	else
	{
		for(i = 0 ; i < mTimerTracker.length ; i++)
		{
			p = true;
			for(key in o)	
			{
				if(mTimerTracker[i][key] != o[key])
					p = false;
			}
			
			if(p)
			{				
				clearInterval(mTimerTracker[i].TimerID);
				clearTimeout(mTimerTracker[i].TimerID);						
				mTimerTracker.splice(i, 1);
				
				i = i - 1; //reset the i to go through all again
			}
		}	
	}
}

//-------------------------------------------------------------------------------------------------
// Module layering, addChild the stage by their order, if another module Loads faster, it will
//	still be Loaded at the correct layer
//-------------------------------------------------------------------------------------------------
SYS.fModuleLayer = function	(
	vId
)
{
	fCreateSoundInstance();
	
	//make target mScene into cMovieClip - Do it here as sound instance is only create after module layer
	cMovieClip(mScene[vId]);
	var mIsAllLoaded = true;
	
	for(i = 0 ; i < mModuleIndex.length ; i++)
	{
		if(mModuleIndex[i].Loaded == true)
			stage.addChild(mScene[mModuleIndex[i].Id]);
		else if(mModuleIndex[i].Id == vId)
		{
			mModuleIndex[i].Reference = mScene[vId];
			mModuleIndex[i].Loaded = true;
			stage.addChild(mScene[mModuleIndex[i].Id]);
		}	
		
		if(!mModuleIndex[i].Loaded)
			mIsAllLoaded = false;
	}	
		
	mCurrentLoad = null;	
	fRunQue();
	
	if(mIsAllLoaded)
	{
		try{
			window.parent.postMessage({ event: "progress.value.change", value:"100%"}, "*");	
		}catch(err){}
	}
	
	//mQueWorker.postMessage({"cmd" : "done", "data" : vId}); // Send filename to our worker.	
	SYS.fDispatch(mScene[vId], "Signal_ModuleLoaded");
}

//-------------------------------------------------------------------------------------------------
//	get library definition by name.
// 	if no vNameSpace is given default lib
//	might have issue if lib have same name objects although lib namespace issue was solved
//		for loading new script
//------------------------------------------------------------------------------------------------- 
SYS.fGetDefinitionByName = function(
	vDefinition,		//object name
	vNameSpace	//namespace of object	
)
{
	var o;
	o = vNameSpace;	
	if ((vNameSpace == null) || (vNameSpace == undefined))
		o = "lib";

	try{
		o = new window[o][vDefinition]()
		SYS.fCreate(o);
		return (o);
	}	
	catch(err){
		return null;
	}
}

//-------------------------------------------------------------------------------------------------
//	change of focus target
//	if nothing was passed (vObject == undefined), just to remove focus
//	mainly for textfield to switch to another textfield when current is full
//------------------------------------------------------------------------------------------------- 
SYS.fChangeFocusTarget = function(
	vObject		//object
)
{
	var o;	
	var nLines;	
	//remove of current target
	fRemoveFocusObj();
	
	if(vObject != undefined)
	{
		mFocusTarget = vObject;
		
		//is a text field
		if(vObject.fKeyed != undefined) 
		{			
			
			/*fDbg("mIsMobilePlatform :: " + mIsMobilePlatform);
			fDbg("mUseMobileKeyboard :: " + mUseMobileKeyboard);*/
			mFocusTarget.Focus(true);
			
			if (mFocusTarget.IsInput)
			{			
				stage.addChild(mImportKB[mFocusTarget.ShowKeyboard]);
				mImportKB[mFocusTarget.ShowKeyboard].visible = true;
				
				o = mFocusTarget.fBorder().localToGlobal(0,0);
				o = stage.globalToLocal(o.x, o.y);
				
				// mImportKB[mFocusTarget.ShowKeyboard].x = o.x;
				// mImportKB[mFocusTarget.ShowKeyboard].y = o.y + mFocusTarget.lineHeight;
				nLines = mFocusTarget.getMetrics().lines.length;
				
				/*if ((o.y + (mFocusTarget.lineHeight * nLines) + mImportKB[mFocusTarget.ShowKeyboard].nominalBounds.height) > (stage.canvas.height / stage.scaleY))
				{
					mImportKB[mFocusTarget.ShowKeyboard].x = o.x;
					mImportKB[mFocusTarget.ShowKeyboard].y = o.y - mImportKB[mFocusTarget.ShowKeyboard].nominalBounds.height;
				}
				else
				{
					mImportKB[mFocusTarget.ShowKeyboard].x = o.x;
					mImportKB[mFocusTarget.ShowKeyboard].y = o.y + (mFocusTarget.lineHeight * nLines);
				}*/
				
				if ((o.x + mImportKB[mFocusTarget.ShowKeyboard].nominalBounds.width) > (stage.canvas.width / stage.scaleX))
					mImportKB[mFocusTarget.ShowKeyboard].x = o.x - ((o.x + mImportKB[mFocusTarget.ShowKeyboard].nominalBounds.width) - (stage.canvas.width / stage.scaleX));
				else
					mImportKB[mFocusTarget.ShowKeyboard].x = o.x;
				
				if ((o.y + (mFocusTarget.lineHeight * nLines) + mImportKB[mFocusTarget.ShowKeyboard].nominalBounds.height) > (stage.canvas.height / stage.scaleY))
					mImportKB[mFocusTarget.ShowKeyboard].y = o.y - mImportKB[mFocusTarget.ShowKeyboard].nominalBounds.height;
				else
					mImportKB[mFocusTarget.ShowKeyboard].y = o.y + (mFocusTarget.lineHeight * nLines);
			}
		}
	}
}

//-------------------------------------------------------------------------------------------------
//	use for checking if Sound id exist
//-------------------------------------------------------------------------------------------------
SYS.fGetSymbol = function(
	vId		//String
)
{
	var i;
	
	for(i = 0 ; i < mSoundList.length ; i++)
	{
		if(mSoundList[i].id == vId)
			return mSoundList[i].src;		
	}	
	return null;
}

//-------------------------------------------------------------------------------------------------
//	Private SYS function
//-------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------
//	move content back to 0,0 of browser
//-------------------------------------------------------------------------------------------------
function 
fBackToTop(
)
{
	window.scrollTo(0, 0);
}

//-------------------------------------------------------------------------------------------------
//	resize of content to fit browser keeping ratio according to setting
//-------------------------------------------------------------------------------------------------
function 
fResize(
)
{	
	var vReCheckIsReallyMobile;
	var vStageWidth, vStageHeight;
	
	//mobile device to do resizing only at orientation change
	vReCheckIsReallyMobile = fmobileAndTabletcheck();
	if(vReCheckIsReallyMobile == true)	
		if(vMobileOrientation != undefined)		
			//if(vMobileOrientation == window.orientation)
				//return;
			//else
				vMobileOrientation = window.orientation;
	
	fBackToTop();
	
	var o, p;	
	
	//additional method to enable host to defined width/height for content to resize
	//including <object>, <iframe>, or <embed>.
	if (window.frameElement && window.frameElement.hasAttribute
		&& window.frameElement.hasAttribute('data-width')
		&& window.frameElement.hasAttribute('data-height'))
	{
		vStageWidth = parseInt(window.frameElement.getAttribute('data-width'));
		vStageHeight = parseInt(window.frameElement.getAttribute('data-height'));
	}
	else //no Attribute from frameElement
	{			
		if(vReCheckIsReallyMobile == true)
		{
			vStageWidth = document.documentElement.clientWidth;
			vStageHeight = document.documentElement.clientHeight;
		}
		else
		{
			vStageWidth = window.innerWidth;
			vStageHeight = window.innerHeight;
		}		
	}
		
	o = vStageWidth/(mStageSize.x * PIXEL_RATIO);
	p = vStageHeight/(mStageSize.y * PIXEL_RATIO);
	
	if(p < o)
		o = p;

	stage.canvas.width = ((mStageSize.x * PIXEL_RATIO) * o);
	stage.canvas.height = ((mStageSize.y * PIXEL_RATIO) * o);
	
	stage.canvas.style.width = (vStageWidth * PIXEL_RATIO);	
	stage.canvas.style.height = (vStageHeight * PIXEL_RATIO);	
	
	stage.scaleX = stage.scaleY = o * PIXEL_RATIO;
	
	mDefinition.OffSetX = ((vStageWidth / 2) - (stage.canvas.width / 2));
	
	canvas.style.left =  mDefinition.OffSetX + "px";
	canvas.style.position = "absolute";
	
	if(mLoadingScreen != null)	
	{		
		o = parseInt(stage.canvas.width) / parseInt(mLoadingScreen.style.width);

		mLoadingScreen.style.zoom = o;		
		mLoadingScreen.style.left = (((vStageWidth / 2) - (stage.canvas.width / 2)) / o) + "px";
		
		mLoadingScreen.style.position = "absolute";		
	}	
	
	SYS.fDispatch(null, Signal_Resize, null);
}

//-------------------------------------------------------------------------------------------------
//Event handler
//-------------------------------------------------------------------------------------------------
//Touch function
function
fWindowTouchMove(
	event
)
{
	event.preventDefault();
	fSignalHandling("mousemove", event.changedTouches[0]);
}

function
fWindowTouchDown(
	event
)
{
	event.preventDefault();
	fSignalHandling("mousedown", event.changedTouches[0]);
}

function
fTouchClick(
	event
)
{
	event.preventDefault();
	fSignalHandling("touchclick", event.changedTouches[0]);
}

//Mouse function
function 
fWindowMouseMove(
	event
)
{
	event.preventDefault();
	fSignalHandling("mousemove", event);
}

function 
fWindowClick(
	event
)
{
	event.preventDefault();
	fSignalHandling("click", event);
}

function
fWindowDbClick(
	event
)
{
	event.preventDefault();
	fSignalHandling("dbclick", event);
}

function 
fWindowMouseDown(
	event
)
{
	event.preventDefault();
	fSignalHandling("mousedown", event);
}

function 
fSignalHandling(
	vEvent,
	event
)
{
	var vTarget;
	var vNewPoint;			
	
	// convert the page to stage, stage local to global.
	
	//added a offset to X due to aligning of canvas to center of browser
	vNewPoint = new createjs.Point(event.pageX - mDefinition.OffSetX , event.pageY);	
	
	if ((mMousePos.x == vNewPoint.x) && (mMousePos.y == vNewPoint.y))
	{
		if(vEvent == "mousemove")
			return;
	}
	else
		mMousePos = vNewPoint;
	
	vTarget = fGetTopMostNamedItem(stage); 	
	
	switch(vEvent)
	{
		case "mousemove":	
			if(mDownTarget != null)
				fPressMove();
			else
				fMouseMove();
			
			//Handle Mouse over/out by deteching what's under				
			if(mMouseTarget != vTarget)
			{
				if(mMouseTarget)
					fRollOut();			
								
				mMouseTarget = vTarget;	
				
				if ((mDownTarget == mMouseTarget) || (mDownTarget == null))
					fRollOver();				
			}	
			break;
		
		case "click":
		case "touchclick":
			if(mDownTarget == mMouseTarget)
			{
				fMouseUp();	
				mDownTarget = null;
				fClick();
					
				/*if(!mIsMobilePlatform)				
					fRollOver();				
				else
					fRollOut();*/

				vEvent == "click" ? fRollOver() : fRollOut();	
			}
			else
			{
				fMouseUp();	
				mDownTarget = null;
			}
			break;
			
		case "dbclick":
			fDbClick();
			break;
			
		case "mousedown":			
			mDownTarget = vTarget;
			mMouseTarget = vTarget;
			fMouseDown();
			break;
	}
}

//-------------------------------------------------------------------------------------------------
//	Mouse event RollOver
//-------------------------------------------------------------------------------------------------
function 
fRollOver(
) 
{
	try {	
		mMouseTarget.fRender("rollover");
	}
    catch(err) {}

	SYS.fDispatch(mMouseTarget, Signal_MouseOver);
}

//-------------------------------------------------------------------------------------------------
//	Mouse event RollOut
//-------------------------------------------------------------------------------------------------
function 
fRollOut(
) 
{
	try {
		mMouseTarget.fRender("rollout");	
	}
    catch(err) {}
	
	SYS.fDispatch(mMouseTarget, Signal_MouseOut);
}

//-------------------------------------------------------------------------------------------------
//	Mouse event MouseDown
//-------------------------------------------------------------------------------------------------
function 
fMouseDown(
)
{ 	
	if(mMouseTarget)
		if(mMouseTarget.name != undefined)
			if(mMouseTarget.name == "DummyText")			
				mTempFocusTarget = mMouseTarget.RealText;		
	
	try {
		mMouseTarget.fRender("mousedown");
	}
    catch(err) {}

	SYS.fDispatch(mMouseTarget, Signal_MouseDown);
}

//-------------------------------------------------------------------------------------------------
//	Mouse event MouseUp
//-------------------------------------------------------------------------------------------------
function 
fMouseUp(
) 
{ 

	if(mTempFocusTarget)	
		if((mTempFocusTarget).Focus != undefined)	
		{
			(mTempFocusTarget).Focus(false);
			mTempFocusTarget = null;
			
			for (var key in mImportKB)			
				if(key != "Canvas")	
					mImportKB[key].visible = false;
		}
		
	try {
		mMouseTarget.fRender("mouseup");
	}
    catch(err) {}

	SYS.fDispatch(mMouseTarget, Signal_MouseUp);
} 

//-------------------------------------------------------------------------------------------------
//	Mouse event Click
//-------------------------------------------------------------------------------------------------
function 
fClick(
) 
{ 
	var o;
	var nLines;
	var vTarget;
	
	if(mMouseTarget == null)
	{
		fRemoveFocusObj();
		return;
	}
	
	vTarget = mMouseTarget;	
	
	if (vTarget.Selected != undefined)
		vTarget.fSelect(!vTarget.Selected);
		
	try {
		vTarget.fRender("click");
	}
    catch(err) {}
	
	if(vTarget.IsKeyBoardBtn != undefined)
	{
		mImportKB[mFocusTarget.ShowKeyboard].fKeyClick(vTarget); //added to cater devices with both touch and physical inputs
		SYS.fDispatch(vTarget, Signal_Click);
		return;
	}
	
	fRemoveFocusObj();
	if(vTarget.name == "DummyText")
	{		
		mFocusTarget = vTarget.RealText;

		mFocusTarget.Focus(true);		

		if ((mUsePlatformKeyboard) && (mFocusTarget.ShowKeyboard == "qwerty"))
		{			
			o = vTarget.getBounds();
			p = vTarget.localToGlobal(0,0);
			
			mDeviceNativeInput.style.left = p.x + "px";
			mDeviceNativeInput.style.top = p.y + "px";
			mDeviceNativeInput.style.left = (vTarget.getBounds().width * 0.65) + "px";
			mDeviceNativeInput.setAttribute('maxlength', String(mFocusTarget.MaxChar));
			mDeviceNativeInput.style.visibility = "visible";
			mDeviceNativeInput.focus();
			if(mFocusTarget.Language == "English")
				mDeviceNativeInput.style.visibility = "hidden";					
		}
		else if ((mFocusTarget.IsInput))
		{			
			stage.addChild(mImportKB[mFocusTarget.ShowKeyboard]);
			mImportKB[mFocusTarget.ShowKeyboard].visible = true;
			
			o = mFocusTarget.fBorder().localToGlobal(0,0);
			o = stage.globalToLocal(o.x, o.y);
			
			// mImportKB[mFocusTarget.ShowKeyboard].x = o.x;
			// mImportKB[mFocusTarget.ShowKeyboard].y = o.y + mFocusTarget.lineHeight;
			nLines = mFocusTarget.getMetrics().lines.length;
			
			if ((o.x + mImportKB[mFocusTarget.ShowKeyboard].nominalBounds.width) > (stage.canvas.width / stage.scaleX))
				mImportKB[mFocusTarget.ShowKeyboard].x = o.x - ((o.x + mImportKB[mFocusTarget.ShowKeyboard].nominalBounds.width) - (stage.canvas.width / stage.scaleX));
			else
				mImportKB[mFocusTarget.ShowKeyboard].x = o.x;
			
			if ((o.y + (mFocusTarget.lineHeight * nLines) + mImportKB[mFocusTarget.ShowKeyboard].nominalBounds.height) > (stage.canvas.height / stage.scaleY))
				mImportKB[mFocusTarget.ShowKeyboard].y = o.y - mImportKB[mFocusTarget.ShowKeyboard].nominalBounds.height;
			else
				mImportKB[mFocusTarget.ShowKeyboard].y = o.y + (mFocusTarget.lineHeight * nLines);
		}			
		vTarget = vTarget.RealText;	
	}		
	else if(vTarget.fKeyed != undefined) //clicked on real text
	{
		mFocusTarget = vTarget;
		mFocusTarget.Focus(true);
			
		if ((mFocusTarget.IsInput))
		{			
			stage.addChild(mImportKB[mFocusTarget.ShowKeyboard]);
			mImportKB[mFocusTarget.ShowKeyboard].visible = true;
			
			o = mFocusTarget.fBorder().localToGlobal(0,0);
			o = stage.globalToLocal(o.x, o.y);
			
			// mImportKB[mFocusTarget.ShowKeyboard].x = o.x;
			// mImportKB[mFocusTarget.ShowKeyboard].y = o.y + mFocusTarget.lineHeight;
			nLines = mFocusTarget.getMetrics().lines.length;
			
			if ((o.y + (mFocusTarget.lineHeight * nLines) + mImportKB[mFocusTarget.ShowKeyboard].nominalBounds.height) > (stage.canvas.height / stage.scaleY))
			{
				mImportKB[mFocusTarget.ShowKeyboard].x = o.x;
				mImportKB[mFocusTarget.ShowKeyboard].y = o.y - mImportKB[mFocusTarget.ShowKeyboard].nominalBounds.height;
			}
			else
			{
				mImportKB[mFocusTarget.ShowKeyboard].x = o.x;
				mImportKB[mFocusTarget.ShowKeyboard].y = o.y + (mFocusTarget.lineHeight * nLines);
			}
		}	
	}
	else	
		mFocusTarget = vTarget;		
	
	SYS.fDispatch(vTarget, Signal_Click);
} 

//-------------------------------------------------------------------------------------------------
//	Mouse event Click
//-------------------------------------------------------------------------------------------------
function 
fDbClick(
) 
{ 
	var o;
	var nLines;
	var vTarget;
	
	if(mMouseTarget == null)
	{
		fRemoveFocusObj();
		return;
	}
	
	vTarget = mMouseTarget;						
	
	fRemoveFocusObj();
	if(vTarget.name == "DummyText")
	{
		try {
			mMouseTarget.fRender("dbclick");	
		}
		catch(err) {}
		
		mFocusTarget = vTarget.RealText;
		mFocusTarget.Highlight(true);	
		
		if ((mUsePlatformKeyboard) && (mFocusTarget.ShowKeyboard == "qwerty"))
		{			
			o = vTarget.getBounds();
			p = vTarget.localToGlobal(0,0);
			
			mDeviceNativeInput.style.left = p.x + "px";
			mDeviceNativeInput.style.top = p.y + "px";
			mDeviceNativeInput.style.left = (vTarget.getBounds().width * 0.65) + "px";
			mDeviceNativeInput.setAttribute('maxlength', String(mFocusTarget.MaxChar));
			mDeviceNativeInput.style.visibility = "visible";
			mDeviceNativeInput.focus();
			if(mFocusTarget.Language == "English")
				mDeviceNativeInput.style.visibility = "hidden";					
		}
		else if ((mFocusTarget.IsInput))
		{			
			stage.addChild(mImportKB[mFocusTarget.ShowKeyboard]);
			mImportKB[mFocusTarget.ShowKeyboard].visible = true;
			
			o = mFocusTarget.fBorder().localToGlobal(0,0);
			o = stage.globalToLocal(o.x, o.y);
			
			// mImportKB[mFocusTarget.ShowKeyboard].x = o.x;
			// mImportKB[mFocusTarget.ShowKeyboard].y = o.y + mFocusTarget.lineHeight;
			nLines = mFocusTarget.getMetrics().lines.length;
			
			if ((o.x + mImportKB[mFocusTarget.ShowKeyboard].nominalBounds.width) > (stage.canvas.width / stage.scaleX))
				mImportKB[mFocusTarget.ShowKeyboard].x = o.x - ((o.x + mImportKB[mFocusTarget.ShowKeyboard].nominalBounds.width) - (stage.canvas.width / stage.scaleX));
			else
				mImportKB[mFocusTarget.ShowKeyboard].x = o.x;
			
			if ((o.y + (mFocusTarget.lineHeight * nLines) + mImportKB[mFocusTarget.ShowKeyboard].nominalBounds.height) > (stage.canvas.height / stage.scaleY))
				mImportKB[mFocusTarget.ShowKeyboard].y = o.y - mImportKB[mFocusTarget.ShowKeyboard].nominalBounds.height;
			else
				mImportKB[mFocusTarget.ShowKeyboard].y = o.y + (mFocusTarget.lineHeight * nLines);
		}			
		vTarget = vTarget.RealText;	
		
		//SYS.fDispatch(vTarget, Signal_DbClick);
	}		
	
}

//-------------------------------------------------------------------------------------------------
//	Mouse event MouseMove
//-------------------------------------------------------------------------------------------------
function 
fMouseMove(
) 
{	
	SYS.fDispatch(null, Signal_MouseMove);
}

//-------------------------------------------------------------------------------------------------
//	Mouse event PressMove
//-------------------------------------------------------------------------------------------------
function 
fPressMove(
) 
{ 
	try {
		mDownTarget.fRender("scrollmove");	
	}
    catch(err) {}

	SYS.fDispatch(mDownTarget, Signal_Drag);
}

//-------------------------------------------------------------------------------------------------
//	Mouse event key pressed
//-------------------------------------------------------------------------------------------------
SYS.keyPressed = function (
	event
)
{ 
	if ((mFocusTarget != null) && (mFocusTarget instanceof createjs.Text))	
	{		

		if(mFocusTarget.fKeyed != undefined)
			mFocusTarget.fKeyed(event);	
						
		fDbg("event.keyCode > " + event.keyCode);	
			
		//returns key code to receiver, goto to self convert to char, String.fromCharCode(keycode)
 		//	retaining as keyCode allows receiver to check input range allowance.
		SYS.fDispatch(mFocusTarget, Signal_Change, event.keyCode);	
	}	
}

//-------------------------------------------------------------------------------------------------
//	setup keyboard
//-------------------------------------------------------------------------------------------------
function 
fSetUpKeyboard(
)
{	
	mImportKB.Canvas = new Asset.Keyboard_Canvas();
	mImportKB.Canvas.name = "KeyboardLib";

	for (var key in mImportKB.Canvas)
	{
		if(fPrefix(key) == "mcKeyboard")
		{
			SYS.fCreate(mImportKB.Canvas[key]);
			cBase(mImportKB.Canvas[key], key);
			cKeyboard(mImportKB.Canvas[key])
			mImportKB[fSuffix(key)] = mImportKB.Canvas[key];
			mImportKB[fSuffix(key)].visible = false;
		}			
	}	
}

//-------------------------------------------------------------------------------------------------
//	setup keyboard
//-------------------------------------------------------------------------------------------------
function 
fAddPrivateKeyboard(
	vKeyBoard
)
{	
	mImportKB[vKeyBoard.name] = vKeyBoard;
	mImportKB[vKeyBoard.name].visible = false;			
}

//-------------------------------------------------------------------------------------------------
// remove focus object
//-------------------------------------------------------------------------------------------------
function 
fRemoveFocusObj(
) 
{	
	fDbg("fRemoveFocusObj -------- " + mFocusTarget);
	
	if(mFocusTarget)
	{
		if(mFocusTarget.Focus != undefined)
		{
			mFocusTarget.Focus(false);
			
			for (var key in mImportKB)			
				if(key != "Canvas")	
					mImportKB[key].visible = false;							
		}
	}
	if (mUsePlatformKeyboard)
	{		
		if(mDeviceNativeInput.style.visibility == "visible")
		{
			if(mFocusTarget)
				if(mFocusTarget.Focus != undefined)	
				{
					mFocusTarget.text = mDeviceNativeInput.value;
					mDeviceNativeInput.value = "";
				}
		}
		mDeviceNativeInput.style.visibility = "visible";		
		mDeviceNativeInput.blur();	
		mDeviceNativeInput.style.visibility = "hidden";
	}	
}

//-------------------------------------------------------------------------------------------------
//	get all child
//	
//	using key rather than numChild due to some object are added as tween and not 
//	listed as child type of numchild, if use numchild is unable to get those tween childs
//-------------------------------------------------------------------------------------------------
function 
fTweenChild(
	vTarget
) 
{
	var i = 0;
	for (var key in vTarget)
		i++;
		
	return i;
}

//-------------------------------------------------------------------------------------------------
// check for environment
//-------------------------------------------------------------------------------------------------
function 
fmobileAndTabletcheck(
) 
{
  var check = false;
  (function(a){
	  if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true
	  })
	  (navigator.userAgent||navigator.vendor||window.opera);
  return check;
}

//-------------------------------------------------------------------------------------------------
//	get top most display object with name
//
//	remove all eventlistener from all Object, instead, listener is at window's level
//	base on Mouse position, use this function to get top most display object with name
//	pierce shapes and non-instance name objects. returns null if no object at position
//-------------------------------------------------------------------------------------------------
function
fGetTopMostNamedItem(
	vTarget,
	vTrackBack
)
{
	var i, j, k;
	var o, p, q;
	var vNextTarget;
	var vLayerList;
	
	o = fGetObjectsUnderPoint(vTarget);
	
	if ((vTarget.name != null) && (vTarget.name != "xText") && (vTarget.mouseEnabled)) //ignore xText	
	{
		if (vTarget.mouseChildren == undefined)	
			return vTarget;		
		else if ((vTarget.mouseChildren != undefined) && (vTarget.mouseChildren == true))
			vTrackBack = vTarget;		
		else if ((vTarget.mouseChildren != undefined) && (vTarget.mouseChildren == false))
			return vTarget;			
	}
	else if(!vTarget.mouseEnabled)
		return vTrackBack;	

	for(i = 0 ; i < o.length ; i++)
	{
		vLayerList = [];
		p = o[i];
		
		while(p != vTarget)	
		{
			vLayerList.push(p);
			p = p.parent;
		}		
		vLayerList.reverse();
		
		if ((vTarget.mouseChildren != undefined) && (vTarget.mouseChildren == true) && (vTarget.mouseEnabled))
		{	
			for(j = 0 ; j < vLayerList.length ; j++)
			{				
				vNextTarget = fGetTopMostNamedItem(vLayerList[j], vTrackBack);	

				if(vNextTarget != null)
					return vNextTarget;	
					
				if ((vNextTarget == undefined) && (vTarget == stage))
					return vTarget;
			}		
		}
	}	
	
	if (vTarget.name != null)
		return vTarget;
	
	return null;		
}

//-------------------------------------------------------------------------------------------------
//	Get the object under Point of target
//-------------------------------------------------------------------------------------------------
function
fGetObjectsUnderPoint(
	vTarget
)
{
	var o, p;

	p = vTarget.globalToLocal(mMousePos.x, mMousePos.y);	
	try
	{
		o = vTarget.getObjectsUnderPoint(p.x, p.y, 0);
		return o;
	}
	catch(err) 
	{
		return [];
	}
}

//-------------------------------------------------------------------------------------------------
//	Loading of script from url
//-------------------------------------------------------------------------------------------------
function 
cScriptLoading(
	vSrc
) 
{
	manifest =	[{
					src: vSrc
				}];
										
	startPreload(manifest);		
	
	function
	startPreload(
		vManifest
	) 
	{
		preloadScript = new createjs.LoadQueue(false);
		preloadScript.installPlugin(createjs.Sound);          
		preloadScript.on("complete", Script_loadComplete);
		preloadScript.loadManifest(vManifest); 
	};	
		
	function
	Script_loadComplete(
		event
	)
	{
		mDefinition.Loaded++;
		
		if(mDefinition.Loaded >= mDefinition.ToLoad)
			MAIN.fModule();			
	};
}

//-------------------------------------------------------------------------------------------------
//	For fStartPlayer handling, change the signal to send to when movieclip is done playing.
//	also to do loop if count needed
//-------------------------------------------------------------------------------------------------
function
fPlayerSignalChanger(	
	vTarget,
	vSignal, 
	vData
)
{
	var i;
	var o;
	
	o = [vTarget, vSignal, vData];
	
	for(i = 0 ; i < mPlayerTracker.length ; i++)
	{
		if(mPlayerTracker[i].vMovieClip == vTarget)
		{
			o[0] = mPlayerTracker[i].vTarget;
			
			if(vSignal == Signal_Progress)
			{
				o[1] = mPlayerTracker[i].vProgressSignal;
			}
			else if(vSignal == Signal_Added)
			{
				//added is case where it's using fStartPlayer to end the movieclip
				if(mPlayerTracker[i].vEnd == "FrameChangeOnlyFromPlayer")
				{
					o[1] = mPlayerTracker[i].vCompleteSignal;	
					mPlayerTracker.splice(i, 1);				
					return o;
				}
				else
					return null;
			}
			else
			{
				if ((mPlayerTracker[i].vCount == "loop") || (mPlayerTracker[i].vCount > 0))
				{
					if(mPlayerTracker[i].vCount != "loop")
						mPlayerTracker[i].vCount = mPlayerTracker[i].vCount - 1;
					
					o[1] = null;					
					mPlayerTracker[i].vMovieClip.fPlay(mPlayerTracker[i].vBegin, mPlayerTracker[i].vEnd);
				}
				else
				{
					o[1] = mPlayerTracker[i].vCompleteSignal;	
					mPlayerTracker.splice(i, 1);
				}
			}					
			o[2] = vTarget;			
			return o;
		}
	}	
	return null;
}

//-------------------------------------------------------------------------------------------------
//	Event listener for fStartSound complete
//-------------------------------------------------------------------------------------------------
function
fSoundTrackerHandle(	
	event
)
{
	var i, j, k;
	var o, p, q;
	var key;

	for(i = 0 ; i < mSoundTracker.length ; i++)
	{
		if(mSoundTracker[i].instances == event.target)
		{
			//audio all done
			if(mSoundTracker[i].vQue == (mSoundTracker[i].vUrl.length - 1))
			{
				//check if do another count on it
				if(mSoundTracker[i].vCount > 0)
				{
					mSoundTracker[i].vCount = mSoundTracker[i].vCount - 1;
					
					//remove previous instance
					mSoundTracker[i].instances.removeEventListener("complete", fSoundTrackerHandle);
					
					//There's que, reset to first in que
					if(mSoundTracker[i].vUrl.length > 1)
						mSoundTracker[i].vQue = 0;						
					
					mSoundTracker[i].instances = playSound(mSoundTracker[i].vUrl[mSoundTracker[i].vQue]);							
					mSoundTracker[i].instances.addEventListener("complete", fSoundTrackerHandle);
				}
				else
				{
					//count done, end the audio
					mSoundTracker[i].instances.removeEventListener("complete", fSoundTrackerHandle);
					//remove audio task from tracker
					o = mSoundTracker.splice(i, 1);					
					SYS.fDispatch(o[0].vTarget, o[0].vSignal, null);					
					break;
				}
			}
			else
			{
				//que item not done yet
				mSoundTracker[i].vQue = mSoundTracker[i].vQue + 1;
				
				//remove previous instance
				mSoundTracker[i].instances.removeEventListener("complete", fSoundTrackerHandle);
				
				mSoundTracker[i].instances = playSound(mSoundTracker[i].vUrl[mSoundTracker[i].vQue]);							
				mSoundTracker[i].instances.addEventListener("complete", fSoundTrackerHandle);
			}
			break;
		}		
	}
}

//-------------------------------------------------------------------------------------------------
//	Timer delay handler
//-------------------------------------------------------------------------------------------------
function
fTimerHandler(
	vArrayID
)
{
	var i, j, k;
	var o, p, q;
	var vTimeTarget;
	
	for(i = 0 ; i < mTimerTracker.length ; i++)
		if(mTimerTracker[i].vId == vArrayID)
		{
			vTimeTarget = i;
			break;
		}
	
	//kill off first timer that has delay included
	clearTimeout(mTimerTracker[vTimeTarget].TimerID);
	
	//clear timer and change to interval
	if((mTimerTracker[vTimeTarget].vCount <= 0) && (mTimerTracker[vTimeTarget].vCount != "loop"))
	{
		o = mTimerTracker.splice(vTimeTarget, 1);		
		SYS.fDispatch(o[0].vTarget, o[0].vSignal);		
	}
	else
	{
		SYS.fDispatch(mTimerTracker[vTimeTarget].vTarget, mTimerTracker[vTimeTarget].vSignal);
		
		if (mTimerTracker[vTimeTarget] != null)
		{
			clearTimeout(mTimerTracker[vTimeTarget].TimerID);
			
			if(mTimerTracker[vTimeTarget].vCount != "loop")
				mTimerTracker[vTimeTarget].vCount = mTimerTracker[vTimeTarget].vCount - 1;
			
			mTimerTracker[vTimeTarget].TimerID = setInterval(fTimerSignalHandler, mTimerTracker[vTimeTarget].vDuration, vArrayID);
		}
	}		
}

//-------------------------------------------------------------------------------------------------
//	Timer signal handler
//-------------------------------------------------------------------------------------------------
function
fTimerSignalHandler
(
	vArrayID
)
{
	var i, j, k;
	var o, p, q;
	
	var vTimeTarget;
	
	for(i = 0 ; i < mTimerTracker.length ; i++)
		if(mTimerTracker[i].vId == vArrayID)
		{
			vTimeTarget = i;
			break;
		}
	
	//---------edited 20180420, some how mTimerTracker[vTimeTarget] was affected by dispatch
	//---------store original mTimerTracker into Array causing a copy than replay it back
	o = [];
	o.push(mTimerTracker);	
	p = [];
	p.push(mTimerTracker[vTimeTarget]);
	
	SYS.fDispatch(o[0][vTimeTarget].vTarget, o[0][vTimeTarget].vSignal);

	mTimerTracker = o[0];
	mTimerTracker[vTimeTarget] = p[0];
	//-------------------------------------------------------------------------------------
		
	if (mTimerTracker[vTimeTarget] != null)
	{
		if(mTimerTracker[vTimeTarget].vCount != "loop")
		{
			if(mTimerTracker[vTimeTarget].vCount <= 0)		
			{
				clearInterval(mTimerTracker[vTimeTarget].TimerID);	
				mTimerTracker.splice(vTimeTarget, 1);
			}
			else
				mTimerTracker[vTimeTarget].vCount = mTimerTracker[vTimeTarget].vCount - 1;
		}
	}
}

//-------------------------------------------------------------------------------------------------
//	CreateSoundInstance
//  create the sound instance here, after module/Loader preloadManifest else no duration
//	mSoundInstanceTackerN used to prevent looping those already done
//-------------------------------------------------------------------------------------------------
function
fCreateSoundInstance(	
)
{
	for(i = mSoundInstanceTackerN; i < mSoundList.length ; i++)
		mSoundList[i].instance = createjs.Sound.createInstance(mSoundList[i].id)
	
	mSoundInstanceTackerN = mSoundList.length;
}


//-------------------------------------------------------------------------------------------------
//	delay to wait for src load finish
//-------------------------------------------------------------------------------------------------
function
fRunQue(	
)
{
	if(mCurrentLoad != null)
		return;
		
	if(mQueWorker.length > 0)
	{
		mCurrentLoad = mQueWorker[0];		
		SYS.getScript(mCurrentLoad.Url);
		mQueWorker.shift();
		//window.setTimeout(fWaitSrc, 100);		
	}
	else
		SYS.fEndLoadingUI();
}

//-------------------------------------------------------------------------------------------------
//	delay to wait for src load finish
//-------------------------------------------------------------------------------------------------
function
fWaitSrc(	
e
)
{	
	if(mCurrentLoad.Method == "Loader")
	{
		//use small loading and update of url
		SYS.fStartLoadingUI("small", mCurrentLoad.Id);					
		cLoader(mCurrentLoad.Caller, mCurrentLoad.DispatchSignal, mCurrentLoad.Url, mCurrentLoad.Id);
	}
	else				
	{
		SYS.fStartLoadingUI();	
		cModule(mCurrentLoad.Url, mCurrentLoad.Id, mCurrentLoad.Class);
	}
}

//----------------------------------------------------------------------------------------------------
return SYS;
})();














//-------------------------------------------------------------------------------------------------
//	public function
//-------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------
// createjs play audio function
// return mCurrentAudio so that can be kept track else all audio gets override by latest
//		*store the return mCurrentAudio to manipulate the audio played on your own
// example a self defined audio to play is override by the canvas audio, both audio will
// play together but when calling end() only the last audio will stop.
//-------------------------------------------------------------------------------------------------
function 
playSound(
	id, 
	loop
) 
{	
	mCurrentAudio = createjs.Sound.play(id, createjs.Sound.INTERRUPT_EARLY, 0, 0, loop);
	mCurrentAudio.id = id;
	return mCurrentAudio;
}

//-------------------------------------------------------------------------------------------------
// console debug
//-------------------------------------------------------------------------------------------------
function 
fDbg(
	v
)
{
	console.log(v);
};

//-------------------------------------------------------------------------------------------------
// return the prefix of string
//-------------------------------------------------------------------------------------------------
function 
fPrefix(
	v
)
{
	var idx = v.indexOf("_");
	return ((idx != -1) ? v.substr(0, idx) : v);
};

//-------------------------------------------------------------------------------------------------
// return the suffix of string
//-------------------------------------------------------------------------------------------------
function 
fSuffix(
	v
)
{
	var idx = v.indexOf("_");
	return v.substring(idx + 1);
};

