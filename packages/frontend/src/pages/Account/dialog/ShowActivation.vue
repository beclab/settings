<template>
	<q-dialog ref="dialogRef" @hide="onDialogHide">
		<q-card class="q-dialog-plugin column items-center justify-center">
			<div class="activate-title">{{ t('activate_account') }}</div>
			<div class="avator">
				<q-avatar :size="`40px`">
					<TerminusAvatar
						:info="{
							terminusName: '',
							avatar: ''
						}"
						:size="40"
					/>
				</q-avatar>
			</div>
			<div class="activate-name q-mb-md">
				{{ data.username }}
			</div>
			<div class="activate-info text-body3">
				<div class="row q-mb-sm">
					<div class="col-5 text-grey-5">Original password</div>
					<div
						class="col-7 text-grey-10 row items-center justify-start"
					>
						<span>{{ data.userPassword }}</span>
						<q-icon
							class="q-ml-sm cursor-pointer"
							name="sym_r_content_copy"
							size="20px"
							color="light-blue-6"
							@click="copyPassword"
						/>
					</div>
				</div>
				<div class="row">
					<div class="col-5 text-grey-5">Wizard URL</div>
					<div class="col-7 text-grey-10">{{ data.wizard }}</div>
				</div>
			</div>

			<div class="activate-btn" @click="toWizardUrl">
				Copy password and go to activate
			</div>
		</q-card>
	</q-dialog>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
import { useDialogPluginComponent, copyToClipboard } from 'quasar';
import { notifySuccess } from '../../../utils/btNotify';
import { useI18n } from 'vue-i18n';

const props = defineProps({
	data: {
		type: Object as any,
		required: true
	}
});

const { t } = useI18n();

const { dialogRef, onDialogHide } = useDialogPluginComponent();

const copyPassword = () => {
	copyToClipboard(props.data.userPassword).then(() => {
		notifySuccess(t('copy_successfully'));
	});
};

const toWizardUrl = () => {
	copyPassword();
	window.open('https://' + props.data.wizard);
};
</script>
<style lang="scss"></style>

<style lang="scss" scoped>
.q-dialog-plugin {
	width: 500px;
	border-radius: 20px;
	padding: 32px 20px;

	.activate-title {
		color: #232323;
		text-align: center;
		font-family: Roboto;
		font-size: 20px;
		font-style: normal;
		font-weight: 600;
		line-height: 28px;
		text-align: center;
		margin-bottom: 48px;
	}

	.avator {
		width: 44px;
		height: 44px;
		border-radius: 22px;
		overflow: hidden;
	}
	.activate-name {
		color: #232323;
		text-align: center;
		font-family: Roboto;
		font-size: 14px;
		font-style: normal;
		font-weight: 500;
		line-height: 20px;
		margin-bottom: 48px;
	}

	.activate-info {
		width: 100%;
		border: 1px solid #ebebeb;
		border-radius: 8px;
		padding: 20px;
		margin-bottom: 48px;
	}

	.activate-btn {
		width: 100%;
		height: 32px;
		background: linear-gradient(135deg, #ff8a48 0%, #ff4667 100%);
		border-radius: 8px;
		color: #ffffff;
		font-family: Roboto;
		font-size: 12px;
		font-style: normal;
		font-weight: 500;
		line-height: 32px;
		text-align: center;
	}
}
</style>
