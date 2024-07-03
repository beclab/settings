<template>
	<div class="empty-parent column items-center">
		<q-img src="default_empty.svg" class="empty-image" />
		<div class="text-body2 empty-text">
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
	</div>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
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
</script>

<style scoped lang="scss">
.empty-parent {
	width: 100%;
	height: calc(100% - 56px);

	.empty-image {
		margin-top: 144px;
		width: 160px;
		height: 160px;
	}

	.empty-text {
		text-align: center;
		color: $ink-2;
	}
}
</style>
