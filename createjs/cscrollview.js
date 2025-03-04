//----------------------------------------------------------------------------------------------------
//	cScrollView.as
//
//	expects child xBase (MovieClip).
//	optional child xVScrollBar (cScrollBar) and xHScrollBar (cScrollBar).
//	optional child xView; if used, pContent can be used to dynamically set content.
//	optional child mcContent (either a direct child or child of xView).
//	dispatch Signal_Scroll on scroll position changes.
//----------------------------------------------------------------------------------------------------
function 
cScrollView(
	vTarget
) 
{
	//----------------------------------------------------------------------------------------------------
	//	constants.
	//----------------------------------------------------------------------------------------------------
	var ScrollPolicy_Auto = "Auto";
	var ScrollPolicy_On = "On";
	var ScrollPolicy_Off = "Off";
	
	//----------------------------------------------------------------------------------------------------
	//	member data.
	//----------------------------------------------------------------------------------------------------
	var mViewSize; 			// Point;//	calculated view size; valid after fRender()
	var xBase; 				// MovieClip;//	child xBase
	var xFg; 				// MovieClip;//	optional child xFg
	var xHScrollBar; 		// cScrollBar;// optional child xHScrollBar
	var xVScrollBar; 		// cScrollBar;// optional child xVScrollBar
	var xView; 				// cMovieClip;// optional child xView
	var xContent; 			// cMovieClip;// reference to content
	var xContentSize; 		// Point;//	content size
	var xScrollPolicy; 		// String;// Scroll policy

	var i, j , k;
	var o, p , q;

	xScrollPolicy = ScrollPolicy_Auto;
	
	xBase = vTarget.xBase;
	
	if(vTarget.xFg != undefined)
		xFg = vTarget.xFg;

	if(vTarget.xHScrollBar != undefined)
	{
		xHScrollBar = vTarget.xHScrollBar;
		cScrollbar(xHScrollBar);
		o = (xHScrollBar.xTrack.nominalBounds.width * xHScrollBar.xTrack.scaleX) - (xHScrollBar.xThumb.nominalBounds.width * xHScrollBar.xThumb.scaleX);
		xHScrollBar.xTrackLength = o;
		xHScrollBar.xScrollSize = 100;
	}
	if(vTarget.xVScrollBar != undefined)
	{
		xVScrollBar = vTarget.xVScrollBar;
		cScrollbar(xVScrollBar);
		o = (xVScrollBar.xTrack.nominalBounds.height * xVScrollBar.xTrack.scaleY) - (xVScrollBar.xThumb.nominalBounds.width * xVScrollBar.xThumb.scaleX);
		xVScrollBar.xDirectionH = false;
		xVScrollBar.xTrackLength = o;
		xVScrollBar.xScrollSize = 100;
		
		xVScrollBar.xThumb.x = 0;
		xVScrollBar.xThumb.y = 0;
	}

	if(vTarget.xView != undefined)	
	{
		xView = vTarget.xView;
		cMovieClip(xView);
	}

	if (xView != null) 
	{
		if(xView.mcContent != undefined)
			xContent = xView.mcContent;
	}
	else
	{
		xContent = vTarget.mcContent;
		if(xContent == null)	
			xContentSize = new createjs.Point(0, 0);
		else
			xContentSize = new createjs.Point(xContent.nominalBounds.width, xContent.nominalBounds.height);
	}

	//----------------------------------------------------------------------------------------------------
	//	property pContent;
	//	content if added, is automatically positioned at (0,0) with respect to xBase.
	//----------------------------------------------------------------------------------------------------
	vTarget.pContent = function(
		v
	) 
	{
		if ((v != null) && (v != undefined))
		{
			fDbg("v : " + v);
			if (xView == null) 
			{
				fDbg("cScrollView.pContent() no xView");
				return;
			}

			fDbg("xContent :: " + xContent);
			if (xContent != v)
			{
				if ((xContent != null) && (xContent != undefined))
					xView.removeChild(xContent);				
				xContent = v;
				if ((xContent != null) && (xContent != undefined))
				{
					xView.addChild(xContent);
					xContent.x = 20;
					xContent.y = 20;
					fDbg("xContent 1 :: " + xContent);
					fDbg("xContent.pSize() :: " + xContent.pSize());
					fDbg("xView.pSize() :: " + xView.pSize());
					fDbg("xView.x:: " + xView.x);
					fDbg("xView.y :: " + xView.y);
					fDbg("xBase.pSize :: " + xBase.nominalBounds.width);
				}
				vTarget.pScrollPos(new createjs.Point(0, 0));
				vTarget.fRender();
			}
		}	
		else
			return xContent;
	}
	
	//----------------------------------------------------------------------------------------------------
	//	property pScrollPolicy;
	//----------------------------------------------------------------------------------------------------
	vTarget.pScrollPolicy = function(
		v
	)
	{
		if ((v != null) && (v != undefined))
		{
			if (xScrollPolicy != v)
			{
				xScrollPolicy = v;
				vTarget.fRender();
			}
		}	
		else
			return xScrollPolicy;		
	}

	//----------------------------------------------------------------------------------------------------
	//	property pScrollSize; current scroll size
	//----------------------------------------------------------------------------------------------------
	vTarget.pScrollSize = function(
	)
	{
		return new createjs.Point((xHScrollBar == null) ? 0 : xHScrollBar.pScrollSize(),
			(xVScrollBar == null) ? 0 : xVScrollBar.pScrollSize());
	}
	
	//----------------------------------------------------------------------------------------------------
	//	property pScrollPos; current scroll pos
	//----------------------------------------------------------------------------------------------------
	vTarget.pScrollPos = function(
		v
	)
	{
		fDbg("vTarget.name :: " + vTarget.name);
		if ((v != null) && (v != undefined))
		{
			if ((xHScrollBar != null) && (xHScrollBar.pScrollPos() != v.x))
			{
				xHScrollBar.pScrollPos(v.x);
				vTarget.fRender();
			}
			if ((xVScrollBar != null) && (xVScrollBar.pScrollPos() != v.y))
			{
				xVScrollBar.pScrollPos(v.y);
				vTarget.fRender();
			}
		}
		else
			return new createjs.Point((xHScrollBar == null) ? 0 : xHScrollBar.pScrollPos(),
				(xVScrollBar == null) ? 0 : xVScrollBar.pScrollPos());
	}

	//----------------------------------------------------------------------------------------------------
	//	render object.
	//----------------------------------------------------------------------------------------------------
	vTarget.fRender = function(
	)
	{
		var x;
		var y;
		var shape;
		
		//temp remove of scaling as no nine slice
		/*if ((pScaleX != 1) || (pScaleY != 1))
		{
			xBase.width *= pScaleX;
			xBase.height *= pScaleY;
			pScale = new Point(1, 1);
			if (xFg != null)
			{
				xFg.width = xBase.width;
				xFg.height = xBase.height;
			}
			if (xVScrollBar != null)
			{
				xVScrollBar.pX = xBase.width - xVScrollBar.pW;
				xVScrollBar.pH = xBase.height;
			}
			if (xHScrollBar != null)
			{
				xHScrollBar.pY = xBase.height - xHScrollBar.pH;
				xHScrollBar.pW = xBase.width;
			}
			return;
		}*/

		if (xView != null)
		{
			if(xContent == null) 
				o = new createjs.Point(0, 0);
			else if(xContent.pSize == undefined)
				o = new createjs.Point(xContent.nominalBounds.width, xContent.nominalBounds.height);
			else			
				o = xContent.pSize();	

			xContentSize = o;
		}

		mViewSize = new createjs.Point(xBase.nominalBounds.width * xBase.scaleX, xBase.nominalBounds.height * xBase.scaleY);
		
		if ((xVScrollBar != null) && ((xScrollPolicy == ScrollPolicy_On) ||
			((xScrollPolicy == ScrollPolicy_Auto) && (xContentSize.y > mViewSize.y))))
			mViewSize.x = (xBase.nominalBounds.width * xBase.scaleX) - xVScrollBar.nominalBounds.width;
	
		if ((xHScrollBar != null) && ((xScrollPolicy == ScrollPolicy_On) ||
			((xScrollPolicy == ScrollPolicy_Auto) && (xContentSize.x > mViewSize.x))))
			mViewSize.y = (xBase.nominalBounds.height * xBase.scaleY) - xHScrollBar.nominalBounds.height;

		mViewSize = new createjs.Point(Math.floor(mViewSize.x), Math.floor(mViewSize.y));

		if (xVScrollBar != null)
		{
			xVScrollBar.visible = (xContentSize.y > mViewSize.y);
			xVScrollBar.pScrollSize(Math.max(0, xContentSize.y - mViewSize.y));
		}
	
		if (xHScrollBar != null)
		{
			xHScrollBar.visible = (xContentSize.x > mViewSize.x);
			xHScrollBar.pScrollSize(Math.max(0, xContentSize.x - mViewSize.x));
		}
	
		if ((xVScrollBar != null) && xVScrollBar.visible && (xHScrollBar != null) &&
			xHScrollBar.visible)
		{
			xVScrollBar.height = xHScrollBar.y - xVScrollBar.y;
			xHScrollBar.width = xVScrollBar.x - xHScrollBar.x;
		}
		//else if ((xVScrollBar != null) && xVScrollBar.visible)
			//xVScrollBar.nominalBounds.height = xBase.nominalBounds.height;
		//else if ((xHScrollBar != null) && xHScrollBar.visible)
			//xHScrollBar.nominalBounds.width = xBase.nominalBounds.width;

		x = ((xHScrollBar != null) && xHScrollBar.visible) ? xHScrollBar.pScrollPos() : 0;
		y = ((xVScrollBar != null) && xVScrollBar.visible) ? xVScrollBar.pScrollPos() : 0;
		
		if(xHScrollBar != null)
			xHScrollBar.pScrollPos(x);
		if(xVScrollBar != null)
			xVScrollBar.pScrollPos(y);
	
		if (xView != null)
		{			
			shape = new createjs.Shape();
			shape.graphics.beginFill("#ff0000").drawRect(0, 0, mViewSize.x, mViewSize.y);
			xView.x = 0 - x;
			xView.y = 0 - y;
			xView.pScrollRect(shape);
		}
		else if (xContent != null)
		{
			shape = new createjs.Shape();
			shape.graphics.beginFill("#ff0000").drawRect(0, 0, mViewSize.x, mViewSize.y);
			xContent.x = 0 - x;
			xContent.y = 0 - y;
			xContent.pScrollRect(shape);
		}	
	}
	
	//----------------------------------------------------------------------------------------------------
	//	handle signal. return false to stop bubbling.
	//----------------------------------------------------------------------------------------------------
	vTarget.fOnSignal = function(
		vTarget, 				//	original target for signal
		vSignal, 				//	signal received
		vData					//	extra data along with signal
	)
	{
		//fDbg("scrollview.fOnSignal = " + vTarget + " , " + vSignal + " , " + vData);
		var x;
		var y;
		var shape;
		
		switch (vSignal)
		{
		case Signal_Added:
			//vTarget.fRender();
			break;
			
		case Signal_Scroll:
			if ((vData == xVScrollBar) || (vData == xHScrollBar))
			{
				x = ((xHScrollBar != null) && xHScrollBar.visible) ? xHScrollBar.pScrollPos() : 0;
				y = ((xVScrollBar != null) && xVScrollBar.visible) ? xVScrollBar.pScrollPos() : 0;
				if (xView != null)
				{
					if ((xView.pScrollRect().x != x) || (xView.pScrollRect().y != y))
					{
						shape = new createjs.Shape();
						shape.graphics.beginFill("#ff0000").drawRect(0, 0, mViewSize.x, mViewSize.y);
						xView.x = 0 - x;
						xView.y = 0 - y;						
						xView.pScrollRect(shape);
						//cSys.fDispatch(this, "Signal_Scroll");
					}
				}
				else if (xContent != null)
				{
					if ((xContent.pScrollRect().x != x) || (xContent.pScrollRect().y != y))
					{
						shape = new createjs.Shape();
						shape.graphics.beginFill("#ff0000").drawRect(0, 0, mViewSize.x, mViewSize.y);
						xContent.x = 0 - x;
						xContent.y = 0 - y;						
						xContent.pScrollRect(shape);
						//cSys.fDispatch(this, "Signal_Scroll");
					}
				}
			}
			return true;
		}
	
		return true;
	}	
}
