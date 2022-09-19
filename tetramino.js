const rotate = (matrix) =>
	matrix.map((row, i) => row.map((_, j) => matrix[matrix.length - 1 - j][i]));

const createGenerator = function* () {
	while (true) {
		const sequence = [...tetraminos.keys];
		while (sequence.length) {
			const rand = Math.floor(Math.random() * (sequence.length - 1));
			const name = sequence.splice(rand, 1)[0];
			const matrix = tetraminos[name];
			const x = instance.width / 2 - Math.ceil(matrix[0].length / 2);
			const y = +(name === 'I');
			yield { name, matrix, x, y };
		}
	}
};

const drawNextTetramino = (ctx) => {
	ctx.clearRect(0, 0, 4 * tetraminos.size, 4 * tetraminos.size);
	drawTetramino(ctx, instance.nextTetramino, 0, 0, tetraminos.size - 1);
};

const drawTetramino = (ctx, tetramino, xAbs, yAbs, w) => {
	ctx.fillStyle = tetraminos.colors[tetramino.name];

	for (let y = 0; y < tetramino.matrix.length; y++) {
		for (let x = 0; x < tetramino.matrix[y].length; x++) {
			if (tetramino.matrix[y][x]) {
				ctx.fillRect(xAbs + x * tetraminos.size, yAbs + y * tetraminos.size, w, w);
			}
		}
	}
};

const tetraminos = {
	I: [
		[0, 0, 0, 0],
		[1, 1, 1, 1],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
	],
	J: [
		[1, 0, 0],
		[1, 1, 1],
		[0, 0, 0],
	],
	L: [
		[0, 0, 1],
		[1, 1, 1],
		[0, 0, 0],
	],
	O: [
		[1, 1],
		[1, 1],
	],
	S: [
		[0, 1, 1],
		[1, 1, 0],
		[0, 0, 0],
	],
	Z: [
		[1, 1, 0],
		[0, 1, 1],
		[0, 0, 0],
	],
	T: [
		[0, 1, 0],
		[1, 1, 1],
		[0, 0, 0],
	],
	colors: { I: 'cyan', O: 'yellow', T: 'purple', S: 'green', Z: 'red', J: 'blue', L: 'orange' },
	keys: ['I', 'J', 'L', 'O', 'S', 'T', 'Z'],
	count: 7,
	size: 30,
};
