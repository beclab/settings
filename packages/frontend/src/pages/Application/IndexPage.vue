<template>
	<page-title-component :show-back="false" :title="t('application')" />
	<bt-scroll-area class="nav-height-scroll-area-conf">
		<q-list
			:class="deviceStore.isMobile ? 'mobile-items-list' : 'q-list-class'"
			v-if="applicationStore.applications.length > 0"
		>
			<template
				v-for="(application, index) in applicationStore.applications"
				:key="index"
			>
				<application-item
					:icon="application.icon"
					:title="application.name"
					:status="application.state"
					:hide-status="false"
					:width-separator="
						index !== applicationStore.applications.length - 1
					"
					:margin-top="index !== 0"
					@click="onItemClick(application)"
				/>
			</template>
		</q-list>
	</bt-scroll-area>
</template>

<script setup lang="ts">
import { useApplicationStore } from 'src/stores/Application';
import { useRouter } from 'vue-router';
import { TerminusApp } from '@bytetrade/core';
import PageTitleComponent from 'components/PageTitleComponent.vue';
import ApplicationItem from 'components/application/ApplicationItem.vue';
import { useI18n } from 'vue-i18n';
import { useDeviceStore } from '../../stores/device';
const { t } = useI18n();
const applicationStore = useApplicationStore();
const deviceStore = useDeviceStore();
const router = useRouter();

const onItemClick = (application: TerminusApp) => {
	router.push(`application/info/${application.name}`);
};
</script>
