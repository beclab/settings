<template>
	<div class="user-item-root column justify-start" v-if="account">
		<q-item
			clickable
			class="user-item"
			:style="marginTop ? 'margin-top: 8px' : ''"
		>
			<q-item-section>
				<div class="row items-center">
					<q-avatar :size="`40px`">
						<TerminusAvatar
							:info="{
								terminusName: account?.terminusName,
								avatar: account?.avatar
							}"
							:size="40"
						/>
					</q-avatar>
					<div
						class="column justify-between"
						style="margin-left: 8px; height: 40px"
					>
						<div class="row justify-start">
							<div class="text-subtitle2 person-name">
								{{ account.name }}
							</div>
							<setting-connect-status
								v-if="!account.wizard_complete"
								:label="$t('not_activated')"
								icon="sym_r_devices_off"
							/>
						</div>

						<div class="text-body3 person-role">
							{{
								account.roles
									? getRoleName(account.roles.join('/'))
									: ''
							}}
						</div>
					</div>
				</div>
			</q-item-section>
			<q-item-section side>
				<q-icon name="sym_r_chevron_right" size="20px" />
			</q-item-section>
		</q-item>
		<q-separator class="separator-background" v-if="widthSeparator" />
	</div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import { AccountInfo } from '../../global';
import { getRoleName } from '../../utils/constants';
import SettingConnectStatus from 'components/base/SettingConnectStatus.vue';

const props = defineProps({
	account: {
		type: Object as PropType<AccountInfo>,
		require: true
	},
	widthSeparator: {
		type: Boolean,
		default: true
	},
	marginTop: {
		type: Boolean,
		default: true
	}
});

console.log('roles ===>', props.account);
</script>

<style scoped lang="scss">
.user-item-root {
	width: 100%;
	height: auto;

	.user-item {
		height: 56px;
		min-height: 56px;
		padding: 0;

		.person-name {
			color: $text1;
		}

		.person-role {
			color: $grey-5;
		}
	}
}
</style>
