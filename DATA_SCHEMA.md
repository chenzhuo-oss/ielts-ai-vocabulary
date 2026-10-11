# IELTS AI Vocabulary Data Schema

## 1. Vocabulary Set Structure

整个词库最外层使用对象结构，不直接使用数组。

v0.1 结构：

```json
{
  "id": "ielts_core_v1",
  "name": "IELTS Core Vocabulary",
  "words": []
}
```

暂时不增加：

- `version`
- `createdAt`
- `userId`
- `vocabularySetId`
- 其他额外 metadata

未来可能支持用户上传自定义词库，因此当前结构需要保留可扩展性，但 v0.1 不实现该功能。

---

## 2. Word Schema

每个单词对象只包含以下字段：

- `id`
- `word`
- `phonetic`
- `meanings`
- `collocations`
- `exampleSentences`
- `synonyms`

### 2.1 `id`

类型：

```ts
string
```

用途：每个单词的稳定唯一标识。

v0.1 使用简单格式，例如：

```json
"word_001"
```

不要使用 `word` 文本本身作为唯一主键。

### 2.2 `word`

类型：

```ts
string
```

示例：

```json
"significant"
```

### 2.3 `phonetic`

类型：

```ts
string
```

示例：

```json
"/sɪɡˈnɪfɪkənt/"
```

### 2.4 `meanings`

类型：

```ts
Array<{
  id: string;
  partOfSpeech: string;
  definitionZh: string;
}>
```

每个义项必须包含稳定的唯一 `id`，且该 `id` 只需要在当前单词内部唯一。推荐使用 `meaning_01`、`meaning_02`、`meaning_03` 等格式。

词性和中文释义必须成组出现。

原因：同一个词可能存在多个词性，不同词性可能对应不同中文含义。

示例：

```json
[
  {
    "id": "meaning_01",
    "partOfSpeech": "n.",
    "definitionZh": "下降；减少"
  },
  {
    "id": "meaning_02",
    "partOfSpeech": "v.",
    "definitionZh": "下降；减少"
  }
]
```

### 2.5 `collocations`

类型：

```ts
Array<{
  text: string;
  translation: string;
}>
```

用途：保存常见、高频、具有 IELTS 学习价值的英文搭配及其简体中文释义。

- `text`：英文搭配，必须是非空字符串。
- `translation`：简洁、自然的简体中文释义，必须是非空字符串，不写成长句解释。
- 每个词仍保留约 3 个高频、自然、具有 IELTS 学习价值的搭配。
- 每个 collocation 对象只包含 `text` 和 `translation`，不新增其他字段。

v0.1 不与具体 `meaning` 或词性强绑定。

示例：

```json
[
  {
    "text": "significant increase",
    "translation": "显著增长"
  },
  {
    "text": "significant impact",
    "translation": "显著影响"
  },
  {
    "text": "significant difference",
    "translation": "显著差异"
  }
]
```

### 2.6 `exampleSentences`

类型：

```ts
Array<{
  text: string;
  translation: string;
  source: string;
  meaningId: string;
}>
```

用途：保存 1–3 条 IELTS 真题例句、中文翻译和来源，并通过每条例句的 `meaningId` 明确标记该例句实际使用了当前单词的哪一个词性或义项。

数量规则：

- 每个单词必须有 1–3 条例句
- 最少 1 条，最多 3 条
- 不要求每个 meaning 都必须有例句
- 不新增其他例句字段

`meaningId` 规则：

- 每条例句的 `meaningId` 必须引用当前单词 `meanings` 数组中真实存在的 `meaning.id`
- `exampleSentences` 中的例句不重复保存 `partOfSpeech` 和 `definitionZh`
- 通过 `meaningId` 引用已经存在的义项，避免重复数据
- 该关联确保例句与具体词性或义项之间的关系明确
- 后续页面可以通过 `meaningId` 展示对应的“词性 + 中文释义”
- 后续 AI Context 可以通过 `meaningId` 知道例句对应的具体 sense

例句选择规则：

- 例句优先展示当前单词最常用、最核心、最值得 IELTS 学习的义项
- 每个词至少有 1 条例句对应其最常用或核心义项
- 如果一个词存在多个高频常用义项，可以使用 2–3 条例句分别覆盖
- 冷门、低频、特殊专业义项不应优先占用例句名额
- 不要求 `exampleSentences` 与 synonym cluster 使用同一个义项
- synonym cluster 对应的义项如果本身也是核心高频义项，可以优先覆盖

`source` 规则：

- `source` 是面向用户展示的简短来源标签
- 只保留品牌级或书名级来源
- 不展示 Reading / Listening / Practice Test / Section / Task 等信息
- 来源必须真实、可验证
- 不允许为了统一格式而伪造来源
- 如果无法确认来源，不要虚构一个看起来可信的 `source`
- 不新增其他来源字段

推荐格式示例：

```json
"剑桥雅思19"
"British Council"
"IELTS 官方"
```

如果未来使用 Cambridge IELTS 真题，优先使用：

```json
"剑桥雅思19"
"剑桥雅思18"
```

单条例句对象示例：

```json
{
  "text": "The number of visitors declined significantly.",
  "translation": "游客数量显著下降。",
  "source": "剑桥雅思19",
  "meaningId": "meaning_02"
}
```

每条例句都属于可信结构化内容，不通过 LLM 动态生成。

### 2.7 `synonyms`

类型：

```ts
string[]
```

用途：保存当前单词的核心近义词。

v0.1 只存字符串，不额外保存：

- `basicMeaning`
- `relationType`
- `explanation`
- 其他额外 metadata

每个词建议保留 2–4 个最值得辨析的近义词。

示例：

```json
[
  "crucial",
  "pivotal",
  "vital"
]
```

v0.1 中 `synonyms` 用于：

1. Word Detail 页面展示
2. AI Synonym Comparison 的输入 Context

当前版本暂不实现近义词点击跳转详情页，但核心词库会尽量让近义词彼此存在于 100 词词库中，为以后跳转能力做准备。

---

## 3. v0.1 Core Word List

v0.1 的核心词库固定为以下 100 个单词，按 25 个近义词语义簇组织。

这些分组用于词库设计和后续 `synonyms` 配置，不代表组内所有词在所有语境下都可以完全互换。

1. significant / crucial / pivotal / vital
2. primary / principal / predominant / central
3. increase / escalate / surge / expand
4. decline / diminish / decrease / shrink
5. alter / modify / transform / shift
6. indicate / demonstrate / illustrate / reveal
7. issue / complication / difficulty / challenge
8. approach / strategy / technique / methodology
9. advantage / benefit / merit / strength
10. drawback / limitation / weakness / disadvantage
11. beneficial / advantageous / favorable / constructive
12. detrimental / adverse / harmful / damaging
13. necessary / indispensable / compulsory / mandatory
14. feasible / possible / viable / achievable
15. prevalent / widespread / common / pervasive
16. substantial / considerable / notable / marked
17. analyze / assess / evaluate / examine
18. influence / affect / impact / shape
19. cause / induce / trigger / generate
20. consequence / outcome / result / effect
21. preserve / conserve / protect / safeguard
22. acquire / obtain / attain / gain
23. facilitate / promote / support / foster
24. restrict / constrain / inhibit / hinder
25. objective / aim / purpose / intention

要求：

- 这 100 个词作为 v0.1 固定核心词库范围
- 不自行增加单词
- 不自行替换单词
- 当前只把词表记录进 `DATA_SCHEMA.md`
- 暂时不要生成 100 个词的完整 JSON 数据

---

## 4. Complete Word Example

```json
{
  "id": "word_001",
  "word": "significant",
  "phonetic": "/sɪɡˈnɪfɪkənt/",
  "meanings": [
    {
      "id": "meaning_01",
      "partOfSpeech": "adj.",
      "definitionZh": "重要的；显著的"
    }
  ],
  "collocations": [
    {
      "text": "significant increase",
      "translation": "显著增长"
    },
    {
      "text": "significant impact",
      "translation": "显著影响"
    },
    {
      "text": "significant difference",
      "translation": "显著差异"
    }
  ],
  "exampleSentences": [
    {
      "text": "There has been a significant increase in the volume of traffic.",
      "translation": "交通量出现了显著增长。",
      "source": "剑桥雅思19",
      "meaningId": "meaning_01"
    }
  ],
  "synonyms": [
    "crucial",
    "pivotal",
    "vital"
  ]
}
```

---

## 5. TypeScript Types

```ts
type VocabularySet = {
  id: string;
  name: string;
  words: WordEntry[];
};

type WordEntry = {
  id: string;
  word: string;
  phonetic: string;
  meanings: Meaning[];
  collocations: Collocation[];
  exampleSentences: ExampleSentence[];
  synonyms: string[];
};

type Collocation = {
  text: string;
  translation: string;
};

type Meaning = {
  id: string;
  partOfSpeech: string;
  definitionZh: string;
};

type ExampleSentence = {
  text: string;
  translation: string;
  source: string;
  meaningId: string;
};
```

---

## 6. Important Constraints

- 不新增字段
- 不修改 `PRODUCT_SPEC.md`
- 不创建真实 100 词 JSON 数据文件
- 不实现 LocalStorage
- 不实现 Learning State
- 不实现 Daily Progress
- 不实现 AI Output Schema
- 不实现任何页面或业务逻辑
- 不接入任何 LLM API
- 只创建 `DATA_SCHEMA.md`
- 完成后停止，不继续开发下一阶段
