//----------------------------------------------------------------------------------------------------
//	Gobal var
//----------------------------------------------------------------------------------------------------


//----------------------------------------------------------------------------------------------------
//	class name.
//----------------------------------------------------------------------------------------------------
window.Engine = (function() {

//----------------------------------------------------------------------------------------------------
//	namespace.
//----------------------------------------------------------------------------------------------------
function Engine() {}	
	
//*Do not remove
var mExtendedClass = null;
var mExtendClass = null;
//*Write your class name here,	and use mSignalDivert for target such as dispatch/player/..
var mSignalDivert = Engine;		//this will Change if it's extend by another class
var mThisClass = Engine;		//fix class, wont change, for extend use

//*Note special private var key, can inherit from extend but not shared,
//	special var not just inherit var only, it can be used to inherit functions too.
//	example ClassB special var has a function, Engine will be able to use that function 
//		without re-writting it, just by calling mThisVar.(function name)
var mThisVar = {};
var mGrouping = {};
var xKeyID = ["Hundredths", "Tenths", "Ones", "Tens"];

//----------------------------------------------------------------------------------------------------
//	Start of class - involve by module or extend
//----------------------------------------------------------------------------------------------------
Engine.fModuleLoaded = function(
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

	//Start doing class stuff, *calling a function here just to separate
	cEngine();
}

function
cEngine(
) 
{
	
}

//------------------------------------------------------------------------------------------------- 
//handle signal. //todo. return true to bubble signal to parent, false (default) to stop.
//-------------------------------------------------------------------------------------------------
Engine.fStart = function()
{
	fInitActivity();
}

//------------------------------------------------------------------------------------------------- 
// Called by UI.js
//-------------------------------------------------------------------------------------------------
function
fInitActivity()
{
	var i;
	
	fDbg("fInitActivity");	
	
	mScene["Grouping"].mcClone.visible = false;

	mGrouping.mNewCubeList = [];
	mGrouping.mSelectedCubeList = [];
	mGrouping.mMaxCubeList = [];
	mGrouping.mStatusList = [];
	mGrouping.vList = [];

	for(i = 0 ; i< mScene["Grouping"].numChildren; i++)
	{
		if(mScene["Grouping"].getChildAt(i).prefix == "mcPanel")
			mGrouping.vList.push(mScene["Grouping"].getChildAt(i));
		else if(mScene["Grouping"].getChildAt(i).prefix == "tfNum" || mScene["Grouping"].getChildAt(i).prefix == "tfSelect")
		{
			//ignore display answer's textfield
			if(mScene["Grouping"].getChildAt(i).suffix.search("2") == -1)
			{
				mScene["Grouping"].getChildAt(i).SetInputRange(["num"]);
				mScene["Grouping"].getChildAt(i).ShowKeyboard = "num";
				mScene["Grouping"].getChildAt(i).text = "000"; //just increasing the box size
				mScene["Grouping"].getChildAt(i).BGcolor = "rgba(0, 0, 0, 0.1)";	
				mScene["Grouping"].getChildAt(i).SetInput(true);				
				mScene["Grouping"].getChildAt(i).MaxChar = 1;
				mScene["Grouping"].getChildAt(i).text = "";
			}
		}
	}
		
	for (i = 0; i < mGrouping.vList.length; i++)
	{
		mGrouping.mNewCubeList[mGrouping.vList[i].suffix] = [];
		mGrouping.mSelectedCubeList[mGrouping.vList[i].suffix] = [];
		mGrouping.mMaxCubeList[mGrouping.vList[i].suffix] = 9;
		mGrouping.mStatusList[mGrouping.vList[i].suffix] = {vCalculated: false, vGrouped: false};
	}
	mGrouping.mStatusList[fGetNewKey(fGetInitKey(), "Break")] = {vCalculated: true, vGrouped: true};
	
	mGrouping.mIsChipVersion = false;
	fReset();
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
Engine.fExtend = function(
	vParentClass,
	vId
)
{
	//*Rename this if you Change the "special private var key"
	mThisVar.id = vId;
	mExtendClass = vParentClass;	
	mSignalDivert = vParentClass;

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
	if((vData == null) || (vData == undefined))
		return mLastpState;
	
	if(mExtendClass != null)
		mExtendClass.pForwardState(vData);
	else	
		mThisClass.pState(vData);	
}

//------------------------------------------------------------------------------------------------- 
//*DO NOT REMOVE
//	call from extend class, passing to self pState to handle
//------------------------------------------------------------------------------------------------- 
Engine.pForwardState = function(
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
Engine.pState = function(
	vData
)
{
	fDbg("Engine pState - " + vData);
	
	//*DO NOT REMOVE (for passing to extend class)
	mLastpState = vData;
	
	switch(vData)
	{
		
	}
	
	//*DO NOT REMOVE (for passing to extend class)
	if(mExtendedClass != null)
		mExtendedClass.pState(vData);
}

//------------------------------------------------------------------------------------------------- 
//*DO NOT REMOVE
//handle signal
//-------------------------------------------------------------------------------------------------
Engine.fOnSignal = function(
	vTarget, 				//	original target for signal
	vSignal, 				//	signal received
	vData					//	extra data along with signal
)
{
	fDbg("Engine.fOnSignal = " + vTarget + " , " + vSignal + " , " + vData);
	var i;
	var j;
	var vObj;
	var o;
	var p; 
	var q;
	var vKey;
	
	switch (vSignal)
	{		
		case "Signal_Zoom":
			break;
		
		case "Signal_Reset":
			fReset();
			break;
			
		case Signal_MouseDown:			
			break;
			
		case Signal_MouseUp:			
			break;	
			
		case Signal_MouseMove:
			break;
			
		case Signal_Drag:			
			break;
			
		case Signal_Change:
			i = parseInt(vTarget.text);
			
			switch (vTarget.prefix)
			{
				case "tfNum":
					if(isNaN(i))
						i = 0;
						
					fClearSelection();
					fAddModel(vTarget.suffix, i);
					fUpdateSelectedNum();
					break;
					
				case "tfSelect":	
					break;
			}			
			fValueCompare();	
			break;
			
		case Signal_Click:	
			switch (vTarget.name)
			{				
				case "pbPDF":
					var urlChunks = location.pathname.split('/');
					urlChunks = urlChunks[urlChunks.length - 2];
					window.open(urlChunks + "_WS.pdf");
					break;						
					
				case "pbReset":
					fReset();
					break;					
			}
			
			switch (vTarget.prefix)
			{
				case "hsModel":
					fClearSelection();
					fAddModel(vTarget.suffix, mGrouping.mNewCubeList[vTarget.suffix].length + 1);
					fUpdateSelectedNum();
					break;
				
				case "cbModel":
					vKey = vTarget.suffix;
					
					i = mGrouping.mNewCubeList[vKey].indexOf(vTarget.parent);
		
					if(i== -1)
					{
						vKey = String(vKey).split("1")[0];
						i = mGrouping.mNewCubeList[vKey].indexOf(vTarget.parent);
					}
									
					fSetSelection(vKey, vTarget.Selected ? i : i + 1, 10);
					fUpdateSelectedNum();	
					break;
					
				case "pbAdd":	
					fClearSelection();
					vTarget.fEnable(false);
					fAddGroup(vTarget.suffix);
					break;
				
				case "pbMin":
					if(mGrouping.First)
					{
						mGrouping.First = false;
						fFillRemoveZeros();
					}
					
					vTarget.visible = false;
					mThisVar.Clicked = true;
					mThisVar.Minused = vTarget.suffix;					
	
					o = String(vTarget.suffix).split("1")[0];
					p = parseInt("0" + mScene["Grouping"]["tfSelect_" + o].text);
									
					fShowMinusBeforeDelete(o, p);					
					break;
					
				case "pbBreak":
					if(mGrouping.First)
					{
						mGrouping.First = false;
						fFillRemoveZeros();
					}
					
					mThisVar.Clicked = true;
		
					vTarget.visible = false;
					stage.enableDOMEvents(false);
		
					fClearSelection();			
					vTarget.fEnable(false);			
					fBreakSelection(vTarget.suffix, fGetNewKey(vTarget.suffix, "Break"));
		
					for(i = 0 ; i < xKeyID.length ; i++)
					{
						if(xKeyID[i] == vTarget.suffix)
						{
							o = xKeyID[i - 1];
							break;
						}
					}
					
					//display the bring over value for current and previous, dynamic handling
					mScene["Grouping"]["mcChangeValue_" + vTarget.suffix].visible = true;
					if(String(mScene["Grouping"]["mcChangeValue_" + vTarget.suffix]["tfText_0"].text).length == 0)
					{							
						mScene["Grouping"]["mcChangeValue_" + vTarget.suffix]["tfText_0"].text = mGrouping.mNewCubeList[vTarget.suffix].length;						
					}
					else
					{							
						mScene["Grouping"]["mcChangeValue_" + vTarget.suffix].fStop(2);
						mScene["Grouping"]["mcChangeValue_" + vTarget.suffix]["tfText_1"].text = mGrouping.mNewCubeList[vTarget.suffix].length;
					}
					
					mScene["Grouping"]["mcChangeValue_" + o].visible = true;
					if(String(mScene["Grouping"]["mcChangeValue_" + o]["tfText_0"].text).length == 0)
					{							
						mScene["Grouping"]["mcChangeValue_" + o]["tfText_0"].text = mGrouping.mNewCubeList[o].length;						
					}
					else
					{							
						mScene["Grouping"]["mcChangeValue_" + o].fStop(2);
						mScene["Grouping"]["mcChangeValue_" + o]["tfText_1"].text = mGrouping.mNewCubeList[o].length;
					}
					
					fValueCompare();
					break;
					
				case "pbGroup":
					fClearSelection();
					vTarget.fEnable(false);
					fGroupSelection(vTarget.suffix, fGetNewKey(vTarget.suffix, "Group"));					
					fValueCompare();
					break;
			}
			break;		
	}
	
	//*DO NOT REMOVE (for passing to extend class)
	if(mExtendedClass != null)
	{
		fDbg("mExtendedClass " + vSignal);
		mExtendedClass.fOnSignal(vTarget, vSignal, vData);
	}
	
	return false;
}


//----------------------------------------------- 
// own function
//----------------------------------------------- 
function 
fShowMinusBeforeDelete(
value1,
value2
)
{
	var i , j;
	
	for (i = 0; i < value2; i++)
	{
		j = (mGrouping.mNewCubeList[value1].length - (i + 1));
		if (j != -1)
		{	
			mGrouping.mNewCubeList[value1][j]["cbModel_" + value1].gotoAndStop(1);
		}
	}
	
	mThisVar.PassValue = [value1, value2];
	
	mThisVar.MinusTimeOut = setTimeout(fResumeMinus,1500);
}

function
fResumeMinus(
)
{
	var i , j;
	var o , p;
		
	o = mThisVar.PassValue[0];
	p = mThisVar.PassValue[1];
	
	for (i = 0; i < p; i++)
	{
		j = (mGrouping.mNewCubeList[o].length - 1);
		if (j != -1)
		{	
			mScene["Grouping"].removeChild(mGrouping.mNewCubeList[o][j]);
			mGrouping.mNewCubeList[o].splice(j, 1);
		}
	}

	mGrouping.mSelectedCubeList[o] = [];
	
	for (i = 0; i < mGrouping.mNewCubeList[o].length; i++)
		mGrouping.mNewCubeList[o][i].name = "mcNewModel_" + o + "_" + i;
		
	fRearrangeCube(o, mGrouping.mNewCubeList[o].length);
  
	if (mScene["Grouping"]["pbGroup_" + o] != undefined && mGrouping.mStatusList[o].vCalculated)
		mGrouping.mStatusList[o].vGrouped = (mGrouping.mNewCubeList[o].length < 10);
	
	fUpdateSelectedNum();						

	mScene["Grouping"]["tfNum_" + o + "2"].text = mGrouping.mNewCubeList[o].length;
	fValueCompare();

	if(o == "Tens")
	{
		mScene["Grouping"]["mcDecimal"].visible = true;		
		fFillRemoveZerosAnswer();
	}
}

function
fGetNewKey(
	vKey,
	vType
)
{
	var vKeyList= [];
	var vIdx;
	
	vKeyList = ["HundredThousandths", "TenThousandths", "Thousandths", "Hundredths", "Tenths", "Ones", "Tens", "Hundreds", "Thousands", "TenThousands", "HundredThousands", "Millions", "TenMillions"];
	vIdx = vKeyList.indexOf(vKey);

	vIdx = vIdx + ((vType == "Group") ? 1 : -1);
	return vKeyList[vIdx];
}

function
fGetInitKey(
) 
{
	var vKeyList= [];
	var i;
	var j;
	
	vKeyList = ["HundredThousandths", "TenThousandths", "Thousandths", "Hundredths", "Tenths", "Ones", "Tens", "Hundreds", "Thousands", "TenThousands", "HundredThousands", "Millions", "TenMillions"];
	
	for (i = 0; i < vKeyList.length; i++)
		if(mScene["Grouping"]["mcPanel_"+vKeyList[i]] != undefined) 
			break;
		
	return vKeyList[i];
}

//----------------------------------------------------------------------------------------------------
//	release all group
//----------------------------------------------------------------------------------------------------
function
fReset(
)
{	
	var i;
	var vKey;
	
	cTransit.fEndTransit();
	clearTimeout(mThisVar.MinusTimeOut);
	
	try
	{
		mGrouping.mAnimationList[mGrouping.mGroupN][mGrouping.mAnimationN].vTarget.parent.removeChild(mGrouping.mAnimationList[mGrouping.mGroupN][mGrouping.mAnimationN].vTarget);
	}
	catch(Error){};
	
	mThisVar.Clicked = false;
	mThisVar.Minused = null;
	mGrouping.First = true;

	fSetInputAble();

	mScene["Grouping"]["mcInstruction"].fStop(1);
	
	mScene["Grouping"]["mcDecimal"].visible = false;
	
	mScene["Grouping"]["pbBreak_Tens"].fEnable(false);
	mScene["Grouping"]["pbBreak_Tens"].visible = true;
	mScene["Grouping"]["pbBreak_Ones"].fEnable(false);
	mScene["Grouping"]["pbBreak_Ones"].visible = true;
	mScene["Grouping"]["pbBreak_Tenths"].fEnable(false);
	mScene["Grouping"]["pbBreak_Tenths"].visible = true;
	
	mScene["Grouping"]["pbMin_Hundredths1"].fEnable(false);
	mScene["Grouping"]["pbMin_Hundredths1"].visible = true;
	mScene["Grouping"]["pbMin_Tenths1"].fEnable(false);
	mScene["Grouping"]["pbMin_Tenths1"].visible = true;	
	mScene["Grouping"]["pbMin_Ones1"].fEnable(false);
	mScene["Grouping"]["pbMin_Ones1"].visible = true;
	mScene["Grouping"]["pbMin_Tens1"].fEnable(false);
	mScene["Grouping"]["pbMin_Tens1"].visible = true;	
	
	mScene["Grouping"]["mcChangeValue_Ones"].visible = false;
	fSetValueChangeEmpty(mScene["Grouping"]["mcChangeValue_Ones"]);
	
	mScene["Grouping"]["mcChangeValue_Tens"].visible = false;
	fSetValueChangeEmpty(mScene["Grouping"]["mcChangeValue_Tens"]);
	
	mScene["Grouping"]["mcChangeValue_Tenths"].visible = false;
	fSetValueChangeEmpty(mScene["Grouping"]["mcChangeValue_Tenths"]);
	
	mScene["Grouping"]["mcChangeValue_Hundredths"].visible = false;
	fSetValueChangeEmpty(mScene["Grouping"]["mcChangeValue_Hundredths"]);
	
	mScene["Grouping"]["pbBreak_Tenths"].visible = (false);
	mScene["Grouping"]["pbBreak_Ones"].visible = (false);
	mScene["Grouping"]["pbBreak_Tens"].visible = (false);
	fClearSelection();
	
	mScene["Grouping"]["tfSelect_Hundredths"].text = "";
	mScene["Grouping"]["tfSelect_Tenths"].text = "";	
	mScene["Grouping"]["tfSelect_Tens"].text = "";
	mScene["Grouping"]["tfSelect_Ones"].text = "";	
	
	mScene["Grouping"]["tfNum_Hundredths"].text = "";
	mScene["Grouping"]["tfNum_Tenths"].text = "";
	mScene["Grouping"]["tfNum_Tens"].text = "";
	mScene["Grouping"]["tfNum_Ones"].text = "";
	
	mScene["Grouping"]["tfNum_Hundredths2"].text = "";
	mScene["Grouping"]["tfNum_Tenths2"].text = "";
	mScene["Grouping"]["tfNum_Tens2"].text = "";
	mScene["Grouping"]["tfNum_Ones2"].text = "";
	
	for (vKey in mGrouping.mNewCubeList)
	{
		for (i = 0; i < mGrouping.mNewCubeList[vKey].length; i++)
		{
			mScene["Grouping"].removeChild(mGrouping.mNewCubeList[vKey][i]);
		}
		mGrouping.mNewCubeList[vKey] = [];
		mGrouping.mStatusList[vKey] = {vCalculated: false, vGrouped: false };
	}
			
	mGrouping.mRegrouped = false;
	fUpdateSelectedNum();
}
//----------------------------------------------------------------------------------------------------
//	update all selected model kinds count, display in the textfield
//----------------------------------------------------------------------------------------------------
function
fUpdateSelectedNum(
) 
{
	var Num;
	var Num1;
	var i;
	var vList;
	var vNewKey;
	var vKey;
	
	Num = Num1 = 0;
	
	for (vKey in mGrouping.mNewCubeList)
	{
		switch (vKey)
		{
		case "Hundredths": 
			Num = Num + mGrouping.mNewCubeList[vKey].length * 0.01;
			break;
		case "Tenths": 
			Num = Num + mGrouping.mNewCubeList[vKey].length * 0.1;
			break;
		case "Ones": 
			Num = Num + mGrouping.mNewCubeList[vKey].length;
			break;
		case "Tens": 
			Num = Num + mGrouping.mNewCubeList[vKey].length * 10;
			break;
		case "Hundreds": 
			Num = Num + mGrouping.mNewCubeList[vKey].length * 100;
			break;
		case "Thousands": 
			Num = Num + mGrouping.mNewCubeList[vKey].length * 1000;
			break;
		case "TenThousands": 
			Num = Num + mGrouping.mNewCubeList[vKey].length * 10000;
			break;
		case "Hundredths1": 
			Num1 = Num1 + mGrouping.mNewCubeList[vKey].length * 0.01;
			break;
		case "Tenths1": 
			Num1 = Num1 + mGrouping.mNewCubeList[vKey].length * 0.1;
			break;
		case "Ones1": 
			Num1 = Num1 + mGrouping.mNewCubeList[vKey].length;
			break;
		case "Tens1": 
			Num1 = Num1 + mGrouping.mNewCubeList[vKey].length * 10;
			break;
		case "Hundreds1": 
			Num1 = Num1 + mGrouping.mNewCubeList[vKey].length * 100;
			break;
		case "Thousands1": 
			Num1 = Num1 + mGrouping.mNewCubeList[vKey].length * 1000;
			break;
		case "TenThousands1": 
			Num1 = Num1 + mGrouping.mNewCubeList[vKey].length * 10000;
			break;
		}
		
		if(!mThisVar.Clicked)
		{
			if(mScene["Grouping"]["tfNum_"+vKey] != undefined)
			{
				mScene["Grouping"]["tfNum_"+vKey].text = (mScene["Grouping"]["tfNum_"+vKey].text == "0" ? "0" : (mGrouping.mNewCubeList[vKey].length == 0 ? "" : mGrouping.mNewCubeList[vKey].length));
				mScene["Grouping"]["tfNum_"+vKey].fEnable(!mGrouping.mRegrouped);
			}
		
			if(mScene["Grouping"]["pbAdd_"+vKey] != undefined)
			{
				vNewKey = vKey.substr(0, vKey.indexOf("1"));
				mScene["Grouping"]["pbAdd_"+vKey].fEnable(!mGrouping.mStatusList[vKey].vCalculated && mGrouping.mStatusList[fGetNewKey(vNewKey, "Break")].vGrouped);
			}
			
			if(mScene["Grouping"]["pbGroup_"+vKey] != undefined)
				mScene["Grouping"]["pbGroup_"+vKey].fEnable( mGrouping.mStatusList[vKey].vCalculated && (mGrouping.mNewCubeList[vKey].length > 9));
	
			if(mScene["Grouping"]["hsModel_"+vKey] != undefined)
				mScene["Grouping"]["hsModel_"+vKey].fEnable(!mGrouping.mRegrouped && (mGrouping.mMaxCubeList[vKey] == 0 || mGrouping.mNewCubeList[vKey].length < mGrouping.mMaxCubeList[vKey]));
		}
	}

	if(mScene["Grouping"].mcWarning != undefined)
		mScene["Grouping"].mcWarning.visible = false;	
		
	if(mScene["Grouping"].tfTotal != undefined)
		mScene["Grouping"].tfTotal.text = Num;
		
	if(mScene["Grouping"].tfTotal1 != undefined)
		mScene["Grouping"].tfTotal1.text = Num1;
		
	if(mGrouping.mNewCubeList["Hundreds"] !=undefined)
	for(i=mGrouping.mNewCubeList["Hundreds"].length-1; i>-1; i--)
	{
		mScene["Grouping"].removeChild(mGrouping.mNewCubeList["Hundreds"][i]);
		mScene["Grouping"].addChild(mGrouping.mNewCubeList["Hundreds"][i]);
	}
	
	if(mGrouping.mNewCubeList["Hundreds1"] !=undefined)
	for(i=mGrouping.mNewCubeList["Hundreds1"].length-1; i>-1; i--)
	{
		mScene["Grouping"].removeChild(mGrouping.mNewCubeList["Hundreds1"][i]);
		mScene["Grouping"].addChild(mGrouping.mNewCubeList["Hundreds1"][i]);
	}
	
	if(mGrouping.mNewCubeList["Thousands"] !=undefined)
	for(i=mGrouping.mNewCubeList["Thousands"].length-1; i>-1; i--)
	{
		mScene["Grouping"].removeChild(mGrouping.mNewCubeList["Thousands"][i]);
		mScene["Grouping"].addChild(mGrouping.mNewCubeList["Thousands"][i]);
	}
	
	if(mGrouping.mNewCubeList["Thousands1"] !=undefined)
	for(i=mGrouping.mNewCubeList["Thousands1"].length-1; i>-1; i--)
	{
		mScene["Grouping"].removeChild(mGrouping.mNewCubeList["Thousands1"][i]);
		mScene["Grouping"].addChild(mGrouping.mNewCubeList["Thousands1"][i]);
	}	
}

//----------------------------------------------------------------------------------------------------
//	release all group
//----------------------------------------------------------------------------------------------------
function
fClearSelection(
) 
{	
	var i;
	var j;
	var vKey;
	var vList;
		
	for (vKey in mGrouping.mSelectedCubeList)
	{
		for (i = 0; i < mGrouping.mSelectedCubeList[vKey].length; i++)
		{
			vList =[];
			for(k=0;k <mGrouping.mSelectedCubeList[vKey][i].numChildren;k++)
				if(mGrouping.mSelectedCubeList[vKey][i].getChildAt(k).prefix == "cbModel")
					vList.push(mGrouping.mSelectedCubeList[vKey][i].getChildAt(k));
			
			for (j = 0; j < vList.length; j++)
				vList[j].fSelect(false);
		}
		mGrouping.mSelectedCubeList[vKey] = [];
	}
	
	vList= [];
	for(i=0; i< mScene["Grouping"].numChildren;i++)
		if(mScene["Grouping"].getChildAt(i).prefix == "mcPanel")
			vList.push(mScene["Grouping"].getChildAt(i));
	for (i = 0; i < vList.length; i++)
	{
		if(vList[i].totalFrames ==2)
			vList[i].gotoAndStop(0);		
	}		
	fUpdateSelectedNum();
}

//----------------------------------------------------------------------------------------------------
//	update all selected model kinds count, display in the textfield
//----------------------------------------------------------------------------------------------------
function
fAddModel(
	vKey,
	vLen
)
{
	var vIndicator;
	var vList;
	var i;
	var p;
	
	vList = [];
	vLen = Math.min(vLen, mGrouping.mMaxCubeList[vKey]);

	while (mGrouping.mNewCubeList[vKey].length < vLen)
	{
		p = fCloneDone(1,vKey);		
		for (i = 0; i < p.length; i++)
		{
			p[i].visible = true;
			p[i].name = "mcNewModel_" + vKey + "_" + mGrouping.mNewCubeList[vKey].length;		
			p[i].fEnable(false);
			
			mScene["Grouping"].addChild(p[i]);
			mGrouping.mNewCubeList[vKey].push(p[i]);
		}
	}
	
	for (i = vLen; i < mGrouping.mNewCubeList[vKey].length; i++)
		mScene["Grouping"].removeChild(mGrouping.mNewCubeList[vKey][i]);

	mGrouping.mNewCubeList[vKey].splice(vLen);
	fRearrangeCube(vKey, mGrouping.mNewCubeList[vKey].length);
}

function
fRearrangeCube(
	vKey,
	vLen
) 
{
	var vList;
	var i;
	var vObj;

	for (i = 0; i < mGrouping.mNewCubeList[vKey].length; i++)
	{
		vObj = fGetNewPosAt(vKey, vLen, mGrouping.mNewCubeList[vKey][i], i);
		
		mGrouping.mNewCubeList[vKey][i].x = vObj.x
		mGrouping.mNewCubeList[vKey][i].y = vObj.y;
	}	
}

function
fGetNewPosAt(
	vKey,
	vTotal,
	vIndicator,
	vLen
)
{
	var vObjWidth;
	var vObjHeight;
	var vObjPanelWidth;
	var vObjPanelHeight;

	switch (vIndicator.suffix)
	{
		case "cbChip_Hundredths":
		case "cbChip_Hundredths1":
		case "cbChip_Tenths":
		case "cbChip_Tenths1":
		case "cbChip_Ones":
		case "cbChip_Ones1":			
		case "cbChip_Tens":
		case "cbChip_Tens1":			
		case "cbChip_Hundreds":
		case "cbChip_Hundreds1":			
		case "cbChip_Thousands":
		case "cbChip_Thousands1":
			vObjWidth = 40;
			vObjHeight = 40;
			vObjPanelWidth = 140;
			vObjPanelHeight = 362;			
			break;	
	}
	
	if (mGrouping.mIsChipVersion)
	{
		vIndicator.x = mScene["Grouping"]["mcPanel_" + vKey].x + (vObjPanelWidth - vObjWidth * 5) / 2 + vLen % 5 * vObjWidth;
		vIndicator.y = mScene["Grouping"]["mcPanel_" + vKey].y + Math.floor(vLen / 5) * vObjHeight;
	}
	else
	{
		if (vTotal <= 10)
			vIndicator.x = mScene["Grouping"]["mcPanel_" + vKey].x + (vObjPanelWidth - vObjWidth) / 2;
		else
		{
			if (vLen < 10)
				vIndicator.x = mScene["Grouping"]["mcPanel_" + vKey].x;
			else
				vIndicator.x = mScene["Grouping"]["mcPanel_" + vKey].x + vObjPanelWidth - vObjWidth;
		}
		vIndicator.y = mScene["Grouping"]["mcPanel_" + vKey].y + (vLen % 10) * ((vObjPanelHeight - vObjHeight) / 9);		
	}
	return {x:vIndicator.x, y:vIndicator.y};	
}

//----------------------------------------------------------------------------------------------------
// update the chips on stage
//----------------------------------------------------------------------------------------------------
function fRemoveChips()
{
	var i; 
	var j; 
	var k;
	var o; 
	var p; 
	var q;
	
	for ( i = 0 ; i < mGrouping.mChipobjArray.length ; i++)
	{
		for ( j = 0 ; j < mGrouping.mChipobjArray[i][1].length ; j++)
		{
			mScene["Grouping"].removeChild(mGrouping.mChipobjArray[i][1][j]);
		}
		mGrouping.mChipobjArray[i][1] = [];
	}
}

function
fSetSelection(
	vKey,
	vStart,
	vLen
)
{
	var i;
	var j;
	var k;
	var vList;
			
	for (i = 0; i < mGrouping.mSelectedCubeList[vKey].length; i++)
	{
		vList =[];
		for(k=0; k< mGrouping.mSelectedCubeList[vKey][i].numChildren;k++)
			if(mGrouping.mSelectedCubeList[vKey][i].getChildAt(k).prefix == "cbModel")
				vList.push(mGrouping.mSelectedCubeList[vKey][i].getChildAt(k));
	
		for (j = 0; j < vList.length; j++)
			vList[j].fSelect(false);
	}
	
	mGrouping.mSelectedCubeList[vKey] = [];

	vStart = Math.max(vStart, 0);
	vLen = Math.min(vLen, mGrouping.mNewCubeList[vKey].length);
	if (vStart >= vLen)
		vLen = mGrouping.mNewCubeList[vKey].length;
	
	for (i = vStart; i < vLen; i++)
	{
		vList =[];
		for(k=0; k< mGrouping.mNewCubeList[vKey][i].numChildren;k++)
			if(mGrouping.mNewCubeList[vKey][i].getChildAt(k).prefix == "cbModel")
				vList.push(mGrouping.mNewCubeList[vKey][i].getChildAt(k));

		for (j = 0; j < vList.length; j++)
			vList[j].fSelect(true);
		mGrouping.mSelectedCubeList[vKey].push(mGrouping.mNewCubeList[vKey][i]);
	}	
	fUpdateSelectedNum();
}

function
fAddGroup(
	vKey
)
{	
	var i;
	var vLen;
	var vList;
	var vIndicator;
	var vNewKey;

	stage.enableDOMEvents(false);
	
	mGrouping.mRegrouped = true;

	vNewKey = vKey.substr(0, vKey.indexOf("1"));
	mGrouping.mPanel = vNewKey;
	
	mGrouping.mStatusList[vKey].vCalculated = true;
	mGrouping.mStatusList[vNewKey].vCalculated = true;
	
	if (mGrouping.mNewCubeList[vKey].length == 0)
		mScene["Grouping"]["mcPanel_"+ vKey].gotoAndStop(1);
	else
		fSetSelection(vKey, 0, mGrouping.mNewCubeList[vKey].length);

	if (mGrouping.mNewCubeList[vNewKey].length == 0)
		mScene["Grouping"]["mcPanel_"+ vNewKey].gotoAndStop(1);
	else
		fSetSelection(vNewKey, 0, mGrouping.mNewCubeList[vNewKey].length);
		
	fUpdateSelectedNum();

	if (mGrouping.mNewCubeList[vKey].length == 0)
	{
		mGrouping.mStatusList[vKey].vGrouped = true;
		mGrouping.mStatusList[vNewKey].vGrouped = true;
		setTimeout(fTimeClearSelection,1000);
		return;
	}

	vLen = mGrouping.mNewCubeList[vKey].length + mGrouping.mNewCubeList[vNewKey].length;
	if (mGrouping.mNewCubeList[vNewKey].length == 0)
		mScene["Grouping"]["mcPanel_"+ vNewKey].gotoAndStop(1);

	fSetSelection(vKey, 0, mGrouping.mNewCubeList[vKey].length);
	fSetSelection(vNewKey, 0, mGrouping.mNewCubeList[vNewKey].length);
	fUpdateSelectedNum();

	mGrouping.mAnimationList = [];
	mGrouping.mAnimationList[0] = [];
	
	for (i = 0; i < mGrouping.mNewCubeList[vKey].length; i++)
	{
		vIndicator = mGrouping.mNewCubeList[vKey][i];
		vIndicator.name = "mcNewModel_" + vNewKey + "_" + mGrouping.mNewCubeList[vNewKey].length;
		mGrouping.mAnimationList[0].push({vKey: vKey, vTarget: vIndicator, vNext: undefined, vStartPos: {x: vIndicator.x, y: vIndicator.y}, vEndPos: fGetNewPosAt(vNewKey, vLen, vIndicator, mGrouping.mNewCubeList[vNewKey].length), vSignal: ""});
		mGrouping.mNewCubeList[vNewKey].push(vIndicator);
	}
	mGrouping.mAnimationList[0][i - 1].vSignal = "Done";//Signal_Done;
	
	mGrouping.mNewCubeList[vKey] = [];
	
	mGrouping.mGroupN = 0;
	mGrouping.mAnimationN = 0;

	mGrouping.pState = "State_AddGroup";
	fStateAdd();
}

function fTimeClearSelection()
{
	mGrouping.mStatusList[mGrouping.mPanel].vGrouped = mGrouping.mNewCubeList[mGrouping.mPanel].length < 10;
	mGrouping.mStatusList[mGrouping.mPanel+1].vGrouped = mGrouping.mNewCubeList[mGrouping.mPanel+1].length < 10;
	fClearSelection();
	stage.enableDOMEvents(true);
}

function 
fStateAdd()
{
	cTransit.fStartTransit(mGrouping.mAnimationList[mGrouping.mGroupN][mGrouping.mAnimationN].vTarget, (mGrouping.pState == "State_AddGroup")?fAnimAddGroupDone:fDoneGroupSelection,
		{x: mGrouping.mAnimationList[mGrouping.mGroupN][mGrouping.mAnimationN].vStartPos.x, y : mGrouping.mAnimationList[mGrouping.mGroupN][mGrouping.mAnimationN].vStartPos.y}, 
		{x: mGrouping.mAnimationList[mGrouping.mGroupN][mGrouping.mAnimationN].vEndPos.x, y : mGrouping.mAnimationList[mGrouping.mGroupN][mGrouping.mAnimationN].vEndPos.y}, createjs.Ease.linear, 1000);
	
	if (mGrouping.mAnimationList[mGrouping.mGroupN][mGrouping.mAnimationN].vSignal == "")
		fAnimaStop();		
}

function fAnimaStop()
{
	if (++mGrouping.mAnimationN < mGrouping.mAnimationList[mGrouping.mGroupN].length)
	{				
		fStateAdd();
	}
	else
	{
		if (++mGrouping.mGroupN < mGrouping.mAnimationList.length)			
			fStateAdd();
		else
		{
			fRearrangeCube(mGrouping.mPanel, mGrouping.mNewCubeList[mGrouping.mPanel].length);
			setTimeout(fTimeClearSelection,1000);
		}
	}
}

function fAnimAddGroupDone()
{
	if (++mGrouping.mGroupN < mGrouping.mAnimationList.length)
		fStateAdd();
	else
	{
		fRearrangeCube(mGrouping.mPanel, mGrouping.mNewCubeList[mGrouping.mPanel].length);
		setTimeout(fTimeClearSelection,1000);
	}
}

function
fIsFitToNewPanel(
	vKey,
	vTotal
)
{
	return vTotal <= (mGrouping.mMaxCubeList[vKey] + 10);
}

function
fGroupSelection(
	vKey,
	vNewKey
)
{	
	var i;
	var j;
	var k;
	var p;
	var vList;
	var vArray;
	var vIndicator;
	var vLen;
	var vObjWidth;
	var vObjHeight;
	var vObjKeyWidth;
	var vObjKeyHeight;

	if (!fIsFitToNewPanel(vNewKey, mGrouping.mNewCubeList[vNewKey].length + 1))
	{
		mScene["Grouping"].mcWarning.visible = true;
		return;
	}
	
	mGrouping.mStatusList[vKey].vGrouped = true;
	mGrouping.mStatusList[vKey + 1].vGrouped = true;

	mGrouping.mRegrouped = true;

	vLen = mGrouping.mNewCubeList[vNewKey].length + 1;

	fRearrangeCube(vNewKey, vLen);
	
	vList = mGrouping.mNewCubeList[vKey].splice(0, 10);
	
	mGrouping.mAnimationList = [];
	switch(vNewKey)
	{	
		case "Ones":
		case "Ones1":
			vObjWidth = 7.3;
			vObjHeight = 8;
			break;		
		case "Tens":
		case "Tens1":
			vObjWidth = 28;
			vObjHeight = 16.5;
			break;		
		case "Hundreds":
		case "Hundreds1":
			vObjWidth = 32;
			vObjHeight = 17.1;
			break;		
		case "Thousands":
		case "Thousands1":
			vObjWidth = 18.6;
			vObjHeight = 20;	
			break;
	}
	
	switch(vKey)
	{
		case "Ones":
		case "Ones1":
			vObjKeyWidth = 7.3;
			vObjKeyHeight = 8;
			break;		
		case "Tens":
		case "Tens1":
			vObjKeyWidth = 28;
			vObjKeyHeight = 16.5;
			break;		
		case "Hundreds":
		case "Hundreds1":
			vObjWidth = 32;
			vObjHeight = 17.1;
			break;
		case "Thousands":
		case "Thousands1":
			vObjWidth = 18.6;
			vObjHeight = 20;	
			break;
	}
		
	for (i = 0; i < 1; i++)
	{
		vIndicator = fCloneDone(1,vNewKey);
		for (k = 0; k < vIndicator.length; k++)
		{
			vIndicator[k].visible = false;
			vIndicator[k].name = "mcNewModel_" + vNewKey + "_" + mGrouping.mNewCubeList[vNewKey].length;
		
			mScene["Grouping"].addChild(vIndicator[k]);
			
			vIndicator[k].fEnable(false);
			
			vIndicator[k].x = vList[i*10].x;
			vIndicator[k].y = vList[i*10].y;
			mGrouping.mAnimationList[i]=[];
			
			if (mGrouping.mIsChipVersion)
			{
				for (j = 0; j < 10; j++)
					mGrouping.mAnimationList[i].push({vKey: vKey, vTarget: vList[i * 10 + j], vNext: undefined, vStartPos: {x: vList[i*10+j].x, y: vList[i*10+j].y} , vEndPos: {x: vList[0].x,y: vList[0].y}, vSignal: ""});
			}
			else
			{
				for (j = 0; j < 10; j++)
				{
					mGrouping.mAnimationList[i].push({vKey: vKey, vTarget: vList[i * 10 + j], vNext: undefined, vStartPos: {x: vList[i*10+j].x, y: vList[i*10+j].y}, vEndPos: undefined, vSignal: ""});
					switch (vKey)
					{
					case "Ones":
						mGrouping.mAnimationList[i][j].vEndPos = new createjs.Point(vIndicator[k].x + j * ((vObjWidth - vObjKeyWidth) / 9), vIndicator[k].y + j * ((vObjHeight - vObjKeyHeight) / 9));
						break;
					
					case "Tens":
						mGrouping.mAnimationList[i][j].vEndPos = new createjs.Point(vIndicator[k].x + vObjWidth / 2 - j * vObjWidth / 20, vIndicator[k].y + j * vObjHeight / 20);
						break;
					
					case "Thousands":	
					case "Hundreds":
						mGrouping.mAnimationList[i][j].vEndPos = new createjs.Point(vIndicator[k].x, vIndicator[k].y + j * (vObjHeight - vObjKeyHeight) / 9);
						break;
					}					
				}
			}
			
			mGrouping.mAnimationList[i][j - 1].vSignal = "Done"; //Signal_Done;
			mGrouping.mAnimationList[i][j - 1].vNext = vIndicator[k];
			mGrouping.mAnimationList[i].push({vKey: vNewKey, vTarget: vIndicator[k], vNext: undefined, vStartPos: {x:vIndicator[k].x, y:vIndicator[k].y}, vEndPos: fGetNewPosAt(vNewKey, vLen, vIndicator[k], mGrouping.mNewCubeList[vNewKey].length), vSignal: "Done"});
			
			mGrouping.mNewCubeList[vNewKey].push(vIndicator[k]);			
		}		
	}

	stage.enableDOMEvents(false);
	mGrouping.mPanel = vKey;
	mGrouping.mGroupN = 0;
	mGrouping.mAnimationN = 0;
	mGrouping.pState = "State_GroupSelection";
	fStateAdd();
}

function fDoneGroupSelection()
{	
	if (mGrouping.mAnimationList[mGrouping.mGroupN]!=undefined &&(mGrouping.mAnimationN < mGrouping.mAnimationList[mGrouping.mGroupN].length - 1))
	{
		if (mGrouping.mAnimationList[mGrouping.mGroupN][mGrouping.mAnimationN].vSignal != "" && mGrouping.mAnimationList[mGrouping.mGroupN][mGrouping.mAnimationN].vNext != undefined)
		{
			for (i = 0; i <= mGrouping.mAnimationN; i++)
				mGrouping.mAnimationList[mGrouping.mGroupN][i].vTarget.visible = false;
				
			mGrouping.mAnimationList[mGrouping.mGroupN][mGrouping.mAnimationN].vNext.visible = true;
		}
		mGrouping.mAnimationN++;
		mGrouping.pState = "State_GroupSelection";
		fStateAdd();
	}
	else
	{
		fResetAnimation(mGrouping.mPanel, mGrouping.mGroupN);
		
		if (++mGrouping.mGroupN < mGrouping.mAnimationList.length)
		{		
			mGrouping.pState = "State_GroupSelection";
			fStateAdd();
		}
		else
		{
			fRearrangeCube(mGrouping.mPanel, mGrouping.mNewCubeList[mGrouping.mPanel].length);
			mGrouping.pState = "State_Idle";
		
			if(mGrouping.mGroupN ==10)
				stage.enableDOMEvents(true);
		}
	}
}

function
fResetAnimation(
	vKey,
	vGroupN
) 
{	
	var i;
	var j;
	
	if(mGrouping.mAnimationList[vGroupN]!=undefined)
	for (i = 0; i < mGrouping.mAnimationList[vGroupN].length; i++)
	{
		if (mGrouping.mAnimationList[vGroupN][i].vKey == vKey)
		{			
			j = mGrouping.mNewCubeList[vKey].indexOf(mGrouping.mAnimationList[vGroupN][i].vTarget);
			if (j != -1)
				mGrouping.mNewCubeList[vKey].splice(j, 1);
			
			j = mGrouping.mSelectedCubeList[vKey].indexOf(mGrouping.mAnimationList[vGroupN][i].vTarget);
			if (j != -1)
				mGrouping.mSelectedCubeList[vKey].splice(j, 1);

			mScene["Grouping"].removeChild(mGrouping.mAnimationList[vGroupN][i].vTarget);
		}
	}
	
	fUpdateSelectedNum();
	mGrouping.mAnimationN = 0;
}

function
fBreakSelection(
	vKey,
	vNewKey
)
{		
	var i;
	var j;
	var k;
	var vLen;
	var vList;
	var vArray;
	var vOldCube;
	var vIndicator;

	if (!fIsFitToNewPanel(vNewKey, mGrouping.mNewCubeList[vNewKey].length + 10))
	{
		mScene["Grouping"].mcWarning.visible = true;
		return;
	}

	mGrouping.mRegrouped = true;
	mGrouping.mStatusList[vKey].vGrouped = true;
	
	vLen = mGrouping.mNewCubeList[vNewKey].length;
	
	fRearrangeCubeToRight(vNewKey, vLen + 10);

	mGrouping.mAnimationList = [];
	
	vOldCube = mGrouping.mNewCubeList[vKey].pop();
	
	switch(String(vOldCube.name).split("_")[1])
	{
		case "Thousands":
		case "Thousands1":
		case "Hundreds":
		case "Hundreds1":
		case "Tens":
		case "Tens1":
		case "Tenths":
		case "Tenths1":	
		case "Hundredths":
		case "Hundredths1":	
		case "Ones":
		case "Ones1":	
			vOldObjWidth = 42;
			vOldObjHeight = 24.7;
			break;		
	}
	switch(vNewKey)
	{	
		case "Thousands":
		case "Thousands1":
		case "Hundreds":
		case "Hundreds1":
		case "Tens":
		case "Tens1":
		case "Tenths":
		case "Tenths1":	
		case "Hundredths":
		case "Hundredths1":	
		case "Ones":
		case "Ones1":
			vObjWidth = 7.3;
			vObjHeight = 8;
			break;		
	}
	
	switch(vKey)
	{	
		case "Thousands":
		case "Thousands1":
		case "Hundreds":
		case "Hundreds1":
		case "Tens":
		case "Tens1":
		case "Tenths":
		case "Tenths1":	
		case "Hundredths":
		case "Hundredths1":	
		case "Ones":
		case "Ones1":
			vObjKeyWidth = 7.3;
			vObjKeyHeight = 8;
			break;		
	}

	for (i = 0; i < 1; i++)
	{
		mGrouping.mAnimationList[i] = [];
		mGrouping.mAnimationList[i].push({vKey: vKey, vTarget: vOldCube, vNext: vOldCube, vStartPos: {x:vOldCube.x,y:vOldCube.y}, vEndPos: {x:mScene["Grouping"]["mcPanel_" + vNewKey].x,y:mScene["Grouping"]["mcPanel_" + vNewKey].y}, vSignal: "Done"});
		vOldCube.x = mScene["Grouping"]["mcPanel_"+vNewKey].x;
		vOldCube.y = mScene["Grouping"]["mcPanel_"+vNewKey].y;
	
		for (j = 0; j < 10; j++)
		{			
			vIndicator = fCloneDone(1,vNewKey);
		
			for (k = 0; k < vIndicator.length; k++)
			{
				vIndicator[k].name = "mcNewModel_" + vNewKey + "_" + mGrouping.mNewCubeList[vNewKey].length;
				vIndicator[k].x = mScene["Grouping"]["mcPanel_" + vNewKey].x;
				vIndicator[k].y = mScene["Grouping"]["mcPanel_" + vNewKey].y;
				vIndicator[k].visible = false;
				vIndicator[k].fEnable(false);
		
				mScene["Grouping"].addChild(vIndicator[k]);		
				vIndicator[k]["cbModel_" + vNewKey].fSelect(vOldCube["cbModel_" + vKey].Selected);
	
				if (mGrouping.mIsChipVersion)
					mGrouping.mAnimationList[i].push( { vKey: vNewKey, vTarget: vIndicator[k], vNext: undefined, vStartPos: fGetNewPosAt(vNewKey, vLen + 10,  vIndicator[k], 0), vEndPos: fGetNewPosAt(vNewKey, vLen + 10,  vIndicator[k], j), vSignal: "" } );
				else
				{
					mGrouping.mAnimationList[i].push( { vKey: vNewKey, vTarget:  vIndicator[k], vNext: undefined, vStartPos: undefined, vEndPos: fGetNewPosAt(vNewKey, vLen + 10,  vIndicator[k], j), vSignal: "" } );
					switch (vNewKey)
					{
						case "Ones":
							mGrouping.mAnimationList[i][j + 1].vStartPos = new createjs.Point(vOldCube.x + j * ((vOldObjWidth - vObjWidth) / 9), vOldCube.y + j * ((vOldObjHeight  - vObjHeight) / 9));
							break;
					
						case "Tens":
						case "Tenths":
							mGrouping.mAnimationList[i][j + 1].vStartPos = new createjs.Point(vOldCube.x + vOldObjWidth / 2 - j * vOldObjWidth / 20, vOldCube.y + j * vOldObjHeight / 20);
							break;
						
						case "Thousands":	
						case "Hundreds":							
						case "Hundredths":							
							mGrouping.mAnimationList[i][j + 1].vStartPos = new createjs.Point(vOldCube.x, vOldCube.y + j * (vOldObjHeight  - vObjHeight) / 9);
							break;					
					}
				}
				mGrouping.mNewCubeList[vNewKey].push( vIndicator[k]);
				if(vOldCube["cbModel_" + vKey].Selected)
					fAddToSelection(vIndicator[k]);
			}
		}		
	}

	mGrouping.mPanel = vKey;
	mGrouping.mGroupN = 0;
	mGrouping.mAnimationN = 0;
	fGoBreakSelection();
}

function 
fGoBreakSelection(
)
{
	cTransit.fStartTransit(mGrouping.mAnimationList[mGrouping.mGroupN][mGrouping.mAnimationN].vTarget, 
		fGoBreakSelectionDone,
		{x: mGrouping.mAnimationList[mGrouping.mGroupN][mGrouping.mAnimationN].vStartPos.x, y : mGrouping.mAnimationList[mGrouping.mGroupN][mGrouping.mAnimationN].vStartPos.y}, 
		{x: mGrouping.mAnimationList[mGrouping.mGroupN][mGrouping.mAnimationN].vEndPos.x, y : mGrouping.mAnimationList[mGrouping.mGroupN][mGrouping.mAnimationN].vEndPos.y}, 
		createjs.Ease.linear, 1000);
							
	if (mGrouping.mAnimationList[mGrouping.mGroupN][mGrouping.mAnimationN].vSignal == "")
		fGoBreakSelectionDone();
}

function 
fGoBreakSelectionDone(
)
{	
	if (mGrouping.mAnimationList[mGrouping.mGroupN]!= undefined &&(mGrouping.mAnimationN < mGrouping.mAnimationList[mGrouping.mGroupN].length - 1))
	{
		if (mGrouping.mAnimationList[mGrouping.mGroupN][mGrouping.mAnimationN].vSignal != "" && mGrouping.mAnimationList[mGrouping.mGroupN][mGrouping.mAnimationN].vNext != undefined)
		{
			mGrouping.mAnimationList[mGrouping.mGroupN][mGrouping.mAnimationN].vTarget.visible = false;		
			for (i = mGrouping.mAnimationN + 1; i < mGrouping.mAnimationList[mGrouping.mGroupN].length; i++)
				mGrouping.mAnimationList[mGrouping.mGroupN][i].vTarget.visible = true;
		}
		mGrouping.mAnimationN++;		
		fGoBreakSelection();
	}
	else
	{
		fResetAnimation(mGrouping.mPanel, mGrouping.mGroupN);
		if(++mGrouping.mGroupN>10)
		{
			fTimeBreakDone();
		}
	}
}

function 
fTimeBreakDone(
)
{
	vNewKey = fGetNewKey(mGrouping.mPanel, "Break");
	fRearrangeCube(vNewKey, mGrouping.mNewCubeList[vNewKey].length);
	fUpdateSelectedNum();
	stage.enableDOMEvents(true);
}

function
fRearrangeCubeToRight(
	vKey,
	vLen
) 
{	
	var i;	
	for (i = 0; i < mGrouping.mNewCubeList[vKey].length; i++)
	{
		mGrouping.mNewCubeList[vKey][i].x = (fGetNewPosAt(vKey, vLen, mGrouping.mNewCubeList[vKey][i], 10 + i)).x;
		mGrouping.mNewCubeList[vKey][i].y = (fGetNewPosAt(vKey, vLen, mGrouping.mNewCubeList[vKey][i], 10 + i)).y;	
	}
}

function
fAddToSelection(
	vTarget
) 
{
	var i;
	var vKey;
	vKey = cString.fPrefix(vTarget.pSuffix);
	
	for (i = 0; i < mSelectedCubeList[vKey].length; i++)
	{
		if (int(cString.fSuffix(mSelectedCubeList[vKey][i].pSuffix)) > int(cString.fSuffix(vTarget.pSuffix)))
		{
			mSelectedCubeList[vKey].splice(i, 0, vTarget);
			break;
		}
	}
	if (i == mSelectedCubeList[vKey].length)
		mSelectedCubeList[vKey].push(vTarget);
}

function
fCloneDone(
	vData,vType
)
{
	var vClone = [];
	for (i = 0 ; i < vData; i++)
	{
		var Clone = new lib.ReturnClone(vType);
	
		cBase(Clone, "mc_cbChip_"+vType);				
		cMovieClip(Clone);
		Clone.visible = false;		
		vClone.push(Clone);
	}
	return vClone;
}

function 
fValueCompare()
{
	var i;
	var j;
	var o;
	var p;
	var vTop;
	var vBottom;	
	
	var vTopOnes;
	var vBottomOnes;
	
	var vTopTens;
	var vBottomTens;
	
	var vTopHundreds;
	var vBottomHundreds;
	
	o = fValueMoreThanZero();
	
	vTop = String(mScene["Grouping"]["tfNum_Tens"].text);
	vTop += String(mScene["Grouping"]["tfNum_Ones"].text == "" ? "0" : mScene["Grouping"]["tfNum_Ones"].text);			
	vTop += String(mScene["Grouping"]["tfNum_Tenths"].text == "" ? "0" : mScene["Grouping"]["tfNum_Tenths"].text);			
	vTop += String(mScene["Grouping"]["tfNum_Hundredths"].text == "" ? "0" : mScene["Grouping"]["tfNum_Hundredths"].text);			
	vTop = parseInt(vTop);
		
	vBottom = String(mScene["Grouping"]["tfSelect_Tens"].text);
	vBottom += String(mScene["Grouping"]["tfSelect_Ones"].text);		
	vBottom += String(mScene["Grouping"]["tfSelect_Tenths"].text);		
	vBottom += String(mScene["Grouping"]["tfSelect_Hundredths"].text);		
	vBottom = parseInt(vBottom);
	
	vTopOnes = mGrouping.mNewCubeList["Hundredths"].length;	//using length as need know remaining
	vBottomOnes = parseInt("0" + mScene["Grouping"]["tfSelect_Hundredths"].text); //unchange amount for minus

	vTopTens = mGrouping.mNewCubeList["Tenths"].length;	//using length as need know remaining
	vBottomTens = parseInt("0" + mScene["Grouping"]["tfSelect_Tenths"].text); //unchange amount for minus
	
	vTopHundreds = mGrouping.mNewCubeList["Ones"].length; //using length as need know remaining
	vBottomHundreds = parseInt("0" + mScene["Grouping"]["tfSelect_Ones"].text); //unchange amount for minus
	
	if(mScene["Grouping"].mcWarning != undefined)
		mScene["Grouping"].mcWarning.visible = false;
				
	mScene["Grouping"]["pbMin_Tenths1"].fEnable(false);
	mScene["Grouping"]["pbMin_Hundredths1"].fEnable(false);
	mScene["Grouping"]["pbMin_Tens1"].fEnable(false);
	mScene["Grouping"]["pbMin_Ones1"].fEnable(false);
	
	mScene["Grouping"]["pbBreak_Tenths"].fEnable(false);	
	mScene["Grouping"]["pbBreak_Ones"].fEnable(false);	
	mScene["Grouping"]["pbBreak_Tens"].fEnable(false);
		
	if(mThisVar.Minused == "Tens1")
	{
		mScene["Grouping"]["mcInstruction"].fStop(4);
		return;	
	}
		
	mScene["Grouping"]["pbBreak_Ones"].visible = false;
	mScene["Grouping"]["pbBreak_Tenths"].visible = false;
	mScene["Grouping"]["pbBreak_Tens"].visible = false;
	
	mScene["Grouping"]["mcInstruction"].fStop(1);
	
	fSetInputAble();

	if(isNaN(vBottom) || isNaN(vTop))	
	{
		mScene["Grouping"]["pbBreak_Tenths"].fEnable(false);
		mScene["Grouping"]["pbBreak_Tenths"].visible = false;
		mScene["Grouping"]["pbBreak_Ones"].fEnable(false);
		mScene["Grouping"]["pbBreak_Ones"].visible = false;
		mScene["Grouping"]["pbBreak_Tens"].fEnable(false);
		mScene["Grouping"]["pbBreak_Tens"].visible = false;
		
		mScene["Grouping"]["pbMin_Tenths1"].fEnable(false);
		mScene["Grouping"]["pbMin_Hundredths1"].fEnable(false);
		mScene["Grouping"]["pbMin_Tens1"].fEnable(false);
		mScene["Grouping"]["pbMin_Ones1"].fEnable(false);
	}
	else
	{
		vBottom = String(mScene["Grouping"]["tfSelect_Tens"].text);
		vBottom += String(mScene["Grouping"]["tfSelect_Ones"].text == "" ? "0" : mScene["Grouping"]["tfSelect_Ones"].text);			
		vBottom += String(mScene["Grouping"]["tfSelect_Tenths"].text == "" ? "0" : mScene["Grouping"]["tfSelect_Tenths"].text);			
		vBottom += String(mScene["Grouping"]["tfSelect_Hundredths"].text == "" ? "0" : mScene["Grouping"]["tfSelect_Hundredths"].text);			
		vBottom = parseInt(vBottom);
	}

	if((vBottom > vTop) && (!mThisVar.Clicked) || (!o))
	{
		if(mScene["Grouping"].mcWarning != undefined)
			if(o)
				mScene["Grouping"].mcWarning.visible = true;
			
		mScene["Grouping"]["pbBreak_Tenths"].fEnable(false);
		mScene["Grouping"]["pbBreak_Ones"].fEnable(false);
		mScene["Grouping"]["pbBreak_Tens"].fEnable(false);
		
		mScene["Grouping"]["pbMin_Tenths1"].fEnable(false);
		mScene["Grouping"]["pbMin_Hundredths1"].fEnable(false);
		mScene["Grouping"]["pbMin_Tens1"].fEnable(false);
		mScene["Grouping"]["pbMin_Ones1"].fEnable(false);
	}	
	//else if ((vTop == 0) || (vBottom == 0))
	else if (isNaN(vBottom) || (vBottom > vTop) /*|| (vTop == 0)*/)
	{
		mScene["Grouping"]["pbBreak_Tenths"].fEnable(false);
		mScene["Grouping"]["pbBreak_Ones"].fEnable(false);
		mScene["Grouping"]["pbBreak_Tens"].fEnable(false);
		
		mScene["Grouping"]["pbMin_Hundredths1"].fEnable(false);
		mScene["Grouping"]["pbMin_Tenths1"].fEnable(false);
		mScene["Grouping"]["pbMin_Tens1"].fEnable(false);
		mScene["Grouping"]["pbMin_Ones1"].fEnable(false);
	}
	else
	{				
		if((vBottomOnes > vTopOnes) && (mThisVar.Minused == null))
		{					
			if((vTopTens == 0) && (vTopHundreds == 0))
			{
				mScene["Grouping"]["mcInstruction"].fStop(2);				
				mScene["Grouping"]["pbBreak_Tens"].fEnable(true);
				mScene["Grouping"]["pbBreak_Tens"].visible = true;	
			}
			else if(vTopTens == 0)
			{
				mScene["Grouping"]["mcInstruction"].fStop(2);				
				mScene["Grouping"]["pbBreak_Ones"].fEnable(true);
				mScene["Grouping"]["pbBreak_Ones"].visible = true;	
			}
			else
			{
				mScene["Grouping"]["mcInstruction"].fStop(2);				
				mScene["Grouping"]["pbBreak_Tenths"].fEnable(true);
				mScene["Grouping"]["pbBreak_Tenths"].visible = true;	
			}
		}		
		else
		{			
			if(mThisVar.Minused == null)
			{
				mScene["Grouping"]["mcInstruction"].fStop(3);
				mScene["Grouping"]["pbMin_Hundredths1"].fEnable(true);
			}
			else
			{
				if(mThisVar.Minused == "Hundredths1")
				{
					if(vTopTens >= vBottomTens)
					{
						mScene["Grouping"]["mcInstruction"].fStop(3);	
						mScene["Grouping"]["pbMin_Tenths1"].fEnable(true);						
					}
					else
					{
						if(vTopHundreds == 0)
						{
							mScene["Grouping"]["mcInstruction"].fStop(2);
							mScene["Grouping"]["pbBreak_Tens"].fEnable(true);
							mScene["Grouping"]["pbBreak_Tens"].visible = true;							
						}
						else
						{
							mScene["Grouping"]["mcInstruction"].fStop(2);
							mScene["Grouping"]["pbBreak_Ones"].fEnable(true);
							mScene["Grouping"]["pbBreak_Ones"].visible = true;
						}
					}
				}
				else if(mThisVar.Minused == "Tenths1")
				{
					if(vTopHundreds >= vBottomHundreds)
					{
						mScene["Grouping"]["mcInstruction"].fStop(3);
						mScene["Grouping"]["pbMin_Ones1"].fEnable(true);
					}
					else
					{
						mScene["Grouping"]["mcInstruction"].fStop(2);
						mScene["Grouping"]["pbBreak_Tens"].fEnable(true);
						mScene["Grouping"]["pbBreak_Tens"].visible = true;
					}					
				}
				else if(mThisVar.Minused == "Ones1")
				{
					mScene["Grouping"]["mcInstruction"].fStop(3);
					mScene["Grouping"]["pbMin_Tens1"].fEnable(true);
				}
			}			
		}
	}
}

function
fSetInputAble()
{
	var vBool = true;
	
	if(mThisVar.Clicked)
		vBool = false;
		
	mScene["Grouping"]["tfNum_Tenths"].fEnable(vBool);	
	mScene["Grouping"]["tfNum_Hundredths"].fEnable(vBool);	
	mScene["Grouping"]["tfNum_Tens"].fEnable(vBool);
	mScene["Grouping"]["tfNum_Ones"].fEnable(vBool);
	mScene["Grouping"]["tfSelect_Tenths"].fEnable(vBool);
	mScene["Grouping"]["tfSelect_Hundredths"].fEnable(vBool);
	mScene["Grouping"]["tfSelect_Tens"].fEnable(vBool);
	mScene["Grouping"]["tfSelect_Ones"].fEnable(vBool);	
}

function
fSetValueChangeEmpty(vTarget)
{
	var i = 0;
	
	for(i = 0 ; i < 5 ; i ++)
	{
		if(vTarget["tfText_" + i] != undefined)
		{
			vTarget["tfText_" + i].text = "";
		}
	}
	
	//try catch as not all target passed in is movieclip that contains multiple frame
	try{
		vTarget.fStop(1);
	}
	catch(Error)
	{}
}

function
fFillRemoveZeros()
{
	var i, j;
	var o, p;
	
	o = false;
	for(i = xKeyID.length - 1 ; i >= 0 ; i--)
	{
		if(!isNaN(parseInt(mScene["Grouping"]["tfNum_" + xKeyID[i]].text)) && (parseInt(mScene["Grouping"]["tfNum_" + xKeyID[i]].text) > 0))
			o = true;			
			
		if(xKeyID[i] == "Ones")
			 o = true;
			
		mScene["Grouping"]["tfNum_" + xKeyID[i]].text = (!o) ? "" : (mScene["Grouping"]["tfNum_" + xKeyID[i]].text == "" ? "0" : mScene["Grouping"]["tfNum_" + xKeyID[i]].text); 	
	
		if((!o) && (i == 0))
			mScene["Grouping"]["tfNum_" + xKeyID[i]].text = "0";
	}
	
	o = false;
	for(i = xKeyID.length - 1 ; i >= 0 ; i--)
	{	
		if(!isNaN(parseInt(mScene["Grouping"]["tfSelect_" + xKeyID[i]].text)) && (parseInt(mScene["Grouping"]["tfSelect_" + xKeyID[i]].text) > 0))
			o = true;
			
		if(xKeyID[i] == "Ones")
			 o = true;	
			
		mScene["Grouping"]["tfSelect_" + xKeyID[i]].text = (!o) ? "" : (mScene["Grouping"]["tfSelect_" + xKeyID[i]].text == "" ? "0" : mScene["Grouping"]["tfSelect_" + xKeyID[i]].text); 	
	
		if((!o) && (i == 0))
			mScene["Grouping"]["tfSelect_" + xKeyID[i]].text = "0";
	}	
}

function
fFillRemoveZerosAnswer()
{
	var i, j;
	var o, p;
	
	o = false;
	for(i = xKeyID.length - 1 ; i >= 0 ; i--)
	{
		if(xKeyID[i] == "Hundredths")
			 o = false;	 
		
		if(!isNaN(parseInt(mScene["Grouping"]["tfNum_" + xKeyID[i] + "2"].text)) && (parseInt(mScene["Grouping"]["tfNum_" + xKeyID[i] + "2"].text) > 0))
			o = true;			
			
		if(xKeyID[i] == "Ones")
			 o = true;		
			
		mScene["Grouping"]["tfNum_" + xKeyID[i] + "2"].text = (!o) ? "" : (mScene["Grouping"]["tfNum_" + xKeyID[i] + "2"].text == "" ? "0" : mScene["Grouping"]["tfNum_" + xKeyID[i] + "2"].text); 	
	}	
}

function
fValueMoreThanZero()
{
	var vTopValue;
	var vBottomValue;
	var vDiff = ["tfNum_", "tfSelect_"];		
		
	var xFrontKeyID = ["Tens", "Ones"];
	var xBackKeyID = ["Hundredths", "Tenths"];
	//handle the front	
	var vTracker = [];
	for(j = 0 ; j < vDiff.length ; j++) //input field set
	{
		var vTempFalse = false;	
		for(i = 0 ; i < xFrontKeyID.length ; i++)
		{
			if(mScene["Grouping"][vDiff[j] + xFrontKeyID[i]].text != "")	//from left check if not empty		
				vTempFalse = true;			
			else
			{
				if(!vTempFalse)	//when not empty, rest should also be non empty
				;
				else
					return false; // text is empty and there's a non empty text before it
			}
		}
		vTracker.push(vTempFalse);
	}
	//front is ok, can be all empty or all filled, just no gaps between number
	
	//check make sure fields are filled, example Tenths should be filled if Hundredths is filled
	for(j = 0 ; j < vDiff.length ; j++) //input field set
	{
		var vTempFalse = false;	
		for(i = 0 ; i < xBackKeyID.length ; i++)
		{
			if(mScene["Grouping"][vDiff[j] + xBackKeyID[i]].text != "")	//from left check if not empty		
				vTempFalse = true;			
			else
			{
				if(!vTempFalse)	//when not empty, rest should also be non empty
				;
				else
					return false; // text is empty and there's a non empty text before it
			}
		}
	}
	//to make sure each column in tenths is filled
	if ((mScene["Grouping"][vDiff[0] + "Tenths"].text == "") || (mScene["Grouping"][vDiff[1] + "Tenths"].text == ""))
		return false;
		
	//to make sure atleast 1 column in hundredths is filled, the other can be blank and 0 will be auto added
	if ((mScene["Grouping"][vDiff[0] + "Hundredths"].text == "") && (mScene["Grouping"][vDiff[1] + "Hundredths"].text == ""))
		return false;
	
	//all ok
	return true;	
}
//----------------------------------------------------------------------------------------------------
return Engine;
})();
