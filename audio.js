const playAudio = (name) => audio[name]?.play();

const audio = {
	gameOver: new Audio('./assets/audio/gameover.wav'),
	start: new Audio('./assets/audio/start.wav'),
	line: new Audio('./assets/audio/line.wav'),
	load: new Audio('./assets/audio/load.wav'),
	place: new Audio('./assets/audio/place.wav'),
};
