var audio = new AudioContext();
var out = audio.createGain();
out.gain.value = .35;
out.connect(audio.destination);

var delay = audio.createDelay();
var delayAmp = audio.createGain();
var delayFb = audio.createGain();

delayFb.gain.value = .5;
delayFb.connect(out);
delayFb.connect(delay);
delay.connect(delayFb);
delayAmp.connect(delay);
delayAmp.gain.value = .25;

var m1 = audio.createGain();
var m2 = audio.createGain();


document.addEventListener("m_tempoChange", function(e) {
	delay.delayTime.value = 3 * ( e.detail.speed * .001);
} );


var real = new Float32Array(2);
var imag = new Float32Array(2);
real[0]=0;
real[1]=1;
imag[0]=0;
imag[1]=0;

var sigWave = audio.createPeriodicWave(real, imag);
var sig = audio.createOscillator();
sig.setPeriodicWave(sigWave);
sig.frequency.value = 0;
sig.start(0);


function createMetro(name) {
	var name = name || "default";
	var playing = false;
	var speed = 500;
	var bpmChange = false;
	var id;
	var myTime = 0;
	var tickEvent = new CustomEvent(name + "_tick", {detail:{time:myTime}});
	var stopEvent = new CustomEvent(name + "_stop");
	var startEvent = new CustomEvent(name + "_start");
	var tempoChangeEvent = new CustomEvent(name + "_tempoChange", {detail:{speed:speed}});
	
	var tick = function() {
		tickEvent.detail.time = myTime++;
		document.dispatchEvent(tickEvent);
		if(bpmChange = true) {
			clearInterval(id);
			id = setInterval(tick, speed);
			bpmChange = false;
			tempoChangeEvent.detail.speed = speed;
			document.dispatchEvent(tempoChangeEvent);
		}
	};
	
	return {
		start: function() {
			if(!playing) {
				playing = true;
				id = setInterval(tick, speed);
				document.dispatchEvent(startEvent);
			}
		},
		
		stop: function() {
		if(playing) {
				playing = false;
				clearInterval(id);
				myTime = 0;
				document.dispatchEvent(stopEvent);
		}
		},
		
		setBPM: function(bpm, ppq) {
			ppq = ppq || 1;
			speed = 60000 / bpm / ppq
			
			if(playing) {
				bpmChange = true;
			}
			if(!playing) {
				tempoChangeEvent.detail.speed = speed;
				document.dispatchEvent(tempoChangeEvent);
			}
		},
		
		isPlaying: function() {
			return playing;
		},
		
		getSpeed: function() {
			return speed;
		},
		
		getName: function() {
			return name;
		}
	};
}
