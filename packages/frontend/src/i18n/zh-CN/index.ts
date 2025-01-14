import zh_CN_add from '../add/zh-CN';

export default {
	home_menus: {
		wallpaper: '壁纸',
		knowledge: '知识',
		notification: '通知',
		application: '应用',
		integration: '集成',
		account: '账户',
		services: '服务',
		authority: '权限',
		upgrade: '升级',
		backup: '备份',
		appearance: '外观',
		network: '网络',
		system: '系统'
	},
	role: { admin: '管理员', member: '成员' },
	server_location: { olares_space: 'Olares Space', aws_s3: 'AWS S3' },
	frequencys: { every_day: '每天', every_week: '每周' },
	week: {
		sunday: '星期日',
		monday: '星期一',
		tuesday: '星期二',
		wednesday: '星期三',
		thursday: '星期四',
		friday: '星期五',
		saturday: '星期六'
	},
	factor: {
		system: '跟随系统',
		one_factor: '单因素',
		two_factor: '双因素',
		none: '无'
	},
	success: '成功',
	errors: {
		connect_wallet_failed: '关联钱包失败',
		please_install_an_defi_wallet_like_metaMask: '请安装 DEFI 钱包',
		cpu_limit_is_empty: 'CPU 限制为空',
		only_valid_numbers_can_be_entered: '请输入有效数字',
		memory_limit_is_empty: '内存限制为空',
		old_password_is_empty: '旧密码为空',
		at_least_8_digits_long: '必须至少有 8 位数字',
		at_least_one_uppercase_and_lowercase_letter:
			'必须至少使用一个大写字母和一个小写字母 ',
		repassword_do_not_match_password: '密码不匹配',
		olares_id_not_exists_on_blockchain: 'Olares ID 不存在',
		username_is_empty: '用户名为空',
		username_already_registered: '用户名已被注册',
		email_is_empty: '邮箱为空',
		email_already_registered: '邮箱已注册',
		ip_input_error: 'IP 输入错误',
		something_wrong_please_try_again: '系统错误。请重试。',
		naming_is_not_compliant: '命名无效',
		the_two_passwords_entered_are_inconsistent: '密码不一致',
		you_are_not_logged_in_olares_space_yet_click_here_to:
			'您尚未登录 Olares Space。点击此处',
		please_type_something: '请输入内容',
		please_input_password: '必须输入密码',
		passwords_are_inconsistent: '密码不一致',
		please_enter_a_valid_number: '输入有效数字',
		network_error: '网络错误',
		third_level_domain_is_empty: '三级域名为空',
		third_party_domain_is_empty: '第三方域名为空',
		something_went_wrong: '出错了',
		please_input_6_digit_email_verification_code:
			'输入发送到您邮箱的 6 位验证码以继续',
		please_input_url: '请输入 URL',
		secret_is_required: '密钥为空',
		name_is_required: '名称为空',
		knowledge_base_name_already_taken: '知识库名称\\t已存在',
		paths_must_start_with_data_home: '路径必须的开头必须为：/data/Home/',
		item_is_empty: '缺少{item}',
		host_is_empty: 'Host 名称不能为空',
		ip_is_empty: 'IP 地址不能为空',
		host_is_error: '请输入有效的 Host 名称',
		host_is_error_duplicate: '该 Host 名称已存在',
		ip_is_error: '请输入有效的 IP 地址'
	},
	pictures: '图片',
	login_background: '登录背景',
	desktop_background: '桌面背景',
	create_account: '创建账户',
	delete_item: '删除{item}',
	modify_limits: '修改限制',
	delete_user: '删除用户',
	delete_user_message: '您确定要删除账户“{account}”吗？',
	reset_password_successfully: '密码重置成功',
	new_password_is: '新密码是“{password}”',
	resource_usage: '资源使用',
	cpu_core: 'CPU 核心',
	memory_gi: '内存 Gi',
	info: '信息',
	olares_ID: 'Olares ID',
	email: '邮箱',
	state: '状态',
	waiting_onBoard: '等待激活',
	last_login_time: '最后登录时间',
	create_time: '创建时间',
	roles: '角色',
	reset_password: '重置密码',
	wizard_url: '向导页 URL',
	change_password: '更改密码',
	cpu: 'CPU',
	core: '核心',
	memory: '内存',
	gb: 'GB',
	ok: '好的',
	password_update_success: '密码已更新',
	old_password: '旧密码',
	new_password: '新密码',
	repeat_password: '确认密码',
	user_had_been_created: '已成功为“{username}”创建用户账户',
	user_had_been_created_message:
		'向导页为“{wizard}”。默认密码是“{password}”。',
	completed: '已完成',
	failed: '失败',
	current_version: '当前版本',
	development_mode: '开发模式',
	new_version: '新版本',
	upgrading: '正在升级',
	upgrade_now: '立即升级',
	list_of_sso_authorization_tokens: 'SSO 授权令牌列表',
	expire_time: '到期时间',
	auth_level: '认证级别',
	first_factor_time: '第一因素时间',
	second_factor_time: '第二因素时间',
	time: '时间',
	status: '状态',
	source_ip_address: '源 IP 地址',
	reason: '原因',
	login_history: '登录历史',
	view_login_history: '查看登录历史',
	successful: '成功',
	you_need_at_least_3_devices_online_to_activate_headScale:
		'您需要至少 3 台设备在线才能激活 HeadScale',
	olares_cloud: 'Olares Cloud',
	device: '设备',
	security: '安全',
	forcing_vpn_access_to_private_network: '强制通过 VPN 访问私有入口',
	view_the_active_session_of_the_vault: '查看 Vault 活跃会话',
	view_the_headScale_connection_status: '查看 HeadScale 连接状态',
	view_the_list_of_sso_authorization_tokens: '查看 SSO 授权令牌',
	check_network_authority_policy: '检查网络权限策略',
	headScale_connection_status: 'HeadScale 连接状态',
	times_unit: {
		seconds: '秒',
		minute: '分钟',
		minutes: '分钟',
		hour: '小时',
		hours: '小时',
		day: '天',
		days: '天',
		second_short: 's'
	},
	last_seen_time_unit_ago: '最后在线时间：{time} {unit} 前',
	add_tag: '添加标签',
	tag: '标签',
	edit: '编辑',
	device_last_seen: '设备最后在线时间',
	ip_addresses: 'IP 地址',
	device_name: '设备名称',
	device_routes: '设备路由',
	enable: '启用',
	pending: '待处理',
	worldwide: '全球',
	public: '公开',
	protected: '受保护',
	private: '私有',
	network_authority_policy: '网络权限策略',
	select_authority: '选择权限',
	ip_input_popup_message: '使用半角逗号（,）分隔多个 IP 地址',
	select_factor_model: '选择因素模型',
	save: '保存',
	notification: '通知',
	job: '任务',
	sender: '发送者',
	recipients: '接收者',
	template: '模板',
	notify_policy: '通知策略',
	name: '名称',
	notify_group: '通知组',
	action: '操作',
	templates: '模板',
	view: '查看',
	language: '语言',
	title: '标题',
	body: '正文',
	back: '返回',
	app: '应用',
	variables: '变量',
	created_at: '创建时间',
	updated_at: '更新时间',
	type: '类型',
	description: '描述',
	add: '添加',
	id: 'ID',
	recipient_type: '接收者类型',
	new: '新建',
	credentials: '凭证',
	cancel: '取消',
	create: '创建',
	data: '数据',
	recipients_address: '接收者地址',
	is_default: '默认',
	rules: '规则',
	delete: '删除',
	policies: '策略',
	need_recipients: '需要接收者',
	template_id: '模板 ID',
	notify_policy_id: '通知策略 ID',
	message: '消息',
	jobs: '任务',
	recipient: '接收者',
	sender_type: '发送者类型',
	message_num: '消息数量',
	sent_num: '发送数量',
	success_num: '成功次数',
	application: '应用',
	policy: '策略',
	knowledge: '知识',
	set_directories_for_file_search_monitoring: '设置文件搜索中包含的目录',
	path: '路径',
	update_time: '更新时间',
	knowledge_reminder_info:
		'这些文件夹定义了 Alfred 查找文件、应用程序和元数据的位置。路径越少，结果越准确。要添加文件夹，请从 Finder 或 Alfred 中拖放。',
	add_directory: '添加目录',
	please_input_path: '输入路径',
	backup: '备份',
	add_backup: '添加备份',
	no_backup_available: '没有可用的备份',
	snapshot_details: '快照详情',
	size: '大小',
	backup_type: '备份类型',
	backup_detail_snpshot_popup_info:
		'·最多包含 63 个字符<br>·包含小写字母（a-z）、数字（0-9）和连字符（-）<br>·以字母开头<br>·以字母（a-z）或数字（0-9）结尾 ',
	login_teminus_space: '登录 Teminus Space',
	you_are_not_logged_in_olares_space_yet: '您尚未登录 Olares Space',
	backup_name: '备份名称',
	please_input_the_backup_name: '输入备份名称',
	region: '地区',
	please_enter_a_uri: '输入 URI',
	s3_url: 'S3 URL',
	s3_prefix: 'S3 前缀',
	s3_accessKey: 'S3 accessKey',
	s3_secretKey: 'S3 secretKey',
	snapshot_frequency: '快照频率',
	run_backup_at: '运行备份于',
	close: '关闭',
	backup_password: '备份密码',
	please_enter_a_password: '输入密码',
	confirm_password: '确认密码',
	please_confirm_a_password: '确认密码',
	submit: '提交',
	manage_backup: '管理备份',
	backup_size: '备份大小',
	snapshots: '快照',
	no_snapshots: '没有快照',
	secrets: '密钥',
	app_secrets: '应用密钥',
	add_secret: '添加密钥',
	key: '键',
	last_updated: '最后更新',
	the_item_index_is_empty: '第 {index} 项为空 ',
	auth_level_is_error_error: '认证级别错误：{error}',
	domain_setup: '设置端点',
	setup_access_policies: '创建访问策略',
	second_factor_model: '认证模式',
	one_time: '一次性',
	valid_duration: '有效期',
	please_add_a_dns_record_record_cname_to_cname:
		'添加 DNS 记录：{record} CName 到 {cname}',
	checking_cname_records_usually_takes_1_hour:
		'正在检查 CName 记录。通常需要 1 小时。',
	wait_for_cname_to_be_activated: '等待 CName 激活',
	activated: '已激活',
	app_prefix: '应用前缀',
	third_level_domain: '三级域名',
	third_party_domain: '第三方域名',
	activation_third_party_domain: '激活第三方域名',
	activation: '激活',
	entrances: '入口',
	apply: '应用',
	had_bound: '已绑定',
	bound_nft_avatar: '已绑定 NFT 头像',
	please_authorize_and_verify_on_the_larePass_mobile_phone_to_bind_your_nft_avatar:
		'请在 LarePass 应用上授权并验证以绑定您的 NFT 头像',
	nft_images: 'NFT 图像',
	no_nft_available: '没有可用的 NFT',
	select_the_image_to_complete_binding_nft_message:
		'选择图片，点击“绑定”，将 NFT 头像与 Olares ID 关联。绑定后，您可以在 Profile 应用的 NFT 头像列表中查看和设置 NFT 头像。',
	bound: '绑定',
	accounts: '账户',
	olares_space: 'Olares Space',
	check_resource_usage_you_can_check_the_binding_message:
		'查看资源使用情况、验证 FRP 绑定状态，或申请绑定/解绑',
	third_party_account: '第三方账户',
	bound_olares_id: '绑定 Olares ID',
	Please_authorize_and_verify_on_the_larePass_mobile_phone_to_bind_your_olares_id:
		'请在 LarePass 应用上授权并验证以绑定 Olares ID',
	are_you_sure_you_want_to_delete_item: '确定要删除“{item}”吗？',
	import_wallet: '导入钱包',
	import_wallet_dialog_message:
		'"1. 从 Chrome 应用商店安装 MetaMask 插件，创建或导入您的区块链钱包。\\n 2. 点击上方按钮导入钱包。\\n 3. 按照界面提示，将钱包绑定到您的 Olares ID。"',
	need_connect_first: '需要先连接',
	this_address_has_been_authenticated: '此地址已经过验证',
	bind_blockchain_wallet: '绑定区块链钱包',
	bind_blockchain_wallet_dialog_message: '在 LarePass 应用上绑定区块链钱包',
	bound_faild: '绑定失败',
	unbind_blockchain_wallet: '解绑区块链钱包',
	unbind_blockchain_wallet_dialog_message:
		'在 LarePass 应用上确认解绑区块链钱包',
	unbound_faild: '解绑失败',
	account_info: '账户信息',
	logout: '登出',
	binding_info: '绑定信息',
	only_after_binding_the_olares_id_can_you_continue_to_bind_avatar_message:
		'必须绑定 Olares ID，才可以绑定区块链钱包、获取 NFT 头像',
	username_is_metaMask_wallet: '{username}的 MetaMask 钱包',
	you_need_to_bind_a_blockchain_wallet_to_obtain_the_corresponding_nft_image_message:
		'若要使用 NFT 图片作为个人主页的专属头像，您需要绑定区块链钱包',
	import: '导入',
	you_need_to_bind_a_blockchain_wallet_to_obtain_the_corresponding_nft_image_message_more:
		'1. 从 Chrome 应用商店安装 MetaMask 插件，创建或导入您的区块链钱包。\\n 2. 点击上方按钮导入钱包。\\n 3. 按照界面提示，将钱包绑定到您的 Olares ID。',
	login_and_bind_your_olares_space_account: '登录并绑定 Olares Space 账号',
	account: '账户',
	password: '密码',
	enter_the_6_digit_code_sent_to: '输入发送至“{item}”的 6 位验证码',
	email_verification_code: '邮箱验证码',
	send_code: '发送验证码',
	resend: '重新发送',
	phone_verification_code: '手机验证码',
	enter_the_6_digit_code: '输入 6 位验证码',
	ga_verification_code: 'GA 验证码',
	next: '下一步',
	count_file: '{count} 个文件',
	confirm: '确认',
	not_activated: '未激活',
	system: '系统',
	manufacturer: '制造商',
	locale: '区域设置',
	vpn: 'VPN',
	this_device: '此设备',
	last_active_time: '最后活跃时间',
	software_type: '软件类型',
	location: '位置',
	delete_device: '删除设备',
	already_bound: '已绑定',
	not_bound: '',
	frequency: '',
	action_sub_policies: '{action}子策略',
	update_secret: '',
	delete_secret_id: '',
	in_order_to_apply_third_party_domain_to_this_app_you_need_to_add_a_dns_cname_record_domain_to_your_domain_target:
		'要为此应用申请第三方域名，需要 DNS CNAME 记录“{domain}”添加到您的域名“{target}”',
	login: {
		title: '登录',
		scan_qr_code: '扫描二维码',
		download_larePass: '下载 LarePass',
		novice_users_download_install_larePass:
			'首先在您的移动设备上安装 LarePass 应用。安装后，使用 LarePass 应用扫描二维码以登录。在本文中',
		read_this_article: '了解更多',
		open_the_app: '打开应用',
		top_right_corner_setting_tab: '设置选项卡右上角',
		with: '使用',
		larePass_to_log_in: 'LarePass 登录',
		scan_to_log_in: '扫描登录',
		qr_code_expired_refresh: '二维码已过期。\\n请刷新。',
		account_login_status_expired_scan_code_again:
			'当前登录会话已过期。请再次扫描二维码登录。'
	},
	features_under_development: '正在开发的功能',
	submit_succeed: '已提交',
	copy_successfully: '已复制',
	activate_account: '激活账户',
	original_password: '初始密码',
	copy: '复制',
	scan_qr_code_with: '使用以下方式扫描二维码',
	please_log_in_to_Olares_Space_before_using_the_backup_service:
		'您必须登录 Olares Space 才能使用备份服务',
	must_have_at_least_4_characters: '必须至少包括 4 个字符',
	revoke_token: '撤销令牌',
	revoke_token_message: '确定要撤销该令牌吗？',
	last_snapshot: '最后快照',
	total_size: '总大小',
	next_snapshot: '下次快照',
	local_machine: '本地机器',
	knowledge_bases: '知识库',
	create_new: '创建',
	remove: '移除',
	remove_knowledge_base: '删除知识库“{base}”',
	remove_knowledge_base_message:
		'确定要删除“{base}”吗？这将删除知识库的索引数据。您的原始文档不会被删除。',
	knowldege_base_name: '知识库名称',
	paths: '路径',
	separate_different_paths_with_a_comma: '用半角逗号（,）分隔多个路径',
	docs: '文档',
	add_new_knowledge_base: '添加知识库',
	save_knowledge_base: '保存知识库“{base}”',
	no_knowledge_bases_available: '没有可用的知识库',
	number_linked_agent: '{number} 个关联代理',
	theme: '主题',
	wallpaper: '壁纸',
	add_account: '添加账户',
	inactive: '非活跃',
	active: '活跃',
	account_settings: '账户设置',
	access_key_id: 'AccessKey ID',
	access_key_secret: 'AccessKey secret',
	endpoint: '端点',
	bucket: '存储桶',
	optional: '可选',
	previous: '上一步',
	mount_network_drive: '挂载网络驱动器',
	no_item_available: '没有可用的{item}',
	upgrade: '升级',
	light: '浅色',
	dark: '深色',
	auto: '自动',
	profile_avatar: '头像',
	effected_urls: '受影响 URL',
	default_route_id: '默认路由 ID',
	setup_custom_route_id: '设置自定义路由 ID',
	setup_custom_domain: '设置自定义域名',
	device_of_vault_trustee: 'Vault 信任设备',
	actions: '操作',
	'SSO authorization token': 'SSO 授权令牌',
	data_type: '数据类型',
	data_group: '数据组',
	version: '版本',
	logs: '日志',
	hosts: 'Hosts',
	hosts_edit: '编辑 Host',
	add_hosts: '添加 Host',
	no_hosts_added_yet: '尚未添加 Host',
	host_name: 'Host 名称',
	ip: 'IP 地址',
	get_logs: '收集日志',
	collect_failed_reason: '日志收集失败原因',
	checking_system_status: '正在查询系统状态',
	checking_new_version_info: '正在查询新版本信息',
	collect: '收集',
	collecting: '正在收集',
	log_file_storage: '日志文件存储地址',
	namespace: '命名空间',
	deployment: '部署',
	operations: '操作',
	permissions: '权限',
	providers: '服务提供者',
	'This provider registry could not be found': '找不到此服务提供者注册表',
	'Switch language': '切换语言',
	'Are you sure you need to switch the system language to {language}?':
		'切换系统语言为 {language} 吗?',
	allow_ssh_via_vpn: '允许通过 VPN 进行 SSH 连接',
	acls: 'ACL 配置',
	dst: '目标地址',
	protocol: '协议',
	export_port: '导出端口',
	export_ports: '导出端口',
	port: '端口',
	host: '主机',

	...zh_CN_add
};
