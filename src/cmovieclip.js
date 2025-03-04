//-------------------------------------------------------------------------------------------------
//cMovieClip
//use fStop if changing to frame that contains objects (etc movieclip, buttons)
//or when want to received a signal on frame change done
// require PlayPropsConfig to set the audio
//AudioList keeps the record of the audio this movieclip has
//on calling fPlay function, calculate if an audio should be played, even inbetween
//
//export the mp3 from audiocity again will get the correct duration
//-------------------------------------------------------------------------------------------------

function 
cMovieClip(
	vTarget
) 
{	
	vTarget.mTo = "";
	vTarget.loop = false;
	
	vTarget.AudioList = [];
		
	cSprite(vTarget);
	
	//prepare all label list
	var vLabel = [];
	var Labels;
	var o;
	var p;	
	var q;	
	var r;	
	var i;	
	var scrollRect;

	if(vTarget.type == "MovieClip")
	{
		//handle timeline type movieclip, stop at first frame and cast childs
		vTarget.gotoAndStop(0);
		SYS.fCreate(vTarget);
	
		//includes the audio instance into the movieclip class,
		//calculate the frame start and end of each audio and mil sec of each frame
		for (var key in vTarget)	
			if(String(key).search("frame_") == 0)
			{			
				for(i = 0 ; i < SYS.pSoundList().length ; i++)
				{				
					o = String(vTarget[key]).search(SYS.pSoundList()[i].id);

					if(o != -1)
					{
						o = parseInt(String(key).split("_")[1]);
						
						p = SYS.pSoundList()[i].instance.duration;					
						
						var sec = p / 1000;
						var frame = sec * mFPS;
						var milperframe = SYS.pSoundList()[i].instance.duration / frame;
	
						r = Math.round(frame);
						if(r < frame)
							frame = parseInt(frame + 1);
						else
							frame = r;
							
						vTarget.AudioList.push({
							id : SYS.pSoundList()[i].id,
							frameStart : o, 
							frameEnd : (o + frame), 
							MilSecPerFrame : milperframe,
							instance : SYS.pSoundList()[i].instance						
						});
						break;
					}
				}
			}	
	}
	
	Labels = vTarget.labels;
	for (var key in Labels)	
		vLabel.push(Labels[key]["label"]);	
		
	//----------------------------------------------------------------------------------------------------
	//	property pCurrentLabels; array of FrameLabels for entire MovieClip.
	//----------------------------------------------------------------------------------------------------	
	vTarget.pCurrentLabels = function()	
	{
		return vLabel;
	};
	
	//----------------------------------------------------------------------------------------------------
	//	property pCurrentLabel; current label in which playhead is located.
	//----------------------------------------------------------------------------------------------------
	vTarget.pCurrentLabel = function()	
	{
		return vTarget.currentLabel;
	};
	
	//----------------------------------------------------------------------------------------------------
	//	property pTotalFrames; total number of frames.
	//----------------------------------------------------------------------------------------------------
	vTarget.pTotalFrames = function()
	{
		return vTarget.totalFrames;
	};
	
	//----------------------------------------------------------------------------------------------------
	//	property pCurrentFrame; current frame in which playhead is located.
	//	*Frame start from 0, so last Frame will not match total frame
	//----------------------------------------------------------------------------------------------------
	vTarget.pCurrentFrame = function(
		vFrame
	)	
	{
		if ((vFrame != null) && (vFrame != undefined)) 
			vTarget.fStop(vFrame);
		else		
		{
			o = vTarget.currentFrame + 1;			
			return (o);	
		}
	};
	
	//----------------------------------------------------------------------------------------------------
	//	get labels on frame.
	//----------------------------------------------------------------------------------------------------
	vTarget.fGetFrameLabels = function(
		vFrame							
	)
	{
		var vList;
		var i;
		
		vList = [];
		for (var key in Labels)
		{
			if(parseInt(Labels[key]["position"]) == parseInt(vFrame))
				vList.push(Labels[key]["label"]);
		}
		return vList;
	}
	
	//--------------------------------------
	vTarget.fHasLabel = function(vLabel)	
	{
		for (var key in Labels)
			if (Labels[key]["label"] == vLabel)
				return true;		
		return false;
	};
	
	//--------------------------------------
	vTarget.fGetLabelFrame = function(vLabel)
	{
		for (var key in Labels)
			if (Labels[key]["label"] == vLabel)
				return (Labels[key]["position"]);
		return null;			
	};	
	
	//--------------------------------------
	vTarget.fEnd = function()
	{		
		this.stop();
		
		//handle audio stoping
		for(i = 0 ; i < this.AudioList.length; i++)
		{
			this.AudioList[i].instance.paused = true;
			this.AudioList[i].instance.stop();
			
			if(mCurrentAudio)
			{
				if(mCurrentAudio.id == this.AudioList[i].id)
				{
					mCurrentAudio.stop();
					mCurrentAudio = null;
				}
			}
		}		
		
		this.removeEventListener("tick", fMCProgress); 
	};
	
	//--------------------------------------
	vTarget.fPlay = function(vFrom, vTo)
	{			
		var ppc;
		var vStoreCurrentFrame;
		
		this.fEnd();
		
		//store current frame before set to frame 0 so can replay
		vStoreCurrentFrame = vTarget.currentFrame;
		//set to frame 0 so that replay is possible
		this.gotoAndStop(0);
			
		if(vTo == null)
		{
			fChangedToAdd(vTarget);
			return;
		}
		else if(vTo == -1)		
			vTarget.mTo = vTarget.totalFrames;		
		else
		{
			if(typeof vTo == "number")
				vTo = vTo - 1;
				
			vTarget.mTo = vTo;
		}
				
		//handle audio playing
		if(vFrom == null)			
			o = vStoreCurrentFrame;	//stored of the current frame before set to frame 0
		else
		{
			o = vFrom;
			
			if(this.fHasLabel(vFrom))
				o = this.fGetLabelFrame(vFrom);	
			else
				o = o - 1;
		}
		
		for(i = 0 ; i < this.AudioList.length; i++)
		{						
			if ((o > this.AudioList[i].frameStart) && (o <= this.AudioList[i].frameEnd))
			{
				p = o - this.AudioList[i].frameStart; 
				p = p * this.AudioList[i].MilSecPerFrame;

				ppc = new createjs.PlayPropsConfig().set({offset : p})
				this.AudioList[i].instance.play(ppc);
				break;
			}
		}		
		
		this.addEventListener("tick", fMCProgress); 		
		this.gotoAndPlay(o);		
	};
	
	//--------------------------------------
	vTarget.fStop = function(vTo)
	{
		if(typeof vTo == "number")
			vTo = vTo - 1;
		else
		{
			if(this.fHasLabel(vTo))
				vTo = this.fGetLabelFrame(vTo);
			else
				throw ("Error no label found");
		}
		
		this.mTo = vTo;
		this.addEventListener("tick", fFrameChanged);		
		this.gotoAndStop(vTo);
	};		
	
	//--------------------------------------
	vTarget.fRender = function(vData) 
	{ 	
 		
	};	
	
	//----------------------------------------------------------------------------------------------------
	//	property pScrollRect; scroll rectangle bounds of object.
	//----------------------------------------------------------------------------------------------------
	vTarget.pScrollRect = function(
		v // Rectangle
	)
	{
		if ((v != null) && (v != undefined))
		{
			scrollRect = v;			
			vTarget.mask = v;
		}
		else
			return scrollRect;
	}
		
	function 
	fFrameChanged(
		event
	)
	{
		if(event.target.fHasLabel(String(vTarget.mTo)))
		{
			if(event.target.currentLabel == String(vTarget.mTo))			
				fChangedToAdd(event.target);							
		}				
		else	
		{
			if(event.target.currentFrame == vTarget.mTo)							
				fChangedToAdd(event.target);
		}
		return;
	};
	
	function 
	fChangedToAdd(
		vTarget
	)
	{	
		vTarget.removeEventListener("tick", fFrameChanged);
		SYS.fCreate(vTarget);
		SYS.fDispatch(vTarget, Signal_Added);
	};
	
	function 
	fMCProgress(
		event
	)
	{		
		SYS.fDispatch(event.target, Signal_Progress);		
		if(event.target.currentFrame == event.target.totalFrames)
		{
			event.target.fEnd();
			SYS.fDispatch(event.target, Signal_Done);
			return;
		}		
		if(event.target.fHasLabel(String(vTarget.mTo)))
		{
			if(event.target.currentLabel == String(vTarget.mTo))
			{
				event.target.fEnd();		
				SYS.fDispatch(event.target, Signal_Done);
				return;
			}
		}
		else
		{
			if(event.target.currentFrame == (vTarget.mTo))
			{
				event.target.fEnd();		
				SYS.fDispatch(event.target, Signal_Done);
				return;
			}
		}
	};   
}
 
 
 
 
 
 
 
 
 
 
 
 
