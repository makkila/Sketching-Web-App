$(document).ready(function() {
  var fillStyle = "hsla(180, 100%, 50%, 1)";
	
  $("#color-slider").slider({
	max: 360,
	value: 180,
	slide: function(event, ui) {
	  fillStyle = "hsla(" + $("#color-slider").slider("option", "value") + ", 100%, 50%, 1)";
	  document.getElementById("color").style.background = fillStyle;
	  document.querySelector(".ui-slider").style.background = fillStyle;
    }
  })
  
  $("#thickness-slider").slider({
	min: 1,
	max: 100,
	value: 50,
	slide: function(event, ui) {
		document.getElementById("size").innerHTML = "Size (" + $("#thickness-slider").slider("option", "value") + ")"
	}
  })
  
  document.getElementById("size").innerHTML = "Size (" + $("#thickness-slider").slider("option", "value") + ")"
  
  document.getElementById("color").style.background = fillStyle;
  document.querySelector(".ui-slider").style.background = fillStyle;
	
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  
  $("#reset").click(function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  })
  
  $(window).resize(function() {
		ctx.canvas.width = $(window).width() - $("#menu").width();
    ctx.canvas.height = $(window).height();
  })
  
  ctx.canvas.height = $(window).height();
  ctx.canvas.width = $(window).width() - $("#menu").width();
  var chosen_shape = $("#chosen-shape"); 
  chosen_shape.trigger("contentchanged");
  
  // Functions for drawing/event handler assignment
  $("#paintbrush").click(function() {
	this.style.boxShadow = "inset 0px -2px 20px 10px rgba(0,0,0,0.75)";
	chosen_shape.text("paintbrush"); 
    chosen_shape.trigger("contentchanged");
	var options = ["eraser", "square", "triangle", "circle"];
	for (var i=0; i<options.length; i++) {
	  document.getElementById(options[i]).style.boxShadow = "none";
	}  
  })
  $("#eraser").click(function() {
	chosen_shape.text("eraser"); 
    chosen_shape.trigger("contentchanged");
	this.style.boxShadow = "inset 0px -2px 20px 10px rgba(0,0,0,0.75)";
	var options = ["paintbrush", "square", "triangle", "circle"];
	for (var i=0; i<options.length; i++) {
	  document.getElementById(options[i]).style.boxShadow = "none";
	}  
  })
  $("#square").click(function() {
	chosen_shape.text("square"); 
    chosen_shape.trigger("contentchanged");
	var options = ["paintbrush", "eraser", "triangle", "circle"];
	this.style.boxShadow = "inset 0px -2px 20px 10px rgba(0,0,0,0.75)";
	for (var i=0; i<options.length; i++) {
	  document.getElementById(options[i]).style.boxShadow = "none";
	}  
  })
  $("#triangle").click(function() {
	chosen_shape.text("triangle");
    chosen_shape.trigger("contentchanged");
	var options = ["paintbrush", "eraser", "square", "circle"];
	this.style.boxShadow = "inset 0px -2px 20px 10px rgba(0,0,0,0.75)";
	for (var i=0; i<options.length; i++) {
	  document.getElementById(options[i]).style.boxShadow = "none";
	}  
  })
  $("#circle").click(function() {
	chosen_shape.text("circle"); 
    chosen_shape.trigger("contentchanged");
	var options = ["paintbrush", "eraser", "square", "triangle"];
	this.style.boxShadow = "inset 0px -2px 20px 10px rgba(0,0,0,0.75)";
	for (var i=0; i<options.length; i++) {
		document.getElementById(options[i]).style.boxShadow = "none";
	}  
  })
  
  // Mousemove, mousedown, and mouseup functions
  function mousemove(event) {
    if (!canvas.isDrawing) { return; }
    
    var x = event.clientX - canvas.offsetLeft;
    var y = event.clientY - canvas.offsetTop;
    
		thickness = $("#thickness-slider").slider("option", "value");
		ctx.lineWidth = thickness;
		ctx.lineJoin = ctx.lineCap = "round";
    ctx.lineTo(x, y);
    ctx.strokeStyle = fillStyle;
    ctx.stroke();
  }
  
  function mousedown(event) {
    canvas.isDrawing = true;
		
		var x = event.clientX - canvas.offsetLeft;
    var y = event.clientY - canvas.offsetTop;
		ctx.beginPath();
		ctx.moveTo(x, y);
  }

  function mouseup(event) {
    canvas.isDrawing = false;
  }

  function draw(event) {
    var x = event.clientX - canvas.offsetLeft;
    var y = event.clientY - canvas.offsetTop;
		console.log(fillStyle);
    // Get selected shape
    
    // Display desired shape on click
    if (chosen_shape.text() == "circle") {
			size = $("#thickness-slider").slider("option", "value");
      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.fillStyle = fillStyle;
      ctx.fill();
      //ctx.stroke();
    } else if (chosen_shape.text() == "square") {
			size = $("#thickness-slider").slider("option", "value");
      ctx.fillStyle = fillStyle;
      ctx.fillRect(x, y, size, size);
			ctx.fillRect(x-size, y, size, size);
			ctx.fillRect(x-size, y-size, size, size);
			ctx.fillRect(x, y-size, size, size);
    } else {
			size = $("#thickness-slider").slider("option", "value");
      ctx.fillStyle = fillStyle;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x+size, y+size+size/2);
      ctx.lineTo(x-size, y+size+size/2);
      ctx.closePath();
      ctx.fill();
    }
  }
  
  // Functions for eraser
  function erase(event) {
    if (!canvas.isDrawing) { return; }
		
    var x = event.clientX - canvas.offsetLeft;
    var y = event.clientY - canvas.offsetTop; 
	
	eraser_thickness = $("#thickness-slider").slider("option", "value");
	ctx.clearRect(x, y, eraser_thickness/2, eraser_thickness/2);
	ctx.clearRect(x-eraser_thickness/2, y, eraser_thickness/2, eraser_thickness/2);
	ctx.clearRect(x-eraser_thickness/2, y-eraser_thickness/2, eraser_thickness/2, eraser_thickness/2);
	ctx.clearRect(x, y-eraser_thickness/2, eraser_thickness/2, eraser_thickness/2);
  }

  canvas.addEventListener("mousedown", mousedown);
  document.addEventListener("mouseup", mouseup);
  canvas.addEventListener("mousemove", mousemove);
  chosen_shape.on("contentchanged", chosen_shape, function() {
		if (chosen_shape.text() == "paintbrush") {
			canvas.removeEventListener("click", draw);
			canvas.removeEventListener("mousemove", erase);
			canvas.addEventListener("mousemove", mousemove);
		} else if (chosen_shape.text() == "eraser") {
			canvas.removeEventListener("mousemove", mousemove);
			canvas.removeEventListener("click", draw);
			canvas.addEventListener("mousemove", erase);
		} else {
			canvas.removeEventListener("mousemove", mousemove);
			canvas.removeEventListener("mousemove", erase);
			canvas.addEventListener("click", draw);
		}
  })
})