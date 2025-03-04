//-------------------------------------------------------------------------------------------------
//cCheckbox
//base function for checkbox class
//-------------------------------------------------------------------------------------------------
function 
cCheckBox(
	vTarget
)
{	
	vTarget.loop = false;
	
	if(vTarget.type == "MovieClip")
		vTarget.stop();

	cButton(vTarget);	
	
	vTarget.Selected = false;
	vTarget.fSelect = function(vData){
		this.Selected = vData;
		this.fRender("");
	};
}	
	
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
