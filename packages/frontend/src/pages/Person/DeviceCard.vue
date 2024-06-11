<template>
	<q-expansion-item
		dense
		style="padding: 0; border-radius: 10px"
		class="overflow-hidden"
		expandSeparator
		headerClass="header_extension text-white"
	>
		<template v-slot:header>
			<q-item-section style="width: 100%">
				<div class="row items-center" style="width: 100%">
					<div
						class="device-item-title row justify-between items-center"
						style="width: 100%"
					>
						<div class="row justify-start" style="width: 100%">
							<div
								class="bg-background-3 row items-center justify-center device-title-image"
							>
								<q-img
									class="icon"
									src="person/headscale.png"
								/>
								<div
									class="status_base"
									:style="`background:${timeStatus(
										new Date(device?.lastSeen || 0)
									)}`"
								></div>
							</div>
							<div
								class="column q-ml-sm"
								style="width: calc(100% - 50px)"
							>
								<div class="row items-center">
									<div
										class="text-subtitle1 text-ink-1"
										@click.stop="titleAction"
									>
										{{ device?.givenName }}
									</div>
									<q-icon
										@click.stop="titleAction"
										class="q-ml-sm text-ink-2"
										name="sym_r_edit_square"
										size="20px"
									/>
								</div>
								<div class="tags-bg row q-gutter-xs">
									<div
										class="bg-background-3 text-overline row items-center justiy-center tags-add"
										@click.stop="addTag"
									>
										<q-icon name="sym_r_add" class="icon" />
										<div>{{ t('add_tag') }}</div>
									</div>
									<div
										v-for="(i, index) in tags"
										@click.stop="deleteTag(index)"
										:key="index"
										class="bg-background-3 text-overline row items-center justiy-center tags-item"
									>
										<div>
											{{ i }}
										</div>
										<q-icon
											name="sym_r_close"
											class="icon"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</q-item-section>

			<q-item-section side>
				<q-icon
					name="sym_r_delete"
					size="20px"
					@click.stop="deleteDevice"
				/>
			</q-item-section>
		</template>
		<q-card class="device-item-content">
			<q-separator class="bg-separator" />
			<q-list style="padding: 0">
				<q-item style="padding: 0">
					<q-item-section class="text-body2 title">
						{{ t('device_last_seen') }}
					</q-item-section>
					<q-item-section class="text-body2 detail">
						{{
							getLocalTime(
								new Date(device.lastSeen).getTime()
							).format('YYYY-MM-DD HH:mm:ss')
						}}
					</q-item-section>
				</q-item>
				<q-item style="padding: 0">
					<q-item-section
						class="text-body2 title"
						:top="device.ipAddresses.length > 1"
					>
						{{ t('ip_addresses') }}
					</q-item-section>
					<q-item-section class="text-body2 detail column">
						<div
							v-for="address in device.ipAddresses"
							:key="address"
							class="row"
							style="margin-bottom: 8px"
						>
							{{ address }}
						</div>
					</q-item-section>
				</q-item>
				<q-item style="padding: 0">
					<q-item-section class="text-body2 title">
						{{ t('device_name') }}
					</q-item-section>
					<q-item-section class="text-body2 column detail">
						{{ device.name }}
					</q-item-section>
				</q-item>
				<q-item style="padding: 0 0 16px 0">
					<q-item-section
						class="text-body2 title"
						:top="routeList.length > 1"
					>
						{{ t('device_routes') }}
					</q-item-section>
					<q-item-section class="text-body2 column detail">
						<div
							v-for="(route, index) in routeList"
							:key="'ru' + route.id"
							class="row items-center"
							:class="
								index + 1 < routeList.length ? 'q-mb-xs' : ''
							"
						>
							<div>{{ route.prefix }}</div>
							<div
								class="row items-center justify-center text-caption"
								@click="modifyDeviceRoutesAction(route.id)"
								:class="
									route.enabled
										? 'route-bg-enable'
										: 'route-bg-pendding'
								"
							>
								<div
									class="node q-mr-sm"
									:class="
										route.enabled
											? 'node-enable'
											: 'node-pendding'
									"
								></div>
								{{ route.enabled ? t('enable') : t('pending') }}
							</div>
						</div>
					</q-item-section>
				</q-item>
			</q-list>
		</q-card>
	</q-expansion-item>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import { useHeadScaleStore } from '../../stores/headscale';
import { Route } from '../../headscale/classes';
import { getLocalTime } from '../../utils';
import { HeadScaleDevice } from '@bytetrade/core';
import { useQuasar } from 'quasar';
import EditHeadscaleInfoDialog from '../../components/person/EditHeadscaleInfoDialog.vue';
import DeleteHeaderscaleDeviceDialog from '../../components/person/DeleteHeaderscaleDeviceDialog.vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
	name: 'DeviceCard',
	props: {
		device: {
			type: HeadScaleDevice,
			required: true
		}
	},
	components: {},
	setup(props) {
		const headScaleStore = useHeadScaleStore();
		const timer = ref();
		const editName = ref(false);
		const renameValue = ref('');
		const routeList = ref<Route[]>([]);

		const $q = useQuasar();
		const { t } = useI18n();

		async function getDeviceRoutesAction() {
			routeList.value = (
				await headScaleStore.getDeviceRoutes(props.device.id)
			).slice(0, 1);
		}

		async function modifyDeviceRoutesAction(routeID: number) {
			await headScaleStore.modifyDeviceRoutes(routeList.value, routeID);

			await getDeviceRoutesAction();
		}

		function timeStatus(date: Date) {
			let currentTime = new Date();
			let timeDifference = Math.round(
				(currentTime.getTime() - date.getTime()) / 1000
			);
			if (timeDifference < 3600) {
				return '#29CC5F';
			} else if (timeDifference < 86400) {
				return '#FEBE01';
			} else {
				return '#ADADAD';
			}
		}

		// returns time last seen in human readable format
		function timeSince(date: Date) {
			let currentTime = new Date();

			let timeDifference = Math.round(
				(currentTime.getTime() - date.getTime()) / 1000
			);
			let timeUnit = '';

			if (timeDifference < 60) {
				timeUnit = t('times_unit.seconds');
			} else if (timeDifference < 3600) {
				timeDifference = Math.floor(timeDifference / 60);
				if (timeDifference == 1) {
					timeUnit = t('times_unit.minute');
				} else {
					timeUnit = t('times_unit.minutes');
				}
			} else if (timeDifference < 86400) {
				timeDifference = Math.floor(timeDifference / (60 * 60));
				if (timeDifference == 1) {
					timeUnit = t('times_unit.hour');
				} else {
					timeUnit = t('times_unit.hours');
				}
			} else {
				timeDifference = Math.floor(timeDifference / (60 * 60 * 24));
				if (timeDifference == 1) {
					timeUnit = t('times_unit.day');
				} else {
					timeUnit = t('times_unit.days');
				}
			}
			return t('last_seen_time_unit_ago', {
				time: timeDifference,
				unit: timeUnit
			});
		}

		const tags = ref(props.device.forcedTags);

		async function updateTagValue() {
			await headScaleStore.updateTags(props.device.id, tags.value);
		}

		async function deleteTag(index: number) {
			const newTags = tags.value;
			newTags.splice(index, 1);
			await headScaleStore.updateTags(props.device.id, newTags);
		}

		async function renameDevice() {
			await headScaleStore.renameDevice(
				props.device.id,
				renameValue.value
			);
		}

		async function removeDevice() {
			await headScaleStore.removeDevice(props.device.id);
		}

		onMounted(async () => {
			await getDeviceRoutesAction();
		});

		onUnmounted(() => {
			clearInterval(timer.value);
		});

		const addTag = () => {
			$q.dialog({
				component: EditHeadscaleInfoDialog,
				componentProps: {
					oldValue: '',
					title: t('add_tag'),
					editTitle: t('tag')
				}
			}).onOk(async (tag: string) => {
				if (tag.length > 0) {
					if (tags.value.includes(tag)) {
						return;
					}

					const newTags = tags.value;
					newTags.push(tag);
					await headScaleStore.updateTags(props.device.id, newTags);
				}
			});
		};

		const deleteDevice = () => {
			if (!props.device) {
				return;
			}
			$q.dialog({
				component: DeleteHeaderscaleDeviceDialog,
				componentProps: {
					deviceName: props.device.givenName
				}
			}).onOk(async () => {
				headScaleStore.getDevices();
			});
		};

		const titleAction = () => {
			if (!props.device) {
				return;
			}
			$q.dialog({
				component: EditHeadscaleInfoDialog,
				componentProps: {
					oldValue: props.device.givenName,
					title: t('edit'),
					editTitle: t('host_name')
				}
			}).onOk(async (name: string) => {
				if (name == props.device!.givenName) {
					return;
				}
				headScaleStore.renameDevice(props.device!.id, name);
			});
		};

		return {
			tags,
			updateTagValue,
			headScaleStore,
			timeStatus,
			timeSince,
			routeList,
			getLocalTime,
			confirm,
			modifyDeviceRoutesAction,
			editName,
			renameDevice,
			renameValue,
			removeDevice,
			deleteTag,
			addTag,
			titleAction,
			deleteDevice,
			t
		};
	}
});
</script>

<style lang="scss" scoped>
.device-item-title {
	height: auto;

	.common-background {
		background-color: $background-3;
	}

	.device-title-image {
		@extend .common-background;
		height: 32px;
		width: 32px;
		border-radius: 16px;
		position: relative;

		.icon {
			width: 26px;
			height: 8px;
		}

		.status_base {
			position: absolute;
			right: 1px;
			bottom: 1px;
			width: 12px;
			height: 12px;
			border-radius: 6px;
		}
	}

	.tags-bg {
		width: 100%;
		// background-color: red;
		height: auto;

		.tags-add {
			@extend .common-background;
			border-radius: 4px;
			padding: 0px 8px;
			height: 20px;

			.icon {
				width: 12px;
				height: 12px;
				margin-right: 8px;
			}

			color: $ink-2;
		}

		.tags-item {
			@extend .common-background;
			padding: 0px 8px;
			border-radius: 4px;
			height: 20px;

			color: $ink-1;

			.icon {
				width: 12px;
				height: 12px;
				margin-left: 8px;
				color: $ink-2;
			}

			/* 120% */
		}
	}
}

.device-item-content {
	padding: 0 20px;

	.title {
		color: $ink-2;
	}

	.detail {
		color: $ink-1;
	}

	.route-base {
		border-radius: 4px;
		height: 20px;
		margin-left: 12px;
		padding: 0 12px;

		.node {
			width: 8px;
			height: 8px;
			border-radius: 4px;
		}

		text-align: justify;
	}

	.route-bg-pendding {
		@extend .route-base;
		background: rgba($color: $warning, $alpha: 0.1);
		color: $warning;
	}

	.route-bg-enable {
		@extend .route-base;
		background: $green-1;
		color: $green;
	}

	.node-pendding {
		background: $warning;
	}

	.node-enable {
		background: $green;
	}
}
</style>
