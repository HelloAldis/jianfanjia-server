'use strict'

const Designer = require('../../proxy').Designer;
const Evaluation = require('../../proxy').Evaluation;
const score_business = require('../../business/score_business');
const async = require('async');

Designer.count({}, function (err, count) {
  if (err) {
    return console.log('err = ' + err);
  }

  async.timesSeries(count, function (n, next) {
    Designer.find({}, null, {
      skip: n,
      limit: 1,
      sort: {
        create_at: 1
      }
    }, function (err, designers) {
      if (err) {
        next(err);
      } else {
        let designer = designers[0];
        Evaluation.group({
          _id: "$designerid",
          respond_speed: {
            $avg: "$respond_speed"
          },
          service_attitude: {
            $avg: "$service_attitude"
          }
        }, {
          designerid: designer._id
        }, function (err, re) {
          if (re.length > 0) {
            designer.service_attitude = re[0].service_attitude;
            designer.respond_speed = re[0].respond_speed;
          } else {
            designer.service_attitude = 0;
            designer.respond_speed = 0;
          }
          designer.save(function (err) {
            console.log(
              `save designer ${designer._id} ${designer.username} service_attitude:${designer.service_attitude} respond_speed:${designer.respond_speed}`
            );
            next(err);
          });
        });
      }
    });
  }, function (err) {
    if (err) {
      console.log('complete wit err =' + err);
      process.exit();
    } else {
      console.log('complete ok');
      score_business.refresh_all_designer_score(function () {
        process.exit();
      })
    }
  });
});



// db.evaluations.aggregate(
//   [{
//     $match: {
//       designerid: ObjectId("55eceefedfdb3ad44813bb34")
//     }
//   }, {
//     $group: {
//       _id: "$designerid",
//       r: {
//         $avg: "$respond_speed"
//       },
//       s: {
//         $avg: "$service_attitude"
//       }
//     }
//   }]
// )

// db.evaluations.find({
//   designerid: ObjectId("55ee5313ff6066ae2dc39f56")
// }, {
//   respond_speed: 1,
//   service_attitude: 1
// })
