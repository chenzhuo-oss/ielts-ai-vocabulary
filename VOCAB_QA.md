# Vocabulary QA

## 1. Purpose

本文件定义 v0.1 词库的第一版质量检查机制。

自动验证脚本只读取 `src/data/vocabulary.json`，不会修改或自动修复词库数据。发现问题时，脚本只输出明确的 error 或 warning，由人工确认后再决定如何处理。

运行方式：

```bash
npm run validate:vocabulary
```

结果分级：

- `ERROR`：确定违反数据结构或一致性规则，命令以非零退出码结束。
- `WARNING`：数据结构仍然有效，但内容可能需要人工复核；warning 本身不会使命令失败。

---

## 2. Deterministic Checks

以下问题可以通过普通代码规则可靠检查，由 `scripts/validate-vocabulary.ts` 自动执行。

### 2.1 Vocabulary Set

- 顶层数据必须是对象。
- `id` 必须存在且为非空字符串。
- `name` 必须存在且为非空字符串。
- `words` 必须存在且为数组。

### 2.2 Word identity and fields

- 每个词条必须是对象。
- 每个词条必须包含 `DATA_SCHEMA.md` 规定的全部字段：`id`、`word`、`phonetic`、`meanings`、`collocations`、`exampleSentence`、`synonyms`。
- 不允许出现上述范围之外的词条字段。
- `word.id` 必须为非空字符串，并且在整个词库中不可重复。
- `word.word` 必须为非空字符串，并且在整个词库中不可重复。
- `phonetic` 必须为非空字符串。

### 2.3 Meanings

- `meanings` 必须是至少包含一项的数组。
- 每个 meaning 必须只包含 `id`、`partOfSpeech`、`definitionZh`。
- `meanings[].id` 必须为非空字符串，并且在当前单词内部不可重复。
- `meanings[].partOfSpeech` 与 `meanings[].definitionZh` 必须为非空字符串。

### 2.4 Example sentence

- `exampleSentence` 必须是对象，并且只包含 `text`、`translation`、`source`、`meaningId`。
- `text`、`translation`、`source`、`meaningId` 必须为非空字符串。
- `meaningId` 必须引用当前词条 `meanings` 中真实存在的 `meaning.id`。
- `source` 超过 30 个字符时输出 warning，提示其可能不是简短的品牌级或书名级标签。

长度检查只识别“明显过长”的来源标签，不负责判断来源是否真实。

### 2.5 Collocations

- `collocations` 必须是非空数组。
- 数组中的每一项必须是对象，并且只包含 `text`、`translation`。
- `text` 必须是非空字符串。
- `translation` 必须是非空字符串。
- 同一词条的 `collocations[].text` 不允许重复。
- 确定性 QA 不判断英文搭配或中文翻译的语义质量。

### 2.6 Synonyms

- `synonyms` 必须是字符串数组，数量必须在 2–4 个之间。
- 每一项必须是非空字符串。
- 同一词条的 synonyms 内部不可重复。
- synonym 不得等于当前单词自身。
- 每个 synonym 必须存在于 `DATA_SCHEMA.md` 确定的 v0.1 Core Word List 中。

脚本内维护的 Core Word List 必须与 `DATA_SCHEMA.md` 的固定 100 词范围保持一致。修改产品词表时，需要同步人工检查该常量。

---

## 3. Semantic Review

以下质量问题不能依赖第一版普通规则可靠判断，必须由人工审核。本轮不实现 AI Review：

- 例句中的单词是否与 `meaningId` 指向的义项真正语义匹配。
- collocation 的英文 `text` 是否自然、高频，并且具有 IELTS 学习价值。
- collocation 的中文 `translation` 是否准确、简洁，并与英文搭配的真实含义一致。
- synonym 是否是真实且适合辨析的近义词，而不只是相关词。
- 中文释义是否准确、自然，并且符合当前语境。
- 例句来源是否真实、可验证。

自动检查通过不代表语义质量已经通过审核。新增或修改词条时，应同时完成确定性检查和人工语义审核。

---

## 4. Review Workflow

1. 编辑词库数据。
2. 运行 `npm run validate:vocabulary`。
3. 修复全部 error，并逐项人工确认 warning。
4. 人工完成 Semantic Review。
5. 验证通过后再进入依赖该数据的下一阶段开发。
