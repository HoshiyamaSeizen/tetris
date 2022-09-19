const loadLeaderBoard = (gameOver = false) => {
	let highscores = JSON.parse(localStorage.getItem('highscores')) || [];

	if (gameOver) {
		let top = 0;
		for (const { score } of highscores) {
			if (instance.score > score) break;
			top++;
		}

		if (top < 10 || highscores.length < 10) {
			highscores.splice(top, 0, {
				name: localStorage.getItem('username'),
				score: instance.score,
				level: instance.level,
			});
			if (highscores.length > 10) highscores.pop();
			localStorage.setItem('highscores', JSON.stringify(highscores));
		}

		document.getElementById('place').innerText =
			top < 10 ? `You are #${top + 1} in the leaderboard!` : '';
		document.getElementById('go-score').textContent = instance.score;
		document.getElementById('go-level').textContent = instance.level;
	}

	const names = [];
	highscores = highscores.filter((obj) => {
		if (names.includes(obj.name)) return false;
		names.push(obj.name);
		return true;
	});
	console.log(names);

	document.getElementById('leaderboard-container').setAttribute('shown', true);
	const leaderboard = document.getElementById('leaderboard').getElementsByTagName('tbody')[0];
	leaderboard.innerHTML = '';
	highscores.forEach((el, index) => {
		const tr = leaderboard.insertRow();
		const place = tr.insertCell();
		const name = tr.insertCell();
		const score = tr.insertCell();
		const level = tr.insertCell();
		place.innerText = index + 1;
		name.innerText = el.name;
		score.innerText = el.score;
		level.innerText = el.level;
	});
	document.getElementById('gameover-container').setAttribute('shown', gameOver);
};
