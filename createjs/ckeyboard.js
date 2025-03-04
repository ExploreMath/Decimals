//----------------------------------------------------------------------------------
//	cKeyboard.as
//
//	When using for custom keyboard, add any additional Button to the IgnoreList
//	so that keyboard will not try to handles it and return it as a click to engine
//----------------------------------------------------------------------------------

function 
cKeyboard(
	vTarget
) 
{
	var mThisKeyBoard = vTarget;
	var mCapsState = false;
	var mShiftState = false;
	var mSymbolState = false;
	var mFullKB = false;
	var mRKeyCode;
	
	var mOffSetx = 0;
	var mOffSety = 0;
	
	fPrepKeyCode();
	
	vTarget.removeAllEventListeners("click"); 	
	vTarget.IgnoreList = [];
	
	var mKeyList = [];

	for (var i = 0; i < vTarget.numChildren; i++)
	{		
		vTarget.getChildAt(i).mouseChildren = false;
		
		//let the keyboard handles dragging/moving				
		if(vTarget.getChildAt(i).name == "hsHandle")
		{
			vTarget.getChildAt(i).addEventListener("pressmove", fMoveThis);
			vTarget.getChildAt(i).addEventListener("mousedown", fSetOffSet);
		}
		//vTarget.getChildAt(i).addEventListener("click", fKeyClick); //removed 20200821
		
		//console.log(vTarget.getChildAt(i))

		vTarget.getChildAt(i).IsKeyBoardBtn = true;
				
		mKeyList.push(vTarget.getChildAt(i));
		
		if (vTarget.getChildAt(i).name == "cbKey_Symbol")
			mFullKB = true;
		
		switch (vTarget.getChildAt(i).name)
		{		
			case "pbKey_v1":
				vTarget.getChildAt(i).xText.text = "|";
				vTarget.getChildAt(i).xText.hitArea = fCreateHitSize(vTarget.getChildAt(i).xText);
				break;
				
			case "pbKey_CA":
				vTarget.getChildAt(i).xText.text = "^";
				vTarget.getChildAt(i).xText.hitArea = fCreateHitSize(vTarget.getChildAt(i).xText);
				break;
				
			case "pbKey_LL":
				vTarget.getChildAt(i).xText.text = "_";
				vTarget.getChildAt(i).xText.hitArea = fCreateHitSize(vTarget.getChildAt(i).xText);
				break;
				
			case "pbKey_GA":
				vTarget.getChildAt(i).xText.text = "`";
				vTarget.getChildAt(i).xText.hitArea = fCreateHitSize(vTarget.getChildAt(i).xText);
				break;
				
			case "pbKey_Plus":
				vTarget.getChildAt(i).xText.text = "+";
				vTarget.getChildAt(i).xText.hitArea = fCreateHitSize(vTarget.getChildAt(i).xText);
				break;
				
			case "pbKey_Minus":
				vTarget.getChildAt(i).xText.text = "–";
				vTarget.getChildAt(i).xText.hitArea = fCreateHitSize(vTarget.getChildAt(i).xText);
				break;
				
			case "pbKey_Multiply":
				vTarget.getChildAt(i).xText.text = "×";
				vTarget.getChildAt(i).xText.hitArea = fCreateHitSize(vTarget.getChildAt(i).xText);
				break;
				
			case "pbKey_Divide":
				vTarget.getChildAt(i).xText.text = "÷";
				vTarget.getChildAt(i).xText.hitArea = fCreateHitSize(vTarget.getChildAt(i).xText);
				break;
				
			case "pbKey_Equal":
				vTarget.getChildAt(i).xText.text = "=";
				vTarget.getChildAt(i).xText.hitArea = fCreateHitSize(vTarget.getChildAt(i).xText);
				break;
				
			case "pbKey_BiggerThan":
				vTarget.getChildAt(i).xText.text = ">";
				vTarget.getChildAt(i).xText.hitArea = fCreateHitSize(vTarget.getChildAt(i).xText);
				break;
				
			case "pbKey_SmallThan":
				vTarget.getChildAt(i).xText.text = "<";
				vTarget.getChildAt(i).xText.hitArea = fCreateHitSize(vTarget.getChildAt(i).xText);
				break;
			
			case "pbKey_LeftBracket":
				vTarget.getChildAt(i).xText.text = "(";
				vTarget.getChildAt(i).xText.hitArea = fCreateHitSize(vTarget.getChildAt(i).xText);
				break;
				
			case "pbKey_RightBracket":
				vTarget.getChildAt(i).xText.text = ")";
				vTarget.getChildAt(i).xText.hitArea = fCreateHitSize(vTarget.getChildAt(i).xText);
				break;
				
			case "pbKey_Comma":	
				vTarget.getChildAt(i).xText.text = ",";
				vTarget.getChildAt(i).xText.hitArea = fCreateHitSize(vTarget.getChildAt(i).xText);
				break;
				
			case "pbKey_Decimal":
				vTarget.getChildAt(i).xText.text = ".";
				vTarget.getChildAt(i).xText.hitArea = fCreateHitSize(vTarget.getChildAt(i).xText);
				break;
				
			case "pbKey_Tilde":
				vTarget.getChildAt(i).xText.text = "~";
				vTarget.getChildAt(i).xText.hitArea = fCreateHitSize(vTarget.getChildAt(i).xText);
				break;
				
			case "pbKey_Exclamation":
				vTarget.getChildAt(i).xText.text = "!";
				vTarget.getChildAt(i).xText.hitArea = fCreateHitSize(vTarget.getChildAt(i).xText);
				break;
				
			case "pbKey_At":
				vTarget.getChildAt(i).xText.text = "@";
				vTarget.getChildAt(i).xText.hitArea = fCreateHitSize(vTarget.getChildAt(i).xText);
				break;
				
			case "pbKey_NumberSign":
				vTarget.getChildAt(i).xText.text = "#";
				vTarget.getChildAt(i).xText.hitArea = fCreateHitSize(vTarget.getChildAt(i).xText);
				break;
				
			case "pbKey_Percentage":
				vTarget.getChildAt(i).xText.text = "%";
				vTarget.getChildAt(i).xText.hitArea = fCreateHitSize(vTarget.getChildAt(i).xText);
				break;
				
			case "pbKey_Carat":
				vTarget.getChildAt(i).xText.text = "^";
				vTarget.getChildAt(i).xText.hitArea = fCreateHitSize(vTarget.getChildAt(i).xText);
				break;
				
			case "pbKey_Ampersand":
				vTarget.getChildAt(i).xText.text = "&";
				vTarget.getChildAt(i).xText.hitArea = fCreateHitSize(vTarget.getChildAt(i).xText);
				break;
				
			case "pbKey_Asterisk":
				vTarget.getChildAt(i).xText.text = "*";
				vTarget.getChildAt(i).xText.hitArea = fCreateHitSize(vTarget.getChildAt(i).xText);
				break;
				
			case "pbKey_OpenParenthesis":
				vTarget.getChildAt(i).xText.text = "(";
				vTarget.getChildAt(i).xText.hitArea = fCreateHitSize(vTarget.getChildAt(i).xText);
				break;
				
			case "pbKey_CloseParenthesis":
				vTarget.getChildAt(i).xText.text = ")";
				vTarget.getChildAt(i).xText.hitArea = fCreateHitSize(vTarget.getChildAt(i).xText);
				break;
				
			case "pbKey_Bar":
				vTarget.getChildAt(i).xText.text = "|";
				vTarget.getChildAt(i).xText.hitArea = fCreateHitSize(vTarget.getChildAt(i).xText);
				break;
				
			case "pbKey_BackSlash":
				vTarget.getChildAt(i).xText.text = "\\";
				vTarget.getChildAt(i).xText.hitArea = fCreateHitSize(vTarget.getChildAt(i).xText);
				break;
				
			case "pbKey_OpenBracket":
				vTarget.getChildAt(i).xText.text = "[";
				vTarget.getChildAt(i).xText.hitArea = fCreateHitSize(vTarget.getChildAt(i).xText);
				break;
				
			case "pbKey_CloseBracket":
				vTarget.getChildAt(i).xText.text = "]";
				vTarget.getChildAt(i).xText.hitArea = fCreateHitSize(vTarget.getChildAt(i).xText);
				break;
				
			case "pbKey_Dollar":
				vTarget.getChildAt(i).xText.text = "$";
				vTarget.getChildAt(i).xText.hitArea = fCreateHitSize(vTarget.getChildAt(i).xText);
				break;
				
			case "pbKey_Cents":
				vTarget.getChildAt(i).xText.text = "￠";
				vTarget.getChildAt(i).xText.hitArea = fCreateHitSize(vTarget.getChildAt(i).xText);
				break;
				
			case "pbKey_Degree":
				vTarget.getChildAt(i).xText.text = "°";
				vTarget.getChildAt(i).xText.hitArea = fCreateHitSize(vTarget.getChildAt(i).xText);
				break;
				
			case "pbKey_NotEqual":
				vTarget.getChildAt(i).xText.text = "≠";
				vTarget.getChildAt(i).xText.hitArea = fCreateHitSize(vTarget.getChildAt(i).xText);
				break;
				
			case "pbKey_Colon":
				vTarget.getChildAt(i).xText.text = ":";
				vTarget.getChildAt(i).xText.hitArea = fCreateHitSize(vTarget.getChildAt(i).xText);
				break;
				
			case "pbKey_SemiColon":
				vTarget.getChildAt(i).xText.text = ";";
				vTarget.getChildAt(i).xText.hitArea = fCreateHitSize(vTarget.getChildAt(i).xText);
				break;		
				
			case "pbKey_Quote":
				vTarget.getChildAt(i).xText.text = '"';
				vTarget.getChildAt(i).xText.hitArea = fCreateHitSize(vTarget.getChildAt(i).xText);
				break;
				
			case "pbKey_OpenBrace":
				vTarget.getChildAt(i).xText.text = "{";
				vTarget.getChildAt(i).xText.hitArea = fCreateHitSize(vTarget.getChildAt(i).xText);
				break;
				
			case "pbKey_CloseBrace":
				vTarget.getChildAt(i).xText.text = "}";
				vTarget.getChildAt(i).xText.hitArea = fCreateHitSize(vTarget.getChildAt(i).xText);
				break;
				
			case "pbKey_Angle":
				vTarget.getChildAt(i).xText.text = "∠";
				vTarget.getChildAt(i).xText.hitArea = fCreateHitSize(vTarget.getChildAt(i).xText);
				break;
				
			case "pbKey_Perpendicular":
				vTarget.getChildAt(i).xText.text = "┴";
				vTarget.getChildAt(i).xText.hitArea = fCreateHitSize(vTarget.getChildAt(i).xText);
				break;
				
			case "pbKey_Parallel":
				vTarget.getChildAt(i).xText.text = "║";
				vTarget.getChildAt(i).xText.hitArea = fCreateHitSize(vTarget.getChildAt(i).xText);
				break;
				
			case "pbKey_UnderScore":
				vTarget.getChildAt(i).xText.text = "_";
				vTarget.getChildAt(i).xText.hitArea = fCreateHitSize(vTarget.getChildAt(i).xText);
				break;
				
			case "pbKey_QuestionMark":
				vTarget.getChildAt(i).xText.text = "?";
				vTarget.getChildAt(i).xText.hitArea = fCreateHitSize(vTarget.getChildAt(i).xText);
				break;
			
			case "pbKey_A":
			case "pbKey_B":
			case "pbKey_C":
			case "pbKey_D":
			case "pbKey_P":
			case "pbKey_Q":
			case "pbKey_R":
			case "pbKey_S":
			case "pbKey_F":
			case "pbKey_G":
			case "pbKey_H":
			case "pbKey_I":
			case "pbKey_U":
			case "pbKey_V":
			case "pbKey_W":
			case "pbKey_X":
			case "pbKey_K":
			case "pbKey_L":
			case "pbKey_M":
			case "pbKey_N":
			case "pbKey_Z":
			case "pbKey_E":
			case "pbKey_J":
			case "pbKey_O":
			case "pbKey_T":
			case "pbKey_Y":
				vTarget.getChildAt(i).xText.text = vTarget.getChildAt(i).suffix;
				vTarget.getChildAt(i).visible = false;
				break;
		}	
	}		
	if(mFullKB)	
		fSymbolSwitch();	
		
	function
	fCreateHitSize(
		v
	)
	{
		var vhitArea;
		vhitArea = new createjs.Shape(); 			
		vhitArea.graphics.beginFill("#000").drawRect(0, 0 , v.getBounds().width, v.getBounds().height);			
		return vhitArea;
	}
		
	function 
	fSymbolSwitch(
	)
	{
		var i;
	
		for (i = 0; i < mKeyList.length; i++)
			switch (mKeyList[i].name)
			{
				case "pbKey_q":	case "pbKey_w":	case "pbKey_e":	case "pbKey_r":	case "pbKey_t":
				case "pbKey_y":	case "pbKey_u":	case "pbKey_i":	case "pbKey_o":	case "pbKey_p":
				case "pbKey_a":	case "pbKey_s":	case "pbKey_d":	case "pbKey_f":	case "pbKey_g":
				case "pbKey_h":	case "pbKey_j":	case "pbKey_k":	case "pbKey_l":	case "pbKey_z":
				case "pbKey_x":	case "pbKey_c":	case "pbKey_v":	case "pbKey_b":	case "pbKey_n":
				case "pbKey_m":	case "pbKey_A":	case "pbKey_B":	case "pbKey_C":	case "pbKey_D":
				case "pbKey_P":	case "pbKey_Q":	case "pbKey_R":	case "pbKey_S":	case "pbKey_F":
				case "pbKey_G":	case "pbKey_H": case "pbKey_I":	case "pbKey_U":	case "pbKey_V":
				case "pbKey_W":	case "pbKey_X":	case "pbKey_K":	case "pbKey_L":	case "pbKey_M":
				case "pbKey_N":	case "pbKey_Z":	case "pbKey_E":	case "pbKey_J":	case "pbKey_O":
				case "pbKey_T":	case "pbKey_Y":						
				
				case "pbKey_1":	case "pbKey_2":	case "pbKey_3":	case "pbKey_4":	case "pbKey_5":
				case "pbKey_6":	case "pbKey_7":	case "pbKey_8":	case "pbKey_9":	case "pbKey_0":
					mKeyList[i].visible = !mSymbolState;
					break;
					
				case "pbKey_v1":				case "pbKey_CA":				case "pbKey_LL":
				case "pbKey_GA":				case "pbKey_Plus":				case "pbKey_Minus":
				case "pbKey_Multiply":			case "pbKey_Divide":			case "pbKey_Equal":	
				case "pbKey_BiggerThan":		case "pbKey_SmallThan":			case "pbKey_LeftBracket":
				case "pbKey_RightBracket":		case "pbKey_Tilde":				case "pbKey_Exclamation":		
				case "pbKey_At":				case "pbKey_NumberSign":		case "pbKey_Percentage":	
				case "pbKey_Carat":				case "pbKey_Ampersand":			case "pbKey_Asterisk":		
				case "pbKey_OpenParenthesis":	case "pbKey_CloseParenthesis":	case "pbKey_Bar":	
				case "pbKey_BackSlash":			case "pbKey_OpenBracket":		case "pbKey_CloseBracket":	
				case "pbKey_Dollar":			case "pbKey_Cents":				case "pbKey_Degree":	
				case "pbKey_NotEqual":			case "pbKey_Colon":				case "pbKey_SemiColon":		
				case "pbKey_Quote":				case "pbKey_OpenBrace":			case "pbKey_CloseBrace":	
				case "pbKey_Angle":				case "pbKey_Perpendicular":		case "pbKey_Parallel":		
				case "pbKey_UnderScore":		case "pbKey_QuestionMark":			
				mKeyList[i].visible = mSymbolState;
					break;
			}
			fCaseSwitch();
	}	
	
	function 
	fCaseSwitch(
	)
	{
		var i;
		if(!mSymbolState)
			for (i = 0; i < mKeyList.length; i++)
				switch (mKeyList[i].name)
				{
					case "pbKey_q":		case "pbKey_w":		case "pbKey_e":
					case "pbKey_r":		case "pbKey_t":		case "pbKey_y":
					case "pbKey_u":		case "pbKey_i":		case "pbKey_o":
					case "pbKey_p":		case "pbKey_a":		case "pbKey_s":
					case "pbKey_d":		case "pbKey_f":		case "pbKey_g":
					case "pbKey_h":		case "pbKey_j":		case "pbKey_k":
					case "pbKey_l":		case "pbKey_z":		case "pbKey_x":
					case "pbKey_c":		case "pbKey_v":		case "pbKey_b":
					case "pbKey_n":		case "pbKey_m":	
						mKeyList[i].visible = (mCapsState) ? false : true;
						break;
						
					case "pbKey_A":		case "pbKey_B":		case "pbKey_C":
					case "pbKey_D":		case "pbKey_P":		case "pbKey_Q":
					case "pbKey_R":		case "pbKey_S":		case "pbKey_F":
					case "pbKey_G":		case "pbKey_H":		case "pbKey_I":
					case "pbKey_U":		case "pbKey_V":		case "pbKey_W":
					case "pbKey_X":		case "pbKey_K":		case "pbKey_L":
					case "pbKey_M":		case "pbKey_N":		case "pbKey_Z":
					case "pbKey_E":		case "pbKey_J":		case "pbKey_O":
					case "pbKey_T":		case "pbKey_Y":				
						mKeyList[i].visible = mCapsState;
						break;
				}
	}

	//added to cater devices with both touch and physical inputs
	vTarget.fKeyClick = function(
		temp
	)
	{
		var vKeyEvent = {};
		var o;

		o = cArray.fFindTarget(temp.parent.IgnoreList, temp);
		
		if((mRKeyCode.hasOwnProperty(temp.suffix)) && (o == -1))
		{
			vKeyEvent.keyCode = mRKeyCode[temp.suffix];
			vKeyEvent.shiftKey = false;
			
			SYS.keyPressed(vKeyEvent);
			
			if (mShiftState)
				mShiftState = mCapsState = false; 
			fCaseSwitch(); 
		}			
		else if((mRKeyCode.hasOwnProperty("u" + temp.suffix)) && (o == -1) && (temp.suffix != ""))
		{
			vKeyEvent.keyCode = mRKeyCode["u" + temp.suffix];
			vKeyEvent.shiftKey = true;
			
			SYS.keyPressed(vKeyEvent);
			
			if (mShiftState)
				mShiftState = mCapsState = false; 
			fCaseSwitch(); 
		}
		else if ((temp.xText != undefined) && (o == -1))
		{
			if(mRKeyCode.hasOwnProperty(temp.xText.text))
			{
				vKeyEvent.keyCode = mRKeyCode[temp.xText.text];
				vKeyEvent.shiftKey = false;	

				SYS.keyPressed(vKeyEvent);
			}
		}
		else
		{
			//all other keys
			switch(temp.suffix)
			{
				case "Caps":
					if (!mSymbolState) 
					{
						mCapsState = !mCapsState;
						mShiftState = false;
						fCaseSwitch();
					}
					return;
					
				case "Symbol":
					mSymbolState = !mSymbolState; 
					mCapsState = mShiftState = false; 
					fSymbolSwitch(); 
					return;
					
				case "Shift":
					if (!mSymbolState) 
					{	
						mShiftState = !mShiftState;
						mCapsState = mShiftState;
						fCaseSwitch();
					} 
					return;	
					
				case "Close":
					mThisKeyBoard.visible = false;
					if(mFocusTarget != null)
					{
						if(mFocusTarget.Focus != undefined)
							mFocusTarget.Focus(false);
						mFocusTarget = null;
					}
					return;
					
				case "Spacebar":
					vKeyEvent.keyCode = mRKeyCode[" "];
					vKeyEvent.shiftKey = false;					
					break;
					
				case "Return":
					vKeyEvent.keyCode = mRKeyCode["\n"];
					vKeyEvent.shiftKey = false;
					break;
					
				case "Clr":
					vKeyEvent.keyCode = mRKeyCode["Clr"];
					vKeyEvent.shiftKey = false;
					break;
					
				case "Backspace":
					vKeyEvent.keyCode = mRKeyCode["backspace"];
					vKeyEvent.shiftKey = false;
					break;					
					
				default:
					return;
			}			
			SYS.keyPressed(vKeyEvent);
		}		
	}

	/*
	function 
	fKeyClick(
		event
	)
	{
console.log(event);

		var vKeyEvent = {};
		var o;
	
		o = cArray.fFindTarget(event.target.parent.IgnoreList, event.target);
		
		if((mRKeyCode.hasOwnProperty(event.target.suffix)) && (o == -1))
		{
			vKeyEvent.keyCode = mRKeyCode[event.target.suffix];
			vKeyEvent.shiftKey = false;
			
			SYS.keyPressed(vKeyEvent);
			
			if (mShiftState)
				mShiftState = mCapsState = false; 
			fCaseSwitch(); 
		}			
		else if((mRKeyCode.hasOwnProperty("u" + event.target.suffix)) && (o == -1) && (event.target.suffix != ""))
		{
			vKeyEvent.keyCode = mRKeyCode["u" + event.target.suffix];
			vKeyEvent.shiftKey = true;
			
			SYS.keyPressed(vKeyEvent);
			
			if (mShiftState)
				mShiftState = mCapsState = false; 
			fCaseSwitch(); 
		}
		else if ((event.target.xText != undefined) && (o == -1))
		{
			if(mRKeyCode.hasOwnProperty(event.target.xText.text))
			{
				vKeyEvent.keyCode = mRKeyCode[event.target.xText.text];
				vKeyEvent.shiftKey = false;	

				SYS.keyPressed(vKeyEvent);
			}
		}
		else
		{
			//all other keys
			switch(event.target.suffix)
			{
				case "Caps":
					if (!mSymbolState) 
					{
						mCapsState = !mCapsState;
						mShiftState = false;
						fCaseSwitch();
					}
					return;
					
				case "Symbol":
					mSymbolState = !mSymbolState; 
					mCapsState = mShiftState = false; 
					fSymbolSwitch(); 
					return;
					
				case "Shift":
					if (!mSymbolState) 
					{	
						mShiftState = !mShiftState;
						mCapsState = mShiftState;
						fCaseSwitch();
					} 
					return;	
					
				case "Close":
					mThisKeyBoard.visible = false;
					if(mFocusTarget != null)
					{
						if(mFocusTarget.Focus != undefined)
							mFocusTarget.Focus(false);
						mFocusTarget = null;
					}
					return;
					
				case "Spacebar":
					vKeyEvent.keyCode = mRKeyCode[" "];
					vKeyEvent.shiftKey = false;					
					break;
					
				case "Return":
					vKeyEvent.keyCode = mRKeyCode["\n"];
					vKeyEvent.shiftKey = false;
					break;
					
				case "Clr":
					vKeyEvent.keyCode = mRKeyCode["Clr"];
					vKeyEvent.shiftKey = false;
					break;
					
				case "Backspace":
					vKeyEvent.keyCode = mRKeyCode["backspace"];
					vKeyEvent.shiftKey = false;
					break;					
					
				default:
					return;
			}			
			SYS.keyPressed(vKeyEvent);
		}		
	}
	*/

	function 
	fPrepKeyCode(
	)
	{
		mRKeyCode = {};
	
		for (var vKeyCode in KEYMAP.KeyCodeDefault)		
			mRKeyCode[vKeyCode] = KEYMAP.KeyCodeDefault[vKeyCode];
	
		for (var vKeyCode in KEYMAP.KeyCodeNum)						
			mRKeyCode[vKeyCode] = KEYMAP.KeyCodeNum[vKeyCode];
			
		for (var vKeyCode in KEYMAP.KeyCodeAlp)						 
			mRKeyCode[vKeyCode] = KEYMAP.KeyCodeAlp[vKeyCode]; 
						
		for (var vKeyCode in KEYMAP.KeyAlpCommon)						 
			mRKeyCode[vKeyCode] = KEYMAP.KeyAlpCommon[vKeyCode];
			
		for (var vKeyCode in KEYMAP.KeyCodeCap)						 
			mRKeyCode[vKeyCode] = KEYMAP.KeyCodeCap[vKeyCode]; 
			
		for (var vKeyCode in KEYMAP.KeyCodeSym)						 
			mRKeyCode[vKeyCode] = KEYMAP.KeyCodeSym[vKeyCode]; 
			
		mRKeyCode = fswap(mRKeyCode);
	}
	
	function 
	fMoveThis(
		event
	)
	{
		mThisKeyBoard.x = stage.globalToLocal(event.stageX, event.stageY).x - mOffSetx;
		mThisKeyBoard.y = stage.globalToLocal(event.stageX, event.stageY).y - mOffSety;
	}
	
	function 
	fSetOffSet(
		event
	)
	{
		mOffSetx = stage.globalToLocal(event.stageX, event.stageY).x - mThisKeyBoard.x;
		mOffSety = stage.globalToLocal(event.stageX, event.stageY).y - mThisKeyBoard.y;
	}
	
	function 
	fswap(
		vObject
	)
	{
		var ret = {};
		for(var key in vObject)
			ret[vObject[key]] = key;
		
		return ret;
	}
}

