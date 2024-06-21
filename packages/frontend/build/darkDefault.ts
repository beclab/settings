function getCookie(name) {
	const strcookie = document.cookie;
	const arrcookie = strcookie.split('; ');
	for (let i = 0; i < arrcookie.length; i++) {
		const arr = arrcookie[i].split('=');
		if (arr[0] == name) {
			return arr[1];
		}
	}
	return '';
}
const themeValue = getCookie('theme_name');
if (themeValue && Number(themeValue) == 2) {
	document.body.style.background = '#1f1f1f';
}
