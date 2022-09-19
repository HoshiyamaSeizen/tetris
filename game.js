const instance = {
	running: false,
	paused: false,
	width: 10,
	height: 20 + 4,
	deadzone: 4,
	tetramino: null,
	nextTetramino: null,
	field: null,
	level: 1,
	score: 0,
};

const toggleGame = (btn) => {
	document.activeElement.blur();
	instance.running = !instance.running;

	btn ||= document.getElementById('start-btn');
	btn.innerText = instance.running ? 'End' : 'Start';
	btn.nextSibling.nextSibling.setAttribute('shown', instance.running);
	if (!instance.running && instance.paused) pause(btn.nextSibling.nextSibling);

	const canvas = document.getElementById('game-canvas');
	const ctx = canvas?.getContext('2d');
	const ctxNext = document.getElementById('next-canvas')?.getContext('2d');
	if (!ctx || !ctxNext) return;
	if (!instance.running) ctxNext.clearRect(0, 0, 120, 120);

	if (!instance.running) return;
	else playAudio('start');

	instance.field = Array(instance.height)
		.fill()
		.map(() => Array(instance.width).fill(0));

	instance.level = 1;
	instance.score = -4;
	updateScore();

	const T = tetraminos;
	const sequence = createGenerator();
	const nextTetramino = () => sequence.next().value;

	instance.tetramino = nextTetramino();
	instance.nextTetramino = nextTetramino();
	drawNextTetramino(ctxNext);

	(update = () => {
		const { field, tetramino } = instance;
		if (instance.running) {
			if (!instance.paused) {
				tetramino.y++;

				if (!isValidMove(field, tetramino.matrix, tetramino.x, tetramino.y)) {
					tetramino.y--;
					if (!placeTetramino(field, tetramino)) return endGame(true);
					updateScore();
					instance.tetramino = instance.nextTetramino;
					instance.nextTetramino = nextTetramino();
					drawNextTetramino(ctxNext);
				}
			}
			setTimeout(update, 500 / instance.level);
		}
	})();

	window.requestAnimationFrame(
		(render = () => {
			const { field, tetramino } = instance;
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			for (let y = instance.deadzone; y < instance.height; y++) {
				for (let x = 0; x < instance.width; x++) {
					if (field[y][x]) {
						const name = field[y][x];
						ctx.fillStyle = T.colors[name];
						ctx.fillRect(
							x * T.size,
							(y - instance.deadzone) * T.size,
							T.size - 1,
							T.size - 1
						);
					}
				}
			}

			drawTetramino(
				ctx,
				tetramino,
				tetramino.x * T.size,
				(tetramino.y - instance.deadzone) * T.size,
				T.size - 1,
				T.size - 1
			);

			if (instance.running) requestAnimationFrame(render);
		})
	);
};

const updateScore = () => {
	instance.score += 4;
	instance.level = Math.round(instance.score / 4 / 7 / 3 + 1);

	document.getElementById('score').textContent = instance.score;
	document.getElementById('level').textContent = instance.level;
};

const pause = (btn) => {
	instance.paused = !instance.paused;
	btn ||= document.getElementById('pause-btn');
	btn.innerText = instance.paused ? 'Resume' : 'Pause';
};

const isValidMove = (field, matrix, x, y) => {
	for (let yInner = 0; yInner < matrix.length; yInner++) {
		for (let xInner = 0; xInner < matrix[yInner].length; xInner++) {
			if (
				matrix[yInner][xInner] &&
				(x + xInner < 0 ||
					x + xInner >= instance.width ||
					y + yInner >= instance.height ||
					field[y + yInner][x + xInner])
			)
				return false;
		}
	}
	return true;
};

const placeTetramino = (field, tetramino) => {
	for (let y = 0; y < tetramino.matrix.length; y++) {
		for (let x = 0; x < tetramino.matrix[y].length; x++) {
			if (tetramino.matrix[y][x]) {
				if (tetramino.y + y < instance.deadzone) return false;
				field[tetramino.y + y][tetramino.x + x] = tetramino.name;
			}
		}
	}

	let clearedRow = false;
	for (let row = instance.height - 1; row >= 0; ) {
		if (field[row].every((cell) => !!cell)) {
			clearedRow = true;
			for (let r = row; r > 0; r--) {
				for (let c = 0; c < instance.width; c++) field[r][c] = field[r - 1][c];
			}
		} else row--;
	}
	playAudio(clearedRow ? 'line' : 'place');
	return true;
};

const endGame = (lose = false) => {
	if (lose) playAudio('gameOver');
	toggleGame();
	loadLeaderBoard(true);
};
