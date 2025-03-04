//-------------------------------------------------------------------------------------------------
//cSprite,
// Basic function for all Sprite Object(movieclip, buttons)
// todo:
// this method uses key in vTarget, does it get the Objects that's added later using addChild?
// does other Frame items get taken in by key in vTarget?
// key in vTarget is to allow getting child that was add as tween too. 
//-------------------------------------------------------------------------------------------------
function 
cSprite(
	vTarget
) 
{	
	//----------------------------------------------------------------------------------------------------
	//	return child.
	//	*using string(name), int(index) wont work
	//----------------------------------------------------------------------------------------------------
	vTarget.fGetChild = function(
		vChild,								//	(String only)
		vErrIfMissing						//	whether error if missing
	) 
	{
		var o;
		
		if((vErrIfMissing == null) || (vErrIfMissing == undefined))
			vErrIfMissing = true;	
	
		if(vTarget[vChild] != undefined)
			return vTarget[vChild];
		else
		{
			if(vErrIfMissing)
				throw ("Error no child - " + vChild);
			else
				return null;
		}
	}
	
	//----------------------------------------------------------------------------------------------------
	//	return child list.
	//	*Get all child	or those matching vNamePrefix
	//----------------------------------------------------------------------------------------------------	
	vTarget.fGetChildList = function(vNamePrefix)
	{
		var i;
		var o, p;
		var key;
	
		o = [];
		for(key in vTarget)	
			if((vTarget[key] != null) && (key != "parent")) //there's a parent key that causes the return of parent
				if(vTarget[key].fRender != undefined)	//cBase item will have this function			
					o.push(vTarget[key]);			
					
		if((vNamePrefix == undefined) || (vNamePrefix == null))				
			return o;	
		else
		{
			p = [];
			for(i = 0 ; i < o.length ; i++)
			{
				if(String(o[i].name).indexOf(vNamePrefix) == 0)
					p.push(o[i]);
			}
			return p;
		}
	}
	
	//----------------------------------------------------------------------------------------------------
	//	property pSize; size in pixels.
	//  update: added getBounds x/y to the width height so that size calculation will be correct
	//	as getBounds calculate from regX/Y causing a difference from x/y
	//----------------------------------------------------------------------------------------------------
	vTarget.pSize = function(
		v
	)
	{
		if ((v != null) && (v != undefined))
		{
			if ((vTarget.nominalBounds.width != v.x) || (vTarget.nominalBounds.height != v.y))
			{
				vTarget.nominalBounds.width = v.x;
				vTarget.nominalBounds.height = v.y;
			}
		}
		else
		{
			var o;
			if(vTarget.getBounds() != null)				
				o = new createjs.Point(vTarget.getBounds().width + vTarget.getBounds().x, vTarget.getBounds().height + vTarget.getBounds().y);			
			else if(vTarget.nominalBounds == undefined)			
				o = new createjs.Point(0, 0); 			
			else			
				o = new createjs.Point(vTarget.nominalBounds.width, vTarget.nominalBounds.height);
			return o;
		}
	}	
}	


 
 
 
 
 
 
 
 
 
 
