var type = require('../type');

exports.isDone = function (requirement) {
  if (!requirement) {
    return false;
  }

  if ((requirement.status === type.requirement_status_done_process) || (requirement.work_type === type.work_type_design_only &&
      requirement.status == type.requirement_status_final_plan)) {
    return true;
  } else {
    return false;
  }
}
