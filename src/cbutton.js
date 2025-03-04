//-------------------------------------------------------------------------------------------------
//cButton
//Basic class for button type object
//-------------------------------------------------------------------------------------------------
function 
cButton(
	vTarget
) 
{		
	var vhitArea;
	var o, p, q;
	
	cSprite(vTarget);
	
	vTarget.cursor = "pointer";	
	vTarget.mouseChildren = false;
	
	if(vTarget.xText != undefined)
	// if (vTarget.xText != undefined && vTarget.xText.text.length == 0)
	{		
		if(vTarget.name.search("_") == -1)
			vTarget.xText.text = vTarget.prefix.slice(2, vTarget.prefix.length);
		else
			vTarget.xText.text = vTarget.suffix;
		
		//commented part is to reduce the text scaling as not to follow the parent	
		o = 1 / vTarget.scaleX;	
		p = 1 / vTarget.scaleY;	
			
		// parent scaling affect xText to follow
		if ((vTarget.xText.scaleX != o) || (vTarget.xText.scaleY != p))
		{			
			vTarget.xText.scaleX = 1 / vTarget.scaleX;
			vTarget.xText.scaleY = 1 / vTarget.scaleY;						
		}
		
		vhitArea = new createjs.Shape(); 			
		vhitArea.graphics.beginFill("#000").drawRect(0, 0 , vTarget.xText.getBounds().width, vTarget.xText.getBounds().height);			
		vTarget.xText.hitArea = vhitArea;
	}
	
	//--------------------------------------
	vTarget.fSetText = function(vData) 
	{ 	
		this.xText.text = vData;
	}
	
	//--------------------------------------
	vTarget.fGetText = function() 
	{ 	
		return this.xText.text;
	}
	
	//--------------------------------------
	vTarget.fRender = function(vData) 
	{ 	
 		if (this.type != "MovieClip" || this.totalFrames == 1)
			return;
		
		var i = (this.Selected == undefined) ? 0 : Number(this.Selected) * 4;

		if (!this.Enabled)
		{			
			i = i + 3;
			if(i >= this.totalFrames)
				i = this.totalFrames-1;
			this.gotoAndStop(i);
			return;
		}
		switch (vData)
		{
		case "rollover": 
			i = i + 1;
			if(i >= this.totalFrames)
				i = this.totalFrames-1;
			this.gotoAndStop(i); 
			break;
		case "click": 
			if((this.name == "xInc") || (this.name == "xDec"))
				this.parent.fRender(this);
		case "mousedown": 
			i = i + 2;
			if(i >= this.totalFrames)
				i = this.totalFrames - 1;
			this.gotoAndStop(i); 
			break;
		default:
			if(i >= this.totalFrames)
				i = this.totalFrames - 1;
			this.gotoAndStop(i); 
			break;
		}
	};
}

	
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
