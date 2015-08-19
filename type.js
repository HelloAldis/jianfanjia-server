/**
 * config
 */

var type = {
  designer_auth_type: {
    new: '0',
    processing: '1',
    done: '2',
  },

  plan_status: {
    not_respond: '0',
    designer_reject: '1',
    designer_respond: '2',
    desinger_upload: '3',
    user_reject: '4',
    user_final: '5',
  },

  role: {
    admin: '0',
    user: '1',
    designer: '2',
  },
}


module.exports = type;
