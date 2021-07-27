function startRecognition () {

	if (!('webkitSpeechRecognition' in window)) {
		showInfo ('info_upgrade');
	} else {

		recognition = new webkitSpeechRecognition();
		recognition.continuous = true;		
		recognition.interimResults = false;
		recognition.maxAlternatives = 10;		
		showInfo('info_start');

		recognition.onstart = function() {
			recognizing = true;
			showInfo('info_speak_now');
			console.log('onstart');
			setMicActive ();
		};
		recognition.onerror = function(event) {
			console.log('speech recognition error:' + ' ' + event.error);

			if (event.error == 'no-speech') {
				setMicInactive ();
			//    showInfo('info_no_speech');
				noRestartReco = false;
			}
			if (event.error == 'audio-capture') {
				setMicInactive ();
				showInfo('info_no_microphone');
				noRestartReco = true;
			}
			if (event.error == 'not-allowed') {
				if (event.timeStamp - startTimestamp < 100) {
						showInfo('info_blocked');
				} else {
					showInfo('info_denied');
				}
				noRestartReco = true;
			}
		}

		recognition.onend = function() {
			console.log('onend; ' + (noRestartReco ? "dont restart" : "do restart"));
			recognizing = false;
			if (noRestartReco) {
				return;
			}
			showInfo('');
			restartReco();
		}

		recognition.onresult = function(event) {
			console.log('recognition.onresult');
			
			function getDistance (quantity, what) {
				var howmany;
				howmany = Number(quantity);
				if (isNaN(howmany)) {
					if (quantity == "to" || quantity == "too") {
						howmany = 2;
					} else if (quantity == "for") {
						howmany = 4;
					} else {
						return 0;
					}
				}
				if (what == "meters" || what == "meter") {
					return (howmany);
				} else if (what == "centimeters" || what == "centimeter") {
					return howmany * 0.01;	
				} else if (what == "feet" || what == "foot") {
					return howmany * 0.3048;			// converts feet to meters
				} else if (what == "degrees" || what == "degree") {
					return howmany * Math.PI / 180;		// convert to radians
				} else {
					return 0;
				}	
			}
			
			// list commands
			var commands = '';
			var x = 0, y = 0, z = 0; 		// linear x and y movement and angular z movement
		
			var commandFound = false;
			var result;
			var topCandidate = "";		
			var allResults = "";
			var dist = 0;	
			var altNumber;
			if (event.results.length > 0) {		// we have an array of recognition candidates
				result = event.results[0];
				if (recognition.continuous == true)	{recognition.stop ()}	
										
				testAllCandidates:
					for (var i = 0; i < result.length; ++i) {
						candidate = result[i].transcript.toLowerCase().trim();
						var words = candidate.match(/[-\w]+/g);	// parses candidate to array of words
						if (useWakeup) {
							if (wakeup.indexOf (words[0]) >= 0) {	// if the first word is a wakeup word 
								words.splice (0,1);	// remove it
								if (i == 0) {
									topCandidate = words.join(' ');	
								}
							} else {
								continue;
							}
						}
						if (words.length >= 2) {
							if (words[0] == 'go' && words[1] != 'to' && words[1] != 'home') {
								words.splice (0,1);		// remove superfluous "go"
							}
						}
						commandFound = true;
						testCandidate: switch (words [0]){
							case 'forward':
							case 'run':
							case 'go':
							case 'frente':
							case 'vai':
							case 'prossiga':
							case 'adelante':
							case 'continuar':
								if (words.length == 1) {	
									x = linearSpeed;
									// -- loop action go forward
									for(var i=0; i < 1000; i++) {
										arrowUp();
									}
								} else if (words.length == 3) {
									//alert(words);	
									dist = getDistance (words[1], words[2]);	// accept meters, translate feet --> meters
									commandFound = (dist > 0); 
									if (dist > 0) {                     // move dist meters
										moveRobotFromPose (dist, 0);   // 0
										moveRobotFromPose (dist, 0);  // 0
									}
								} else {
									commandFound = false;
								}
								break testCandidate;

							case 'right':
							case 'go right':
              case 'turn right':
              case 'direita':
              case 'vire à direita':
              case 'derecha':
              case 'gire a la derecha':
								if (words.length == 1) {
									x = linearSpeed;
									// -- action loop go right
									for(var i=0; i < 100; i++) {
										arrowRight();
									}
								}
								break;

							case 'left':
              case 'go left':
              case 'turn left':
              case 'esquerda':
              case 'vire à esquerda':
              case 'izquierda':
              case 'gire a la izquierda':
								if (words.length == 1) {
									x = linearSpeed;
									// -- action loop go left
									for(var i=0; i < 100; i++) {
										arrowLeft();
									}
								}
								break;

							case "back":
							case "go back":
              case "volte":
              case "vá para trás":
              case "regreso":
              case "regresa":
              case "ingreso":
								if (words.length == 1) {			
									x = -linearSpeed;
										// ---------- loop acao ir para tras
										for(var i=0; i < 500; i++) {
											arrowDown();
										}
										// ----------
								}
								break testCandidate;

							case "stop":
								stopMotion = true;
								//sendTwistMessage (0, 0);
								cancelRobotMove ();
								break testCandidate;
							case "faster":
								speedFactor *= 1.1;
								speed_span.innerHTML = "Speed factor " + speedFactor.toFixed(2); 
								break testCandidate;
							case "speed":
								if (words [1] == "up") {
									speedFactor *= 1.1;
									speed_span.innerHTML = "Speed factor " + speedFactor.toFixed(2); 
								} else {
									commandFound = false;
								}
								break testCandidate;
							case "slower":
								speedFactor /= 1.1;
								speed_span.innerHTML = "Speed factor " + speedFactor.toFixed(2); 
								break testCandidate;
							case "slow":
								if (words [1] == "down") { 
									speedFactor /= 1.1;
									speed_span.innerHTML = "Speed factor " + speedFactor.toFixed(2); 
								} else {
									commandFound = false;
								}
								break testCandidate;
							case "help":
								$('#helpModal').modal('show');
								break testAllCandidates;
							default: 
								commandFound = false;
								break testCandidate;
						}

						// it may yet be a waypoint command
						if (!commandFound) {
							if (words && words.length > 1) {
								if (words [0] == "waypoint") {			// it is a waypoint command, to set a waypoint
									commandFound = true;				// prevent the error msg
									var waypoint = words.slice(1).join(" ");
									bootbox.dialog({
										message: waypoint,
										className: "bootbox-msg",
										title: "Please confirm the waypoint name ",
										closeButton: false,
										buttons: {
										danger: {
											label: "No",
											className: "btn-danger",
											callback: function() {
											}
										},
										success: {
											label: "OK",
											className: "btn-success",
											callback: function() {
											setWaypoint (waypoint);
											}
										}
										}
									});
								} else if (words.length > 2 && words[0] == "go" && words[1] == "to") {		// go to waypoint
									commandFound = true;
									goToWaypoint (words.slice(2).join(" "));
								} else if (words.length > 2 && words[0] == "remove" && words[1] == "waypoint") { 	// remove waypoint
									commandFound = true;
									SetWaypointZero (words.slice(2).join(" "));
								} else if (words.length == 2 && words[0] == "list" && words[1] == "waypoints") { 	// list the waypoints
									commandFound = true;
									listWaypoints ();
								} else if (words.length == 2 && words[0] == "go" && words[1] == "home") {	// go home 
									commandFound = true;
									goToWaypoint ("home");
								}
							}
						}
						allResults += "/" + candidate;
						if (commandFound === true) {
							altNumber = i;
							break testAllCandidates;
						}
					}		// end of for loop
	
				console.log (allResults);
				if (showUnrecognized) {addLog (allResults);}
				if (commandFound) {								// publish the command
					commands = candidate + " (alt. #" + (altNumber + 1) + " of " + results.length + ") " + commands;
					commands = commands.slice(0, 50);
					total_recognized++;
					addLog (commands);
					
					// Research: Keep count of how often we used the first result
					if (altNumber == 0) {
						localStorage.firstResultOK = Number(localStorage.firstResultOK) + 1;
					} else {
						localStorage.otherResultOK = Number(localStorage.otherResultOK) + 1;
					} 
					console.log ("First answer recognition rate is " + ((100 * Number(localStorage.firstResultOK)) /
						(Number(localStorage.firstResultOK) + Number(localStorage.otherResultOK))).toFixed(2) + "%");
				} else if (topCandidate != "") {
					addLog (topCandidate.toLowerCase() + " is not recognized as a command", "red");
				}
			} 
		}	// end of onresult
	}   
}		// end of function startRecpgnition 

function setMicInactive() {
	var micImg = document.getElementById("mic-img");
	micImg.src = "./assets/images/mic.gif";
	micImg.style.backgroundColor = "lightgray";
}

function setMicActive() {
	var micImg = document.getElementById("mic-img");
	micImg.src = "./assets/images/mic-animate.gif";
	micImg.style.backgroundColor = "#00cc00";
}

function setMicOff() {
	var micImg = document.getElementById("mic-img");
	micImg.src = "./assets/images/mic.gif";
	micImg.style.backgroundColor = "lightgray";
}
