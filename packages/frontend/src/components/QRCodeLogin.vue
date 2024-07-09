<template>
	<div class="content-bg column items-center justify-center">
		<slot name="mode" />
		<div class="row justify-center items-center text-body-1 q-mt-md">
			<div>{{ t('scan_qr_code_with') }}</div>
			<q-img
				src="../assets/termipass_logo.svg"
				width="20px"
				height="20px"
			></q-img>
			<div>{{ t('login.termiPass_to_log_in') }}</div>
		</div>
		<div class="cloud-qr-code q-pa-md q-mt-lg">
			<terminus-qr-code
				:url="loginUrl"
				:size="216"
				:status="loginQrCodeStatus"
				text-style="text-subtitle3"
				@on-refresh="resetDID"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import TerminusQrCode from '../components/TerminusQrCode.vue';
import { useAdminStore } from '../stores/Admin';
import { useAccountStore } from '../stores/Account';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import axios from 'axios';
import { Encoder, MessageTopic } from '@bytetrade/core';
import { uid } from 'quasar';
import { QR_STATUS } from '../utils/constants';

export interface TokenData {
	userid: string;
	token: string;
	expired: number;
}

const { t } = useI18n();
const adminStore = useAdminStore();
const accountStore = useAccountStore();
const secret = ref<string>('');
const loginUrl = ref<string>('');
let user_info_interval: NodeJS.Timeout | null = null;

onMounted(async () => {
	resetDID();
	user_info_interval = setInterval(async () => {
		await updateInfo();
	}, 3 * 1000);
});

onBeforeUnmount(() => {
	if (user_info_interval) {
		clearInterval(user_info_interval);
	}
});

watch(
	() => adminStore.terminus.did,
	async () => {
		resetDID();
	}
);

const loginQrCodeStatus = ref(QR_STATUS.NORMAL);

async function updateInfo() {
	try {
		const result = await axios.post(
			accountStore.space.url + '/v2/user/activeLogin',
			{
				secret: secret.value
			}
		);

		const token: TokenData = result.data;
		if (!token.userid) {
			return;
		}

		if (user_info_interval) {
			clearInterval(user_info_interval);
		}
		// const saveData: SpaceSaveData = {
		// 	email: '',
		// 	token: token.token,
		// 	userid: token.userid,
		// 	expired: token.expired
		// };

		await accountStore.createAccount(adminStore.terminus.terminusName, {
			refresh_token: token.token,
			access_token: token.token,
			expires_in: 60 * 30 * 1000,
			expires_at: token.expired,
			userid: adminStore.terminus.did
		});

		await accountStore.listSecret();
		loginQrCodeStatus.value = QR_STATUS.SUCCESSFUL;
		setTimeout(() => {
			emit('success');
		}, 1000);
	} catch (e) {
		console.log(e);
	}
}

function resetDID() {
	//did.value = d;
	secret.value = uid().replace(/-/g, '');
	const time = new Date().getTime();
	loginUrl.value =
		'space://' +
		Encoder.stringToBase64Url(
			JSON.stringify({
				topic: MessageTopic.SIGN,
				event: 'login_cloud',
				message: {
					id: '1',
					data: {
						did: adminStore.terminus.did,
						secret: secret.value,
						time
					},
					sign: {
						callback_url: accountStore.space.url + '/v2/user/login',
						sign_body: {
							did: adminStore.terminus.did,
							secret: secret.value,
							time
						}
					}
				}
			})
		);
	loginQrCodeStatus.value = QR_STATUS.NORMAL;
	setTimeout(() => {
		loginQrCodeStatus.value = QR_STATUS.EXPIRED;
	}, 120 * 1000);
}
const emit = defineEmits(['success']);
</script>

<style scoped lang="scss">
.content-bg {
	width: 400px;
	height: 424px;
	border: 1px solid $separator;
	margin-top: 64px;
	border-radius: 12px;
}

.cloud-qr-code {
	border: 1px solid $separator;
	border-radius: 10px;
	width: 240px;
	height: 240px;
	background-color: white;
}
</style>
