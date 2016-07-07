# jyz-server

角色 role:
* 0. 管理员
* 1. 业主
* 2. 设计师
* 3. 监理

性别 sex:
* 0. 男
* 1. 女
* 2. 不限

装修类型 dec_type:
* 0. 家装
* 1. 商装
* 2. 软装

包工类型 work_type:
* 0. 设计＋施工(半包)
* 1. 设计＋施工(全包)
* 2. 纯设计

装修风格 dec_style:
* 0. 欧式
* 1. 中式
* 2. 现代
* 3. 地中海
* 4. 美式
* 5. 东南亚
* 6. 田园

设计费报价 design_fee_range
* 0. 50－100
* 1. 100-200
* 2. 200－300
* 3. 300以上

户型 house_type:
* 0. 一居
* 1. 二居
* 2. 三居
* 3. 四居
* 4. 复式
* 5. 别墅
* 6. LOFT
* 7. 其他

装修流程 process section
* 0. 开工
* 1. 拆改
* 2. 水电
* 3. 泥木
* 4. 油漆
* 5. 安装
* 6. 竣工
* 7. 量房

流程状态 section status
* 0. 未开工
* 1. 进行中
* 2. 已完成
* 3. 改期申请中
* 4. 改期同意
* 5. 改期拒绝

预约方案状态 plan status
* 0. 已预约但没有响应
* 1. 已拒绝业主
* 7. 设计师无响应导致响应过期
* 2. 已响应但是没有确认量房
* 6. 已确认量房但是没有方案
* 8. 设计师规定时间内没有上场方案，过期
* 3. 提交了方案
* 4. 方案被未中标
* 5. 方案被选中
* 9. 业主选定方案后，未上传方案的设计师都是过期状态

认证状态 包括基本信息认证(auth_type) 身份认证(uid_auth_type) 邮箱认证(email_auth_type) 工地认证(work_auth_type)
* 0. 未提交认证
* 1. 提交认证还未审核过
* 2. 审核通过
* 3. 审核不通过
* 4. 违规屏蔽

作品认证状态 auth_type
* 0. 未审核
* 1. 审核通过
* 2. 审核不通过
* 3. 违规屏蔽

设计师沟通类型 communication_type
* 0. 不限
* 1. 表达型
* 2. 倾听型

同意入住协议 agreee_license
* 0. 没有
* 1. 有

推送消息类型 message_type
* 0. 延期提醒
* 1. 采购提醒
* 2. 付款提醒

用户反馈来自的客户端
* 0. Android 业主
* 1. iOS 业主
* 2. Android 设计师
* 3. iOS 设计师

需求状态 requirement status
* 0. 未预约任何设计师
* 1. 预约过设计师但是没有一个设计师响应过
* 2. 有一个或多个设计师响应但没有人量完房
* 6. 有一个或多个设计师量完房但是没有人上传方案
* 3. 有一个或多个设计师提交了方案但是没有选定方案
* 4. 选定了方案但是还没有配置合同
* 7. 配置了合同但是没有配置工地
* 5. 配置了工地
* 8. 工地已经完工

在线状态 online_status
* 0. 在线
* 1. 离线

评论类别 topictype
* 0. 方案的评论
* 1. 装修流程的小点的评论
* 2. 日记评论

匿名选项 is_anonymous
* 0. 不匿名
* 1. 匿名

更新类型
* 0. 自愿更新
* 1. 强制更新

文章类型 articletype
* 0. 装修攻略
* 1. 小贴士

文章状态
* 0. 外部不可见
* 1. 外部可见

装修美图状态
* 0. 外部不可见
* 1. 外部可见

装修直播 share 的进程 progress
* 0. 进行中
* 1. 已完成

直播流程 process name的值
* 0. 量房
* 1. 开工
* 2. 拆改
* 3. 水电
* 4. 泥木
* 5. 油漆
* 6. 安装
* 7. 竣工

装修阶段 dec_progress
* 0. 我想看一看
* 1. 正在做准备
* 2. 已经开始装修

商装类型 business_house_type
* 0. 餐厅
* 1. 服装店
* 2. 酒吧
* 3. 美容院
* 4. 办公室
* 5. 美发店
* 6. 幼儿园
* 7. 酒店
* 9999. 其它

装修美图 空间类型 直接使用文字
厨房
客厅
卫生间
卧室
餐厅
书房
玄关
阳台
儿童房
走廊
储物间

业主的消息类型 user_message_type
* 0. 设计师提出改期提醒
* 1. 采购提醒
* 2. 付款提醒
* 3. 验收提醒
* 4. 平台通知
* 5. 方案评论
* 6. 装修小节点评论
* 7. 设计师响应
* 8. 设计师拒绝
* 9. 设计师上传了方案
* 10. 设计师配置了合同
* 11. 设计师拒绝改期
* 12. 设计师同意改期
* 13. 设计师提醒业主确认量房
* 14. 日记评论

设计师的消息类型 designer_message_type
* 0. 改期提醒
* 1. 采购提醒
* 2. 平台通知
* 3. 方案评论
* 4. 装修小节点评论
* 5. 基本信息审核通过
* 6. 基本信息审核不通过
* 7. 身份证和银行卡审核通过
* 8. 身份证和银行卡审核不通过
* 9. 工地审核通过
* 10. 工地审核不通过
* 11. 作品审核通过
* 12. 作品审核不通过
* 13. 作品违规被下线
* 14. 业主预约提醒
* 15. 业主确认量房提醒
* 16. 方案中标消息
* 17. 方案未中标消息
* 18. 业主确认合同消息
* 19. 业主拒绝改期
* 20. 业主同意改期
* 21. 业主对比验收完成工序

通知状态 message status
* 0. 未读
* 1. 已读

需求的包类型
* 0. 默认包
* 1. 365块每平米基础包
* 2. 匠心尊享包

设计师分类
* 0. 默认分类
* 1. 新锐先锋
* 2. 暖暖走心
* 3. 匠心定制

平台
* 0. 安卓
* 1. iOS
* 2. web
* 3. 微信
