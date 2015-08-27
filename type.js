/**
 * config
 */

var type = {
  designer_auth_type_new: '0',
  designer_auth_type_processing: '1',
  designer_auth_type_done: '2',

  designer_agree_type_new: '0',
  designer_agree_type_yes: '1',

  plan_status_not_respond: '0',
  plan_status_designer_reject: '1',
  plan_status_designer_respond: '2',
  plan_status_desinger_upload: '3',
  plan_status_user_reject: '4',
  plan_status_user_final: '5',

  role_admin: '0',
  role_user: '1',
  role_designer: '2',

  work_type_half: '0',
  work_type_all: '1',

  process_item_status_new: '0',
  process_item_status_going: '1',
  process_item_status_done: '2',

  process_section_kai_gong: 'kai_gong',
  process_section_chai_gai: 'chai_gai',
  process_section_shui_dian: 'shui_dian',
  process_section_ni_mu: 'ni_mu',
  process_section_you_qi: 'you_qi',
  process_section_an_zhuang: 'an_zhuang',
  process_sction_jun_gong: 'jun_gong',

  process_work_flow: [process_section_kai_gong, process_section_chai_gai, process_section_shui_dian,
  process_section_ni_mu, process_section_you_qi, process_section_an_zhuang, process_sction_jun_gong];
}


module.exports = type;
