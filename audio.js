window.AudioContext = window.AudioContext || window.webkitAudioContext;

var audio = new AudioContext() || new webkitAudioContext();

var dcKiller = audio.createBiquadFilter();
dcKiller.type = "highpass";
dcKiller.frequency.value = 10;
dcKiller.Q.value = 0;
dcKiller.connect(audio.destination);

var out = audio.createGain();
out.gain.value = .35;
out.connect(dcKiller);



var delay = audio.createDelay();
var delayAmp = audio.createGain();
var delayFb = audio.createGain();

delayFb.gain.value = .5;
delayFb.connect(out);
delayFb.connect(delay);
delay.connect(delayFb);
delayAmp.connect(delay);
delayAmp.gain.value = .25;

delay.delayTime.value = .5;

var real = new Float32Array(2);
var imag = new Float32Array(2);
real[0]=0;
real[1]=1;
imag[0]=0;
imag[1]=0;

var sig = audio.createOscillator();
var waveFun = audio.createWaveTable || audio.createPeriodicWave;
var sigWave = waveFun.apply(audio, [real, imag]);

var waveSet = sig.setPeriodicWave || sig.setWaveTable;
waveSet.apply(sig, [sigWave]);


sig.frequency.value = 0;
sig.start(0);

var synth = {
	attackTime: .01,
	sustainTime: .1,
	decayTime: .25,
	glideRate: .05
};

//synth stuff

synth.adsrF = audio.createBiquadFilter();
synth.adsrF.type = "lowpass";
synth.adsrF.frequency.value = 64;
synth.adsrF.Q.value = 0;


synth.adsr = audio.createGain();
synth.adsr.gain.value = 0;
sig.connect(synth.adsr);
synth.adsr.connect(synth.adsrF);

synth.amp = audio.createGain();
synth.amp.gain.value = 0;
synth.adsrF.connect(synth.amp.gain);


synth.filter = audio.createBiquadFilter();
synth.filter.type = "lowpass";
synth.filter.frequency.value = 0;
synth.filter.Q.value = 10;
synth.filter.connect(synth.amp);

synth.cutoff = audio.createGain();
synth.cutoff.gain.value = 2500;
synth.cutoff.connect(synth.filter.frequency);
synth.adsrF.connect(synth.cutoff);

synth.osc = audio.createOscillator();
synth.osc.type = "sawtooth";
synth.osc.connect(synth.filter);
var turnOn = synth.osc.noteOn || synth.osc.start;
turnOn.apply(synth.osc, [0]);
//synth.osc.noteOn(0);

synth.amp.connect(out);
synth.amp.connect(delayAmp);


synth.playNote = function(freq, glide, trigger, t) {
	var now;
	t ? now = t : now = audio.currentTime;
	var rate = 0;
	if(glide) {
		rate = synth.glideRate;
	}
	synth.osc.frequency.setTargetAtTime(freq, now, rate);
	
	if(trigger) {
		synth.adsr.gain.cancelScheduledValues(now)
		synth.adsr.gain.setValueAtTime(0, now);
		synth.adsr.gain.setTargetAtTime(1, now, synth.attackTime);
		synth.adsr.gain.setTargetAtTime(0, now + (synth.attackTime * 2) , synth.decayTime);
		
	}
};







