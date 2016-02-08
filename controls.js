function sliderControl(id, target, property, min, max) {
  var slider = document.getElementById(id);
  var range = max - min;

  // init gui
  slider.value = (target[property] - min) / range;

  slider.addEventListener("input", function() {
    target[property] = slider.value * range + min;
  });
}

sliderControl("cutoffSlider", synth.cutoff.gain, 'value', 20, 5000);
sliderControl("resonanceSlider", synth.filter.Q, 'value', 0, 12);
sliderControl("attackSlider", synth, 'attackTime', 0.001, 0.06);
sliderControl("releaseSlider", synth, 'decayTime', 0.05, 0.75);
sliderControl("glideSlider", synth, 'glideRate', 0.0000001, 0.085);
sliderControl("delaySlider", delayAmp.gain, 'value', 0, 0.75);
sliderControl("volumeSlider", out.gain, 'value', 0, 0.35);
sliderControl("tempoSlider", playback, 'tempo', 40, 300);

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

