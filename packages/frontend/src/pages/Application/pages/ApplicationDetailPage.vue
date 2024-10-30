<template>
	<page-title-component :show-back="true" :title="application?.title" />

	<bt-scroll-area class="nav-height-scroll-area-conf">
		<bt-list>
			<application-detail-item :app="application" />
		</bt-list>

		<bt-list v-if="secretPermission && !deviceStore.isMobile">
			<bt-form-item
				:title="t('secrets')"
				@click="gotoSecret"
				:margin-top="false"
				:chevron-right="true"
				:width-separator="false"
			/>
		</bt-list>

		<div v-if="application?.entrances && application.entrances.length">
			<module-title
				class="q-mb-sm"
				:class="{
					'q-mt-lg': !deviceStore.isMobile,
					'q-mt-xl': deviceStore.isMobile
				}"
				>{{ t('entrances') }}</module-title
			>

			<bt-list>
				<template
					v-for="(entrance, index) in application.entrances"
					:key="index"
				>
					<application-item
						:icon="
							entrance.icon
								? entrance.icon
								: application?.icon
								? application?.icon
								: ''
						"
						:title="entrance.title"
						:status="application.state"
						:width-separator="
							index !== application.entrances.length - 1
						"
						:margin-top="index !== 0"
						@click="gotoEntrance(entrance)"
						:hide-status="
							application.state == APP_STATUS.running &&
							entrance.state
						"
					>
						<template
							v-slot:status
							v-if="
								application.state == APP_STATUS.running &&
								entrance.state &&
								!deviceStore.isMobile
							"
						>
							<application-status
								:running="
									entrance.state == Entrance_STATUS.running
								"
								:realStatus="entrance.state"
								class="q-ml-md"
							/>
						</template>
						<template
							v-slot:mobile-status
							v-if="
								application.state == APP_STATUS.running &&
								entrance.state &&
								deviceStore.isMobile
							"
						>
							<application-mobile-status
								:running="
									entrance.state == Entrance_STATUS.running
								"
							/>
						</template>
					</application-item>
				</template>
			</bt-list>
		</div>

		<div v-if="appRegisterProviders && appRegisterProviders.length">
			<module-title
				class="q-mb-sm"
				:class="{
					'q-mt-lg': !deviceStore.isMobile,
					'q-mt-xl': deviceStore.isMobile
				}"
				>{{ t('providers') }}
			</module-title>
			<bt-list>
				<template
					v-for="(provider, index) in appRegisterProviders"
					:key="index"
				>
					<bt-form-item
						:title="`${provider.dataType}/${provider.group}/${provider.version}`"
						:margin-top="false"
						:width-separator="
							index + 1 < appRegisterProviders.length
						"
						:chevron-right="true"
						@click="gotoPermission(provider)"
					/>
				</template>
			</bt-list>
		</div>

		<div v-if="appPermissions && appPermissions.permissions.length">
			<module-title
				class="q-mb-sm"
				:class="{
					'q-mt-lg': !deviceStore.isMobile,
					'q-mt-xl': deviceStore.isMobile
				}"
				>{{ t('permissions') }}
			</module-title>
			<bt-list>
				<template
					v-for="(permission, index) in appPermissions.permissions"
					:key="index"
				>
					<bt-form-item
						:title="`${permission.dataType}/${permission.group}/${permission.version}`"
						@click="gotoPermission(permission)"
						:margin-top="false"
						:width-separator="
							index + 1 < appPermissions.permissions.length
						"
						:chevron-right="true"
					/>
				</template>
			</bt-list>
		</div>
	</bt-scroll-area>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useApplicationStore } from '../../../stores/Application';
import { useSecretStore } from '../../../stores/Secret';
import {
	AppPermission,
	Permission,
	PermissionProviderRegister
} from '../../../global';
import PageTitleComponent from '../../../components/PageTitleComponent.vue';
import ApplicationDetailItem from '../../../components/application/ApplicationDetailItem.vue';
import BtFormItem from '../../../components/base/BtFormItem.vue';
import ApplicationItem from '../../../components/application/ApplicationItem.vue';
import ApplicationStatus from '../../../components/application/ApplicationStatus.vue';
import ApplicationMobileStatus from '../../../components/application/ApplicationMobileStatus.vue';

import { TerminusEntrance } from '@bytetrade/core';
import BtList from '../../../components/base/BtList.vue';
import { APP_STATUS, Entrance_STATUS } from '../../../utils/constants';
import ModuleTitle from '../../../components/ModuleTitle.vue';

import { useI18n } from 'vue-i18n';
import { useDeviceStore } from '../../../stores/device';
const { t } = useI18n();

const applicationStore = useApplicationStore();
const secretStore = useSecretStore();
const deviceStore = useDeviceStore();

const Route = useRoute();

const router = useRouter();

const application = ref(
	applicationStore.getApplicationById(Route.params.name as string)
);

const secretPermission = ref(false);

const gotoSecret = () => {
	router.push('/application/secret/' + application.value?.name);
};

const gotoEntrance = (entrance: TerminusEntrance) => {
	router.push(
		'/application/entrance/' + application.value?.name + '/' + entrance.name
	);
};

const gotoPermission = (
	permission: Permission | PermissionProviderRegister
) => {
	gotoPermissionDetail({
		dataType: permission.dataType,
		group: permission.group,
		version: permission.version,
		title: `${permission.dataType}/${permission.group}/${permission.version}`
	});
};

const gotoPermissionDetail = (query: any) => {
	router.push({
		path: '/application/permission/detail',
		query
	});
};

async function checkSecretPermission() {
	const res = await secretStore.checkSecretPermission(
		application.value?.name
	);
	if (res && res.permission === true) {
		secretPermission.value = true;
	} else {
		secretPermission.value = false;
	}
}

const appPermissions = ref<AppPermission | undefined>(undefined);

const getPermissions = async () => {
	try {
		appPermissions.value = await applicationStore.getPermissions(
			application.value?.name
		);
	} catch (error) {
		console.log(error);
	}
};

const appRegisterProviders = ref<PermissionProviderRegister[] | undefined>([]);
const getProviders = async () => {
	try {
		appRegisterProviders.value =
			await applicationStore.getProviderRegistryList(
				application.value?.name
			);
	} catch (error) {
		console.log(error);
	}
};

onMounted(async () => {
	checkSecretPermission();
	getPermissions();
	getProviders();
});
</script>
