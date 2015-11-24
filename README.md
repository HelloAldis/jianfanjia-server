# jyz-server

角色 role:
* 0. 管理员
* 1. 业主
* 2. 设计师

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

平台 platform
* 0. Android
* 1. iOS

需求状态 requirement status
* 0. 未预约任何设计师
* 1. 预约过设计师但是没有一个设计师响应过
* 2. 有一个或多个设计师响应但没有人量完房
* 6. 有一个或多个设计师量完房但是没有人上传方案
* 3. 有一个或多个设计师提交了方案但是没有选定方案
* 4. 选定了方案但是还没有配置合同
* 7. 配置了合同但是没有配置工地
* 5. 配置了工地

在线状态 online_status
* 0. 在线
* 1. 离线

评论状态 conmmet status
* 0. 都已看过了
* 1. 需要业主看
* 2. 需要设计师看

评论类别 topictype
* 0. 方案的评论
* 1. 装修流程的小点的评论

匿名选项 is_anonymous
* 0. 不匿名
* 1. 匿名

更新类型
* 0. 自愿更新
* 1. 强制更新

文章类型 articletype
* 0. 装修攻略

文章状态
* 0. 外部不可见
* 1. 外部可见

装修美图状态
* 0. 外部不可见
* 1. 外部可见
