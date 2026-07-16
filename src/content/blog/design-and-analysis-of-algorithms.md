---
title: "算法设计与分析"
description: "基于算分原始笔记整理的考前复习提纲，覆盖基础复杂度、分治、动态规划、贪心、线性规划、网络流、复杂度、NP 完全、近似、随机和在线算法。"
pubDate: 2026-07-12
draft: false
tags: []
---

# 原笔记信息

- 原笔记来源：[class_notes/算分/算分.md](https://github.com/zhy12138/class_notes/tree/main/%E7%AE%97%E5%88%86)
- **本资料由原笔记蒸馏整理，建议配合原笔记查漏补缺。**

# 复习 / 预习建议

- 第一轮先看“速览”和“易错点 / 高频考点”，把每个一级章节的核心目标串起来。
- 第二轮重点背公式和结论：主定理、平摊势函数、LP 对偶、最大流最小割、近似比、Chernoff Bound、竞争比。
- 第三轮按题型复习证明：贪心交换论证、网络流建模、NP 规约、决策树下界、近似比推导。
- 做选择题时，错题回到对应章节，特别检查“适用条件”：如三角形不等式、整数容量、标准形、在线/离线区别。

# 速览

- 渐近界、Stirling 公式、递推方程和主定理是复杂度分析的基础；主定理第三种情况需要正则条件。
- 分治优化主要从三处入手：减小合并代价、减少子问题个数、减少子问题总代价；典型例子包括最近点对、Karatsuba 整数乘法、FFT。
- 动态规划重点是状态定义和空间优化；Hirschberg 算法在编辑距离问题中保持 $O(mn)$ 时间，同时把空间降到 $O(m+n)$。
- 贪心算法常用归纳法或交换论证证明；活动选择、区间划分、最坏延迟调度、Huffman、MST、Dijkstra、拟阵贪心是核心样例。
- 线性规划部分要掌握标准形、基本可行解、单纯形最优性检验、对偶性、互补松弛性，以及把绝对值、min-max、整数约束等转化为规划模型的方法。
- 网络流围绕最大流最小割、增广链、余量网络、FF/EK/Dinic、最小费用流和建模展开；很多组合问题可通过最小割或可行流表达。
- 复杂度与 NP 完全性侧重下界证明、决策树、对手论证、规约、多项式时间变换，以及 SAT、3SAT、VC、HC、TSP、子集和、背包等 NPC 问题链。
- 近似、随机、在线算法分别关注近似比、错误概率/期望时间、竞争比；典型结论包括多机调度 2 近似、背包 PTAS/FPTAS、Chernoff Bound、LRU 的 $k$ 竞争比。

# 知识点整理

## 基础知识

**核心概念**

- $\Omega(g(n))$：渐近下界；$O(g(n))$：渐近上界；$\Theta(g(n))$：渐近紧确界。
- 常用关系：$n^d=O(r^n)$，$r>1,d>0$；$\log_b n=O(n^a)$，$a>0$；$a^{\log_b n}=n^{\log_b a}$；$\log_k n=\Theta(\log_l n)$。
- Stirling 公式：
  $$
  n!=\sqrt{2\pi n}(\frac ne)^n(1+\Theta(\frac 1n))
  $$
  推出 $n!=O(n^n)$、$n!=\Omega(2^n)$、$\log(n!)=\Theta(n\log n)$。

**递推方程**

- 常用方法：递归树、尝试法、用积分近似求和。
- 主定理：
  $$
  T(n)=aT(\frac nb)+f(n),a\geq1,b>1
  $$
  $$
  T(n)=
  \begin{cases}
  \Theta(n^{\log_ba})& f(n)=O(n^{\log_ba-\epsilon}) \\
  \Theta(n^{\log_ba}\log n)& f(n)=\Theta(n^{log_b a}) \\
  \Theta(f(n))& f(n)=\Omega(n^{\log_b a+\epsilon}),\ af(\frac nb)\leq cf(n)
  \end{cases}
  $$

<div class="quiz-question" data-answer="C">
  <p><strong>1. 关于主定理第三种情况，哪一项是需要同时满足的附加条件？</strong></p>

  <label><input type="radio" name="q1" value="A" /> A. $f(n)=\Theta(n^{\log_b a})$</label>
  <label><input type="radio" name="q1" value="B" /> B. $a=1,b=2$</label>
  <label><input type="radio" name="q1" value="C" /> C. 对 $c<1$ 和充分大 $n$，有 $af(n/b)\leq cf(n)$</label>
  <label><input type="radio" name="q1" value="D" /> D. 递归树必须是满二叉树</label>

  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>

  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：C。解析：第三种情况除 $f(n)=\Omega(n^{\log_b a+\epsilon})$ 外，还需要满足正则条件 $af(n/b)\leq cf(n)$。</p>
</div>


## 分治

**核心流程**

- 分治结构：divide、conquer、combine。
- 一般递推：
  $$
  W(n)=W(P_1)+\ldots+W(P_k)+f(n),\quad W(c)=C
  $$
- 改进途径：
  1. 预处理减小递归内部计算量 $d(n)$。
  2. 代数变换减少子问题个数 $a$。
  3. 减少子问题总代价 $af(\frac nb)$。

**典型例子**

- 确定性选择算法：三元组可得 $T(n)=T(n/3)+T(2n/3)+O(n)=O(n\log n)$；五元组可得 $T(n)=T(n/5)+T(7n/10)+O(n)=O(n)$。
- 二维最近点对：分治后只需检查宽 $2\delta$ 条带；按 $y$ 排序后 $dist(p_i,p_j)<\delta$ 只需检查 $|i-j|<11$，复杂度 $O(n\log n)$。
- 整数乘法：普通拆分 $T(n)=4T(n/2)+O(n)=O(n^2)$；用
  $$
  x_1y_0+x_0y_1=(x_0+x_1)(y_0+y_1)-x_0y_0-x_1y_1
  $$
  降为 $T(n)=3T(n/2)+O(n)=O(n^{\log_2 3})$。
- 卷积 / 单位根插值：利用 $A(x)=A_{even}(x^2)+xA_{odd}(x^2)$ 分治，复杂度 $O(n\log n)$。

<div class="quiz-question" data-answer="B">
  <p><strong>2. 确定性选择算法中，哪种分组方式可得到线性复杂度？</strong></p>

  <label><input type="radio" name="q2" value="A" /> A. 每 3 个一组，递推为 $T(n/3)+T(2n/3)+O(n)$</label>
  <label><input type="radio" name="q2" value="B" /> B. 每 5 个一组，递推为 $T(n/5)+T(7n/10)+O(n)$</label>
  <label><input type="radio" name="q2" value="C" /> C. 每 2 个一组，递推为 $2T(n/2)+O(n)$</label>
  <label><input type="radio" name="q2" value="D" /> D. 不分组，直接排序</label>

  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>

  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：B。解析：三元组版本得到 $O(n\log n)$；五元组版本通过减少子问题总代价得到 $O(n)$。</p>
</div>


## 动态规划

**最小编辑距离**

- 定义：$s_1,s_2$ 的编辑距离是通过删除、增加、替换使二者相同的最小操作次数。
- 状态：$f_{i,j}$ 表示 $s_1[1:i],s_2[1:j]$ 的编辑距离。
- 转移方程：
  $$
  f_{i,j}=\min\{f_{i-1,j}+1,f_{i,j-1}+1,f_{i-1,j-1}+[s_1[i]==s_2[j]]\}
  $$
- 时间复杂度 $O(nm)$；滚动数组空间 $O(\min(n,m))$。

**Hirschberg 算法**

- 思路：把 $X$ 从中间切开，分别算前缀 DP 和反向后缀 DP，找出分割 $Y$ 的位置 $s$ 后递归。
- 时间复杂度仍为 $O(mn)$。
- 两次 DP 可用滚动数组，递归只保留分割变量，空间复杂度 $O(m+n)$。

**图的最大独立集与树分解**

- 树分解 $(T,X)$ 要满足点覆盖、边覆盖、同一图顶点对应的树节点连通。
- 宽度为 $\max X(i)-1$；图的树宽是所有树分解中的最小宽度。
- 树宽为 $k$ 时，可用树形 DP，复杂度 $O(k2^kN)$。

<div class="quiz-question" data-answer="D">
  <p><strong>3. Hirschberg 算法相对普通编辑距离 DP 的主要空间优势是什么？</strong></p>

  <label><input type="radio" name="q3" value="A" /> A. 时间降到 $O(n+m)$</label>
  <label><input type="radio" name="q3" value="B" /> B. 不再需要递归</label>
  <label><input type="radio" name="q3" value="C" /> C. 空间降到 $O(1)$</label>
  <label><input type="radio" name="q3" value="D" /> D. 时间仍为 $O(mn)$，空间为 $O(m+n)$</label>

  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>

  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：D。解析：Hirschberg 算法时间复杂度不变，为 $O(mn)$，空间复杂度为 $O(m+n)$。</p>
</div>


## 贪心

**证明方法**

- 归纳法。
- 交换论证 / 调整法。

**经典问题**

- 活动选择：按结束时间 $r_i$ 从小到大排序，能选则选；用交换论证证明。
- 区间划分：按起点 $l_i$ 从小到大排序，能放则放；答案达到任意时刻最大重叠数下界。
- 最坏延迟最小化调度：按截止时间 $d_i$ 从小到大安排；通过消除逆序证明最优。
- 最优缓存调度：FF（Furthest in Future）回收未来最迟访问的数据；它是最优离线调度。
- Huffman 编码：最小频率的两个字符可作为最深且仅最后一位不同的一对叶子，递归合并得到最优编码。
- MST：Prim 和 Kruskal 都通过交换论证证明每步选择可包含于某个最优解。
- Dijkstra：每步加入当前可达最短的点，用归纳证明维护集合内最短路正确。

**拟阵**

- 拟阵 $M=(S,l)$ 满足有穷性、遗传性、交换性。
- 所有极大独立子集大小相同。
- 加权拟阵中，按权重排序并能加入则加入，可求最优子集。
- 任务调度问题可规约为拟阵最优子集：最大化早任务惩罚之和等价于最小化迟任务惩罚。

<div class="quiz-question" data-answer="A">
  <p><strong>4. 活动选择问题的贪心策略是什么？</strong></p>

  <label><input type="radio" name="q4" value="A" /> A. 按结束时间 $r_i$ 从小到大排序，能选则选</label>
  <label><input type="radio" name="q4" value="B" /> B. 按开始时间 $l_i$ 从小到大排序，能选则选</label>
  <label><input type="radio" name="q4" value="C" /> C. 总是选择长度最长的区间</label>
  <label><input type="radio" name="q4" value="D" /> D. 总是选择与最多区间相交的区间</label>

  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>

  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：A。解析：活动选择的贪心算法是按 $r_i$ 从小到大排序，能选则选，并可用交换论证证明。</p>
</div>


## 回溯与分支限界

- 多米诺性质：
  $$
  P(x_1,\ldots ,x_{k+1})\rightarrow P(x_1,\ldots,x_k)
  \iff
  \lnot P(x_1,\ldots ,x_k)\rightarrow \lnot P(x_1,\ldots,x_{k+1})
  $$
  用于说明前缀已错则后续一定错，可剪枝。
- Monte Carlo 估计搜索树节点数：随机走一条路径，根据路径分支数乘积 $\prod S_i$ 估计树大小，多次取平均。
- 分枝限界：为子树设计上界/下界，维护当前最好可行解；不满足约束或界已经不可能优于当前解时剪枝。
- 最大团：可转为补图最大独立集；可用 $C_k+(n-k)$ 或 $C_k+color_k$ 剪枝。
- TSP：可用剩余点最短边或最短边+次短边构造代价函数。
- LCBB：按 $l(x)$ 最小的原则扩展节点。

## 平摊分析

- 聚集分析：平摊代价 = 总代价 / 操作数。
- 记账法：保证任意前缀的平摊代价总和不小于实际代价总和。
- 势能法：
  $$
  \hat c_i=c_i+\Phi(D_i)-\Phi(D_{i-1}),\quad \Phi(D_i)\geq \Phi(D_0)
  $$
- 栈：压入分配 2、弹出分配 0，可得 $O(1)$ 平摊。
- 二进制计数器：每步分配代价 2，给 1 预存翻转费用，平摊 $O(1)$。
- 动态表仅插入：扩容到 $2n$，总代价 $\leq 3n$，势函数 $\Phi(T)=2num(T)-size(T)$。
- 带删除动态表：$num(T)\leq size(T)/4$ 时收缩，势函数
  $$
  \Phi(T)=\max(2num(T)-size(T),\frac 12 size(T)-num(T))
  $$
- MTF 链表访问：每次访问后移到表头，势能分析说明不超过任意其他策略效率的 4 倍。

<div class="quiz-question" data-answer="B">
  <p><strong>5. 势能法中，平摊代价的表达式是哪一个？</strong></p>

  <label><input type="radio" name="q5" value="A" /> A. $\hat c_i=c_i-\Phi(D_i)-\Phi(D_{i-1})$</label>
  <label><input type="radio" name="q5" value="B" /> B. $\hat c_i=c_i+\Phi(D_i)-\Phi(D_{i-1})$</label>
  <label><input type="radio" name="q5" value="C" /> C. $\hat c_i=\Phi(D_i)/c_i$</label>
  <label><input type="radio" name="q5" value="D" /> D. $\hat c_i=\sum_{j=1}^i c_j$</label>

  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>

  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：B。解析：势能法的平摊代价为 $\hat c_i=实际代价_i+\Phi(D_i)-\Phi(D_{i-1})$。</p>
</div>


## 线性规划

**标准形与单纯形**

- 标准形：最小化 $c^Tx$，等式约束 $Ax=b,b\geq0$，变量非负。
- 基本解：选 $A$ 中 $m$ 个线性无关列为基 $B$，令非基变量为 0，解 $Bx_B=b$。
- 基本可行解：基本解且 $x\geq0$。
- 两个基础结论：
  1. 标准形有可行解，则必有基本可行解。
  2. 标准形有最优解，则必有一个基本可行解为最优解。
- 最优性检验：对最小化问题，若所有检验数 $\lambda_i\geq0$，当前基本可行解最优；若存在 $\lambda_k<0$ 且对应列全 $\leq0$，则无最优解。
- Bland 规则：换入变量、换出变量都取符合条件的最小下标，可避免循环。

**对偶与互补松弛**

- 弱对偶：原问题可行解 $x$、对偶可行解 $y$ 满足 $c^Tx\leq b^Ty$。
- 强对偶：若原问题和对偶问题都有最优解，则最优值相同。
- 互补松弛：变量和对应松弛量至少一个为 0，可用于证明某个解最优。

**建模技巧**

- $\min \max_f f(x)$：引入 $z$，最小化 $z$ 且 $f(x)\leq z$。
- 绝对值：用 $-t\leq x\leq t$ 或 $x=x_+-x_-$。
- L1 拟合：$\min\sum |a_i^Tx-b_i|$ 转为 $\min\sum u_i,\ -u\leq Ax-b\leq u$。
- 线性分类：用 $u_i\geq0$ 和 $1-s_i(a^Tv_i+b)\leq u_i$ 线性化 hinge loss。
- 整数规划：松弛规划提供界；分支限界通过添加 $x_i\leq\lfloor a_i\rfloor$、$x_i\geq\lceil a_i\rceil$ 分裂。
- 0-1 乘积消除：
  $$
  y\leq x_1,\quad y\leq x_2,\quad y\geq x_1+x_2-1,\quad y\in\{0,1\}
  $$

<div class="quiz-question" data-answer="C">
  <p><strong>6. 标准形线性规划的要求不包括哪一项？</strong></p>

  <label><input type="radio" name="q6" value="A" /> A. 最小化 $c^Tx$</label>
  <label><input type="radio" name="q6" value="B" /> B. 等式约束 $Ax=b$ 且 $b\geq0$</label>
  <label><input type="radio" name="q6" value="C" /> C. 所有变量必须为整数</label>
  <label><input type="radio" name="q6" value="D" /> D. 变量非负</label>

  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>

  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：C。解析：标准形要求最小化、等式约束、$b\geq0$、变量非负；整数性属于整数规划。</p>
</div>


## 网络流

**最大流最小割**

- 容量网络 $N=<V,E,c,s,t>$。
- 可行流满足容量限制和平衡条件；流量是源点净流出。
- 割容量 $c(A,\overline A)=\sum_{<i,j>\in(A,\overline A)}c(i,j)$。
- 任意可行流 $f$ 和割 $A$ 满足 $v(f)\leq c(A,\overline A)$。
- 若 $v(f)=c(A,\overline A)$，则 $f$ 是最大流，$(A,\overline A)$ 是最小割。
- 无 $s-t$ 增广链等价于已经是最大流。

**算法**

- Ford-Fulkerson：不断找增广链；整数容量时有限终止，复杂度 $O(E|f^*|)$。
- 余量网络：正边表示剩余容量，反边表示可退流。
- Edmonds-Karp：BFS 找最短增广链，复杂度 $O(VE^2)$。
- Dinic：构造分层辅助网络并求极大流，复杂度 $O(V^2E)$。

**最小费用流**

- 辅助网络在余量网络基础上给反边取负费用。
- 负回路算法：可行流最小费用当且仅当辅助网络无负回路。
- 最短路径算法：从 $v_0$ 的最小费用流出发，沿余量网络最短路增广，可得到更大流量的最小费用流。

**建模**

- 棒球淘汰：比赛点到球队点，最大流判断源点边是否满流。
- 带下界可行流：先给每条边流 $l_e$，转为点需求问题。
- Project Selection：正收益从 $s$ 连边，负收益向 $t$ 连边，依赖边容量 $\infty$，最小割对应最大收益。
- 图像分割：前景/背景概率和相邻不同惩罚转为最小割。
- 最大密度子图：二分 $\gamma$，构造最小割判断是否存在密度不小于 $\gamma$ 的子图。
- 整数流定理：容量等为整数时，网络流线性规划存在整数最优解；更一般地，TU Matrix 的线性规划存在整数最优解。

<div class="quiz-question" data-answer="A">
  <p><strong>7. 关于最大流最小割，哪一项是正确结论？</strong></p>

  <label><input type="radio" name="q7" value="A" /> A. 若 $v(f)=c(A,\overline A)$，则 $f$ 为最大流且该割为最小割</label>
  <label><input type="radio" name="q7" value="B" /> B. 任意可行流都等于任意割容量</label>
  <label><input type="radio" name="q7" value="C" /> C. 有增广链时说明当前流已经最大</label>
  <label><input type="radio" name="q7" value="D" /> D. 最小割只与边数有关，与容量无关</label>

  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>

  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：A。解析：流值等于某割容量时，流达到所有割给出的上界，因此该流最大且该割最小。</p>
</div>


## 问题复杂度分析

- 问题复杂度可理解为最优算法复杂度；算法给上界，下界证明给不可突破的限制。
- 平凡下界：输入、输出规模。
- 决策树模型：基于比较的算法对应决策树；排序的最坏复杂度下界为 $\lceil\log(n!)\rceil\approx n\log n-1.5n$。
- 选择问题：
  - 找最大：$n-1$。
  - 找最大和最小：上界 $\lceil 3n/2\rceil-2$，并可通过下界思路说明必要比较次数。
  - 找第二大：锦标赛算法 $n+\lceil\log n\rceil-2$。
  - 找中位数：奇数 $n$ 时至少 $\frac{3(n-1)}2$ 次比较。
- 图连通性对手论证：通过维护确定存在的边 $Y$ 和可能存在的边 $M$，可说明必须遍历所有边。
- 元素唯一性：YES 叶子至少 $n!$，复杂度 $\Omega(n\log n)$。
- 规约：若 $Q$ 已知下界且 $Q\leq_l P$，则 $P$ 至少和 $Q$ 一样难；最近点对、MST 可由元素唯一性规约得到 $\Omega(n\log n)$。

<div class="quiz-question" data-answer="D">
  <p><strong>8. 基于比较的排序问题，最坏复杂度下界来自哪一项？</strong></p>

  <label><input type="radio" name="q8" value="A" /> A. 输入规模为 $n$</label>
  <label><input type="radio" name="q8" value="B" /> B. 每个元素最多比较一次</label>
  <label><input type="radio" name="q8" value="C" /> C. 决策树只有 $n$ 个叶子</label>
  <label><input type="radio" name="q8" value="D" /> D. 决策树有 $n!$ 个叶子，因此深度至少 $\lceil\log(n!)\rceil$</label>

  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>

  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：D。解析：排序的不同输入排列对应决策树叶子，因此至少有 $n!$ 个叶子，深度下界为 $\lceil\log(n!)\rceil$。</p>
</div>


## NP 完全问题

- P：多项式时间可计算的判定问题。
- NP：多项式时间可验证的判定问题。
- 多项式时间变换：$I\in Y_1\iff f(I)\in Y_2$，记 $\Pi_1\leq_p\Pi_2$。
- NP-hard：所有 NP 问题都能规约到它。
- NPC：属于 NP 且 NP-hard。
- SAT 是 NPC；MAX-SAT 可由 SAT 取 $K=m$ 得到 NP-hard；3SAT 可用局部替换法由 SAT 规约。
- 典型 NPC 链：
  - $3SAT\leq_p VC$，并关联顶点覆盖、独立集、团。
  - 有向 HC $\leq_p$ HC，HC $\leq_p$ TSP。
  - SAT $\leq_p$ 恰好覆盖，恰好覆盖 $\leq_p$ 子集和，子集和 $\leq_p$ 01 背包。
  - 子集和 $\leq_p$ 双机调度；双机调度可看作装箱子问题。

<div class="quiz-question" data-answer="B">
  <p><strong>9. 一个问题是 NPC 需要满足什么？</strong></p>

  <label><input type="radio" name="q9" value="A" /> A. 只要它属于 P</label>
  <label><input type="radio" name="q9" value="B" /> B. 它是 NP-hard 且属于 NP</label>
  <label><input type="radio" name="q9" value="C" /> C. 它不能被验证</label>
  <label><input type="radio" name="q9" value="D" /> D. 它一定没有近似算法</label>

  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>

  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：B。解析：NP 完全问题需要同时满足 NP-hard 和属于 NP。</p>
</div>


## 近似算法

- 最小化问题近似性能：$r_A(I)=A(I)/OPT(I)\geq1$。
- 最大化问题近似性能：$r_A(I)=OPT(I)/A(I)\geq1$。
- 常数近似比：存在常数 $r$ 使所有实例 $r_A(I)\leq r$。

**典型算法**

- 多机调度 G-MPS：把任务分给当前负载最小机器，$G-MPS(I)\leq(2-\frac1m)OPT(I)$。
- 多机调度 DG-MPS：先按时间从大到小排序，再贪心，$DG-MPS(I)\leq(\frac32-\frac1{2m})OPT(I)$。
- 满足三角形不等式的 TSP：
  - 最近邻法不是常数近似比。
  - MST 法是 2 近似。
  - 最小权匹配法部分先给出 $MM(I)\leq \frac32OPT(I)$；后文出现“$\frac23$ 近似”表述，与前式不一致，复习时应回到上下文核对。
- 不满足三角形不等式的 TSP：若存在常数近似算法，则可多项式解决 HC，推出 $P=NP$。
- 01 背包：
  - G-KK 按 $v_i/w_i$ 贪心并与最大单物品比较，满足 $OPT(I)<2G-KK(I)$。
  - PTAS：枚举前 $m=\lceil1/\varepsilon\rceil$ 个物品组合后用 G-KK。
  - FPTAS：缩放价值后做伪多项式 DP，复杂度 $O(n^3(1+\frac1\varepsilon))$。
- Set Cover 贪心：按 $c(S_i)/|S_i-V|$ 选，近似比为调和级数级别；紧实例说明无常数近似比。
- LP 舍入：若元素最大出现次数为 $f$，选 $x_S\geq1/f$ 的集合，近似比为 $f$。
- 原始-对偶模式：若满足松弛互补条件的 $\alpha,\beta$ 版本，目标函数差距不超过 $\alpha\beta$。

<div class="quiz-question" data-answer="C">
  <p><strong>10. 多机调度 G-MPS 的近似保证是什么？</strong></p>

  <label><input type="radio" name="q10" value="A" /> A. $G-MPS(I)\leq OPT(I)$</label>
  <label><input type="radio" name="q10" value="B" /> B. $G-MPS(I)\leq \frac32OPT(I)$ 对所有 $m$ 成立</label>
  <label><input type="radio" name="q10" value="C" /> C. $G-MPS(I)\leq(2-\frac1m)OPT(I)$</label>
  <label><input type="radio" name="q10" value="D" /> D. G-MPS 没有任何常数近似比</label>

  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>

  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：C。解析：G-MPS 把任务分给当前负载最小机器，可推导出 $G-MPS(I)\leq(2-\frac1m)OPT(I)$。</p>
</div>


## 随机算法

- 拉斯维加斯算法：结果总正确，运行时间随机；有效时要求期望多项式时间。
- 蒙特卡洛算法：运行时间多项式，结果有概率出错。
- RP：单侧错误，弃真型；co-RP：单侧错误，取伪型；BPP：双侧错误。

**典型例子**

- MAX-3SAT：随机赋值使子句满足概率 $7/8$，得到 $\frac87$ 随机近似。
- 竞争解决：每个进程以 $p=1/n$ 访问 DB，单进程成功概率为 $\Theta(1/n)$；经过 $\Theta(n\log n)$ 时间，高概率所有进程至少成功一次。
- n 皇后：前 `stopVegas` 行用拉斯维加斯随机选择，后面回溯；$t=s+e\frac{1-p}{p}$。
- 矩阵乘法检验：随机 $r\in\{0,1\}^n$，检查 $ABr=Cr$，复杂度 $O(n^2)$，属于 co-RP。
- 2SAT 随机游动：可满足时，重复 $2mn^2$ 次可把错误概率降到 $(1/2)^m$。
- Chernoff Bound：
  $$
  \Pr[X>(1+\delta)\mu]<(\frac{e^\delta}{(1+\delta)^{1+\delta}})^\mu
  $$
  $$
  \Pr[X<(1-\delta)\mu]<e^{-\frac{\delta^2}2\mu}
  $$
- 负载均衡：$n=m$ 时，随机分配高概率保证最大负载为 $\Theta(\log n/\log\log n)$。
- APSP：通过图平方、矩阵乘法和证据查找，可达 $O(MM(n)\log^2 n)$。

<div class="quiz-question" data-answer="A">
  <p><strong>11. 矩阵乘法检验算法属于哪类随机算法？</strong></p>

  <label><input type="radio" name="q11" value="A" /> A. co-RP</label>
  <label><input type="radio" name="q11" value="B" /> B. 拉斯维加斯算法</label>
  <label><input type="radio" name="q11" value="C" /> C. 确定性指数算法</label>
  <label><input type="radio" name="q11" value="D" /> D. 在线算法</label>

  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>

  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：A。解析：若 $AB=C$ 检验总通过；若不等，至少一半概率发现错误，因此是取伪型 co-RP。</p>
</div>


## 在线算法

- 在线算法：输入序列逐步到达，算法只知道过去请求。
- 竞争比：若 $C_A(\sigma)\leq aC_{OPT}(\sigma)+c$，则称 A 是 $a$-竞争。

**K 服务问题**

- 贪心“最近车响应”不一定好；$A-B-C$ 的构造可作为反例。
- 构造 $n=k+1$、每次请求空位置，可证明竞争比下界为 $k$。
- K 服务猜想：存在一般 K 服务问题的 $k$ 竞争在线算法；一些特殊情形已找到。

**页调度**

- 页调度可看作完全图、边权为 1 的 K 服务问题。
- LRU：按阶段划分，每阶段 LRU 恰有 $k$ 次缺页，OPT 至少 1 次缺页，因此 LRU 竞争比为 $k$。
- FF 可作为最优离线算法用于下界证明。

**对称移动算法**

- 适用于直线上的 k 服务问题，竞争比为 $k$。
- 势函数：
  $$
  \Phi=k\sum_{i=1}^k |t_i-s_i|+\sum_{i<j}(s_j-s_i)
  $$
- 树上推广：所有有效服务以相同速度向请求点移动，势函数思路为 $\Phi=k|M_{min}|+\sum_{i<j}d(s_i,s_j)$。

<div class="quiz-question" data-answer="D">
  <p><strong>12. 页调度问题中，LRU 的竞争比为多少？</strong></p>

  <label><input type="radio" name="q12" value="A" /> A. 1</label>
  <label><input type="radio" name="q12" value="B" /> B. 2</label>
  <label><input type="radio" name="q12" value="C" /> C. $\log k$</label>
  <label><input type="radio" name="q12" value="D" /> D. $k$</label>

  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>

  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：D。解析：通过阶段划分可知 LRU 每阶段至多 $k$ 次缺页，而 OPT 至少一次，因此竞争比为 $k$。</p>
</div>


# 易错点 / 高频考点

- 主定理第三种情况除了 $f(n)=\Omega(n^{\log_ba+\epsilon})$，还需要正则条件 $af(n/b)\leq cf(n)$。
- 确定性选择算法三元组只能得到 $O(n\log n)$，五元组才得到 $O(n)$。
- 最近点对合并时不是检查所有条带内点，而是按 $y$ 排序后只检查常数范围。
- 贪心证明不要只写“直觉最优”，常见要求是交换论证或归纳不变式。
- FF 缓存策略是离线最优；LRU 是在线算法，竞争比为 $k$，二者适用场景不同。
- 单纯形最优性检验中，检验数符号要和“最小化标准形”一致。
- 弱对偶只能给上下界；强对偶需要双方都有最优解。
- 最大流最大值等于最小割容量；不是任意割都等于当前流值。
- Ford-Fulkerson 对整数容量有限终止；无理容量可能不终止。
- NP-hard 不等于 NPC；NPC 还必须属于 NP。
- 近似比对最小化和最大化问题的分式方向不同。
- TSP 最小权匹配法部分存在“$\frac32$”和“$\frac23$”表述不一致，复习时应回到上下文核对。
