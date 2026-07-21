---
title: "从最简单的 LLM server 开始"
description: "LLM 推理引擎入门第一篇，从最朴素的生成服务器出发，梳理自回归生成、KV Cache、Prefill/Decode 阶段和一次完整文本生成流程。"
pubDate: 2026-07-21
draft: false
tags: ["专栏", "LLM 推理引擎"]
---

使用诸如 ChatGPT、Claude 这样的大语言模型应用

本质都是经过**推理服务器**执行下面的步骤：

1. 系统将模型加载到内存
2. 接收用户输入
3. 通过模型逐个生成 token（词元）
4. 通过网络发回结果

# 基础概念：自回归生成

> token 是一种文本单位，可以类比成一个字/词
>
> + 往往一个固定含义的搭配会形成一个 token，用于将句子拆解为具体语义的组合
>
>   比如*大语言模型*这个词会被拆解为**大**、**语言**、**模型**三个 token
>
> + 除此之外还会有一些辅助性的 token，比如可能有 `BOS` 表示句子开始，`EOS` 表示一个句子结束等
>
> 可以在 [dqbd/tiktokenizer: Online playground for OpenAPI tokenizers](https://github.com/dqbd/tiktokenizer) 的在线网站体验一下字词和 token 的关系

大语言模型逐个 token 生成文本，当输入一串文字后，模型预测下一个 token，

拼上这个 token 后，模型又会接着预测再下一个 token，直至输出整个句子

这种**根据已有内容，逐个预测下一个内容，直至生成完整内容的模式**称为**自回归生成**（Autoregressive Generation）

```
input: The capital of France is
step 0: [The] [capital] [of] [France] [is]
step 1: model([The] [capital] [of] [France] [is]) -> [Paris]
step 2: model([The] [capital] [of] [France] [is] [Paris]) -> [.]
step 3: model([The] [capital] [of] [France] [is] [Paris] [.]) -> [EOS]
output: The capital of France is Paris.
```

一个问题是，每次生成要输入之前所有 token，不难发现大量 token 被重复处理，至少所有输入 token 在每个输出 token 的计算中都会被重复处理

解决办法是 [KV Cache](#kv-cache)

# 核心原理

本节介绍 Prefill（预填充）、KV Cache（键值缓存） 和 Decode（解码）

## KV Cache

> 注意力机制：
>
> 每个输入 token 计算 QKV 向量：
>
> + Query：自主性提示，正在查询什么特征？
> + Key：非自主性提示，包含什么特征？
> + Value：非自主性提示，特征的值
>
> $QK^T$ 表示查询特征和拥有特征做匹配，得到注意力打分
>
> 注意力打分表示对特征的关注权重，被关注特征的值会贡献更多到最终输出

已有前 $n-1$ 个 token，计算第 $n$ 个 token：
$$
\alpha_i=\text{softmax}(\frac{Q_{n-1}K_i^T}{\sqrt d})\quad \forall i=1,\ldots,n-1 \\
h_n=\sum_{i=1}^{n-1} \alpha_iV_i \\
P(t_n)=\text{softmax}(W_oh_n)

$$
其中 $d$ 是特征维度大小，是一个**常数**；$W_o$ 是**可学习矩阵**，映射得到 token $a$ 的概率向量 $P(t_n=a)$

注意到每次计算的时候需要**前面所有** $K,V$ 向量，而 $Q$ 向量却**只使用一次**

因此可以考虑缓存 KV 向量，这样原本的 QKV 计算只需要对每个 token 进行一次，复杂度从 $O(n^2)$ 次 QKV 计算降低到 $O(n)$ 次

## 推理的两个阶段：Prefill 和 Decode

**Prefill 阶段**：

+ 模型一次性处理所有 prompt（提示词），所有 token 被输入模型，计算 KV 和最后一个 token 的 Q

  其他 Q 也会计算，但之后不会用到

+ 这一阶段**计算密集**，CPU/GPU 会一直处于活跃的计算状态

+ 特别的，prefill 计算可以用矩阵乘法和遮罩批量实现，高效利用 GPU，因此平摊下来计算开销很小

  通常每个 token 需要 $5\sim 20$ ms

**Decode 阶段**：

+ 模型逐个预测下一个 token，每一步只计算最新 token 的 QKV

  但为了计算注意力值，必须从内存读取所有 KV 值

+ 这一阶段**受内存限制**，虽然处理单个 token 计算时间很短，但加载所有 KV 值却相当耗时

+ 计算开销很小，因此内存访问开销明显

  通常每个 token 需要 $30\sim 250$ ms

# 一次完整的生成流程

1. 输入文本通过**分词器 tokenizer** 变成整数 token id 的序列
2. Prefill：计算输入的所有 KV，采样预测第一个输出 token
3. Decode：不断循环，每次计算最新输出 token 的 QKV，采样预测下一个 token，直至到达 `EOS`
4. 将输出的 token id 序列通过 detokenizer 恢复成输出文本

详细可以参考 [microgpt](https://gist.github.com/karpathy/8627fe009c40f57531cb18360106ce95)

这是一个 200 行，无额外依赖，可以直接用 python 运行的极简 gpt 模型，虽然缺少 MoE 等机制，但对理解 GPT 的基本算法很有帮助
