---
title: "课程笔记功能 Demo"
description: "课程笔记 tag 示例：展示目录编号规则、选择题模块、公式、代码、表格和常见正文样式。"
pubDate: 2026-07-18
draft: false
tags: ["课程笔记", "demo"]
---

# Demo 说明

这篇文章用于维护 `课程笔记` tag 的专属能力。只要 frontmatter 中包含 `tags: ["课程笔记"]`，文章页就会启用课程笔记样式、右侧目录、阅读进度、选择题交互、代码块增强和标题编号规则。

# 一级标题规则

这个一级标题会出现在目录里，但不会显示编号，正文中也不会显示编号。

- 一级标题用于组织大段说明，比如资料来源、复习建议、速览。
- 真正的知识点编号从 `# 知识点整理` 之后开始。

# 知识点整理

**功能展示**

## 左侧目录

`课程笔记` tag 文件会让左侧出现目录，可以通过目录跳转到想看的部分

同时目录会跟随当前阅读进度滚动，并显示进度条

## 标题编号规则

从这里开始，二级标题会显示为 `1`、`2`、`3`，三级标题会显示为 `1.1`、`1.2`。

`# 知识点整理` 本身是一级标题，只出现在目录里，不参与编号。

### 三级标题示例

这里的三级标题会跟随上一个二级标题编号。

**重点内容** 可以直接用 Markdown 加粗。行内代码如 `tags: ["课程笔记"]` 会使用课程笔记专属样式。

## 数学公式

行内公式示例：当 $a > 0$ 时，$a^2 > 0$。

块级公式示例：

$$
T(n)=2T(n/2)+O(n)=O(n\log n)
$$

## 代码块

代码块会自动加外框、语言标签、行号和复制按钮。

```ts
function hasCourseNoteTag(tags: string[]) {
  return tags.includes('课程笔记');
}
```

## 表格

| 功能 | 写法 | 效果 |
| --- | --- | --- |
| 启用课程笔记样式 | `tags: ["课程笔记"]` | 启用目录、进度、编号和题目交互 |
| 开始正文编号 | `# 知识点整理` | 从此章节内的二级标题开始编号 |
| 普通一级标题 | `# 速览` | 进目录，但不编号 |

## 选择题模块

选择题需要使用下面这种 HTML 结构。`data-answer` 是正确选项；每个 radio 的 `name` 在同一题内保持一致，不同题之间不要重复。

<div class="quiz-question" data-answer="B">
  <p class="quiz-prompt"><span class="quiz-number">1.</span><strong>课程笔记 tag 的标题编号从哪里开始？</strong></p>

  <label><input type="radio" name="course-demo-q1" value="A" /> A. 从文章第一个一级标题开始</label>
  <label><input type="radio" name="course-demo-q1" value="B" /> B. 从 `# 知识点整理` 章节内的二级标题开始</label>
  <label><input type="radio" name="course-demo-q1" value="C" /> C. 从 frontmatter 的 title 开始</label>
  <label><input type="radio" name="course-demo-q1" value="D" /> D. 所有标题都不编号</label>

  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>

  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：B。<br />解析：一级标题只显示在目录中，不编号；进入 `# 知识点整理` 后，二级及以下标题开始编号。</p>
</div>

## 引用和图片

引用适合放提醒、易错点或补充说明。

> 易错点：新增课程笔记文章时，先确认是否真的需要 tag 专属样式；普通随笔不应该加 `课程笔记` tag。

图片建议放在 `public/blog/<文章 slug>/` 下，然后在 Markdown 中用 `/blog/<文章 slug>/图片名` 引用。

