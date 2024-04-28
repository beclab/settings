<template>
	<page-title-component :show-back="true" :title="t('login_history')" />
	<bt-scroll-area class="nav-height-scroll-area-conf">
		<div v-if="userInfo?.wizard_complete === true" class="q-list-class">
			<q-table
				:rows="rows"
				flat
				:columns="columns"
				row-key="name"
				:loading="loading2"
				@request="onRequest"
				v-model:pagination="pagination"
				style="margin-top: 12px"
			>
				<template v-slot:body-cell-status="props">
					<q-td :props="props">
						<q-badge
							rounded
							:color="props.row.status ? 'primary' : 'red'"
							class="q-mr-sm"
						/>
						<span>{{
							props.row.status ? t('successful') : t('failed')
						}}</span>
					</q-td>
				</template>
			</q-table>
		</div>
	</bt-scroll-area>
</template>

<script lang="ts" setup>
import PageTitleComponent from '../../components/PageTitleComponent.vue';
import { AccountInfo, UsersParam } from '../../global';
import { getLocalTime } from '../../utils';
import { onMounted, ref } from 'vue';
import { useUserStore } from '../../stores/User';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const columns: any = [
	{
		name: 'createTime',
		align: 'center',
		label: t('time'),
		field: 'createTime',
		format: (time: string) =>
			getLocalTime(time).format('YYYY-MM-DD HH:mm:ss')
	},
	{
		name: 'status',
		align: 'center',
		label: t('status'),
		field: (row: any) => row.name
	},
	{
		name: 'source_ip',
		align: 'center',
		label: t('source_ip_address'),
		field: 'source_ip'
	},
	{
		name: 'reason',
		align: 'center',
		label: t('reason'),
		field: 'reason'
	}
];

const pagination = ref({
	sortBy: 'desc',
	page: 1,
	rowsPerPage: 10,
	rowsNumber: 0
});

const loading2 = ref(false);
const rows = ref([]);

const onRequest = (props: {
	pagination: {
		sortBy: string;
		page: number;
		rowsPerPage: number;
	};
	filter?: any;
	getCellValue: (col: any, row: any) => any;
}) => {
	const { page, rowsPerPage } = props.pagination;
	const rowsPerPageFormat = rowsPerPage ? rowsPerPage : undefined;
	const params = {
		page: page,
		limit: rowsPerPageFormat,
		user: userInfo.value?.name
	};
	pagination.value.page = page;
	pagination.value.rowsPerPage = rowsPerPage;
	fetchHistory(params);
};

const fetchLoginRecords = () => {
	const params = {
		page: pagination.value.page,
		limit: pagination.value.rowsPerPage,
		user: userInfo.value?.name
	};
	fetchHistory(params);
};

const accountStore = useUserStore();
const Route = useRoute();

const userInfo = ref<AccountInfo | undefined>(
	accountStore.getUserByName(Route.params.name as string)
);

onMounted(async () => {
	userInfo.value = await accountStore.get_account_info(
		Route.params.name as string
	);
	fetchLoginRecords();
});

const fetchHistory = (params: UsersParam) => {
	loading2.value = true;
	accountStore
		.getLoginrecords(params)
		.then((res: any) => {
			console.log(res);
			rows.value = res.items.map((item: any) => ({
				createTime: item.metadata.creationTimestamp,
				status: item.spec.success,
				source_ip: item.spec.sourceIP,
				reason: item.spec.reason
			}));
			pagination.value.rowsNumber = res.totalItems;
		})
		.finally(() => {
			loading2.value = false;
		});
};
</script>

<style scoped lang="scss"></style>
