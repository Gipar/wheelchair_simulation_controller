var langs =
[['English',         ['en-AU', 'Australia'],
                     ['en-CA', 'Canada'],
                     ['en-IN', 'India'],
                     ['en-NZ', 'New Zealand'],
                     ['en-ZA', 'South Africa'],
                     ['en-GB', 'United Kingdom'],
                     ['en-US', 'United States']],
 ['Español',         ['es-AR', 'Argentina'],
                     ['es-BO', 'Bolivia'],
                     ['es-CL', 'Chile'],
                     ['es-CO', 'Colombia'],
                     ['es-CR', 'Costa Rica'],
                     ['es-EC', 'Ecuador'],
                     ['es-SV', 'El Salvador'],
                     ['es-ES', 'España'],
                     ['es-US', 'Estados Unidos'],
                     ['es-GT', 'Guatemala'],
                     ['es-HN', 'Honduras'],
                     ['es-MX', 'México'],
                     ['es-NI', 'Nicaragua'],
                     ['es-PA', 'Panamá'],
                     ['es-PY', 'Paraguay'],
                     ['es-PE', 'Perú'],
                     ['es-PR', 'Puerto Rico'],
                     ['es-DO', 'República Dominicana'],
                     ['es-UY', 'Uruguay'],
                     ['es-VE', 'Venezuela']],
 ['Português',       ['pt-BR', 'Brasil'],
                     ['pt-PT', 'Portugal']
]];

// Select language (default English US)
for (var i = 0; i < langs.length; i++) {
  select_language.options[i] = new Option(langs[i][0], i);
}
select_language.selectedIndex = 0;

updateCountry();
select_dialect.selectedIndex = 6;
showInfo('info_start');

function updateCountry() {
  for (var i = select_dialect.options.length - 1; i >= 0; i--) {
    select_dialect.remove(i);
  }
  var list = langs[select_language.selectedIndex];
  for (var i = 1; i < list.length; i++) {
    select_dialect.options.add(new Option(list[i][1], list[i][0]));
  }
  select_dialect.style.visibility = list[1].length == 1 ? 'hidden' : 'visible';
}

var selectDialect = document.getElementById('select_dialect');
var dialectSelected = selectDialect.value;
var btnDoneLanguage = document.getElementById('btn-done-language');

console.log(dialectSelected);

btnDoneLanguage.addEventListener('click', () => {
	selectDialect = document.getElementById('select_dialect');
	dialectSelected = selectDialect.value;
	console.log(dialectSelected);
	// window.location.reload();
});

function startButton(event) {
	console.log('startButton event');

	if(recognizing) {
		recognition.stop();
		console.log('recognition stopped');
		noRestartReco = true;
		setMicInactive()
		showInfo('info_none');
		return;
	}

	if (!(recognition || 0)) {
		startRecognition();
	}

	if (recognition || 0) {
		recognition.lang = dialectSelected;
		recognition.start();
		noRestartReco = false;
		setMicOff ()
		showInfo('info_allow');
		startTimestamp = event.timeStamp;
	}
}

function say (words) {
	var wasRecognizing = false;
	var stowabool;
	if (muted === false) {
		stowabool = noRestartReco;
		if (recognizing) { 
			wasRecognizing = true;
			noRestartReco = true;
			recognition.stop (); 
		}
		var u = new SpeechSynthesisUtterance();
		u.text = words;
		u.lang = dialectSelected; 
		u.rate = 1.1;
		u.pitch = 1.0;
		u.default = true;
		u.localService = true; 
		u.onend = function(event) { 
			if (wasRecognizing) { 
				recognition.start ();
			}
			noRestartReco = stowabool;
		}
		speechSynthesis.speak(u);
	}
}
