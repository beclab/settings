import {
	IntegrationService as IntegrationServiceInterface,
	IntegrationWebSupportAuth
} from '../abstractions/integration/integrationService';
import { AWSS3AuthService } from './awss3';
import { DropboxAuthService } from './dropbox';
import { GoogleAuthService } from './googleDrive';
import { SpaceAuthService } from './space';
import { TencentAuthService } from './tencent';
import { AccountType } from '@bytetrade/core';
class IntegrationService implements IntegrationServiceInterface {
	supportAuthList = [
		{
			type: AccountType.Dropbox,
			detail: {
				name: 'Dropbox',
				icon: 'dropbox.svg'
			}
		},
		{
			type: AccountType.Space,
			detail: {
				name: 'Space',
				icon: 'space.svg'
			}
		},
		{
			type: AccountType.Google,
			detail: {
				name: 'Google Drive',
				icon: 'google.svg'
			}
		},
		{
			type: AccountType.AWSS3,
			detail: {
				name: 'AWS S3',
				icon: 'aws.svg'
			}
		},
		{
			type: AccountType.Tencent,
			detail: {
				name: 'Tencent COS',
				icon: 'tencent.svg'
			}
		}
	];

	getAccountByType(request_type: AccountType) {
		return this.supportAuthList.find((e) => e.type == request_type);
	}

	getInstanceByType(request_type: AccountType) {
		if (request_type == AccountType.Dropbox) {
			return new DropboxAuthService();
		}
		if (request_type == AccountType.Google) {
			return new GoogleAuthService();
		}
		if (request_type == AccountType.Space) {
			return new SpaceAuthService();
		}
		if (request_type == AccountType.AWSS3) {
			return new AWSS3AuthService();
		}
		if (request_type == AccountType.Tencent) {
			return new TencentAuthService();
		}
		return undefined;
	}

	async webSupport(request_type: AccountType) {
		const result: IntegrationWebSupportAuth = {
			status: false,
			message: ''
		};
		try {
			const authAccountInstance = this.getInstanceByType(request_type);
			if (!authAccountInstance) {
				throw new Error('Request type not support');
			}
			return await authAccountInstance.webSupport();
		} catch (e) {
			result.message = e.message ? e.message : 'Auth failed';
			return result;
		}
	}
}

export default new IntegrationService();
