var canvasCode = {
	
	theCanvas: null, //get the canvas element and store it here
	currentAction: 0, //what's the current action chosen to do? 0 = none, 1 = drawRect, 2 = fillRect, 3 = clearRect, 4 = drawLine, 5 = drawText
	
	startPoint: {"x":0, "y":0}, //a point with x, y coords where the most recent action started
	endPoint: [0, 0], //a point with x, y coords where the most recent action ended
	 
	
	init: function(){
		//initialize, call on window load
		canvasCode.theCanvas = document.querySelector("#theCanvas");
		canvasCode.theCanvas.addEventListener("mousedown", canvasCode.routeEvent, false)
		canvasCode.theCanvas.addEventListener("mousemoves", canvasCode.routeEvent, false)
		canvasCode.theCanvas.addEventListener("mouseup", canvasCode.routeEvent, false)
	},
	
	chooseAction: function(theAction) {
		currentAction = theAction;

	},
	
	startRectangle: function(evt) {
		canvasCode.startPoint.x = evt.offsetX;
		canvasCode.startPoint.y = evt.offsetY;
		
	},
	
	endRectangle: function(evt){
		canvasCode.endPoint.x = evt.offsetX;
		canvasCode.endPoint.y = evt.offsetY;
		
		canvasCode.theCanvas.strokeRect(canvasCode.startPoint.x, canvasCode.startPoint.y, canvasCode.endPoint.x - canvasCode.startPoint.x, canvasCode.endPoint.y - canvasCode.startPoint.y)
		
	},
	
	chooseFillColor: function(){
		//choose the fill color
	},
	
	routeEvent: function(evt){
		//route mouse and key events to handle user input in the canvas
		
		switch(evt.type) {
			
			case "mousedown":
				canvasCode.startRectangle(evt);
				break;
			
			case "mousemove":
				canvasCode.endRectangle(evt);
				break;

			case "mouseup":
				canvasCode.endRectangle(evt);
				break;
			
		}
		
		
	}
}


window.addEventListener("load", canvasCode.init, false)