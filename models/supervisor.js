'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

let SupervisorSchema = new Schema({ // 监理
  phone: {
    type: String // 手机号
  },
  username: {
    type: String // 用户名
  },
  pass: {
    type: String // 密码
  },
  sex: {
    type: String // 性别
  },
  province: {
    type: String // 省
  },
  city: {
    type: String // 市
  },
  district: {
    type: String // 区
  },
  address: {
    type: String // 地址
  },
  imageid: {
    type: ObjectId // 头像id
  },
  create_at: {
    type: Number // 创建时间
  },
  lastupdate: {
    type: Number // 更新时间
  },
  auth_type: {
    type: String // 审核类型
  }
});

SupervisorSchema.index({
  phone: 1
}, {
  unique: true
});
SupervisorSchema.index({
  city: 1
});

mongoose.model('Supervisor', SupervisorSchema);
