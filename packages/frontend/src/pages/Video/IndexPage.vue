<template>
	<page-title-component :show-back="false" :title="t('video')" />
	<bt-scroll-area class="nav-height-scroll-area-conf">
		<q-list
			:class="deviceStore.isMobile ? 'mobile-items-list' : 'q-list-class'"
		>
			<bt-form-item
				v-for="(page, index) in pages"
				:key="page.name"
				:title="page.name"
				@click="enterPage(page.path)"
				:chevronRight="true"
				:width-separator="index + 1 < pages.length"
			/>
		</q-list>
	</bt-scroll-area>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import PageTitleComponent from '../../components/PageTitleComponent.vue';
import BtFormItem from '../../components/base/BtFormItem.vue';
import { useDeviceStore } from '../../stores/device';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
import { useVideoStore } from '../../stores/video';
import VideoService from '../../services/video';

const { t } = useI18n();
const deviceStore = useDeviceStore();
const videoStore = useVideoStore();
const router = useRouter();

const pages = ref([
	{
		name: t('Hardware Acceleration'),
		path: '/video/hardwareAcceleration'
	},
	{
		name: t('Encoding Scheme'),
		path: '/video/encodingScheme'
	},
	{
		name: t('Transcoding Settings'),
		path: '/video/transcodingSettings'
	},
	{
		name: t('Audio Transcoding'),
		path: '/video/audioTranscoding'
	},
	{
		name: t('Encoding Quality'),
		path: '/video/encodingQuality'
	},
	{
		name: t('Others'),
		path: '/video/others'
	}
]);
const enterPage = (path: string) => {
	router.push(path);
};

onMounted(async () => {
	try {
		if (!VideoService.initData) {
			const config = await videoStore.getVideoConfig();
			VideoService.configInitData(config);
			console.log(config);
		}
	} catch (error) {
		console.log(error);
	}
});
</script>

<style scoped lang="scss"></style>
