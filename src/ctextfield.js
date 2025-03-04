//-------------------------------------------------------------------------------------------------
// As text does not have a boundry, user must click on the text itself, not within the area.
// also, when all text is deleted or start with blank field, there's no click spot at all.
// to Resolve, draw a box over the textfield,
// use the dummy to detect the focus click instead.
//
//default all tf type are not input, 
//use SetInput to set it to input, not IsInput.	
//IsInput return if tf is an input or not	
//MaxChar 0 = infinite, set to limit number of char	
//MaxLine default 1 line, change to allow more number of new lines	
//use SetInputRange to change the input keys allowed, default ["num", "alp", "cap", "sym"]
//textalign will affect the x position, alightright will set the x to end of the field
//
//20160226 Add:
//Add new var "ShowKeyboard" to define which keyboard to be shown default qwerty
//"qwerty", "num", "compare" , "math" and "null"
//
//20160421
//SetInput accepts 1 more var, vUseCustomBorder
//	true : use custom border that's created at Main.js - fTextBorderStyle()
//	false : use default border
//	null/empty : no border
//
//vTarget.BGcolor give's dummytext a bg color for the field to be more prompting, rgba MaxChar 255
//
//If Language is set != "English", the Element Input will not be hidden, mainly for platform input
//-------------------------------------------------------------------------------------------------

function cTextField(vTarget) 
{		
	var mHitZone = null;	
	var mParent = vTarget.parent;
	var mKeyCode;		
	var mBorder = null;	
	
	var mCaret = null;
	var mCursorCaret = -1;
	
	vTarget.Language = "English";
	vTarget.IsInput = false;
	vTarget.ShowFocusBorder = true;
	vTarget.MaxChar = 0;
	vTarget.MaxLine = 1;
	vTarget.InputRange = ["num", "alp", "cap", "sym"]; // default all 4 types
	vTarget.ShowKeyboard = "qwerty";
	vTarget.BGcolor = "rgba(0, 0, 0, 0.01)";	
	vTarget.IsFocus = false;
	
	if(parseInt((vTarget.font).match(/\d+/g))>0)
	{
		vOffset = parseInt((vTarget.font).match(/\d+/g))/3;
		vTarget.y = vTarget.y+vOffset;
	}

	vTarget.xSelectable = true;
	
	vTarget.addEventListener("removed", fRemoved); 				
			
	vTarget.fEnable = function(vData)
	{			
		if(mHitZone != null)
			mHitZone.mouseEnabled = vData;
			
		this.xSelectable = vData;
		this.mouseEnabled = vData;
		this.Enabled = vData; 
		this.fRender();
	};	
			
	//--------------------------------------		
	vTarget.SetInputRange = function(vData){
		this.InputRange = vData;
		UpdateKeyCode();
	};	
	
	//--------------------------------------
	vTarget.SetInput = function(vData, vUseCustomBorder){	
		var i;
		var o = "";
		var p;
		var mPoint = {};
		var shape;
		
		if(mHitZone != null)
		{
			this.parent.removeChild(mHitZone);
			this.parent.removeChild(mBorder);
			this.parent.removeChild(mCaret);
		}

		if(vData)
		{
			var Border;
			// create border
			// true: use custom border created at Main.js
			// false: use default border design
			// null/empty: no border design
			if(vUseCustomBorder == true)			
				Border = MAIN.fTextBorderStyle();			
			else if(vUseCustomBorder == false)
			{
				Border = new createjs.Shape();
				Border.graphics.beginStroke("#000");
				Border.graphics.setStrokeDash([10, 10], 0);
			}			
			else
				Border = new createjs.Shape();
			
			mPoint.width = 10;
			mPoint.height = 10;

			if(vTarget.getBounds())
			{
				mPoint.width = vTarget.getBounds().width;
				mPoint.height = vTarget.getBounds().height;
				
				//check if have line width and if it's bigger than bound
				if(vTarget.lineWidth)
					if(vTarget.lineWidth > mPoint.width)
						mPoint.width = vTarget.lineWidth;
			}
			else if(vTarget.lineWidth)
			{
				mPoint.width = vTarget.lineWidth;
				mPoint.height = vTarget.lineHeight;
			}				
						
			//Set bound to textfield(base on above possible width height)
			if(vTarget.textAlign == "right")
				vTarget.bottomRight = new createjs.Point(0, 0);
			else if(vTarget.textAlign == "center")	
				vTarget.bottomRight = new createjs.Point(mPoint.width / 2, mPoint.height / 2);
			else
				vTarget.bottomRight = new createjs.Point(mPoint.width, mPoint.height);			
			
			Border.graphics.drawRect(0, 0, mPoint.width , mPoint.height + 2);
						
			p = vTarget.rotation;
			vTarget.rotation = 0;			
			
			if(vTarget.textAlign == "right")								
				Border.regX = mPoint.width;
			else if(vTarget.textAlign == "center")			
				Border.regX = (mPoint.width / 2);

			Border.x = vTarget.x;				
			Border.y = vTarget.y;	

			Border.rotation = p;			
			Border.visible = false;
			
			mBorder = Border;
			
			mBorder.scaleX = vTarget.scaleX;
			mBorder.scaleY = vTarget.scaleY;
			
			i = this.parent.getChildIndex(this);
			this.parent.addChildAt(mBorder, i);
			this.parent.swapChildren(this, mBorder);			
							
			//create blinking caret, 2 shapes required, 1 for the exact shape and Reg point of the textfield
			//another for the caret, add listener to listen on tick
			mCaret = new createjs.MovieClip();
			
			shape = new createjs.Shape();			
			shape.graphics.beginFill("rgba(0, 0, 0, 0)");
			shape.graphics.drawRect(0, 0, mPoint.width , mPoint.height + 2);
			
			mCaret.setBounds(0, 0, mPoint.width , mPoint.height + 2);			
			mCaret.addChild(shape);
			
			var caret = new createjs.Shape();	
			caret.graphics.beginStroke("#000");			
			caret.graphics.moveTo(0, 0);
			caret.graphics.lineTo(0, mPoint.height / vTarget.getMetrics().lines.length);			 			
			
			if(vTarget.textAlign == "right")								
				mCaret.regX = mPoint.width;
			else if(vTarget.textAlign == "center")			
				mCaret.regX = (mPoint.width / 2);
			
			mCaret.x = vTarget.x;				
			mCaret.y = vTarget.y;
			
			mCaret.rotation = p;
			
			mCaret.scaleX = vTarget.scaleX;
			mCaret.scaleY = vTarget.scaleY;
			
			mCaret.caret = caret;
			mCaret.addChild(caret);
			mCaret.visible = false;
			
			i = this.parent.getChildIndex(this);		
			
			this.parent.addChildAt(mCaret, i);
			this.parent.swapChildren(this, mCaret);	
			
			mCaret.delayme = 0;
			mCaret.addEventListener("tick", fBlink);
			
			//create dummy text for click spot, also use for bg coloring
			shape = new createjs.Shape();			
			shape.graphics.beginFill(vTarget.BGcolor);
			shape.graphics.drawRect(0, 0, mPoint.width, mPoint.height + 2);				
			
			if(vTarget.textAlign == "right")								
				shape.regX = mPoint.width;
			else if(vTarget.textAlign == "center")			
				shape.regX = (mPoint.width / 2);
			
			shape.x = vTarget.x;	
			shape.y = vTarget.y;	

			shape.rotation = p;
			vTarget.rotation = p;
			
			shape.setBounds(0, 0, mPoint.width, mPoint.height + 2);
			
			shape.scaleX = vTarget.scaleX;
			shape.scaleY = vTarget.scaleY;
			
			mHitZone = shape;
			
			cDummyText(mHitZone, vTarget);
			mHitZone.cursor = "text";		
			
			//add dummy text over the real text on parent
			i = this.parent.getChildIndex(this);			
			this.parent.addChildAt(mHitZone, i);
			this.parent.swapChildren(mHitZone, mBorder);
			this.parent.swapChildren(this, mBorder);
		}		
		this.IsInput = vData;
		fUpdateTextArea();
	};	
	
	vTarget.fKeyed = function(event){
		var i, j, k;
		var o, p, q;
		var vData = event.keyCode;

		var vUseText;
		vUseText = ["", ""];
		
		if(this.IsInput)
		{		
			if(event.shiftKey)
				vData = "u" + vData;
			
			//caret affecting text	
			if(this.text == "")
				mCursorCaret = -1;
				
			if(mCursorCaret == -1)
			{
				vUseText[0] = "";
				vUseText[1] = this.text;
			}
			else
			{
				//-------------------------------------------------------------
				// need calculate how many \n affecting mCursorCaret substring
				//-------------------------------------------------------------
				o = String(this.text).substring(0, mCursorCaret + 1);
				
				p = this.getMetrics();	
				q = 0;
				
				for(i = 0 ; i < p.lines.length; i++)
				{
					q += String(p.lines[i]).length;	
					
					if(q > o.length)
						break;
				}
				i = i;				
				
				vUseText[0] = String(this.text).substring(0, mCursorCaret + (1 + i)); 
				vUseText[1] = String(this.text).substring(mCursorCaret + (1+ i)); 				
			}

			if(mKeyCode.hasOwnProperty(vData))
			{
				switch(mKeyCode[vData])
				{
					case "backspace":						
						if(String(this.text).length > 0)	
						{							
							vUseText[0] = String(vUseText[0]).slice(0, String(vUseText[0]).length - 1);	
							this.text = vUseText.join("");
							
							if(mCursorCaret > -1)
								mCursorCaret -= 1;
						}							
						try{
							event.preventDefault();
						}
						catch(err) {}
						break;
						
					case "delete":						
						if(String(this.text).length > 0)	
						{				
							if(vUseText[1].length > 0)
							{
								vUseText[1] = String(vUseText[1]).slice(1);	
								this.text = vUseText.join("");
							}
						}							
						break;
						
					case "enter":
						if (this.getMetrics().lines.length < this.MaxLine)
						{
							vUseText[0] = vUseText[0] + "\n";
							this.text = vUseText.join("");
							mCursorCaret += 1;
						}
						break;						
						
					case "\n":
						if (this.getMetrics().lines.length < this.MaxLine)
						{
							vUseText[0] = vUseText[0] + mKeyCode[vData];
							this.text = vUseText.join(""); 
							mCursorCaret += 1;
						}
						break;
						
					case "Clr":
						this.text = "";
						mCursorCaret = -1;
						break;
						
					default:						
						if((this.InputRange[0] == "sym") && (this.MaxChar == 1))
						{	//replace if is symbol and only 1 maxchar
							this.text = mKeyCode[vData];
							mCursorCaret = 0;
						}
						else if ((this.getMetrics().lines.length <= this.MaxLine) && ((String(this.text).length < this.MaxChar) || (this.MaxChar == 0)))
						{
							o = vUseText[0];
							vUseText[0] = vUseText[0] + mKeyCode[vData];
							this.text = vUseText.join("");
							mCursorCaret += 1;	
							
							//prevent char after space from dropping to next line,
							//remove the last input from the text
							if (this.getMetrics().lines.length > this.MaxLine)
							{
								vUseText[0] = o; 
								this.text = vUseText.join("");
								mCursorCaret -= 1;
							}
						}
						break;
				}				
				fUpdateTextArea();					
				fUpdateCaretPos();
			}			
		}			
	};	
	
	UpdateKeyCode();	//do update after the declare of the keycode var
	
	//.text does not convert data to string, use fText instead
	vTarget.fText = function(vData)
	{		
		vTarget.text = String(vData);
		mCursorCaret = String(vTarget.text).length - 1;
		fUpdateCaretPos();
		
		return String(vTarget.text);
	}
	
	vTarget.Focus = function(vBool)
	{
		if(!this.ShowFocusBorder)
		{
			mBorder.visible = false;
			vTarget.IsFocus = false;
		}
		else if(mBorder)
		{
			mBorder.visible = vBool;			
			vTarget.IsFocus = vBool;
		}
			
		if(vBool == true)
		{
			//know where caret position --------------------------------------------	
			var i, j, k, t;
			var o, p, q;
			var vOrgText = this.text;	
			var vSplitAll;
			var vClone, vClone2;
			var vCalculate1, vCalculate2;			
			var vHalfCharWidth;
			
			p = this.globalToLocal(SYS.pMousePos().x, SYS.pMousePos().y);		
			o = this.getMetrics();				
			q = Math.floor(p.y / o.lineHeight);
			
			vClone = this.clone();
			vClone2 = this.clone();

			if(o.lines[q] != undefined)
			{
				vClone2.text = o.lines[q];
				
				vSplitAll = o.lines[q].split("");
				
				j = this.text.length - 1; //default end of text
				
				vClone.textAlign = "left";					
				vClone.text = "";
				
				for(i = 0 ; i < vSplitAll.length ; i++)
				{					
					if(vClone.getBounds() == null)
						vHalfCharWidth = 0;
					else
						vHalfCharWidth = vClone.getBounds().width;						
						
					vClone.text += vSplitAll[i];
					
					vHalfCharWidth = (vClone.getBounds().width - vHalfCharWidth) / 1.5;
							
					if(vTarget.textAlign == "right")
					{
						vCalculate1 = vClone.getBounds().width;
						vCalculate2 = p.x + vClone2.getBounds().width;																		
					}
					else if(vTarget.textAlign == "center")
					{
						vCalculate1 = vClone.getBounds().width;
						vCalculate2 = p.x + (vClone2.getBounds().width / 2);												
					}
					else
					{
						vCalculate1 = vClone.getBounds().width;
						vCalculate2 = p.x;				
					}

					if(vCalculate2 < 0) //if calculated still negative value, it's at front
						j = -1;					
					else if(vCalculate1 > vCalculate2)
					{
						j = i;
						t = 0; //calculate each new line what is the char length 
						for(k = 0 ; k < o.lines.length; k++)
							if(k < q)
								t += o.lines[k].split("").length;
								
						j = j + t; //add to Form the caret position	
						
						if((vCalculate1 - vHalfCharWidth) > vCalculate2) //check char half size, if caret should be before or after
							j = j - 1;
						break;
					}					
				}			
				mCursorCaret = j;
			}
			else
			{
				mCursorCaret = this.text.length - 1;
			}
		}	
		
		fUpdateCaretPos();
	};
	
	//returns the border so that parent can swap the index
	vTarget.fBorder = function()
	{
		return mBorder;
	}
	
	//----------------------------------------------------------------------------------------------------
	//	property pSelectable; whether text is selectable.
	//----------------------------------------------------------------------------------------------------
	vTarget.pSelectable = function(
		v //Boolean
	)
	{
		if ((v != null) && (v != undefined))
		{
			vTarget.xSelectable = v;			
			
			//made not selectable but still must give size
			if(v == false)
			{
				var mPoint;
				mPoint = {};
				
				mPoint.width = 10;
				mPoint.height = 10;
				if(vTarget.getBounds())
				{
					mPoint.width = vTarget.getBounds().width;
					mPoint.height = vTarget.getBounds().height;
				}
				else if(vTarget.lineWidth)
				{
					mPoint.width = vTarget.lineWidth;
					mPoint.height = vTarget.lineHeight;
				}		
				//Set bound to textfield(base on above possible width height)
				if(vTarget.textAlign == "right")
					vTarget.bottomRight = new createjs.Point(0, 0);
				else if(vTarget.textAlign == "center")	
					vTarget.bottomRight = new createjs.Point(mPoint.width / 2, mPoint.height / 2);
				else
					vTarget.bottomRight = new createjs.Point(mPoint.width, mPoint.height);	
			}
		}
		else
			return vTarget.xSelectable;
	}
	
	function 
	UpdateKeyCode(
	)
	{
		mKeyCode = {};
		
		for (var vKeyCode in KEYMAP.KeyCodeDefault)		
			mKeyCode[vKeyCode] = KEYMAP.KeyCodeDefault[vKeyCode];

		for(i = 0 ; i < vTarget.InputRange.length ; i++)
		{
			switch(vTarget.InputRange[i])
			{
				case "num":
					for (var vKeyCode in KEYMAP.KeyCodeNum)	
						mKeyCode[vKeyCode] = KEYMAP.KeyCodeNum[vKeyCode]; 					
					break;
					
				case "alp":
					for (var vKeyCode in KEYMAP.KeyCodeAlp)						 
						mKeyCode[vKeyCode] = KEYMAP.KeyCodeAlp[vKeyCode]; 
						
					for (var vKeyCode in KEYMAP.KeyAlpCommon)						 
						mKeyCode[vKeyCode] = KEYMAP.KeyAlpCommon[vKeyCode]; 
					break;
					
				case "cap":
					for (var vKeyCode in KEYMAP.KeyCodeCap)						 
						mKeyCode[vKeyCode] = KEYMAP.KeyCodeCap[vKeyCode]; 
						
					for (var vKeyCode in KEYMAP.KeyAlpCommon)						 
						mKeyCode[vKeyCode] = KEYMAP.KeyAlpCommon[vKeyCode]; 
					break;
					
				case "sym":
					for (var vKeyCode in KEYMAP.KeyCodeSym)						 
						mKeyCode[vKeyCode] = KEYMAP.KeyCodeSym[vKeyCode]; 
					break;
			}
		}
	};	
	
	//as border, dummy and caret are created and add to parent,
	//a listener is use to detect if textfield is removed, so all related items 
	//to be deleted together
	function 
	fRemoved(
		event
	) 
	{ 	
		if(mHitZone != null)
		{
			mParent.removeChild(mHitZone);
			mParent.removeChild(mBorder);
			mParent.removeChild(mCaret);
			mHitZone = null;
			mBorder = null;
			mCaret = null;
		}
	}; 
	
	function 
	fBlink(
		event
	)
	{
		if(vTarget.IsFocus == true)
		{
			mCaret.delayme++;			
			
			//controling the blinking speed
			if((mCaret.delayme % 10) >= 6)
			{				
				mCaret.delayme = 0;
				mCaret.visible = !mCaret.visible;			
			}
		}
		else		
			mCaret.visible = false;		
	};
	
	function
	fUpdateTextArea(
	)
	{
		var o, p;
		
		//if text is empty, no bound, set text " " than resize hit and border 
		// follow by set the text back to "" empty
		p = false;
		if(vTarget.getBounds() == null)
		{
			vTarget.text = " ";
			p = true;
		}
					
		o = mHitZone.scaleX;
		if(vTarget.getBounds().height != mHitZone.getBounds().height)					
			o = (vTarget.getBounds().height + (vTarget.getMetrics().lines.length * 0.15)) / mHitZone.getBounds().height;
			
		mHitZone.scaleY = mBorder.scaleY = o;		
			
		if(p)
			vTarget.text = "";			
	}
	
	function
	fUpdateCaretPos(
	)
	{
		var i, j, k;
		var o, p, q;
		var vKey;
		var vPoint = {};
		
		var vSplitAll;
		var vClone, vClone2;
		var vCalculate1, vCalculate2;
		var vCharSoFar;
		var vLine;
		var vCaretCharWidth;	
	
		//calculate the caret position		
		if(vTarget.IsFocus == true)
		{
			vPoint.width = mCaret.getBounds().width;
			vPoint.height = mCaret.getBounds().height;	
			
			if(vTarget.text == "")
			{			
				if(vTarget.textAlign == "right")					
					mCaret.caret.x = vPoint.width;					
				else if(vTarget.textAlign == "center")					
					mCaret.caret.x = (vPoint.width / 2);					
				else					
					mCaret.caret.x = 0;						
				
				mCaret.caret.y = 0;
			}
			else
			{
				vLine = 0;
				o = vTarget.getMetrics();
				j = 0;
				
				for(i = 0 ; i < o.lines.length ; i++)
				{
					j += o.lines[i].length;					
					
					if(j > mCursorCaret)
					{
						vCharSoFar = j - o.lines[i].length;
						break;
					}
				}
								
				if(i == o.lines.length)
					vLine = o.lines.length - 1;
				else
					vLine = i;
					
				vClone = vTarget.clone();
				vClone2 = vTarget.clone();
				vClone2.text = o.lines[vLine];
				
				vSplitAll = o.lines[vLine].split("");									
								
				vClone.text = "";
            
				for(i = 0 ; i < vSplitAll.length ; i++)
				{
					vClone.text += vSplitAll[i];
					
					if((vCharSoFar + i) == mCursorCaret)
						vCaretCharWidth = vClone.getBounds().width;
				}
				//it's undefined, set to max width of line
				if(vCharSoFar == undefined)
				{
					if(vClone.getBounds() != null)
						vCaretCharWidth = vClone.getBounds().width;	
					else
						vCaretCharWidth = 0;
				}
				
				if(vTarget.textAlign == "right")
				{
					mCaret.caret.x = mCaret.getBounds().width;
					mCaret.caret.x -= vClone2.getBounds().width;
					if(mCursorCaret != -1)
						mCaret.caret.x += vCaretCharWidth;						
				}
				else if(vTarget.textAlign == "center")
				{
					mCaret.caret.x = mCaret.getBounds().width / 2;
					mCaret.caret.x -= vClone2.getBounds().width / 2;
					if(mCursorCaret != -1)
						mCaret.caret.x += vCaretCharWidth;						
				}
				else
					mCaret.caret.x = vCaretCharWidth;
					
				mCaret.caret.y = (o.lineHeight * vLine);
			}			
		}
	};
}		

function 
cDummyText(
	vFake,
	vReal
)
{
	cBase(vFake, "DummyText");	
	vFake.RealText = vReal;
}; 



 
 
 
 
 
 
 
 
 
