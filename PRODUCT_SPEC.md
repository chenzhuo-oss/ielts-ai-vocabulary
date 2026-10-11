# IELTS AI Vocabulary

## 1. Project Overview

IELTS AI Vocabulary 是一个面向 IELTS 学习者的词汇学习产品。

产品核心不是单次查词，而是建立完整学习闭环：

**Learn → Understand → Review**

基础、确定性的词汇知识由结构化词库提供；AI 只用于需要语境理解、语言判断和开放生成的任务。

项目同时作为一个真实可运行的 AI Product Design + Vibe Coding 项目，用于验证：

* AI / Non-AI 边界设计
* AI UX
* Prompt / Context / Structured Output
* AI Reliability
* Model Selection
* AI Evaluation
* 成本、延迟与稳定性取舍
* 从设计到真实产品实现的完整过程

---

## 2. Target Users

目标用户：

正在准备 IELTS、具有一定英语基础，但词汇存在“认识但没有真正理解和掌握”问题的学习者。

典型问题：

* 认识单词，但对真实语境理解不足
* 知道中文释义，但不知道不同近义词之间的区别
* 容易混淆含义相近或用法接近的词
* 背完单词后缺少持续复习机制
* 传统词典可以提供释义，但很难直接回答“这些近义词到底什么时候不能互换”

---

## Language & Localization

v0.1 面向中文 IELTS 学习者，默认界面语言为简体中文。

规则：

* 产品导航、按钮、状态、提示、说明文字默认使用简体中文
* AI 生成的解释、辨析说明默认使用中文
* 中文释义与例句翻译使用中文
* 英文只用于英语学习内容本身，包括：
  * 单词
  * 音标
  * 英文搭配
  * 英文真题例句
  * 必要的英文语言示例

界面文案使用：

* 今日学习
* 开始学习
* 学习进度
* 认识
* 不认识
* 常用搭配
* 真题例句
* 近义词
* 查看近义词辨析
* 学习完成
* 重试

不默认使用以下英文作为界面文案：

* Start Learning
* Know
* Unsure
* Don't Know
* Collocations
* Example Sentence
* Synonyms

产品整体保持：

**中文产品界面 + 英语学习内容 + 中文解释**

---

## 3. Product Principles

### 3.1 AI is an enhancement, not the product itself

AI 不负责所有内容。

产品能力按照以下三层划分：

### Structured Database

用于稳定、准确、需要保持一致性的内容，例如：

* Word
* Phonetic
* Part of Speech
* Chinese Definition
* Common Collocations
* IELTS Example Sentence
* Basic Synonyms

### Rule-based Logic

用于确定性产品行为，例如：

* 每日学习计划
* 学习进度
* 复习状态
* 打卡
* 学习统计
* 本地状态管理

### LLM

用于依赖上下文判断和开放生成的语言任务，例如：

* 同义词 / 易混词辨析
* 用户造句批改
* 句子扩写和表达优化

核心原则：

**Static knowledge → Database**

**Deterministic behavior → Rules**

**Context-dependent language tasks → LLM**

---

## 4. MVP v0.1 Goal

v0.1 的目标不是完成全部产品能力，而是先跑通最小学习闭环。

核心流程：

**Home → 主 Daily Session → Item 快速判断 → 保存状态 → Word Detail → 下一个 Item / Completion → 返回 Home**

用户能够：

1. 进入首页查看当天学习任务
2. 一次进入由今日复习词和今日新词共同组成的 Daily Learning Session
3. 查看当前 Item 类型和今日总进度、新词进度、复习进度
4. 在 Daily Learning 中快速判断自己是否认识当前单词，保存状态并进入当前单词的 Word Detail
5. 查看单词的结构化学习内容
6. 播放当前单词的英文发音
7. 在深入学习后，将误判为“认识”的单词通过“↶ 不认识”重新加入学习流程；不在详情页将 `unknown` 直接改为 `know`
8. 查看当前单词的基础近义词
9. 在存在预定义 synonym group 时，从 Word Detail 的 AI 入口进入独立的 AI Learning Assistant
10. 由系统自动发起结构化近义词辨析请求，理解多个近义词之间的关键差异与可互换性
11. 进入下一个 Item 的快速判断，直到所有今日 Item 均达到“今日掌握”
12. 主 Daily Session 的所有 Item 达到“今日掌握”后进入 Completion，并且只结算一次主计划完成记录
13. 返回首页看到主计划完成状态，并可在仍有新词时主动选择“再学一组”
14. 在 Home 查看当前 Vocabulary Pack 的首次学习进度，并进入词包详情与词表浏览

### Vocabulary Pack 产品模型

产品不将 vocabulary 视为唯一的全局词库，而采用以下层级：

**Vocabulary Pack → Words**

系统保存 `currentPackId`，表示当前正在学习的词包。每个 Vocabulary Pack 至少包含：

* `id`
* `name`
* `words`
* `totalWordCount`
* `availability`

`availability` 至少支持 `available` 与 `comingSoon` / `unavailable`。只有 `availability === available` 的词包可以成为 `currentPackId`、生成 Main Daily Session 或 Extra Session。

v0.1 唯一正式开放且拥有真实词汇数据的词包为：

* 名称：IELTS Core Vocabulary
* `id`：`ielts_core_v1`
* `availability`：`available`

其他词包可以在产品层展示“即将开放”或“暂未开放”，但不能真正切换、不能生成 Session，也不要求在 v0.1 准备第二套真实词汇数据。产品与数据边界仍按未来可支持多词包切换的结构定义。

首次学习进度、长期 review pool、stable mastery、Main Daily Session、Extra Session、学习计划与统计均必须归属于明确的 `packId`。未来切换词包时，每个词包保留自己的学习进度和学习计划，不得跨包混用状态。

---

## 5. MVP v0.1 Scope

### 5.1 Home

Home 是 Daily Learning 的入口与状态总览，v0.1 只保留“连续学习”和“今日学习”两个主要模块，不将连续学习、累计打卡、新词、复习和学习计划做成同等视觉权重的大卡片。

#### 第一层：连续学习激励

首页第一核心模块为“连续学习”，主要展示：

* 当前连续学习天数 `currentStreak`
* 7 格 streak 里程碑进度
* 当前距离下一个 7 天里程碑的阶段进度
* 累计打卡天数，作为次级信息

7 个节点表示连续学习 streak 的累计 7 天阶段，不表示周一至周日，也不表示自然周进度。

阶段进度通常为：

`stageProgress = currentStreak % 7`

如果 `currentStreak` 恰好为 7、14、21 等 7 的整数倍，当前阶段显示完整的 `7 / 7`，而不是 `0 / 7`。例如 `currentStreak = 9` 时，表示已经完成一个 7 天阶段，当前阶段进度为 `2 / 7`。

每个已完成节点只在对应自然日的完整 Daily Session 完成后产生。打开 App、开始学习或完成单个词都不能增加 streak 或产生打钩。

“累计打卡”并入连续学习模块，以“累计打卡 18 天”或“累计完成 18 天”等次级文案展示，其视觉层级明显低于 `currentStreak`。v0.1 暂不扩展复杂勋章或成就系统。

#### 第二层：今日学习

“今日进度”和“今日任务”合并为一个模块。主指标为：

**已掌握 X / 今日总任务数**

同时显示“还剩 X”。完成判断继续以各 Item 的 `todayMastered` 为准。

今日学习使用一条分段进度条表达任务构成，包含三段：

1. **已掌握**
2. **待学新词**
3. **待复习**

已完成部分统一合并为“已掌握”，不再区分已完成的新词和已完成的复习词。只有未完成任务继续区分“待学新词”和“待复习”。

进度条下方使用轻量图例展示，例如：

* 已掌握 8
* 待学新词 12
* 待复习 4

不再为“新词 6 / 20”和“复习 2 / 4”等数据分别建立大面积卡片。待复习数量必须来自当天实际生成且尚未完成的 Review Item，不能显示学习档位中的复习上限。

今日主操作继续位于该模块：

* 未开始：显示“开始今日学习”
* 进行中且仍有未掌握 Item：显示“继续今日学习”
* 所有 Item 的 `todayMastered === true`：显示“今日学习已完成”，不再显示开始或继续按钮

主 Daily Session 完成后，Home 保留主计划的完成进度，例如“今日计划已完成，24 / 24”。该分子和分母只统计主 Daily Session，后续 Extra Session 不得将它改写为 `29 / 29`，也不得重新打开主 Daily Session。

Home 在主计划完成态中区分并可展示：

* **今日计划完成进度**：仅统计主 Daily Session，例如 `24 / 24`
* **今日总掌握量**：主 Daily Session 已掌握数量 + 当天所有 Extra Session 已掌握数量，例如 `29 个`
* **额外学习数量**：当天 Extra Session 实际掌握数量，例如 `5 个`

如果仍有尚未学习的新词，Home 可以在主计划完成态提供“再学一组”入口；该入口不放在 Completion 页面。没有可用新词时隐藏“再学一组”。

#### 当前词包摘要

“今日学习”模块内展示 Current Vocabulary Pack Summary，提供当前学习上下文：

* 当前词包名称
* 已学习 `learnedWordCount / totalWordCount`
* 进入 Vocabulary Pack Detail 的入口

例如：

**IELTS 核心单词　63 / 100　〉**

这里的 `63` 是当前词包中已经完成首次新词学习的唯一 wordId 数量，`100` 是当前词包总词数。该摘要是今日学习的上下文信息，不属于今日 Session progress，不得与“已掌握 X / 今日总任务数”混为同一指标。

Home 不再保留独立“学习计划”模块，也不直接展开或配置轻量、标准、进阶三个 Preset Plan。学习计划入口迁移至 Vocabulary Pack Detail。

第一版不展示周趋势、学习时长、词汇量预测、正确率、周报、AI 推荐、成就系统、热力图或社交功能。

---

### 5.2 Vocabulary Pack Detail

Vocabulary Pack Detail（词包详情页）用于查看和管理当前词包，至少包含：

* 当前词包名称
* 已学习 `learnedWordCount / totalWordCount`
* 当前词包首次学习进度
* “查看词表”入口
* 当前学习计划
* 修改学习计划入口
* 其他词包列表
* 未开放词包的“即将开放 / 暂未开放”状态

只有 `available` 的词包允许成为 `currentPackId`。未开放词包可以展示，但不可切换、不可生成 Daily Session。

现有 Learning Plan Bottom Sheet 保留，入口从 Home 迁移至词包详情页。Bottom Sheet 继续区分 current saved plan 与 pending selection；只有点击保存后才更新当前词包的正式计划。当天已经生成的 Main Daily Session 不改变，新计划从该词包下一次生成新的 Main Daily Session 开始生效。

v0.1 不在词包详情页提供词包商城、购买、下载、搜索词包、收藏词包或复杂推荐。

### 5.3 Vocabulary List

Vocabulary List（词表）从 Vocabulary Pack Detail 的“查看词表”入口进入，用于浏览当前词包的全部单词。

v0.1 每个词表 Item 只展示：

* `word`
* 中文核心释义
* 轻量学习状态

轻量状态至少区分：

1. **未学习**：`firstLearningCompleted === false`
2. **已学习**：`firstLearningCompleted === true`，且当前不处于需要复习的状态
3. **待复习**：`firstLearningCompleted === true`，且仍在 review pool

“已学习”不等于“稳定掌握”。如果数据层已经保存长期 mastery 状态，可以继续保留，但 v0.1 词表不要求展示第四种状态。

点击单词进入现有 Word Detail。v0.1 不增加搜索、筛选、排序、收藏、批量操作或复杂熟练度系统。

---

### 5.4 Daily Learning

Daily Learning 是一个统一的“今日学习 Session”，不是两套分别完成的新词流程与复习流程。今日任务由以下两类 Item 共同组成：

1. **New Word Item（今日新词）**
2. **Review Item（今日复习词）**

用户只进入一次“今日学习”，连续完成其中所有新词和复习词；只有全部 Item 均达到“今日掌握”后，才进入 Completion。

功能：

* v0.1 按“今日复习词 → 今日新词”的简单顺序进入各 Item
* 显示今日总进度，例如“今日学习 3 / 16”
* 分别显示今日新词进度和今日复习进度，例如“新词 1 / 10”“复习 2 / 6”
* 显示当前 Item 类型：“新词”或“复习词”
* 展示当前单词和音标
* 不在首次判断阶段展示完整释义、搭配、例句等详情内容
* 让用户选择“认识”或“不认识”
* 根据 Item 类型和当前状态保存本次学习结果
* 保存后进入该单词的 Word Detail 页面继续完整学习

内部状态值：

* `know`：认识
* `unknown`：不认识

“不认识”统一覆盖以下情况：

* 完全陌生
* 有印象但不确定
* 知道大概意思但掌握不牢

Daily Learning 的页面主体由两类 Item 共用，均展示当前单词、音标、发音入口以及“认识 / 不认识”按钮。两类 Item 的区别只在于当前 Item 类型、进度和背后的状态处理规则，不建立两套独立页面。

#### New Word Item 规则

用户第一次遇到一个新词时：

* 首次选择“认识”：直接达到“今日掌握”；当天不需要重复出现 3 次；不进入长期复习词池；默认无需后续复习
* 首次选择“不认识”：进入长期复习词池，同时进入当天重复学习队列；当前尚未达到“今日掌握”

#### Review Item 与当天重复学习规则

Review Item 来自长期复习词池。新词当天曾被标记为“不认识”后，也进入当天重复学习流程。后续每次出现仍判断“认识 / 不认识”：

* 选择“认识”：`dailyConsecutiveKnowCount + 1`
* 选择“不认识”：`dailyConsecutiveKnowCount` 重置为 `0`
* 只有 `dailyConsecutiveKnowCount === 3`，该词才达到“今日掌握”，并在今天不再出现

这里要求连续 3 次认识，而不是累计 3 次认识：

**不认识 → 认识（1）→ 认识（2）→ 不认识（重置为 0）→ 认识（1）→ 认识（2）→ 认识（3）→ 今日掌握**

复习词完成当天学习不代表立即退出长期复习词池。

单个单词的首次判断流程：

**当前单词 → 判断认识程度 → 保存状态 → 进入 Word Detail**

首次学习状态判断发生在 Daily Learning 页面。Word Detail 不是首次状态判断入口。

#### 词包级学习计划

Learning Plan 是与 `packId` 绑定的词包级配置能力。它在产品结构上支持两种配置方式：

1. **Preset Plan**：系统提供固定的每日学习量预设
2. **Custom Plan**：未来允许用户自行配置每日新词数量与每日复习上限

v0.1 只提供 Preset Plan，不开发 Custom Plan 的设置 UI，也不允许用户在当前版本自由输入每日词数。当前三个系统预设为：

| 学习计划 | 每日新词目标 | 每日复习上限 |
| --- | ---: | ---: |
| 轻量 | 10 | 20 |
| 标准 | 20 | 40 |
| 进阶 | 30 | 60 |

如果用户从未修改当前词包的设置，该词包默认使用**标准计划**，即每日新词目标 20、每日复习上限 40。

独立设置交互使用固定单选项，例如：

* 轻量：新词 10 · 最多复习 20
* 标准：新词 20 · 最多复习 40
* 进阶：新词 30 · 最多复习 60

用户在 v0.1 选择的是一个整体 Preset Plan，不能分别编辑新词数和复习数。计划从 Vocabulary Pack Detail 打开现有 Learning Plan Bottom Sheet 进行设置，Home 不再提供独立学习计划模块。v0.1 不提供自定义数字输入、无限滑杆、工作日与周末不同计划、临时增加或减少当天任务等设置。

Preset Plan 与未来的 Custom Plan 属于同一个 Learning Plan 能力下的不同配置方式，不是两套互不兼容的产品能力。三个预设不是产品未来唯一允许的计划类型；数据边界必须允许未来增加 `custom learning amount`，由用户分别配置每日新词数量和每日复习上限。

学习计划必须与 `packId` 绑定，可概念化为 `learningPlanByPackId` 或等价结构。每个词包分别保存自己的计划配置，包括配置方式、`planId`（Preset Plan 使用）、`newWordCount` 与 `reviewCap`；切换 `currentPackId` 时读取该词包自己的计划。Extra Session 不受学习计划影响。

#### New Word Item 数量规则

当前词包计划中的每日新词目标决定新 Daily Session 最多生成多少个 New Word Item：

* 轻量：最多 10 个新词
* 标准：最多 20 个新词
* 进阶：最多 30 个新词

如果可用的新词不足目标数量，只生成实际可用的新词，不重复生成已经学习过的新词来凑满目标。

#### Review Item 数量规则

当前词包计划中的每日复习数量是上限，不是必须填满的目标。实际复习数量为：

`actualReviewCount = min(当前词包需要复习的单词数量, 当前词包计划的复习上限)`

例如用户选择标准档，当天有 20 个可用新词，但复习池中只有 13 个需要复习的词，则今日任务为“新词 20、复习 13”，不会重复加入不需要复习的词来凑满 40 个。

词包计划只负责决定每日新词目标数量和每日复习最大数量。Daily Learning 仍是由 New Word Item 与 Review Item 共同组成的单一 Session，不拆分为两套学习流程。

#### 设置生效时间

Daily Session 一旦生成，当天的任务与进度保持稳定。如果用户在当天 Session 已生成或已经开始学习后修改当前词包的计划：

* 不重新计算当天任务
* 不增加或删除当天已有 Item
* 不改变当天总进度
* 新计划从该词包下一次生成新的 Daily Session 开始生效

v0.1 暂不实现 AI 自动推荐每日词量、根据正确率动态调节档位、自适应负荷、动态复习优先级、复杂任务容量算法或云端同步。

#### 自然日边界与 Session 日期归属

v0.1 以用户设备 / 浏览器本地时间的 **00:00** 作为自然日边界。每天 00:00 之后视为新的一天，暂不提供复杂多时区设置。

每个 Daily Session 都必须保存明确的归属日期，例如：

`sessionDate = "2026-09-23"`

Daily Session 归属于它被生成的自然日，而不是最终完成的自然日。

每个 Main Daily Session 同时保存创建时的 `packId`，其 New Word Item、Review Item、进度与完成结算均属于该词包。Session 创建后，即使未来切换 `currentPackId`，已有 Session 仍归属于原 `packId`，不得随当前词包变化而串包。

#### 跨日继续学习

如果用户已经开始一个 Daily Session，但学习过程中跨过 00:00，系统不强制中断、不替换任务，也不在学习途中切换到新一天的 Session。用户可以继续完成原 Session。

例如 9 月 23 日 23:50 生成并开始的 Session，即使在 9 月 24 日 00:05 完成，仍然：

* 归属于 9 月 23 日
* 计为 9 月 23 日的今日学习完成
* 计入 9 月 23 日的打卡

跨日旧 Session 完成并返回 Home 后，系统再根据当前本地日期识别已经进入新的自然日，并准备或生成新一天的 Daily Session。

#### 昨日未完成 Session

如果昨天存在未完成的 Daily Session，用户没有在跨日后继续完成，而是在之后重新进入产品：

* 昨日 Session 不算打卡完成
* 昨日 Session 不直接变成今天的 Daily Session
* 昨日 Session 不继续占用今天的任务或“今日学习”进度
* 今天按 `currentPackId` 对应的当前有效计划生成新的 Daily Session

跨日结束旧 Session 只结束其今日任务与进度，不撤销用户已经产生的学习行为。即使昨日 Session 未完成，已经标记为“不认识”的单词仍进入长期复习词池，已有 `status`、`inReviewPool` 等长期状态继续保留。

#### 今日临时状态与长期状态分离

跨日时可以结束或为新 Session 重建：

* 今日任务
* `todayMastered`
* `dailyConsecutiveKnowCount`
* 当前 Session 进度

跨日时不能清除：

* 是否进入复习词池
* 长期掌握状态
* `masteryDayStreak`
* 累计学习历史
* 打卡历史

具体持久化数据结构后续单独定义。

#### 打卡归属与连续学习天数

打卡归属于 Daily Session 的 `sessionDate`，不由实际完成时间决定。同一个 `sessionDate` 只能记录一次完成打卡，避免跨日完成造成重复记录。

`currentStreak` 根据连续自然日是否完成各自日期的 Daily Session 计算，不根据 App 是否打开、用户最后一次操作时间或跨日后的实际完成时间计算。

v0.1 优先保证学习中的用户不被强制打断、Session 日期归属明确、打卡不重复、复习状态不因跨日丢失，并且新一天可以正常生成新任务。暂不实现自定义日界线、手动时区设置、补签、跨时区旅行适配、夏令时特殊补偿或云端时间校准。

---

### 5.5 Word Detail

Word Detail 是用户理解单个词汇的核心页面。

v0.1 只保留对当前学习目标真正必要的信息，避免将页面做成完整词典。

用户进入 Word Detail 前，当前单词已经在 Daily Learning 完成首次状态判断并保存状态。Word Detail 从当前 Daily Learning 流程进入，只负责展示完整学习内容及提供本节明确规定的学习操作；进入详情页不创建新的 Daily Session，不重置当前学习进度，也不丢失当前 queue 或 Learning State。

Word Detail 左上角提供返回入口。返回后继续当前 Daily Learning 流程，并保留当前 Session、当前学习进度、`todayMastered`、`dailyConsecutiveKnowCount` 与当前待学习状态，不重新生成 Session。

Word Detail 同时支持从 Vocabulary List 进入。此时入口上下文必须明确设置为 `mode = browse`，页面进入只读浏览状态。从 Daily / Extra 学习流程进入与从 Vocabulary List 浏览进入必须保留明确的入口上下文，避免浏览行为污染学习状态。

Browse Mode 保留以下内容：

* `word`
* `phonetic`
* 发音播放入口
* 中文释义
* `collocations`
* `exampleSentences`
* `synonyms`
* AI Learning Assistant 入口；仅当当前单词存在预定义 synonym group 时显示或启用

Browse Mode 必须隐藏所有学习流程专属操作，包括：

* Daily / Extra Session progress
* “下一个单词”
* “完成今日学习”或“完成额外学习”
* “↶ 不认识”或“重新学习”
* “认识 / 不认识”判断按钮
* 任何会改变 Learning State、Session 或 queue 的 action

仅仅打开或浏览详情不能：

* 修改 `todayMastered`
* 修改 `dailyConsecutiveKnowCount`
* 修改 Main Daily Session
* 修改 Extra Session
* 修改任何 learning queue
* 将单词加入 review pool
* 设置或修改 `firstLearningCompleted`
* 修改 `masteryDayStreak`
* 自动记为已学习

Browse Mode 的返回入口返回当前 Vocabulary List，不进入 Daily / Extra 学习流程，也不创建或恢复任何 Session。

展示内容包括：

#### 单词

展示当前目标单词。

例如：

`significant`

单词标题保持正常的主内容展示。产品规则不要求将整个单词改为黄色或荧光笔高亮，也不根据“认识 / 不认识”建立新的标题文字颜色体系；具体字号、颜色与间距属于视觉规范，不在本文定义。

#### 音标

展示音标。

例如：

`/sɪɡˈnɪfɪkənt/`

#### 发音播放

在单词标题附近提供发音播放入口。

v0.1 中：

* 用户点击播放按钮后，可以听到当前单词的英文发音
* 只支持单词发音，不支持例句朗读
* 优先使用浏览器原生 TTS / Speech Synthesis 能力
* 暂时不使用独立音频文件或 `audioUrl`
* 该功能属于确定性基础能力，不属于 AI 功能
* 不接入 LLM
* 不增加 `DATA_SCHEMA.md` 中的音频字段
* 如果浏览器不支持语音播放，需要提供基础不可用状态或静默降级，避免页面报错

#### 词义

词性与中文释义必须成组展示。

同一个单词可能存在多个词性，不同词性可能对应不同含义，因此不能将 Part of Speech 和 Definition 分离。

例如：

* `n.` 影响；作用
* `v.` 影响；对……产生作用

数据层面使用 `meanings` 对象数组保存。

#### 常用搭配

展示常见、高频、具有学习价值的搭配。

例如：

* significant increase
* significant impact
* significant difference

v0.1 中 `collocations` 保持轻量，不与某个具体词性或义项强绑定。

#### 真题例句

展示 IELTS 真题中的真实例句。

每条例句包含：

* 英文原句
* 中文翻译
* 真题来源

真题例句属于可信结构化内容，不通过 LLM 动态生成。

如果一个词存在多条 `exampleSentences`，默认只展示数组中的第一条，并提供“查看全部 X 条”入口，其中 `X` 为当前词真实例句数量。点击后在当前 Word Detail 页面原位展开全部例句，不跳转新页面；展开后入口变为“收起例句”，点击后恢复只展示第一条。

例句展开或收起只改变当前页面的展示状态，不影响 Learning State、`todayMastered`、`dailyConsecutiveKnowCount` 或 Daily Session progress。每条例句继续展示英文例句、中文翻译和 `source`；`source` 为辅助信息，内部 `meaningId` 不直接展示给用户。

#### 近义词

展示当前目标词相关的基础近义词。

例如：

* important
* crucial
* significant

v0.1 中：

* `synonyms` 只存储近义词字符串
* 不额外保存近义词释义等辅助字段
* 近义词只承担辅助学习信息展示
* 当前阶段不要求近义词支持点击或跳转至独立详情页；后续如需跳转能力再单独定义
* 不要求所有近义词都存在于当前 30–100 词核心词库中

#### AI Learning Assistant 入口

在近义词模块提供独立入口：

**查看近义词辨析**

该入口不是内联 AI 结果模块。仅当当前单词存在预定义 synonym group 时，用户才可点击进入独立的 **AI Learning Assistant / AI 学习助手** 页面。进入后页面读取当前 target word 与预定义 synonym group，由系统自动生成一条用户请求并立即开始 AI 请求，用户不需要再次点击“发送”。

AI Learning Assistant 是可扩展的通用 AI 学习空间，近义词辨析只是 v0.1 的第一个实际能力。Word Detail 的基础内容和学习流程不依赖 AI 请求成功。

#### 学习判断修正操作

Word Detail 不额外展示“认识”或“不认识”状态 Tag，也不提供“认识 / 不认识”双按钮切换。

如果当前词进入详情页时属于“认识 / 已掌握”状态，页面右上角提供轻量操作：

**↶ 不认识**

“↶ 不认识”是操作入口，不是状态标签。它表示“我刚才判断错了，这个词需要重新学习”。点击后：

* 当前词重新进入当天学习流程
* `todayMastered` 变为 `false`
* `dailyConsecutiveKnowCount` 重置为 `0`
* 当前词进入或保持在长期复习词池
* 当前主 Session 的已掌握数量同步减少
* 当前词后续仍需在 Daily Learning 中连续 3 次被标记为“认识”，才能再次达到今日掌握

如果当前词本来就是“不认识”状态，Word Detail 不显示“↶ 不认识”，也不提供“认识”“标记为认识”“直接掌握”等快捷操作。用户不能在详情页绕过 Daily Learning 的当天重复学习与连续 3 次认识机制。

该操作允许用户在查看释义、搭配、例句和近义词后纠正一次过于乐观的判断。例如：

**最初选择“认识” → 查看完整学习内容 → 发现掌握不够 → 修改为“不认识” → 进入复习词池**

#### 下一步

Word Detail 页面底部提供明确的主要操作按钮。

如果当前单词不是今日任务的最后一个，按钮为：

**下一个单词**

“下一个单词”表示进入当前 Daily Session queue 中下一个真正需要处理的 Item，不是按照 `vocabulary.json` 的顺序直接打开下一个单词。点击后进入同一 Daily Learning Session 中下一个 Item 的快速判断状态：

**当前词 Word Detail → 下一个单词 → 快速判断认识程度 → 下一个词 Word Detail**

下一 Item 的选择继续遵循现有 Daily Learning 状态机：`todayMastered === true` 的 Item 不得因为用户打开过 Word Detail 而重新成为普通待学习词；仍需重复学习的 `unknown` Item 按当前 learning queue 规则继续处理。

只有当主 Daily Session 中所有唯一 New Word Item 和 Review Item 都达到“今日掌握”时，按钮才改为：

**完成今日学习**

点击后进入 Completion 页面。

主 Session 已全部掌握时，不再展示任何已经掌握的词作为待判断 Item。

---

### 5.6 Word Detail v0.1 Data Fields

Word Detail 第一版基础数据字段仅包括：

* `word`
* `phonetic`
* `meanings`
* `collocations`
* `exampleSentence`
* `synonyms`

其中：

`meanings`

为对象数组，每项包含：

* `partOfSpeech`
* `definitionZh`

`collocations`

为字符串数组。

`exampleSentence`

为对象，包含：

* `text`
* `translation`
* `source`

`synonyms`

为字符串数组。

详细 Schema 在 `DATA_SCHEMA.md` 中定义。

---

### 5.7 Learning Status

用户可以对单词进行简单状态标记。首次状态判断发生在 Daily Learning 页面，Word Detail 不承担首次判断，也不提供双向状态切换；它只允许已判断为 `know` / 已掌握的词通过“↶ 不认识”纠正为 `unknown` 并重新进入学习流程。

v0.1 只使用两种学习状态：

* 认识
* 不认识

对应内部状态值：

* `know`
* `unknown`

v0.1 的学习判断统一使用 `know` 与 `unknown` 两种内部状态。

状态原则：

* 同一个单词始终只有一个当前状态
* Daily Learning 保存首次判断结果
* Word Detail 只允许通过“↶ 不认识”将 `know` 修正为 `unknown`；`unknown` 不能在详情页直接改回 `know`
* 更新状态时不创建重复记录
* 页面刷新后仍保持最新 Learning State，但 Word Detail 不额外依赖状态 Tag 展示该状态
* 首次直接标记为 `know` 的新词不进入复习词池，也不累计连续认识次数
* 新词标记为 `unknown` 后进入复习词池
* 原本首次标记为 `know` 的词在 Word Detail 改为 `unknown` 时进入复习词池
* 从 Word Detail 修正为 `unknown` 时，`todayMastered = false`、`dailyConsecutiveKnowCount = 0`，并同步减少当前主 Session 已掌握数量

#### 今日状态

今日状态用于判断一个词是否完成今天的学习任务：

* `todayMastered = false`：尚未完成今日学习
* `todayMastered = true`：已经完成今日学习，今天不再出现
* `dailyConsecutiveKnowCount`：当天连续标记为“认识”的次数

首次出现的新词直接标记为 `know` 时，立即设置为今日掌握，不需要累计 `dailyConsecutiveKnowCount`。任何 Item 当天曾被标记为 `unknown` 后，均需要连续 3 次 `know` 才达到今日掌握。

“今日掌握”只代表这个词今天的任务已经完成，不等于长期稳定掌握。

#### 长期状态与复习词池

长期状态与今日状态相互分离，可采用以下内部状态：

* `new`：尚未进入长期复习词池
* `in_review`：位于长期复习词池
* `stable_mastered`：达到长期稳定掌握

只要一个单词曾被标记为 `unknown`，就进入长期复习词池。即使当天通过连续 3 次认识达到今日掌握，也仍保留在长期复习词池中，供其他日期继续复习。

长期稳定掌握采用跨天规则：

* 每个不同复习日完成该词的“今日掌握”后，`masteryDayStreak + 1`
* 连续 3 个不同复习日均完成“今日掌握”，即 `masteryDayStreak === 3` 时，状态变为 `stable_mastered` 并移出复习词池
* 如果某个复习日再次标记为 `unknown`，`masteryDayStreak` 重置，并继续保留在复习词池

首次出现就直接标记为 `know` 的新词不进入复习词池、不需要当天连续认识 3 次，也不参与 `masteryDayStreak` 计算。若之后在 Word Detail 中改为 `unknown`，则从此进入复习词池并按后续复习规则执行。

状态保存在 LocalStorage。

#### 首次学习完成与累计学习词数

每个词级学习状态必须能够判断该 `wordId` 是否已经完成过首次新词学习，概念上使用：

`firstLearningCompleted`

规则如下：

* 新词首次选择 `know` 并达到 `todayMastered = true` 时，设置为 `true`
* 新词首次选择 `unknown` 时仍为 `false`
* 该新词随后在当天连续 3 次选择 `know`、达到 `todayMastered = true` 时，设置为 `true`
* Extra Session 中首次学习的新词遵循同一规则
* 一旦变为 `true`，后续永久保持 `true`；进入 review pool、再次复习或长期状态变化均不撤销

`learnedWordCount` 定义为：

**当前 Vocabulary Pack 中 `firstLearningCompleted === true` 的唯一 wordId 数量。**

它由词级状态按唯一 `wordId` 推导，不设计为每次事件直接 `+1` 的独立累计计数器，避免复习、重复展示或多次结算导致重复计数。

因此：

`learnedWordCount ≠ stable mastered count ≠ review count ≠ 今日掌握数`

#### 新词阶段完成与词包完成

产品必须区分 First-learning Complete 与 Pack Completed，两者不是同一个状态。

##### A. First-learning Complete / 新词阶段完成

条件：

`learnedWordCount === totalWordCount`

含义是当前 Vocabulary Pack 的所有单词都已经完成过首次新词学习。该状态不代表整个词包已经完成，也不代表所有词已经稳定掌握。

如果 `reviewPoolCount > 0`，用户仍需继续复习。此时产品只能表达：

* 新词已全部学完
* 首次学习已完成
* 仍有 X 个词待复习

此时不得使用“词包已完成”“全部掌握”或“学习完成”等会误导用户认为无需继续复习的文案。

##### B. Pack Completed / 词包完成

只有同时满足以下两个条件，当前词包才进入 Vocabulary Pack Completed 状态：

`learnedWordCount === totalWordCount`

并且：

`reviewPoolCount === 0`

因此：

**Pack Completed ≠ First-learning Complete**

即使进度显示 `100 / 100`，只要当前词包仍有任意单词位于 review pool，就只能视为新词阶段完成，不能视为整个词包完成。

v0.1 采用 Simple Rule-based Review：当天连续 3 次认识代表今日掌握；跨 3 个不同复习日完成今日掌握代表长期稳定掌握。暂不实现 SM-2、艾宾浩斯复杂间隔、动态复习间隔、AI 排序、动态难度优先级、用户自定义复杂复习策略或复杂每日任务生成算法。

---

### 5.8 AI Learning Assistant / AI 学习助手

AI Learning Assistant 是独立的通用 AI 学习空间，不是名为“AI 近义词辨析”的单功能页面。v0.1 首个且唯一正式能力为 **Synonym Comparison / 近义词辨析**；后续可在同一能力框架中承载词义理解、例句分析与搭配分析等学习能力，但 v0.1 不提供自由聊天、多轮对话或用户主动输入。

#### 入口与自动请求

当 Word Detail 中当前词存在预定义 synonym group 时，显示 AI 学习助手入口。用户点击后：

1. 进入 AI Learning Assistant 页面；
2. 页面读取当前目标词及其预定义 synonym group；
3. 系统自动生成一条用户请求消息；
4. 页面自动发起近义词辨析请求。

用户不编辑请求、不输入问题，也不需要点击发送。若当前词不存在预定义 synonym group，则不以临时拼接相关词的方式强行开放入口。

#### 固定页面结构

页面保持同一稳定 shell：

1. Back
2. AI Welcome / Hero
3. Current Word Context
4. 系统自动生成的用户消息
5. AI Reply
6. 仅 Success 显示的风险提示
7. 底部禁用 composer

Hero 使用：

**嗨，我是你的  
AI 学习助手**

**可以陪你一起理解词义、  
辨析用法、分析例句和搭配。**

Hero 必须表达可扩展的 AI 学习助手身份，不得将角色限定为“近义词助手”。底部 composer 仅作为未来能力占位，推荐文案为“更多 AI 学习能力即将开放”；它不可输入、不可唤起键盘、无发送按钮，也不暗示当前支持自由提问或多轮聊天。

#### 唯一三种业务状态

AI Learning Assistant v0.1 只存在以下三种业务状态：

1. **Loading**：保留完整页面 shell，仅 AI Reply 区显示“正在分析这些词的使用差异…”和 typing dots；不得使用全屏 spinner、骨架屏、整页闪烁或导致布局跳动。
2. **Success**：在同一页面内显示结构化辨析结果及风险提示。
3. **Error**：保留 Hero、当前词和自动生成的用户消息；AI Reply 区显示“暂时没生成出来”“请稍后再试”与“再试一次”。重试必须沿用同一目标词、同一 synonym group 与同一 Context。

不存在独立的 Initial / Entry 业务状态。设计稿中的两个 Success Frame 表示同一个 Success 页面在不同滚动位置，不是两个状态、两个页面或两条路由。

#### AI 输入 Context

每个对比词的 Context 仅从本地可信结构化词库读取：

* `word`
* `partOfSpeech` 与中文释义
* `collocations`
* `exampleSentences`
* synonym group 信息

本地数据负责稳定事实，AI 负责比较、组织和解释。AI 不重新生成基础词义、音标、搭配或词库例句，也不得覆盖本地数据。

#### Structured Output

v0.1 使用以下结构化输出：

```ts
type SynonymComparison = {
  differences: {
    word: string;
    keyword: string;
    note: string;
  }[];
  interchangeability: {
    level: "yes" | "partial" | "no";
    explanation: string;
  };
};
```

Success 页面先展示 `differences` 中每个词的 `word`、`keyword` 与 `note`，再以“能不能换？”展示 `interchangeability`：

* `yes` → 可以互换
* `partial` → 部分可以互换
* `no` → 不建议互换

随后展示 `explanation`。内容重点是对学习真正有用的区别，以及哪些具体语境可以或不可以互换；默认不增加冗长总结、额外例句、常见错误、缺少本地依据的正式/非正式标签，也不为了制造差异而强行区分。

Success 的 AI Reply 下方显示低视觉权重提示：

**AI 内容可能存在偏差，请结合上下文判断。**

可配轻量信息图标，但不得使用黄色警告条、红色警示或强背景。

#### 可靠性与失败边界

AI 是增强层，不是核心词典与学习流程的依赖。无论请求失败、超时或输出不可用，Word Detail、本地释义、搭配、例句、Session、review、进度与词库数据都必须正常可用且不被修改。产品原则为：

**稳定内容本地化，动态组合内容 AI 化。**

Prompt 使用稳定版本管理，当前候选版本为 `v1.7`；后续 Prompt 或 Schema 变更必须升级版本并保留评估记录。未来可加入缓存，但不得在 v0.1 文档中宣称已经实现。缓存 identity 建议由以下内容组成：

`targetWord + sortedSynonymSet + promptVersion`

---

### 5.9 Learning Completion

#### 主 Daily Session 完成条件

每天只有一个主 Daily Session。只有该主 Session 中所有 New Word Item 和 Review Item 均满足：

`allMainSessionItems.todayMastered === true`

才允许进入 Completion。浏览完所有词、到达最后一个词或点击过所有单词都不等于完成主 Session。

#### Completion 的产品定位与内容

Completion 只用于主 Daily Session 完成后的反馈与结算：

1. 明确告知“今日学习完成”
2. 展示主计划今日掌握数量
3. 展示主计划任务构成，例如“新词 20、复习 4”
4. 展示连续学习天数与累计打卡天数
5. 完成一次且仅一次的主 Session 结算
6. 提供唯一主 CTA“返回首页”

Completion 不是考试成绩页、数据分析页或额外学习入口，不提供“再学一组”。页面可以复用 Home 的临时 IP，并使用非常轻量的完成或庆祝状态；v0.1 不实现 IP 动作系统、动画、勋章或分享海报。

#### 主 Session 完成结算与防重复

用户第一次真正完成当前主 Daily Session 时，执行一次完成结算：

* 将主 Daily Session 标记为 `completed`
* 记录 `completionTime`
* 按主 Session 的 `sessionDate` 记录当天打卡
* 根据已经完成主 Session 的连续自然日重新计算 `currentStreak`
* 更新 `totalCheckInDays`

同一个 `sessionId / sessionDate` 只允许结算一次。刷新 `/complete`、浏览器前进或后退、从 Home 再次进入 Completion、重复访问 Completion 页面，都不能重复增加打卡、`currentStreak` 或 `totalCheckInDays`。

`currentStreak` 必须根据连续自然日是否完成对应日期的主 Daily Session 计算，不能简单执行 `currentStreak + 1` 而忽略日期。`totalCheckInDays` 表示累计完成主 Daily Session 的自然日数量，同一自然日只能计入一次。

打卡归属于主 Daily Session 的 `sessionDate`，不由 Completion 实际打开时间决定。如果 9 月 23 日的主 Session 在 9 月 24 日 00:05 完成，仍计为 9 月 23 日的打卡。跨日旧 Session 完成并返回 Home 后，系统再识别当前自然日并准备新一天的主 Daily Session。

Completion 点击“返回首页”后，Home 必须识别该主 Session 已经 `completed`，展示“今日计划已完成”及主计划 `X / X`，不得重新显示“开始今日学习”或“继续今日学习”。

#### Extra Session（再学一组）

“再学一组”位于 Home 的主计划完成态，不位于 Completion。用户路径为：

**Completion → 返回 Home → 主动选择“再学一组”**

Extra Session 是主计划完成后的独立额外学习 Session，不属于主 Daily Session。产品模型保持为：

**1 个 Main Daily Session + 0～N 个 Extra Session**

每个 Extra Session 保存创建时的 `packId = currentPackId`。Session 创建后不随未来的词包切换改变归属。

v0.1 每次 Extra Session 固定加入 5 个尚未学习的新词，不加入 Review Item，也不提供自定义数量。如果剩余可用新词少于 5 个，只使用实际剩余新词；不重复已经学习过的新词来凑数。没有可用新词时，Home 不显示“再学一组”。

Extra Session 可以复用现有流程：

**Extra Word → 认识 / 不认识 → Word Detail → 下一个**

Extra Session 保持自己的进度，并与主 Daily Session 分离。Extra Word 被标记为“不认识”时，仍按现有长期规则进入复习词池，不能因为属于额外学习而丢失长期学习状态。

Extra Session 完成后可以直接返回 Home，或先显示轻量完成反馈再返回 Home；不再次进入完整的主 Completion 页面。

#### 主计划进度、今日总掌握量与打卡边界

主计划完成进度只统计主 Daily Session。假设主计划为 `24 / 24`，之后完成 5 个 Extra Word，主计划仍保持 `24 / 24`，不能变为 `29 / 29`。

今日总掌握量按以下方式计算：

`今日总掌握量 = 主 Daily Session 已掌握数量 + 当天所有 Extra Session 已掌握数量`

例如主计划掌握 24 个、Extra Session 完成 5 个，则 Home 可以展示“今日总掌握 29 个”“额外学习 5 个”，同时继续展示“今日计划 24 / 24 已完成”。多次 Extra Session 的实际完成数量继续累加到今日总掌握量，但不加入主计划分母。

Extra Session 不影响当天打卡是否完成、`currentStreak`、`totalCheckInDays` 或主 Daily Session 的 `completed` 状态。它不能再次打卡、增加 streak、重复结算当天完成或重新开启当天主 Daily Session。

v0.1 的 Completion 与 Extra Session 暂不加入正确率、学习时长、分享海报、AI 学习总结、勋章、排行榜、Extra Review Session、自定义 Extra 数量或“再学 10 / 20 / 30 个”等自由选择。

---

## 6. Data Strategy

第一版正式开放词包为 `ielts_core_v1`，核心词库规模：

**30–100 words**

优先使用本地 JSON。

暂时不接入大型外部词典数据库。

需要保存的用户状态优先使用：

**LocalStorage**

例如：

* `currentPackId`
* 各词包的 `firstLearningCompleted` 与 `learnedWordCount` 推导状态
* 各词包独立的 review pool 与 stable mastery
* `learningPlanByPackId`
* 带 `packId` 的 Main Daily Session 与 Extra Session
* 今日学习进度
* 单词学习状态
* 已完成任务
* 简单学习记录

所有学习状态与统计必须能按 `packId` 隔离。当前只有 `ielts_core_v1` 拥有真实数据，但不能将持久化模型设计为唯一全局 vocabulary 的不可扩展结构。

详细数据结构由 `DATA_SCHEMA.md` 定义。

---

## 7. AI Scope

### v0.1

提供独立的 **AI Learning Assistant / AI 学习助手** 页面，但实际只开放一个结构化能力：

**Synonym Comparison / 近义词辨析**

该能力由 Word Detail 中具备预定义 synonym group 的词触发。进入页面后系统自动生成用户消息并开始请求，用户不输入、不发送，也不进入多轮会话。输出严格遵循 `SynonymComparison` Schema，重点解释各词的关键区别及“能不能换”。

页面只存在 Loading、Success、Error 三种业务状态，并始终复用同一稳定 shell。AI 失败不影响本地词库内容、学习状态与 Session。

### Planned but not required for v0.1

后续可以加入：

* Meaning Understanding
* Example Analysis
* Collocation Analysis
* Sentence Correction / Usage Feedback
* Sentence Expansion
* More Natural / Formal Expression
* 近义词互动选择题
* 轻量使用练习

“用户自己造句并获得 AI 批改”保留为后续能力，不进入 v0.1。

原因是该功能要求用户主动组织和输入完整句子，在连续词汇学习过程中交互成本较高。

---

## 8. Out of Scope

以下功能暂不进入 v0.1：

* 自由输入、多轮对话与开放式 AI Chatbot
* Essay Correction
* Speaking Practice
* RAG
* Multi-model Routing
* Complex Spaced Repetition Algorithm
* Cloud Sync
* User Account System
* Social Features
* Leaderboard
* Large-scale Vocabulary Database
* Advanced Personalization
* Subscription / Payment
* Complex Analytics Dashboard
* 近义词详情页跳转
* 为所有辅助近义词建立完整词条
* English Definition
* Word Family
* 用户主动造句批改
* 第二套完整可学习词库
* 真正的多词包内容运营
* 词包搜索、筛选与收藏
* 词书商城、购买与下载管理
* 词包推荐系统

如果开发过程中出现新的功能想法，默认不立即加入 v0.1，先记录到 Future Scope。

---

## 9. Technical Direction

第一版优先采用简单、可维护、适合第一次 Vibe Coding 的技术方案。

建议：

* React / Next.js
* Tailwind CSS
* Local JSON
* LocalStorage
* Single LLM API
* Simple server-side API / Edge Function
* API Key 不暴露在客户端

PWA 可以作为后续增强能力，不是 v0.1 的前置条件。

---

## 10. Development Principles

这是第一次 Vibe Coding 项目。

开发原则：

### One module at a time

不要一次生成整个产品。

推荐开发顺序：

Project Setup
→ Home
→ Word Data
→ Daily Learning
→ Word Detail
→ Learning State
→ Completion
→ AI Learning Assistant / Synonym Comparison
→ Error States
→ Deployment

每一步遵循：

**Implement → Run locally → Verify → Continue**

完成当前模块并确认可运行后，再进入下一模块。

---

## 11. AI Product Principles

开发过程中持续遵守：

* 不因为“可以用 AI”就使用 AI
* 稳定内容本地化，动态组合内容 AI 化
* 确定性内容优先使用数据库和规则
* AI 不重新承担基础词义数据库的职责
* AI 输入 Context 只使用当前任务所需的本地结构化事实，并保持必要且轻量
* 不为了 AI 增加无必要的数据复杂度
* AI 输出必须使用已定义的 Structured Output；当前为 `SynonymComparison`
* AI Learning Assistant 只使用 Loading / Success / Error 三种业务状态
* Error 必须支持基于同一目标词、synonym group 与 Context 重试
* 不使用“零幻觉”或“完全准确”等绝对描述
* 对 AI 生成内容与可信词库内容进行视觉和信息层级区分
* 记录 AI Failure Case
* 记录 Prompt 迭代并维护明确版本；当前候选版本为 `v1.7`
* 记录模型成本和延迟
* 缓存属于未来优化，不宣称 v0.1 已实现；候选 identity 为 `targetWord + sortedSynonymSet + promptVersion`
* 保留重要产品决策，用于后续 Evaluation 和作品集复盘

---

## 12. Success Criteria for v0.1

v0.1 完成的标准不是页面数量，而是以下流程真实可运行：

**用户打开产品
→ 查看今日学习任务
→ 查看当前 Vocabulary Pack 的已学习数量，并可进入词包详情与词表
→ 一次进入由 Review Item 和 New Word Item 组成的今日学习 Session
→ 查看今日总进度、新词进度、复习进度和当前 Item 类型
→ 在共用的 Daily Learning 页面查看当前单词和音标
→ 快速选择认识 / 不认识
→ 按当前 Item 类型保存今日状态与长期状态
→ 查看单词的稳定结构化信息
→ 播放当前单词的英文发音
→ 查看基础近义词
→ 当当前词存在预定义 synonym group 时，可进入独立的 AI 学习助手
→ 系统自动生成请求并完成 Loading / Success / Error 三态流转
→ Success 按结构化结果展示词义差异与“能不能换？”，Error 可基于相同 Context 重试
→ AI 请求失败时，本地词义、搭配、例句、Session 与学习进度仍然正常可用
→ 在 Word Detail 中可将误判为认识的词通过“↶ 不认识”重新加入学习流程
→ 未达到今日掌握的词继续进入当天重复学习
→ “下一个单词”进入当前 Session queue 中下一个真正需要处理的 Item
→ 主 Daily Session 的所有 Item 均达到今日掌握后进入 Completion
→ 主 Session 仅结算一次并按 sessionDate 记录打卡
→ 通过“返回首页”进入主计划完成态
→ 仍有新词时可从 Home 主动开始独立的 Extra Session
→ 学习进度被保存**

词包相关能力同时满足：

**Home 当前词包摘要
→ Vocabulary Pack Detail 查看 `learnedWordCount / totalWordCount` 与当前计划
→ Vocabulary List 浏览全部单词及轻量学习状态
→ 从词表以浏览模式进入 Word Detail，不改变任何 Session 或学习状态**

当前 v0.1 只有 `ielts_core_v1` 可用；未开放词包可以展示状态，但不可切换或生成 Session。Main Daily Session、Extra Session、首次学习进度、长期复习状态、学习计划与统计均明确绑定 `packId`。

每个单词的完整学习流程为：

**统一 Daily Learning Session 中的 Item 快速判断
→ 认识 / 不认识
→ 保存状态
→ Word Detail
→ 查看完整学习内容
→ 已掌握词可通过“↶ 不认识”纠正判断；unknown 词不可在详情页直接改为认识
→ 下一个 Item 或当天重复学习**

今日 Session 的结束流程为：

**主 Daily Session 中所有 New Word Item 与 Review Item 的 `todayMastered === true` → 完成今日学习 → Completion → 返回 Home**

只要这一闭环能够真实运行，v0.1 即视为成立。
