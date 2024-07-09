<template>
	<q-item class="q-list-class" :clickable="false">
		<q-item-section>
			<div class="row items-center">
				<div
					class="column justify-start"
					:class="detail && detail.length > 0 ? '' : 'justify-center'"
					style="margin-left: 8px"
				>
					<div class="row">
						<div class="text-subtitle2 account-title">
							{{ title }}
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
	</q-item>
</template>

<script setup lang="ts">
defineProps({
	title: {
		required: false,
		default: '',
		type: String
	},
	detail: {
		required: false,
		default: '',
		type: String
	}
});
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
