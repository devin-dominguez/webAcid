var seq = {
	size: 16,
	range: 21,
	note: [],
	glide: [],
	trigger: [],
};

seq.init = function() {
	for(var i = 0; i < seq.size; i++) {
		seq.note[i] = null;
		seq.glide[i] = false;
		seq.trigger[i] = true;
	}
};

seq.randomize = function() {
	seq.init();
	for(var i = 0; i < seq.size; i++) {
		if(Math.random() < 0.8) {
			seq.note[i] = Math.floor(Math.random() * seq.range);
			seq.trigger[i] = Math.random() < 0.95;
			seq.glide[i] = Math.random() < 0.25;
		}
	}
}

seq.randomize();

var playback = {
	pos: 0,
	id: 0,
	tempo: 115,
	interval: 0,
	dt: 0,
	pt: 0,
	playing: false
};

playback.update = function() {
	playback.id = setTimeout(function() {
		playback.pos = (playback.pos + 1) % seq.size;
		
		playback.triggerSynth(playback.pos);
		
		
		playback.dt = audio.currentTime - playback.pt;
		playback.pt = audio.currentTime;
		
		playback.interval = 15000 / (playback.tempo - playback.dt);
		delay.delayTime.value = 3 * (playback.interval / 1000);
		playback.update();
		
	}, playback.interval);
};

playback.triggerSynth = function(pos) {;
	if(seq.note[pos] !== null) {
		var freq = mtof(seq.note[pos]);
		synth.playNote(freq, seq.glide[pos], seq.trigger[pos]);
	
	}
}

playback.start = function() {
	playback.pt = audio.currentTime;
	playback.pos = 0;
	playback.triggerSynth(playback.pos);
	playback.interval = 15000 / playback.tempo;
	playback.update();
}

playback.stop = function() {
	clearTimeout(playback.id);
}

var scale = [1, 16/15, 4/3, 3/2, 8/5];
function mtof(m) {
	var pitch = scale[m % scale.length];
	var octave = Math.floor(m / scale.length);
	var freq = 40 * pitch * Math.pow(2, octave);
	return freq;
}


