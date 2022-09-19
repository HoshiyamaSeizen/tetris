const loadName = (isMain) => {
	if (isMain)
		document.getElementById('username').innerText = localStorage.getItem('username') || '空白';
	else document.getElementById('inp-username').value = localStorage.getItem('username');
};

const saveName = (form) => {
	localStorage.setItem('username', form.elements['username'].value.trim());
};

const closeGameOver = () => {
	document.getElementById('leaderboard-container').setAttribute('shown', false);
};

const openLeaderBoard = () => loadLeaderBoard();

const setStartOnEnter = () => {
	document.addEventListener('keydown', (e) => {
		if (e.code === 'Enter' || e.code === 'Space') {
			e.preventDefault();
			document.getElementById('btn-start').click();
		} else if (e.key) {
			const inp = document.getElementById('inp-username');
			if (document.activeElement !== inp) inp.focus();
		}
	});
};

let pressed = false;
const setKeys = () => {
	document.addEventListener('keydown', (e) => {
		if (
			['Enter', 'Space', 'Escape', 'Backspace', 'KeyL'].includes(e.code) &&
			document.getElementById('leaderboard-container').getAttribute('shown') === 'true'
		) {
			document.getElementById('close').click();
			return;
		}

		if (e.code === 'Enter' && !e.repeat) toggleGame();
		else if (e.code === 'Space' && !e.repeat && instance.running) pause();
		else if (e.code === 'KeyL' && !e.repeat) document.getElementById('l-btn').click();
		else if (e.code === 'Escape' || e.code === 'Backspace') {
			e.preventDefault();
			document.getElementById('back').click();
		}

		if (!instance.running || instance.paused) return;

		const { field, tetramino } = instance;
		if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
			const x = tetramino.x + (e.code === 'ArrowLeft' ? -1 : 1);
			if (isValidMove(field, tetramino.matrix, x, tetramino.y)) tetramino.x = x;
		} else if (e.code === 'ArrowUp') {
			const matrix = rotate(tetramino.matrix);
			if (isValidMove(field, matrix, tetramino.x, tetramino.y)) tetramino.matrix = matrix;
		} else if (e.code === 'ArrowDown' && !e.repeat) {
			pressed = true;
			(move = () => {
				if (pressed) {
					const t = instance.tetramino;
					const y = t.y + 1;
					if (isValidMove(field, t.matrix, t.x, y)) t.y = y;
					setTimeout(move, 80);
				}
			})();
		}
	});

	document.addEventListener('keyup', (e) => e.code === 'ArrowDown' && (pressed = false));
	playAudio('load');
};
