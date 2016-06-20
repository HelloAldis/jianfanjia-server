/**
 * @author Aldis
 */
(function () {
  'use strict';

  angular.module('JfjAdmin.components')
    .directive('uploadImage', uploadImage);

  /** @ngInject */
  function uploadImage() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        maxImageCount: '='
      },
      templateUrl: 'app/components/uploadImage/uploadImage.html',
      link: function ($scope, $el, $att) {
        console.log($el);
        console.log($att);
        let queueList = $el.find('div.queueList');
        let paste = $el.find('div.uploader');
        let statusBar = $el.find('div.statusBar');
        let placeholder = $el.find('div.placeholder');
        console.log(placeholder);
        let fileCount = 0;
        let fileSize = 0;
        // 优化retina, 在retina下这个值是2
        let ratio = window.devicePixelRatio || 1;
        // 缩略图大小
        let thumbnailWidth = 110 * ratio;
        let thumbnailHeight = 110 * ratio;

        // 实例化
        $scope.uploader = WebUploader.create({
          pick: {
            id: $el.find('div.filePicker'),
            label: '点击选择图片'
          },
          formData: {
            uid: 123
          },
          dnd: queueList,
          paste: paste,
          chunked: false,
          chunkSize: 512 * 1024,
          server: '../../server/fileupload.php',
          // runtimeOrder: 'flash',

          accept: {
            title: 'Images',
            extensions: 'jpg,jpeg,png',
            mimeTypes: 'image/*'
          },

          // 禁掉全局的拖拽功能。这样不会出现图片拖进页面的时候，把图片打开。
          disableGlobalDnd: true,
          fileNumLimit: $scope.maxImageCount,
          fileSizeLimit: 20 * 1024 * 1024, // 30 M
          fileSingleSizeLimit: 3 * 1024 * 1024 // 3 M
        });

        $scope.uploader.onFileQueued = function (file) {
          fileCount++;
          fileSize += file.size;
          if (fileCount === 1) {
            // queueList.remove('div.placeholder');
            placeholder.addClass('element-invisible')
            statusBar.removeClass('element-invisible');
          }

          console.log(fileCount);
          addFile($scope.uploader, file);
        };

        // 当有文件添加进来时执行，负责view的创建
        function addFile(uploader, file, thumbnailWidth, thumbnailHeight) {
          var $li = $('<li id="' + file.id + '">' +
              '<p class="title">' + file.name + '</p>' +
              '<p class="imgWrap"></p>' +
              '<p class="progress"><span></span></p>' +
              '</li>'),

            $btns = $('<div class="file-panel">' +
              '<span class="cancel">删除</span>' +
              '<span class="rotateRight">向右旋转</span>' +
              '<span class="rotateLeft">向左旋转</span></div>').appendTo($li),
            $prgress = $li.find('p.progress span'),
            $wrap = $li.find('p.imgWrap'),
            $info = $('<p class="error"></p>'),

            showError = function (code) {
              switch (code) {
                case 'exceed_size':
                  text = '文件大小超出';
                  break;

                case 'interrupt':
                  text = '上传暂停';
                  break;

                default:
                  text = '上传失败，请重试';
                  break;
              }

              $info.text(text).appendTo($li);
            };

          if (file.getStatus() === 'invalid') {
            showError(file.statusText);
          } else {
            // @todo lazyload
            $wrap.text('预览中');
            uploader.makeThumb(file, function (error, src) {
              var img;

              if (error) {
                $wrap.text('不能预览');
                return;
              }

              if (isSupportBase64) {
                img = $('<img src="' + src + '">');
                $wrap.empty().append(img);
              } else {
                $.ajax('../../server/preview.php', {
                  method: 'POST',
                  data: src,
                  dataType: 'json'
                }).done(function (response) {
                  if (response.result) {
                    img = $('<img src="' + response.result + '">');
                    $wrap.empty().append(img);
                  } else {
                    $wrap.text("预览出错");
                  }
                });
              }
            }, thumbnailWidth, thumbnailHeight);

            percentages[file.id] = [file.size, 0];
            file.rotation = 0;
          }

          file.on('statuschange', function (cur, prev) {
            if (prev === 'progress') {
              $prgress.hide().width(0);
            } else if (prev === 'queued') {
              $li.off('mouseenter mouseleave');
              $btns.remove();
            }

            // 成功
            if (cur === 'error' || cur === 'invalid') {
              console.log(file.statusText);
              showError(file.statusText);
              percentages[file.id][1] = 1;
            } else if (cur === 'interrupt') {
              showError('interrupt');
            } else if (cur === 'queued') {
              $info.remove();
              $prgress.css('display', 'block');
              percentages[file.id][1] = 0;
            } else if (cur === 'progress') {
              $info.remove();
              $prgress.css('display', 'block');
            } else if (cur === 'complete') {
              $prgress.hide().width(0);
              $li.append('<span class="success"></span>');
            }

            $li.removeClass('state-' + prev).addClass('state-' + cur);
          });

          $li.on('mouseenter', function () {
            $btns.stop().animate({
              height: 30
            });
          });

          $li.on('mouseleave', function () {
            $btns.stop().animate({
              height: 0
            });
          });

          $btns.on('click', 'span', function () {
            var index = $(this).index(),
              deg;

            switch (index) {
              case 0:
                uploader.removeFile(file);
                return;
            }
          });

          $li.appendTo($queue);
        }
      }
    };
  }

})();
