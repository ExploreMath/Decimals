//-------------------------------------------------------------------------------------------------
//cClickableText
//Set the text to become ClickableText. As htmltext not supported using other ways to archive the
// effect. 
//Method: break whole string into characters, clone the orginal textfield and replace
// with the single character and do the text layout same as the orginal. since all character are  
// break apart, it's now able to apply color hence it allows coloring part of sentence or
// single words. 
//
//As breaking of string is done at the init of this class, if the delimiter type is string it has 
// to be applied at the init parameter. since string type delimiter will remove the delimiter 
// from the whole string.
//
//vDelimiter : the delimiter to use break the sentence into parts 
//
// vLineSpacing : increase the line spacing between each new line
//
//Note, the pSegmentN for CT is not a function, only the pSegmentN for clone is function base
//-------------------------------------------------------------------------------------------------
function 
cClickableText(
	vTarget,			//the target textfield
	vLineSpacing,		//add line spacing between lines
	vDelimiter,			//delimiter, a must for string type
	vOverColor,			//over color, default red
	vDownColor			//down color, default blue
)
{
	var i, j, k;
	var o, p, q, s;
	
	var mParent = vTarget.parent;	
	var vClone;
	var vJoinText;
	var vSpace;
	
	var vArray;
	var vSegPart;	
	var vhitArea;
	var vProcessDelimiter;
	
	vTarget.visible = true;	
	vTarget.mClickableParam = {};
	
	vTarget.mClickableParam.vTextList = [];
	vTarget.mClickableParam.vSegmentPart = null; //Get the Segment part 		
	vTarget.mClickableParam.xSegmentList = [[0, fReplaceAll(vTarget.text, "\n" , "").length]];
	vTarget.pSegmentN = -1;
	
	if ((vLineSpacing == null) || (vLineSpacing == undefined))
		vLineSpacing = 0;
	
	vTarget.mClickableParam.mDefaultColor = (vTarget.color == undefined ? "#000000" : vTarget.color);
	vTarget.mClickableParam.mOverColor = (vOverColor == undefined ? "#FF0000" : vOverColor);
	vTarget.mClickableParam.mDownColor = (vDownColor == undefined ? "#0000FF" : vDownColor);
	vTarget.mClickableParam.vHolder;	
	
	vTarget.addEventListener("removed", fRemovedCT); 
		
	if(vDelimiter != undefined)	
		vProcessDelimiter = fProcessDelimiter(vTarget, vDelimiter);	
		
	//-------------------------------------------------
	// suppose to return color of index range 
	// return Original Color?
	//-------------------------------------------------	
	vTarget.fGetTextColor = function()
	{		
		return vTarget.mClickableParam.mDefaultColor;
	};		
		
	//-------------------------------------------------
	// Get/Set over color
	//-------------------------------------------------
	vTarget.pOverColor = function(vData)
	{		
		if ((vData == null) || (vData == undefined))
			return vTarget.mClickableParam.mOverColor;
		else					
			vTarget.mClickableParam.mOverColor = vData;	
	};		
		
	//-------------------------------------------------
	// Get/Set over color
	//-------------------------------------------------
	vTarget.pDownColor = function(vData)
	{		
		if ((vData == null) || (vData == undefined))
			return vTarget.mClickableParam.mDownColor;
		else					
			vTarget.mClickableParam.mDownColor = vData;	
	};
	
	//-------------------------------------------------
	// Get/Set SegmentList
	//-------------------------------------------------
	vTarget.pSegmentList = function(vData)
	{		
		var i, j;
		
		if ((vData == null) || (vData == undefined))
			return vTarget.mClickableParam.xSegmentList;
		else
		{			
			if(Array.isArray(vData) == true)	
				vTarget.mClickableParam.xSegmentList = vData;				
			else
				vTarget.mClickableParam.xSegmentList = fProcessDelimiter(vTarget, vData);			
								
			for(i = 0 ; i < vTarget.mClickableParam.vTextList.length ; i++)
			{
				vTarget.mClickableParam.vTextList[i].fEnable(false);
			
				for(j = 0 ; j < vTarget.mClickableParam.xSegmentList.length ; j++)					
					if ((i >= vTarget.mClickableParam.xSegmentList[j][0]) && (i <= vTarget.mClickableParam.xSegmentList[j][1]))						
						vTarget.mClickableParam.vTextList[i].fEnable(true);	
			}
		}
	};		
		
	if(mParent)
	{			
		var vBound;
		vTarget.mClickableParam.vHolder = new createjs.MovieClip();
	
		o = vTarget.getMetrics();

		for(i = 0 ; i < o.lines.length; i++)
		{
			q = [];
			p = String(o.lines[i]).split("");	

			for(j = 0 ; j < p.length ; j++)
			{
				vClone = vTarget.clone();
								
				vSpace = 0; //break by char, no space is needed
								
				vClone.text = p[j];					
				
				q.push(vClone);			
				vTarget.mClickableParam.vTextList.push(vClone);
				
				if(j != 0)
					if(q[j - 1].getBounds() != null)
						vClone.x = q[j - 1].x + q[j - 1].getBounds().width + vSpace;					
					else					
						vClone.x = q[j - 1].x + vSpace;					
					
				vClone.y += (i * o.lineHeight) + (i == 0 ? 0 : i * vLineSpacing);
			
				cBase(vClone, "ClickableText_" + i + "_" + j);

				//add a hitArea for text, else have to hit on the text itself
				vhitArea = new createjs.Shape(); 			
				
				if(vClone.getBounds() != null)
					vBound = vClone.getBounds();
				else
					vBound = {width:0, height:0};				
				
				vhitArea.graphics.beginFill("#000").drawRect(0, 0 , vBound.width, vBound.height);
				vClone.hitArea = vhitArea;
				
				vClone.cursor = "pointer";
				
				vClone.mParentTarget = vTarget;
				
				//----------------------------------------------------------------------------------------------------
				//	
				//----------------------------------------------------------------------------------------------------
				vClone.pSegmentN = function()
				{
					var i, j, k;		
					
					for(i = 0 ; i < vTarget.mClickableParam.vTextList.length ; i++)
					{
						if(this == vTarget.mClickableParam.vTextList[i])
							break;
					}
					for(j = 0 ; j < vTarget.mClickableParam.xSegmentList.length ; j++)					
						if ((i >= vTarget.mClickableParam.xSegmentList[j][0]) && (i <= vTarget.mClickableParam.xSegmentList[j][1]))						
							return j;						
							
					return -1;
				};
				
				//----------------------------------------------------------------------------------------------------
				//	
				//----------------------------------------------------------------------------------------------------
				vClone.pSegmentText = function()
				{
					var i, j, k;
					var o, p, q;
					vJoinText = [];
								
					o = this.fGetSegment();
					for(i = 0 ; i < o.length ; i++)					
						vJoinText.push(o[i].text);							
					
					if(vJoinText.length > 0)
						return vJoinText.join("");
							
					return null;		
				};
				
				//----------------------------------------------------------------------------------------------------
				//	get index of clone
				//----------------------------------------------------------------------------------------------------
				vClone.fGetSegment = function() 
				{
					var i, j, k;
					var o, p, q;
					
					i = this.pSegmentN();
					vTarget.pSegmentN = i;
					
					o = [];
					for(j = 0 ; j < vTarget.mClickableParam.vTextList.length ; j++)
						if ((j >= vTarget.mClickableParam.xSegmentList[i][0]) && (j <= vTarget.mClickableParam.xSegmentList[i][1]))
							o.push(vTarget.mClickableParam.vTextList[j]);					
							
					return o;
				};
				
				//-------------------------------------------------
				// Render
				//-------------------------------------------------
				vClone.fRender = function(vData) 
				{
					if(vTarget.mClickableParam.vHolder.mouseEnabled == false)
						return;					
			
					//self render					
					switch(vData)
					{
						case "rollover":
							this.vTargetTextGroup = this.fGetSegment();
							
							if(this.vTargetTextGroup)		
							{
								for(i = 0 ; i < this.vTargetTextGroup.length ; i++)
									this.vTargetTextGroup[i].color = vTarget.mClickableParam.mOverColor;
							}
							else							
								this.color = "#550";							
							break;
							
						case "rollout":
							if(this.vTargetTextGroup)
							{
								for(i = 0 ; i < this.vTargetTextGroup.length ; i++)
									this.vTargetTextGroup[i].color = vTarget.mClickableParam.mDefaultColor;
								this.vTargetTextGroup = null;	
							}
							else
								this.color = vTarget.mClickableParam.mDefaultColor;
							break;
							
						case "mousedown":
							//get the Segment group at mousedown too, incase over was not fired 
							// due to no over when changing Enabled or on device
							this.vTargetTextGroup = this.fGetSegment();
							
							if(this.vTargetTextGroup)
							{
								for(i = 0 ; i < this.vTargetTextGroup.length ; i++)
									this.vTargetTextGroup[i].color = vTarget.mClickableParam.mDownColor;
							}
							else
								this.color = vTarget.mClickableParam.mDownColor;
							break;
							
						case "mouseup":
							if(this.vTargetTextGroup)
							{
								for(i = 0 ; i < this.vTargetTextGroup.length ; i++)
									if(this.vTargetTextGroup[i].color != vTarget.mClickableParam.mDefaultColor)
										this.vTargetTextGroup[i].color = vTarget.mClickableParam.mOverColor;
							}
							else
								if(this.color != vTarget.mClickableParam.mDefaultColor)
									this.color = vTarget.mClickableParam.mOverColor;
							break;	
					}						
				};					
				vTarget.mClickableParam.vHolder.addChild(vClone);
			}
		}
		
		if(vDelimiter != undefined)
			vTarget.pSegmentList(vProcessDelimiter);			
		
		//replace and swap with vTarget, so that ClickableText text is at same layer of vTarget
		i = mParent.getChildIndex(vTarget);
		mParent.addChildAt(vTarget.mClickableParam.vHolder, i);
		mParent.swapChildren(vTarget, vTarget.mClickableParam.vHolder);
			
		vTarget.visible = false;
	}	
	
	//--------------------------------------------
	// override Enabled of parent to affect child
	//--------------------------------------------
	vTarget.fEnable = function(vData)
	{				
		this.mClickableParam.vHolder.mouseEnabled = vData;	
		
		if(vData == false)
		{
			for(i = 0 ; i < vTarget.mClickableParam.vTextList.length ; i++)
				vTarget.mClickableParam.vTextList[i].color = vTarget.mClickableParam.mDefaultColor;						
		}
		
		this.mouseEnabled = vData;
		this.Enabled = vData; 
	};
	
	//--------------------------------------------
	// Set the color of the vSeg
	//--------------------------------------------
	vTarget.fSetSegmentColor = function(vSeg, vColor)
	{	
		var i, j, k;
		var o, p, q;
		
		o = [];
		for(j = 0 ; j < vTarget.mClickableParam.vTextList.length ; j++)
			if ((j >= vTarget.mClickableParam.xSegmentList[vSeg][0]) && (j <= vTarget.mClickableParam.xSegmentList[vSeg][1]))
				o.push(vTarget.mClickableParam.vTextList[j]);					
		
		for(i = 0 ; i < o.length ; i++)
			o[i].color = vColor;
	};
	
	//--------------------------------------------
	// override Enabled of parent to affect child
	//--------------------------------------------
	vTarget.fBottomRightPosOfIndex = function(v)
	{
		o = new createjs.Point(0,0);
		o.x = vTarget.mClickableParam.vTextList[v].x + vTarget.mClickableParam.vTextList[v].getBounds().width;
		o.y = vTarget.mClickableParam.vTextList[v].y + vTarget.mClickableParam.vTextList[v].getBounds().height;
		return o;
	}
	
	//--------------------------------------------
	// Set all text to color
	//--------------------------------------------
	vTarget.fSetTextColor = function(v)
	{
		for(i = 0 ; i < vTarget.mClickableParam.vTextList.length ; i++)
			vTarget.mClickableParam.vTextList[i].color = v;
	}
	
	//-------------------------------------------------
	// Remove created ClickableText movieclip
	//-------------------------------------------------
	function 
	fRemovedCT(
		event
	) 
	{ 	
		if(event.target.vUnmodifiyText != undefined)
			event.target.text = event.target.vUnmodifiyText;
			
		if(event.target.mClickableParam.vHolder.parent)		
			event.target.mClickableParam.vHolder.parent.removeChild(event.target.mClickableParam.vHolder);		
	};	
	
	//-------------------------------------------------
	// replace all
	//-------------------------------------------------
	function 
	fReplaceAll(
		vTarget,
		search, 
		replacement
	) 
	{
		var o;
		o = String(vTarget).replace(new RegExp(search, 'g'), replacement);
		return o;
	};	
	
	//-------------------------------------------------
	// Check delimiter and return [index Array, text]
	//-------------------------------------------------
	function 
	fProcessDelimiter(
		vTarget,
		v		
	) 
	{
		var i, j;
		var vStart, vEnd, vWordList, s;
		var vSentenceWoNewLine;
		
		vSentenceWoNewLine = fReplaceAll(vTarget.text, "\n" , "");
		
		if (v instanceof RegExp)
		{
			vWordList = vSentenceWoNewLine.match(v);
			v = [];
			for (i = j = 0; i < vWordList.length; i++)
			{
				j = vSentenceWoNewLine.indexOf(vWordList[i], j);
				v.push([j, j + vWordList[i].length]);
				j += vWordList[i].length;
			}
		}
		else if (typeof v == "string")
		{
			vStart = v.charAt(0);
			vEnd = v.charAt(1);
			v = [];
			s = vSentenceWoNewLine;
			for (i = 0; ((i = s.indexOf(vStart, i)) != -1) && ((j = s.indexOf(vEnd, i + 1)) != -1);
				i = j - 2)
			{
				s = s.substr(0, i) + s.substr(i + 1, j - i - 1) + s.substr(j + 1);
				v.push([i, j - 1]);
			}
			vSentenceWoNewLine = fReplaceAll(vTarget.text, vStart, "");
			vSentenceWoNewLine = fReplaceAll(vSentenceWoNewLine, vEnd, "");
			
			vTarget.vUnmodifiyText = vTarget.text;
			vTarget.text = vSentenceWoNewLine;
		}
		
		return v;
	};	
}
 
 
 
 
 
 
 
 
 
 
 
 
