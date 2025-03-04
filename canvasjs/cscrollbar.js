//-------------------------------------------------------------------------------------------------
//setup scrollbarparameter
//must set xTrackLength, width of the scrollbar
//xScrollSize to set the max frame count of the scrollbar
//xScrollPos return the scroll's position
//use pScrollPos to change the scroll's position
//xTumb position will be reset when scrollbar Event removed, to prevent position wrong, cause by
//	changing of frame
//-------------------------------------------------------------------------------------------------

function 
cScrollbar(
	vTarget
) 
{	
	//bypass is to make the scrollbar retain and not reset as new when 
	//fCreate fires from movieclip change
	//make sure to make bypass false after required
	if(vTarget.bypass == true)
		return;
	
	vTarget.bypass = false;
	
	vTarget.cursor = "pointer";
	vTarget.type = "Container";
	
	//--------------------------------------
	vTarget.xDirectionH = true;
	vTarget.xTrackLength = 100;
	vTarget.xScrollPos = 0;
	vTarget.xScrollSize = 1;	
	
	vTarget.xStartx = vTarget.xThumb.x;
	vTarget.xStarty = vTarget.xThumb.y;	
	
	vTarget.addEventListener("removed", fRemoved); 
	
	for( var i = 0 ; i < vTarget.getNumChildren() ; i++)
	{ 
		if ((vTarget.getChildAt(i) == vTarget.xThumb) || (vTarget.getChildAt(i) == vTarget.xTrack))
		;
		else
			vTarget.getChildAt(i).visible = false;
	}
	
	for(var key in vTarget)
	{
		if((key == "xDec") || (key == "xInc"))
		{
			vTarget[key].visible = true;
			cBase(vTarget[key], key);
			cPushButton(vTarget[key]);
		}
		if(key == "xThumb")
			cBase(vTarget[key], key);
	}
	
	vTarget.fRender = function(vData) 
	{ 			
		if(vData != undefined)
			switch(vData.name)
			{
				case "xDec":
					this.pScrollPos(this.xScrollPos - 1);
					SYS.fDispatch(this, Signal_Scroll);
					break;
					
				case "xInc":
					this.pScrollPos(this.xScrollPos + 1);
					SYS.fDispatch(this, Signal_Scroll);
					break;
			}
	};
	vTarget.xThumb.mouseChildren = false;
	
	//--------------------------------------
	vTarget.pScrollPos = function(vData) 
	{ 	
		if (((vData) != null) && ((vData) != undefined))
		{
			if((vData >= 0) && (vData <= this.xScrollSize))
			{
				this.xScrollPos = vData;				
				var o = this.xTrackLength / this.xScrollSize;	
				
				if(vTarget.xDirectionH)
					this.xThumb.x = this.xStartx + (o * this.xScrollPos);
				else
					this.xThumb.y = this.xStarty + (o * this.xScrollPos);
			}
		}
		else		
			return this.xScrollPos;		
	};
	
	vTarget.xThumb.fRender = function(vData)
	{ 			
		if(vData != "scrollmove")
			return;
		
		var o;
		var p;
		var vStart;
		
		if(vTarget.xDirectionH)	
		{		
			o = this.parent.globalToLocal(SYS.pMousePos().x, SYS.pMousePos().y).x;
			vStart = vTarget.xStartx;
		}
		else
		{
			o = this.parent.globalToLocal(SYS.pMousePos().x, SYS.pMousePos().y).y;
			vStart = vTarget.xStarty;
		}
			
		if(o < vStart)
			o = vStart;
		else if(o > vStart + vTarget.xTrackLength)
			o = vStart + vTarget.xTrackLength;
			
		if(vTarget.xDirectionH)	
			vTarget.xThumb.x = o;
		else
			vTarget.xThumb.y = o;
	
		p = vTarget.xScrollSize / vTarget.xTrackLength;	
		p = Math.round((o - vStart) * p);
		
		vTarget.xScrollPos = p;	

		if(vTarget.parent.name != undefined)
		{
			//send to parent if it's sv
			if(String(vTarget.parent.name).toLowerCase().substr(0, 2) == "sv")
			{
				SYS.fDispatch(vTarget.parent, Signal_Scroll, vTarget);
				return;
			}
		}		
		SYS.fDispatch(vTarget, Signal_Scroll);
	};
	
	function 
	fRemoved(
		event
	) 
	{ 	
		if(vTarget.bypass == true)
			return;
		
		vTarget.xThumb.x = vTarget.xStartx;
		vTarget.xThumb.y = vTarget.xStarty;		
	}; 
	
	//----------------------------------------------------------------------------------------------------
	//	property pScrollSize; scroll size.
	//----------------------------------------------------------------------------------------------------
	vTarget.pScrollSize = function(
		v
	)
	{
		if ((v != null) && (v != undefined))
		{
			if (vTarget.xScrollSize != v)
			{
				vTarget.xScrollSize = v;
				vTarget.pScrollPos(vTarget.xScrollPos);
			}
		}
		else
			return vTarget.xScrollSize;
	}

}	
	
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
