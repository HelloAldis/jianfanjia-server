define(['jquery'], function($){
	var Budget = function(id){
		this.id = id;
		console.log('1', this.id)
	}
	Budget.prototype = {
		init : function(){
			this.container = $(this.id);
			this.bindArea();
			this.bindEvent();
			this.bindClick();
			this.toStep2();
			this.toStep3();
			this.toStep4();
			this.toStep5();
		},
		
		bindArea : function () {
			var self = this;
			$(this.container).on('focus', '.item-area .input', function (ev) {
				ev.preventDefault();
			}).on('blur', '.item-area .input', function (ev) {
				ev.preventDefault();
				self.getArea($($('.item-area .input')[0]).val());
			})
		},
		bindEvent : function () {
			var self = this,
			timer = null,
			bian = true;
			this.container.on('mouseenter','.k-select',function (ev){
				ev.preventDefault();
				if(bian){
					$(this).parent('li').find('.user').show().css({'opacity':0}).animate({top: 56,'opacity':1});
				}
			}).on('mouseleave','.k-select',function(ev){
				ev.preventDefault();
				var This = $(this);
				timer = setTimeout(function(){
					This.parent('li').find('.user').hide().css({'opacity':0,'top':132});
				}, 300);
			}).on('mouseenter','.user',function(ev){
				ev.preventDefault();
				clearTimeout(timer);
				bian = false;
			}).on('mouseleave','.user',function(ev){
				ev.preventDefault();
				bian = true;
				$(this).parent('li').find('.user').hide().css({'opacity':0,'top':132});
			});
		},
		// 选择几室几厅...
		bindClick : function () {
			var self = this;
			$(this.container).on('click','.user li',function (ev) {
				ev.preventDefault();
				var selectNode = $($(this).parents('li')[0]).find('.k-select')[0];
				// $($(this).parents('.user')[0]).find('li').siblings('.selected').removeClass('selected');
				$(selectNode).html($(this).html());
				// $.ajax({
				// 	url: '/api/v2/web/signout',
				// 	type: 'POST',
				// 	dataType: 'json',
				// 	contentType : 'application/json; charset=utf-8'
				// })
				// .done(function(res){
				// 	if(res.msg === "success"){
				// 		window.location.href = "/"
				// 	}
				// })
			});
		},
		toStep2 : function () {
			var self = this;
			$(this.container).on('click', '.step1 .get-budget', function (ev) {
				ev.preventDefault();
				var bedroomNum = $('#j-house-shi').html();
				var liveRoomNum = $('#j-house-ting').html();
				var kitchenRoomNum = $('#j-house-chu').html();
				var washRoomNum = $('#j-house-wu').html();
				if (bedroomNum > 1) {
					$(this).parents('.g-compute').find('.step1').addClass('hide');
					$(this).parents('.g-compute').find('.step2').removeClass('hide');
					$(this).parents('.g-compute').find('.step2 .room').html(bedroomNum);
					$(this).parents('.g-compute').find('.step2 .live-room').html(liveRoomNum);
					$(this).parents('.g-compute').find('.step2 .kitchen-room').html(kitchenRoomNum);
					$(this).parents('.g-compute').find('.step2 .wash-room').html(washRoomNum);
					$(this).parents('.g-compute').find('.step2 .other-room').html(bedroomNum-1);
					showOtherRoom(bedroomNum);
					chooseOtherRoom(bedroomNum);
				} else {
					$(this).parents('.g-compute').find('.step1').addClass('hide');
					$(this).parents('.g-compute').find('.step3').removeClass('hide');
				}
			});
			// 展示另外的房间
			showOtherRoom = function (bedroomNum) {
				if (bedroomNum == 2) {
					$('.step2 .live-room2').hide();
					$('.step2 .child-room2').hide();
					$('.step2 .list').width(670);
					console.log('11')
				}
			}
			// 安排另外的房间
			chooseOtherRoom = function (bedroomNum) {
				$('.step2 li').on('click', function (ev) {
					ev.preventDefault();
					if ($(this).hasClass('active')) {
						$(this).removeClass('active');
					} else if (!$(this).hasClass('active') && $('.step2 li').siblings('.active').length < bedroomNum-1) {
						$(this).addClass('active');
					}
				})
			}
		},
		toStep3 : function () {
			var self = this;
			$(this.container).on('click', '.step2 .next', function (ev) {
				ev.preventDefault();
				$(this).parents('.g-compute').find('.step2').addClass('hide');
				$(this).parents('.g-compute').find('.step3').removeClass('hide');
				chooseDecStyle();
			});
			// 选择装修风格
			chooseDecStyle = function () {
				$('.step3 li').on('click', function (ev) {
					ev.preventDefault();
					if ($(this).hasClass('active')) {
						$(this).removeClass('active');
					} else if (!$(this).hasClass('active') && $('.step3 li').siblings('.active').length < 3) {
						$(this).addClass('active');
					}
				})
			}
		},
		toStep4 : function () {
			var self = this;
			$(this.container).on('click', '.step3 .generate', function (ev) {
				ev.preventDefault();
				$(this).parents('.g-compute').find('.step3').addClass('hide');
				$(this).parents('.g-compute').find('.step4').removeClass('hide');
			});


			// 生成预算清单
			// $(this.id).on('click', '.get-budget', function (ev) {
			// 	ev.preventDefault();
			// 	var data = {
			// 		"phone":"18107218585",
			// 		"living_room_count":2,
			// 		"kitchen_count":1,
			// 		"washroom_count":2,
			// 		"extra_bedroom_count":1,
			// 		"child_bedroom_count":1,
			// 		"study_room_count":0,
			// 		"cloakroom_count":0,
			// 		"dec_styles":["2", "3"],
			// 		"house_area":100
			// 	}
			// 	$.ajax({
			// 		url: '/api/v2/web/generate_quotation',
			// 		type: 'POST',
			// 		dataType: 'json',
			// 		contentType : 'application/json; charset=utf-8',
			// 		data : JSON.stringify(data)
			// 	})
			// 	.done(function(res){
			// 		if(res.msg === "success"){
			// 			console.log('success');
			// 			// window.location.href = "/"
			// 		}
			// 	})
			// });
		},
		toStep5 : function () {
			var self = this;
			
			$(this.container).on('click', '.step4 .submit', function (ev) {
				ev.preventDefault();

				// 验证手机号
				if (isMobile($(this).parents('.g-compute').find('.step4 .item-phone input').val())) {
					console.log('true')
				} else {
					$(this).parents('.g-compute').find('.step4 .content p').removeClass('hide');
					return false;
				}

				$(this).parents('.g-compute').find('.step4').addClass('hide');
				$(this).parents('.g-compute').find('.step5').removeClass('hide');

				var room = {
					phone: $('.step4 .item-phone input').val(),
					extra_bedroom_count : 0,    // 次卧
					child_bedroom_count: 0,
					study_room_count: 0,
					cloakroom_count: 0,					// 衣帽间
					living_room_count: $('#j-house-ting').html(),
					kitchen_count: $('#j-house-chu').html(),
					washroom_count: $('#j-house-wu').html(),
					extra_bedroom_count: 1,
					house_area: $('.step1 .item-area input').val(),
					dec_styles: []
				};
				console.log('area', room.house_area)

				// 选择的其他房间名称
				var otherRoomArr = $(this).parents('.g-compute').find('.step2 li').siblings('.active');
				otherRoomArr.each(function () {
					var roomName = $(this).find('.text p').text();
					addRoomNum(roomName, room);
					// console.log(addRoomNum(roomName, room));
				})

				// 选择的装修风格
				var decStyleArr = $(this).parents('.g-compute').find('.step3 li').siblings('.active');
				decStyleArr.each(function () {
					var decStyleName = $(this).find('.text p').text();
					console.log(getDecStyleToNum(decStyleName, room));
				})
				getBudget(room);
			});

			// 验证手机号
			isMobile = function (mobile) {
				return /^(13[0-9]{9}|15[012356789][0-9]{8}|18[0123456789][0-9]{8}|147[0-9]{8}|170[0-9]{8}|177[0-9]{8})$/.test(mobile);
			}

			// 选择其他房间数量
			addRoomNum = function (name, room) {
				switch(name) {
					case '次卧':
					room.extra_bedroom_count++;
					break;
					case '儿童房':
					room.child_bedroom_count++;
					break;
					case '书房':
					room.study_room_count++;
					break;
					case '衣帽间':
					room.cloakroom_count++;
					break;
				}
				return room;
			}

			// 装修风格转换为传入后台的数字
			getDecStyleToNum = function (name, room) {
				console.log('name', name);
				switch(name) {
					case '欧式':
					room.dec_styles.push(0);
					break;
					case '中式':
					room.dec_styles.push(1);
					break;
					case '现代':
					room.dec_styles.push(2);
					break;
					case '地中海':
					room.dec_styles.push(3);
					break;
					case '美式':
					room.dec_styles.push(4);
					break;
					case '东南亚':
					room.dec_styles.push(5);
					break;
					case '田园':
					room.dec_styles.push(6);
					break;
				}
				return room;
			}

			// 生成预算清单
			getBudget = function (roomData) {
				console.log('清单', roomData);
				// $.ajax({
				// 	url: '/api/v2/web/generate_quotation',
				// 	type: 'POST',
				// 	dataType: 'json',
				// 	contentType : 'application/json; charset=utf-8',
				// 	data : JSON.stringify(roomData)
				// })
				// .done(function(res){
				// 	if(res.msg === "success"){
				// 		console.log('success');
				// 		// window.location.href = "/"
				// 	}
				// })
			}
		},
		// 获取面积
		getArea : function (areaNum) {
			var self = this;
			console.log(areaNum);
			if (areaNum <=79) {
				self.setRoomFromArea(1, 1, 1);
			} else if (areaNum >= 80 && areaNum <= 99) {
				self.setRoomFromArea(2, 1, 1);
			} else if (areaNum >= 100 && areaNum <= 119) {
				self.setRoomFromArea(3, 1, 2);
			} else if (areaNum >= 120 && areaNum <= 159) {
				self.setRoomFromArea(4, 1, 2);
			} else {
				self.setRoomFromArea(4, 2, 2);
			} 
			return false;
		},
		// 根据面积设置室、厅、卫
		setRoomFromArea : function (bedroom, livingRoom, washroom) {
			$('#j-house-shi').html(bedroom);
			$('#j-house-ting').html(livingRoom);
			$('#j-house-wu').html(washroom);
			return false;
		}
	}
	return Budget;
});
