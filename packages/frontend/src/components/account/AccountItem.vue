<template>
	<q-item
		:class="border ? 'q-list-class' : 'q-pa-none'"
		:style="border ? 'height: 80px' : ''"
		:clickable="clickable"
		@click="accountClick"
	>
		<q-item-section>
			<div class="row items-center">
				<q-img
					width="40px"
					height="40px"
					:noSpinner="true"
					:src="`account/${imgName}.png`"
					v-if="imgName && imgName.length"
				/>
				<slot name="avatar" v-else />
				<div
					class="column justify-start"
					:class="detail && detail.length > 0 ? '' : 'justify-center'"
					style="margin-left: 8px"
				>
					<div class="row">
						<div class="text-subtitle2 account-title">
							{{ title }}
						</div>
						<div
							class="status-common q-px-md q-ml-sm"
							:class="
								available
									? 'status-available'
									: 'status-unabled'
							"
						>
							{{ available ? t('active') : t('inactive') }}
						</div>
					</div>
					<div
						class="text-body3 account-detail q-mt-xs"
						v-if="detail && detail.length"
					>
						{{ detail }}
					</div>
				</div>
			</div>
		</q-item-section>
		<q-item-section side v-if="side">
			<q-icon name="sym_r_chevron_right" color="ink-1" size="20px" />
		</q-item-section>
		<q-item-section side>
			<slot name="side" />
		</q-item-section>
	</q-item>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
defineProps({
	imgName: {
		required: false,
		default: '',
		type: String
	},

	title: {
		required: false,
		default: '',
		type: String
	},
	detail: {
		required: false,
		default: '',
		type: String
	},
	side: {
		required: false,
		default: true,
		type: Boolean
	},
	clickable: {
		required: false,
		default: true,
		type: Boolean
	},
	available: {
		required: true,
		type: Boolean
	},
	border: {
		type: Boolean,
		required: false,
		default: true
	}
});

const { t } = useI18n();

const accountClick = () => {
	emit('accountClick');
};

const emit = defineEmits(['accountClick']);
</script>

<style scoped lang="scss">
.account-title {
	color: $ink-1;
}

.status-common {
	height: 20px;
	border-radius: 4px;
}

.status-available {
	background: var(---green-soft, #e5ffee);
	color: var(--positive, #29cc5f);
}

.status-unabled {
	background: var(---red-soft, #fff2f2);
	color: var(--negative, #ff4d4d);
}

.account-detail {
	color: $ink-3;
}
</style>
