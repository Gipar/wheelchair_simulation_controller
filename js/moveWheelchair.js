function arrowUp () {
	sendTwistMessage (linearSpeed, 0.0);
	// addLog ("forward button");
}

function arrowUpRight () {
	moveRobotFromPose (0, angularSpeed);
	sendTwistMessage (linearSpeed, -0.05);
	// addLog ("forward button");
}

function arrowUpLeft () {
	moveRobotFromPose (0, -angularSpeed);
	sendTwistMessage (linearSpeed, 0.05);
	// addLog ("forward button");
}

function arrowDown () {
	sendTwistMessage (-linearSpeed, 0.0);
	// addLog ("back button");
}

function arrowRight () {
	moveRobotFromPose (0, -angularSpeed);
  sendTwistMessage (0, 0.09);
	// addLog ("rotate right button");
}

function arrowLeft () {
	moveRobotFromPose (0, angularSpeed);
	sendTwistMessage (0, -0.09); // linearSpeed, angle
	// addLog ("rotate left button");
}

function stopButton () {
	stopMotion = true;
	cancelRobotMove();
	addLog ("stop button");
	//sendTwistMessage (0.0, 0.0);
}

/**
 * 
 * @param {*} evt 
 * Take the key that was pressed on the keyboard
 */
function keyPressed(evt){
  evt = evt || window.event;
  var key = evt.keyCode || evt.which;
  return String.fromCharCode(key); 
}

document.onkeypress = function(evt) {
  var str = keyPressed(evt);

    switch (str) {
      case 'w':
        arrowUp();
        break;
      case 'q':
        arrowUpLeft();
        break;
      case 'e':
        arrowUpRight();
        break;
      case 'd':
        arrowRight();
        break;
      case 's':
        arrowDown();
        break;
      case 'a':
        arrowLeft();
        break;
      default:
        console.log(str);
    }
};

var intervalId = 0;
$(document).on('mouseup', release);

function release() {
  if(intervalId != 0) {
    clearInterval(intervalId); // Clear previously recorded interval
    intervalId = 0;

    var svgs = document.querySelectorAll("svg");
    for(var i = 0; i < svgs.length; i++) {
      if(svgs[i].classList.contains("on")) svgs[i].classList.remove("on")
    }
  }
}
      
$('#arrowUp').on('mousedown', function() {
  this.children[0].classList.add("on");
  intervalId = setInterval(arrowUp, 10); 
});

$('#arrowRight').on('mousedown', function() {
  this.children[0].classList.add("on");
  intervalId = setInterval(arrowRight, 10); 
});

$('#arrowDown').on('mousedown', function() {
  this.children[0].classList.add("on");
  intervalId = setInterval(arrowDown, 10); 
});

$('#arrowLeft').on('mousedown', function() {
  this.children[0].classList.add("on");
  intervalId = setInterval(arrowLeft, 10); 
});
  