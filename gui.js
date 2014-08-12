

//setup grid data and gui elements
var data = {};
data.loopLength = 16;
data.noteRange = 20;
data.selectedNote = [];
data.glide = [];

var gui = {};

gui.colors = {
	empty: "white",
	filled: "black"
};

gui.switchRow = function(x, on) {
	var opacity;
	on ? opacity = .75: opacity = 1;
	for(var y = 0; y < data.noteRange; y++) {
		gui.noteCells[x][y].style.opacity = opacity;
	}
	gui.glideCells[x].style.opacity = opacity;
}

gui.highlightRow = function(){
	var previous;
	return function(x) {
		gui.switchRow(x, true);
		if(previous !== undefined && previous !== x) {
			gui.switchRow(previous, false);
		}
		previous = x;
	};
	
}();

gui.noteCells = [];
gui.glideCells = [];

for(var x = 0; x < data.loopLength; x++) {
	data.selectedNote[x] = null;
	data.glide[x] = false;
	
	gui.noteCells[x] = [];
	gui.glideCells[x] = document.createElement("td");
	gui.glideCells[x].className = "glideCell";
	gui.glideCells[x].addEventListener("click", function() {
		var mx = x;
		return function () {
			glideToggle(mx);
		};
	}(), false);
	
	for(var y = 0; y < data.noteRange; y++) {
		gui.noteCells[x][y] = document.createElement("td");
		gui.noteCells[x][y].className = "noteCell";
		gui.noteCells[x][y].addEventListener("click", function() {
			var mx = x;
			var my = y;
			return function() {
				noteToggle(mx, my);
			};	
		}(), false);
	}
}

//add gui elements to document
gui.main = document.getElementById("main");
gui.grids = document.getElementById("grids");
gui.controls = document.getElementById("controls");
gui.noteTable = document.getElementById("noteTable");
gui.glideTable = document.getElementById("glideTable");

for(var y = 0; y < data.noteRange; y++) {
	var tempRow = document.createElement("tr");
	for(var x = 0; x < data.loopLength; x++) {
		tempRow.appendChild(gui.noteCells[x][y]);
	}
	gui.noteTable.appendChild(tempRow);
}

var tempRow = document.createElement("tr");
for(var x = 0; x < data.loopLength; x++) {
	tempRow.appendChild(gui.glideCells[x]);
}
glideTable.appendChild(tempRow);

function glideToggle(x) {
	if(!data.glide[x]) {
		data.glide[x] = true;
		gui.glideCells[x].style.backgroundColor = gui.colors.filled;
	}
	else {
		data.glide[x] = false;
		gui.glideCells[x].style.backgroundColor = gui.colors.empty;
	}
}

//grid click callback functions
function noteToggle(x, y){
	//no selected note
	if(data.selectedNote[x] === null) {
		data.selectedNote[x] = y;
		gui.noteCells[x][y].style.backgroundColor = gui.colors.filled;
	}
	//select same note
	else if(data.selectedNote[x] === y) {
		data.selectedNote[x] = null;
		gui.noteCells[x][y].style.backgroundColor = gui.colors.empty;
	}
	//select new note
	else {
		gui.noteCells[x][data.selectedNote[x] ].style.backgroundColor = gui.colors.empty;
		
		data.selectedNote[x] = y;
		gui.noteCells[x][y].style.backgroundColor = gui.colors.filled;
	}
}



// gui buttons
var playButton = document.getElementById("playButton");
playButton.addEventListener("click", function() {
	var clicked = false;	
	return function() {
		if(!clicked) {
			clicked = true;
			this.innerHTML = "Stop";
			metro.start();
		}
		else {
			clicked = false;
			this.innerHTML = "Play";
			metro.stop();
		};
	}
}());

var clearButton = document.getElementById("clearButton");
clearButton.addEventListener("click", clear);

function clear() {
	for(var x = 0; x < data.loopLength; x++) {
		data.selectedNote[x] = null;
		data.glide[x] = false;
		gui.glideCells[x].style.backgroundColor = gui.colors.empty;
		for(var y = 0; y < data.noteRange; y++) {
			gui.noteCells[x][y].style.backgroundColor = gui.colors.empty;
		}
	}
}

var randomButton = document.getElementById("randomButton");
randomButton.addEventListener("click", randomize);

function randomize() {
	clear();
	for(var x = 0; x < data.loopLength; x++) {
		if(Math.random() < .75) {
			noteToggle(x, Math.floor(Math.random() * data.noteRange));
			if(Math.random() < .35) {
				glideToggle(x);
			}
		}
	}
}

var cutoffSlider = document.getElementById("cutoffSlider");
cutoffSlider.value = (synth.cutoff.gain.value - 20) / 5000;
cutoffSlider.addEventListener("input", function() {
	synth.cutoff.gain.value = this.value * 5000 + 20;
});

var resonanceSlider = document.getElementById("resonanceSlider");
resonanceSlider.value = synth.filter.Q.value / 12;
resonanceSlider.addEventListener("input", function() {
	synth.filter.Q.value = this.value * 12;
});

var attackSlider = document.getElementById("attackSlider");
attackSlider.value = synth.attackTime / .125;
attackSlider.addEventListener("input", function() {
	synth.attackTime = this.value * .125;
});

var releaseSlider = document.getElementById("releaseSlider");
releaseSlider.value = synth.decayTime;
releaseSlider.addEventListener("input", function() {
	synth.decayTime = this.value * 1;
});

var glideSlider = document.getElementById("glideSlider");
glideSlider.value = synth.glideRate / .5;
glideSlider.addEventListener("input", function() {
	synth.glideRate = this.value * .5;
});

var tempoSlider = document.getElementById("tempoSlider");
tempoSlider.value = (60000 / metro.getSpeed() / 4 - 40) / 200;
	tempoSlider.addEventListener("input", function() {
	metro.setBPM(this.value * 200 + 40, 4);
});

var delaySlider = document.getElementById("delaySlider");
delaySlider.value = delayAmp.gain.value / .75;
delaySlider.addEventListener("input", function() {
	delayAmp.gain.value = this.value * .75;
});

var volumeSlider = document.getElementById("volumeSlider");
volumeSlider.value = out.gain.value / .35;
volumeSlider.addEventListener("input", function() {
	out.gain.value = this.value * .35;
});


randomize();
