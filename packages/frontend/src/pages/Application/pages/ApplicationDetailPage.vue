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
	</bt-scroll-area>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { firstToUpper } from 'src/constant';
import { useApplicationStore } from 'src/stores/Application';
import { useSecretStore } from 'src/stores/Secret';
import { Entrance } from 'src/global';
import PageTitleComponent from 'components/PageTitleComponent.vue';
import ApplicationDetailItem from '../../../components/application/ApplicationDetailItem.vue';
import BtFormItem from '../../../components/base/BtFormItem.vue';
import ApplicationItem from 'components/application/ApplicationItem.vue';

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

const gotoEntrance = (entrance: Entrance) => {
	router.push(
		'/application/entrance/' + application.value?.name + '/' + entrance.name
	);
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

onMounted(async () => {
	await checkSecretPermission();
});
</script>

<style scoped lang="scss">
.details-title {
	margin-top: 20px;
	margin-bottom: 11px;
	color: $ink-1;
}
</style>
