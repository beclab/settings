<template>
	<page-title-component :title="t('Encoding Scheme')" :show-back="true" />
	<bt-scroll-area class="nav-height-scroll-area-conf">
		<adaptive-layout>
			<template v-slot:pc>
				<q-list class="q-list-class">
					<div class="text-body1 text-ink-1">
						{{ t('Encoding format options') }}
					</div>
					<div
						class="text-body3 text-ink-3 q-mt-sm"
						style="max-width: 400px"
					>
						{{
							t(
								'Select the video encoding that we should transcode to. We will use software encoding when hardware acceleration for the selected format is not available. H264 encoding will always be enabled.'
							)
						}}
					</div>
					<bt-form-item
						:title="
							videoStore.encodingeScheme.allowHevcEncoding.name
						"
					>
						<q-toggle
							v-model="
								videoStore.encodingeScheme.allowHevcEncoding
									.value
							"
							@update:model-value="updateAllowHevcEncoding"
						/>
					</bt-form-item>
					<bt-form-item
						:title="
							videoStore.encodingeScheme.allowAv1Encoding.name
						"
						:width-separator="false"
					>
						<q-toggle
							v-model="
								videoStore.encodingeScheme.allowAv1Encoding
									.value
							"
							@update:model-value="updateAllowAv1Encoding"
						/>
					</bt-form-item>
				</q-list>
			</template>
			<template v-slot:mobile>
				<div class="text-body3-m text-ink-3 q-mt-md q-mb-md">
					{{
						t(
							'Select the video encoding that we should transcode to. We will use software encoding when hardware acceleration for the selected format is not available. H264 encoding will always be enabled.'
						)
					}}
				</div>
				<q-list class="mobile-items-list">
					<bt-form-item
						:title="
							videoStore.encodingeScheme.allowHevcEncoding.name
						"
					>
						<q-toggle
							v-model="
								videoStore.encodingeScheme.allowHevcEncoding
									.value
							"
							@update:model-value="updateAllowHevcEncoding"
						/>
					</bt-form-item>
					<bt-form-item
						:title="
							videoStore.encodingeScheme.allowAv1Encoding.name
						"
						:width-separator="false"
					>
						<q-toggle
							v-model="
								videoStore.encodingeScheme.allowAv1Encoding
									.value
							"
							@update:model-value="updateAllowAv1Encoding"
						/>
					</bt-form-item>
				</q-list>
			</template>
		</adaptive-layout>
	</bt-scroll-area>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import PageTitleComponent from '../../../components/PageTitleComponent.vue';
// import { useDeviceStore } from '../../../stores/device';
import BtFormItem from '../../../components/base/BtFormItem.vue';
import { useVideoStore } from '../../../stores/video';
import VideoService from '../../../services/video';
import AdaptiveLayout from '../../../components/AdaptiveLayout.vue';

const { t } = useI18n();
// const deviceStore = useDeviceStore();
const videoStore = useVideoStore();

const updateAllowHevcEncoding = (value: boolean) => {
	VideoService.updateInitDataProps({
		AllowHevcEncoding: value
	});
};
const updateAllowAv1Encoding = (value: boolean) => {
	VideoService.updateInitDataProps({
		AllowAv1Encoding: value
	});
};
</script>

<style scoped lang="scss"></style>
