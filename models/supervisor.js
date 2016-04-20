'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

let SupervisorSchema = new Schema({
  phone: {
    type: String
  },
  username: {
    type: String
  },
  pass: {
    type: String
  },
  sex: {
    type: String
  },
  province: {
    type: String
  },
  city: {
    type: String
  },
  district: {
    type: String
  },
  address: {
    type: String
  },
  imageid: {
    type: ObjectId
  },
  create_at: {
    type: Number
  },
  lastupdate: {
    type: Number
  },
  auth_type: {
    type: String
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
