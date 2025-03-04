//-------------------------------------------------------------------------------------------------
// cModule, 
//
// vUrl 	: .js path
// vId		: Id for the module, userAgent mScene[vId] to get the module
// vClass	: namespace class for the module, able to separate allowing each .js to handle a module
//				*do not need to code everything in engine.js only
//
//	module are casted to cMovieClip at default and have fCreate done regardless vClass is provided
//-------------------------------------------------------------------------------------------------
function 
cModule(
	vUrl,
	vId,
	vClass
) 
{
	var preloadManifest;
	var vNewModule;	
	var vFunctionName;
	
	var vFunctionNameWith;	//"function name with _canvas"
	var vFunctionNameWithout;	//"function name without _canvas"
	
	var vUrlHasCanvasString;		
	
	startPreload();		
	
	//part of hack
	var ImageIdRecord = [];
	
	function
	startPreload(		
	) 
	{
		var i, j;
		var vSID, vSSRC;
		var checkcanvas;

		//use the url filename and treat it as function name
		vFunctionName = String(vUrl).split("/");
		vFunctionName = vFunctionName[vFunctionName.length - 1];		
		vFunctionName = vFunctionName.split(".")[0];
		
		//check if url has "_canvas" in it.
		checkcanvas = vFunctionName.toLowerCase();		
		vUrlHasCanvasString = checkcanvas.search("_canvas") == -1 ? false : true; 
		
		if(vUrlHasCanvasString)
		{
			vFunctionNameWith = vFunctionName;
			vFunctionNameWithout =  String(vFunctionName).split("_Canvas")[0];
		}
		else
		{
			vFunctionNameWithout = vFunctionName;
			vFunctionNameWith =  String(vFunctionName) + ("_Canvas");
		}
		
		if(lib.properties.manifest.length > 0)
		{
			for(i = 0 ; i < lib.properties.manifest.length ; i++)
			{
				if(String(lib.properties.manifest[i].src).search("sounds/") == 0)	
				{
					vSID = lib.properties.manifest[i].id;
					vSSRC = lib.properties.manifest[i].src;
					
					SYS.pSoundList().push({instance : null , id : vSID , src : vSSRC});
				}
			}
			
			//preloadManifest = new createjs.LoadQueue(false);
			preloadManifest = new createjs.LoadQueue(false, "./", "");
			preloadManifest.installPlugin(createjs.Sound);          
			preloadManifest.on("fileload", handleFileLoad);
			preloadManifest.on("progress", Manifest_handleFileProgress);
			preloadManifest.on("complete", Manifest_loadComplete);
			preloadManifest.on("error", loadError);		
			preloadManifest.loadManifest(lib.properties.manifest);
		}
		else
		{
			if(lib[vFunctionNameWith] != undefined)
				vNewModule = new lib[vFunctionNameWith]();	
			else
				vNewModule = new lib[vFunctionNameWithout]();					
			
			vNewModule.name = vId;			
			mScene[vId] = vNewModule;			
			cBase(vNewModule, vId);
			
			SYS.fModuleLayer(vId);
			
			//edited: place here so that direct fCreate if no manifest
			SYS.fCreate(vNewModule);
			
			try {
				window[vClass].fModuleLoaded(vId);
			}
			catch(err) {}
		}
	};
	
	function
	handleFileLoad(
		event
	)
	{
		if (event.item.type == "image") { ImageIdRecord.push(" = new lib." + event.item.id); images[event.item.id] = event.result; }
	};
	
	
	function
	loadError(
		event
	)
	{
		fDbg("Error! " + event.text);
	};
		
	function 
	Manifest_handleFileProgress(
		event
	)
	{
		fDbg((preloadManifest.progress*100|0) + " % Loaded");
	};	
	
	function
	Manifest_loadComplete(
		event
	)
	{		
		if(lib[vFunctionNameWith] != undefined)
			vNewModule = new lib[vFunctionNameWith]();	
		else
			vNewModule = new lib[vFunctionNameWithout]();			
			
		vNewModule.name = vId;			
		mScene[vId] = vNewModule;			
		cBase(vNewModule, vId);
		
		SYS.fModuleLayer(vId);
		
		//edited: place here so that fCreate after manifest Sound loaded
		SYS.fCreate(mScene[vId]);
		
		//manifest object of .js loaded (image / audio)	
		try {
			window[vClass].fModuleLoaded(vId);
		}
		catch(err) {}
	};
}
 
 
 
 
 
 
 
 
 
