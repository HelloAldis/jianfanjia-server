db.users.dropIndex("phone_1");

db.agendaJobs.drop();

db.requirements.update({
  dec_type: {
    $exists: false,
  }
}, {
  '$set': {
    dec_type: '0',
  }
}, false, true);

db.processes.update({
  dec_type: {
    $exists: false,
  }
}, {
  '$set': {
    dec_type: '0',
  }
}, false, true);
