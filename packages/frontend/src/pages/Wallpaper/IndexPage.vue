<template>
	<page-title-component
		:show-back="false"
		:title="t('home_menus.wallpaper')"
	/>

	<bt-scroll-area class="nav-height-scroll-area-conf text-ink-1">
		<div class="row">
			<wallpaper-image
				:width="258"
				:padding="8"
				style="margin-top: 12px; margin-bottom: 20px"
				:src="desktopImgUrl"
				:selected="selectBackgroundMode == BackgroundMode.desktop"
				@click="selectBackgroundMode = BackgroundMode.desktop"
			>
				<template v-slot:legend>
					<q-radio
						size="xs"
						v-model="selectBackgroundMode"
						:val="BackgroundMode.desktop"
						:label="t('desktop_background')"
						class="text-body2 radio-class"
					/>
				</template>
			</wallpaper-image>

			<wallpaper-image
				:width="258"
				:padding="8"
				style="margin-top: 12px; margin-bottom: 20px"
				:src="loginImgUrl"
				:selected="selectBackgroundMode == BackgroundMode.login"
				@click="selectBackgroundMode = BackgroundMode.login"
			>
				<template v-slot:legend>
					<q-radio
						size="xs"
						v-model="selectBackgroundMode"
						:val="BackgroundMode.login"
						:label="t('login_background')"
						class="text-body2 radio-class"
					/>
				</template>
			</wallpaper-image>
		</div>

		<q-separator class="separator-background" />

		<div class="select-avatar-list-bg">
			<div class="row items-center justify-between">
				<div
					class="select-avatar-title-bg row items-center justify-start"
				>
					<q-icon name="sym_r_imagesmode" color="ink-1" size="20px" />
					<div class="text-subtitle2 select-avatar-title">
						{{ t('pictures') }}
					</div>
				</div>
			</div>
			<div class="images-list-bg row justify-start">
				<BtUploader
					:size="5"
					:width="114"
					:height="58.5"
					fileName="image"
					accept=".jpg, image/*"
					action="/images/upload/v1"
					:parmas="{}"
					@ok="ok"
					@fail="fail"
				>
					<wallpaper-image
						:width="104"
						src="upload_default.svg"
						:selected="false"
					/>
				</BtUploader>

				<template
					v-for="(item, index) of uploadBackgrounds"
					:key="`bg` + index"
				>
					<wallpaper-image
						v-if="!!item"
						:width="104"
						:src="
							item.replace(
								'/resources/Home/Pictures',
								'/api/preview/big/Home/Pictures'
							) + '?auth=&inline=true'
						"
						:selected="selectedImgUrl.value === item"
						@click="onSelectPicture(item)"
					/>
				</template>

				<template
					v-for="(image, index) in imgList"
					:key="`paper` + index"
				>
					<wallpaper-image
						:width="104"
						:src="image"
						:selected="selectedImgUrl.value === image"
						@click="onSelectPicture(image)"
					/>
				</template>
			</div>
		</div>
		<div class="select-avatar-list-bg">
			<div class="row items-center justify-between">
				<div
					class="select-avatar-title-bg row items-center justify-start"
				>
					<!-- <q-icon name="sym_r_imagesmode" color="ink-1" size="20px" /> -->
					<div class="text-subtitle2 select-avatar-title">
						<!-- {{ t('pictures') }} -->
						Exterior
					</div>
				</div>
			</div>
			<div class="q-pa-lg">
				<q-option-group
					v-model="backgroundStore.exterior"
					:options="exteriorOptions"
					color="primary"
					@update:model-value="exteriorUpdate"
					inline
				/>
			</div>
		</div>
	</bt-scroll-area>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { BackgroundMode } from 'src/constant';
import {
	useBackgroundStore,
	exteriorOptions,
	Exterior
} from '../../stores/Background';
import WallpaperImage from '../../components/WallpaperImage.vue';
import PageTitleComponent from 'components/PageTitleComponent.vue';
import { debounce, useQuasar, Cookies } from 'quasar';
import { useI18n } from 'vue-i18n';

const backgroundStore = useBackgroundStore();
const selectBackgroundMode = ref(BackgroundMode.desktop);

const { t } = useI18n();
const $q = useQuasar();

const ok = async (response: any) => {
	if (selectBackgroundMode.value == BackgroundMode.desktop) {
		backgroundStore.upload_desktop_background(response.data.imageUrl);
	} else {
		backgroundStore.upload_login_background(response.data.imageUrl);
	}
};

const fail = (response: unknown) => {
	console.log('fail', response);
};

const setDesktopBackground = debounce(async function (item: string) {
	backgroundStore.set_desktop_background(item);
}, 500);

const setLoginBackground = debounce(async function (item: string) {
	backgroundStore.set_login_background(item);
}, 500);

const onSelectPicture = async function (item: string) {
	if (selectBackgroundMode.value == BackgroundMode.desktop) {
		desktopImgUrl.value = item;
		setDesktopBackground(item);
	} else {
		loginImgUrl.value = item;
		setLoginBackground(item);
	}
};

onMounted(async () => {
	backgroundStore.get_wallpaper();
});

const imgList = ref([
	'/bg/0.jpg',
	'/bg/1.jpg',
	'/bg/2.jpg',
	'/bg/3.jpg',
	'/bg/4.jpg',
	'/bg/5.jpg',
	'/bg/6.jpg',
	'/bg/7.jpg',
	'/bg/8.jpg',
	'/bg/9.jpg',
	'/bg/11.jpg',
	'/bg/12.jpg',
	'/bg/13.jpg'
]);
const desktopImgUrl = ref(backgroundStore.wallpaper.desktop);
const loginImgUrl = ref(backgroundStore.wallpaper.login);

const selectedImgUrl = computed(() => {
	if (selectBackgroundMode.value == BackgroundMode.desktop) {
		return desktopImgUrl;
	} else {
		return loginImgUrl;
	}
});

const uploadBackgrounds = computed(() => {
	if (selectBackgroundMode.value == BackgroundMode.desktop) {
		return backgroundStore.wallpaper.upload_desktop_backgrounds;
	} else {
		return backgroundStore.wallpaper.upload_login_backgrounds;
	}
});

// watch(
// 	() => backgroundStore.exterior,
// 	() => {

// 	}
// );

// */
//       path?: string;
//       /**
//        * Cookie domain
//        */
//       domain?: string;
//       /**
//        * SameSite cookie option
//        */
//       sameSite?: "Lax" | "Strict" | "None";
//       /**
//        * Is cookie Http Only?
//        */
//       httpOnly?: boolean;
//       /**
//        * Is cookie secure? (https only)
//        */
//       secure?: boolean;
//       /**
//        * Raw string for other cookie options; To be used as a last resort for possible newer props that are currently not yet implemented in Quasar
//        */
//       other?: string;

const exteriorUpdate = (value: Exterior) => {
	// backgroundStore.exterior = value;
	console.log('window.location.host ===>', window.location.host);
	console.log(Cookies.get('exterior_value'));

	// Cookies.set('exterior_value', `${value}`, {
	// 	domain: 'localhost',
	// 	path: '/',
	// 	sameSite: 'None',
	// 	secure: true
	// });
	// if (backgroundStore.exterior == Exterior.AUTO) {
	// 	$q.dark.set('auto');
	// } else {
	// 	$q.dark.set(backgroundStore.exterior == Exterior.DARK);
	// }
	backgroundStore.exteriorUpdate(value);
};
</script>

<style scoped lang="scss">
.select-avatar-list-bg {
	margin-top: 16px;

	.select-avatar-title-bg {
		.select-avatar-title {
			margin-left: 4px;
		}
	}

	.images-list-bg {
		width: 100%;
		grid-column-gap: 4px;
		grid-row-gap: 4px;
		margin-top: 12px;
	}
}

.radio-class {
	margin-top: 12px;
}
</style>
