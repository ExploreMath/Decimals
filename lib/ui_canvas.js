(function (lib, img, cjs, ss) {

var p; // shortcut to reference prototypes

// library properties:
lib.properties = {
	width: 1024,
	height: 768,
	fps: 24,
	color: "#FFFFFF",
	manifest: []
};



// symbols:



(lib.pbReset = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// button
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FF9900").s().p("AhyCMQgxgwAAhEQAAg5AlgtIgggjQgFgGAAgKQgBgIAFgHQAGgHAJgCIChgiQAJgCAIAEQAHAEADAIQADAIgCAJIguCdQgCAJgIAFQgHAFgJgCQgJAAgGgHIgkgkQgPAWAAAbQAAAnAcAcQAcAbAlAAQAnAAAbgbIABAAQAbgcAAgnQAAgYgLgUQgRgZABgTQAIgeAeADQARAGAUAcQAWAlAAAsIAAACQgBBEgvAuQgwAwhEAAQhCAAgwgwg");
	this.shape.setTransform(30,30);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("AiPCpQg8g8AAhVQAAg1AagtIgKgLQgQgQgBgaQgCgXAPgSIAAgBQAPgTAWgFIACAAIChgiIABAAQAUgEAUAJIAEACQATAKAJAVIAAABQAJAVgHAWIAAAAIgEAPQANgDAQABQAGABAFACQAaAIAdAoIACADQAbAuABA4IAAACIAAABQgCBUg6A6Qg8A8hVAAQhTAAg8g8gAgkA+IAAAAQAPAQAVAAQAWAAAQgQIADgDQANgPAAgUQAAgOgHgKIgEgHIgHAUQgGAWgTANIgBABQgRAMgWgCQgGAAgFgCIAEAFg");
	this.shape_1.setTransform(30,30);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("rgba(0,0,0,0.2)").s().p("AicC4QhDhDAAhdQAAgzAWgsIgBAAQgVgVgBghQgCgeASgYIACgCQARgXAbgHQADgCAEAAICggiIAEAAQAZgFAZAMIABAAIADACIABAAQAZAOAMAaIAAACQAJAVgDAXIAFAAQAHAAAHADQAgAIAjAwIABADIABABIAAABQAeAyABA+IAAACIAAACQgDBcg/BAQhDBChdAAQhbAAhBhCg");
	this.shape_2.setTransform(30,30);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FFC21C").s().p("AhyCMQgxgwAAhEQAAg5AlgtIgggjQgFgGAAgKQgBgIAFgHQAGgHAJgCIChgiQAJgCAIAEQAHAEADAIQADAIgCAJIguCdQgCAJgIAFQgHAFgJgCQgJAAgGgHIgkgkQgPAWAAAbQAAAnAcAcQAcAbAlAAQAnAAAbgbIABAAQAbgcAAgnQAAgYgLgUQgRgZABgTQAIgeAeADQARAGAUAcQAWAlAAAsIAAACQgBBEgvAuQgwAwhEAAQhCAAgwgwg");
	this.shape_3.setTransform(30,30);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.lf(["#C67700","#FF9900"],[0.004,1],0,-17,0,17).s().p("AhmB+QgsgsAAg9QAAgzAhgoIgdgfQgFgGAAgJQAAgHAEgGQAGgHAIgCICQgeQAIgCAIAEQAGADADAHQADAIgCAHIgpCOQgDAIgGAFQgHAEgIgCQgIAAgGgGIggghQgNAVAAAXQAAAkAZAZQAZAYAhAAQAjAAAZgYIAAAAQAZgZAAgkQAAgVgKgSQgQgXACgRQAGgbAcADQAPAGASAZQAUAhAAAnIAAACQgBA9grAqQgrArg9AAQg7AAgrgrg");
	this.shape_4.setTransform(30,30);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#FFFFFF").s().p("AiACYQg3g2AAhNQAAgvAYgpIgJgKQgPgOAAgXQgCgVAOgQIAAgBQANgRAUgEIABgBICRgeIABAAQASgEASAIIAEACQARAJAIATIAAABQAIATgGATIAAABIgEANQAMgDAOABQAFABAFACQAYAHAaAkIABADQAZApABAyIAAACIAAABQgCBMg1A0Qg2A2hMAAQhKAAg2g2gAggA3IAAABQAOAOASAAQAUAAAOgOIADgDQAMgNAAgTQAAgMgGgJIgEgGIgGARQgGAUgRAMIgBABQgPALgUgCQgFAAgFgCIAEAEg");
	this.shape_5.setTransform(30,30);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("rgba(0,0,0,0.2)").s().p("AiNClQg8g8AAhUQAAgtAUgoIgBAAQgTgTgBgeQgCgaARgWIABgCQAQgVAYgGIAHgCICPgeIAEAAQAXgFAWALIABAAIADACIAAAAQAXAMAKAYIABACQAIATgDAUIAEAAQAHAAAGADQAdAHAfAsIACACIAAABIAAABQAbAtABA3IAAACIAAACQgCBTg6A5Qg7A8hUAAQhSAAg7g8g");
	this.shape_6.setTransform(30,30);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#CCCCCC").s().p("AhyCMQgxgwAAhEQAAg5AlgtIgggjQgFgGAAgKQgBgIAFgHQAGgHAJgCIChgiQAJgCAIAEQAHAEADAIQADAIgCAJIguCdQgCAJgIAFQgHAFgJgCQgJAAgGgHIgkgkQgPAWAAAbQAAAnAcAcQAcAbAlAAQAnAAAbgbIABAAQAbgcAAgnQAAgYgLgUQgRgZABgTQAIgeAeADQARAGAUAcQAWAlAAAsIAAACQgBBEgvAuQgwAwhEAAQhCAAgwgwg");
	this.shape_7.setTransform(30,30);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape_3}]},1).to({state:[{t:this.shape_6},{t:this.shape_5},{t:this.shape_4}]},1).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape_7}]},1).wait(1));

	// shadow
	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("rgba(0,0,0,0.2)").s().p("Aj5AbQgcgKA1gOQAegGAvgGQgJgDASgFQAPgEAggEIADAAIA9gFIAIAAIC0gFIADAAQAdAAATABIACAAIABAAQARACgEAEIAAABQgDADgRADIAFAAIAAAAIANABQAbABAHAHIAAAAQABAIgkAHIgBAAIgBAAIAAABQg3ANhlAKQhmAJhdAAQhdAAgcgJg");
	this.shape_8.setTransform(36.4,51.4);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("rgba(0,0,0,0.2)").s().p("AjgAYQgZgJAvgNQAcgEAqgGQgIgDAQgEQANgEAegEIACAAIA3gEIAHAAICigFIADAAIArABIACAAIAAAAQAQADgEADIAAAAQgDADgPADIAFABIgBgBIAMABQAZABAGAGIAAABQABAGggAGIgBAAIgBAAIgBABQgxANhaAIQhcAJhUAAQhTAAgagJg");
	this.shape_9.setTransform(36.4,51.8);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_8}]}).to({state:[{t:this.shape_9}]},2).to({state:[{t:this.shape_8}]},1).wait(1));

	// hit
	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("rgba(255,255,255,0.012)").s().p("AkrEsIAApXIJXAAIAAJXg");
	this.shape_10.setTransform(30,30);

	this.timeline.addTween(cjs.Tween.get(this.shape_10).wait(4));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,62.5,60);


(lib.pbInstructions = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// button
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FF9900").s().p("AhIC5QgSgNAAggIBJiyIgqAAIAAgXIB/AAIhNDeIBUgYQgjAlg+ASQgKACgIAAQgUAAgMgJgAgEhfQgRgRAAgXQAAgYARgRQAPgRAXAAQAYAAARARQAQARAAAYQAAAXgQARQgRARgYAAQgXAAgPgRg");
	this.shape.setTransform(29.8,29.9);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("AhfDYQgjgWABg2QAAgIADgHIA0h/QgHgDgGgFQgMgMABgRIAAgWQgBgQAMgMQAMgMAQABIAFAAQgGgRAAgTQAAgoAcgcIAAAAQAdgcAlAAQAoAAAcAcIABAAQAbAcAAAoQAAAogbAcIgBABIgGAFIABACQAHAOgGAQIgvCFIANgEQANgEAMAFQANAFAGAMQAHALgBANQgCANgJAKQgpAshJAWIgFABQgOACgMAAQghAAgUgRg");
	this.shape_1.setTransform(30,30);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("rgba(0,0,0,0.2)").s().p("AhrDqQgtgcAChDIAAAAQAAgLAEgLIAAABIAthyIgBgBIAAAAQgSgQAAgaIAAgWQAAgaASgSIAAAAQAKgJAMgEIgCgSIAAgBQAAgtAfggIATgSQAdgWAlAAIAAAAQAvAAAhAfIAEADIAAABQAhAhABAyQAAAugfAiQAEAQgFARIgBABIgkBiQAIABAHADQASAIALASQAKAQgCAUIAAABIAAABQgCATgNAOIgBACQgtAvhPAYIgHACIAAAAQgPADgOAAQgqAAgYgVgABygTIABgBIAAAAgABmgzIABgBIAAAAg");
	this.shape_2.setTransform(30,30);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FFC21C").s().p("AhIC5QgSgNAAggIBJiyIgqAAIAAgXIB/AAIhNDeIBUgYQgjAlg+ASQgKACgIAAQgUAAgMgJgAgEhfQgRgRAAgXQAAgYARgRQAPgRAXAAQAYAAARARQAQARAAAYQAAAXgQARQgRARgYAAQgXAAgPgRg");
	this.shape_3.setTransform(29.8,29.9);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.lf(["#C67700","#FF9900"],[0.004,1],58.2,-17.2,58.2,15.1).s().p("AhBCmQgQgMABgcIBBigIglAAIAAgVIByAAIhFDIIBLgWQggAhg3ARIgRABQgSAAgLgIgAgDhVQgPgQAAgVQAAgVAPgPQANgPAVAAQAVAAAPAPQAPAPAAAVQAAAVgPAQQgPAPgVAAQgVAAgNgPg");
	this.shape_4.setTransform(29.8,29.9);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#FFFFFF").s().p("AhVDCQgggUABgwQAAgHADgGIAuhzQgGgCgFgFQgLgLABgPIAAgUQgBgOALgLQALgLAOABIAFAAQgGgPAAgRQAAgkAagZIAAgBQAZgZAhAAQAlAAAZAZIABABQAYAZAAAkQAAAjgYAaIgBABIgFAEIABACQAFANgFAOIgqB3IAMgDQALgDALAEQAMAFAFAKQAHAKgCAMQgBAMgIAIQglAohBAUIgFABQgMACgKAAQgfAAgSgQg");
	this.shape_5.setTransform(30,30);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("rgba(0,0,0,0.2)").s().p("AhhDTQgogZACg8IAAgBQAAgKAEgJIAAAAIAohmIgBgBIAAAAQgQgOAAgXIAAgVQAAgXAQgQIAAAAQAJgIALgEIgCgQIAAgBQAAgpAcgcIARgQQAagUAhAAIAAAAQArAAAdAcIAEADIAAAAQAeAeAAAtQAAApgcAfQAEAOgFAQIgBABIggBYQAHABAHADQAQAGAKAQQAJAPgCASIAAABIAAABQgCARgLANIgBABQgpArhHAWIgGABIAAAAQgOACgMAAQgmAAgWgSgABmgRIABAAIAAAAg");
	this.shape_6.setTransform(30,30);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#CCCCCC").s().p("AhIC5QgSgNAAggIBJiyIgqAAIAAgXIB/AAIhNDeIBUgYQgjAlg+ASQgKACgIAAQgUAAgMgJgAgEhfQgRgRAAgXQAAgYARgRQAPgRAXAAQAYAAARARQAQARAAAYQAAAXgQARQgRARgYAAQgXAAgPgRg");
	this.shape_7.setTransform(29.8,29.9);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape_3}]},1).to({state:[{t:this.shape_6},{t:this.shape_5},{t:this.shape_4}]},1).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape_7}]},1).wait(1));

	// hit
	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("rgba(255,255,255,0)").s().p("AkrEsIAApXIJXAAIAAJXg");
	this.shape_8.setTransform(30,30);

	this.timeline.addTween(cjs.Tween.get(this.shape_8).wait(4));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,60,60);


(lib.BG_guide = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#EEFBFF").s().p("EhP/AmlMAAAhNKMCf/AAAMAAABNKg");
	this.shape.setTransform(512,358);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#D6E1E5").s().p("EhP/AnEIAAgfMCf/AAAIAAAfgEhP/gmlIAAgeMCf/AAAIAAAeg");
	this.shape_1.setTransform(512,358);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#F5FCFF").s().p("EgJIAmlMAAAhNKISRAAMAAABNKg");
	this.shape_2.setTransform(58.5,358);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#D6E1E5").s().p("EgJXAnEIAAgfISRAAMAAAhNKIyRAAIAAgeISuAAMAAABNoIAAAfg");
	this.shape_3.setTransform(60,358);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#F5FCFF").s().p("EgQ8AmlMAAAhNKMAh4AAAMAAABNKg");
	this.shape_4.setTransform(108.5,358);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#D6E1E5").s().p("EgRLAnEIAAgfMAh4AAAMAAAhNKMgh4AAAIAAgeMAiWAAAMAAABNoIAAAfg");
	this.shape_5.setTransform(110,358);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#F5FCFF").s().p("EgJHAmlMAAAhNKISQAAMAAABNKg");
	this.shape_6.setTransform(965.5,358);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#D6E1E5").s().p("EgJXAnEIAAgfMAAAhNoISvAAIAAAeIyQAAMAAABNKISQAAIAAAfg");
	this.shape_7.setTransform(964,358);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#F5FCFF").s().p("EgQ7AmlMAAAhNKMAh4AAAMAAABNKg");
	this.shape_8.setTransform(915.5,358);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#D6E1E5").s().p("EgRLAnEIAAgfMAAAhNoMAiXAAAIAAAeMgh4AAAMAAABNKMAh4AAAIAAAfg");
	this.shape_9.setTransform(914,358);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).to({state:[{t:this.shape_1},{t:this.shape},{t:this.shape_3},{t:this.shape_2}]},1).to({state:[{t:this.shape_1},{t:this.shape},{t:this.shape_5},{t:this.shape_4}]},1).to({state:[{t:this.shape_1},{t:this.shape},{t:this.shape_7},{t:this.shape_6},{t:this.shape_3},{t:this.shape_2}]},1).to({state:[{t:this.shape_1},{t:this.shape},{t:this.shape_5},{t:this.shape_4},{t:this.shape_7},{t:this.shape_6}]},1).to({state:[{t:this.shape_1},{t:this.shape},{t:this.shape_9},{t:this.shape_8},{t:this.shape_3},{t:this.shape_2}]},1).to({state:[{t:this.shape_1},{t:this.shape},{t:this.shape_9},{t:this.shape_8},{t:this.shape_5},{t:this.shape_4}]},1).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,108,1024,500);


(lib.mc_type_Science_Bg = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{Stage1:0,Stage2:1,Stage3:2,Stage4:3,Stage5:4,Stage6:5});

	// bg
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("EhP/A7/MAAAh3+MCf/AAAMAAAB3+g");
	this.shape.setTransform(512,384);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.rf(["#FFFFFF","#FFFFB8"],[0,1],-348.7,277.4,0,-348.7,277.4,970).s().p("EhP/AY4MAAAhKqMCf/AAAMAAABjlUhUrgAFhLUgY2g");
	this.shape_1.setTransform(512,318.7);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.rf(["#FFFFFF","#FFFF93"],[0,1],-197.2,164.6,0,-197.2,164.6,673.8).s().p("EhP/AWqMAAAgtTUBLUAY1BUrAAEIAAUag");
	this.shape_2.setTransform(512,623);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.rf(["#FFFFFF","#FFD7D7"],[0,1],-348.7,277.4,0,-348.7,277.4,970).s().p("EhP/AY4MAAAhKqMCf/AAAMAAABjlUhUrgAFhLUgY2g");
	this.shape_3.setTransform(512,318.7);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.rf(["#FFFFFF","#FFCBCB"],[0,1],-197.2,164.6,0,-197.2,164.6,673.8).s().p("EhP/AWqMAAAgtTUBLUAY1BUrAAEIAAUag");
	this.shape_4.setTransform(512,623);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.rf(["#FFFFFF","#C9FFF8"],[0,1],-348.7,277.4,0,-348.7,277.4,970).s().p("EhP/AY4MAAAhKqMCf/AAAMAAABjlUhUrgAFhLUgY2g");
	this.shape_5.setTransform(512,318.7);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.rf(["#FFFFFF","#B8FFF5"],[0,1],-197.2,164.6,0,-197.2,164.6,673.8).s().p("EhP/AWqMAAAgtTUBLUAY1BUrAAEIAAUag");
	this.shape_6.setTransform(512,623);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.rf(["#FFFFFF","#FFDEF0"],[0,1],-348.7,277.4,0,-348.7,277.4,970).s().p("EhP/AY4MAAAhKqMCf/AAAMAAABjlUhUrgAFhLUgY2g");
	this.shape_7.setTransform(512,318.7);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.rf(["#FFFFFF","#FFD7EC"],[0,1],-197.2,164.6,0,-197.2,164.6,673.8).s().p("EhP/AWqMAAAgtTUBLUAY1BUrAAEIAAUag");
	this.shape_8.setTransform(512,623);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.rf(["#FFFFFF","#DACDFF"],[0,1],-348.7,277.4,0,-348.7,277.4,970).s().p("EhP/AY4MAAAhKqMCf/AAAMAAABjlUhUrgAFhLUgY2g");
	this.shape_9.setTransform(512,318.7);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.rf(["#FFFFFF","#DACDFF"],[0,1],-197.2,164.6,0,-197.2,164.6,673.8).s().p("EhP/AWqMAAAgtTUBLUAY1BUrAAEIAAUag");
	this.shape_10.setTransform(512,623);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape}]}).to({state:[{t:this.shape_2},{t:this.shape_1}]},1).to({state:[{t:this.shape_4},{t:this.shape_3}]},1).to({state:[{t:this.shape_6},{t:this.shape_5}]},1).to({state:[{t:this.shape_8},{t:this.shape_7}]},1).to({state:[{t:this.shape_10},{t:this.shape_9}]},1).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,1024,768);


// stage content:
(lib.ui_canvas = function() {
	this.initialize();

	// Btn
	this.pbHint = new lib.pbInstructions();
	this.pbHint.setTransform(940.1,25);

	this.pbReset = new lib.pbReset();
	this.pbReset.setTransform(940.3,680.5);

	// Partition
	this.instance = new lib.BG_guide("single",0);
	this.instance.setTransform(512,385.2,1,1,0,0,0,512,385.2);

	// bg
	this.instance_1 = new lib.mc_type_Science_Bg("single",0);

	this.addChild(this.instance_1,this.instance,this.pbReset,this.pbHint);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(511,383,1026,770);

})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{});
var lib, images, createjs, ss;
