<template>
	<page-title-component
		:show-back="false"
		:title="t('home_menus.appearance')"
	/>

	<bt-scroll-area class="nav-height-scroll-area-conf text-ink-1">
		<AdaptiveLayout>
			<template v-slot:pc>
				<div class="q-list-class" style="padding-bottom: 0px">
					<div class="row justify-between select-radio-bg">
						<div class="text-subtitle1">
							{{ t('theme') }}
						</div>
						<div class="row">
							<wallpaper-image
								class="q-mr-xs"
								:width="166"
								src="theme/light.jpg"
								:selected="
									backgroundStore.theme ==
									ThemeDefinedMode.LIGHT
								"
								@click="themeUpdate(ThemeDefinedMode.LIGHT)"
							>
								<template v-slot:legend>
									<q-radio
										size="xs"
										v-model="backgroundStore.theme"
										:val="ThemeDefinedMode.LIGHT"
										:label="themeOptions[0].label"
										class="text-body2 radio-class"
										@update:model-value="themeUpdate"
									/>
								</template>
							</wallpaper-image>

							<wallpaper-image
								:width="166"
								style=""
								src="theme/dark.jpg"
								:selected="
									backgroundStore.theme ==
									ThemeDefinedMode.DARK
								"
								@click="themeUpdate(ThemeDefinedMode.DARK)"
							>
								<template v-slot:legend>
									<q-radio
										size="xs"
										v-model="backgroundStore.theme"
										:val="ThemeDefinedMode.DARK"
										:label="themeOptions[1].label"
										class="text-body2 radio-class"
										@update:model-value="themeUpdate"
									/>
								</template>
							</wallpaper-image>
						</div>
					</div>
				</div>
			</template>
			<template v-slot:mobile>
				<div class="text-subtitle1-m q-mt-lg">
					{{ t('theme') }}
				</div>
				<div
					class="row mobile-items-list items-center justify-center"
					style="height: 212px"
				>
					<wallpaper-image
						class="q-mr-xl"
						:width="72"
						src="theme/mobile_light.png"
						:border-width="2"
						:border-radius="12"
						:selected="
							backgroundStore.theme == ThemeDefinedMode.LIGHT
						"
						@click="themeUpdate(ThemeDefinedMode.LIGHT)"
					>
						<template v-slot:legend>
							<q-radio
								size="xs"
								v-model="backgroundStore.theme"
								:val="ThemeDefinedMode.LIGHT"
								:label="themeOptions[0].label"
								class="text-body2 radio-class"
								@update:model-value="themeUpdate"
							/>
						</template>
					</wallpaper-image>

					<wallpaper-image
						:width="72"
						:border-width="2"
						:border-radius="12"
						src="theme/mobile_dark.png"
						:selected="
							backgroundStore.theme == ThemeDefinedMode.DARK
						"
						@click="themeUpdate(ThemeDefinedMode.DARK)"
					>
						<template v-slot:legend>
							<q-radio
								size="xs"
								v-model="backgroundStore.theme"
								:val="ThemeDefinedMode.DARK"
								:label="themeOptions[1].label"
								class="text-body2 radio-class"
								@update:model-value="themeUpdate"
							/>
						</template>
					</wallpaper-image>
				</div>
			</template>
		</AdaptiveLayout>
		<AdaptiveLayout>
			<template v-slot:pc>
				<div class="q-list-class">
					<div class="row justify-between select-radio-bg">
						<div class="text-subtitle1">
							{{ t('wallpaper') }}
						</div>
						<div class="row">
							<wallpaper-image
								:width="166"
								class="q-mr-xs"
								:src="desktopImgUrl"
								:selected="
									selectBackgroundMode ==
									BackgroundMode.desktop
								"
								@click="
									selectBackgroundMode =
										BackgroundMode.desktop
								"
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
								:width="166"
								style=""
								:src="loginImgUrl"
								:selected="
									selectBackgroundMode == BackgroundMode.login
								"
								@click="
									selectBackgroundMode = BackgroundMode.login
								"
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
					</div>
					<q-separator class="separator-background" />

					<div class="select-avatar-list-bg">
						<div class="row items-center justify-between">
							<div
								class="select-avatar-title-bg row items-center justify-start"
							>
								<q-icon
									name="sym_r_imagesmode"
									color="ink-1"
									size="20px"
								/>
								<div class="text-subtitle2 select-avatar-title">
									{{ t('pictures') }}
								</div>
							</div>
						</div>
						<div class="images-list-bg row justify-start">
							<BtUploader
								:size="5"
								:width="105"
								:height="51"
								fileName="image"
								accept=".jpg, image/*"
								action="/images/upload/v1"
								:parmas="{}"
								@ok="ok"
								@fail="fail"
							>
								<wallpaper-image
									:width="95"
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
									:width="99.5"
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
								v-for="index in 28"
								:key="`paper` + index"
							>
								<wallpaper-image
									:width="99.5"
									:src="`/bg/${index - 1}.jpg`"
									:padding="2"
									:selected="
										selectedImgUrl.value ===
										`/bg/${index - 1}.jpg`
									"
									@click="
										onSelectPicture(`/bg/${index - 1}.jpg`)
									"
								/>
							</template>
						</div>
					</div>
				</div>
			</template>
		</AdaptiveLayout>
	</bt-scroll-area>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { BackgroundMode } from '../../constant';
import { useBackgroundStore, themeOptions } from '../../stores/Background';
import WallpaperImage from '../../components/WallpaperImage.vue';
import PageTitleComponent from '../../components/PageTitleComponent.vue';
import { debounce } from 'quasar';
import { useI18n } from 'vue-i18n';
import { ThemeDefinedMode } from '@bytetrade/ui';
import AdaptiveLayout from '../../components/AdaptiveLayout.vue';

const backgroundStore = useBackgroundStore();
const selectBackgroundMode = ref(BackgroundMode.desktop);

const { t } = useI18n();

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

const themeUpdate = (theme: ThemeDefinedMode) => {
	backgroundStore.themeUpdate(theme);
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
	margin-top: 8px;
}

.select-radio-bg {
	height: 164px;
	width: 100%;
	padding-top: 8px;
}
</style>
