import {
	BackupLocation,
	BackupFrequency,
	BackupSnapshotPhase
} from '@bytetrade/core';

import { i18n } from '../boot/i18n';

export enum MENU_TYPE {
	Wallpaper = 'Wallpaper',
	Knowledge = 'Knowledge',
	Notification = 'Notification',
	Application = 'Application',
	Integration = 'Integration',
	Account = 'Account',
	Services = 'Services',
	Authority = 'Authority',
	// Upgrade = 'Upgrade',
	Backup = 'Backup',
	Appearance = 'Appearance',
	System = 'System'
}

export function getRoleName(role: string) {
	if (role === 'workspaces-manager') {
		return i18n.global.t('role.member');
	} else if (role === 'platform-admin') {
		return i18n.global.t('role.admin');
	}
	return role;
}

export interface EntrancePolicy {
	one_time: boolean;
	policy: string;
	uri: string;
	valid_duration: number;
}

export const locationOptions = [
	{
		label: i18n.global.t('server_location.olares_space'),
		value: BackupLocation.TerminusCloud,
		enable: true
	},
	{
		label: i18n.global.t('server_location.aws_s3'),
		value: BackupLocation.S3,
		enable: false
	}
];

export const frequencyOptions = [
	{
		label: i18n.global.t('frequencys.every_day'),
		value: BackupFrequency.Daily,
		enable: true
	},
	{
		label: i18n.global.t('frequencys.every_week'),
		value: BackupFrequency.Weekly,
		enable: true
	}
];

export const weekOption = [
	{
		label: i18n.global.t('week.sunday'),
		value: 0,
		enable: true
	},
	{
		label: i18n.global.t('week.monday'),
		value: 1,
		enable: true
	},
	{
		label: i18n.global.t('week.tuesday'),
		value: 2,
		enable: true
	},
	{
		label: i18n.global.t('week.wednesday'),
		value: 3,
		enable: true
	},
	{
		label: i18n.global.t('week.thursday'),
		value: 4,
		enable: true
	},
	{
		label: i18n.global.t('week.friday'),
		value: 5,
		enable: true
	},
	{
		label: i18n.global.t('week.saturday'),
		value: 6,
		enable: true
	}
];

export enum FACTOR_MODEL {
	One = 'one_factor',
	Two = 'two_factor',
	Public = 'public',
	System = 'system'
}

export const factorModelOptions = () => {
	return [
		{
			label: i18n.global.t('factor.system'),
			value: FACTOR_MODEL.System,
			enable: true
		},
		{
			label: i18n.global.t('factor.one_factor'),
			value: FACTOR_MODEL.One,
			enable: true
		},
		{
			label: i18n.global.t('factor.two_factor'),
			value: FACTOR_MODEL.Two,
			enable: true
		},
		{
			label: i18n.global.t('factor.none'),
			value: FACTOR_MODEL.Public,
			enable: true
		}
	];
};

export enum AUTH_LEVEL {
	Private = 'private',
	Public = 'public',
	Internal = 'internal'
}

export const authLevelOptions = () => {
	return [
		{
			label: i18n.global.t('private'),
			value: AUTH_LEVEL.Private,
			enable: true
		},
		{
			label: i18n.global.t('public'),
			value: AUTH_LEVEL.Public,
			enable: true
		},
		{
			label: i18n.global.t('Internal'),
			value: AUTH_LEVEL.Internal,
			enable: true
		}
	];
};

export interface Secret {
	Key: string; //  key name
	Workspace: string; // secret workspace name
}

export interface ThirdPartyAccountInterface {
	name: string;
	icon: string;
	email: string;
}

export const ThirdPartyAccountList: ThirdPartyAccountInterface[] = [
	{
		name: 'Google',
		icon: 'Google',
		email: ''
	},
	{
		name: 'iCloud',
		icon: 'iCloud',
		email: ''
	},
	{
		name: 'Yahoo',
		icon: 'Yahoo',
		email: ''
	},
	{
		name: 'Aol',
		icon: 'Aol',
		email: ''
	}
];

export const BackupSnapshotPhaseColorRecord: Record<
	BackupSnapshotPhase,
	string
> = {
	[BackupSnapshotPhase.Canceled]: '#ADADAD',
	[BackupSnapshotPhase.Pending]: '#FEBE01',
	[BackupSnapshotPhase.Running]: '#29CC5F',
	[BackupSnapshotPhase.Failed]: '#FF4D4D',
	[BackupSnapshotPhase.Started]: '#3377FF',
	[BackupSnapshotPhase.Succeed]: '#3377FF'
};

export enum MODEL_STATUS {
	//server
	running = 'running',
	installed = 'installed',
	noInstalled = 'no_installed',
	installing = 'installing',

	//local
	pending = 'pending',
	loading = 'loading',
	stopping = 'stopping',
	uninstalling = 'uninstalling',
	installable = 'installable'
}

export interface DifyModelInfo {
	id: string;
	file_name: string;
	progress: number;
	status: MODEL_STATUS;
	folder_path: string;
	model: ModelInfo;
	type: string;
}

export interface ModelMetadata {
	author: string;
	cover: string;
	size: number;
	tags: string[];
}

export interface ModelRuntimeParams {
	frequency_penalty: number;
	max_tokens: number;
	presence_penalty: number;
	stop: any[];
	stream: boolean;
	temperature: number;
	top_p: number;
}

export interface ModelSettingParams {
	ctx_len: number;
	prompt_template: string;
}

export interface ModelInfo {
	object: string;
	format: string;
	source_url: string;
	id: string;
	name: string;
	created: number;
	description: string;
	settings: ModelSettingParams;
	parameters: ModelRuntimeParams;
	metadata: ModelMetadata;
	engine: string;
}

export enum QR_STATUS {
	NORMAL,
	EXPIRED,
	SUCCESSFUL
}

export function getSecondLevelDomain() {
	const domainParts = window.location.hostname.split('.');
	if (domainParts.length >= 3) {
		return domainParts.slice(-3).join('.');
	} else {
		return window.location.hostname;
	}
}

export enum ConfirmButtonStatus {
	normal = 1,
	error = 2,
	disable = 3
}

export enum APP_STATUS {
	installing = 'installing',
	downloading = 'downloading',
	pending = 'pending',
	running = 'running',
	resuming = 'resuming',
	suspend = 'suspend',
	uninstalling = 'uninstalling',
	upgrading = 'Upgrading',
	installed = 'installed',
	uninstalled = 'uninstalled',
	installable = 'installable',
	waiting = 'waiting',
	preflightFailed = 'preflightFailed',
	initializing = 'initializing'
}

export enum Entrance_STATUS {
	crash = 'crash',
	suspend = 'suspend',
	running = 'running'
}

export const getApplicationStatus = (status: APP_STATUS) => {
	let realStatus = '';
	switch (status) {
		case APP_STATUS.preflightFailed:
			realStatus = i18n.global.t('app_status.get');
			break;
		case APP_STATUS.uninstalled:
			realStatus = i18n.global.t('app_status.get');
			break;
		case APP_STATUS.installable:
			realStatus = i18n.global.t('app_status.install');
			break;
		case APP_STATUS.pending:
			realStatus = i18n.global.t('app_status.installing');
			break;
		case APP_STATUS.installing:
		case APP_STATUS.downloading:
			realStatus = i18n.global.t('app_status.installing');
			break;
		case APP_STATUS.installed:
			realStatus = i18n.global.t('app_status.installed');
			break;
		case APP_STATUS.suspend:
			realStatus = i18n.global.t('app_status.suspend');
			break;
		case APP_STATUS.waiting:
		case APP_STATUS.resuming:
			realStatus = i18n.global.t('app_status.resume');
			break;
		case APP_STATUS.running:
			realStatus = i18n.global.t('app_status.running');
			break;
		case APP_STATUS.uninstalling:
			realStatus = i18n.global.t('app_status.uninstalling');
			break;
		case APP_STATUS.upgrading:
			realStatus = i18n.global.t('app_status.updating');
			break;
		case APP_STATUS.initializing:
			realStatus = i18n.global.t('app_status.updating');
			break;
		default:
			break;
	}

	return realStatus;
};

export enum ReverseProxyMode {
	NoNeed = 1,
	CloudFlare = 2,
	OlaresTunnel = 3,
	SelfBuiltFrp = 4
}

export const reverseProxyOptions = () => {
	return [
		// {
		// 	label: 'No need (IP Direct)',
		// 	value: ReverseProxyMode.NoNeed,
		// 	enable: true
		// },
		{
			label: 'Cloudflare Tunnel',
			value: ReverseProxyMode.CloudFlare,
			enable: true
		},
		{
			label: 'Olares Tunnel',
			value: ReverseProxyMode.OlaresTunnel,
			enable: true
		},
		{
			label: 'Self-built FRP',
			value: ReverseProxyMode.SelfBuiltFrp,
			enable: true
		}
	];
};

export const frpAuthMethod = () => {
	return [
		{
			label: i18n.global.t('None'),
			value: '',
			enable: true
		},
		{
			label: i18n.global.t('Token'),
			value: 'token',
			enable: true
		}
	];
};

export interface OlaresTunnelInterface {
	frp_server: string;
	frp_port: number;
	frp_auth_method: string;
	frp_auth_token: string;
}

export const olaresTunnelDefaultValue = {
	frp_port: 0,
	frp_auth_method: 'jws',
	frp_auth_token: ''
};

export enum VRAMMode {
	Standalone = '1',
	Shared = '2'
}

export const VRAMModeOptions = () => {
	return [
		{
			label: i18n.global.t('Standalone Mode'),
			value: VRAMMode.Standalone,
			enable: true
		},
		{
			label: i18n.global.t('Shared Mode'),
			value: VRAMMode.Shared,
			enable: true
		}
	];
};

export interface HostItem {
	ip: string;
	host: string;
}
