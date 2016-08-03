'use strict'

const type = require('lib/type/type');
const date_util = require('lib/common/date_util');

const NAMES = {
  process_section_kai_gong: ['kai_gong', '开工'],
  process_item_xcjd: ['xcjd', '现场交底'],
  process_item_cgdyccl: ['cgdyccl', '橱柜第一次测量 '],
  process_item_qdzmjcl: ['qdzmjcl', '墙地砖面积测量 '],
  process_item_sgxcl: ['sgxcl', '石膏线测量'],
  process_item_mdbcl: ['mdbcl', '木地板测量'],
  process_item_kgmbslcl: ['kgmbslcl', '开关面板数量核算'],

  process_section_chai_gai: ['chai_gai', '折改'],
  process_item_cpbh: ['cpbh', '成品保护'],
  process_item_ztcg: ['ztcg', '主体拆改'],
  process_item_qpcc: ['qpcc', '墙皮铲除'],
  // 商装
  process_item_gqgz: ['gqgz', '隔墙改造'],

  process_section_shui_dian: ['shui_dian', '水电'],
  process_item_sdsg: ['sdsg', '水电施工'],
  process_item_ntsg: ['ntsg', '暖通施工'],
  // 商装
  process_item_qdsg: ['qdsg', '强电施工'],
  process_item_slsg: ['slsg', '水路施工'],
  process_item_rdsg: ['rdsg', '弱电施工'],
  process_item_wsjqfssg: ['wsjqfssg', '卫生间全防水施工'],
  process_item_qdzsg: ['qdzsg', '墙地砖施工'],

  process_section_ni_mu: ['ni_mu', '泥木'],
  process_item_sgxaz: ['sgxaz', '石膏线安装'],
  process_item_cwqfssg: ['cwqfssg', '厨卫全防水施工'],
  process_item_cwqdzsg: ['cwqdzsg', '厨卫墙地砖施工'],
  process_item_ktytzsg: ['ktytzsg', '客厅阳台砖施工'],
  process_item_dmzp: ['dmzp', '地面找平'],
  process_item_ddsg: ['ddsg', '吊顶施工'],
  process_item_gtsg: ['gtsg', '柜体施工'],

  process_section_you_qi: ['you_qi', '油漆'],
  process_item_mqqsg: ['mqqsg', '木器漆施工'],
  process_item_qmrjq: ['qmrjq', '墙面乳胶漆'],
  // 商装
  process_item_qmqsg: ['qmqsg', '墙面漆施工'],

  process_section_an_zhuang: ['an_zhuang', '安装'],
  process_item_scaz: ['scaz', '石材安装'],
  process_item_jjaz: ['jjaz', '洁具安装'],
  process_item_cwddaz: ['cwddaz', '厨卫吊顶安装'],
  process_item_wjaz: ['wjaz', '五金安装'],
  process_item_cgscaz: ['cgscaz', '橱柜、水槽安装'],
  process_item_yjzjaz: ['yjzjaz', '烟机灶具安装'],
  process_item_mdbmmaz: ['mdbmmaz', '木地板、木门安装'],
  process_item_qzpt: ['qzpt', '墙纸铺贴'],
  process_item_mbdjaz: ['mbdjaz', '面板灯具安装'],
  process_item_snzl: ['snzl', '室内整理'],
  // 商装
  process_item_blgc: ['blgc', '玻璃工程'],
  process_item_djgc: ['djgc', '地胶工程'],
  process_item_dtgc: ['dtgc', '地毯工程'],
  process_item_wyaz: ['wyaz', '卫浴安装'],
  process_item_mmaz: ['mmaz', '木门安装'],

  process_section_jun_gong: ['jun_gong', '竣工'],
  // 商装
  process_item_kqjh: ['kqjh', '空气净化']
};

const home_process_workflow = [{
  section: NAMES.process_section_kai_gong,
  items: [NAMES.process_item_xcjd, NAMES.process_item_cgdyccl, NAMES.process_item_qdzmjcl,
    NAMES.process_item_sgxcl, NAMES.process_item_mdbcl, NAMES.process_item_kgmbslcl
  ],
  ys: false
}, {
  section: NAMES.process_section_chai_gai,
  items: [NAMES.process_item_cpbh, NAMES.process_item_ztcg, NAMES.process_item_qpcc],
  ys: false
}, {
  section: NAMES.process_section_shui_dian,
  items: [NAMES.process_item_sdsg, NAMES.process_item_ntsg],
  ys: true
}, {
  section: NAMES.process_section_ni_mu,
  items: [NAMES.process_item_sgxaz, NAMES.process_item_cwqfssg, NAMES.process_item_cwqdzsg, NAMES.process_item_ktytzsg,
    NAMES.process_item_dmzp, NAMES.process_item_ddsg, NAMES.process_item_gtsg
  ],
  ys: true
}, {
  section: NAMES.process_section_you_qi,
  items: [NAMES.process_item_mqqsg, NAMES.process_item_qmrjq],
  ys: true
}, {
  section: NAMES.process_section_an_zhuang,
  items: [NAMES.process_item_scaz, NAMES.process_item_jjaz, NAMES.process_item_cwddaz, NAMES.process_item_wjaz, NAMES.process_item_cgscaz,
    NAMES.process_item_yjzjaz, NAMES.process_item_mdbmmaz, NAMES.process_item_qzpt, NAMES.process_item_mbdjaz, NAMES.process_item_snzl,
  ],
  ys: true
}, {
  section: NAMES.process_section_jun_gong,
  items: [],
  ys: true
}];

const business_process_workflow = [{
  section: NAMES.process_section_kai_gong,
  items: [NAMES.process_item_xcjd],
  ys: false
}, {
  section: NAMES.process_section_chai_gai,
  items: [NAMES.process_item_ztcg, NAMES.process_item_gqgz, NAMES.process_item_dmzp],
  ys: false
}, {
  section: NAMES.process_section_shui_dian,
  items: [NAMES.process_item_qdsg, NAMES.process_item_slsg, NAMES.process_item_rdsg, NAMES.process_item_wsjqfssg, NAMES.process_item_qdzsg],
  ys: true
}, {
  section: NAMES.process_section_ni_mu,
  items: [NAMES.process_item_ddsg, NAMES.process_item_gtsg],
  ys: true
}, {
  section: NAMES.process_section_you_qi,
  items: [NAMES.process_item_mqqsg, NAMES.process_item_qmqsg],
  ys: true
}, {
  section: NAMES.process_section_an_zhuang,
  items: [NAMES.process_item_blgc, NAMES.process_item_djgc, NAMES.process_item_dtgc, NAMES.process_item_wyaz, NAMES.process_item_mmaz],
  ys: true
}, {
  section: NAMES.process_section_jun_gong,
  items: [NAMES.process_item_kqjh],
  ys: true
}];

const home_process_60_template = {
  total: 60,
  details: [1, 2, 11, 21, 10, 13, 1],
};

exports.home_process_workflow = home_process_workflow;
exports.business_process_workflow = business_process_workflow;
exports.home_process_60_template = home_process_60_template;

exports.getSections = function (workflow, duration_template, duration, start_at) {
  const f = duration / duration_template.total;

  let sections = [];
  for (let i = 0; i < workflow.length; i++) {

    // 设置工序名
    sections[i] = {};
    sections[i].name = workflow[i].section[0];
    sections[i].label = workflow[i].section[1];

    // 设置工序状态
    if (i === 0) {
      sections[i].status = type.process_item_status_going;
    } else {
      sections[i].status = type.process_item_status_new;
    }

    // 设置工序有无验收
    if (workflow[i].ys) {
      sections[i].ys = {};
      sections[i].ys.images = [];
    }

    // 设置工序的小节点
    sections[i].items = [];
    for (let j = 0; j < workflow[i].items.length; j++) {
      sections[i].items[j] = {};
      sections[i].items[j].name = workflow[i].items[j][0];
      sections[i].items[j].label = workflow[i].items[j][1];
      sections[i].items[j].status = type.process_item_status_new;
    }

    // 设置工序的开工和结束
    sections[i].start_at = start_at;
    sections[i].end_at = date_util.add(sections[i].start_at, duration_template.details[i], f);
    start_at = sections[i].end_at;
  }

  return sections;
}
