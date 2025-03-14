<template>
	<page-title-component :show-back="true" :title="t('domain_setup')" />

	<bt-scroll-area
		v-if="application && domainInfo"
		class="nav-height-scroll-area-conf"
	>
		<bt-list>
			<bt-form-item
				:title="t('endpoint')"
				:width-separator="true"
				:dataWidthP="70"
			>
				<div
					class="row items-center justify-end full-width"
					@click="setCopyInfo(entranceUrl)"
				>
					<div
						style="
							max-width: calc(100% - 40px);
							overflow: hidden;
							white-space: nowrap;
							text-overflow: ellipsis;
							margin-right: 10px;
						"
						class="text-body-3 text-ink-3"
					>
						{{ entranceUrl }}
					</div>
					<q-icon name="sym_r_content_copy" size="24px" />
				</div>
			</bt-form-item>

			<bt-form-item
				:title="t('default_route_id')"
				:margin-top="false"
				:data="entranceRef?.id"
			/>

			<bt-form-item :title="t('setup_custom_route_id')">
				<div class="row justify-between items-center">
					<bt-edit-view
						style="width: calc(100% - 32px)"
						:right="true"
						:is-read-only="true"
						v-model="third_level_domain"
					/>
					<bt-icon
						v-if="tryAddThirdLevelDomain"
						name="delete"
						@click="deleteDomain(false)"
					/>
					<bt-icon v-else name="add" @click="addDomain(false)" />
				</div>
			</bt-form-item>

			<bt-form-item
				:title="t('setup_custom_domain')"
				:width-separator="tryAddThirdPartyDomain"
			>
				<div class="row justify-between items-center">
					<bt-edit-view
						style="width: calc(100% - 32px)"
						:right="true"
						:is-read-only="true"
						v-model="third_party_domain"
					/>
					<bt-icon
						v-if="tryAddThirdPartyDomain"
						name="delete"
						@click="deleteDomain(true)"
					/>
					<bt-icon v-else name="add" @click="addDomain(true)" />
				</div>
			</bt-form-item>

			<bt-form-item
				v-if="
					show_third_domain_cname_setButton && tryAddThirdPartyDomain
				"
				:title="t('activation_third_party_domain')"
				:width-separator="false"
			>
				<q-btn
					dense
					class="active-btn q-px-md submit-btn-margin"
					:label="t('activation')"
					@click="setCName"
					color="primary"
				/>
			</bt-form-item>

			<bt-form-item
				v-if="
					!show_third_domain_cname_setButton && tryAddThirdPartyDomain
				"
				:title="t('status')"
				:width-separator="false"
			>
				<div class="row items-center">
					<div
						:class="
							domainInfo.value?.cname_status === 'active'
								? 'status-activated'
								: 'status-pending'
						"
					/>
					<div class="form-item-data">
						{{ third_domain_status }}
					</div>
				</div>
			</bt-form-item>
		</bt-list>
	</bt-scroll-area>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { useApplicationStore } from '../../../stores/application';
import { SetupDomain } from 'src/global';
import PageTitleComponent from 'components/PageTitleComponent.vue';
import BtFormItem from '../../../components/base/BtFormItem.vue';
import AddDomain from 'components/application/dialog/domain/AddDomain.vue';
import BtIcon from 'components/base/BtIcon.vue';
import BtEditView from '../../../components/base/BtEditView.vue';
import ActivationDomain from '../../../components/application/dialog/domain/ActivationDomain.vue';
import BtList from '../../../components/base/BtList.vue';
import { copyToClipboard } from 'quasar';

import { useI18n } from 'vue-i18n';
import { notifySuccess, notifyWarning } from '../../../utils/btNotify';
import { useAdminStore } from '../../../stores/admin';
// import { useDeviceStore } from '../../../stores/device';
const { t } = useI18n();

const applicationStore = useApplicationStore();
const Route = useRoute();
const $q = useQuasar();
const adminStore = useAdminStore();
// const deviceStore = useDeviceStore();

const application = ref(
	applicationStore.getApplicationById(Route.params.name as string)
);

const application_name = ref(Route.params.name as string);
const entrance_name = Route.params.entrance as string;

const tryAddThirdLevelDomain = ref<boolean>(false);
const tryAddThirdPartyDomain = ref<boolean>(false);

const domainInfo = ref<SetupDomain | undefined>();
const third_level_domain = ref<string>('');
const third_party_domain = ref<string>('');

function clearValue() {
	third_party_domain.value = '';
	third_level_domain.value = '';
	tryAddThirdLevelDomain.value = false;
	tryAddThirdPartyDomain.value = false;
}

const addDomain = (isParty: boolean) => {
	$q.dialog({
		component: AddDomain,
		componentProps: {
			isParty
		}
	}).onOk((data: string) => {
		if (isParty) {
			tryAddThirdPartyDomain.value = third_party_domain.value !== data;
			if (tryAddThirdPartyDomain.value) {
				third_party_domain.value = data;
				onSubmit();
			}
		} else {
			tryAddThirdLevelDomain.value = third_level_domain.value !== data;
			if (tryAddThirdLevelDomain.value) {
				third_level_domain.value = data;
				onSubmit();
			}
		}
	});
};

const deleteDomain = (isParty: boolean) => {
	if (isParty) {
		third_party_domain.value = '';
		tryAddThirdPartyDomain.value = false;
	} else {
		third_level_domain.value = '';
		tryAddThirdLevelDomain.value = false;
	}
	onSubmit();
};

async function updateDomain() {
	domainInfo.value = await applicationStore.getDomainSetup(
		application_name.value,
		entrance_name
	);

	clearValue();
	if (domainInfo.value?.third_party_domain) {
		third_party_domain.value = domainInfo.value!.third_party_domain;
		tryAddThirdPartyDomain.value = true;
	}

	if (domainInfo.value?.third_level_domain) {
		third_level_domain.value = domainInfo.value.third_level_domain;
		tryAddThirdLevelDomain.value = true;
	}
}

onMounted(async () => {
	application.value = applicationStore.getApplicationById(
		Route.params.name as string
	);
	await updateDomain();
});

const show_third_domain_cname_setButton = computed(() => {
	return domainInfo.value?.cname_target_status == 'unset';
});

const third_domain_status = computed(() => {
	if (!domainInfo.value?.cname_target) {
		return '';
	} else {
		if (domainInfo.value?.cname_target_status == 'unset') {
			return t('please_add_a_dns_record_record_cname_to_cname', {
				record: third_party_domain.value,
				cname: domainInfo.value?.cname_target
			});
		} else if (domainInfo.value?.cname_target_status == 'set') {
			if (domainInfo.value?.cname_status == 'unset') {
				return t('checking_cname_records_usually_takes_1_hour');
			} else if (domainInfo.value?.cname_status == 'pending') {
				return t('wait_for_cname_to_be_activated');
			} else if (domainInfo.value?.cname_status == 'active') {
				return t('activated');
			}
		}
		return (
			domainInfo.value?.cname_target_status +
			' / ' +
			domainInfo.value?.cname_status
		);
	}
});

async function setCName() {
	$q.dialog({
		component: ActivationDomain,
		componentProps: {
			thirdPartyDomain: third_party_domain.value,
			cnameTarget: domainInfo.value?.cname_target
		}
	}).onOk(async () => {
		try {
			await applicationStore.setupCName(
				application_name.value,
				entrance_name
			);
		} catch (e: any) {
			notifyWarning(e.message || t('errors.network_error'));
		}

		await updateDomain();
		await applicationStore.getEntrances(application_name.value);
	});
}

async function onSubmit() {
	let obj = domainInfo.value || {
		third_level_domain: '',
		third_party_domain: '',
		key: '',
		cert: ''
	};

	if (tryAddThirdLevelDomain.value) {
		if (!third_level_domain.value) {
			notifyWarning(t('errors.third_level_domain_is_empty'));
			return;
		}

		obj.third_level_domain = third_level_domain.value;
	} else {
		obj.third_level_domain = '';
	}

	if (tryAddThirdPartyDomain.value) {
		if (!third_party_domain.value) {
			notifyWarning(t('errors.third_party_domain_is_empty'));
			return;
		}

		obj.third_party_domain = third_party_domain.value;
	} else {
		obj.third_party_domain = '';
	}

	try {
		await applicationStore.setupDomain(
			application_name.value,
			entrance_name,
			obj
		);
	} catch (e: any) {
		notifyWarning(e.message || t('errors.network_error'));
	}

	await updateDomain();
	await applicationStore.getEntrances(application_name.value);
}

const entranceRef = ref(
	application.value?.entrances.find((e) => e.name == entrance_name)
);

const entranceUrl = computed(() => {
	if (!entranceRef.value) {
		return '';
	}
	return (
		entranceRef.value.id +
		'.' +
		adminStore.terminus.terminusName.replace('@', '.')
	);
});

const setCopyInfo = (info: string) => {
	copyToClipboard(info).then(() => {
		notifySuccess(t('copy_successfully'));
	});
};
</script>

<style scoped lang="scss">
.status-pending {
	width: 8px;
	height: 8px;
	background-color: $warning;
	border-radius: 50%;
	margin-right: 6px;
}

.status-activated {
	width: 8px;
	height: 8px;
	background-color: $green;
	border-radius: 50%;
	margin-right: 6px;
}

.active-btn {
	font-size: map-get($map: $body3, $key: size) !important;
	font-weight: map-get($map: $body3, $key: weight) !important;
	line-height: map-get($map: $body3, $key: line-height) !important;
	letter-spacing: map-get($map: $body3, $key: letter-spacing) !important;
	text-align: center !important;
	border-radius: 8px !important;
	text-transform: capitalize !important;
	background-color: $blue-default !important;
	color: #fff !important;
	height: 32px;
}
</style>
