import {
	get,
	isEmpty,
	last,
	isArray,
	isNumber,
	isString,
	capitalize
} from 'lodash';

export const getValueByUnit = (
	num: string,
	unit: string | undefined,
	precision = 2
) => {
	let value = num === 'NAN' ? 0 : parseFloat(num);

	switch (unit) {
		default:
			break;
		case '':
		case 'default':
			return value;
		case 'iops':
			return Math.round(value);
		case '%':
			value *= 100;
			break;
		case 'm':
			value *= 1000;
			if (value < 1) return 0;
			break;
		case 'Ki':
			value /= 1024;
			break;
		case 'Mi':
			value /= 1024 ** 2;
			break;
		case 'Gi':
			value /= 1024 ** 3;
			break;
		case 'Ti':
			value /= 1024 ** 4;
			break;
		case 'Bytes':
		case 'B':
		case 'B/s':
			break;
		case 'K':
		case 'KB':
		case 'KB/s':
			value /= 1000;
			break;
		case 'M':
		case 'MB':
		case 'MB/s':
			value /= 1000 ** 2;
			break;
		case 'G':
		case 'GB':
		case 'GB/s':
			value /= 1000 ** 3;
			break;
		case 'T':
		case 'TB':
		case 'TB/s':
			value /= 1000 ** 4;
			break;
		case 'bps':
			value *= 8;
			break;
		case 'Kbps':
			value = (value * 8) / 1024;
			break;
		case 'Mbps':
			value = (value * 8) / 1024 / 1024;
			break;
		case 'ms':
			value *= 1000;
			break;
	}

	return Number(value) === 0 ? 0 : Number(value.toFixed(precision));
};

const UnitTypes = {
	second: {
		conditions: [0.01, 0],
		units: ['s', 'ms']
	},
	cpu: {
		conditions: [0.1, 0],
		units: ['core', 'm']
	},
	memory: {
		conditions: [1024 ** 4, 1024 ** 3, 1024 ** 2, 1024, 0],
		units: ['Ti', 'Gi', 'Mi', 'Ki', 'Bytes']
	},
	disk: {
		conditions: [1000 ** 4, 1000 ** 3, 1000 ** 2, 1000, 0],
		units: ['TB', 'GB', 'MB', 'KB', 'Bytes']
	},
	throughput: {
		conditions: [1000 ** 4, 1000 ** 3, 1000 ** 2, 1000, 0],
		units: ['TB/s', 'GB/s', 'MB/s', 'KB/s', 'B/s']
	},
	traffic: {
		conditions: [1000 ** 4, 1000 ** 3, 1000 ** 2, 1000, 0],
		units: ['TB/s', 'GB/s', 'MB/s', 'KB/s', 'B/s']
	},
	bandwidth: {
		conditions: [1024 ** 2 / 8, 1024 / 8, 0],
		units: ['Mbps', 'Kbps', 'bps']
	},
	number: {
		conditions: [1000 ** 4, 1000 ** 3, 1000 ** 2, 1000, 0],
		units: ['T', 'G', 'M', 'K', '']
	}
};

export type UnitKey = keyof typeof UnitTypes;

export const getSuitableUnit = (value: any, unitType: UnitKey) => {
	const config = UnitTypes[unitType];

	if (isEmpty(config)) return '';

	// value can be an array or a single value
	const values = isArray(value) ? value : [[0, Number(value)]];
	let result = last(config.units);
	config.conditions.some((condition, index) => {
		const triggered = values.some(
			(_value) =>
				((isArray(_value) ? get(_value, '[1]') : Number(_value)) ||
					0) >= condition
		);

		if (triggered) {
			result = config.units[index];
		}
		return triggered;
	});
	return result;
};

export const getSuitableValue = (
	value: string,
	unitType: any = 'default',
	defaultValue: string | number = 0
) => {
	if ((!isNumber(value) && !isString(value)) || isNaN(Number(value))) {
		return defaultValue;
	}

	const unit = getSuitableUnit(value, unitType);
	const unitText = unit ? ` ${_capitalize(unit)}` : '';
	const count = getValueByUnit(value, unit || unitType);
	return `${count}${unitText}`;
};

export function getResult(result: any) {
	const data: any = {};
	const results = isArray(result) ? result : get(result, 'results', []) || [];

	if (isEmpty(results)) {
		const metricName = get(result, 'metric_name');

		if (metricName) {
			data[metricName] = result;
		}
	} else {
		results.forEach((item: any) => {
			data[item.metric_name] = item;
		});
	}

	return data;
}

export const _capitalize = (value: string | undefined) => {
	return capitalize(value).replace('_', ' ');
};
