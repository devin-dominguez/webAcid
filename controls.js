// gui buttons
var playButton = document.getElementById("playButton");
playButton.addEventListener("click", function() {

		if(!playback.playing) {
			playback.playing = true;
			playback.start();
			this.innerHTML = "Stop";
		}
		else {
			playback.playing = false;
			playback.stop();
			this.innerHTML = "Play";
			requestAnimationFrame(draw);
		}
});

var clearButton = document.getElementById("clearButton");
clearButton.addEventListener("click", function() {
	seq.init();
	requestAnimationFrame(draw);
});

var randomButton = document.getElementById("randomButton");
randomButton.addEventListener("click", function() {
	seq.randomize();
	requestAnimationFrame(draw);
});

//WAVEFORM
var squareRadio = document.getElementById("squareRadio");
squareRadio.addEventListener("change", function() {
	synth.osc.type = "square";
});

var sawRadio = document.getElementById("sawRadio");
sawRadio.addEventListener("change", function() {
	synth.osc.type = "sawtooth";
});

//CUTOFF
var cutoffSlider = document.getElementById("cutoffSlider");
cutoffSlider.value = (synth.cutoff.gain.value - 20) / 5000;
cutoffSlider.addEventListener("input", function() {
	synth.cutoff.gain.value = this.value * 5000 + 20;
});

//RESONANCE
var resonanceSlider = document.getElementById("resonanceSlider");
resonanceSlider.value = synth.filter.Q.value / 12;
resonanceSlider.addEventListener("input", function() {
	synth.filter.Q.value = this.value * 12;
});

//ATTACK
var attackSlider = document.getElementById("attackSlider");
attackSlider.value = (synth.attackTime - .001) / .06;
attackSlider.addEventListener("input", function() {
	synth.attackTime = this.value * .06 + .001;
});

//RELEASE
var releaseSlider = document.getElementById("releaseSlider");
releaseSlider.value = (synth.decayTime -.05) / .75;
releaseSlider.addEventListener("input", function() {
	synth.decayTime = this.value * .75 + .05;
});

//GLIDE
var glideSlider = document.getElementById("glideSlider");
glideSlider.value = synth.glideRate / .085;
glideSlider.addEventListener("input", function() {
	synth.glideRate = this.value * .085;
});

//DELAY
var delaySlider = document.getElementById("delaySlider");
delaySlider.value = delayAmp.gain.value / .75;
delaySlider.addEventListener("input", function() {
	delayAmp.gain.value = this.value * .75;
});

//VOLUME
var volumeSlider = document.getElementById("volumeSlider");
volumeSlider.value = out.gain.value / .35;
volumeSlider.addEventListener("input", function() {
	out.gain.value = this.value * .35;
});

//TEMPO
var tempoSlider = document.getElementById("tempoSlider");
tempoSlider.value = (playback.tempo - 40) / 260;
	tempoSlider.addEventListener("input", function() {
		playback.tempo = tempoSlider.value * 260 + 40;
});




