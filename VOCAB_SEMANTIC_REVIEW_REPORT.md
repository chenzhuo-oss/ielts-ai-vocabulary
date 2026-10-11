# Semantic Review Summary

## Review Scope

- Review date: 2026-09-23
- Total Words: 100
- Review basis: latest `VOCAB_SEMANTIC_REVIEW.md`, `DATA_SCHEMA.md`, and `src/data/vocabulary.json`
- Dimensions: Meaning Alignment, Example Coverage Quality, Collocation Quality, Synonym Quality, Definition Quality, Source Reliability
- Review mode: review and targeted correction of Fail, High Priority, or clearly misleading content

本轮重点复核了全部 100 个词的 `collocations[].text` 与新增的 `collocations[].translation`。英文搭配保持原有内容；中文释义按准确、简洁、与英文真实含义一致的标准逐项检查。

## Results

| Result | Count |
| --- | ---: |
| Pass | 99 |
| Review | 1 |
| Fail | 0 |
| **Total Words** | **100** |

## Priority

| Highest priority per affected word | Count | Words |
| --- | ---: | --- |
| High Priority | 0 | — |
| Medium Priority | 0 | — |
| Low Priority | 1 | `alter` |

结构 QA 通过不代表语义 QA 通过。本报告的 Pass 表示当前六个维度均未发现需要继续处理的问题；Review 表示内容仍可使用，但存在低优先级教学优化空间。

---

# Issues Requiring Review

## alter — Collocation Quality

- **Word:** `alter`
- **Dimension:** Collocation Quality
- **Status:** Review
- **Priority:** Low
- **Current Content:** `alter significantly`；中文释义：`显著改变`
- **Reason:** 英文表达和中文释义均正确，不会误导学习者；但与 `alter the outcome`、`alter perceptions` 相比，它作为不带宾语的核心搭配，教学代表性略弱。
- **Recommended Direction:** 后续独立优化流程可通过语料频率比较，判断是否需要替换为更具主动使用价值的宾语搭配。本轮不因低优先级教学偏好修改原有英文搭配。

---

# Collocation Translation Review Notes

迁移过程中对可能造成含义偏差或表达不够准确的中文释义进行了针对性修正，包括：

- 区分 `common feature` 的“常见特征”与“共同特征”。
- 将 `notable example` 准确表达为“值得注意的例子”。
- 将 `have merit` 表达为“有可取之处”。
- 区分 `generate results` 的“产生结果”与 `achieve results` 的“取得成果”。
- 对 `gain access to`、`facilitate access` 等含 `access` 的搭配采用符合各自动词语义的中文表达。

复核完成后，未发现 collocation translation 的 Fail、High Priority 或未解决的明显误导问题。

---

# Sampling Notes

以下词条可作为本次 collocation 对象结构和翻译质量的抽样样例：

- `significant`：`significant increase → 显著增长`、`significant impact → 重大影响`、`significant difference → 显著差异`，均自然且适合 IELTS 写作。
- `escalate`：三条搭配分别覆盖紧张局势加剧、升级为冲突和迅速升级，中文释义保持了语义差异。
- `methodology`：研究场景明确，`research methodology → 研究方法论` 等译文简洁且符合学术语境。
- `acquire`：知识、技能和语言三个典型宾语覆盖合理，中文分别使用“获取”“掌握”“习得”。
- `intention`：覆盖名词搭配和两个常见语法框架，译文简洁且未扩展为长句解释。
