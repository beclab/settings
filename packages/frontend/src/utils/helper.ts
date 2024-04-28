import axios from 'axios';
export interface PathObject {
	url: string;
	name: string;
	selected?: boolean;
}

export const debounce = <F extends (...args: unknown[]) => unknown>(
	func: F,
	wait: number
): ((...args: Parameters<F>) => ReturnType<F>) => {
	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	const debounced = function (
		this: ThisParameterType<F>,
		...args: Parameters<F>
	) {
		if (timeoutId !== null) {
			clearTimeout(timeoutId);
		}

		timeoutId = setTimeout(() => {
			func.apply(this, args);
		}, wait);
	};

	return debounced as (...args: Parameters<F>) => ReturnType<F>;
};

export const fetchData = (
	url: string,
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
	data?: object
): Promise<unknown> => {
	const options: Record<string, unknown> = {
		method,
		url,
		withCredentials: true,
		data: {}
	};
	if (data) {
		options.data = data;
	}
	return axios(options).then((res) => res.data);
};

const debouncedFetchData = debounce(
	fetchData as (...args: unknown[]) => unknown,
	1000
);

const paths: string[] = [
	'api/public/links/chinesesu.png',
	'api/public/links/jellyfin.png',
	'api/public/links/mastodon.png',
	'api/public/links/miniflux.png',
	'api/public/links/mylar3.png',
	'api/public/links/photoprism.png',
	'api/public/links/radarr.png',
	'api/public/links/radicale.png',
	'api/public/links/readarr.png',
	'api/public/links/rsshub.png'
];

const newArray: PathObject[] = paths.map((path: string) => {
	const parts = path.split('/');
	const fileName = parts.pop() || '';
	const name = fileName.split('.')[0];
	return {
		url: path,
		name: name,
		selected: false
	};
});

const updateThumbnail = (
	input?: string,
	tempArr?: PathObject[]
): PathObject[] => {
	const resultArr: PathObject[] =
		tempArr && tempArr?.length > 0 ? tempArr : newArray;
	if (!input) {
		return resultArr.map((item) => ({
			...item,
			selected: false
		}));
	}

	const foundIndex = resultArr.findIndex((item) => item.url === input);
	if (foundIndex === -1) {
		const newItem: PathObject = {
			url: input,
			name: 'upload',
			selected: true
		};
		return [
			newItem,
			...resultArr.map((item) => ({ ...item, selected: false }))
		];
	} else {
		return resultArr.map((item, index) => ({
			...item,
			selected: index === foundIndex
		}));
	}
};

const getCookieValue = (name: string): string | null => {
	const pattern = new RegExp('(^|;\\s*)' + name + '=([^;]*)');
	const match = pattern.exec(document.cookie);
	return match ? match[2] : null;
};

function getRequireImage(path: string): string {
	if (!path) {
		return '';
	}
	if (path.startsWith('http')) {
		return path;
	}
	return require(`../assets/${path}`);
}

export { debouncedFetchData, updateThumbnail, getCookieValue, getRequireImage };
