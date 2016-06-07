(function () {
  'use strict';

  angular.module('JfjAdmin.services.util', [])
    .factory('mutiSelected', function () {

      function initMutiSelected(list, s) {
        if (!list || !s || !s.$in) {
          return;
        }

        initList(list, s.$in);
      }

      function getInQueryFormMutilSelected(list) {
        var ids = getCurId(list);
        return ids.length === 0 ? undefined : {
          '$in': ids
        };
      }

      function initList(list, ids) {
        if (!list || !ids) {
          return;
        }

        angular.forEach(ids, function (id, key) {
          angular.forEach(list, function (value, key) {
            if (value.id == id) {
              value.cur = true;
            }
          });
        });
      }

      function getCurId(list) {
        var ids = [];
        for (var value of list) {
          if (value.cur) {
            ids.push(value.id);
          }
        }

        return ids;
      }

      function curList(list, id) {
        angular.forEach(list, function (value, key) {
          if (value.id == id) {
            value.cur = !value.cur;
          }
        });
      }

      function clearCur(list) {
        angular.forEach(list, function (value, key) {
          value.cur = false;
        });
      }

      return {
        initMutiSelected: initMutiSelected,
        getInQueryFormMutilSelected: getInQueryFormMutilSelected,
        curList: curList,
        clearCur: clearCur
      };
    });
})();
