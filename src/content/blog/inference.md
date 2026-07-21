---
title: "LLM 推理引擎系列目录"
description: "LLM 推理引擎系列索引，简要记录从朴素推理服务到 KV Cache、批处理、调度和服务化优化的学习路线。"
pubDate: 2026-07-21
draft: true
tags: ["专栏", "LLM 推理引擎"]
---

# 系列简介

这个系列记录我从零理解 LLM 推理引擎的过程。

它不会一开始就进入复杂的工程优化，而是先从一个最朴素的 LLM server 出发，逐步解释模型如何接收请求、完成 Prefill、维护 KV Cache、进入 Decode，并把生成结果返回给用户。

后续文章会继续沿着推理服务的真实瓶颈展开：为什么单请求推理效率不高，批处理和连续批处理如何提升吞吐，KV Cache 为什么会变成显存管理问题，以及调度策略如何在延迟和吞吐之间做权衡。

# 内容主线

1. 从最简单的生成流程理解 LLM server 的基本形态。
2. 拆开 Prefill、Decode 和 KV Cache，弄清楚推理阶段的主要计算和缓存。
3. 引入 batching、continuous batching 等机制，理解推理引擎如何提高 GPU 利用率。
4. 讨论 KV Cache 管理、显存分配和请求调度，理解工程实现中的主要复杂度。
5. 回到服务化视角，关注首 token 延迟、吞吐、并发、显存占用等指标。

# 文章索引

1. [从最简单的 LLM server 开始](/blog/inference-01-naive-inference/)：从朴素文本生成服务出发，介绍自回归生成、KV Cache、Prefill/Decode 阶段，以及一次完整生成请求的基本流程。

# 后续计划

- 批处理与连续批处理
- KV Cache 的分页管理
- 请求调度与抢占
- 推理服务的延迟和吞吐指标
