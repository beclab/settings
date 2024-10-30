// import { DropboxAuth } from 'src/plugins/dropbox';
import { i18n } from 'src/boot/i18n';
import {
	AccountType,
	IntegrationAccountMiniData,
	// IntegrationAccount,
	OperateIntegrationAuth
} from '../abstractions/integration/integrationService';

export class DropboxAuthService extends OperateIntegrationAuth {
	type = AccountType.Dropbox;

	async webSupport() {
		return {
			status: false,
			message: i18n.global.t(
				'Due to some restrictions, we do not support binding this type of account in Settings. Please use TermiPass mobile app to complete the account authorization and binding.'
			)
		};
	}

	signIn() {}

	detailPath(account: IntegrationAccountMiniData) {
		return (
			'/integration/common/detail/' + account.type + '/' + account.name
		);
	}
	async permissions() {
		return {
			title: i18n.global.t(
				'Your Dropbox account grants us the following permissions:'
			),
			scopes: [
				{
					introduce: i18n.global.t('See your profile info'),
					icon: 'sym_r_account_circle'
				},
				{
					introduce: i18n.global.t(
						'See, edit, create, and delete all of your Dropbox files'
					),
					icon: 'sym_r_cloud'
				}
			]
		};
	}
}
