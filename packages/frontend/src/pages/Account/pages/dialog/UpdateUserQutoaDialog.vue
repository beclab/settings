<template>
	<q-dialog ref="dialogRef" @hide="onDialogHide">
		<div class="common-dialog" style="border-radius: 16px">
			<DialogHeader
				:title="t('modify_limits')"
				@close-action="dialogRef?.hide()"
			></DialogHeader>
			<div class="dialog-content-root">
				<terminus-edit
					v-model="cpuLimit"
					:label="t('cpu')"
					:show-password-img="false"
					:is-error="
						cpuLimit.length > 0 && cpuLimitRule(cpuLimit).length > 0
					"
					:error-message="cpuLimitRule(cpuLimit)"
				>
					<template v-slot:right>
						<edit-number-right-slot
							v-model="cpuLimit"
							label="core"
						/>
					</template>
				</terminus-edit>

				<terminus-edit
					v-model="memoryLimit"
					:label="t('memory')"
					:show-password-img="false"
					class="q-mt-md"
					:is-error="
						memoryLimit.length > 0 &&
						memoryLimitRule(memoryLimit).length > 0
					"
					:error-message="memoryLimitRule(memoryLimit)"
				>
					<template v-slot:right>
						<edit-number-right-slot
							v-model="memoryLimit"
							label="GB"
						/>
					</template>
				</terminus-edit>

				<dialog-footer
					:confirm-text="t('ok')"
					:confirm-disable="!enableCreate"
					@cancel-action="onDialogCancel"
					@confirm-action="onOKClick"
				/>
			</div>
		</div>
	</q-dialog>
</template>
<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { computed, onMounted, ref } from 'vue';
import DialogHeader from '../../../../components/DialogHeader.vue';
import DialogFooter from '../../../../components/DialogFooter.vue';
import TerminusEdit from '../../../../components/base/TerminusEdit.vue';
import EditNumberRightSlot from '../../../../components/EditNumberRightSlot.vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
	cpu: {
		required: true,
		type: Number
	},
	memory: {
		required: true,
		type: Number
	}
});

defineEmits([...useDialogPluginComponent.emits]);

const cpuLimit = ref('1');
const memoryLimit = ref('4');
const { t } = useI18n();

onMounted(() => {
	cpuLimit.value = `${props.cpu}`;
	memoryLimit.value = `${props.memory}`;
});

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
	useDialogPluginComponent();

function onOKClick() {
	onDialogOK({ cpuLimit: cpuLimit.value, memoryLimit: memoryLimit.value });
}

const cpuLimitRule = (val: string) => {
	if (val.length === 0) {
		return t('errors.cpu_limit_is_empty');
	}
	let rule = /^[+-]?(\d+\.?\d*|\.\d+)$/;
	if (!rule.test(val)) {
		return t('errors.only_valid_numbers_can_be_entered');
	}
	return '';
};

const memoryLimitRule = (val: string) => {
	if (val.length === 0) {
		return t('errors.memory_limit_is_empty');
	}
	let rule = /^[+-]?(\d+\.?\d*|\.\d+)$/;
	if (!rule.test(val)) {
		return t('errors.only_valid_numbers_can_be_entered');
	}
	return '';
};

const enableCreate = computed(() => {
	return (
		cpuLimitRule(cpuLimit.value).length == 0 &&
		memoryLimitRule(memoryLimit.value).length == 0
	);
});
</script>
<style lang="scss" scoped>
.cpu-core {
	text-align: right;
}
</style>
