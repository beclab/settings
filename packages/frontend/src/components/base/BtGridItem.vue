<template>
	<div class="bt-grid-item-root column justify-start">
		<div class="row justify-start">
			<div class="text-body2 bt-grid-item-value" v-if="value">
				{{ value }}
			</div>
			<slot name="value" />
			<q-popup-proxy class="reminder_banner" v-if="popupInfo">
				<div v-html="popupInfo" />
			</q-popup-proxy>
			<q-img class="bt-grid-item-image" :src="icon" v-if="icon" />
		</div>
		<div class="text-overline bt-grid-item-label">{{ label }}</div>
	</div>
</template>

<script lang="ts" setup>
defineProps({
	label: {
		type: String,
		require: true
	},
	value: {
		type: String,
		required: false,
		default: ''
	},
	icon: {
		type: String,
		require: false
	},
	popupInfo: {
		type: String,
		require: false
	}
});
</script>

<style scoped lang="scss">
.bt-grid-item-root {
	.bt-grid-item-value {
		color: $ink-1;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		width: 170px;
	}

	.bt-grid-item-image {
		margin-left: 4px;
		width: 20px;
		height: 20px;
	}

	.bt-grid-item-label {
		text-transform: capitalize;
		margin-top: 4px;
		color: $ink-2;
	}
}
</style>
