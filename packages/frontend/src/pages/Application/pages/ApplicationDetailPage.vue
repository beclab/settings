<template>
	<page-title-component
		:show-back="true"
		:title="firstToUpper(application ? application.name : '')"
	/>

	<bt-scroll-area class="nav-height-scroll-area-conf">
		<q-list
			:class="deviceStore.isMobile ? 'mobile-items-list' : 'q-list-class'"
		>
			<application-detail-item :app="application" />
		</q-list>

		<q-list
			:class="deviceStore.isMobile ? 'mobile-items-list' : 'q-list-class'"
			v-if="secretPermission && !deviceStore.isMobile"
		>
			<bt-form-item
				:title="t('secrets')"
				@click="gotoSecret"
				:margin-top="false"
				:chevron-right="true"
				:width-separator="false"
			/>
		</q-list>

		<div v-if="application?.entrances && application.entrances.length">
			<div class="text-subtitle1 details-title">{{ t('entrances') }}</div>

			<q-list
				:class="
					deviceStore.isMobile ? 'mobile-items-list' : 'q-list-class'
				"
			>
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
						:title="firstToUpper(entrance.title)"
						:status="application.state"
						:width-separator="
							index !== application.entrances.length - 1
						"
						:margin-top="index !== 0"
						@click="gotoEntrance(entrance)"
					/>
				</template>
			</q-list>
		</div>

		<div v-if="appPermissions && appPermissions.permissions.length">
			<div class="text-subtitle1 details-title">Permission</div>
			<q-list class="q-list-class">
				<template
					v-for="(permission, index) in appPermissions.permissions"
					:key="index"
				>
					<bt-form-item
						:title="permission.dataType"
						@click="gotoPermission(permission)"
						:margin-top="false"
						:width-separator="false"
						:chevron-right="true"
					/>
				</template>
			</q-list>
		</div>
	</bt-scroll-area>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { firstToUpper } from '../../../constant';
import { useApplicationStore } from '../../../stores/Application';
import { useSecretStore } from '../../../stores/Secret';
import { AppPermission, Permission } from '../../../global';
import PageTitleComponent from '../../../components/PageTitleComponent.vue';
import ApplicationDetailItem from '../../../components/application/ApplicationDetailItem.vue';
import BtFormItem from '../../../components/base/BtFormItem.vue';
import ApplicationItem from '../../../components/application/ApplicationItem.vue';
import { TerminusEntrance } from '@bytetrade/core';

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

const gotoPermission = (permission: Permission) => {
	router.push({
		path: '/application/permission/detail',
		query: {
			// :dataType/:group/:version
			dataType: permission.dataType,
			group: permission.group,
			version: permission.version
		}
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

onMounted(async () => {
	checkSecretPermission();
	getPermissions();
});
</script>

<style scoped lang="scss">
.details-title {
	margin-top: 20px;
	margin-bottom: 11px;
	color: $ink-1;
}
</style>
