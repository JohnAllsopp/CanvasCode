var canvasCode = {
	
	theCanvas: null, //get the canvas element and store it here,
	theContext: null, //the 2D drawing context for the canvas 
	theCodeField: null, //where we put the code
	theCodeMirror: null, //the code mirror instance if it was initialized
	currentAction: 0, //what's the current action chosen to do? 0 = none, 1 = drawRect, 2 = fillRect, 3 = clearRect, 4 = drawLine, 5 = drawText;
	statements: [], //an array of the statements we've drawn
	lastStatement: "", //the last statement we performed 
	drawing: false, // are we currently drawing?
	origin: {"x":0, "y":0}, // the offsettop and left of the element 
	startPoint: {"x":0, "y":0}, //a point with x, y coords where the most recent action started
	endPoint:  {"x":0, "y":0}, //a point with x, y coords where the most recent action ended
	lastRectBounds:  {"x":0, "y":0, "w":0, "h":0}, //bounds of the last rectangle we drew
	strokeCurrentPath: false, //when we close the current path do we stroke it?
	filleCurrentPath: false, //when we close the current path do we fill it?
	currentString: "", //the current string if any we are drawing
	init: function(){
		//initialize, call on window load
		canvasCode.theCanvas = document.querySelector("#theCanvas");
		canvasCode.theCodeField = document.querySelector("#theCode");
		
		canvasCode.theCanvas.addEventListener("mousedown", canvasCode.routeEvent, false)
		canvasCode.theCanvas.addEventListener("mousemove", canvasCode.routeEvent, false)
		canvasCode.theCanvas.addEventListener("mouseup", canvasCode.routeEvent, false)
		canvasCode.theCanvas.addEventListener("keypress", canvasCode.routeEvent, false)
		
		canvasCode.theContext = canvasCode.theCanvas.getContext('2d');
		canvasCode.origin.x = canvasCode.theCanvas.offsetLeft;
		canvasCode.origin.y = canvasCode.theCanvas.offsetTop;
		
		canvasCode.initCodeMirror()
	},
	
	clearCanvas: function(){
		canvasCode.statements = [];
		canvasCode.drawAllStatements();
		canvasCode.printCode();
	},
	
	getStartPoint: function(){
		//return the start point relative to the canvas element itself
		var relativeStartPoint = {};
		
		var rect = canvasCode.theCanvas.getBoundingClientRect();
 
		// relativeStartPoint.x = canvasCode.startPoint.x - canvasCode.theCanvas.offsetLeft;
		// relativeStartPoint.y = canvasCode.startPoint.y - canvasCode.theCanvas.offsetTop;	
		relativeStartPoint.x = canvasCode.startPoint.x - rect.left;
		relativeStartPoint.y = canvasCode.startPoint.y - rect.top;	
		
		return relativeStartPoint	
	},

	getEndPoint: function(){
		//return the end point relative to the canvas element itself
		var relativeEndPoint = {};

		var rect = canvasCode.theCanvas.getBoundingClientRect();

		relativeEndPoint.x = canvasCode.endPoint.x - rect.left;
		relativeEndPoint.y = canvasCode.endPoint.y - rect.top;
		
		
		// relativeEndPoint.x = canvasCode.endPoint.x - canvasCode.theCanvas.offsetLeft;
		// relativeEndPoint.y = canvasCode.endPoint.y - canvasCode.theCanvas.offsetTop;
		
		return relativeEndPoint
	},
	
	chooseAction: function(theAction) {
		
		
		canvasCode.endDraw();
		canvasCode.currentAction = theAction;

	},
	
	startRectangle: function(evt) {
		canvasCode.drawing = true;
		canvasCode.theCanvas.classList.toggle("drawingRect");
		canvasCode.startPoint.x = evt.clientX;
		canvasCode.startPoint.y = evt.clientY;
	},

	startLine: function(evt) {
		canvasCode.drawing = true;
		canvasCode.theCanvas.classList.toggle("drawingLine");
		canvasCode.startPoint.x = evt.clientX;
		canvasCode.startPoint.y = evt.clientY;
		
	},
	

	startCircle: function(evt) {
		canvasCode.drawing = true;
		canvasCode.theCanvas.classList.toggle("drawingCircle");
		canvasCode.startPoint.x = evt.clientX;
		canvasCode.startPoint.y = evt.clientY;
	},
	
	startPolygon: function(evt) {
		canvasCode.drawing = true;
		canvasCode.theCanvas.classList.toggle("drawingPolygon");
		canvasCode.startPoint.x = evt.clientX;
		canvasCode.startPoint.y = evt.clientY;
	},
	
	startText: function(evt) {
		canvasCode.theCanvas.focus()
		canvasCode.drawing = true;
		canvasCode.theCanvas.classList.toggle("drawingText");
		canvasCode.startPoint.x = evt.clientX;
		canvasCode.startPoint.y = evt.clientY;
	},
	
	drawAllStatements: function(){
		//clear the canvas and draw all of the statements so far
		
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
	
			canvasCode.lastInstruction = "//stroke a rectangle\n" 
			canvasCode.lastInstruction += "canvasCode.theContext.strokeRect(" + parseInt(canvasCode.lastRectBounds.x) + ", "
			+ parseInt(canvasCode.lastRectBounds.y) + ", " + parseInt(canvasCode.lastRectBounds.w)
			+ ", "  + parseInt(canvasCode.lastRectBounds.h) + ")";
			
			canvasCode.theCodeMirror.setValue(canvasCode.getCode() + "\n\n" + canvasCode.lastInstruction)
			
		}
	},

	drawCircle: function(evt){
		
		if (canvasCode.drawing) {
				
			canvasCode.endPoint.x = evt.clientX;
			canvasCode.endPoint.y = evt.clientY;
											
			canvasCode.lastRectBounds.x = canvasCode.getStartPoint().x;
			canvasCode.lastRectBounds.y = canvasCode.getStartPoint().y;
			canvasCode.lastRectBounds.w = canvasCode.getEndPoint().x - canvasCode.getStartPoint().x;
			canvasCode.lastRectBounds.h = canvasCode.getEndPoint().y - canvasCode.getStartPoint().y;
			
			canvasCode.drawAllStatements() //draw the previous statements
			
			var center = {};
			center.x = canvasCode.getStartPoint().x;
			center.y = canvasCode.getStartPoint().y;
			
			var radius = Math.sqrt(Math.pow(canvasCode.lastRectBounds.w, 2) + Math.pow(canvasCode.lastRectBounds.h, 2)).toFixed(2)
			//diagonal distance from top left to bottom right of bounding rectangle
			//good old pythagorus
			
			canvasCode.theContext.beginPath();
			canvasCode.theContext.arc(center.x,center.y,radius,0,Math.PI*2,true); // Outer circle
			// canvasCode.theContext.closePath()
			canvasCode.theContext.stroke();

			canvasCode.lastInstruction = "//draw a circle\n" 
			canvasCode.lastInstruction += "canvasCode.theContext.beginPath();\n"
			+ "canvasCode.theContext.arc(" + parseInt(center.x) + ", "
			+ parseInt(center.y) + ", " + radius + ", 0, Math.PI*2,true);\n"
			+ "canvasCode.theContext.closePath();" 		
			+ "\ncanvasCode.theContext.stroke();";
			
			canvasCode.theCodeMirror.setValue(canvasCode.getCode() + "\n\n" + canvasCode.lastInstruction)
		}
	},
	
	fillCircle: function(evt){
		
		if (canvasCode.drawing) {
				
			canvasCode.endPoint.x = evt.clientX;
			canvasCode.endPoint.y = evt.clientY;
											
			canvasCode.lastRectBounds.x = canvasCode.getStartPoint().x;
			canvasCode.lastRectBounds.y = canvasCode.getStartPoint().y;
			canvasCode.lastRectBounds.w = canvasCode.getEndPoint().x - canvasCode.getStartPoint().x;
			canvasCode.lastRectBounds.h = canvasCode.getEndPoint().y - canvasCode.getStartPoint().y;
			
			canvasCode.drawAllStatements() //draw the previous statements
			
			var center = {};
			center.x = canvasCode.getStartPoint().x;
			center.y = canvasCode.getStartPoint().y;
			
			var radius = Math.sqrt(Math.pow(canvasCode.lastRectBounds.w, 2) + Math.pow(canvasCode.lastRectBounds.h, 2)).toFixed(2)
			//diagonal distance from top left to bottom right of bounding rectangle
			//good old pythagorus
			
			canvasCode.theContext.beginPath();
			canvasCode.theContext.arc(center.x,center.y,radius,0,Math.PI*2,true); // Outer circle
			canvasCode.theContext.closePath()
			canvasCode.theContext.fill();

			canvasCode.lastInstruction = "//fill a circle\n" 
			canvasCode.lastInstruction += "canvasCode.theContext.beginPath();\n"
			+ "canvasCode.theContext.arc(" + parseInt(center.x) + ", "
			+ parseInt(center.y) + ", " + radius + ", 0, Math.PI*2,true);\n"
			+ "canvasCode.theContext.closePath();" 		
			+ "\ncanvasCode.theContext.fill();";
			
			canvasCode.theCodeMirror.setValue(canvasCode.getCode() + "\n\n" + canvasCode.lastInstruction)
			
		}
	},
	
	drawPolygon: function(evt) {
		
		if (canvasCode.drawing) {
				
			canvasCode.endPoint.x = evt.clientX;
			canvasCode.endPoint.y = evt.clientY;
											
			canvasCode.lastRectBounds.x = canvasCode.getStartPoint().x;
			canvasCode.lastRectBounds.y = canvasCode.getStartPoint().y;
			canvasCode.lastRectBounds.w = canvasCode.getEndPoint().x - canvasCode.getStartPoint().x;
			canvasCode.lastRectBounds.h = canvasCode.getEndPoint().y - canvasCode.getStartPoint().y;
			
			canvasCode.drawAllStatements() //draw the previous statements
			
			var center = {};
			center.x = canvasCode.getStartPoint().x;
			center.y = canvasCode.getStartPoint().y;
			
			var numberOfSides = document.querySelector("#polygonSides").value;
			
			var radius = Math.sqrt(Math.pow(canvasCode.lastRectBounds.w, 2) + Math.pow(canvasCode.lastRectBounds.h, 2)).toFixed(2)
			//diagonal distance from top left to bottom right of bounding rectangle
			//good old pythagorus
			var steps = "//draw a polygon with " + parseInt(numberOfSides) + " sides"
			 //add the strong representation of each step to this as we go
			
			canvasCode.theContext.moveTo (center.x +  radius * Math.cos(0), center.x +  radius  *  Math.sin(0));
			steps = steps + "\ncanvasCode.theContext.moveTo (" 
			+ parseInt(center.x +  radius * Math.cos(0)) + ", " + parseInt(center.x +  radius  *  Math.sin(0)) + ");"
			
			canvasCode.theContext.beginPath();
			steps = steps + "\ncanvasCode.theContext.beginPath();"
			
			
			for (var i = 1; i <= numberOfSides;i += 1) {
			    canvasCode.theContext.lineTo (center.x + radius * Math.cos(i * 2 * Math.PI / numberOfSides), center.y + radius * Math.sin(i * 2 * Math.PI / numberOfSides));
				steps = steps + "\n" + "canvasCode.theContext.lineTo ("
				+ parseInt(center.x + radius * Math.cos(i * 2 * Math.PI / numberOfSides)) + ", " 
				+ parseInt(center.y + radius * Math.sin(i * 2 * Math.PI / numberOfSides)) + ");"
			}

			canvasCode.theContext.closePath()
			canvasCode.theContext.stroke();
			
			steps = steps + "\ncanvasCode.theContext.closePath()"
			+ "\ncanvasCode.theContext.stroke();"
			
			canvasCode.lastInstruction = steps;
			
			canvasCode.theCodeMirror.setValue(canvasCode.getCode() + "\n\n" + canvasCode.lastInstruction)
			
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
				
			canvasCode.lastInstruction = "//draw a line\n" 
			canvasCode.lastInstruction += "canvasCode.theContext.beginPath();\n"
			+ "canvasCode.theContext.moveTo(" + parseInt(canvasCode.getStartPoint().x) + ", "
			+ parseInt(canvasCode.getStartPoint().y) 
			+ ");\ncanvasCode.theContext.lineTo(" + parseInt(canvasCode.getEndPoint().x)
			+ ", "  + parseInt(canvasCode.getEndPoint().y) + ");\ncanvasCode.theContext.closePath();" 		
			+ "\ncanvasCode.theContext.stroke();";
			
			canvasCode.theCodeMirror.setValue(canvasCode.getCode() + "\n\n" + canvasCode.lastInstruction)
			
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
	
			canvasCode.lastInstruction = "//fill a rectangle\n" 
 			canvasCode.lastInstruction += "canvasCode.theContext.fillRect(" + parseInt(canvasCode.lastRectBounds.x) + ", "
			+ parseInt(canvasCode.lastRectBounds.y) + ", " + parseInt(canvasCode.lastRectBounds.w)
			+ ", "  + parseInt(canvasCode.lastRectBounds.h) + ");";
			
			canvasCode.theCodeMirror.setValue(canvasCode.getCode() + "\n\n" + canvasCode.lastInstruction)
			
		}
	},

	drawText: function(evt){
		//draw a string of text
		if (canvasCode.drawing) {
			
			//add the character associated with the keypress event to the buffer
			
			if (evt.keyCode == 13) {
				//hitting return ends the current string
				canvasCode.endText();
				return
			}
			
			canvasCode.currentString = canvasCode.currentString + String.fromCharCode(evt.keyCode || evt.charCode)
			  
			
			canvasCode.endPoint.x = evt.clientX;
			canvasCode.endPoint.y = evt.clientY;
						
			canvasCode.lastRectBounds.x = canvasCode.getStartPoint().x;
			canvasCode.lastRectBounds.y = canvasCode.getStartPoint().y;
			canvasCode.lastRectBounds.w = canvasCode.getEndPoint().x - canvasCode.getStartPoint().x;
			canvasCode.lastRectBounds.h = canvasCode.getEndPoint().y - canvasCode.getStartPoint().y;
			
			canvasCode.drawAllStatements()
			
			canvasCode.theContext// .save();
			// 			canvasCode.theContext.translate(canvasCode.getStartPoint().x, canvasCode.getStartPoint().y)
			// canvasCode.theContext.rotate(Math.PI/4)
			// canvasCode.theContext.fillText(canvasCode.currentString, 0, 0);
			canvasCode.theContext.fillText(canvasCode.currentString, canvasCode.getStartPoint().x, canvasCode.getStartPoint().y);
			// canvasCode.theContext.restore();
			
			canvasCode.lastInstruction = "//draw some text\n" 
 			canvasCode.lastInstruction += "canvasCode.theContext.fillText('" + canvasCode.currentString + "', " +parseInt(canvasCode.getStartPoint().x) + ", " + parseInt(canvasCode.getStartPoint().y) + ");";
			
			canvasCode.theCodeMirror.setValue(canvasCode.getCode() + "\n\n" + canvasCode.lastInstruction)
			
			evt.preventDefault()
		}
	},


	clearRectangle: function(evt){
		
		if (canvasCode.drawing) {
		
			canvasCode.endPoint.x = evt.clientX;
			canvasCode.endPoint.y = evt.clientY;
								
			canvasCode.lastRectBounds.x = canvasCode.getStartPoint().x;
			canvasCode.lastRectBounds.y = canvasCode.getStartPoint().y;
			canvasCode.lastRectBounds.w = canvasCode.getEndPoint().x - canvasCode.getStartPoint().x;
			canvasCode.lastRectBounds.h = canvasCode.getEndPoint().y - canvasCode.getStartPoint().y;

			canvasCode.drawAllStatements()
			canvasCode.theContext.clearRect(canvasCode.lastRectBounds.x, canvasCode.lastRectBounds.y, canvasCode.lastRectBounds.w, canvasCode.lastRectBounds.h);

			canvasCode.lastInstruction = "//clear a rectangle\n" 
 			canvasCode.lastInstruction +=  "canvasCode.theContext.clearRect(" + parseInt(canvasCode.lastRectBounds.x) + ", "
			+ parseInt(canvasCode.lastRectBounds.y) + ", " + parseInt(canvasCode.lastRectBounds.w)
			+ ", "  + parseInt(canvasCode.lastRectBounds.h) + ");";
			
			canvasCode.theCodeMirror.setValue(canvasCode.getCode() + "\n\n" + canvasCode.lastInstruction)
			
		}
	},

	
	endRectangle: function(evt){
		if (canvasCode.drawing) {
			canvasCode.theCanvas.classList.toggle("drawingRect");
			canvasCode.drawing = false;
			
			canvasCode.lastRectBounds.x = 0;
			canvasCode.lastRectBounds.y = 0;
			canvasCode.lastRectBounds.w = 0;
			canvasCode.lastRectBounds.h = 0;
			
			canvasCode.statements.push(canvasCode.lastInstruction);
			canvasCode.printCode()
			
			
		}

	},
	
	endText: function(evt){
		if (canvasCode.drawing) {
			canvasCode.theCanvas.classList.toggle("drawingText");
			canvasCode.drawing = false;
			
			canvasCode.lastRectBounds.x = 0;
			canvasCode.lastRectBounds.y = 0;
			canvasCode.lastRectBounds.w = 0;
			canvasCode.lastRectBounds.h = 0;
			
			canvasCode.statements.push(canvasCode.lastInstruction);
			canvasCode.printCode();
			canvasCode.currentString = ""; //get rid of the curent string buffer
			
			
		}

	},

	endLine: function(evt){
		if (canvasCode.drawing) {
			canvasCode.theCanvas.classList.toggle("drawingLine");
			canvasCode.drawing = false;
			
			canvasCode.lastRectBounds.x = 0;
			canvasCode.lastRectBounds.y = 0;
			canvasCode.lastRectBounds.w = 0;
			canvasCode.lastRectBounds.h = 0;

			canvasCode.statements.push(canvasCode.lastInstruction);
			canvasCode.printCode()
		}

	},

	endCircle: function(evt){
		if (canvasCode.drawing) {
			canvasCode.theCanvas.classList.toggle("drawingCircle");
			canvasCode.drawing = false;
			
			canvasCode.lastRectBounds.x = 0;
			canvasCode.lastRectBounds.y = 0;
			canvasCode.lastRectBounds.w = 0;
			canvasCode.lastRectBounds.h = 0;
			
			
			canvasCode.statements.push(canvasCode.lastInstruction);
			canvasCode.printCode()
		}

	},

	endPolygon: function(evt){
		if (canvasCode.drawing) {
			canvasCode.theCanvas.classList.toggle("drawingPolygon");
			canvasCode.drawing = false;
			
			canvasCode.lastRectBounds.x = 0;
			canvasCode.lastRectBounds.y = 0;
			canvasCode.lastRectBounds.w = 0;
			canvasCode.lastRectBounds.h = 0;

			canvasCode.statements.push(canvasCode.lastInstruction);
			canvasCode.printCode()
		}

	},
	
	getCode: function(){
		//get the currently completed code (not the statement we are currently executing)
		
		var theCode = ""
		for (var i=0; i < canvasCode.statements.length; i++) {
			theCode =   theCode + "\n\n" + canvasCode.statements[i] 
		};
		
		return theCode;
		
	},
	
	printCode: function(){
		//print the current finished code to the code fields 
		canvasCode.theCodeField.innerHTML = "\n"
		var theCode = canvasCode.getCode();

		if (canvasCode.theCodeField.innerText) {
			canvasCode.theCodeField.innerText = theCode
		}
		
		else {
			canvasCode.theCodeField.textContent = theCode
		}
		
		if (canvasCode.theCodeMirror) {
			canvasCode.theCodeMirror.setValue(theCode)
		}
		
		// canvasCode.lastInstruction = "";

		
	},
	
	chooseFillColor: function(){
		//choose the fill color
	},
	
	routeEvent: function(evt){
		//route mouse and key events to handle user input in the canvas
		
		switch(evt.type) {
			
			case "mousedown":
				if(canvasCode.currentAction == 5) {
					//draw events are a little different, so we check to see if we need to end a current one 
					canvasCode.endDraw(evt)
				}
				canvasCode.startDraw(evt);
				break;
			
			case "mousemove":
				canvasCode.draw(evt);
				break;

			case "mouseup":
			
				if(canvasCode.currentAction!==5) {
					//nouseup doesn't end drawtext
					canvasCode.endDraw(evt);
				}
				break;

			case "keypress":
				canvasCode.drawText(evt);
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

			case 5:
				canvasCode.startText(evt);
				break;
				
			case 6:
				canvasCode.startCircle(evt);
				break;

			case 7:
				canvasCode.startCircle(evt);
				break;

			case 8:
				canvasCode.startCircle(evt);
				break;

			case 9:
				canvasCode.startPolygon(evt);
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

			case 5:
				canvasCode.endText(evt);
				break;

			case 6:
				canvasCode.endCircle(evt);
				break;

			case 7:
				canvasCode.endCircle(evt);
				break;

			case 8:
				canvasCode.endCircle(evt);
				break;

			case 9:
				canvasCode.endPolygon(evt);
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
				

			case 6:
				canvasCode.drawCircle(evt);
				break;

			case 7:
				canvasCode.fillCircle(evt);
				break;

			case 8:
				canvasCode.clearCircle(evt);
				break;

			case 9:
				canvasCode.drawPolygon(evt);
				break;

		}
		
	},
	
	parseStatements: function(code){
		//breaks the JS into statement blocks based on //s
		
		var codeArray = code.split("//");
		var newArray = [];
		
		for (var i=0; i < codeArray.length; i++) {
			if (codeArray[i]!=="") {
				newArray.push("//" + codeArray[i]) 
			}
		};
		canvasCode.statements = newArray
	},
	
	chooseCompositingMode: function(mode){
		canvasCode.theContext.globalCompositeOperation = mode
	},
	
	initCodeMirror: function(){
			canvasCode.theCodeMirror = CodeMirror.fromTextArea(document.querySelector("#theCode"));
			canvasCode.theCodeMirror.on("change", canvasCode.updateStatementsFromCode)
	},
	
	updateStatementsFromCode: function(){
		//get the code from the codeMirror and update the preview
		
		//only if it has the current focus
		
		if (canvasCode.theCodeMirror.hasFocus() == true) {
			canvasCode.parseStatements(canvasCode.theCodeMirror.getValue())
			canvasCode.drawAllStatements();
		}
	}
	
}


window.addEventListener("load", canvasCode.init, false)