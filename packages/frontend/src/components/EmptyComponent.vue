<template>
	<div class="empty-parent column items-center">
		<q-img src="default_empty.svg" class="empty-image" />
		<div
			class="empty-text"
			:class="
				deviceStore.isMobile
					? 'text-subtitle1-m text-ink-1'
					: 'text-body2 text-ink-2'
			"
		>
			{{
				info.length > 0
					? info
					: emptyItem.length > 0
					? t('no_item_available', {
							item: emptyItem
					  })
					: ''
			}}
		</div>
		<slot name="more" />
	</div>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useDeviceStore } from '../stores/device';
defineProps({
	info: {
		type: String,
		required: false,
		default: ''
	},
	emptyItem: {
		type: String,
		required: false,
		default: ''
	}
});
const { t } = useI18n();
const deviceStore = useDeviceStore();
</script>

<style scoped lang="scss">
.empty-parent {
	width: 100%;
	height: calc(100% - 56px);

	.empty-image {
		margin-top: 144px;
		width: 240px;
		height: 240px;
	}

	.empty-text {
		text-align: center;
	}
}
</style>
