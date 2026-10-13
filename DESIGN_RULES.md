# IELTS AI Vocabulary — Design Rules

> 版本：v0.1 正式页面与 AI Learning Assistant 视觉同步（2026-10-11）  
> 适用范围：Home、Daily Learning、Word Detail、Completion、Extra Session、Learning Plan Bottom Sheet、Vocabulary Pack Detail、Vocabulary List、Word Detail Browse Mode、AI Learning Assistant 及其当前已定义状态。  
> 本文只记录现有设计规则，不定义产品逻辑。出现差异时，视觉以最新 Figma 定稿及已经人工验收通过的正式页面为准，产品行为以 `PRODUCT_SPEC.md` 为准；旧视觉描述不得覆盖新定稿。

## 1. Design Direction

整体方向为 **Clean Learning UI + Playful Companion**：用清晰、安静的学习界面承载内容，以黑鹅 IP 提供适度陪伴感。

- 气质：简洁、年轻、温暖、有陪伴感。
- 游戏化：轻量、克制，用阶段节点、贴纸和庆祝状态提供反馈，不做复杂成就系统视觉。
- 主色关系：黑色与暖白占绝大部分面积；浅蓝、浅黄、粉色只做语义或情绪点缀。
- 品牌特征：大数字、大单词、黑色粗线/块面、明显圆角、少量 sticker/pill、扁平黑鹅 IP。
- 页面结构：优先依靠留白、字号、字重、色块与局部描边形成层级，不依赖大面积阴影。
- 禁止方向：SaaS Dashboard、传统教育机构风、Material 式组件堆叠、强科技感 AI 套路、3D 吉祥物。
- AI Learning Assistant 是唯一允许建立明显 AI 身份的页面，但仍须保持学习产品的克制、温暖与可读性。

## 2. Typography

### 2.1 字体原则

- 中文 UI：`Noto Sans SC`。
- 英文学习内容、纯拉丁字符与纯数字：`Inter`。这是 Figma 当前保留的特殊字体，不应自动替换为 Noto Sans SC。
- 字间距：当前文字统一为 `0%`。
- Figma 中多数文本使用 `Auto` 行高。开发时优先复现对应视觉高度；下表明确为像素值的行高必须按值实现。
- 不使用 PingFang SC、苹方或其他意外字体。

### 2.2 字体规格

| 角色 | 字体 | 字号 | 字重 | 行高 | 字间距 | 典型用途 |
| --- | --- | ---: | ---: | --- | --- | --- |
| Home 主标题 | Noto Sans SC | 34 | 900 Black | Auto | 0% | “下午好！” |
| Completion 主标题 | Noto Sans SC | 32 | 900 Black | Auto | 0% | “今日学习完成” |
| Extra 完成标题 | Noto Sans SC | 30 | 700 Bold | 40px | 0% | “这组也完成啦” |
| 核心数字 / Completion | Inter | 72 | 900 Black | Auto | 0% | 今日掌握数量 |
| 核心数字 / Streak | Inter | 64 | 900 Black | Auto | 0% | 连续学习天数 |
| 核心数字 / Home progress | Inter | 58 | 900 Black | Auto | 0% | 今日掌握主数字 |
| Daily Learning 单词 | Inter | 46 | 900 Black | Auto | 0% | 快速判断页当前单词 |
| Word Detail 单词 | Inter | 36 | 900 Black | Auto | 0% | 详情页词标题 |
| 页面模块主标题 | Noto Sans SC | 20 | 700 Bold | Auto | 0% | 今日学习、判断问题 |
| Section 标题 / 单位 | Noto Sans SC | 18 | 700 Bold | Auto | 0% | Word Detail section、streak“天” |
| Button | Noto Sans SC | 15 | 700 Bold | Auto | 0% | 主次 CTA、判断按钮 |
| 重点正文 | Noto Sans SC | 14 | 500 Medium | Auto | 0% | 中文释义 |
| 正文 | Noto Sans SC | 14 | 400 Regular | Auto | 0% | 欢迎副标题、常规说明 |
| 阅读正文 | Noto Sans SC | 13 | 400 Regular | 20px | 中文例句、AI 描述 |
| 辅助正文 | Noto Sans SC | 12 | 400 Regular | Auto | 0% | 搭配中文、说明文字 |
| 微型说明 | Noto Sans SC | 11 | 400 Regular | Auto | 0% | 来源、学习计划摘要 |
| 辅助状态 | Noto Sans SC | 11–13 | 500 Medium | Auto | 0% | 已掌握、阶段信息 |
| Tag / Chip | Noto Sans SC | 11 | 700 Bold | Auto | 0% | TODAY、新词、复习、当前 |
| 小型状态标签 | Noto Sans SC | 10 | 700 Bold | 13px | 0% | 成就或紧凑状态 |
| 英文例句 | Inter | 15 | 500 Medium | 22px | 0% | Example Sentences |
| 英文搭配 | Inter | 13 | 700 Bold | Auto | 0% | Collocations |
| 英文 Tag / 编号 | Inter | 11 | 700 Bold | Auto | 0% | Section 编号、英文 sticker |
| 音标 / Daily | Inter | 17 | 400 Regular | Auto | 0% | Daily Learning 音标 |
| 音标 / Detail | Inter | 16 | 400 Regular | Auto | 0% | Word Detail 音标 |
| Pack Detail 词包标题 | Noto Sans SC | 28 | 900 Black | Auto | 0% | 当前词包名称 |
| Pack Detail 学习数量 | Inter | 48 | 900 Black | Auto | 0% | `learnedWordCount` |
| Vocabulary List Header | Noto Sans SC / Inter | 18 | 700 Bold | Auto | 0% | 词包名称与 `learned / total` |
| Vocabulary List 单词 | Inter | 16 | 700 Bold | Auto | 0% | 连续词表中的英文单词 |
| AI Assistant Hero | Noto Sans SC | 28–32 | 900 Black | 1.2–1.3 | 0% | “嗨，我是你的 AI 学习助手” |
| AI Reply 标题 | Noto Sans SC | 16–18 | 700 Bold | Auto | 0% | AI badge、近义词辨析、能不能换？ |
| AI Reply 正文 | Noto Sans SC | 14 | 400–500 | 22px | 0% | 差异说明、互换性解释 |

> 规则：同一语义优先复用表中既有层级。不要为了单页“更丰富”增加新的字号或字重。

## 3. Color Tokens

| Token | 色值 / 表达 | 语义与使用 |
| --- | --- | --- |
| `color.primary.black` | `#11120F` | 主文字、主 CTA、强描边、已完成进度、品牌黑色块面 |
| `color.background.warm` | `#F8F4EA` | 页面暖白背景、暖色内容面，不等同于禁用态 |
| `color.surface` | `#FFFFFF` | 主内容 surface、Bottom Sheet、白色卡面 |
| `color.new.blue` | `#CDEFFF` | 新词、待学新词、Extra Session 新词、选中态浅底 |
| `color.review.yellow` | `#FFD12E` | 复习、streak 当前节点、按钮小型强调点，以及 Word Detail unknown 状态的 marker 高亮 |
| `color.review.yellow.soft` | `rgba(255, 209, 46, 0.38)` | 待复习进度；局部柔和复习标签可用现稿 `#FBE7A3` |
| `color.emotion.pink` | `#FF78A8` | IP 情绪、少量 sticker/彩纸，不承担核心功能语义 |
| `color.text.secondary` | `#4B4D47` | 次级正文与辅助说明 |
| `color.text.muted` | `rgba(75, 77, 71, 0.65)` | 来源、弱提示、低优先级元信息 |
| `color.border.strong` | `#11120F` | 主卡、选中项、按钮/图标强边界 |
| `color.border.subtle` | `rgba(17, 18, 15, 0.18)` | 分隔线、弱边框、未完成结构 |
| `color.divider` | `rgba(17, 18, 15, 0.16)` | 信息流分隔，不制造厚重卡片感 |
| `color.disabled.muted` | `rgba(75, 77, 71, 0.65)` | 不可用或弱化文本；结构弱化使用 `color.border.subtle` |
| `color.overlay` | `rgba(17, 18, 15, 0.22)` | Bottom Sheet 背景遮罩 |
| `color.ai.blue.soft` | 最新 AI Figma 的柔和蓝 | AI 身份、AI Reply 与局部强调；不表达新词状态 |
| `color.ai.blue.very-light` | 最新 AI Figma 的极浅蓝 | AI 页面低对比 surface 与回复背景 |
| `color.ai.lilac.soft` | 最新 AI Figma 的少量柔和淡紫 | Hero / avatar 附近的小面积氛围层，不承担功能状态 |

补充规则：

- 彩色面积必须明显小于黑、白、暖白面积。
- 业务页面中的浅蓝继续表达新词及其延伸状态；AI Assistant 中的柔和蓝专门表达 AI 身份，两者必须通过使用场景与 token 分离，不得互相代替。浅黄只表达学习、复习或当前阶段，不作为 AI 身份色；粉色只表达情绪。
- “认识 / 不认识”不得使用红绿的正确/错误语义。
- AI 页面允许极浅蓝、柔和蓝、少量淡紫及克制的蓝紫氛围层，用于 Hero、avatar、Reply header、badge 与小面积强调。
- 禁止强科技渐变、霓虹 glow、蓝紫发光边缘、粒子、赛博朋克、大面积高饱和蓝紫以及 SaaS AI Dashboard 视觉。不得将“允许柔和 AI 氛围”误解为全页蓝紫渐变。

## 4. Spacing System

### 4.1 基础网格

正式 spacing scale：`4 / 8 / 12 / 16 / 20 / 24 / 28 / 32 / 40 / 48 / 56 / 64`。

| 场景 | 当前规则 |
| --- | --- |
| 页面左右安全边距 | 20px |
| 页面顶部常用起点 | 20–24px，需同时满足系统安全区 |
| 标题 → 紧邻说明 | 4–8px |
| 标题 → 内容 | 12–16px |
| 常规列表 gap | 12px |
| 紧凑内容 gap | 4–8px |
| 模块内部 gap | 16–24px |
| Section 间距 | 20–32px；Word Detail 当前为 20px |
| 大区块间距 | 40–64px |
| Card padding | 16px 或 20px；主视觉卡通常 20px |
| Button padding | 高度 58px，左右至少 20px；内部图文 gap 12px |
| Equal judgment buttons | 165 × 58px，两按钮 gap 20px |
| Chip 常规 padding | 水平 12px / 垂直 4px |
| Bottom Sheet option padding | 16px |
| 图标 → 文字 | 8–12px |
| Progress → 说明 | 8–12px |

### 4.2 Spacing 使用规则

- 同语义组件必须共享相同 padding 和 gap。
- 不为了机械统一消灭层级：内部小间距、模块间距和大区块间距应保持不同节奏。
- 新增布局不得随意使用 13、15、18、22、27、30、34 等零散值。
- Figma 中保留的非 4pt 例外仅用于光学对齐、插画 overlap、紧凑 sticker 高度及底部锚定，见第 17 节。

## 5. Radius & Border

| Token / 组件 | Radius | Border |
| --- | ---: | --- |
| Primary Card / Streak | 28px | 2.5px `color.border.strong` |
| Main Card / Content Block | 20px | 0–1.5px，按信息层级使用 |
| Achievement Block | 18px | 2px `color.border.strong` |
| Small Card / Plan Option | 17px | 未选中 1px；选中 2px |
| Effective Note | 15px | 1px 弱边界 |
| Button | 19px | 主 CTA 无描边；次级/判断按钮按状态使用一致描边 |
| Back Button | 20px（40 × 40 圆形） | 1.5px `color.border.strong` |
| Chip / Tag | 999px | 0–1.5px，按标签类别决定 |
| Progress Track | 6px（高度 12px） | 无 |
| Bottom Sheet | 顶部左右 28px | 无外描边 |
| Divider | 0 | 1px `color.divider` |
| Pack Hero | 28px | 无描边 |
| Vocabulary Entry | 22px | 无描边；左侧 4px 黑色 accent |
| Coming Soon Pack | 20px | 无描边 |

原则：描边是品牌语言的一部分，但只应用于关键结构、交互边界和选中状态；不要给所有 surface 同时增加描边和阴影。

## 6. Buttons

### Primary CTA

- 黑底、白字、58px 高、19px 圆角；可带一个 10px 浅黄强调点。
- 用于：Home“开始/继续今日学习”、Word Detail“下一个单词”、Completion/Extra Complete“返回首页”、Learning Plan“保存计划”。
- 每屏原则上只有一个 primary CTA。

### Secondary CTA

- 白/暖白底配黑色描边，尺寸与同组主按钮保持一致。
- 用于可选、非紧迫的下一步；Home 完成态“再学一组”属于 bonus/optional learning，权重不得超过 streak。

### Equal-weight judgment buttons

- Daily Learning 的“认识 / 不认识”尺寸、背景和边框权重完全一致：165 × 58px，间距 20px。
- 只允许用文字或极轻微局部点缀区分，不用红/绿，不把“不认识”表达为错误。

### Text / lightweight action

- 用于“查看全部 3 条”“重新学习”“学习计划”等低频或补充操作。
- 不额外制造大卡或强色块；点击区域仍须满足至少 40 × 40px。

### Back button

- 40 × 40px、圆形、1.5px 黑色描边，图标居中。
- Daily Learning、Word Detail、Extra Session 保持同一组件，不在页面间重画。
- Daily Learning 点击 Back Button 后显示 Learn Exit Confirmation Modal；Back Button 本身的尺寸、位置与视觉不变。

## 7. Tags / Chips

| 类型 | 示例 | 属性 | 交互 |
| --- | --- | --- | --- |
| 信息标签 | 日期、TODAY、Section 01–04 | 中性或黑白；帮助定位内容 | 不可点击 |
| 状态标签 | TODAY DONE、新词、复习、当前，以及其他由 `PRODUCT_SPEC.md` 明确定义的状态 | 必须复用状态色与现有字重 | 默认不可点击，除非产品规格明确 |
| 内容标签 | 词性 `adj.`、source | 低视觉权重，辅助阅读 | 不可点击 |
| 可点击 Chip | Synonym chip | 白/浅底、明确边界或箭头感 | 可点击跳转时必须有交互态 |
| 设置选中态 | Learning Plan pending selection | 浅蓝选中底 + 黑色描边/圆点 | 选项本体可点击；不等同于已保存的“当前”计划 |
| 成就 / 状态 badge | 阶段完成、连续打卡 | 小面积、可用浅黄或粉色点缀 | 不可点击 |
| 装饰 sticker | LET'S GO 等 | 仅在有情绪价值且不重复信息时使用 | 不可点击 |

规则：

- 默认水平放置，不随意倾斜。
- 中文语义优先；不要为了装饰加入无意义英文标签。
- 新词统一浅蓝，复习统一浅黄；不得互换。
- Synonym chip 属于内容导航，不应与状态标签混用。
- “认识 / 不认识”不是 Word Detail 的常驻状态 Tag。Word Detail 不同时展示同名状态标签与操作按钮，避免用户混淆“当前状态”和“可点击操作”。
- 未来若其他页面需要显示“认识 / 不认识”标签，必须以 `PRODUCT_SPEC.md` 的具体交互规则为准。

## 8. Cards & Surfaces

### Primary card

- 用于 Home streak 等最高优先级模块。
- 允许明显黑色描边、大数字、IP overlap；每页数量严格控制。

### Content block

- 用于释义、搭配等需要聚合但不应成为“大卡片”的内容。
- 优先浅底、留白、divider；只在必要时使用轻描边。

### AI Learning Assistant / AI Reply

- Word Detail 中的 AI 入口与 Synonyms 在阅读顺序和视觉上关联；正式 AI 内容在独立 AI Learning Assistant 页面展示。
- AI Reply 具备清晰的对话回复语义，但整页不是自由聊天机器人：使用 avatar + reply card、AI badge +“近义词辨析”header、结构化差异、divider、“能不能换？”、互换性 badge 与 explanation。
- Loading、Success、Error 必须复用同一 reply card 结构与页面 shell，避免状态切换时整体重排。
- Success 下方的风险提示为低视觉权重辅助信息，不使用警告黄、错误红或强色背景。

### Bottom sheet option

- 350 × 84px、17px 圆角、16px padding、选项间 12px。
- 未选中 1px 描边；pending selection 使用 2px 黑色描边、浅蓝 55% 底色与 radio/check。“当前”只标记已经保存并生效的计划，不随 pending selection 移动。

### Achievement block

- 用于词包阶段完成等高于普通完成态、低于正式 Completion 的状态。
- 当前规格：18px 圆角、2px 黑色描边，可配小型 sticker 与轻庆祝 IP。

> 不要把每个 section、每条列表和每段文字都套入同一种白色圆角 Card。页面层级必须由不同 surface 语言共同完成。

## 9. Progress Components

### 统一颜色语义

- 已完成 / 已掌握：`color.primary.black`，视觉最强。
- 待学新词：`color.new.blue`。
- 待复习：`color.review.yellow.soft`。
- 进度 track 高度 12px、圆角 6px；分段边界清楚，不让待完成区域看起来像已完成。

### 各页面规则

- **Home 今日学习**：显示主 Daily Session 的已掌握 / 总数及新词、复习构成。Extra 不改变主计划分母。
- **7-stage streak nodes**：表示连续学习阶段，不是 Mon–Sun。完成节点为黑色；当前节点为浅黄并放大至 18px；未完成节点为 12px 黑色描边空心。
- **Daily Learning**：与 Home 使用同一 segmented bar；数值表示 `todayMastered / todayTotal`，不是浏览序号。
- **Word Detail**：延续当前 session 顶部进度，与 Daily Learning 同组件、同语义。
- **Extra Session**：独立显示本组进度，如 `2 / 5`；继续用浅蓝表示新词，不并入主计划 `18 / 18`。
- **Vocabulary List**：只表达当前词包首次学习完成度，即 `learnedWordCount / totalWordCount`。已完成段使用 `color.primary.black`，剩余 track 保持低权重；不得把待复习拆成第三段，也不得将 review pool 数量混入 progress。

## 10. IP Guidelines

### 角色结构

- 同一只黑鹅：黑色主体、橙色嘴与脚、圆胖体型、粗短但可见的脖子、头身分区明确。
- 扁平插画，不做 3D，不做极简线稿；表情可通过小圆眼、弯眼和视线变化表达。
- IP 是学习陪伴角色，不是主视觉游戏角色。任何页面都不能抢过单词、数字、学习状态或 CTA。

### 页面动作

- **Home**：挥手、探头或趴在 streak 卡边；表达欢迎与陪伴，并与卡片发生轻微互动。
- **Daily Learning**：坐在小书桌前学习；尺寸较小，位于判断区上方附近，不贴按钮、不暗示点击方向。
- **Word Detail**：轻量出现于 AI/辅助内容，使用阅读、思考或解释状态。
- **AI Learning Assistant**：继续使用同一黑鹅身份。Hero 黑鹅与 AI Reply avatar 可以有不同姿势和表情，用以区分“欢迎”与“正在回答”，但角色比例、头身结构和配色必须一致。允许柔和阴影与轻微体积感，不得变成真实 3D、塑料质感、写实高光/反射或新角色。
- **Vocabulary Pack Detail**：当前词包 Hero 只使用小型陪伴鹅和少量 sticker，作为轻装饰；不能抢过词包名称与学习数量。
- **Completion**：派对帽、张开翅膀、少量彩纸；是整套产品中情绪最强的 IP 状态。
- **词包阶段完成**：抱书、举小旗或轻撒花；庆祝强度低于 Completion。
- **Extra Session 完成**：轻松开心、点赞或抱书；不出现正式打卡与 streak 庆祝语义。

IP 与 sticker 可做 optical adjustment，但必须避免遮挡正文、进度和可点击控件。

## 11. Page Hierarchy

| 页面 | 第一视觉重点 | 第二视觉重点 | 辅助信息 | CTA |
| --- | --- | --- | --- | --- |
| Home | Streak：连续天数与阶段 | 今日学习进度 | 新词/复习构成、今日总掌握、并入今日学习区域的轻量学习计划入口 | 开始/继续；完成后可选“再学一组” |
| Daily Learning | 当前大单词 | “认识 / 不认识”判断区 | 音标、发音、类型标签、实际已掌握进度、轻量 IP | 两个同权重判断按钮 |
| Word Detail | 大单词与音标 | 中文释义与核心学习内容 | Collocations、Examples、Synonyms、AI Learning Assistant 入口、来源 | 下一个单词 |
| Completion | 今日学习完成 | 今日掌握数量 | 新词/复习、连续学习、累计打卡、庆祝 IP | 返回首页 |
| Extra Session | 当前大单词 | 本组独立进度与判断区 | “额外学习”身份、音标、发音、学习 IP | 同权重判断；完成后返回首页 |
| Learning Plan Sheet | 学习计划标题与当前选项 | 三个固定计划档位 | 下一次 session 生效说明 | 保存计划 |
| Vocabulary Pack Detail | 当前词包名称与 `learned / total` | 查看词表入口 | 英文副标题、学习计划辅助行、小鹅、其他词包 | 查看词表；学习计划为次级设置入口 |
| Vocabulary List | 词包名称与首次学习进度 | 可连续扫描的单词列表 | 中文核心释义、未学习/已学习/待复习状态 | 点击单词进入 Browse Mode |
| Word Detail Browse Mode | 大单词与音标 | 中文释义与浏览内容 | Collocations、Examples、Synonyms、AI 区域、浏览模式提示 | 返回 Vocabulary List；无学习流程 CTA |
| AI Learning Assistant | AI 助手身份与 Welcome / Hero | 自动生成的用户请求与 AI Reply | 当前词 Context、Success 风险提示 | Back；Error 时“再试一次”；底部 composer 禁用 |

Daily Learning 的退出确认是覆盖在 Learn 页面之上的临时 Modal 状态，不是独立页面，不改变上述页面层级。

## 12. Word Detail Rules

- Section 使用 `01 / 02 / 03 / 04` 编号体系，编号是阅读导航，不是装饰标签。
- “认识 / 不认识”属于产品数据层的真实学习状态。`know / unknown`、`todayMastered`、`dailyConsecutiveKnowCount`、review pool membership、Daily Session progress、Completion 统计、今日总掌握及长期复习逻辑仍由产品数据控制，具体行为以 `PRODUCT_SPEC.md` 为准；UI 是否显示文字标签不影响底层状态存在。
- Word Detail 不使用“认识”或“不认识”常驻状态 Tag，也不在同一界面同时放置同名状态标签与操作按钮。
- 认识状态：Word title 使用正常黑色文字，不额外显示“认识”Tag。
- 不认识（unknown）状态：Word title 仍使用黑色文字，并在文字后方显示 `color.review.yellow` 黄色 marker 作为视觉区分；不额外显示“不认识”Tag，也不把单词文字本身改成黄色。
- 黄色 marker 只是视觉表现层的状态提示，不是学习状态的数据来源。开发必须根据真实 learning state 决定是否显示 marker，不得通过页面是否存在 marker 反推或写回数据状态。
- 当 `PRODUCT_SPEC.md` 允许用户将已认识词重新加入学习时，右上角可显示轻量操作“↶ 不认识”或产品规格定义的等价文案。该元素属于 Action，不属于 Status Tag；当前词为 unknown 时是否显示，仍以 `PRODUCT_SPEC.md` 为准。
- 不做传统词典式密集表格；用标题、20px section gap、轻内容块和 divider 建立阅读节奏。
- 中文释义：词性 pill + 中文释义，避免复杂表格。
- Collocations：英文更强、中文第二层；使用轻内容块，不把每条搭配做成独立重卡。
- Example Sentences：信息流呈现，英文优先、中文次级、source 最弱；默认一条，多条通过“查看全部”展开。
- Synonyms：使用低彩度可点击 chip；不要铺满多色标签。
- AI Learning Assistant 入口：与 Synonyms 相邻并有视觉关联，但必须明确它通往独立 AI 学习空间；不得在 Word Detail 中伪装已生成的 AI 内容。
- 普通 Word Detail Divider 使用 1px 弱线；最新 Browse Mode 定稿中的 section divider 使用 2px `color.primary.black`，该状态按 Figma 精确稿执行。两者都不应演变为包围每个 section 的粗框。

### 12.1 Word Detail Browse Mode

- Browse Mode 复用正式 Word Detail 的标题、音标、发音、释义、搭配、例句、近义词与 AI 区域视觉，不重新设计另一套详情页。
- 顶部保留统一 Back Button，返回 Vocabulary List；右上角可使用低权重“浏览模式”提示。
- 隐藏 Session progress、学习状态操作、“认识 / 不认识”“重新学习”及“下一个单词”等学习流程专属控件。
- 内容区保留完整浏览信息和例句展开能力；Browse Mode 的只读业务边界以 `PRODUCT_SPEC.md` 为准。
- 页面底部必须保留设备 safe area 与明确留白，最后一个内容模块不能紧贴视口或滚动容器底部。

### 12.2 Vocabulary Pack Detail

- 页面角色是当前词包主页，不是设置页或数据 Dashboard。
- Hero 展示当前词包中文名称、英文副标题和 `learnedWordCount / totalWordCount`；数量使用真实数据，Figma 数字仅为排版示例。
- Hero 使用暖白 surface、28px 圆角且不使用粗黑外框。小鹅与粉/黄 sticker 仅作轻装饰。
- 不额外展示“已学习”“已完成首次学习”等重复说明，也不在当前词包 Hero 中增加 progress bar。
- “查看词表”是主要二级入口，使用独立暖白入口块、左侧黑色 accent 和右侧圆形箭头。
- Learning Plan 是 Hero 底部的辅助设置行，使用 divider、计划摘要和轻量 chevron；不得做成与查看词表同权重的大卡，也不显示“当前”标签。
- Other Packs 位于当前词包内容之后。Coming Soon 使用两列轻量暖白卡片、小型粉/黄 accent 和“即将开放”pill，不使用旧纵向重卡结构。
- 禁止恢复旧版粗黑框 Hero、额外 progress bar、重型设置卡或重复完成文案。

### 12.3 Vocabulary List

- Back Button 与其他二级页面统一为 40 × 40px、1.5px 黑色描边；Header 同时展示词包名称和实时 `learnedWordCount / totalWordCount`。
- Header 与首次学习 progress 组成固定顶部区域；长列表滚动时该区域吸顶，不随单词列表离开视口。
- 顶部 progress 只表达首次学习完成度，不拆分待复习，也不显示 Daily Session 的新词/复习构成。
- 列表采用连续信息流，不把每个单词包裹为 Card。标准行高为 68px，使用 1px divider 支持 100 条内容快速扫描。
- 每行只保留英文 `word`、中文核心释义和右侧状态；不增加干扰连续扫描的装饰箭头。
- 三种状态：
  - **已学习**：`color.primary.black` 底、白字；
  - **待复习**：`color.review.yellow.soft` 底、Primary Black 字；
  - **未学习**：低权重 Neutral / Warm 表达。若指定 Figma 状态稿使用轻量浅蓝 surface，则以该 Frame 的精确颜色为准，但视觉权重必须低于“已学习”。
- 状态 pill 统一为紧凑尺寸，不改变行高，不使用红绿正确/错误语义。
- 词表底部应保留 safe area 或渐隐缓冲，避免最后一行贴近设备边缘。

### 12.4 AI Learning Assistant

#### 页面层级与稳定 Shell

- 页面固定顺序为：Back → AI Welcome / Hero → Current Word Context → 系统自动生成的用户消息 → AI Reply → Success 风险提示 → 底部禁用 composer。
- 第一视觉重点是 AI 助手身份与 Hero；第二视觉重点是用户请求和 AI Reply；当前词与风险提示保持辅助层级。
- Loading、Success、Error 三态使用完全相同的外层结构、宽度、对齐与主要间距。状态变化只替换 AI Reply 内部内容，不使用全屏 loading、骨架屏或整页闪烁。
- 两个 Success Figma Frame 是同一 Success 页面在不同滚动位置的展示，不得实现为两个页面、路由或业务状态。

#### Hero 与 Current Word

- Hero 使用柔和蓝、极浅蓝、少量淡紫或克制蓝紫氛围建立 AI 身份；彩色面积不得压过正文阅读与 Reply。
- Hero 文案必须保持通用“AI 学习助手”身份，视觉上不得收缩成“近义词助手”单功能品牌。
- Current Word Context 是请求上下文提示，不应被设计成第二个 Word Detail Hero，也不得抢过 AI Welcome。

#### 自动用户消息与 AI Reply

- 自动生成的用户消息须明确属于系统代用户发起的学习请求，保留消息语义但不营造可继续自由聊天的输入预期。
- AI Reply 使用同一黑鹅的独立 reply avatar。Header 包含 AI badge 与“近义词辨析”，下方按顺序呈现各词差异、divider、“能不能换？”、互换性 badge 与 explanation。
- `yes / partial / no` 的 badge 必须以中文“可以互换 / 部分可以互换 / 不建议互换”呈现。不要自行扩展为正确/错误红绿体系。
- Success 风险提示“AI 内容可能存在偏差，请结合上下文判断。”位于 Reply 下方，可有轻量 info icon；不得使用警告条式视觉。

#### Loading / Error

- Loading 仅在 AI Reply 内容区显示“正在分析这些词的使用差异…”和 typing dots；Reply 外部内容保持稳定。
- Typing dots 使用错开的 opacity 与极小 scale 变化，循环约 1.2–1.5 秒；禁止 bounce、大幅位移、闪烁和 layout shift。`prefers-reduced-motion` 下改用轻微透明度变化或静态 dots。
- Error 保留 Hero、Current Word 与自动用户消息。Reply 内显示“暂时没生成出来”“请稍后再试”及“再试一次”；Retry 是该状态唯一主要操作。

#### Disabled Composer

- 页面底部保留禁用 composer，推荐文案“更多 AI 学习能力即将开放”。
- composer 不显示可用键盘态、发送按钮或可输入光标，不暗示多轮聊天、开放提问或 chatbot 能力。

## 13. Modal / Dialog Rules

### Learn Exit Confirmation Modal

该 Modal 用于用户从 Daily Learning 退出到 Home 前的轻量确认。视觉语义是“可惜、轻度挽留、明确进度会保留”，不是 destructive warning、danger alert 或 system error。

#### 尺寸与定位

- 标准视觉尺寸：300 × 380px，不随内容自由拉高。
- 在 viewport 中水平、垂直居中；常规移动设备上不得拉伸为宽屏 Dialog 或 Bottom Sheet。
- 极窄设备允许使用 `max-width: calc(100vw - 32px)` 作为安全限制，同时保持标准比例与居中关系。
- Modal 内部按 4pt Grid 组织，推荐节奏为：顶部 20–24px → IP 90–110px → 8–12px → 标题 → 8px → 说明 → 20–24px → 按钮行 → 底部 20–24px。

#### Surface 与 Overlay

- Modal 使用白色或现有暖白 surface，复用最接近的 Main Card / Modal 大圆角语言和轻阴影。
- 不同时叠加强描边与强阴影，不使用玻璃拟态、科技渐变、危险红色或警告黄。
- Overlay 为全屏半透明黑色遮罩；背景 Learn 页面仍可隐约辨认，但不可与 Modal 争夺视觉焦点。
- 不使用重度 blur、大面积黑屏、红色 overlay 或复杂动态背景。

#### 内容结构与文字

内容自上而下固定为：IP Illustration → 标题 → Supporting Copy → Action Buttons，整体居中。不得增加第三段说明、信息列表、warning icon 或额外状态标签。

- 标题“确定退出学习吗？”：Noto Sans SC、现有中文标题层级、Bold、Primary Black、居中；不得放大成警告标题。
- 说明“今天的学习进度会保留，你可以稍后继续。”：使用现有正文 / 辅助正文体系，颜色弱于标题，保持清晰自然行高；视觉上优先断为两行，不使用微型字号。

#### IP Illustration

- 使用现有同一只黑鹅：黑色主体、圆胖体型、橙色嘴和脚、粉色腮红，保持现有头身结构与角色身份。
- 风格继续为 flat illustration / soft dimensional；允许轻微层次与体积感，但不做真实 3D、vinyl / plastic toy、强反光、写实灯光或强 specular highlight。
- 情绪关键词为“可惜、舍不得、轻度挽留、不施压”。可以轻微垂眼、抿嘴、歪头、身体前倾并伸出一只翅膀，表达“真的要走了吗？”。
- 不使用眼泪、哭泣、崩溃、生气、强烈委屈、夸张悲伤或责备感。
- 视觉高度约 90–110px，完整位于 Modal 内，不遮挡正文和按钮，也不复杂 overlap 到 Modal 外。

#### Action Buttons

- 两个按钮横向同排、同高、baseline 对齐，间距使用 12px；顺序固定为左侧“退出学习”、右侧“继续学习”。
- 第一版优先等宽；若指定 Figma 需要轻微增强 Primary，宽度比例可约为 0.9 : 1.1，但不得形成悬殊尺寸。
- “退出学习”为 Secondary / Weak Action：白色或暖白浅底、轻描边、黑色或深灰文字；不得使用红色或 destructive style。
- “继续学习”为 Primary Action：复用现有黑底白字 Primary CTA 语言，视觉权重高于左侧按钮，但不使用动画、夸张尺寸或强烈颜色施压。
- 两个按钮继续使用现有 Button 字体与 radius。

#### Visual Priority 与限制

阅读顺序为：IP 情绪 → 标题 → 进度保留说明 → 继续学习 → 退出学习。IP 是情绪入口，但不能抢过标题和 CTA。

当前只定义 Modal Open 状态，不写死复杂动画。未来如需过渡，只允许轻量 fade、small scale 或 opacity；禁止 bounce、shake、强 spring、IP 大幅运动或警告式震动。

不得加入右上角关闭按钮、红色 warning icon、destructive red CTA、第三个按钮、“不再提醒”、倒计时、toast、checkbox、大面积警告黄、AI 风格渐变、Chatbot 视觉或 Bottom Sheet。

## 14. Page Shell System

Page Shell System 统一页面的滚动责任、持续可见区域与设备安全区，不改变页面现有视觉语言、内容层级、Back target、Navigation Intent 或业务状态。按页面语义使用以下三类 Shell，不把 Sticky Top + Sticky Bottom 机械应用到所有页面。

### 14.1 Standard Content Shell

适用于 Pack Detail、Vocabulary List，以及其他有 Back Button、但没有持续底部操作的普通内容页：

```text
Sticky Top Navigation
+
Scrollable Content
```

- Sticky Top 使用当前页面背景 / surface，与内容容器对齐，保持 Back Button 持续可见。
- 继续复用现有共享 Back Button：40 × 40px、圆形、1.5px 黑色描边、图标居中；不重新设计按钮。
- 顶部区域不做成新的重型传统 AppBar。可使用极轻 divider 或完整背景 surface 防止正文视觉穿透，不使用强 shadow。
- 内容通过与顶部实际高度匹配的 inset / padding 正确避让，不使用巨大 spacer。
- 优先使用 document/page scroll，不建立不必要的双层滚动。

### 14.2 Word Detail Shell

Learning Mode 结构为 Sticky Top Navigation / Progress + Scrollable Content + Sticky Bottom Primary CTA。顶部与底部都是当前 Word Detail route 的组成部分，不是全 App overlay。

- Sticky Top 继续沿用现有 Word Detail Header、Progress 与共享 Back Button，不重画视觉。
- 中间内容保持现有 Meaning、Collocations、Examples、Synonyms、AI Entry 的左右 padding、卡片和间距，只有一个主要纵向滚动区域。
- Bottom Action Surface 使用当前页面背景 / 暖白，按钮复用现有 Primary CTA，与内容容器左右对齐且不 full bleed。
- Bottom Action 可使用非常轻的 top separation；禁止强阴影、黑色底栏、glass effect 或 gradient toolbar。
- 使用 `env(safe-area-inset-bottom)` 避让 Home Indicator，不能压缩按钮本身。
- 内容区保留与 Bottom Action 实际占位匹配的 bottom inset，确保最后一个 section 完整可见；不以大块空白代替。
- 短内容时 CTA 仍位于 viewport 底部；长内容时 CTA 持续可见且正文自然滚动。
- Browse Mode 使用相同 Sticky Top 与内容视觉，但不渲染 Bottom Action Surface，不新增“下一个单词”。页面底部仍保留正常 safe area 与阅读留白。

### 14.3 AI Assistant Shell

AI Assistant 使用 Sticky Hero + Scrollable AI Content + Sticky Bottom Composer。

- Sticky Hero 是完整浅蓝 AI identity surface，包括 Back Button、Hero copy、Supporting Copy、IP Illustration 与现有背景视觉，不是只有 Back Button 吸顶。
- Hero 以自身完整背景遮挡下方 scrolling content；不让正文从 Hero 前方穿过，不增加强 shadow。
- 中间 AI Content 保留 Current Word、User Bubble、AI Reply、Disclaimer 的既有宽度、padding、card visual 与 spacing，本规则不重新设计内容。
- Composer 保持当前 disabled visual 与文案，使用自己的背景 surface 和 `env(safe-area-inset-bottom)`，持续位于 viewport 底部，不开放输入能力。
- 中间内容必须有与 Composer 实际高度匹配的 bottom inset，最后一段 Reply / Disclaimer 不得被遮挡。
- Loading、Success、Error 共用同一三层结构；Success Top / Scrolled 仅代表中间内容的不同滚动位置。
- 低高度 viewport 使用静态 responsive compression：适度减少 Hero vertical padding、IP size 与内部 gap；不得隐藏 IP、删除 Hero 文案、只保留 Back Button，或增加滚动折叠 Hero。

### 14.4 Safe Area、Viewport 与滚动责任

- Sticky Top / Sticky Hero 叠加 `env(safe-area-inset-top)`，避免 iPhone 刘海、Dynamic Island 与 PWA standalone 状态区遮挡；Desktop 不因此产生巨大顶部 padding。
- Sticky Bottom CTA / Composer 叠加 `env(safe-area-inset-bottom)`；按钮和 Composer 本体尺寸保持不变。
- 三类 Shell 至少满足 `min-height: 100dvh`，可滚动区域按 viewport 自动计算；禁止使用固定 `812px`、`844px`、`932px` 页面高度模拟设备。
- Standard Content Shell 优先 document/page scroll；Word Detail 只保留一个正文滚动区域；AI Assistant 允许一个明确的中间独立 scroll region。
- 禁止同一页面同时出现互相竞争的 document scroll、整页 inner scroll 与 section scroll。

### 14.5 Responsive 验收矩阵

至少覆盖：Mobile `375 × 667`、`390 × 844`、`430 × 932`；Tablet `768 × 1024`；Desktop `1280 × 800`、`1440 × 900`。

- Standard：Back Button 持续可见，内容未被顶部遮挡。
- Word Detail：Top 与 CTA 持续可见，正文可完整滚动且最后一段不被遮挡。
- AI Assistant：Hero、Content、Composer 三层同时成立，小高度设备仍有合理中间阅读空间。

### 14.6 Page Mapping

| Page | Shell |
|---|---|
| Home | Existing Home Shell |
| Learn | Existing Learning Shell；现有布局保持 |
| Pack Detail | Standard Content Shell |
| Vocabulary List | Standard Content Shell |
| Word Detail Learning | Word Detail Shell |
| Word Detail Browse | Word Detail Shell without Bottom CTA |
| AI Assistant | AI Assistant Shell |
| Completion | Existing Completion Shell |
| Extra Complete | Existing Completion-style Shell |

Home 不增加 Back，Completion 不增加普通 Back 或普通 Sticky CTA。Sticky Top、Sticky Bottom 与 Sticky Hero 必须保留在当前 route 的 NavigationShell 内，并作为统一 page surface 参与 Forward / Back / Flow 转场，不得成为跨路由全局 Overlay。

## 15. Navigation Motion

Navigation motion 是统一的页面反馈层，不改变页面层级、内容或产品行为。具体导航类型与目标以 `PRODUCT_SPEC.md` 的 Global Navigation Motion 及 Route Motion Matrix 为准。

### 15.1 Forward Transition

进入更深层页面时，新页面从右侧进入正常位置：`translateX(100%) → 0`。原页面从 `0` 向左轻微退后，建议约 `-10% ～ -15%`，不高速完整飞出。该组合用于建立“进入下一层”的空间方向感。

### 15.2 Back Transition

返回上一层时，当前页面从 `0 → 100%` 向右离开；上一层页面从约 `-10% ～ -15% → 0` 恢复。Forward 与 Back 必须保持成对且方向一致，不允许各页面自行定义相反方向。

### 15.3 Duration 与 Easing

- 页面转场推荐 `220–280ms`，优先约 `240–260ms`，除非后续体验验证有明确依据，否则不得超过 `350ms`。
- 使用自然、快速收敛的 ease-out 或产品统一的 standard mobile easing；点击后必须立即产生反馈，尾部自然减速。
- 若项目已有 motion token，优先复用，不新增多套 easing。
- 禁止 `500ms+` 慢动画、bounce、夸张 spring、overshoot、强烈缩放或旋转。

### 15.4 Custom Edge Swipe Back 边界

**Custom Edge Swipe Back: Not implemented in current version.**

当前版本不定义或实现 interactive swipe、pointer/touch drag、edge trigger、distance/velocity threshold、跟手位移、释放完成、取消回弹或鼠标拖拽模拟手势。页面左右转场只服务于产品内 Back Button、CTA、Card、Link 等点击导航。

应用不得通过自定义视觉层主动拦截或覆盖 iOS Safari、Android 或浏览器提供的原生返回手势；原生返回行为不套用 App 自定义 drag visual。

### 15.5 Flow Exit 与 Flow Completion

Learn 是特殊 Flow Exit。点击 Learn Back Button 时先打开已有 Exit Confirmation Modal，不立即播放 route transition；点击“继续学习”只关闭 Modal，点击“退出学习”后才执行接近普通 Back 的 `flow-exit` 页面转场。

Modal 继续保持 center modal 视觉，可使用轻量 opacity fade 与极小 scale 进入，不作为横向滑入的 route page。Modal 的尺寸、Overlay、IP、渐变与按钮规则继续以第 13 节和最新 Figma 为准。

Completion / Extra Complete → Home 使用 `flow-completion`：采用轻量 fade 与 minimal horizontal motion，保持中性，不表现为返回未完成学习页，也不加入复杂庆祝转场。

### 15.6 Reduced Motion

必须支持 `prefers-reduced-motion`：

- 页面转场大幅减少水平位移，可改为极短 fade 或 minimal motion；
- 导航结果、返回目标与确认流程保持不变；
- Reduced Motion 不能移除 Back Button、CTA 或破坏导航可用性。

## 16. Bottom Sheet Rules

Learning Plan 使用 Bottom Sheet，不跳转独立设置页。

- 画板 390 × 844px；sheet 底部锚定，当前高度 634px，顶部左右圆角 28px。
- 背景遮罩：`color.overlay`。
- v0.1 设置层展示三档系统预设：轻量计划（新词 10 / 最多复习 20）、标准计划（新词 20 / 最多复习 40）、进阶计划（新词 30 / 最多复习 60）。当前版本不提供滑杆或自定义输入；未来配置能力以 `PRODUCT_SPEC.md` 为准。
- 已保存的 current plan 与本次 pending selection 必须视觉语义分离：打开时二者一致；临时选择其他项后，“当前”仍停留在 saved plan，selected/radio 跟随 pending selection。
- 选项：350 × 84px、16px padding、12px gap。
- 标题 → 副标题 4px；副标题 → 选项 16px；选项列表 → 生效说明 16px。
- 生效说明 350 × 64px，明确“若今日任务已生成，新计划从下一次 Daily Session 生效”。
- 保存 CTA：350 × 58px；与说明之间保留 64px；底部安全区 48px。
- 设置场景整体比 Home、Completion 更克制，默认不使用大型 IP。

## 17. Responsive / Layout Principles

- 当前移动端主画板：`390 × 844px`。
- 页面主内容最大宽度：`350px`。
- 左右安全边距：`20px`，核心页面保持一致。
- 窄于 390px 时优先保持 20px margin；若内容宽度不足，最小可降至 16px，但同屏必须一致。
- 宽于 390px 的移动设备保持内容居中，主内容默认不超过 350px；不要把单词、按钮和阅读行无限拉宽。
- 顶部和底部须叠加设备 safe area；Figma 中的视觉间距不是忽略系统安全区的理由。
- IP、手绘 sticker、彩纸、卡片探头和 overlap 元素允许光学调整，不强制机械对齐网格。
- 当前可接受的非 4pt 例外：
  - 23px / 27px 紧凑 sticker 高度：保持文字视觉居中与现有比例；
  - 17px / 19px 等圆角：来自已定稿组件外形，不属于 spacing scale；
  - 2.5px streak 描边与 1.5px 图标/节点描边：用于品牌粗线层级；
  - Bottom Sheet `y = 210px`：由 634px 高度底部锚定于 844px 画板所得；
  - IP 与 sticker 的少量非网格坐标：用于视觉重心、探头和手势 overlap。

## 18. Do / Don’t

### DO

- 保持每页第一、第二与辅助层级清楚。
- 复用颜色语义，尤其是新词浅蓝、复习浅黄、情绪粉。
- 复用既有 Button、Back、Tag、Progress、Card 与 Sheet option。
- 优先使用 4pt Grid 与 20px 页面边距。
- 保持充足留白，让大数字和大单词成为锚点。
- 让 IP 动作匹配页面语义，并与内容有轻微互动。
- 实现前同时核对正常态、进行态、完成态和特殊完成态。

### DON’T

- 新增无意义颜色或让多种彩色同时占据大面积。
- 在非 AI 页面滥用 AI 身份色，或用 Review Yellow 表达 AI 身份。
- 使用强科技渐变、霓虹 glow、蓝紫发光边缘、科技粒子、赛博朋克或大面积高饱和蓝紫。
- 把 AI Learning Assistant 做成 SaaS Dashboard、自由聊天机器人或多栏工具面板。
- 把黑鹅做成 3D、改变头身比例或在不同页面画成不同角色。
- 把所有内容都做成同尺寸、同阴影、同描边的卡片。
- 用红/绿表达“认识 / 不认识”。
- 为每个页面各自发明新组件或相同组件使用不同 padding。
- 为装饰加入无意义英文标签，或让英文标签比中文信息更抢眼。
- 把 Home、Word Detail 或 Completion 做成数据 Dashboard。

## 19. 文档职责与开发使用

- **`PRODUCT_SPEC.md`**：产品逻辑、数据与状态定义、交互规则、流程边界。
- **`DESIGN_RULES.md`**：视觉语言、颜色、字体、组件、版式、间距与 IP 使用规范。
- **Figma**：最终视觉稿、精确页面状态、插画资产与光学调整结果，是视觉实现的最终真源。

后续开发必须同时参考：

1. `PRODUCT_SPEC.md`：确认“做什么、何时变化”；
2. `DESIGN_RULES.md`：确认“如何统一呈现”；
3. 最新 Figma 与已经人工验收通过的正式页面：确认“最终长什么样及不同状态的具体差异”，优先级高于文档中的旧视觉描述。

若三者出现冲突：产品行为先回到 `PRODUCT_SPEC.md` 核对；视觉实现先回到 Figma 核对，并同步修订 `DESIGN_RULES.md`，不得由开发自行发明第四套规则。
