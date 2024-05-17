<template>
	<page-title-component
		:show-back="true"
		:title="t('network_authority_policy')"
	/>

	<bt-scroll-area class="nav-height-scroll-area-conf">
		<q-list class="q-list-class">
			<!-- <bt-form-item :title="t('select_authority')">
				<bt-select v-model="authorityType" :options="authorityLevel" />
			</bt-form-item>
			<error-message-tip
				v-if="authorityType === '3' || authorityType === '4'"
				:is-error="!isRegIP"
				:error-message="t('errors.ip_input_error')"
				:with-popup="true"
				:popup-message="t('ip_input_popup_message')"
			>
				<bt-form-item title="IP" :width-separator="false">
					<bt-edit-view
						style="width: 400px"
						:placeholder="t('ip_input_popup_message')"
						v-model="appointIP"
						:is-read-only="false"
						:right="true"
					/>
				</bt-form-item>
			</error-message-tip> -->
			<bt-form-item
				:title="t('select_factor_model')"
				:width-separator="false"
			>
				<bt-select v-model="factorModel" :options="factorOptions" />
			</bt-form-item>
		</q-list>
		<div class="row justify-end">
			<q-btn
				dense
				flat
				class="confirm-btn q-px-md"
				style="height: 24px; margin-top: 20px"
				:label="t('save')"
				@click="setIps"
			/>
		</div>
	</bt-scroll-area>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAuthorityStore } from 'src/stores/Authority';
import PageTitleComponent from 'components/PageTitleComponent.vue';
import BtSelect from 'components/base/BtSelect.vue';
import BtFormItem from 'components/base/BtFormItem.vue';
import { useI18n } from 'vue-i18n';

export interface AuthorityType {
	label: string;
	value: string;
	limit: number; //	1 - All IP; 2 - Private IP
	enable: boolean;
}

const { t } = useI18n();

const authorityStore = useAuthorityStore();

const appointIP = ref<string | undefined | null>('');
const privateIP = ref<string | undefined | null>('');

const authorityLevel: AuthorityType[] = [
	{
		label: t('worldwide'),
		value: '1',
		limit: 1,
		enable: true
	},
	{
		label: t('public'),
		value: '2',
		limit: 1,
		enable: true
	},
	{
		label: t('protected'),
		value: '3',
		limit: 1,
		enable: true
	},
	{
		label: t('private'),
		value: '4',
		limit: 2,
		enable: true
	}
];

const authorityType = ref<string>(authorityLevel[0].value);

const factorOptions = ref([
	{
		label: t('factor.one_factor'),
		value: 'one_factor',
		enable: true
	},
	{
		label: t('factor.two_factor'),
		value: 'two_factor',
		enable: true
	}
]);

const factorModel = ref(factorOptions.value[0].value);

const setIps = () => {
	if (
		(authorityType.value === '3' || authorityType.value === '4') &&
		!isRegIP.value
	) {
		return false;
	}

	let ips: string[] | undefined | null = null;
	if (authorityType.value === '3') {
		ips = appointIP.value ? appointIP.value?.split(',') : null;
	} else if (authorityType.value === '4') {
		ips = privateIP.value ? privateIP.value?.split(',') : null;
	}

	let parmas = {
		access_level: Number(authorityType.value),
		allow_cidrs: ips,
		auth_policy: factorModel.value
	};
	authorityStore.setIps(parmas);
};

const isRegIP = computed(() => {
	if (
		appointIP.value &&
		appointIP.value.substring(appointIP.value.length - 1, 1) === ','
	) {
		return false;
	}
	const reg = new RegExp(
		/^((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\/(?:[1-9]|[12][0-9]|3[012])+)[,]?)+$/
	);
	console.log();

	if (appointIP.value && reg.test(appointIP.value)) {
		return true;
	}
	return false;
});

onMounted(async () => {
	await authorityStore.getIps();
	authorityType.value = authorityStore.access_level
		? `${authorityStore.access_level.access_level}`
		: '1';
	factorModel.value = `${
		authorityStore.access_level?.auth_policy
			? authorityStore.access_level.auth_policy
			: factorOptions.value[0]
	}`;
	if (authorityType.value === '3') {
		appointIP.value = authorityStore.access_level?.allow_cidrs?.join(',');
	} else if (authorityType.value === '4') {
		privateIP.value = authorityStore.access_level?.allow_cidrs?.join(',');
	}
});
</script>
