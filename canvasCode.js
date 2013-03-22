var canvasCode = {
	
	theCanvas: null, //get the canvas element and store it here,
	theContext: null, //the 2D drawing context for the canvas 
	theCodeField: null, //where we put the code
	currentAction: 0, //what's the current action chosen to do? 0 = none, 1 = drawRect, 2 = fillRect, 3 = clearRect, 4 = drawLine, 5 = drawText
	drawing: false, // are we currently drawing?
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
		
		// canvasCode.theContext.strokeRect(10,10,40,49)
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
	
	drawRectangle: function(evt){
		
		if (canvasCode.drawing) {
		
			canvasCode.endPoint.x = evt.clientX;
			canvasCode.endPoint.y = evt.clientY;
			
			var xOrigin = Math.min(canvasCode.endPoint.x, canvasCode.startPoint.x) //if they drag right to left, 
			var lineWidth = canvasCode.theContext.lineWidth
			// canvasCode.theContext.clearRect(canvasCode.startPoint.x - 10, canvasCode.startPoint.y - 10, canvasCode.endPoint.x - canvasCode.startPoint.x + 20, canvasCode.endPoint.y - canvasCode.startPoint.y + 20);

			canvasCode.theContext.clearRect(canvasCode.lastRectBounds.x - lineWidth, canvasCode.lastRectBounds.y - lineWidth, canvasCode.lastRectBounds.w + 2*lineWidth, canvasCode.lastRectBounds.h + 2* lineWidth);
			
			canvasCode.theCodeField.innerHTML = canvasCode.theCodeField.innerHTML +  "<p>theContext.clearRect(" + parseInt(canvasCode.lastRectBounds.x) + ","
			+ parseInt(canvasCode.lastRectBounds.y) + "," + parseInt(canvasCode.lastRectBounds.w)
			+ ","  + parseInt(canvasCode.lastRectBounds.h) + ")</p>"
			
			
			
			canvasCode.lastRectBounds.x = canvasCode.startPoint.x;
			canvasCode.lastRectBounds.y = canvasCode.startPoint.y;
			canvasCode.lastRectBounds.w = canvasCode.endPoint.x - canvasCode.startPoint.x;
			canvasCode.lastRectBounds.h = canvasCode.endPoint.y - canvasCode.startPoint.y;
			
			canvasCode.theContext.strokeRect(canvasCode.lastRectBounds.x, canvasCode.lastRectBounds.y, canvasCode.lastRectBounds.w, canvasCode.lastRectBounds.h);			
	
			canvasCode.theCodeField.innerHTML = canvasCode.theCodeField.innerHTML +  "<p>theContext.strokeRect(" + parseInt(canvasCode.lastRectBounds.x) + ","
			+ parseInt(canvasCode.lastRectBounds.y) + "," + parseInt(canvasCode.lastRectBounds.w)
			+ ","  + parseInt(canvasCode.lastRectBounds.h) + ")</p>"
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
		}
		
	},
	
	endDraw: function(evt) {
		
		switch(canvasCode.currentAction) {
			
			case 0:
				break;
			
			case 1:
				canvasCode.endRectangle(evt);
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
		}
		
	}
	
}


window.addEventListener("load", canvasCode.init, false)