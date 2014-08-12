

function Note() {
	this.doIt = true;
	this.frequency = 0;
	this.glide = false;
	this.envelopeTrigger = true;
}


var scale = [1, 16/15, 4/3, 3/2, 8/5];


document.addEventListener("m_tick", function(e) {
	var n = e.detail.time % data.loopLength;
	var index = data.noteRange - data.selectedNote[n];
	var pitch = scale[index % scale.length];
	var octave = Math.floor(index / scale.length);
	var freq = 48 * pitch * Math.pow(2, octave);
	
	gui.highlightRow(n);
	if(data.selectedNote[n] !== null) {
		synth.playNote(freq, data.glide[n]);
	}

});
document.addEventListener("m_stop", function() {
	for(var y = 0; y < data.loopLength; y++) {
		gui.switchRow(y, false);
	}
});
var metro = createMetro("m");
metro.setBPM(115, 4);
