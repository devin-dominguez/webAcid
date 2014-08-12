function AcidSynth(audio) {
	this.audio = audio;

	//parameters
	this.attackTime = .01;
	this.decayTime = .75;
	this.glideRate = .2;
	
	//synth stuff
	this.adsr = this.audio.createGain();
	this.adsr.gain.value = 0;
	sig.connect(this.adsr);

	this.amp = this.audio.createGain();
	this.amp.gain.value = 0;
	this.adsr.connect(this.amp.gain);


	this.filter = this.audio.createBiquadFilter();
	this.filter.type - "lowpass";
	this.filter.frequency.value = 0;
	this.filter.Q.value = 10;
	this.filter.connect(this.amp);

	this.cutoff = this.audio.createGain();
	this.cutoff.gain.value = 2500;
	this.cutoff.connect(this.filter.frequency);
	this.adsr.connect(this.cutoff);

	this.osc = this.audio.createOscillator();
	this.osc.type = "sawtooth";
	this.osc.connect(this.filter);
	this.osc.start(0);
}


AcidSynth.prototype.trigger = function() {
	var now = this.audio.currentTime;
	this.adsr.gain.cancelScheduledValues(now);
	this.adsr.gain.setValueAtTime(this.adsr.gain.value, now);
	this.adsr.gain.linearRampToValueAtTime(1, now + this.attackTime);
	this.adsr.gain.linearRampToValueAtTime(0, now + this.attackTime + this.decayTime);
};

AcidSynth.prototype.playNote = function(freq, glide) {
	var now = this.audio.currentTime;
	if(glide) {
		this.osc.frequency.setTargetAtTime(freq, now, this.glideRate);
	}
	else {
		this.osc.frequency.setValueAtTime(freq, now);
	}
	this.trigger();
		
	
};

var synth = new AcidSynth(audio);
synth.amp.connect(out);
synth.amp.connect(delayAmp);


