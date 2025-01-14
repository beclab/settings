import en_US_add from '../add/en-US';
export default {
	home_menus: {
		wallpaper: 'Wallpaper',
		knowledge: 'Knowledge',
		notification: 'Notification',
		application: 'Application',
		integration: 'Integration',
		account: 'Account',
		services: 'Services',
		authority: 'Authority',
		upgrade: 'Upgrade',
		backup: 'Backup',
		appearance: 'Appearance',
		network: 'Network',
		system: 'System'
	},
	role: { admin: 'Admin', member: 'Member' },
	server_location: { olares_space: 'Olares Space', aws_s3: 'AWS S3' },
	frequencys: { every_day: 'Every Day', every_week: 'Every Week' },
	week: {
		sunday: 'Sunday',
		monday: 'Monday',
		tuesday: 'Tuesday',
		wednesday: 'Wednesday',
		thursday: 'Thursday',
		friday: 'Friday',
		saturday: 'Saturday'
	},
	factor: {
		system: 'System',
		one_factor: 'One factor',
		two_factor: 'Two factor',
		none: 'None'
	},
	success: 'Success',
	errors: {
		connect_wallet_failed: 'Failed to connet to Wallet',
		please_install_an_defi_wallet_like_metaMask:
			'Please install an DEFI wallet like MetaMask',
		cpu_limit_is_empty: 'CPU limit is empty',
		only_valid_numbers_can_be_entered: 'Please enter valid numbers',
		memory_limit_is_empty: 'Memory limit is empty',
		old_password_is_empty: 'Old password is empty',
		at_least_8_digits_long: 'Must be at least 8 digits long',
		at_least_one_uppercase_and_lowercase_letter:
			'Must use at least one uppercase letter and one lowercase letter ',
		repassword_do_not_match_password: "Passwords don't match",
		olares_id_not_exists_on_blockchain: 'Olares ID does not exist',
		username_is_empty: 'User name is empty',
		username_already_registered: 'User name already registered',
		email_is_empty: 'Email is empty',
		email_already_registered: 'Email already registered',
		ip_input_error: 'IP input error',
		something_wrong_please_try_again: 'System error. Please try again.',
		naming_is_not_compliant: 'Invalid naming',
		the_two_passwords_entered_are_inconsistent: 'Inconsistent passwords',
		you_are_not_logged_in_olares_space_yet_click_here_to:
			'You are not logged in to Olares Space yet. Click here to',
		please_type_something: 'Please type something',
		please_input_password: 'Password is required',
		passwords_are_inconsistent: 'Inconsistent passwords',
		please_enter_a_valid_number: 'Enter a valid number',
		network_error: 'Network error',
		third_level_domain_is_empty: 'Third-level domain is empty',
		third_party_domain_is_empty: 'Third-party domain is empty',
		something_went_wrong: 'Something went wrong',
		please_input_6_digit_email_verification_code:
			'Enter the 6-digit code sent to your email address to continue',
		please_input_url: 'Please enter URL',
		secret_is_required: 'Secret is empty',
		name_is_required: 'Name is empty',
		knowledge_base_name_already_taken:
			'Knowldege base name\\talready exists',
		paths_must_start_with_data_home: 'The path must start with /data/Home/',
		item_is_empty: '{item} missing',
		host_is_empty: 'The hostname cannot be empty',
		ip_is_empty: 'The IP address cannot be empty',
		host_is_error: 'Enter a valid hostname',
		host_is_error_duplicate: 'The hostname is already in use',
		ip_is_error: 'Enter a valid IP address'
	},
	pictures: 'Pictures',
	login_background: 'Login Background',
	desktop_background: 'Desktop Background',
	create_account: 'Create account',
	delete_item: 'Delete {item}',
	modify_limits: 'Modify limits',
	delete_user: 'Delete user',
	delete_user_message: "Are you sure to delete account '{account}'?",
	reset_password_successfully: 'Password reset successfully',
	new_password_is: "The new password is '{password}'",
	resource_usage: 'Resource usage',
	cpu_core: 'CPU core',
	memory_gi: 'Memory Gi',
	info: 'Info',
	olares_ID: 'Olares ID',
	email: 'Email',
	state: 'State',
	waiting_onBoard: 'Pending activation',
	last_login_time: 'Last login time',
	create_time: 'Creation time',
	roles: 'Role',
	reset_password: 'Reset password',
	wizard_url: 'Wizard URL',
	change_password: 'Change Password',
	cpu: 'CPU',
	core: 'core',
	memory: 'Memory',
	gb: 'GB',
	ok: 'OK',
	password_update_success: 'Password updated',
	old_password: 'Old password',
	new_password: 'New password',
	repeat_password: 'Confirm password',
	user_had_been_created:
		"The user account has been successfully created for '{username}'",
	user_had_been_created_message:
		"Wizard is '{wizard}'. Default password is '{password}'.",
	completed: 'Completed',
	failed: 'Failed',
	current_version: 'Current version',
	development_mode: 'Development mode',
	new_version: 'New version',
	upgrading: 'Upgrading',
	upgrade_now: 'Upgrade now',
	list_of_sso_authorization_tokens: 'List of SSO authorization tokens',
	expire_time: 'Expiration time',
	auth_level: 'Authentication level',
	first_factor_time: 'First factor time',
	second_factor_time: 'Second factor time',
	time: 'Time',
	status: 'Status',
	source_ip_address: 'Source IP address',
	reason: 'Reason',
	login_history: 'Login history',
	view_login_history: 'View login history',
	successful: 'Successful',
	you_need_at_least_3_devices_online_to_activate_headScale:
		'You need at least 3 devices online to activate HeadScale',
	olares_cloud: 'Olares Cloud',
	device: 'Device',
	security: 'Security',
	forcing_vpn_access_to_private_network:
		'Enforce VPN access to private entrance',
	view_the_active_session_of_the_vault: 'View active sessions of Vault',
	view_the_headScale_connection_status: 'View HeadScale connection status',
	view_the_list_of_sso_authorization_tokens: 'View SSO authorization tokens',
	check_network_authority_policy: 'Check network authority policy',
	headScale_connection_status: 'HeadScale connection status',
	times_unit: {
		seconds: 'seconds',
		minute: 'minute',
		minutes: 'minutes',
		hour: 'hour',
		hours: 'hours',
		day: 'day',
		days: 'days',
		second_short: 's'
	},
	last_seen_time_unit_ago: 'Last seen {time} {unit} ago',
	add_tag: 'Add tag',
	tag: 'Tag',
	edit: 'Edit',
	host_name: 'Host name',
	device_last_seen: 'Device last seen',
	ip_addresses: 'IP addresses',
	device_name: 'Device name',
	device_routes: 'Device routes',
	enable: 'Enable',
	pending: 'Pending',
	worldwide: 'World Wide',
	public: 'Public',
	protected: 'Protected',
	private: 'Private',
	network_authority_policy: 'Network Authority Policy',
	select_authority: 'Select authority',
	ip_input_popup_message: 'Use commas (,) to separate multiple IP addresses',
	select_factor_model: 'Select Factor Model',
	save: 'Save',
	notification: 'Notification',
	job: 'Job',
	sender: 'Sender',
	recipients: 'Recipients',
	template: 'Template',
	notify_policy: 'Notification policy',
	name: 'Name',
	notify_group: 'Notification group',
	action: 'Action',
	templates: 'Templates',
	view: 'View',
	language: 'Language',
	title: 'Title',
	body: 'Body',
	back: 'Back',
	app: 'App',
	variables: 'Variables',
	created_at: 'Created at',
	updated_at: 'Updated at',
	type: 'Type',
	description: 'Description',
	add: 'Add',
	id: 'ID',
	recipient_type: 'Recipient type',
	new: 'New',
	credentials: 'Credentials',
	cancel: 'Cancel',
	create: 'Create',
	data: 'Data',
	recipients_address: 'Recipient address',
	is_default: 'Is default',
	rules: 'Rules',
	delete: 'Delete',
	policies: 'Policies',
	need_recipients: 'Need recipients',
	template_id: 'Template ID',
	notify_policy_id: 'Notification policy ID',
	message: 'Message',
	jobs: 'Jobs',
	recipient: 'Recipient',
	sender_type: 'Sender type',
	message_num: 'Message num',
	sent_num: 'Sent num',
	success_num: 'Success num',
	application: 'Application',
	policy: 'Policy',
	knowledge: 'Knowledge',
	set_directories_for_file_search_monitoring:
		'Set directories to include in file searching',
	path: 'Path',
	update_time: 'Update time',
	knowledge_reminder_info:
		'These folders define where Alfred looks for files, apps, and metadata. Fewer paths give more accurate results. To add a folder, drag and drop it from Finder or Alfred.',
	add_directory: 'Add directory',
	please_input_path: 'Enter path',
	backup: 'Backup',
	add_backup: 'Add backup',
	no_backup_available: 'No backup available',
	snapshot_details: 'Snapshot details',
	size: 'Size',
	backup_type: 'Backup type',
	backup_detail_snpshot_popup_info:
		'·Contain up to 63 characters<br>·Contain lowercase letters (a-z), numbers (0-9), and hyphen(-) <br>·Start with letter <br>·End with a letter (a-z) or a number (0-9) ',
	login_teminus_space: 'Log in to Teminus Space',
	you_are_not_logged_in_olares_space_yet:
		'You are not logged in to Olares Space yet',
	backup_name: 'Backup name',
	please_input_the_backup_name: 'Enter the backup name',
	region: 'Region',
	please_enter_a_uri: 'Enter a URI',
	s3_url: 'S3 URL',
	s3_prefix: 'S3 prefix',
	s3_accessKey: 'S3 accessKey',
	s3_secretKey: 'S3 secretKey',
	snapshot_frequency: 'Snapshot frequency',
	run_backup_at: 'Run backup at',
	close: 'Close',
	backup_password: 'Backup password',
	please_enter_a_password: 'Enter a password',
	confirm_password: 'Confirm password',
	please_confirm_a_password: 'Confirm the password',
	submit: 'Submit',
	manage_backup: 'Manage backup',
	backup_size: 'Backup size',
	snapshots: 'Snapshots',
	no_snapshots: 'No snapshots',
	secrets: 'Secrets',
	app_secrets: 'App secrets',
	add_secret: 'Add secret',
	key: 'Key',
	last_updated: 'Last updated',
	the_item_index_is_empty: 'Empty item {index} ',
	auth_level_is_error_error: 'Auth level is error: {error}',
	domain_setup: 'Set up endpoint',
	setup_access_policies: 'Create access policies',
	second_factor_model: 'Authentication model',
	one_time: 'One time',
	valid_duration: 'Valid duration',
	please_add_a_dns_record_record_cname_to_cname:
		'Add a DNS record: {record} CName to {cname}',
	checking_cname_records_usually_takes_1_hour:
		'Checking CName records. It usually takes 1 hour.',
	wait_for_cname_to_be_activated: 'Wait for CName to be activated',
	activated: 'Activated',
	app_prefix: 'App prefix',
	third_level_domain: 'Third-level domain',
	third_party_domain: 'Third-party domain',
	activation_third_party_domain: 'Activate third-party domain',
	activation: 'Activation',
	entrances: 'Entrances',
	apply: 'Apply',
	had_bound: 'Bound',
	bound_nft_avatar: 'Bound NFT avatar',
	please_authorize_and_verify_on_the_larePass_mobile_phone_to_bind_your_nft_avatar:
		'Please authorize and verify on LarePass app to bind your NFT avatar',
	nft_images: 'NFT images',
	no_nft_available: 'No NFT available',
	select_the_image_to_complete_binding_nft_message:
		"Select the image and click 'Bind' to link the NFT avatar with your Olares ID. After binding, you can view and set your NFT avatar from the NFT avatar list in the Profile app.",
	bound: 'Bind',
	accounts: 'Accounts',
	olares_space: 'Olares Space',
	check_resource_usage_you_can_check_the_binding_message:
		'Check resource usage, verify the binding status of FRP, or apply for binding/unbinding',
	third_party_account: 'Third-party account',
	bound_olares_id: 'Bind Olares ID',
	Please_authorize_and_verify_on_the_larePass_mobile_phone_to_bind_your_olares_id:
		'Please authorize and verify on LarePass app to bind your Olares ID',
	are_you_sure_you_want_to_delete_item:
		"Are you sure you want to delete '{item}'?",
	import_wallet: 'Import wallet',
	import_wallet_dialog_message:
		'"1. Install the MetaMask plugin from Chrome App Store to create or import your blockchain wallet. \\n2. Click the button above to import the wallet.\\n3. Bind the wallet to your Olares ID as instructed."',
	need_connect_first: 'Need to connect first',
	this_address_has_been_authenticated: 'This address has been authenticated',
	bind_blockchain_wallet: 'Bind blockchain wallet',
	bind_blockchain_wallet_dialog_message:
		'Confirm binding the blockchain wallet on LarePass app',
	bound_faild: 'Binding failed',
	unbind_blockchain_wallet: 'Unbind blockchain wallet',
	unbind_blockchain_wallet_dialog_message:
		'Confirm unbinding the blockchain wallet on LarePass app',
	unbound_faild: 'Unbinding faild',
	account_info: 'Account info',
	logout: 'Log out',
	binding_info: 'Binding info',
	only_after_binding_the_olares_id_can_you_continue_to_bind_avatar_message:
		'You must bind Olares ID before you can bind the blockchain wallet and obtain the NFT avatar',
	username_is_metaMask_wallet: "{username}'s MetaMask wallet",
	you_need_to_bind_a_blockchain_wallet_to_obtain_the_corresponding_nft_image_message:
		'To use an NFT image as your exclusive avatar in your Profile, you need to bind a blockchain wallet',
	import: 'Import',
	you_need_to_bind_a_blockchain_wallet_to_obtain_the_corresponding_nft_image_message_more:
		'To use an NFT image as your exclusive avatar in your Profile, you need to bind a blockchain wallet. To get the NFT image:<br>1. Install the MetaMask plugin from Chrome App Store to create or import your blockchain wallet. <br>2. Click the button above to import the wallet.\\n3. Bind the wallet to your Olares ID as instructed.',
	login_and_bind_your_olares_space_account:
		'Log in and bind your Olares Space account',
	account: 'Account',
	password: 'Password',
	enter_the_6_digit_code_sent_to: "Enter the 6-digit code sent to '{item}'",
	email_verification_code: 'Email verification code',
	send_code: 'Send code',
	resend: 'Resend',
	phone_verification_code: 'Phone verification code',
	enter_the_6_digit_code: 'Enter the 6-digit code',
	ga_verification_code: 'GA verification code',
	next: 'Next',
	count_file: '{count} file',
	confirm: 'Confirm',
	not_activated: 'Not activated',
	system: 'System',
	manufacturer: 'Manufacturer',
	locale: 'Locale',
	vpn: 'VPN',
	this_device: 'This device',
	last_active_time: 'Last active time',
	software_type: 'Software type',
	location: 'Location',
	delete_device: 'Delete device',
	already_bound: 'Already bound',
	not_bound: '',
	frequency: '',
	action_sub_policies: '{action} sub policies',
	update_secret: '',
	delete_secret_id: '',
	in_order_to_apply_third_party_domain_to_this_app_you_need_to_add_a_dns_cname_record_domain_to_your_domain_target:
		"To apply for a third-party domain for this app, you'll need to add a DNS CNAME record '{domain}' to your domain '{target}'",
	login: {
		title: 'Login',
		scan_qr_code: 'Scan QR Code',
		download_larePass: 'Download LarePass',
		novice_users_download_install_larePass:
			'Get started by installing the LarePass app on your mobile device. After installation, scan the QR code with LarePass app to log in. Learn more',
		read_this_article: 'in this article',
		open_the_app: 'Open the app',
		top_right_corner_setting_tab: 'Top right corner of setting tab',
		with: 'With',
		larePass_to_log_in: 'LarePass to log in',
		scan_to_log_in: 'Scan to log in',
		qr_code_expired_refresh: 'QR code expired.\\n Please refresh.',
		account_login_status_expired_scan_code_again:
			'Your login session has expired. Scan the code again to log in.'
	},
	features_under_development: 'Features under development',
	submit_succeed: 'Submitted',
	copy_successfully: 'Copied',
	activate_account: 'Activate account',
	original_password: 'Original password',
	copy: 'Copy',
	scan_qr_code_with: 'Scan QR code with',
	please_log_in_to_Olares_Space_before_using_the_backup_service:
		'You must log in to your Olares Space to use the backup service',
	must_have_at_least_4_characters: 'Must have at least 4 characters',
	revoke_token: 'Revoke token',
	revoke_token_message: 'Are you sure to revoke this token?',
	last_snapshot: 'Last snapshot',
	total_size: 'Total size',
	next_snapshot: 'Next snapshot',
	local_machine: 'Local machine',
	knowledge_bases: 'Knowledge bases',
	create_new: 'Create',
	remove: 'Remove',
	remove_knowledge_base: "Remove knowledge base '{base}'",
	remove_knowledge_base_message:
		"Are you sure you want to remove '{base}'? This will delete the knowledge base's index data. Your original document will not be deleted.",
	knowldege_base_name: 'Knowldege base name',
	paths: 'Paths',
	separate_different_paths_with_a_comma:
		'Separate different paths with commas (,)',
	docs: 'Docs',
	add_new_knowledge_base: 'Add knowledge base',
	save_knowledge_base: "Save knowledge base '{base}'",
	no_knowledge_bases_available: 'No knowledge bases available',
	number_linked_agent: '{number} linked agent',
	theme: 'Theme',
	wallpaper: 'Wallpaper',
	add_account: 'Add account',
	inactive: 'Inactive',
	active: 'Active',
	account_settings: 'Account settings',
	access_key_id: 'AccessKey ID',
	access_key_secret: 'AccessKey secret',
	endpoint: 'Endpoint',
	bucket: 'Bucket',
	optional: 'Optional',
	previous: 'Previous',
	mount_network_drive: 'Mount network drive',
	no_item_available: 'No {item} available',
	upgrade: 'Upgrade',
	light: 'Light',
	dark: 'Dark',
	auto: 'Auto',
	profile_avatar: 'Profile Avatar',
	effected_urls: 'Affected URLs',
	default_route_id: 'Default route ID',
	setup_custom_route_id: 'Set custom route ID',
	setup_custom_domain: 'Set custom domain',
	device_of_vault_trustee: 'Vault trustee device',
	actions: 'Actions',
	'SSO authorization token': 'SSO authorization token',
	data_type: 'Data type',
	data_group: 'Data group',
	version: 'Version',
	logs: 'Logs',
	hosts: 'Hosts',
	hosts_edit: 'Hosts edit',
	add_hosts: 'Add hosts',
	save_change: 'Save change',
	ip: 'IP',
	get_logs: 'Collect logs',
	log_file_storage: 'Log file storage address',
	collect_failed_reason: 'Reasons for log collection failure',
	checking_system_status: 'Checking system status',
	checking_new_version_info: 'Checking for new version information',
	no_hosts_added_yet: 'No hosts added yet',
	collect: 'Collect',
	collecting: 'Collecting',
	auto_get: 'Upgrade now',
	namespace: 'Namespace',
	deployment: 'Deployment',
	operations: 'Operations',
	permissions: 'Permissions',
	providers: 'Providers',
	'This provider registry could not be found':
		'This provider registry could not be found',
	'Switch language': 'Switch language',
	'Are you sure you need to switch the system language to {language}?':
		'Are you sure you need to switch the system language to {language}?',
	allow_ssh_via_vpn: 'Allow SSH via VPN',
	acls: 'ACLs',
	dst: 'Dst',
	protocol: 'Protocol',
	export_port: 'Exported Port',
	export_ports: 'Export Ports',

	...en_US_add
};
