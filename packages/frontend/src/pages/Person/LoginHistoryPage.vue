<template>
	<page-title-component :show-back="true" :title="t('login_history')" />
	<bt-scroll-area class="nav-height-scroll-area-conf">
		<AdaptiveLayout>
			<template v-slot:pc>
				<div
					v-if="userInfo?.wizard_complete === true"
					class="q-list-class"
				>
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
									:color="
										props.row.status ? 'primary' : 'red'
									"
									class="q-mr-sm"
								/>
								<span>{{
									props.row.status
										? t('successful')
										: t('failed')
								}}</span>
							</q-td>
						</template>
					</q-table>
				</div>
			</template>
			<template v-slot:mobile>
				<q-infinite-scroll @load="onLoad" :offset="250">
					<bt-grid
						class="mobile-items-list"
						:repeat-count="2"
						v-for="(token, index) in rows"
						:key="index"
					>
						<template v-slot:title>
							<div
								class="text-subtitle1 row justify-between items-center clickable-view q-mb-md"
							>
								<div>{{ token.source_ip }}</div>
								<div class="row items-center justify-end">
									<div
										class="login-token-base-status"
										:class="
											token.status ? 'bg-info' : 'bg-red'
										"
									></div>
									<div class="q-ml-md text-body-3 text-ink-1">
										{{
											token.status
												? t('successful')
												: t('failed')
										}}
									</div>
								</div>
							</div>
						</template>
						<template v-slot:grid>
							<bt-grid-item
								:label="t('time')"
								:value="
									getLocalTime(token.time).format(
										'YYYY-MM-DD HH:mm'
									)
								"
							/>
							<bt-grid-item
								:label="t('reason')"
								:value="token.reason"
							/>
						</template>
					</bt-grid>
					<template v-slot:loading>
						<div class="row justify-center q-my-md">
							<q-spinner-dots color="primary" size="40px" />
						</div>
					</template>
				</q-infinite-scroll>
			</template>
		</AdaptiveLayout>
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
import AdaptiveLayout from '../../components/AdaptiveLayout.vue';
import BtGridItem from '../../components/base/BtGridItem.vue';
import BtGrid from '../../components/base/BtGrid.vue';
import { useDeviceStore } from '../../stores/device';

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
const rows = ref<any[]>([]);

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

const fetchLoginRecords = async () => {
	const params = {
		page: pagination.value.page,
		limit: pagination.value.rowsPerPage,
		user: userInfo.value?.name
	};
	await fetchHistory(params);
};

const accountStore = useUserStore();
const Route = useRoute();
const deviceStore = useDeviceStore();

const userInfo = ref<AccountInfo | undefined>(
	accountStore.getUserByName(Route.params.name as string)
);

onMounted(async () => {
	userInfo.value = await accountStore.get_account_info(
		Route.params.name as string
	);
	if (!deviceStore.isMobile) {
		fetchLoginRecords();
	}
});

const fetchHistory = async (params: UsersParam) => {
	loading2.value = true;
	const res = await accountStore.getLoginrecords(params);
	loading2.value = false;
	if (deviceStore.isMobile) {
		rows.value = rows.value.concat(
			res.items.map((item: any) => ({
				createTime: item.metadata.creationTimestamp,
				status: item.spec.success,
				source_ip: item.spec.sourceIP,
				reason: item.spec.reason
			}))
		);
	} else {
		rows.value = res.items.map((item: any) => ({
			createTime: item.metadata.creationTimestamp,
			status: item.spec.success,
			source_ip: item.spec.sourceIP,
			reason: item.spec.reason
		}));
	}

	pagination.value.rowsNumber = res.totalItems;
};

const onLoad = async (index: number, done: (stop?: boolean) => void) => {
	pagination.value.page = index;
	try {
		await fetchLoginRecords();
		done(pagination.value.rowsNumber == rows.value.length);
	} catch (error) {
		done(pagination.value.rowsNumber == rows.value.length);
	}
};
</script>

<style scoped lang="scss">
.login-token-base-status {
	width: 8px;
	height: 8px;
	border-radius: 4px;
}
</style>
