export enum BackgroundMode {
	desktop = 'Desktop',
	login = 'Login'
}

export const imgContentModes: 'fill'[] =
	// | 'contain' | 'cover' | 'none' | 'scale-down'
	[
		'fill'
		// 'contain',
		// 'cover',
		// 'none',
		// 'scale-down'
	];

export const firstToUpper = (str: string) => {
	if (str.length === 0) {
		return str;
	}
	return str.trim().toLowerCase().replace(str[0], str[0].toUpperCase());
};

export const getCookie = (cname: string) => {
	const name = cname + '=';
	const ca = document.cookie.split(';');
	for (let i = 0; i < ca.length; i++) {
		const c = ca[i].trim();
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
};
