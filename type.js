/**
 * config
 */

var type = {
  designer_auth_type_new: '0',
  designer_auth_type_processing: '1',
  designer_auth_type_done: '2',
  designer_auth_type_reject: '3',
  designer_auth_type_illegal: '4',

  product_auth_type_new: '0',
  product_auth_type_done: '1',
  product_auth_type_reject: '2',
  product_auth_type_illegal: '3',

  share_status_invisible: '0',
  share_status_visible: '1',

  designer_agree_type_new: '0',
  designer_agree_type_yes: '1',

  requirement_status_new: '0',
  requirement_status_not_respond: '1',
  requirement_status_respond_no_housecheck: '2',
  requirement_status_housecheck_no_plan: '6',
  requirement_status_plan_not_final: '3',
  requirement_status_final_plan: '4',
  requirement_status_config_contract: '7',
  requirement_status_config_process: '5',

  plan_status_not_respond: '0',
  plan_status_designer_reject: '1',
  plan_status_designer_no_respond_expired: '7',
  plan_status_designer_respond_no_housecheck: '2',
  plan_status_designer_housecheck_no_plan: '6',
  plan_status_designer_no_plan_expired: '8',
  plan_status_designer_upload: '3',
  plan_status_user_not_final: '4',
  plan_status_user_final: '5',

  role_admin: '0',
  role_user: '1',
  role_designer: '2',

  work_type_half: '0',
  work_type_all: '1',
  work_type_design_only: '2',

  process_item_status_new: '0',
  process_item_status_going: '1',
  process_item_status_done: '2',
  process_item_status_reschedule_req_new: '3',
  process_item_status_reschedule_ok: '4',
  process_item_status_reschedule_reject: '5',

  process_section_kai_gong: 'kai_gong',
  process_section_chai_gai: 'chai_gai',
  process_section_shui_dian: 'shui_dian',
  process_section_ni_mu: 'ni_mu',
  process_section_you_qi: 'you_qi',
  process_section_an_zhuang: 'an_zhuang',
  process_section_jun_gong: 'jun_gong',

  process_work_flow: ['kai_gong', 'chai_gai', 'shui_dian', 'ni_mu', 'you_qi',
    'an_zhuang', 'jun_gong'
  ],

  procurement_notification_message: ['', '水电材料', '蹲便器,防水涂料',
    '石膏线,木工材料,厨卫墙砖,地砖进场',
    '油漆,涂料及相关辅料,五金,洁具', '厨卫吊顶,石材,橱柜,烟机,灶具,木地板,木门,面板,灯具,墙纸', ''
  ],

  process_kai_gong_item_xcjd: 'xcjd',
  process_kai_gong_item_cgdyccl: 'cgdyccl',
  process_kai_gong_item_qdzmjcl: 'qdzmjcl',
  process_kai_gong_item_sgxcl: 'sgxcl',
  process_kai_gong_item_mdbcl: 'mdbcl',
  process_kai_gong_item_kgmbslcl: 'kgmbslcl',
  process_chai_gai_item_cpbh: 'cpbh',
  process_chai_gai_item_ztcg: 'ztcg',
  process_chai_gai_item_qpcc: 'qpcc',
  process_shui_dian_item_sdsg: 'sdsg',
  process_shui_dian_item_ntsg: 'ntsg',
  process_ni_mu_item_sgxaz: 'sgxaz',
  process_ni_mu_item_cwqfssg: 'cwqfssg',
  process_ni_mu_item_cwqdzsg: 'cwqdzsg',
  process_ni_mu_item_ktytzsg: 'ktytzsg',
  process_ni_mu_item_dmzp: 'dmzp',
  process_ni_mu_item_ddsg: 'ddsg',
  process_ni_mu_item_gtsg: 'gtsg',
  process_you_qi_item_mqqsg: 'mqqsg',
  process_you_qi_item_qmrjq: 'qmrjq',
  process_an_zhuang_item_scaz: 'scaz',
  process_an_zhuang_item_jjaz: 'jjaz',
  process_an_zhuang_item_cwddaz: 'cwddaz',
  process_an_zhuang_item_wjaz: 'wjaz',
  process_an_zhuang_item_cgscaz: 'cgscaz',
  process_an_zhuang_item_yjzjaz: 'yjzjaz',
  process_an_zhuang_item_mdbmmaz: 'mdbmmaz',
  process_an_zhuang_item_qzpt: 'qzpt',
  process_an_zhuang_item_mbdjaz: 'mbdjaz',
  process_an_zhuang_item_snzl: 'snzl',

  message_type_reschedule: '0',
  message_type_procurement: '1',
  message_type_pay: '2',
  message_type_user_ys: '3',

  platform_android: '0',
  platform_ios: '1',

  online_status_on: '0',
  online_status_off: '1',

  comment_status_all_read: '0',
  comment_status_need_user_read: '1',
  comment_status_need_designer_read: '2',

  topic_type_plan: '0',
  topic_type_process_item: '1',

  evaluation_is_anonymous_no: '0',
  evaluation_is_anonymous_yes: '1',

  sex_man: '0',
  sex_female: '1',
  sex_no_limit: '2',

  communication_type_free: '0',
  communication_type_expressive: '1',
  communication_type_listener: '2',
}

module.exports = type;
