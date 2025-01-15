<template>
	<page-title-component :show-back="false" :title="t('application')" />
	<bt-scroll-area class="nav-height-scroll-area-conf">
		<bt-list v-if="applicationStore.applications.length > 0">
			<template
				v-for="(application, index) in applicationStore.applications"
				:key="index"
			>
				<application-item
					:icon="application.icon"
					:title="application.title"
					:status="application.state"
					:hide-status="!deviceStore.isMobile"
					:width-separator="
						index !== applicationStore.applications.length - 1
					"
					:margin-top="index !== 0"
					@click="onItemClick(application)"
				>
					<template v-slot>
						<application-status
							v-if="!deviceStore.isMobile"
							:status="application.state"
						/>
					</template>
				</application-item>
			</template>
		</bt-list>
	</bt-scroll-area>
</template>

<script setup lang="ts">
import { useApplicationStore } from '../../stores/application';
import { useRouter } from 'vue-router';
import { TerminusApp } from '@bytetrade/core';
import PageTitleComponent from 'components/PageTitleComponent.vue';
import ApplicationItem from '../../components/application/ApplicationItem.vue';
import { useI18n } from 'vue-i18n';
import BtList from '../../components/base/BtList.vue';
import ApplicationStatus from '../../components/application/ApplicationStatus.vue';
import { useDeviceStore } from '../../stores/device';
const { t } = useI18n();
const applicationStore = useApplicationStore();
const router = useRouter();
const deviceStore = useDeviceStore();

const onItemClick = (application: TerminusApp) => {
	router.push(`application/info/${application.name}`);
};
</script>
