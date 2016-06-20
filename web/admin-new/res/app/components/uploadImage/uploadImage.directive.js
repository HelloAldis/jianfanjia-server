/**
 * @author Aldis
 */
(function () {
  'use strict';

  function UploadImageClient(obj) {
    this.container = $('#' + obj.id);
    this.queueList = this.container.find('div.queueList');
    this.paste = this.container.find('div.uploader');
    this.statusBar = this.container.find('div.statusBar');
    this.placeholder = this.container.find('div.placeholder');
    console.log(this.placeholder);
    this.filePicker = this.container.find('div.filePicker');
    // 图片容器
    this.filelist = $('<ul class="filelist"></ul>').appendTo(this.queueList);
    this.progress = this.statusBar.find('.progress').hide();
    // 上传按钮
    this.uploadBtn = this.container.find('.uploadBtn');

    this.maxImageCount = obj.maxImageCount;
    this.fileCount = 0;
    this.fileSize = 0;
    // 优化retina, 在retina下这个值是2
    this.ratio = window.devicePixelRatio || 1;
    // 缩略图大小
    this.thumbnailWidth = 110 * this.ratio;
    this.thumbnailHeight = 110 * this.ratio;
    // 所有文件的进度信息，key为file id
    this.percentages = {};
    // 可能有pedding, ready, uploading, confirm, done.
    this.state = 'pedding';
    // 文件总体选择信息。
    this.info = this.statusBar.find('.info');

    let self = this;

    this.webUploader = WebUploader.create({
      pick: {
        id: this.filePicker,
        label: '点击选择图片'
      },
      formData: {
        uid: 123
      },
      dnd: this.queueList,
      paste: this.paste,
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
      fileNumLimit: this.maxImageCount,
      fileSizeLimit: 20 * 1024 * 1024, // 30 M
      fileSingleSizeLimit: 3 * 1024 * 1024 // 3 M
    });


    this.webUploader.onFileQueued = function (file) {
      self.fileCount++;
      self.fileSize += file.size;
      if (self.fileCount === 1) {
        // queueList.remove('div.placeholder');
        self.placeholder.addClass('element-invisible')
        self.statusBar.removeClass('element-invisible');
      }

      console.log(self.fileCount);
      self.addFile(file);
    };

    this.webUploader.onFileDequeued = function (file) {
      self.fileCount--;
      self.fileSize -= file.size;

      if (!self.fileCount) {
        self.setState('pedding');
      }

      self.removeFile(file);
      self.updateTotalProgress();
    };
  }

  // 当有文件添加进来时执行，负责view的创建
  UploadImageClient.prototype.addFile = function (file) {
    var $li = $('<li id="' + file.id + '">' +
        '<p class="title">' + file.name + '</p>' +
        '<p class="imgWrap"></p>' +
        '<p class="progress"><span></span></p>' +
        '</li>'),

      $btns = $('<div class="file-panel"><i class="ion-close-circled"></i></div>').appendTo($li),
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
      this.webUploader.makeThumb(file, function (error, src) {
        var img;

        if (error) {
          $wrap.text('不能预览');
          return;
        }

        img = $('<img src="' + src + '">');
        $wrap.empty().append(img);
      }, this.thumbnailWidth, this.thumbnailHeight);

      this.percentages[file.id] = [file.size, 0];
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
        this.percentages[file.id][1] = 1;
      } else if (cur === 'interrupt') {
        showError('interrupt');
      } else if (cur === 'queued') {
        $info.remove();
        $prgress.css('display', 'block');
        this.percentages[file.id][1] = 0;
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
          this.webUploader.removeFile(file);
          return;
      }
    });

    $li.appendTo(this.filelist);
  }

  UploadImageClient.prototype.setState = function (val) {
    var file, stats;

    if (val === state) {
      return;
    }

    this.uploadBtn.removeClass('state-' + state);
    this.uploadBtn.addClass('state-' + val);
    state = val;

    switch (state) {
      case 'pedding':
        this.placeHolder.removeClass('element-invisible');
        this.filelist.hide();
        this.statusBar.addClass('element-invisible');
        this.webUploader.refresh();
        break;

      case 'ready':
        this.placeHolder.addClass('element-invisible');
        $('#filePicker2').removeClass('element-invisible');
        this.filelist.show();
        this.statusBar.removeClass('element-invisible');
        this.webUploader.refresh();
        break;

      case 'uploading':
        $('#filePicker2').addClass('element-invisible');
        this.progress.show();
        this.uploadBtn.text('暂停上传');
        break;

      case 'paused':
        this.progress.show();
        this.uploadBtn.text('继续上传');
        break;

      case 'confirm':
        this.progress.hide();
        $('#filePicker2').removeClass('element-invisible');
        this.uploadBtn.text('开始上传');

        stats = this.webUploader.getStats();
        if (stats.successNum && !stats.uploadFailNum) {
          setState('finish');
          return;
        }
        break;
      case 'finish':
        stats = this.webUploader.getStats();
        if (stats.successNum) {
          alert('上传成功');
        } else {
          // 没有成功的图片，重设
          state = 'done';
          location.reload();
        }
        break;
    }

    updateStatus();
  }

  UploadImageClient.prototype.updateStatus = function updateStatus() {
    let text = '';
    let stats;

    if (state === 'ready') {
      text = '选中' + fileCount + '张图片，共' +
        WebUploader.formatSize(fileSize) + '。';
    } else if (state === 'confirm') {
      stats = this.webUploader.getStats();
      if (stats.uploadFailNum) {
        text = '已成功上传' + stats.successNum + '张照片至XX相册，' +
          stats.uploadFailNum + '张照片上传失败，<a class="retry" href="#">重新上传</a>失败图片或<a class="ignore" href="#">忽略</a>'
      }

    } else {
      stats = this.webUploader.getStats();
      text = '共' + fileCount + '张（' +
        WebUploader.formatSize(fileSize) +
        '），已上传' + stats.successNum + '张';

      if (stats.uploadFailNum) {
        text += '，失败' + stats.uploadFailNum + '张';
      }
    }

    this.info.html(text);
  };

  UploadImageClient.prototype.fill = function () {

  };


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
        $scope.uploadImageClient = new UploadImageClient({
          id: $att.id,
          maxImageCount: $scope.maxImageCount
        });
      }
    };
  }

})();
