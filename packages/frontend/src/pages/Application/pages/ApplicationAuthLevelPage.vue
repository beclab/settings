<template>
	<div class="application-info-root">
		<page-title-component
			:show-back="true"
			:title="firstToUpper(application ? application.name : '')"
		/>

		<bt-scroll-area
			v-if="authorizationLevel && application"
			class="nav-height-scroll-area-conf"
		>
			<q-item style="height: 44px">
				<q-item-section class="text-body3">
					{{ t('auth_level') }}
				</q-item-section>
				<q-item-section side>
					<q-select
						v-model="authorizationLevel"
						dense
						borderless
						:options="authorizationLevelArray"
						style="width: 160px"
					/>
				</q-item-section>
			</q-item>

			<q-separator class="q-list-sep-line" />
			<q-btn
				:disable="!isChange"
				class="apply"
				color="primary"
				:label="t('apply')"
				@click="onSubmit"
			/>
		</bt-scroll-area>
	</div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent, computed } from 'vue';
import { useRoute } from 'vue-router';
import { firstToUpper } from 'src/constant';
import { useApplicationStore } from 'src/stores/Application';
import PageTitleComponent from 'components/PageTitleComponent.vue';
import { useI18n } from 'vue-i18n';
import { notifyWarning } from '../../../utils/btNotify';

export default defineComponent({
	name: 'ApplicationAuthLevelPage',
	components: {
		PageTitleComponent
	},
	setup() {
		const { t } = useI18n();
		const applicationStore = useApplicationStore();
		const Route = useRoute();

		const application = ref(
			applicationStore.getApplicationById(Route.params.name as string)
		);

		const application_name = ref(Route.params.name as string);
		const entrance_name = Route.params.entrance as string;

		const authorizationLevel = ref<string | null>();
		const oldAuthorizationLevel = ref<string | null>();
		const authorizationLevelArray = ref(['Public', 'Private']);

		async function updateAuthLevel() {
			const res =
				applicationStore.entrances[application_name.value][
					entrance_name
				];

			if (res.authLevel == 'private') {
				authorizationLevel.value = 'Private';
			} else if (res.authLevel == 'public') {
				authorizationLevel.value = 'Public';
			} else {
				authorizationLevel.value = '';
			}
			oldAuthorizationLevel.value = authorizationLevel.value;
		}

		const isChange = computed(() => {
			if (oldAuthorizationLevel.value != authorizationLevel.value) {
				return true;
			}

			return false;
		});

		onMounted(async () => {
			console.log(Route.params.name);
			if (!(application_name.value in applicationStore.entrances)) {
				await applicationStore.getEntrances(application_name.value);
			}

			application.value = applicationStore.getApplicationById(
				Route.params.name as string
			);
			await updateAuthLevel();
		});

		async function onSubmit() {
			let value = '';
			if (authorizationLevel.value == 'Private') {
				value = 'private';
			} else if (authorizationLevel.value == 'Public') {
				value = 'public';
			} else {
				notifyWarning(
					t('auth_level_is_error_error', {
						error: authorizationLevel.value
					})
				);
				return;
			}

			await applicationStore.setupAuthLevel(
				application.value?.name,
				entrance_name,
				{
					authorization_level: value
				}
			);

			await updateAuthLevel();
		}

		return {
			application,
			firstToUpper,
			useApplicationStore,
			onSubmit,
			authorizationLevelArray,
			authorizationLevel,
			isChange
		};
	}
});
</script>

<style scoped lang="scss">
.application-info-root {
	height: 100%;
}

.apply {
	margin-top: 20px;
}
</style>
