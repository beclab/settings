<template>
	<page-title-component :title="title" :show-back="true" />
	<bt-scroll-area class="nav-height-scroll-area-conf">
		<div class="text-body3-m text-ink-3 q-mt-md q-mb-md">
			{{ detail }}
		</div>
		<q-list class="mobile-items-list">
			<bt-form-item
				v-for="(option, index) in options"
				:key="index"
				:width-separator="index + 1 < options.length"
				:clickable="true"
				@click="onInput(option.value)"
			>
				<template v-slot:title>
					<div
						:class="
							current == option.value
								? 'text-blue-default'
								: 'text-ink-1'
						"
					>
						{{ option.label }}
					</div>
				</template>
				<q-icon
					name="sym_r_check_circle"
					size="18px"
					color="blue-default"
					v-if="current == option.value"
				/>
			</bt-form-item>
		</q-list>
	</bt-scroll-area>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import PageTitleComponent from '../../../components/PageTitleComponent.vue';
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';
import { useVideoStore } from '../../../stores/video';
import { encodingThreadCountSelectCommonOption } from '../../../services/abstractions/video/service';
import BtFormItem from '../../../components/base/BtFormItem.vue';
import VideoService from '../../../services/video';
import { downMixStereoAlgorithmTypeOptions } from '../../../services/abstractions/video/service';
import { encoderPresetTypeOptions } from '../../../services/abstractions/video/service';

const route = useRoute();
const { t } = useI18n();

const type = route.params.type as string;
const videoStore = useVideoStore();
const title = ref('');
const detail = ref('');

const options = ref([] as any);

const current = ref();

const router = useRouter();

const configData = () => {
	if (type == 'transcodingThreadCount') {
		title.value = videoStore.transcodingSettings.encodingThreadCount.name;
		detail.value = t(
			'Select the maximum number of threads to use when transcoding. Reducing the thread count will lower CPU usage but may not convert fast enough for a smooth playback experience.'
		);
		options.value = encodingThreadCountSelectCommonOption;
		current.value =
			videoStore.transcodingSettings.encodingThreadCount.value;
	} else if (type == 'downMixStereoAlgorithm') {
		title.value = videoStore.audioTranscoding.downMixStereoAlgorithm.name;
		detail.value = t(
			'Algorithm used to downmix multi-channel audio to stereo.'
		);
		options.value = downMixStereoAlgorithmTypeOptions;
		current.value =
			videoStore.audioTranscoding.downMixStereoAlgorithm.value;
	} else if (type == 'encoderPreset') {
		title.value = videoStore.encodingQuality.encoderPreset.name;
		detail.value = t(
			'Pick a faster value to improve performance, or a slower value to improve quality.'
		);
		options.value = encoderPresetTypeOptions;
		current.value = videoStore.encodingQuality.encoderPreset.value;
	}
};
configData();

const onInput = (value: any) => {
	if (type == 'transcodingThreadCount') {
		videoStore.transcodingSettings.encodingThreadCount.value = value;
		VideoService.updateInitDataProps({
			EncodingThreadCount: value
		});
	}
	if (type == 'downMixStereoAlgorithm') {
		videoStore.audioTranscoding.downMixStereoAlgorithm.value = value;
		VideoService.updateInitDataProps({
			DownMixStereoAlgorithm: value
		});
	}
	if (type == 'encoderPreset') {
		videoStore.encodingQuality.encoderPreset.value = value;
		VideoService.updateInitDataProps({
			EncoderPreset: value
		});
	}
	router.back();
};
</script>

<style scoped lang="scss"></style>
