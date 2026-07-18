---
title: "强化学习"
description: "基于强化学习原始笔记整理的中文通用学习资料，覆盖 MDP、DP、MC、TD、函数近似、DQN、策略梯度、多智能体、分布式 RL 和 CFR。"
pubDate: 2026-07-18
draft: false
tags: ["课程笔记"]
---

# 原笔记信息
- 原笔记来源：[强化学习.md](https://github.com/zhy12138/class_notes/blob/main/%E5%BC%BA%E5%8C%96%E5%AD%A6%E4%B9%A0/%E5%BC%BA%E5%8C%96%E5%AD%A6%E4%B9%A0.md)
- **本资料由原笔记蒸馏整理，建议配合原笔记查漏补缺。**

# 复习 / 预习建议
- 先用 MDP 统一语言：状态、动作、奖励、转移、折扣、策略、价值函数是后续所有算法的共同接口。
- 预习时按“有模型 DP -> 无模型 MC/TD -> 模型学习 Dyna -> 函数近似 -> 深度 RL -> 策略方法”推进。
- 复习时重点比较 DP、MC、TD 的更新目标、是否 bootstrap、是否需要模型、是否必须等 episode 结束。
- 深度 RL 部分优先掌握 DQN 稳定训练的两个关键技巧：经验回放和目标网络，再看 Double/Dueling/Rainbow。
- 多智能体和 CFR 章节内容广，建议先抓框架和适用场景，再回到具体案例查算法组合。

# 速览
- 强化学习研究智能体与环境交互，通过奖励反馈改进行为；标准模型是 MDP $M=<S,A,P,R,\gamma>$。
- 价值函数法的核心是估计状态或动作价值，再由价值导出策略；策略梯度法直接参数化策略并优化策略目标。
- DP 需要已知环境模型并使用 bootstrap；MC 不需要模型、不 bootstrap，但需要完整片段；TD 不需要模型、使用 bootstrap，可在线更新。
- Sarsa 是 on-policy，Q-learning 是 off-policy，Expected Sarsa 用期望替代单次采样，Double Q-learning 缓解最大化带来的高估。
- Dyna 把真实交互、模型学习和规划结合起来；Dyna-Q+ 用探索红利适应环境变化，优先扫描提高回溯效率。
- 函数近似用于状态空间过大时，用 $\hat v(s,W)$ 或 $\hat q(s,a,W)$ 泛化到未见状态；半梯度 TD 更新目标中含当前估计。
- DQN 用神经网络近似 $Q$，经验回放降低样本相关性，目标网络稳定 target，Rainbow 综合多种改进。
- Actor-Critic 用 critic 估计价值/优势，用 actor 更新策略；TRPO/PPO 控制策略更新幅度，DDPG 面向连续动作控制。
- 多智能体 RL 关注 self-play、CTDE、合作/竞争/非完美信息；CFR 用反事实遗憾最小化求非完美信息博弈均衡。

# 知识点整理

## 强化学习基础与有限 MDP

本章建立强化学习的基本语言。智能体根据状态选择动作，环境返回奖励和新状态；算法目标是在长期累计收益意义下找到好策略。预习时先记清 MDP 五元组和价值函数；复习时重点区分 episode/continuing、状态价值/动作价值、贝尔曼期望方程/最优方程。

### 强化学习交互框架

- 强化学习特点：智能体与有内在规则的环境交互，获得反馈，基于反馈改进行为，以获得满意结果。

![智能体与环境的交互循环](/blog/reinforcement-learning/agent-environment-loop.png)

- 强化学习模型通常写成马尔科夫决策过程：
  $$
  M=<S,A,P,R,\gamma>
  $$
  - $S$：状态集合。
  - $A$：动作集合。
  - $P(s,a,s')=\Pr[s'|s,a]$：状态转移概率。
  - $R(s,a,r)=\Pr[r|s,a]$：奖励概率。
  - $\gamma$：折扣因子。
- 策略：
  $$
  \pi(s,a)=\Pr[a|s]
  $$
- 目标是寻找最优策略 $\pi$，使期望累积收益最大：
  $$
  \mathbb E[\sum_{i=1}^n \gamma^i r_i|M,\pi]
  $$
- 基本思想：对每个状态估值，选择下一状态估值最高的动作；同时需要在利用已有高价值动作和探索未知动作之间平衡。

### 井字棋和值函数思想

- 建立值函数表：胜利状态值为 1，失败状态值为 0，其余状态初始为 0.5。
- 与对手多次对局：大多数时间选择下一步价值最大的动作（利用），偶尔随机选择（探索）。
- 边下边更新状态价值：
  $$
  V(s_t)\leftarrow V(s_t)+\alpha(V(s_{t+1})-V(s_t))
  $$
- 直觉：把后继状态的新估计反向传给当前状态，让当前状态更接近真实胜率。

### 多臂老虎机

- 动作价值：
  $$
  Q^*(a)\approx \mathbb E[R_t|A_t=a]
  $$
- 样本平均估计：
  $$
  Q_t(a)=\frac{\sum R_i[A_i=a]}{\sum [A_i=a]}
  $$
  多次采样后收敛到真实动作价值。
- 贪心法总选 $Q_t(a)$ 最大动作，容易缺少探索。
- $\varepsilon$-贪心法：大概率选择当前最优动作，小概率随机选动作。
- 增量平均：
  $$
  Q_{n+1}=Q_n+\frac{1}{n}[R_n-Q_n]
  $$
- 非平稳问题可用常数步长：
  $$
  Q_{n+1}=Q_n+\alpha[R_n-Q_n]
  $$
  新数据权重更高。
- 乐观初值可促进纯贪心方法探索，因为所有实际反馈初期都低于初始估值。
- UCB 动作选择：
  $$
  A_t=\arg\max_a Q_t(a)+c\sqrt{\frac{\ln t}{N_t(a)}}
  $$
  左项是当前估值，右项鼓励尝试次数少的动作。
- 梯度强盗算法用 softmax 选择动作：
  $$
  \Pr[A_t=a]=\frac{e^{H_t(a)}}{\sum_i e^{H_t(i)}}
  $$
  若当前动作奖励高于平均奖励，就提高它的偏好值。

![多臂老虎机算法参数敏感性比较](/blog/reinforcement-learning/bandit-parameter-comparison.png)

- 原笔记用超参数取值与前 1000 步平均收益曲线围成面积评价方法，兼顾最佳性能和参数敏感性；UCB 表现较强。

### 有限 MDP

- MDP（Markov Decision Process）强调马尔科夫性：状态决策不取决于历史。
- Agent 是学习者和决策者；Environment 包含智能体之外的一切。
- 交互序列：
  $$
  S_0,A_0,R_1,S_1,A_1,\ldots
  $$
- MDP 三要素：动作、状态、奖励。奖励描述目标，而不是描述如何达到目标。
- 收益 $G_t$ 表示站在 $S_t$ 上往后看的长期收益。
- 事件性任务（episodic task）自然终止：
  $$
  G_t=R_{t+1}+R_{t+2}+\cdots+R_T
  $$
- 持续性任务（continuing task）用折扣累计：
  $$
  G_t=\sum_{i=0}^{\infty}\gamma^iR_{t+1+i},\quad G_t=R_{t+1}+\gamma G_{t+1}
  $$
- 吸收态到达后永远循环且奖励为 0，可把事件性任务并入持续性建模。
- 策略：
  $$
  \pi(a|s)=\Pr[A_t=a|S_t=s]
  $$
- 状态价值：
  $$
  v_\pi(s)=\mathbb E[G_t|S_t=s]
  $$
- 动作价值：
  $$
  q_\pi(s,a)=\mathbb E[G_t|S_t=s,A_t=a]
  $$
- 价值可从经验中用均值拟合，也可用带参数函数近似，避免给每个状态单独存值。
- 贝尔曼期望方程：
  $$
  v_\pi(s)=\sum_a\pi(a|s)\sum_{s',r}p(s',r|s,a)(r+\gamma v_\pi(s'))
  $$
  $$
  q_\pi(s,a)=\sum_{s',r}p(s',r|s,a)(r+\sum_{a'}\pi(a'|s')q_\pi(s',a'))
  $$
- 贝尔曼最优方程：
  $$
  v^*(s)=\max_a\sum_{s',r}p(s',r|s,a)(r+\gamma v^*(s'))
  $$
  $$
  q^*(s,a)=\sum_{s',r}p(s',r|s,a)[r+\gamma\max_{a'}q^*(s',a')]
  $$
- 有限 MDP 的贝尔曼最优方程有唯一解；最优价值唯一，但最优策略可不唯一。

<div class="quiz-question" data-answer="A">
  <p><strong>1. 强化学习中 MDP 五元组 $M=&lt;S,A,P,R,\gamma&gt;$ 的 $P$ 表示什么？</strong></p>

  <label>
    <input type="radio" name="q1" value="A" />
    A. 给定状态和动作后转移到下一状态的概率
  </label>
  <label>
    <input type="radio" name="q1" value="B" />
    B. 策略在状态下选择动作的概率
  </label>
  <label>
    <input type="radio" name="q1" value="C" />
    C. 价值函数的参数向量
  </label>
  <label>
    <input type="radio" name="q1" value="D" />
    D. 当前 episode 的终止时间
  </label>

  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>

  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>
    正确答案：A。<br />解析：$P(s,a,s')=\Pr[s'|s,a]$ 是状态转移函数；策略选择动作的概率通常写作 $\pi(a|s)$。
  </p>
</div>

## 动态规划、蒙特卡洛与时序差分

本章是表格型强化学习的核心比较。DP 有模型、bootstrap；MC 无模型、不 bootstrap、等 episode 结束；TD 无模型、bootstrap、可在线更新。预习时先掌握三者的更新目标，复习时重点对比 on-policy/off-policy 和 Sarsa/Q-learning。

### 动态规划

- 动态规划假设环境已知，使用 bootstrap：用后继状态价值计算当前状态价值。
- 两个目标：
  - 预测：给定 MDP 和策略 $\pi$，求 $v_\pi/q_\pi$。
  - 控制：给定 MDP，求 $v^*/q^*$ 和 $\pi^*$。
- 策略估值：给定 $\pi$，用贝尔曼方程迭代到 $\max_s|v_t(s)-v_{t+1}(s)|$ 足够小。
- 同步迭代需要新旧双数组；异步迭代可单数组原位更新，通常更快。
- $v_\pi$ 存在唯一的条件：$\gamma<1$，或在 $\pi$ 下所有状态一定终止。
- 策略提升：在当前值函数上贪心改进策略。
- 策略迭代：交替策略估值和策略提升，有限 MDP 中有限步收敛。
- 值迭代：策略估值只迭代一轮就提升，本质是直接用贝尔曼最优方程更新值。
- 广义策略迭代（GPI）：估值与策略提升交替发生，二者既拮抗又协同，在条件满足时收敛到最优策略。

### 蒙特卡洛方法

- 蒙特卡洛不需要构建环境模型，不使用 bootstrap，只从与环境交互产生的 episode 中学习。
- MC 需要片段最终终止，因此适合 episodic task。
- MC 可聚焦局部采样；DP 通常必须全局更新。
- MC 预测：
  - 用策略生成一条终止路径。
  - 对路径中状态，从该状态之后的累计收益加入收益集合。
  - 用收益平均值估计状态价值。
- 首次访问 MC 只用 episode 中状态首次出现后的收益；每次访问 MC 使用该状态每次出现后的收益。
- 动作价值需要保证所有状态-动作都被探索，可用探索性起步、soft 策略、$\varepsilon$-soft 或 $\varepsilon$-greedy。
- MC 控制中，不必等值函数收敛后再改策略，每采样一次就可以提升。
- on-policy：采样策略和被评估/提升的策略相同。
- off-policy：目标策略 $\pi$ 与行为策略 $b$ 不同；要求覆盖，即 $\pi(a|s)>0$ 时 $b(a|s)>0$。
- 重要性采样比：
  $$
  \rho_t^T=\frac{\prod \pi(A_i|S_i)p(S_{i+1}|S_i,A_i)}{\prod b(A_i|S_i)p(S_{i+1}|S_i,A_i)}
  $$
  环境转移概率会约掉，本质是用行为策略样本估计目标策略价值。
- 普通重要性采样：
  $$
  V_\pi(s)=\frac{\sum N_iG_i\rho_i}{\sum N_i}
  $$
- 加权重要性采样：
  $$
  V_\pi(s)=\frac{\sum N_iG_i\rho_i}{\sum N_i\rho_i}
  $$
  初期偏差更有界，但仍需足够采样。
- off-policy 的局限：若好轨迹在目标策略下概率低，重要性采样比小，它对更新影响也会被压低。

### TD 预测和控制

- TD 利用一步后的状态估值更新当前估值，且无需等 episode 结束：
  $$
  V(S_t)+=\alpha[R_{t+1}+\gamma V(S_{t+1})-V(S_t)]
  $$
- TD target 是 $R_{t+1}+\gamma V(S_{t+1})$；MC target 是 $G_t$。
- TD 有 bootstrap，因此方差较低但有偏差，且受初值和当前估值影响；MC 无偏但方差较高。
- Sarsa 是 on-policy 控制：
  $$
  Q(s,a)+=\alpha[R+\gamma Q(s',a')-Q(s,a)]
  $$
  其中 $a'$ 来自当前 $\varepsilon$-greedy 行为策略。
- Q-learning 是 off-policy 控制：
  $$
  Q(s,a)+=\alpha[R+\gamma\max_{a'}Q(s',a')-Q(s,a)]
  $$
  行为策略可探索，目标策略是贪心策略。
- Expected Sarsa 用期望替代单次 $a'$ 采样：
  $$
  Q(s,a)+=\alpha\left[R+\gamma\sum_{a'}\pi(a'|s')Q(s',a')-Q(s,a)\right]
  $$
- $\pi=b$ 时是 on-policy；$\pi=greedy$ 时接近 Q-learning。
- Double Q-learning 维护 $Q_1,Q_2$，一个网络选动作、另一个网络估目标，缓解 $\max$ 造成的高估：
  $$
  Q_1(S_t,A_t)+=\alpha[R_{t+1}+\gamma Q_2(S_{t+1},\arg\max_aQ_1(S_{t+1},a))-Q_1(S_t,A_t)]
  $$

<div class="quiz-question" data-answer="C">
  <p><strong>2. 下列哪项最准确地区分 MC 和 TD？</strong></p>

  <label>
    <input type="radio" name="q2" value="A" />
    A. MC 必须知道环境模型，TD 不需要奖励
  </label>
  <label>
    <input type="radio" name="q2" value="B" />
    B. MC 使用 bootstrap，TD 不使用 bootstrap
  </label>
  <label>
    <input type="radio" name="q2" value="C" />
    C. MC 通常等 episode 结束用 $G_t$ 更新，TD 可用一步后的估值在线更新
  </label>
  <label>
    <input type="radio" name="q2" value="D" />
    D. MC 只能做控制，TD 只能做预测
  </label>

  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>

  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>
    正确答案：C。<br />解析：MC target 是完整回报 $G_t$，通常需要片段结束；TD target 用 $R_{t+1}+\gamma V(S_{t+1})$，可在线更新。
  </p>
</div>

<div class="quiz-question" data-answer="D">
  <p><strong>3. Q-learning 相对 Sarsa 的 off-policy 特征体现在哪里？</strong></p>

  <label>
    <input type="radio" name="q3" value="A" />
    A. Q-learning 不需要状态
  </label>
  <label>
    <input type="radio" name="q3" value="B" />
    B. Q-learning 必须等 episode 结束才更新
  </label>
  <label>
    <input type="radio" name="q3" value="C" />
    C. Q-learning 的行为策略和目标策略都必须完全随机
  </label>
  <label>
    <input type="radio" name="q3" value="D" />
    D. Q-learning 可用探索策略采样，但更新目标使用下一状态的贪心最大值
  </label>

  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>

  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>
    正确答案：D。<br />解析：Sarsa 的下一动作 $a'$ 来自行为策略；Q-learning 的 target 使用 $\max_{a'}Q(s',a')$，体现目标策略是贪心策略。
  </p>
</div>

## n 步方法、Dyna 与函数近似

本章把 MC、TD 和规划连接起来。n 步方法用步数在 TD 与 MC 之间插值，Dyna 把模型学习和真实交互结合，函数近似则解决状态空间过大时无法打表的问题。预习时抓“插值”和“泛化”两个关键词；复习时重点掌握 Dyna-Q 流程、半梯度更新和平均回报设置。

### n 步 TD 和 off-policy 扩展

- n 步 TD target：
  $$
  G_{t:t+n}=R_{t+1}+\gamma R_{t+2}+\cdots+\gamma^{n-1}R_{t+n}+\gamma^nV_{t+n-1}(S_{t+n})
  $$
- 更新：
  $$
  V_{t+n}(S_t)=V_{t+n-1}(S_t)+\alpha[G_{t:t+n}-V_{t+n-1}(S_t)]
  $$
- $n=1$ 时是 TD(0)，$n$ 趋向 episode 长度时接近 MC。
- n-step Sarsa 将 target 改成 n 步奖惩和。
- n-step Expected Sarsa 在最后一步对动作价值取策略期望。
- n-step off-policy 用重要性采样比把行为策略样本转到目标策略：
  $$
  \rho_{t:h}=\prod_{k=t}^h\frac{\pi(A_k|S_k)}{b(A_k|S_k)}
  $$
- n-step tree-backup 不使用重要性采样比，而是在每一步展开所有未采样动作的期望；采样路径像主干，其他动作期望像分支。
- n-step $Q(\sigma)$ 用 $\sigma_t$ 在“完全采样”和“完全期望”之间插值。

### 模型、规划和 Dyna

- 模型给定 $s,a$ 后产生 $s',r$。
- 分布模型给出概率分布，DP 使用分布模型。
- 样本模型按概率输出一组样本 $s',r$。
- 制表法可把每个 $(S_t,A_t)$ 对应的 $(S_{t+1},R_{t+1})$ 存入表中。

![规划与 Dyna 的关系](/blog/reinforcement-learning/planning-vs-dyna.png)

- Dyna-Q 流程：
  - 初始化 $Q(s,a)$ 和 $Model(s,a)$。
  - 按 $\varepsilon$-greedy 选动作，与环境交互得到 $R,S'$。
  - 用 Q-learning 更新 $Q$。
  - 更新模型 $Model(S,A)=(S',R)$。
  - 额外循环 $n$ 次，从已采样过的 $(S,A)$ 中随机选择，用模型生成的 $S',R$ 再更新 $Q$。
- Dyna-Q+ 加入探索红利：
  $$
  Q(s,a)+=\alpha\left[r+\gamma\left(K\sqrt{\tau}+\max_{a'}Q(s',a')\right)-Q(s,a)\right]
  $$
  其中 $\tau$ 是未访问时间，用于环境变化时鼓励重新探索。
- 优先扫描维护优先队列，根据 TD 误差大小优先回溯重要状态。
- Expected 更新枚举所有转移，慢但无采样误差；Sample 更新快但有采样误差。分支多或概率偏斜时，sample 往往更高效。
- 轨迹采样中 on-policy 初期更新快；uniform 在所有状态都估得差不多后更优。

### 函数近似预测

- 状态太多时，用参数函数近似价值：
  $$
  \hat v(s,\vec W)\approx v(s)
  $$
- 近似不是让单个状态越准越好，而是平衡各状态价值，并能泛化到未见状态。
- 强化学习训练数据不断累积，且目标函数会随策略变化而变化。
- MSVE：
  $$
  \overline{VE}(w)=\sum_{s\in S}\mu(s)[V_\pi(s)-\hat v(s,W)]^2
  $$
- SGD 更新：
  $$
  W_{t+1}=W_t+\alpha[v_\pi(S_t)-\hat v(S_t,W_t)]\nabla\hat v(S_t,W_t)
  $$
  实际用无偏估计 $U_t$ 代替未知的 $v_\pi(S_t)$。
- MC 可用 $G_t$ 作为 $U_t$。
- TD 半梯度更新：
  $$
  W_{t+1}=W_t+\alpha[R_{t+1}+\gamma\hat v(S_{t+1},W_t)-\hat v(S_t,W_t)]\nabla\hat v(S_t,W_t)
  $$
  因为没有对 target 中的 $\hat v(S_{t+1},W_t)$ 求导，所以是 semi-gradient。
- 状态聚合把多个状态视为一个状态，共享估值。
- 线性近似：
  $$
  \hat v(s,w)=w^Tx(s)
  $$
  只有一个最优解；MC 保证收敛到全局最优，TD 收敛到近似局部最优。
- 特征函数包括多项式特征、傅里叶特征、粗编码、瓦片编码。
- 瓦片编码中每个点激活特征数固定，学习率更容易设置。
- 神经网络可用于非线性函数逼近，能处理复杂状态空间并泛化，但需要大量数据，可能局部最优且解释性弱。

### 近似控制、平均回报和资格迹

- 轨迹式半梯度一步 Sarsa：
  $$
  W_{t+1}=W_t+\alpha[U_t-\hat q(S_t,A_t,W_t)]\nabla\hat q(S_t,A_t,W_t)
  $$
  其中
  $$
  U_t=R_{t+1}+\gamma\hat q(S_{t+1},A_{t+1},W_t)
  $$
- n 步半梯度 Sarsa 用 $G_{t:t+n}$ 替代一步 target。
- 控制任务中 MC 必须等 episode 结束，可能采出很差轨迹，因此不总适用。
- 持续性任务用平均回报评价策略：
  $$
  r(\pi)=\sum_s\mu_\pi(s)\sum_a\pi(a|s)\sum_{s',r}p(s',r|s,a)r
  $$
- 遍历性假设：稳态分布存在且不依赖初始状态。
- 平均回报设置中，用即时回报与平均回报之差形成差分回报，去掉折扣因子。
- $\lambda$-return：
  $$
  G_t^\lambda=(1-\lambda)\sum_{n=1}^{\infty}\lambda^{n-1}G_{t:t+n}
  $$
  是 TD 和 MC 的加权结合。
- Offline $\lambda$-return 是前向视角：episode 结束后计算 $G_t^\lambda$ 再更新。
- TD($\lambda$) 是后向视角，用资格迹 $z$ 保存历史梯度加权和：
  $$
  z=(\gamma\lambda)z+\nabla\hat v(S,W)
  $$
  $$
  W+=\alpha\delta z
  $$
- $\lambda=0$ 退化到 TD(0)；当 $\lambda=\gamma=1$ 时接近在线 MC/TD(1)。

<div class="quiz-question" data-answer="A">
  <p><strong>4. Dyna-Q 与普通 Q-learning 的关键区别是什么？</strong></p>

  <label>
    <input type="radio" name="q4" value="A" />
    A. Dyna-Q 除真实交互更新外，还学习模型并用模型样本做额外规划更新
  </label>
  <label>
    <input type="radio" name="q4" value="B" />
    B. Dyna-Q 不需要奖励函数
  </label>
  <label>
    <input type="radio" name="q4" value="C" />
    C. Dyna-Q 只能用于连续动作空间
  </label>
  <label>
    <input type="radio" name="q4" value="D" />
    D. Dyna-Q 完全不与真实环境交互
  </label>

  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>

  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>
    正确答案：A。<br />解析：Dyna-Q 把直接 RL、模型学习和规划结合起来，真实交互后还会用已学模型生成样本继续更新 $Q$。
  </p>
</div>

## DQN 与策略梯度

本章进入深度强化学习。DQN 把 Q-learning 与神经网络结合，重点是稳定训练；策略梯度则直接优化策略分布，重点是方差控制、优势函数和更新幅度约束。预习时先理解价值方法和策略方法的差别；复习时重点掌握 DQN 两个稳定技巧、REINFORCE、Actor-Critic、PPO clip。

### DQN

- 价值函数近似目标：
  $$
  \min_WJ(W)=\mathbb E_{s\sim d_\pi}[(v_\pi(s)-V(s;W))^2]
  $$
- 梯度可用 batch GD、SGD 或 mini-batch GD 估计。
- 真实价值未知时，可用 MC 的 $G_t$、TD(0) 的 $R_{t+1}+\gamma V(S_{t+1};W)$、TD($\lambda$) 的 $G_t^\lambda$ 代替。
- Fitted Q-iteration 使用固定样本集 $\langle S_i,A_i,S'_i,R_{i+1}\rangle$，反复构造：
  $$
  y_i=r_{i+1}+\gamma\max_{a'}Q_w(S_i',a')
  $$
  再拟合 $Q_w(s_i,a_i)$。
- 在线 Q-learning 每采样一步就用神经网络做梯度更新。
- 经验回放池缓解时间相近样本的强相关性：交互样本存入缓存，再从缓存 mini-batch 采样训练。
- 目标网络定期同步参数 $w'$，target 使用：
  $$
  y_i=r_i+\gamma\max_{a'}Q_{w'}(s_i',a')
  $$
  避免当前网络同时决定估值和目标导致训练不稳定。
- Double DQN 缓解高估：
  $$
  y_i=r_i+\gamma Q_{w'}(s',\arg\max_{a'}Q_w(s',a'))
  $$
  当前网络选动作，目标网络估值。
- Dueling DQN 拆分：
  $$
  Q(s,a)=V(s)+A(s,a)
  $$
  实际会减去优势项最大值或平均值，避免分解不唯一。
- 优先经验回放按 TD 误差或 TD 误差排名提高重要样本采样概率，并用权重修正样本相关性。
- Rainbow 综合 Double、优先回放、Dueling、Multi-step、Distributional RL、Noisy Nets；消融实验中 multi-step 和优先经验回放影响较大。

### 策略梯度和 REINFORCE

- 基于价值的方法先学价值再选动作，计算量小、较稳定。
- 基于策略的方法直接学习策略：
  $$
  \pi(a|s,\theta)=\Pr[A_t=a|S_t=s,\theta_t=\theta]
  $$
- 策略函数要求可导、导数有界，并保持探索性：$\pi(a|s,\theta)\in(0,1)$。
- 离散动作常用 softmax：
  $$
  \pi(a|s,\theta)=\frac{\exp(h(s,a,\theta))}{\sum_b\exp(h(s,b,\theta))}
  $$
- 策略梯度定理：
  $$
  \nabla J(\theta)=\sum_s\mu_\pi(s)\sum_aq_\pi(s,a)\nabla_\theta\pi(a|s,\theta)
  $$
- REINFORCE：
  $$
  \nabla J(\theta)=\mathbb E_\pi[\gamma^tG_t\nabla_\theta\log\pi(A_t|S_t,\theta)]
  $$
- 更新：
  $$
  \theta+=\alpha\gamma^tG_t\nabla_\theta\log\pi(A_t|S_t,\theta)
  $$
- REINFORCE 理论上可收敛，但作为 MC 方法方差大、学习慢。
- baseline 不改变期望梯度：
  $$
  \sum_ab(s)\nabla_\theta\pi(a|s,\theta)=b(s)\nabla_\theta1=0
  $$
- REINFORCE with baseline 用 $\delta_t=G_t-\hat v(S_t,W)$ 区分同一状态下动作好坏，降低方差。

### Actor-Critic、A2C/A3C、TRPO/PPO、DDPG

- Actor-Critic 把 baseline 中的 MC 换成 TD(0)：
  $$
  \delta=R+\gamma\hat v(S',W)-\hat v(S,W)
  $$
  actor 用 $\delta$ 更新策略，critic 用 $\delta$ 更新价值函数。
- A2C 使用优势函数：
  $$
  \hat A^\pi=\hat Q^\pi-\hat V^\pi
  $$
  用基线降低方差。
- A3C 使用多个 worker 异步采样和计算局部策略梯度，再异步更新全局网络。

![A3C 中同步与异步更新比较](/blog/reinforcement-learning/a3c-sync-async.png)

- 同步更新等待所有 worker，通信和慢线程会拖慢；异步更新效率高，但可能用旧模型采样的数据更新新模型。
- TRPO 用 KL 散度限制策略单次更新幅度：
  $$
  \theta_{t+1}=\arg\max_\theta L(\theta_t,\theta),\quad D_{KL}(\theta||\theta_t)\leq\delta
  $$
  局限是二阶优化复杂、计算慢。
- PPO 用一阶优化近似 TRPO。主流 PPO-clip 约束概率比：
  $$
  \min\left(r_tA_t,\texttt{clip}(r_t,1-\varepsilon,1+\varepsilon)A_t\right)
  $$
  其中 $r_t=\frac{\pi_\theta(a|s)}{\pi_{\theta_t}(a|s)}$。
- PPO 常见实现同时训练策略网络和值网络，使用 GAE 计算 advantage，多轮复用 batch，并加入熵正则鼓励探索。
- DDPG 面向连续控制：使用经验回放、目标网络、Actor-Critic、确定性策略、动作噪声探索、软更新目标网络：
  $$
  \theta'=\tau\theta+(1-\tau)\theta'
  $$

<div class="quiz-question" data-answer="B">
  <p><strong>5. 原始 DQN 中目标网络的主要作用是什么？</strong></p>

  <label>
    <input type="radio" name="q5" value="A" />
    A. 让动作空间从离散变为连续
  </label>
  <label>
    <input type="radio" name="q5" value="B" />
    B. 用较慢更新的网络计算 target，提升训练稳定性
  </label>
  <label>
    <input type="radio" name="q5" value="C" />
    C. 完全替代经验回放池
  </label>
  <label>
    <input type="radio" name="q5" value="D" />
    D. 保证策略梯度无偏
  </label>

  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>

  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>
    正确答案：B。<br />解析：目标网络参数 $w'$ 定期同步，用它计算 TD target，避免当前网络同时快速改变预测值和目标值。
  </p>
</div>

<div class="quiz-question" data-answer="C">
  <p><strong>6. REINFORCE with baseline 中 baseline 的作用是什么？</strong></p>

  <label>
    <input type="radio" name="q6" value="A" />
    A. 改变策略梯度的期望方向，使算法变成 Q-learning
  </label>
  <label>
    <input type="radio" name="q6" value="B" />
    B. 消除对策略函数可导性的要求
  </label>
  <label>
    <input type="radio" name="q6" value="C" />
    C. 不改变期望梯度，但降低方差并区分同一状态下动作好坏
  </label>
  <label>
    <input type="radio" name="q6" value="D" />
    D. 让算法不再需要采样完整 episode
  </label>

  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>

  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>
    正确答案：C。<br />解析：baseline 项对动作概率梯度求和为 0，因此不改变期望；它通过减去状态价值降低方差。
  </p>
</div>

## 多智能体强化学习与案例

多智能体部分关注多个策略同时学习时的非平稳性、合作/竞争关系和信息不对称。原笔记先介绍 self-play 和 CTDE 框架，再列举围棋、麻将、德扑、星际、Dota、王者荣耀等系统案例。预习时先抓框架；复习时重点记每类问题的训练结构和典型算法。

### 博弈建模与 self-play

- 完美信息：没有信息不对称，通常双方轮流决策。
- 非完美信息本质是信息不对称；同步决策一定是非完美信息，随机和轮流决策也可能带来非完美信息。
- Normal-form game：同步决策、单回合，用表格建模。
- Extensive-form game：多回合，用决策树建模；同步决策可通过“依次行动但互不可见”转成扩展式。
- 非完美信息下通常讨论均衡，而不是最优解。
- Fictitious Play：反复对局，记录对手历史平均策略，下一回合使用对应最佳策略；所有玩家这样做可收敛到纳什均衡。
- Fictitious Self-play 扩展到扩展式博弈，在每个信息集记录对手平均策略并选择最佳策略。
- Neural Fictitious Self-play 使用两个网络：平均策略网络和当前策略网络/Q 网络；当前策略与平均策略对打，RL 训练当前策略，样本更新平均策略。
- Double Oracle：初始只考虑策略子集，在该子集上求 NE，再把最优应对加入集合，反复迭代。
- Policy-Space Response Oracles 统一 FSP/DO：维护策略集合，计算元策略，以元策略为对手训练最优应对，再加入集合。
- 实践中的 self-play 对手选择包括最新模型、固定比例、最新若干模型随机、按表现优先、种群训练等。

### CTDE

- CTDE：Centralized Training, Decentralized Execution，即集中训练、分散执行。
- 纯合作问题中所有 agent 共享团队 reward，难点是 credit assignment：奖励好坏不一定由某个 agent 独立造成，容易出现 lazy agent。
- VDN 假设团队收益可拆成个人 $Q_i$ 之和，用 $\sum Q_i(s_i,a_i)$ 拟合团队收益。
- QMIX 在 VDN 上加入单调混合网络，团队收益不必简单可加，但需对个体 $Q$ 单调。
- COMA 使用 actor-critic 和反事实 baseline：把某个 agent 替换为随机动作后价值减少量作为其贡献。
- 合作/竞争问题中，Multi-Agent DDPG 为每个 agent 维护独立 actor 和 critic；critic 输入所有 agent 观测，执行时各自 actor 决策。
- Perfect Information Distillation：actor 只看可见信息，global critic 使用全局信息。

### 典型系统案例

- AlphaGo：先监督学习策略网络和快速 rollout 网络，再用自博弈 REINFORCE 优化策略网络，训练价值网络，最终结合 MCTS。
- AlphaGo Zero：策略网络和值网络合并，ResNet 主干，用 MCTS 自博弈训练；策略网络拟合 MCTS 策略分布，值网络拟合实际胜负。
- AlphaZero：框架类似 AlphaGo Zero，扩展到围棋、国际象棋、将棋，不使用数据增强，只用最新模型自博弈。
- AlphaHoldem：用 PPO 和历史最强 K 个模型作为对手训练德扑策略，使用 Trinal/Dual-Clip PPO 和 reward clip。
- Suphx：人类数据监督学习多个麻将策略网络，再用策略梯度和 entropy 优化出牌模型；oracle guiding 先引入全局信息再逐步去除不可见信息。
- DouZero：三个网络分别预测地主、农民 1、农民 2 的动作价值，用 $\varepsilon$-greedy 收集对局。
- AlphaStar：监督学习初始化后 RL+self-play，使用 TD($\lambda$)、UPGO、V-trace，并维护 main agent、main exploiter、league exploiter 三类种群。
- OpenAI Five：Dota2 上使用 PPO，对手 80% 最新模型、20% 历史模型；通过 Continual Transfer via Surgery 支持模型变更后的接续训练。
- JueWu：王者荣耀上使用 Dual-Clip PPO、课程学习、知识蒸馏和 MCTS 选英雄。

<div class="quiz-question" data-answer="D">
  <p><strong>7. CTDE 框架的核心含义是什么？</strong></p>

  <label>
    <input type="radio" name="q7" value="A" />
    A. 训练和执行时每个 agent 都只能看到自己的局部信息
  </label>
  <label>
    <input type="radio" name="q7" value="B" />
    B. 训练时完全不使用 critic
  </label>
  <label>
    <input type="radio" name="q7" value="C" />
    C. 所有 agent 永远共享同一个 actor
  </label>
  <label>
    <input type="radio" name="q7" value="D" />
    D. 训练时可利用集中信息，执行时各 agent 分散决策
  </label>

  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>

  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>
    正确答案：D。<br />解析：CTDE 即集中训练、分散执行，训练阶段可用全局信息帮助学习，部署时每个 agent 用自身可见信息行动。
  </p>
</div>

## 分布式训练与分布式 RL

本章解释为什么强化学习需要分布式：深度模型计算量大、环境采样慢、样本相关性强。机器学习分布式侧重参数和计算拆分，分布式 RL 还要处理 actor 与 learner 的策略滞后。预习时先理解数据并行/模型并行；复习时重点区分 A3C、IMPALA、SEED RL、DD-PPO。

### 分布式机器学习

- 动机：
  - 计算量太大，需要多线程或多机并行。
  - 训练数据太多，需要数据并行。
  - 模型规模大，需要模型并行。
- 一般模块：数据与模型划分、单机优化、通信、数据与模型聚合。
- 数据并行：不同 GPU 计算一个 batch 的不同子集，每个 GPU 有完整参数副本；各节点算梯度，求平均梯度，再同步更新参数。
- 模型并行：
  - 流水并行：不同 GPU 计算模型不同层；microbatch 可提高流水线利用率。
  - 张量并行：把单个矩阵运算拆到不同 GPU 上。
- 混合专家：模型某些模块有多组权重，每组数据动态选择其中一组参与计算。

### 分布式强化学习

- 多个智能体并行与环境交互，提高单位时间样本量。
- Actor 负责采样，Learner 负责用数据批量更新。
- A3C 在单机多 CPU 线程上采样和训练，异步回传梯度给全局网络，有助于探索环境不同区域并降低相邻状态相关性。
- IMPALA 中 Actor 采集数据，Learner 计算梯度，可有多个 Learner；异步持续更新提高效率，但带来策略滞后，因此用 V-trace 修正。
- SEED RL 通过中心化模型推理和快速通信层提升加速器利用率：智能体把观察发给 Learner，由 Learner 集中推理。
- DD-PPO 是同步式分布式 PPO，所有 worker 既采样也训练，收集足够样本后计算梯度并 ALLReduce 得到更新模型。

<div class="quiz-question" data-answer="B">
  <p><strong>8. IMPALA 中 V-trace 主要用于解决什么问题？</strong></p>

  <label>
    <input type="radio" name="q8" value="A" />
    A. 动作空间连续导致无法取最大值
  </label>
  <label>
    <input type="radio" name="q8" value="B" />
    B. 异步 actor 采样策略与 learner 当前策略不一致
  </label>
  <label>
    <input type="radio" name="q8" value="C" />
    C. B 树索引过高导致磁盘访问慢
  </label>
  <label>
    <input type="radio" name="q8" value="D" />
    D. 蒙特卡洛方法不能处理 episode
  </label>

  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>

  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>
    正确答案：B。<br />解析：IMPALA 使用异步 actor 和 learner，采样数据可能来自旧策略；V-trace 用重要性权重思想修正这种策略不一致。
  </p>
</div>

## 多智能体博弈算法：CFR

CFR 处理非完美信息扩展式博弈中的均衡求解。它不直接做 RL 中的价值最大化，而是在每个信息集上累计“如果当时选别的动作会好多少”的反事实遗憾，并按正遗憾匹配策略。预习时先理解信息集、到达概率、遗憾；复习时重点掌握 CFR/CFR+/MCCFR/Deep CFR 和德扑 re-solving。

### Regret Matching 和 CFR

- CFR：Counterfactual Regret Minimization，反事实遗憾最小化。
- 传统求 NE：
  - Normal-form game 可用线性规划。
  - Extensive-form game 转标准式再线性规划或直接 SFLP，但复杂度指数级。
- Regret Matching：动作概率正比于正遗憾值；在石头剪刀布中，若真实动作输了，就比较其他动作本可获得的收益，累积差值作为遗憾。
- 扩展式博弈定义：
  - 状态 $h$ 是从根到当前节点的动作序列。
  - 信息集 $I$ 是当前玩家无法区分的状态集合。
  - $A(I)$ 是信息集下合法动作。
  - 策略 $\sigma_i$ 是从玩家信息集到动作分布的映射。
  - $\pi^\sigma(h)$ 是按策略组合到达 $h$ 的概率。
  - $\pi_{-i}^\sigma(I)$ 是不乘玩家 $i$ 自己动作概率的反事实到达概率。
- 信息集动作遗憾：
  $$
  r(I,a)=\sum_{h\in I}r(h,a)
  $$
- CFR 每轮计算每个信息集每个动作的累积遗憾；下一轮动作概率正比于正累积遗憾，若没有正遗憾则随机探索。
- 收敛到 NE 的是所有回合的平均策略，而不是最后一轮策略。
- CFR 每轮复杂度与状态数一次相关，但状态数本身可能指数级。
- CFR+：
  - 遗憾值对 0 取 max，保证非负。
  - 平均策略使用延迟和递增加权，实践中收敛更快。
- Discounted CFR 对正遗憾、负遗憾和策略平均分别加折扣，实践发现 $DCFR_{1.5,0,2}$ 效果好。

### MCCFR、抽象和深度 CFR

- MCCFR 在 chance node 分支很多时只采样一个子节点，降低单轮时间，增加所需迭代次数但总体可能更快。

![CFR 采样方式比较](/blog/reinforcement-learning/cfr-sampling-comparison.png)

- Outcome-sampling CFR 允许采样策略组合与当前策略不同，类似 off-policy，需要除以实际采样概率，方差较大。
- 若采样策略等于当前策略，则无需知道对手和 chance 动作概率，可在线学习。
- VR-MCCFR 为每个 $v(I,a)$ 维护期望估计，访问分支用新值，未访问分支用旧期望，降低方差。
- Abstraction 通过合并状态/信息集降低规模，可能丢失最优解。
- FSICFR 用前向传播计算路径访问概率、反向传播累加收益，把时间复杂度从博弈树复杂度降到信息集复杂度。
- Regression CFR 用特征和回归器近似遗憾值，减少表格空间。
- Deep CFR：
  - 每个玩家维护值网络，输入信息集输出各动作遗憾。
  - 维护策略网络，输入信息集输出动作概率。
  - 使用策略样本池和值样本池训练。
- Single Deep CFR 不专门训练平均策略网络，而保存每轮值网络，需要平均策略时实时平均，减少平均策略网络带来的采样近似误差。
- DREAM 结合 VR-MCCFR、Single Deep CFR 和 baseline 网络。

### 德扑求解：CFR-D、DeepStack、Libratus、Pluribus

- SFLP 把策略分离到每个决策点，变量数量正比于信息集和动作数，空间复杂度可到变量数平方。
- CFR 时间与信息集成正比，空间与信息集乘动作数成正比；空间至少 $O(n)$。
- CFR-D 包含 Decomposition 和 Re-solving。
- 完美信息博弈中，subgame 是子树，subgame 策略与 trunk 无关，可只保存 subgame 估值。
- 非完美信息博弈中，subgame 不能切开信息集，且每个 subgame 是森林，到达根节点的概率分布由 trunk 策略决定。
- Re-solving 的问题：只针对固定 trunk 策略求 subgame 最优可能不是全局最优；需约束对手在每个根上的收益不超过旧约束。
- CFR-D 按深度拆分，使单次维护树大小从 $N$ 变为 $\sqrt N$，空间降为根号级，时间升为平方级。
- DeepStack 使用 continual re-solving，从当前状态往下若干层作为 trunk，用网络预测 subgame value。
- Libratus 使用 abstraction + MCCFR 得到蓝图策略，比赛中做 nested-safe subgame solving，并通过 self improvement 增加动作。
- Pluribus 与 Libratus 思路类似。

<div class="quiz-question" data-answer="A">
  <p><strong>9. CFR 中用于更新策略概率的核心量是什么？</strong></p>

  <label>
    <input type="radio" name="q9" value="A" />
    A. 每个信息集动作的正累积遗憾
  </label>
  <label>
    <input type="radio" name="q9" value="B" />
    B. 每个状态的即时奖励最大值
  </label>
  <label>
    <input type="radio" name="q9" value="C" />
    C. DQN 目标网络的 TD target
  </label>
  <label>
    <input type="radio" name="q9" value="D" />
    D. B+ 树叶子节点数量
  </label>

  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>

  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>
    正确答案：A。<br />解析：CFR 在每个信息集累计各动作遗憾，下一轮按正累积遗憾匹配动作概率；无正遗憾时随机探索。
  </p>
</div>

# 易错点 / 高频考点

- 奖励描述“想达到什么目标”，不是手工告诉智能体“怎么做”。
- episode 的终止时间 $T$ 是随机变量；continuing task 通常需要折扣或平均回报。
- 状态价值 $v_\pi(s)$ 与动作价值 $q_\pi(s,a)$ 不同；用 $q^*$ 选动作时可直接取 $\max_a$，用 $v^*$ 还要考虑动作后的环境不确定性。
- DP 需要环境模型；MC 和 TD 不需要模型；Dyna 同时学习模型并用模型规划。
- MC 不 bootstrap，通常需 episode 结束；TD bootstrap，可在线更新但 target 带估计误差。
- Sarsa 是 on-policy；Q-learning 是 off-policy；Expected Sarsa 用期望降低单次采样偏差但计算更大。
- Q-learning 的 $\max$ 可能高估，Double Q-learning/Double DQN 用“一个选动作、一个估值”缓解。
- off-policy 需要覆盖条件；重要性采样比可能带来高方差，也可能压低目标策略低概率好轨迹的影响。
- n-step 方法在 TD 和 MC 间插值；$\lambda$-return 是不同 n 步回报的加权和。
- 半梯度 TD 没有对 target 中后继估值求导，方向带近似误差。
- DQN 稳定训练的基础是经验回放和目标网络；Dueling、Double、优先回放、multi-step 等是进一步改进。
- policy gradient 直接优化策略，有随机性且适合策略简单/价值复杂的问题，但常有高方差。
- baseline 不改变策略梯度期望，只降低方差；Actor-Critic 用 TD critic 替代 MC baseline。
- TRPO 用 KL 约束策略更新幅度但计算复杂；PPO 用 clip 实现更简单的一阶近似。
- CTDE 训练时可用全局信息，执行时各 agent 分散决策；这和“所有 agent 永远共享策略”不是一回事。
- CFR 收敛的是平均策略，不是普通 CFR 的最后一轮策略；CFR+ 通过非负遗憾和加权平均提升实践收敛。
- 非完美信息 subgame 不能切开信息集，re-solving 需要约束对手在各根节点的旧收益，否则局部最优可能破坏全局策略。
