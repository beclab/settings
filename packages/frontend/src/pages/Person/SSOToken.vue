<template>
	<page-title-component
		:show-back="true"
		:title="t('list_of_sso_authorization_tokens')"
	/>
	<bt-scroll-area class="nav-height-scroll-area-conf">
		<div class="q-pa-md column q-list-class">
			<q-table
				tableHeaderStyle="height: 32px;"
				table-header-class="text-body3 text-ink-2"
				flat
				:bordered="false"
				:rows="sso"
				:columns="columns"
				row-key="id"
				v-model:pagination="pagination"
				hide-pagination
				hide-selected-banner
				hide-bottom
			>
				<template v-slot:body-cell-actions="props">
					<q-td :props="props" class="text-ink-2">
						<q-icon
							v-if="
								props.row.termiPass &&
								!allCookies.includes(props.row.termiPass.sso)
							"
							name="sym_r_delete"
							size="20px"
							class="q-mr-sm"
							@click.stop="revokeToken(props.row)"
						/>
					</q-td>
				</template>
			</q-table>

			<div class="row justify-center q-mt-md">
				<q-pagination
					v-model="pagination.page"
					:max="pagesNumber"
					input
					icon-first="keyboard_double_arrow_left"
					icon-last="keyboard_double_arrow_right"
					color="gary05"
				/>
			</div>
		</div>
	</bt-scroll-area>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useAdminStore, SSOResult } from '../../stores/Admin';
import PageTitleComponent from '../../components/PageTitleComponent.vue';
import { date, useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import ReminderDialogComponent from '../../components/ReminderDialogComponent.vue';

const { t } = useI18n();

const adminStore = useAdminStore();
const $q = useQuasar();
const sso = ref<SSOResult[]>([]);
const allCookies = ref(document.cookie);

onMounted(async () => {
	// allCookies.value = document.cookie;
	sso.value = await adminStore.get_sso();
});

const revokeToken = async (token: SSOResult) => {
	$q.dialog({
		component: ReminderDialogComponent,
		componentProps: {
			title: t('revoke_token'),
			message: t('revoke_token_message')
		}
	}).onOk(async () => {
		// deleteUserSureAction();
		try {
			await adminStore.revoke_token(token);
			sso.value = await adminStore.get_sso();
		} catch (error) {
			console.log(error);
		}
	});
};

const columns = [
	{
		name: 'expireTime',
		align: 'left',
		label: t('expire_time'),
		field: 'sso',
		format: (val: any) => {
			return date.formatDate(val.expireTime * 1000, 'YYYY-MM-DD HH:mm');
		},
		sortable: false
	},

	{
		name: 'authLevel',
		align: 'left',
		label: t('auth_level'),
		field: 'sso',
		format: (val: any) => {
			return val.authLevel;
		},
		sortable: false
	},
	{
		name: 'firstFactorTimestamp',
		align: 'left',
		label: t('first_factor_time'),
		field: 'sso',
		format: (val: any) => {
			return date.formatDate(
				val.firstFactorTimestamp * 1000,
				'YYYY-MM-DD HH:mm'
			);
		},
		sortable: false
	},
	{
		name: 'secondFactorTimestamp',
		align: 'left',
		label: t('second_factor_time'),
		field: 'sso',
		format: (val: any) => {
			if (val.secondFactorTimestamp == 0) {
				return '--';
			}
			return date.formatDate(
				val.secondFactorTimestamp * 1000,
				'YYYY-MM-DD HH:mm'
			);
		},
		sortable: false
	},
	{
		name: 'actions',
		label: 'Actions',
		field: 'termiPass',
		align: 'right'
	}
];

const pagesNumber = computed(() =>
	Math.ceil(sso.value.length / pagination.value.rowsPerPage)
);

const pagination = ref({
	sortBy: 'desc',
	descending: false,
	page: 1,
	rowsPerPage: 10
});
</script>
