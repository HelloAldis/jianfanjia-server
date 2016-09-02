(function () {
  'use strict';

  window.toggle = function (id) {
    var itemDetail = document.getElementById('itemDetail' + id);
    var itemMore = document.getElementById('itemMore' + id);
    if (itemDetail.className.match('open')) {
      itemDetail.className = "item-detail";
      itemMore.setAttribute('src', '/m/img/quotation/closed.png')
    } else {
      itemDetail.className = "item-detail-open";
      itemMore.setAttribute('src', '/m/img/quotation/opened.png')
    }
  }
})();
