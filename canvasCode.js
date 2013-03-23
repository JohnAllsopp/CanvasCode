var canvasCode = {
	
	theCanvas: null, //get the canvas element and store it here,
	theContext: null, //the 2D drawing context for the canvas 
	theCodeField: null, //where we put the code
	currentAction: 0, //what's the current action chosen to do? 0 = none, 1 = drawRect, 2 = fillRect, 3 = clearRect, 4 = drawLine, 5 = drawText;
	statements: [], //an array of the statements we've drawn
	lastStatement: "", //the last statement we performed 
	drawing: false, // are we currently drawing?
	origin: {"x":0, "y":0}, // the offsettop and left of the element 
	startPoint: {"x":0, "y":0}, //a point with x, y coords where the most recent action started
	endPoint:  {"x":0, "y":0}, //a point with x, y coords where the most recent action ended
	lastRectBounds:  {"x":0, "y":0, "w":0, "h":0}, //bounds of the last rectangle we drew
	
	init: function(){
		//initialize, call on window load
		canvasCode.theCanvas = document.querySelector("#theCanvas");
		canvasCode.theCodeField = document.querySelector("#theCode");

		canvasCode.theCanvas.addEventListener("mousedown", canvasCode.routeEvent, false)
		canvasCode.theCanvas.addEventListener("mousemove", canvasCode.routeEvent, false)
		canvasCode.theCanvas.addEventListener("mouseup", canvasCode.routeEvent, false)
		
		canvasCode.theContext = canvasCode.theCanvas.getContext('2d');
		canvasCode.origin.x = canvasCode.theCanvas.offsetLeft;
		canvasCode.origin.y = canvasCode.theCanvas.offsetTop;
		
		canvasCode.theContext
		
	},
	
	getStartPoint: function(){
		//return the start point relative to the canvas element itself
		var relativeStartPoint = {};
		relativeStartPoint.x = canvasCode.startPoint.x - canvasCode.theCanvas.offsetLeft;
		relativeStartPoint.y = canvasCode.startPoint.y - canvasCode.theCanvas.offsetTop;	
		
		return relativeStartPoint	
	},

	getEndPoint: function(){
		//return the end point relative to the canvas element itself
		var relativeEndPoint = {};
		relativeEndPoint.x = canvasCode.endPoint.x - canvasCode.theCanvas.offsetLeft;
		relativeEndPoint.y = canvasCode.endPoint.y - canvasCode.theCanvas.offsetTop;
		
		return relativeEndPoint
	},
	
	chooseAction: function(theAction) {
		canvasCode.currentAction = theAction;

	},
	
	startRectangle: function(evt) {
		canvasCode.drawing = true;
		theCanvas.classList.toggle("drawingRect");
		canvasCode.startPoint.x = evt.clientX;
		canvasCode.startPoint.y = evt.clientY;
	},

	startLine: function(evt) {
		canvasCode.drawing = true;
		theCanvas.classList.toggle("drawingLine");
		canvasCode.startPoint.x = evt.clientX;
		canvasCode.startPoint.y = evt.clientY;
	},
	
	drawAllStatements: function(){
		//cleaer the canvas and draw all of the statements so far
		
		canvasCode.theCanvas.width = canvasCode.theCanvas.width + 1;
		canvasCode.theCanvas.width = canvasCode.theCanvas.width - 1;
		//this clears the whole canvas
		
		for (var i=0; i < canvasCode.statements.length; i++) {
			eval(canvasCode.statements[i])
		};		
	},
	
	clearLastRectangle: function(){
		//clear the last rectangle
		
		var lineWidth = canvasCode.theContext.lineWidth;
		
		canvasCode.theContext.clearRect(canvasCode.lastRectBounds.x - lineWidth, canvasCode.lastRectBounds.y - lineWidth, canvasCode.lastRectBounds.w + 2*lineWidth, canvasCode.lastRectBounds.h + 2* lineWidth); 
	},
	
	drawRectangle: function(evt){
		
		if (canvasCode.drawing) {
			
			var lineWidth = canvasCode.theContext.lineWidth;
		
			canvasCode.endPoint.x = evt.clientX;
			canvasCode.endPoint.y = evt.clientY;
			
			// canvasCode.clearLastRectangle()
								
			canvasCode.lastRectBounds.x = canvasCode.getStartPoint().x;
			canvasCode.lastRectBounds.y = canvasCode.getStartPoint().y;
			canvasCode.lastRectBounds.w = canvasCode.getEndPoint().x - canvasCode.getStartPoint().x;
			canvasCode.lastRectBounds.h = canvasCode.getEndPoint().y - canvasCode.getStartPoint().y;
			
			canvasCode.drawAllStatements()
			canvasCode.theContext.strokeRect(canvasCode.lastRectBounds.x, canvasCode.lastRectBounds.y, canvasCode.lastRectBounds.w, canvasCode.lastRectBounds.h);			
	
			canvasCode.lastInstruction = "canvasCode.theContext.strokeRect(" + parseInt(canvasCode.lastRectBounds.x) + ","
			+ parseInt(canvasCode.lastRectBounds.y) + "," + parseInt(canvasCode.lastRectBounds.w)
			+ ","  + parseInt(canvasCode.lastRectBounds.h) + ")"
		}
	},

	drawLine: function(evt){
		
		if (canvasCode.drawing) {
			
			var lineWidth = canvasCode.theContext.lineWidth;
		
			canvasCode.endPoint.x = evt.clientX;
			canvasCode.endPoint.y = evt.clientY;
			
			canvasCode.clearLastRectangle()
			
			canvasCode.lastRectBounds.x = canvasCode.getStartPoint().x;
			canvasCode.lastRectBounds.y = canvasCode.getStartPoint().y;
			canvasCode.lastRectBounds.w = canvasCode.getEndPoint().x - canvasCode.getStartPoint().x;
			canvasCode.lastRectBounds.h = canvasCode.getEndPoint().y - canvasCode.getStartPoint().y;
			
			canvasCode.drawAllStatements()
			
			canvasCode.theContext.beginPath()
			canvasCode.theContext.moveTo(canvasCode.getStartPoint().x, canvasCode.getStartPoint().y);
			canvasCode.theContext.lineTo(canvasCode.getEndPoint().x, canvasCode.getEndPoint().y);
			canvasCode.theContext.closePath()
			canvasCode.theContext.stroke();
				
			canvasCode.lastInstruction = "canvasCode.theContext.beginPath();"
			+ "canvasCode.theContext.moveTo(" + parseInt(canvasCode.getStartPoint().x) + ","
			+ parseInt(canvasCode.getStartPoint().y) 
			+ "); canvasCode.theContext.lineTo(" + parseInt(canvasCode.getEndPoint().x)
			+ ","  + parseInt(canvasCode.getEndPoint().y) + "); canvasCode.theContext.closePath(); canvasCode.theContext.stroke();"
		}
	},

	fillRectangle: function(evt){
		
		if (canvasCode.drawing) {

			var lineWidth = canvasCode.theContext.lineWidth;
		
			canvasCode.endPoint.x = evt.clientX;
			canvasCode.endPoint.y = evt.clientY;
			
			canvasCode.clearLastRectangle()						
			
			canvasCode.lastRectBounds.x = canvasCode.getStartPoint().x;
			canvasCode.lastRectBounds.y = canvasCode.getStartPoint().y;
			canvasCode.lastRectBounds.w = canvasCode.getEndPoint().x - canvasCode.getStartPoint().x;
			canvasCode.lastRectBounds.h = canvasCode.getEndPoint().y - canvasCode.getStartPoint().y;
			
			canvasCode.drawAllStatements()
			
			canvasCode.theContext.fillRect(canvasCode.lastRectBounds.x, canvasCode.lastRectBounds.y, canvasCode.lastRectBounds.w, canvasCode.lastRectBounds.h);			
	
			canvasCode.lastInstruction = "canvasCode.theContext.fillRect(" + parseInt(canvasCode.lastRectBounds.x) + ","
			+ parseInt(canvasCode.lastRectBounds.y) + "," + parseInt(canvasCode.lastRectBounds.w)
			+ ","  + parseInt(canvasCode.lastRectBounds.h) + ")"
		}
	},

	clearRectangle: function(evt){
		
		if (canvasCode.drawing) {
		
			canvasCode.endPoint.x = evt.clientX;
			canvasCode.endPoint.y = evt.clientY;
			
			var lineWidth = canvasCode.theContext.lineWidth

			canvasCode.theContext.clearRect(canvasCode.lastRectBounds.x, canvasCode.lastRectBounds.y, canvasCode.lastRectBounds.w, canvasCode.lastRectBounds.h);
						
			canvasCode.lastRectBounds.x = canvasCode.getStartPoint().x;
			canvasCode.lastRectBounds.y = canvasCode.getStartPoint().y;
			canvasCode.lastRectBounds.w = canvasCode.getEndPoint().x - canvasCode.getStartPoint().x;
			canvasCode.lastRectBounds.h = canvasCode.getEndPoint().y - canvasCode.getStartPoint().y;

			canvasCode.theContext.clearRect(canvasCode.lastRectBounds.x, canvasCode.lastRectBounds.y, canvasCode.lastRectBounds.w, canvasCode.lastRectBounds.h);

			canvasCode.lastInstruction =  "canvasCode.theContext.clearRect(" + parseInt(canvasCode.lastRectBounds.x) + ","
			+ parseInt(canvasCode.lastRectBounds.y) + "," + parseInt(canvasCode.lastRectBounds.w)
			+ ","  + parseInt(canvasCode.lastRectBounds.h) + ")"
		}
	},

	
	endRectangle: function(evt){
		if (canvasCode.drawing) {
			theCanvas.classList.toggle("drawingRect");
			canvasCode.drawing = false;
			
			canvasCode.lastRectBounds.x = 0;
			canvasCode.lastRectBounds.y = 0;
			canvasCode.lastRectBounds.w = 0;
			canvasCode.lastRectBounds.h = 0;
			
			canvasCode.statements.push(canvasCode.lastInstruction);
			console.log(canvasCode.lastInstruction)
			
			canvasCode.theCodeField.innerHTML = ""
			for (var i=0; i < canvasCode.statements.length; i++) {
				canvasCode.theCodeField.innerHTML = canvasCode.theCodeField.innerHTML + "<p>" +canvasCode.statements[i]
			};
			
			
		}

	},

	endLine: function(evt){
		if (canvasCode.drawing) {
			theCanvas.classList.toggle("drawingLine");
			canvasCode.drawing = false;
			
			canvasCode.lastRectBounds.x = 0;
			canvasCode.lastRectBounds.y = 0;
			canvasCode.lastRectBounds.w = 0;
			canvasCode.lastRectBounds.h = 0;

			canvasCode.statements.push(canvasCode.lastInstruction);
			canvasCode.theCodeField.innerHTML = ""
			for (var i=0; i < canvasCode.statements.length; i++) {
				canvasCode.theCodeField.innerHTML = canvasCode.theCodeField.innerHTML + "<p>" +canvasCode.statements[i]
			};
		}

	},
	
	chooseFillColor: function(){
		//choose the fill color
	},
	
	routeEvent: function(evt){
		//route mouse and key events to handle user input in the canvas
		
		switch(evt.type) {
			
			case "mousedown":
				canvasCode.startDraw(evt);
				break;
			
			case "mousemove":
				canvasCode.draw(evt);
				break;

			case "mouseup":
				canvasCode.endDraw(evt);
				break;
			
		}
		
	},
	
	startDraw: function(evt) {
		
		switch(canvasCode.currentAction) {
			
			case 0:
				break;
			
			case 1:
				canvasCode.startRectangle(evt);
				break;

			case 2:
				canvasCode.startRectangle(evt);
				break;

			case 3:
				canvasCode.startRectangle(evt);
				break;

			case 4:
				canvasCode.startLine(evt);
				break;
		}
		
	},
	
	endDraw: function(evt) {
		
		switch(canvasCode.currentAction) {
			
			case 0:
				break;
			
			case 1:
				canvasCode.endRectangle(evt);
				break;

			case 2:
				canvasCode.endRectangle(evt);
				break;

			case 3:
				canvasCode.endRectangle(evt);
				break;

			case 4:
				canvasCode.endLine(evt);
				break;
		}
		
	},

	draw: function(evt) {
		
		switch(canvasCode.currentAction) {
			
			case 0:
				break;
			
			case 1:
				canvasCode.drawRectangle(evt);
				break;

			case 2:
				canvasCode.fillRectangle(evt);
				break;

			case 3:
				canvasCode.clearRectangle(evt);
				break;		

			case 4:
				canvasCode.drawLine(evt);
				break;			
		}
		
	},
	
	chooseCompositingMode: function(mode){
		canvasCode.theContext.globalCompositeOperation = mode
	}
	
}


window.addEventListener("load", canvasCode.init, false)