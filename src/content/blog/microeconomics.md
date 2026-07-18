---
title: "微观经济学"
description: "基于微观经济学原始课堂笔记整理的中文通用学习资料，覆盖消费者选择、不确定性、市场与厂商行为、福利经济学和博弈论。"
pubDate: 2026-07-18
draft: false
tags: ["课程笔记"]
---

# 原笔记信息
- 原笔记来源：[微观经济学学习笔记.md](https://github.com/zhy12138/class_notes/blob/main/%E5%BE%AE%E8%A7%82%E7%BB%8F%E6%B5%8E%E5%AD%A6/%E5%BE%AE%E8%A7%82%E7%BB%8F%E6%B5%8E%E5%AD%A6%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0.md)
- **本资料由原笔记蒸馏整理，建议配合原笔记查漏补缺。**

# 复习 / 预习建议
- 先用“速览”建立主线：个人选择从偏好、预算、最优化出发，市场分析从需求供给、福利和厂商行为出发，博弈论处理策略互动。
- 预习时先理解术语和图形含义，再回到原笔记看例子；复习时优先记定义、条件、公式和关键结论。
- 消费者理论重点串联预算线、偏好公理、无差异曲线、效用、MRS、UMP、Slutsky 分解和显示偏好弱公理。
- 市场和厂商部分要把图形与公式对应起来：剩余、税收无谓损失、利润最大化、成本最小化、关停/退出、垄断和价格歧视。
- 博弈论部分按“占优策略 -> 最优反应 -> 纳什均衡 -> 混合策略 -> 序贯博弈 -> 重复博弈”的顺序做题查漏。

# 速览
- 经济学核心问题是选择与权衡：机会成本、边际分析、激励、贸易、市场协调、政府纠偏、生产率、通胀与失业短期权衡构成基础框架。
- 消费者选择由预算约束和偏好共同决定；内点解满足无差异曲线与预算线相切，常写作 $MRS_{x_1,x_2}=-p_1/p_2$。
- 效用函数只表达排序，普通效用可做任意保序单调变换；但期望效用要求概率线性，只能做正仿射变换。
- Slutsky 恒等式把价格变化导致的需求变化拆成替代效应和收入效应；正常品一定是普通品，足够强的劣等品才可能成为吉芬品。
- 市场福利常用消费者剩余、生产者剩余和无谓损失衡量；拟线性偏好或小幅价格变化时，消费者剩余更适合近似福利变化。
- 厂商理论中，利润最大化满足“价格等于边际成本”，成本最小化满足“经济替代率等于技术替代率”。
- 完全竞争厂商是价格接受者；垄断者有市场势力，通常价格更高、产量更低，且不存在像竞争厂商那样的供给曲线。
- 博弈论的重点是策略互动：占优/被占优策略、最优反应、纳什均衡、混合策略均衡、逆向归纳、子博弈精炼均衡和重复博弈中的惩罚机制。

# 知识点整理

## 经济学原则与住房市场

本章先建立微观经济学的观察方式：个人和社会都在约束下选择，市场价格通常协调分散决策，但外部性、市场势力等情形会让政府干预有讨论空间。预习时把这些原则看成后面消费者、厂商、福利和博弈分析的共同语言；复习时重点检查“权衡、机会成本、边际、激励、市场失灵、帕累托效率”这些概念能否准确区分。

### 十个经济学原则

- 人们面临权衡取舍，社会也面对效率与平等/公平之间的权衡。
- 某物的成本是为了得到它而放弃的东西，即机会成本（opportunity cost）。
- 理性人考虑边际量：当边际收益大于边际成本时，行动才值得。
- 人们会响应激励（incentive），但激励效果不一定符合政策设计者预期。
- 贸易不是零和游戏；贸易允许各方专门化于自己更擅长或机会成本更低的生产，从而让总消费增加。
- 市场通常是组织经济活动的好方式；价格系统通过买卖双方互动、价值和成本信号，引导家庭与厂商决策。
- 政府有时能改善市场结果，尤其在产权保护、效率和公平方面；市场失灵（market failure）可能来自外部性和市场势力。
- 一国生活水平取决于生产商品和服务的能力；政府印钱太多会带来通货膨胀；短期内社会面临通胀与失业的权衡。

### 竞争市场、保留价格与帕累托效率

- 竞争市场有大量买方和卖方，单个参与者对市场价格影响可忽略；完全竞争中买卖双方都是价格接受者。
- 均衡意味着没有人能通过改变行为获益。
- 保留价格表示商品在某个消费者眼中的价值，取决于其愿意支付的金额。
- 帕累托改进（Pareto improvement）：能让至少一人变好且无人变差的改变。
- 帕累托效率（Pareto efficiency）：不存在任何帕累托改进的配置；若还能帕累托改进，则该配置帕累托无效率。

<div class="quiz-question" data-answer="B">
  <p><strong>1. 下列哪种情形最符合“帕累托改进”的定义？</strong></p>

  <label>
    <input type="radio" name="q1" value="A" />
    A. 一部分人变好，另一部分人变差，但总收益增加
  </label>
  <label>
    <input type="radio" name="q1" value="B" />
    B. 至少一人变好，并且没有任何人变差
  </label>
  <label>
    <input type="radio" name="q1" value="C" />
    C. 所有人得到完全相同数量的资源
  </label>
  <label>
    <input type="radio" name="q1" value="D" />
    D. 市场价格被政府固定在某一水平
  </label>

  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>

  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>
    正确答案：B。<br />解析：帕累托改进要求至少有人更好且没有人更差；总收益增加但有人受损不满足该定义。
  </p>
</div>

## 消费者行为初探

这一章回答“消费者如何在预算约束下选择最优消费束”。逻辑顺序是：先用预算线描述买得起什么，再用偏好和效用描述喜欢什么，最后用相切条件或角点条件找出最优选择。预习时先抓图形直觉，复习时再回到 MRS、拉格朗日条件和 Cobb-Douglas 需求公式。

### 预算线

- 预算线（budget line）是花费恰好等于收入 $m$ 的消费束集合：
  $$
  x_1p_1+x_2p_2=m
  $$
- 这条式子的直觉是“商品 1 的支出 + 商品 2 的支出 = 可用收入”；所有低于或等于这条线的点都是可负担消费束，其中线上点恰好花完预算。
- $m$ 改变时，预算线平行移动；相对价格 $p_1/p_2$ 改变时，预算线绕端点旋转或移动一个端点。
- 从量税（quantity tax）使价格变为 $p+t$；从价税（ad valorem tax/VAT）使价格变为 $(1+r)p$。
- 从量补贴、从价补贴会反向改变相对价格；总额税/总额补贴只改变可支配收入，因此预算线整体内移或外移。

### 偏好关系

- 弱偏好 $x\succeq y$：消费者认为 $x$ 至少和 $y$ 一样好。
- 严格偏好 $x\succ y$：消费者严格更喜欢 $x$。
- 无差异 $x\sim y$：消费者认为二者同样好。
- 完备性：任意 $x,y$ 都能比较，即 $x\succeq y$ 或 $y\succeq x$ 至少一个成立。
- 反身性：任意 $x$ 都满足 $x\succeq x$。
- 传递性：若 $x\succeq y$ 且 $y\succeq z$，则 $x\succeq z$。
- 完备且传递的偏好称为理性偏好；框架效应可能违反完备性，“money pump”体现传递性失败的风险。

### 无差异曲线与效用

- 单调性：更多通常更好。
- 凸性：平均组合优于极端组合，可解释为边际替代率递减；但牛奶和橙汁混合等例子可能不满足凸性。
- 无差异曲线不能相交，否则会推出某些商品数量变化不影响满意度的矛盾。
- 完全替代品（perfect substitutes）：只关心两种商品总量，无差异曲线为斜率不变的直线；例：$u(x_1,x_2)=x_1+x_2$。
- 完全互补品（perfect complements）：总按固定比例消费，无差异曲线呈 L 型；例：$u(x_1,x_2)=\min(x_1,x_2)$。
- 厌恶品会使无差异曲线斜率为正；中性品使无差异曲线为竖线；餍足偏好围绕 bliss point 展开。
- 效用函数满足 $x\succeq y\iff u(x)\geq u(y)$，普通消费者理论中的效用是序数概念，只保留排序。
- 单调变换只要保持顺序，就不改变偏好排序，也不改变 MRS。

### 边际效用与边际替代率

- 边际效用：
  $$
  MU_i=\frac{\partial u}{\partial x_i}
  $$
- 它表示在其他商品数量不变时，多一点商品 $i$ 带来的效用变化；因为效用函数本身可被单调变换，边际效用数值不能脱离具体效用函数解释。
- 边际替代率（marginal rate of substitution, MRS）表示维持同一效用水平时，消费者愿意用一种商品替代另一种商品的比率。
- 由 $dU=0$ 得：
  $$
  MRS_{x_1,x_2}=\frac{dx_2}{dx_1}=-\frac{MU_1}{MU_2}
  $$
- 凸性无差异曲线中，随着 $x_1$ 增加，MRS 的绝对值递减。

### 最优化与 UMP

- 内点解：最优消费束位于无差异曲线与预算线相切处：
  $$
  MRS_{x_1,x_2}=-\frac{p_1}{p_2}
  $$
- 直觉是“主观愿意交换的比率”等于“市场允许交换的比率”；若二者不等，消费者还能沿预算线换一种组合提高效用。
- 角点解：当无差异曲线很陡或偏好/约束导致切点不在可行内部时，最优点可能在预算线端点。
- Cobb-Douglas 效用 $u(x_1,x_2)=x_1^cx_2^d$，$c,d>0$ 时：
  $$
  x_1=\frac{c m}{c+d}\frac{1}{p_1},\quad x_2=\frac{d m}{c+d}\frac{1}{p_2}
  $$
- 效用最大化问题（utility maximization problem, UMP）：
  $$
  \max_{\vec x}u(\vec x),\quad \sum_i x_ip_i\leq m
  $$
  在单调偏好下预算约束通常取等号。
- 拉格朗日一阶条件：
  $$
  \frac{\partial u}{\partial x_i}-p_i\lambda=0,\quad m-\sum_i p_ix_i=0
  $$
- 等边际法则：
  $$
  \lambda=\frac{MU_i}{p_i}
  $$
  含义是每种商品多花一单位钱带来的效用变化率相等。
- $\lambda=\frac{du}{dm}$，表示最优点处财富的边际效用。

![所得税与从量税下的预算线比较](/blog/microeconomics/tax-income-comparison.jpg)

- 在征收总量相等时，所得税下消费者可选择更高无差异曲线上的点，因此优于从量税。

<div class="quiz-question" data-answer="C">
  <p><strong>2. Cobb-Douglas 效用 $u(x_1,x_2)=x_1^cx_2^d$ 且 $c,d>0$ 的内点最优消费中，商品 1 的需求为哪一项？</strong></p>

  <label>
    <input type="radio" name="q2" value="A" />
    A. $x_1=\frac{m}{p_1+p_2}$
  </label>
  <label>
    <input type="radio" name="q2" value="B" />
    B. $x_1=\frac{d m}{c+d}\frac{1}{p_1}$
  </label>
  <label>
    <input type="radio" name="q2" value="C" />
    C. $x_1=\frac{c m}{c+d}\frac{1}{p_1}$
  </label>
  <label>
    <input type="radio" name="q2" value="D" />
    D. $x_1=\frac{c p_1}{m}$
  </label>

  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>

  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>
    正确答案：C。<br />解析：Cobb-Douglas 内点解中，收入按指数权重分配到两种商品，商品 1 的支出份额为 $c/(c+d)$。
  </p>
</div>

## 需求、比较静态与 Slutsky 恒等式

本章把单个最优选择推广成“价格、收入变化时需求如何变”。需求函数是消费者选择问题的输出，比较静态观察外生变量改变后的需求变化，Slutsky 分解进一步说明价格效应为什么可拆成替代效应和收入效应。预习时先理解正常品、劣等品、普通品、吉芬品的分类，复习时重点掌握 WARP 和 Slutsky 恒等式的方向判断。

### 需求函数与比较静态

- 需求函数给出在价格和收入下每种商品的最优数量：
  $$
  \vec x=x(\vec p,m)
  $$
- 正常品：收入增加时需求增加，$\Delta x/\Delta m>0$。
- 劣等品：收入增加时需求减少，$\Delta x/\Delta m<0$；是否为劣等品取决于考察的收入水平。
- 普通品：价格上升时需求下降，$\Delta x/\Delta p<0$。
- 吉芬品：价格上升时需求反而上升，$\Delta x/\Delta p>0$。

### 显示偏好

- 显示偏好原理（revealed preference）：若消费者在某价格和预算下选择了 $x$，而 $y$ 也买得起，则 $x$ 直接显示偏好于 $y$。
- 显示偏好可传递，但“显示偏好”不等同于真实“偏好”；只有当消费者总是选择自己可负担的最佳消费束时，显示偏好才推出偏好。
- 显示偏好弱公理（WARP）：若购买 $x$ 时 $y$ 可负担，则购买 $y$ 时 $x$ 不应再可负担。

### Slutsky 分解

- 价格变化可拆成两步：先让预算线绕原最优点旋转，再平移到新预算线。

![Slutsky 分解中的替代效应和收入效应](/blog/microeconomics/slutsky-decomposition.jpg)

- 需求变化分解为替代效应和收入效应：
  $$
  \Delta x_1=\Delta x_1^s+\Delta x_1^n
  $$
  $$
  \Delta x_1^s=x_1(p',m')-x_1(p,m),\quad
  \Delta x_1^n=x_1(p',m)-x_1(p',m')
  $$
- 替代效应来自相对价格改变：商品变贵时，人会倾向于换向相对便宜的商品；收入效应来自购买力改变：即使名义收入不变，价格改变也会改变“实际变富或变穷”的感觉。
- 由 WARP，替代效应方向与价格变化相反。
- 降价并补偿到原消费束可负担时，相当于 $m'<m$；正常品的收入效应会进一步增加需求，劣等品的收入效应方向相反。
- 需求定律：如果收入增加会使某商品需求增加，则该商品价格上升时需求一定下降。也就是正常品一定是普通品；只有足够强的劣等品才可能是吉芬品。
- 特殊情况：完全替代品的变化有时仅由替代效应决定；完全互补品中 $\Delta x=\Delta x^n$。

<div class="quiz-question" data-answer="A">
  <p><strong>3. 关于 Slutsky 恒等式，下列哪项表述正确？</strong></p>

  <label>
    <input type="radio" name="q3" value="A" />
    A. 价格变化导致的需求变化可分为替代效应和收入效应
  </label>
  <label>
    <input type="radio" name="q3" value="B" />
    B. 正常品一定是吉芬品
  </label>
  <label>
    <input type="radio" name="q3" value="C" />
    C. 替代效应总是与价格变化同向
  </label>
  <label>
    <input type="radio" name="q3" value="D" />
    D. WARP 与 Slutsky 分解没有关系
  </label>

  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>

  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>
    正确答案：A。<br />解析：Slutsky 恒等式正是把总需求变化拆为替代效应与收入效应；正常品一定是普通品而不是吉芬品。
  </p>
</div>

## 不确定下的行为

这一章从确定环境下的消费选择转向风险和时间。风险部分关注“概率已知时怎样比较彩票”，时间部分关注“不同时间的消费怎样折现到一起”。预习时要先分清 EV、EU、CE、风险厌恶和贴现因子；复习时重点检查哪些效用变换被允许、风险厌恶如何用凹性和 Pratt-Arrow 指标表达。

### 期望值、期望效用与随机占优

- 风险（risk）指概率已知；若能通过天气预报等来源获得概率，就能把不确定问题转化为风险问题。
- 期望值（expected value, EV）用概率加权结果：
  $$
  P(E_1)x_1+\cdots+P(E_n)x_n
  $$
- 期望效用（expected utility, EU）/ vNM 效用要求对彩票概率线性：
  $$
  U(\alpha)=U(\sum_i p_ix_i)=\sum_i p_i u(x_i)
  $$
- 这里的关键不是“把结果加权平均”本身，而是偏好在彩票概率上满足线性结构；这就是它比普通序数效用更严格的地方。
- 普通效用只关心排序，期望效用还关心概率线性；因此 vNM 效用只能做正仿射变换 $u(.)=ku(.)+b,k>0$。
- 独立性公理（independence axiom）：若 $x\succeq y$，则把二者分别与同一个第三种彩票 $C$ 以同样权重混合后，偏好关系不变。
- 一阶随机占优（FOSD）：A FOSD B 表示 $F_A(x)\leq F_B(x)$ 对所有 $x$ 成立，且某些 $x$ 严格成立；等价于 A 在每个门槛上至少有同样高概率获得不低于该门槛的结果。
- 二阶随机占优（SOSD）：B 是 A 的均值保留展开时，A 二阶随机占优 B；在 EU 下，厌恶均值保留展开等价于风险厌恶，等价于效用函数凹。

### 风险态度、保险与风险厌恶度量

- 确定性等值（certainty equivalent, CE）：使个体在彩票和确定金额之间无差异的金额。
- 概率溢价（probability premium）：在 $x+\varepsilon$ 与 $x-\varepsilon$ 间的彩票中，为使个体与确定结果 $x$ 无差异，胜率相对公平赔率需要增加的幅度。
- 风险厌恶：效用函数凹，$CE<CV$，概率溢价 $\pi>0$。
- 风险中性：效用函数线性，$CE=CV$，$\pi=0$。
- 风险偏好：效用函数凸，$CE>CV$，$\pi<0$。
- 风险厌恶消费者购买保险的条件：
  $$
  U_C(W_0-l)\geq (1-p)U_C(W_0)+pU_C(W_0-L)
  $$
- 风险中性保险公司售卖保险的条件：
  $$
  l\geq pL
  $$
  因此保险价格需要落在双方都接受的区间内。
- 绝对风险厌恶度：
  $$
  r_A=-\frac{U''(a)}{U'(a)}
  $$
  其符号判断风险态度，大小不受正仿射变换影响。
- 分母 $U'(a)$ 把凹性的大小按边际效用标准化，因此同一个偏好在正仿射变换后不会改变风险厌恶度。
- 相对风险厌恶度：
  $$
  r_R=-a\frac{U''(a)}{U'(a)}=ar_A
  $$
  用财富百分比变化衡量边际效用下降，具有单位无关性。
- CARA 家族中 $r_A=\theta$，与财富无关；CRRA 家族中 $r_R=1-\theta$，与财富无关。

### 前景理论与贴现效用

- 前景理论（prospect theory）强调损失厌恶、参照依赖、价值函数敏感性递减，以及小概率高估/中大概率低估的逆 S 型概率权重。
- 损失厌恶：在 0 附近存在“折点”，$\lambda u(\alpha)=|u(-\alpha)|,\alpha>0,\lambda>1$。
- 贴现效用：
  $$
  U^T(c_0,\ldots,c_T)=\sum_{t=0}^T D(t)u(c_t),\quad D(t)=\frac{1}{(1+r)^t}
  $$
- $u(c_t)$ 是即时效用函数；$D(t)$ 是贴现因子，$r$ 是贴现率。
- 贴现模型包含效用独立、消费独立、即时效用平稳、常数贴现、正贴现和无参照依赖等假设。
- 准双曲贴现（quasi-hyperbolic discounting）：
  $$
  D(t)=
  \begin{cases}
  1&t=0\\
  \beta\delta^t,\ \beta<1&t>0
  \end{cases}
  $$
  当前到下一期的贴现大于未来各期间的贴现，可能导致动态不一致和拖延。
- 天真型认为未来偏好与现在一致；成熟型能预测未来偏好变化；现实中多数人在二者之间。

<div class="quiz-question" data-answer="D">
  <p><strong>4. 在期望效用理论中，为什么 vNM 效用只能做正仿射变换？</strong></p>

  <label>
    <input type="radio" name="q4" value="A" />
    A. 因为任何单调变换都会改变所有消费束的排序
  </label>
  <label>
    <input type="radio" name="q4" value="B" />
    B. 因为期望效用完全不允许改变效用函数
  </label>
  <label>
    <input type="radio" name="q4" value="C" />
    C. 因为风险厌恶者只能使用凸效用函数
  </label>
  <label>
    <input type="radio" name="q4" value="D" />
    D. 因为需要保持效用对概率的线性结构和彩票偏好
  </label>

  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>

  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>
    正确答案：D。<br />解析：vNM 效用不仅表示排序，还要求期望效用对概率线性；任意单调变换可能破坏这一结构，正仿射变换可以保留。
  </p>
</div>

## 市场、剩余与弹性

本章从个体需求走向市场层面：先用消费者剩余和生产者剩余衡量交易收益，再看价格管制、税收如何造成福利变化，最后用弹性描述需求对价格的敏感程度。预习时先把图形面积对应到“谁得到了什么、谁损失了什么”；复习时重点掌握消费者剩余适用条件、无谓损失和弹性与总收益的关系。

### 准线性偏好与消费者剩余

- 准线性偏好（quasi-linear preferences）：
  $$
  u(x_1,x_2)=v(x_1)+x_2
  $$
- 收入增加不改变商品 1 的需求，额外收入全部进入商品 2，因此商品 1 的收入效应为 0。
- 消费者剩余（consumer surplus）是支付意愿与实际支付价格之差。
- 在需求曲线图上，它通常表现为需求曲线下方、价格线以上的面积；可以理解为消费者“愿意付但没有付出去”的福利。

![需求曲线下方的消费者剩余](/blog/microeconomics/consumer-surplus.jpg)

- 价格上升时，剩余损失可分为：继续购买原有部分因价格提高而损失的矩形区域，以及消费减少带来的三角形损失。
- 等价变差 EV：价格变化后，在原价格下达到新价格效用所需的货币变化。
- 补偿变差 CV：价格变化后，在新价格下维持原价格效用所需的货币变化。
- 若商品无收入效应，或价格变化很小，可用消费者剩余衡量福利变化；拟线性偏好下 $EV=CV=\text{Consumer surplus}$。

### 生产者剩余、价格管制与税收

- 生产者剩余（producer surplus）可由供给曲线上方、市场价格下方的面积衡量；由于生产者没有预算约束中的收入效应，该衡量较准确。
- 价格上限使市场数量从无干预下的 $q_0$ 降到 $q_c$，阴影区域通常是剩余损失的下界，因为有限数量未必分配给支付意愿最高的人。

![价格上限造成的福利损失](/blog/microeconomics/price-ceiling-surplus-loss.jpg)

- 配给制可用同样思路分析；若配给券可交易，则券价约为 $p_e-p_c$，购买总价格等于 $p_e$。
- 税收由买方缴还是卖方缴不影响基本结果，关键条件是：
  $$
  P_D(q)-P_S(q)=t
  $$
- 这说明税收真正改变的是买方支付价和卖方收到价之间的楔子，而不是税单名义上写给谁。
- 政府获得税收收入，税收造成的无谓损失（deadweight loss）是社会成本。

![税收归宿和无谓损失](/blog/microeconomics/tax-incidence-deadweight-loss.jpg)

### 市场需求与弹性

- 市场需求/总需求是所有消费者个体需求之和：
  $$
  x^1(\vec p,m_1,\ldots,m_n)=\sum_{i=1}^n x_i^1(\vec p,m_i)
  $$
- 一般而言，总需求依赖收入分配；若可用代表性消费者表示，需要满足各消费者收入变化对各商品需求的边际影响一致。
- 弹性是单位无关的敏感性指标：
  $$
  E=\frac{\text{\% change in one variable}}{\text{\% change in another variable}}
  $$
- 需求价格弹性：
  $$
  \varepsilon=\frac{\Delta q/q}{\Delta p/p}=\frac{p}{q}\frac{\Delta q}{\Delta p}
  $$
  通常取绝对值。
- 替代品越近、商品定义越窄、越像奢侈品、时间越长，需求价格弹性通常越高。
- 中点法用变化量除以起止值平均数，避免从不同起点计算百分比变化得到不同答案。
- 特殊需求曲线：完全无弹性 $elasticity=0$；单位弹性 $elasticity=1$；完全弹性 $elasticity=\infty$。
- 总收益 $R=pq$，近似有：
  $$
  \frac{\Delta R}{\Delta p}=q[1-\varepsilon(p)]
  $$
  若 $|\varepsilon|>1$，涨价会使收益下降；若 $|\varepsilon|<1$，涨价会使收益上升。

<div class="quiz-question" data-answer="B">
  <p><strong>5. 当需求价格弹性绝对值小于 1 时，价格上升对总收益的影响通常是什么？</strong></p>

  <label>
    <input type="radio" name="q5" value="A" />
    A. 总收益下降，因为需求减少幅度很大
  </label>
  <label>
    <input type="radio" name="q5" value="B" />
    B. 总收益上升，因为需求对价格不敏感
  </label>
  <label>
    <input type="radio" name="q5" value="C" />
    C. 总收益一定不变
  </label>
  <label>
    <input type="radio" name="q5" value="D" />
    D. 总收益变化只取决于固定成本
  </label>

  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>

  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>
    正确答案：B。<br />解析：$|\varepsilon|<1$ 表示需求对价格不敏感，涨价造成的数量下降较小，通常总收益上升。
  </p>
</div>

## 厂商行为与竞争市场

本章把“消费者如何选择”换成“厂商如何生产和供给”。厂商面对技术约束和投入价格，先决定怎样以最低成本生产给定产量，再决定生产多少以最大化利润。预习时把等产量线类比成消费者理论中的无差异曲线；复习时重点区分利润最大化、成本最小化、短期关停和长期退出。

### 生产函数、等产量线与规模报酬

- 单一产出厂商的生产函数：
  $$
  Q=f(\vec x)
  $$
  其中 $\vec x$ 是劳动、资本、机器、土地等投入向量，生产函数表示技术约束。
- 等产量线（isoquant curve）表示在相同产出水平 $y$ 下的投入组合。
- 它和无差异曲线很像：无差异曲线固定效用，等产量线固定产量；二者都用斜率表达两种对象之间的替代关系。
- 边际技术替代率（MRTS）：
  $$
  MRTS=\frac{dx_2}{dx_1}=-\frac{MP_1}{MP_2}
  $$
  其中 $MP_i$ 为投入 $i$ 的边际产出。
- 规模报酬不变（CRS）：
  $$
  f(t\vec x)=tf(\vec x),\quad t>0
  $$
- 规模报酬递增（IRS）：$t>1$ 时 $f(t\vec x)>tf(\vec x)$。
- 规模报酬递减（DRS）：$t>1$ 时 $f(t\vec x)<tf(\vec x)$。

### 利润最大化与成本最小化

- 价格接受厂商的利润最大化问题：
  $$
  \max_{\vec x} p f(\vec x)-\vec w\cdot\vec x
  $$
- 一阶条件：
  $$
  p\frac{\partial f(\vec x)}{\partial x_i}=w_i
  $$
  即每种投入的边际产值等于投入价格。
- 两种投入之间：
  $$
  \frac{w_k}{w_l}=\frac{MP_k}{MP_l}
  $$
  每花一元在不同投入上的边际产出相等。
- 成本最小化问题：
  $$
  \min_{\vec x}\vec w\cdot\vec x,\quad f(\vec x)=y
  $$
- 这里产量 $y$ 是给定目标，厂商只在不同投入组合之间选择成本最低的一组；这与利润最大化中同时选择产量和投入不同。
- 最优条件：
  $$
  w_i=\lambda MP_i,\quad \frac{w_i}{w_j}=\frac{MP_i}{MP_j}
  $$
  即等成本线与等产量线相切。

![成本最小化中的等产量线和等成本线](/blog/microeconomics/cost-minimization-isoquant.jpg)

- 用成本函数重写厂商问题：
  $$
  \max_y py-cost(w,y)
  $$
  最优时：
  $$
  p=\frac{\partial cost}{\partial y}=MC
  $$

### 成本几何、短期与长期

- 平均成本：
  $$
  AC(y)=\frac{C(y)}{y}
  $$
- 边际成本：
  $$
  MC=C'(y)
  $$
- DRS 技术下，$C'(q)$ 与 $AC(q)$ 都递增。
- CRS 技术下，$C'(q)=AC(q)$。
- 先 IRS 后 DRS 时：$AC(0)=MC(0)$；$MC<AC$ 时 AC 下降，$MC>AC$ 时 AC 上升；二者在 AC 最小点相交。
- 平均成本分解：
  $$
  AC=AVC+AFC
  $$
- 短期与长期的关键差异是是否存在已承诺、不可调整的投入；短期资本固定，厂商不能让 MRTS 等于投入价格比；长期可以选择成本最小化投入组合。
- 长期总成本 LTC 是所有短期总成本 STC 的下包络；长期平均成本 LAC 是所有短期平均成本 SAC 的下包络。
- 多厂商总供给是个体供给之和，总利润与各厂商分别利润最大化结果相同，关键前提是价格接受。

### 完全竞争厂商

- 竞争厂商把市场价格视为给定；高于市场价卖不出去，低于市场价不理性。
- 短期成本：
  $$
  c(y)=c_v(y)+c_f
  $$
- 短期生产条件：
  $$
  py-c_v(y)\geq0,\quad p\geq AVC
  $$
- 同时满足利润最大化条件 $p=MC$，短期供给为：
  $$
  y=
  \begin{cases}
  0& p<\min AVC\\
  MC^{-1}(p)& p\geq\min AVC
  \end{cases}
  $$

![竞争厂商短期关停决策](/blog/microeconomics/shutdown-decision.jpg)

- 长期退出条件要考虑全部成本：
  $$
  py-c(y)\geq0,\quad p\geq ATC
  $$
  若 $p<ATC$，厂商退出；若 $p>ATC$，新厂商进入。
- 长期均衡中进入或退出完成，剩余厂商经济利润为 0；长期行业供给在 $p=\min AC$ 处水平。

<div class="quiz-question" data-answer="D">
  <p><strong>6. 完全竞争厂商短期继续生产的关键价格条件是什么？</strong></p>

  <label>
    <input type="radio" name="q6" value="A" />
    A. $p<\min AVC$
  </label>
  <label>
    <input type="radio" name="q6" value="B" />
    B. $p<ATC$ 且固定成本为 0
  </label>
  <label>
    <input type="radio" name="q6" value="C" />
    C. $p$ 必须高于所有消费者的支付意愿
  </label>
  <label>
    <input type="radio" name="q6" value="D" />
    D. $p\geq\min AVC$，并在供给段满足 $p=MC$
  </label>

  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>

  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>
    正确答案：D。<br />解析：短期固定成本已无法避免，是否生产取决于收入能否覆盖可变成本；继续生产的供给段由 $p=MC$ 决定。
  </p>
</div>

## 垄断、价格歧视与交换

本章先分析完全竞争之外的市场势力，再进入纯交换经济和福利定理。垄断部分说明价格制定者如何选择产量和价格；交换与福利部分说明市场均衡何时有效率，以及效率和分配为什么不是同一件事。预习时先理解“市场势力”和“帕累托效率”的图形含义；复习时重点区分垄断的 $MR=MC$、竞争的 $p=MC$、福利第一/第二定理。

### 垄断

- 垄断是某产品没有相近替代品且只有唯一卖方的市场结构。
- 与完全竞争的关键区别：垄断者有市场势力，可以影响价格；竞争厂商没有市场势力。
- 垄断者利润最大化：
  $$
  \max_y p(y)y-c(y)
  $$
  一阶条件：
  $$
  MR=MC
  $$
- 垄断者增加产量会压低市场价格，因此边际收益 $MR$ 不等于价格 $p$；这正是它和完全竞争厂商的一处核心差别。
- 竞争厂商是价格接受者，有供给曲线；垄断者是价格制定者，不存在类似竞争厂商的供给曲线。
- 与竞争相比，垄断通常价格更高、产量更低，厂商更好、消费者更差。

![垄断产量与竞争产量比较](/blog/microeconomics/monopoly-output-loss.jpg)

### 垄断形成原因与价格歧视

- 最低效率规模（minimum efficient scale, MES）相对需求规模越大，越可能形成垄断结构；若需求相对 MES 很大，更可能出现竞争市场。
- 多个企业也可能通过合谋限制产量，形成卡特尔（cartel），通常违法。
- 历史原因或关键资源归属也可能导致单一企业占据市场。
- 价格歧视（price discrimination）是对不同购买者收取不同价格，核心依据是支付意愿（WTP）。
- 一级价格歧视：逐个消费者歧视，理想形式是按每个消费者 WTP 收费，但实施成本高。
- 二级价格歧视：厂商不能直接观察消费者类型，通过数量、质量、套餐等机制引导自选择。
- 三级价格歧视：厂商已知年龄、职业等群体信息，对不同群体定不同价格。
- 普通垄断不能价格歧视时，最优供给可能只服务大市场；价格歧视改变不同需求群体的服务方式和福利分配。

### 纯交换与 Edgeworth 盒

- 纯交换模型没有生产，只有若干消费者、偏好、初始禀赋和相互交易。
- 两人两商品下，初始禀赋为 $w_A,w_B$，消费配置为 $x_A,x_B$，各自效用为 $u_A(x_A),u_B(x_B)$。
- Edgeworth 盒用于在二维图中表示分配、偏好和禀赋。
- 镜片状区域内的配置能让双方相对初始禀赋都更好；契约曲线上无差异曲线相切，不再存在帕累托改进。
- 帕累托有效配置可写成在保持一方效用不变时最大化另一方效用：
  $$
  \max u_A(x_A^1,x_A^2)
  $$
  $$
  u_B(x_B^1,x_B^2)=\bar u,\quad x_A^1+x_B^1=w^1,\quad x_A^2+x_B^2=w^2
  $$
- 一阶条件给出：
  $$
  MRS_A=MRS_B
  $$
- 帕累托集是所有帕累托最优配置集合；契约曲线是帕累托集中双方都至少不低于初始禀赋效用的部分。

![Edgeworth 盒中的契约曲线](/blog/microeconomics/edgeworth-contract-curve.jpg)

### Walrasian 均衡与福利经济学定理

- 在价格向量 $\vec p=(p_1,p_2)$ 下，消费者财富等于其禀赋的市场价值：
  $$
  \vec p\cdot \vec w_i=p^1w_i^1+p^2w_i^2
  $$
- 预算线经过禀赋点，斜率由价格比决定；只有预算线上的配置能在给定价格下被双方同时负担。
- Walrasian/竞争均衡：价格向量 $p^*$ 与配置 $x^*$ 满足每个消费者在其预算集内都选择最优配置。
- 在 Edgeworth 盒里，可把价格看成穿过初始禀赋点的一条预算线；均衡要求两个人在同一价格下各自最优，并且两人的选择能同时满足资源约束。
- 均衡发生在双方无差异曲线相切处；随价格变化，需求点形成 offer curve，两个消费者 offer curve 在非禀赋点相交对应均衡。
- 福利经济学第一定理：若 $(\vec x,\vec p)$ 是 Walrasian 均衡，则 $\vec x$ 帕累托有效。
- 隐含假设包括：每个主体只关心自身效用、没有外部性、每个消费者相对市场足够小且是价格接受者。
- 第一定理说明市场能用价格信息低成本实现效率，但帕累托效率不关心平等/公平；干预的福利理由主要来自分配目标。
- 福利经济学第二定理：在凸性假设下，规划者可通过总额财富再分配实现任意目标帕累托最优配置，然后让市场运行。

![第二福利定理中的再分配与市场均衡](/blog/microeconomics/second-welfare-theorem.jpg)

- 第二定理意味着分配与效率可分离；但现实中按禀赋征税存在信息和实践困难，若按选择征税会造成扭曲，因此只能达到“次优”。
- 福利评价函数例子：古典效用主义 $\sum_i u_i$；加权效用和 $\sum_i \alpha_i u_i$；罗尔斯式 $\min_i u_i$；尼采式 $\max_i u_i$。

<div class="quiz-question" data-answer="A">
  <p><strong>7. 福利经济学第一定理的核心结论是什么？</strong></p>

  <label>
    <input type="radio" name="q7" value="A" />
    A. Walrasian 均衡配置是帕累托有效的
  </label>
  <label>
    <input type="radio" name="q7" value="B" />
    B. 每个帕累托有效配置都能无条件由市场自动实现
  </label>
  <label>
    <input type="radio" name="q7" value="C" />
    C. 帕累托效率等同于收入平等
  </label>
  <label>
    <input type="radio" name="q7" value="D" />
    D. 垄断市场一定比竞争市场有效
  </label>

  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>

  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>
    正确答案：A。<br />解析：第一福利定理说明竞争均衡带来帕累托效率；它并不保证平等，也不等同于第二定理。
  </p>
</div>

## 博弈论基础

博弈论部分处理“我的最优行动取决于别人怎样行动”的问题。先从占优策略和最优反应入手，再定义纳什均衡，最后用 Cournot、Bertrand、Location Model 等例子理解不同策略互动。预习时先会读收益矩阵和反应函数；复习时重点检查 NE 是否是“互为最优反应”，以及占优、弱占优、协调和替代关系的区别。

### 占优策略、共同知识与最优反应

- 博弈论研究策略性互动（strategic interactions）：结果不仅取决于自己的行动，也取决于他人的行动。
- 策略是参与博弈的完整行动计划。
- 严格占优（strictly dominant）：无论别人怎么做，策略 $\alpha$ 的收益都严格高于策略 $\beta$。
- 严格被占优（strictly dominated）：某策略总被另一策略严格击败。
- 囚徒困境中，confess 是双方占优策略，因此都会 confess；但双方 remain silent 对二人更好，体现个人理性与群体理性的冲突。
- 解决囚徒困境的可能方式包括沟通/合谋、合同执行、重复互动和声誉约束。
- 完全信息：所有人都知道博弈结构和收益函数。
- 共同知识（common knowledge）：所有人知道某事实，所有人也知道所有人知道，如此无限递归。
- 最优反应（best response）：给定别人策略 $s_{-i}$，策略 $\hat s_i$ 使自己收益不低于任何其他可选策略：
  $$
  u_i(\hat s_i,s_{-i})\geq u_i(s_i',s_{-i})
  $$
- 理性人不会选择对任何信念都不是最优反应的策略。
- Partnership Game 中最优反应为：
  $$
  BR_1(s_2)=1+bs_2,\quad BR_2(s_1)=1+bs_1
  $$
  投入越多越鼓励对方投入，属于战略性互补；迭代最优反应收敛到 $\hat s_1=\hat s_2=1/(1-b)$。

### 纳什均衡与典型静态博弈

- 纳什均衡（Nash equilibrium, NE）：策略组合 $(s_1^*,\ldots,s_N^*)$ 中，每个 $s_i^*$ 都是对其他人策略 $s_{-i}^*$ 的最优反应。
- 判断 NE 时不要问“整体是不是最好”，而要逐个玩家问：在别人策略固定时，他有没有单方面改得更好的选择。
- NE 不意味着人一定会玩该策略；它的重要性在于无人能在别人不变时严格改进，且均衡信念具有自我实现性。
- 严格被占优策略不可能在 NE 中被使用；弱被占优策略可能出现在 NE 中。
- Investment Game 有两个 NE：全部 invest、无人 invest。它不是囚徒困境，因为没有占优策略，是协调博弈，沟通可能帮助实现帕累托改进。
- Cournot 双寡头中，企业选择产量，价格为 $p=a-b(q_1+q_2)$，成本为 $cq_i$，最优反应：
  $$
  BR_i=\frac{a-c}{2b}-\frac{q_j}{2}
  $$
  产量是战略性替代。
- Cournot 均衡：
  $$
  q_1^*=q_2^*=\frac{a-c}{3b},\quad q^*=\frac{2(a-c)}{3b}
  $$
- 行业产量排序：
  $$
  \frac{a-c}{2b}<\frac{2(a-c)}{3b}<\frac{a-c}{b}
  $$
  即垄断产量 < 双寡头产量 < 完全竞争产量。
- Bertrand 竞争中，企业选择价格并互相压价；同质产品、无切换成本时唯一 NE 是：
  $$
  p_1=p_2=c
  $$
- Location Model 说明即使社会中每个人都更喜欢融合而非隔离，隔离也可能成为稳定均衡；$50\%/50\%$ 是均衡但不稳定，存在临界点。

<div class="quiz-question" data-answer="C">
  <p><strong>8. Cournot 双寡头模型中，若两家企业成本相同且需求为 $p=a-b(q_1+q_2)$，每家企业的均衡产量是多少？</strong></p>

  <label>
    <input type="radio" name="q8" value="A" />
    A. $\frac{a-c}{2b}$
  </label>
  <label>
    <input type="radio" name="q8" value="B" />
    B. $\frac{a-c}{b}$
  </label>
  <label>
    <input type="radio" name="q8" value="C" />
    C. $\frac{a-c}{3b}$
  </label>
  <label>
    <input type="radio" name="q8" value="D" />
    D. $\frac{2(a-c)}{3b}$
  </label>

  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>

  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>
    正确答案：C。<br />解析：每家企业的 Cournot 均衡产量为 $(a-c)/(3b)$；两家总产量才是 $2(a-c)/(3b)$。
  </p>
</div>

## 混合策略、序贯博弈与重复博弈

本章继续扩展博弈分析：当没有纯策略均衡时引入随机化；当行动有先后和信息差时用逆向归纳；当互动重复发生时，未来惩罚和奖励会改变当前激励。预习时先理解“为什么要混合”“为什么承诺有用”；复习时重点掌握混合均衡的无差异条件、SPE 对不可置信威胁的排除，以及重复博弈中折现因子的作用。

### 混合策略

- 石头剪刀布没有纯策略 NE；双方都以 $(1/3,1/3,1/3)$ 随机化时，任意纯策略期望收益都为 0，构成混合策略均衡。
- 混合策略（mixed strategy）是对纯策略的随机化，$p_i(s_i)$ 表示纯策略 $s_i$ 被赋予的概率。
- 混合策略收益是各纯策略期望收益的加权平均。
- 混合策略 NE：每个玩家的混合策略都是对其他人混合策略的最优反应。
- 若混合策略中某个纯策略以正概率出现，则该纯策略本身必须也是对对方混合策略的最优反应；因此均衡混合中所有正概率纯策略应带来相同期望收益。
- 求混合均衡时，常用方法是让对手在其被混合的纯策略之间无差异；否则对手会只选择期望收益更高的纯策略，混合就不能稳定。
- Tax Payer and Audit Officer 中，加重逃税处罚只会降低审计员审计概率，不会降低纳税人作弊概率。

### 序贯博弈、承诺与逆向归纳

- 逆向归纳（backward induction）：从博弈末端往前推，作为先行动者要“look forward and work back”。

![序贯投资博弈的博弈树](/blog/microeconomics/sequential-investment-game.jpg)

- 委托代理问题：代理人有动机做出损害委托人的行为，可能使双方都更差。
- 解决方式包括法律/合同和激励设计；“小份额的大蛋糕可能大于大份额的小蛋糕”。
- 放弃某些选择可能改变对手行为；关键是对方必须知道这种承诺。
- Stackelberg 模型是类似 Cournot 的序贯产量竞争，企业 1 先决策，企业 2 观察后行动：
  $$
  q_1^*=\frac{a-c}{2b},\quad q_2^*=\frac{a-c}{4b}
  $$
- 与 Cournot 相比，Stackelberg 总产量更高，先行动企业利润增加，后行动企业利润减少。
- 同时/序贯不只是时间问题，更是信息问题：谁知道什么、谁知道别人会知道什么。

### 扩展式、不可置信威胁与子博弈

- 扩展式博弈可转为标准式；玩家策略必须写成完整计划，包括未来可能到达的节点行动。
- 不可置信威胁（incredible threat）是对威胁者自己不利、只有在非理性声誉等条件下才可能被相信的威胁。
- 讨价还价两期模型中，第二期玩家 2 会只给玩家 1 最低可接受额；玩家 1 在第一期预见到第二期结果后，会给玩家 2 $\delta$，结果为 $(1-\delta,\delta)$。
- 完美信息（perfect information）：每个决策节点上，行动者知道自己位于哪个节点以及如何到达。
- 完全信息不同于完美信息；完全信息强调收益、策略和类型为共同知识。
- 信息集（information set）是玩家无法区分的一组节点；完美信息博弈中所有信息集都只含一个节点。
- 不完全信息下，纯策略必须指定每个信息集上的行动。
- 子博弈（subgame）需满足：从单一节点开始，包含该节点所有后继，不切断任何信息集。
- 子博弈精炼纳什均衡（SPE）：一个 NE 在每个子博弈中都诱导出 NE。
- 逆向归纳是寻找 SPE 的常用方法。

![子博弈示例](/blog/microeconomics/subgame-example.jpg)

### 重复博弈

- 有限重复博弈可从最后一期反推；若阶段博弈有唯一 NE，则有限重复博弈中每一期都玩该阶段 NE 是唯一 SPE。
- 重复囚徒困境中，最后一局一定选择 $(D,D)$，继续向前反推，有限重复的 SPE 是每一局都 $(D,D)$。
- 若阶段博弈有多个 NE，可以用一个 NE 作为奖励、另一个 NE 作为惩罚，从而在有限重复中支持某些帕累托改进结果。
- 无限囚徒困境中，每一局后以 $\delta$ 概率继续，$\delta$ 为折现因子。
- ALLD：双方永远背叛是 SPE。
- GRIM：只要无人背叛就合作，一旦有人背叛则永远背叛；当
  $$
  \delta\geq \frac{1}{3}
  $$
  时，合作可被支持。
- 这里的 $\delta$ 越大，未来收益越重要，背叛后失去未来合作的代价越高，因此合作越容易维持。
- 较短惩罚需要更高的 $\delta$ 才能维持合作；关系越长，惩罚机制越容易可信。
- Tit-for-tat：先合作，此后复制对方上一轮行动；Generous Tit-for-tat 在对方背叛后仍以正概率合作。

<div class="quiz-question" data-answer="B">
  <p><strong>9. 混合策略均衡中，一个以正概率被使用的纯策略必须满足什么条件？</strong></p>

  <label>
    <input type="radio" name="q9" value="A" />
    A. 它必须严格占优所有其他纯策略
  </label>
  <label>
    <input type="radio" name="q9" value="B" />
    B. 它必须是对对方混合策略的最优反应之一
  </label>
  <label>
    <input type="radio" name="q9" value="C" />
    C. 它必须让对方收益最小
  </label>
  <label>
    <input type="radio" name="q9" value="D" />
    D. 它必须在每个结果中都给自己最高收益
  </label>

  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>

  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>
    正确答案：B。<br />解析：若某纯策略在混合策略中有正概率，它带来的期望收益必须与其他被混合的纯策略一样高，否则理性玩家会把概率转移出去。
  </p>
</div>

<div class="quiz-question" data-answer="A">
  <p><strong>10. 子博弈精炼纳什均衡相对普通纳什均衡额外要求什么？</strong></p>

  <label>
    <input type="radio" name="q10" value="A" />
    A. 在每个子博弈中也诱导出纳什均衡
  </label>
  <label>
    <input type="radio" name="q10" value="B" />
    B. 所有玩家只能使用纯策略
  </label>
  <label>
    <input type="radio" name="q10" value="C" />
    C. 所有威胁都必须让威胁者收益更低
  </label>
  <label>
    <input type="radio" name="q10" value="D" />
    D. 博弈必须只有一个信息集
  </label>

  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>

  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>
    正确答案：A。<br />解析：SPE 要求策略组合不仅是整体博弈的 NE，还要在每个子博弈中构成 NE，从而排除不可置信威胁。
  </p>
</div>

# 易错点 / 高频考点

- 平等、平均和公平不要混用；原笔记中 equality 偏向“平均”，equity 偏向“公平”。
- 机会成本不是会计支出，而是为了得到某物放弃的最佳替代。
- 普通效用是序数概念，可做单调变换；vNM 期望效用因为概率线性，只能做正仿射变换。
- MRS 的符号常写为负数，但也常取绝对值；考试时要看题目约定。
- 内点解才用相切条件；完全替代、角点解等情况不能机械套 $MRS=-p_1/p_2$。
- 正常品一定是普通品；劣等品不一定是吉芬品，只有收入效应足够强并压过替代效应时才可能是吉芬品。
- 显示偏好不等同于真实偏好；从选择推出偏好需要“消费者选择可负担最佳消费束”的前提。
- 消费者剩余衡量福利变化需要条件，拟线性偏好或小价格变化下最稳妥。
- 税由买方缴还是卖方缴不改变税收归宿的核心条件，关键是买方支付价和卖方收到价相差 $t$。
- 厂商短期关停看 AVC，长期退出看 ATC；固定成本在短期决策中已沉没，但长期要计入。
- 垄断者满足 $MR=MC$，不是 $p=MC$；垄断者没有竞争厂商意义上的供给曲线。
- 第一福利定理讲竞争均衡有效率，不讲公平；第二福利定理依赖凸性和总额再分配，现实征税可能产生扭曲。
- 严格被占优策略不可能出现在 NE；弱被占优策略可能出现在 NE。
- Cournot 是产量竞争，反应是战略性替代；Bertrand 是价格竞争，同质商品下均衡价格等于边际成本。
- 序贯博弈的关键是信息和承诺，不只是行动时间；SPE 用于排除不可置信威胁。
- 有限重复且阶段博弈唯一 NE 时，逆向归纳通常得到每期都玩阶段 NE；无限重复中合作能否维持取决于折现因子和惩罚可信度。
