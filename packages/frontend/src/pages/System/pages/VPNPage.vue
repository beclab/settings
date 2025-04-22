<template>
	<page-title-component :show-back="true" title="VPN">
		<template v-slot:end v-if="deviceStore.isMobile">
			<div
				class="add-btn row justify-center items-center q-px-md"
				@click="onSubmit"
				v-if="commitEnable"
			>
				<q-icon size="20px" name="sym_r_check" color="ink-1" />
			</div>
		</template>
	</page-title-component>
	<bt-scroll-area class="nav-height-scroll-area-conf">
		<q-list
			:class="deviceStore.isMobile ? 'mobile-items-list' : 'q-list-class'"
		>
			<bt-form-item :width-separator="false" class="q-py-md">
				<template v-slot:title>
					<div class="column justify-start">
						<div class="row">
							<div class="text-h6 text-ink-1">
								{{ t('Enable subnet routes') }}
							</div>
						</div>
						<div class="text-body3 text-ink-3 q-mt-xs">
							{{
								t(
									'Enable this setting to allow remote SSH connections to devices on the same LAN as your Olares.'
								)
							}}
						</div>
					</div>
				</template>
				<bt-switch
					truthy-track-color="blue-default"
					:model-value="aclStore.allow_subroutes"
					@update:model-value="setSubroutesToggle"
				/>
			</bt-form-item>
		</q-list>

		<q-list
			:class="deviceStore.isMobile ? 'mobile-items-list' : 'q-list-class'"
		>
			<bt-form-item :width-separator="false" class="q-py-md">
				<template v-slot:title>
					<div class="column justify-start">
						<div class="row">
							<div class="text-h6 text-ink-1">
								{{ t('allow_ssh_via_vpn') }}
							</div>
						</div>
						<div class="text-body3 text-ink-3 q-mt-xs">
							{{
								t(
									'Enable this setting to allow remote SSH connections to the cluster when you’re connected through a VPN.'
								)
							}}
						</div>
					</div>
				</template>

				<bt-switch
					truthy-track-color="blue-default"
					:model-value="aclStore.allow_ssh"
					:disable="aclStore.state === ActionType.APPLYING"
					@update:model-value="setAclToggle"
				/>
			</bt-form-item>
		</q-list>

		<AdaptiveLayout>
			<template v-slot:pc>
				<q-list class="q-py-md q-list-class">
					<div
						class="row items-center justify-between item-margin-left item-margin-right"
					>
						<div class="ext-h6 text-ink-1">
							{{ t('ACL destination port') }}
						</div>
						<div
							class="add-btn row justify-center items-center"
							@click="addACL"
						>
							<q-icon
								size="20px"
								name="sym_r_add"
								color="ink-1"
							/>
						</div>
					</div>
					<div
						v-if="
							aclStore.displayPort &&
							aclStore.displayPort.length > 0
						"
						class="column item-margin-left item-margin-right q-mt-md"
					>
						<q-table
							tableHeaderStyle="height: 32px;"
							table-header-class="text-body3 text-ink-3"
							flat
							:bordered="false"
							:rows="aclStore.displayPort"
							:columns="columns"
							row-key="id"
							hide-pagination
							hide-selected-banner
							hide-bottom
							:rowsPerPageOptions="[0]"
						>
							<template v-slot:body-cell-actions="props">
								<q-td :props="props" class="text-ink-2">
									<q-icon
										v-if="canRemove(props.row)"
										name="sym_r_delete"
										size="16px"
										color="ink-2"
										@click.stop="removeACL(props.row)"
									/>
								</q-td>
							</template>
							<template v-slot:body-cell-appOwner="props">
								<q-td :props="props">
									<div class="row items-center">
										<setting-avatar
											:size="24"
											style="margin-right: 4px"
										/>
										<div>
											{{ props.row.appOwner }}
										</div>
									</div>
								</q-td>
							</template>
							<template v-slot:body-cell-appName="props">
								<q-td :props="props">
									<div class="row items-center">
										<q-img
											no-spinner
											width="24px"
											height="24px"
											:src="getAppIcon(props.row)"
											style="
												border-radius: 6px;
												margin-right: 4px;
											"
										/>
										<div>
											{{ props.row.appName }}
										</div>
									</div>
								</q-td>
							</template>
						</q-table>
					</div>
					<empty-component
						class="q-pb-xl"
						v-else
						:info="t('no_acl_dst_port_added')"
						:empty-image-top="40"
					/>
				</q-list>
			</template>
			<template v-slot:mobile>
				<module-title class="q-mt-xl">
					<div class="row items-center justify-between">
						<div>
							{{ t('ACL destination port') }}
						</div>
						<div
							class="add-btn row justify-center items-center"
							@click="addACL"
						>
							<q-icon
								size="20px"
								name="sym_r_add"
								color="ink-1"
							/>
						</div>
					</div>
				</module-title>
				<div v-if="aclStore.displayPort.length > 0">
					<bt-grid
						class="mobile-items-list"
						:repeat-count="2"
						v-for="(port, index) in aclStore.displayPort"
						:key="index"
						:paddingY="12"
					>
						<template v-slot:title>
							<div
								class="text-subtitle3-m row justify-between items-center clickable-view q-mb-md"
							>
								<div>
									{{ port.port }}
								</div>
								<q-icon
									v-if="canRemove(port)"
									name="sym_r_delete"
									color="ink-2"
									size="20px"
									@click.stop="removeACL(port)"
								/>
							</div>
						</template>
						<template v-slot:grid>
							<bt-grid-item
								:label="t('Application')"
								mobileTitleClasses="text-body3-m"
								:value="port.appName"
							/>
							<bt-grid-item
								:label="t('User')"
								mobileTitleClasses="text-body3-m"
								:value="port.appOwner"
							/>
						</template>
					</bt-grid>
				</div>
				<empty-component
					class="q-pb-xl"
					v-else
					:info="t('no_acl_dst_port_added')"
					:empty-image-top="40"
				/>
			</template>
		</AdaptiveLayout>

		<div class="row justify-end" v-if="!deviceStore.isMobile">
			<q-btn
				dense
				:disable="!commitEnable"
				flat
				class="confirm-btn q-px-md"
				style="margin-top: 20px"
				:label="t('apply')"
				@click="onSubmit"
			/>
		</div>
	</bt-scroll-area>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import PageTitleComponent from '../../../components/PageTitleComponent.vue';
import { useI18n } from 'vue-i18n';
import { useDeviceStore } from '../../../stores/device';
import BtFormItem from '../../../components/base/BtFormItem.vue';
import AdaptiveLayout from '../../../components/AdaptiveLayout.vue';
import BtGridItem from '../../../components/base/BtGridItem.vue';
import BtGrid from '../../../components/base/BtGrid.vue';
import ModuleTitle from '../../../components/ModuleTitle.vue';
import {
	useAclStore,
	ActionType,
	PortAclInfo,
	PortStatus
} from '../../../stores/acl';
import EmptyComponent from '../../../components/EmptyComponent.vue';
import EditAppAclPortDialog from './dialog/EditAppAclPortDialog.vue';
import { useQuasar } from 'quasar';
import { useAdminStore } from '../../../stores/admin';
import SettingAvatar from '../../../components/base/SettingAvatar.vue';
import { useApplicationStore } from '../../../stores/application';
import { getRequireImage } from '../../../utils/helper';
import ReminderDialogComponent from '../../../components/ReminderDialogComponent.vue';

const { t } = useI18n();

const deviceStore = useDeviceStore();

const aclStore = useAclStore();
const adminStore = useAdminStore();
const $q = useQuasar();
const applicationStore = useApplicationStore();

const setAclToggle = async () => {
	await aclStore.toggleAclStatus(!aclStore.allow_ssh);
	await aclStore.getAclStatus();
	await aclStore.getAllApplicationAcls();
};

const setSubroutesToggle = async () => {
	$q.loading.show();
	try {
		await aclStore.toggleSubroutesStatus(!aclStore.allow_subroutes);
	} catch (error) {
		console.log('error ===>', error);
	} finally {
		$q.loading.hide();
	}
};

onMounted(async () => {
	await aclStore.getSubroutesStatus();
	await aclStore.getAclStatus();
	await aclStore.getAllApplicationAcls();
});

const addACL = () => {
	$q.dialog({
		component: EditAppAclPortDialog
	}).onOk(async (port: string) => {
		const index = aclStore.allPortAppAclList.findIndex(
			(e) =>
				e.appName == 'settings' &&
				e.proto == '' &&
				e.port === `*:${port}`
		);

		const addItem = {
			appName: 'settings',
			port: `*:${port}`,
			appOwner: adminStore.terminus.terminusName.split('@')[0],
			proto: '',
			status: PortStatus.Add
		};

		if (index >= 0) {
			aclStore.allPortAppAclList.splice(index, 1, addItem);
		} else {
			aclStore.allPortAppAclList.push(addItem);
		}
	});
};

const onSubmit = () => {
	aclStore.appAclSubmit('settings');
};

const commitEnable = computed(() => {
	return (
		aclStore.allPortAppAclList.find((port) => {
			if (port.status != PortStatus.Normal) {
				const acl = aclStore.allAppAclList.find(
					(acl) =>
						port.appName == acl.appName &&
						port.proto == acl.proto &&
						acl.dst.find((dst) => port.port == dst)
				);

				if (!acl) {
					return port.status == PortStatus.Add;
				}
				return port.status == PortStatus.Remove;
			}
			return false;
		}) != undefined
	);
});

const removeACL = async (info: PortAclInfo) => {
	//
	$q.dialog({
		component: ReminderDialogComponent,
		componentProps: {
			title: t('delete_item', {
				item: info.port.startsWith('*:')
					? info.port.substring(2, info.port.length)
					: info.port
			}),
			message: t('are_you_sure_you_want_to_delete_item', {
				item: info.port.startsWith('*:')
					? info.port.substring(2, info.port.length)
					: info.port
			}),
			useCancel: true
		}
	}).onOk(async () => {
		info.status = PortStatus.Remove;
	});
};

const canRemove = (info: PortAclInfo) => {
	if (info.appName != 'settings') {
		return false;
	}
	if (info.port === '*:22') {
		return false;
	}
	return true;
};

const getAppIcon = (info: PortAclInfo) => {
	if (info.port === '*:22') {
		return getRequireImage('system/ssh.svg');
	}
	return applicationStore.getApplicationById(info.appName)?.icon;
};

const columns: any = [
	{
		name: 'port',
		align: 'left',
		label: t('port'),
		field: 'port',
		format: (val: any) => {
			return val.startsWith('*:') ? val.substring(2, val.length) : val;
		},
		sortable: false
	},
	{
		name: 'appName',
		align: 'left',
		label: t('Application'),
		field: 'appName',
		sortable: false
	},
	{
		name: 'appOwner',
		align: 'left',
		label: t('User'),
		field: 'appOwner',
		sortable: false
	},
	{
		name: 'actions',
		align: 'right',
		label: t('action'),
		sortable: false
	}
];
</script>

<style scoped lang="scss">
.directory-tips {
	margin-top: 12px;
	margin-bottom: 12px;
	color: $ink-2;
}

.add-btn {
	border-radius: 4px;
	// height: 24px;
	width: 24px;
	background-color: $background-1;
	cursor: pointer;
	text-decoration: none;

	.add-title {
		color: $ink-2;
	}
}
.add-btn:hover {
	background-color: $btn-bg-hover;
}
.directory-image {
	width: 24px;
	height: 24px;
}

.folder-content {
	width: 100%;

	padding-top: 12px;

	.path_content {
		width: calc(100% - 40px);
		word-wrap: word-break;
		word-break: break-all;

		.path {
			width: calc(100% - 40px);
			margin-top: 2px;
			margin-bottom: 10px;
			// background: green;
		}
	}
}

.popup-list {
	width: 120px;
	padding: 8px;
	border-radius: 8px;
	box-shadow: 0px 4px 10px 0px #00000033;
}
.empty-image {
	margin-top: 144px;
	width: 160px;
	height: 160px;
}

.mobile-add-btn {
	border-radius: 8px;
	border: 1px solid $separator;
	cursor: pointer;
	padding: 5px 8px;
	text-decoration: none;

	.add-title {
		color: $ink-2;
	}
}

.add-btn-padding-mobile {
	padding: 8px 10px;
}
</style>
