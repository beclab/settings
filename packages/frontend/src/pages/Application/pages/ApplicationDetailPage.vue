<template>
	<page-title-component :show-back="true" :title="application?.title" />

	<bt-scroll-area class="nav-height-scroll-area-conf">
		<bt-list>
			<application-operate-item :app="application" />
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
				>{{ t('entrances') }}
			</module-title>

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
						:status="entrance.state"
						:width-separator="
							index !== application.entrances.length - 1
						"
						:margin-top="index !== 0"
						@click="gotoEntrance(entrance)"
						:hide-status="false"
					/>
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
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useApplicationStore } from '../../../stores/application';
import { useSecretStore } from '../../../stores/secret';
import {
	AppPermission,
	Permission,
	PermissionProviderRegister
} from '../../../global';
import { useI18n } from 'vue-i18n';
import { TerminusEntrance } from '@bytetrade/core';
import { useDeviceStore } from '../../../stores/device';
import BtList from '../../../components/base/BtList.vue';
import ModuleTitle from '../../../components/ModuleTitle.vue';
import BtFormItem from '../../../components/base/BtFormItem.vue';
import PageTitleComponent from '../../../components/PageTitleComponent.vue';
import ApplicationItem from '../../../components/application/ApplicationItem.vue';
import ApplicationOperateItem from '../../../components/application/ApplicationOperateItem.vue';
import { bus } from '../../../utils/bus';

const applicationStore = useApplicationStore();
const secretStore = useSecretStore();
const deviceStore = useDeviceStore();
const { t } = useI18n();
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

const updateApplication = () => {
	application.value = applicationStore.getApplicationById(
		Route.params.name as string
	);
};

onMounted(async () => {
	bus.on('entrance_state_event', updateApplication);
	checkSecretPermission();
	getPermissions();
	getProviders();
});

onBeforeUnmount(() => {
	bus.off('entrance_state_event', updateApplication);
});
</script>
