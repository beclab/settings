<template>
	<div class="form-item-root column justify-start">
		<q-item
			:clickable="chevronRight"
			class="form-item"
			:class="chevronRight ? 'item' : ''"
			:style="
				deviceStore.isMobile ? 'min-height: 56px' : 'min-height: 64px'
			"
		>
			<q-item-section
				class="form-item-title item-margin-left"
				:class="
					deviceStore.isMobile
						? 'text-subtitle3-m title-margin'
						: 'text-body1 title-margin-mobile'
				"
				v-if="title"
				:style="data ? 'width: 40%;' : ''"
			>
				{{ title }}
			</q-item-section>
			<q-item-section
				v-else
				class="form-item-title item-margin-left"
				:class="
					deviceStore.isMobile ? 'text-subtitle3-m' : 'text-body1'
				"
			>
				<slot name="title" />
			</q-item-section>
			<q-item-section
				side
				class="item-margin-right"
				:style="
					dataWidthP > 0
						? `width: ${dataWidthP}%;`
						: dataMaxWidthP > 0
						? `max-width:${dataMaxWidthP}%`
						: ''
				"
			>
				<div
					class="form-item-data"
					v-if="data"
					:class="
						deviceStore.isMobile ? 'text-body3-m' : 'text-body2'
					"
				>
					{{ data }}
				</div>
				<q-icon
					v-else-if="chevronRight"
					name="sym_r_chevron_right"
					size="20px"
				/>
				<slot v-else />
			</q-item-section>
		</q-item>
		<bt-separator v-if="widthSeparator" :offset="16" />
	</div>
</template>

<script lang="ts" setup>
import { useDeviceStore } from '../../stores/device';
import BtSeparator from '../base/BtSeparator.vue';

defineProps({
	title: {
		type: String,
		required: false,
		default: ''
	},
	data: {
		type: String,
		require: false
	},
	chevronRight: {
		type: Boolean,
		default: false
	},
	widthSeparator: {
		type: Boolean,
		default: true
	},
	marginTop: {
		type: Boolean,
		default: true
	},
	dataMaxWidthP: {
		type: Number,
		default: 60
	},
	dataWidthP: {
		type: Number,
		default: 0
	}
});
const deviceStore = useDeviceStore();
</script>

<style scoped lang="scss">
.form-item-root {
	width: 100%;
	height: auto;
	// padding-right: 20px;

	.form-item {
		// height: 64px;
		min-height: 64px;
		padding: 0;
		// padding: 12px 0px;

		.form-item-title {
			color: $ink-1;
			word-wrap: break-word;
			word-break: break-all;
			white-space: wrap;
		}

		.title-margin {
			margin-top: 18px;
			margin-bottom: 18px;
		}

		.title-margin-mobile {
			margin-top: 20px;
			margin-bottom: 20px;
		}

		.form-item-data {
			text-align: right;
			color: $ink-2;
			// word-wrap: break-word;
			// word-break: break-all;
			// white-space: wrap;
			// overflow: hidden;
			word-wrap: break-word;
			word-break: break-all;
			white-space: wrap;
		}
	}
}
</style>
