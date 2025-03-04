//-------------------------------------------------------------------------------------------------
//cRadioButton
//base class for Radiobutton
//-------------------------------------------------------------------------------------------------

function 
cRadioButton(
	vTarget
) 
{	
	cButton(vTarget);
	
	vTarget.loop = false;
	
	if(vTarget.type == "MovieClip")	
	{
		vTarget.stop();
		vTarget.gotoAndStop(0);	
	}
	
	vTarget.Selected = false;
	vTarget.fSelect = function(vData)
	{		
		if(vData)
		{
			this.Selected = true;
			this.fEnable(false);
			
			for (var i = 0; i < this.parent.numChildren; i++)
				if (this.parent.getChildAt(i).prefix == this.prefix && this.parent.getChildAt(i) != this)
				{
					this.parent.getChildAt(i).fEnable(true);
					this.parent.getChildAt(i).Selected = false;
					this.parent.getChildAt(i).fRender();
				}
			this.fRender("click");	
		}
		else
		{
			this.Selected = false;
			this.fEnable(true);			
			this.fRender();
		}		
	};
}	
	
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
