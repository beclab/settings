export const toZeroZoneTime = (time: string) => {
	const hourAndMinuts = time.split(':');

	const zoneOffset = new Date().getTimezoneOffset() / 60;

	let zeroTime = parseInt(hourAndMinuts[0]) + zoneOffset;

	if (zeroTime < 0) {
		zeroTime += 24;
	}
	if (zeroTime > 24) {
		zeroTime -= 24;
	}
	const hourStr = formatNumber(zeroTime, 2);
	const realTime = `${hourStr}:${hourAndMinuts[1]}`;
	return realTime;
};

export const toCurrentZoneTime = (time: string) => {
	const hourAndMinuts = time.split(':');

	const zoneOffset = new Date().getTimezoneOffset() / 60;

	let zeroTime = parseInt(hourAndMinuts[0]) - zoneOffset;

	if (zeroTime < 0) {
		zeroTime += 24;
	}
	if (zeroTime > 24) {
		zeroTime -= 24;
	}
	const hourStr = formatNumber(zeroTime, 2);
	const realTime = `${hourStr}:${hourAndMinuts[1]}`;

	return realTime;
};

function formatNumber(num: number, length: number) {
	return (Array(length).join('0') + num).slice(-length);
}

export const timestempToTime = (timestemp: number) => {
	const date = new Date(timestemp);
	return (
		formatNumber(date.getHours(), 2) +
		':' +
		formatNumber(date.getMinutes(), 2)
	);
};

export const timeToTimeStemp = (time: string) => {
	const aaa = `1970-01-01T${time}:00`;
	const realTime = new Date(aaa).getTime();
	return realTime;
};
