export function secondsToString(seconds) {
	const stringArray = [];

	// Dias
	if(seconds >= 86400) {
		const x = Math.floor(seconds / 86400);
		seconds -= 86400 * x;
		stringArray.push(`${x} dia${x > 1 ? 's' : ''}`);
	}

	// Horas
	if(seconds >= 3600) {
		const x = Math.floor(seconds / 3600);
		seconds -= 3600 * x;
		stringArray.push(`${x} hora${x > 1 ? 's' : ''}`);
	}

	// Minutos
	if(seconds >= 60) {
		const x = Math.floor(seconds / 60);
		seconds -= 60 * x;
		stringArray.push(`${x} minuto${x > 1 ? 's' : ''}`);
	}

	// Segundos
	if(seconds >= 1) stringArray.push(`${seconds.toFixed(2)} segundo${seconds > 1 ? 's' : ''}`);

	return stringArray.map((string, i) => {
		const or = i === stringArray.length - 1 && stringArray.length > 1 ? 'e ' : '';

		return `${or}${string}`;
	}).join(stringArray.length > 2 ? ', ' : ' ');
}