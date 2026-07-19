---
title: "AI 基础"
description: "AI 基础笔记蒸馏，覆盖数学基础、机器学习、神经网络、CNN、GAN、RNN、Transformer、搜索、强化学习和 AI 系统。"
pubDate: 2026-07-19
draft: false
tags: ["课程笔记"]
---

# 原笔记信息
- 原笔记来源：[ai基础.md](https://github.com/zhy12138/class_notes/blob/main/ai%E5%9F%BA%E7%A1%80/ai%E5%9F%BA%E7%A1%80.md)
- **本资料由原笔记蒸馏整理，建议配合原笔记查漏补缺。**

# 复习 / 预习建议
- 先用速览建立“数学基础 -> 机器学习 -> 深度网络 -> 视觉/序列模型 -> 搜索与强化学习 -> AI 系统”的主线。
- 复习数学基础时优先记概率公式、MLE/MAP、信息论定义、线性回归闭式解和正则化条件。
- 深度学习部分按“神经元和激活 -> 损失 -> 反向传播 -> 优化和正则化 -> CNN/RNN/Transformer 架构”推进。
- 搜索和强化学习章节重点比较算法适用条件：BFS/DFS/UCS/A*、局部搜索、MINIMAX/MCTS、DP/MC/TD。
- 用每节后的选择题检查概念边界；公式推导、代码示例和被压缩的模型细节建议回原笔记查漏补缺。

# 速览
- 回归、概率、信息论和矩阵求导提供机器学习的基本语言：误差函数、贝叶斯定理、熵、KL 散度、交叉熵和梯度。
- 机器学习由任务、经验和表现组成；训练集用于学习，测试集用于评估，泛化与过拟合是核心矛盾。
- 线性回归、逻辑回归、线性分类器、KNN 和 K-means 展示了有参/无参、监督/无监督方法的基本差异。
- 神经网络通过多层线性变换、非线性激活、损失函数和反向传播学习隐表示；正则化用于缓解过拟合。
- CNN 利用权值共享、稀疏连接和局部感受野处理图像；检测、分割、人脸、姿态估计都是 CNN 的典型应用。
- GAN 用生成器与判别器对抗学习数据分布；条件 GAN、BiGAN、CoGAN、CycleGAN 处理条件生成、编码和跨域翻译问题。
- RNN/LSTM 处理序列依赖，注意力和 Transformer 用 Q/K/V、多头注意力、位置编码和编码器-解码器结构建模长序列。
- 搜索、对抗搜索和强化学习关注决策：从状态空间搜索，到博弈树剪枝，再到智能体在环境中通过奖励学习策略。

# 知识点整理

## 数学基础

### 回归、过拟合与正则化

回归可以理解为多项式曲线拟合：找到一个多项式函数尽可能逼近样本点。若特征向量写为 $x^T=(1,x,x^2,\ldots)$，预测值为：
$$
\hat t=x^Tw
$$

误差函数：
$$
E(w)=\frac 12\sum[y(x_n,w)-t_n]^2
$$
优化目标是最小化误差函数。

次数 $M$ 越高，模型容量越大；容量过大可能导致过拟合。原笔记给出两类缓解方式：

- 增加数据量。
- 权重正则化：
  $$
  \tilde E=E+\frac \lambda 2||w||^2
  $$
  当 $M$ 一定时，$\lambda$ 越大，正则效应越强。

### 概率论

概率的两种理解：

- 频率学派：概率是某事件发生次数占总试验次数的比例。
- 贝叶斯学派：概率是个人或主观信念上不确定性的度量。

基础规则：

- 联合概率：$X=x_i$ 和 $Y=y_j$ 同时发生的概率。
- 加和规则：$P(X)=\sum_YP(X,Y)$。
- 条件概率：给定 $X=x_i$ 时，$Y=y_j$ 发生的概率。
- 乘积规则：$P(X,Y)=P(Y|X)P(X)$。
- 独立事件：$P(X|Y)=P(X)$。

贝叶斯定理：
$$
P(y_i|X)=\frac{P(X|y_i)P(y_i)}{P(X)}
=\frac{P(X|y_i)P(y_i)}{\sum_j P(X|y_j)P(y_j)}
$$

其中：

- $P(y_i|X)$：后验概率，观察到 $X$ 后的概率。
- $P(X|y_i)$：似然，设置 $y_i$ 后观察到 $X$ 的概率。
- $P(y_i)$：先验，观察 $X$ 前对 $y_i$ 的猜测。
- $\sum_jP(X|y_j)P(y_j)$：归一化常量。
- $\texttt{posterior}\propto \texttt{likelihood}\times\texttt{prior}$。

连续随机变量用概率密度函数 PDF 描述。PDF 非负，积分面积为 1。正态分布：
$$
p(x|\mu,\sigma^2)=\frac{1}{\sqrt{2\pi\sigma^2}}e^{-\frac{(x-\mu)^2}{2\sigma^2}}
$$

累积分布函数 CDF 描述变量小于等于 $x$ 的概率，是 PDF 的变上限积分；CDF 单调不减，其导数为 PDF。

期望、方差和协方差：
$$
E(f)=\int p(x)f(x)dx,\quad
var(f)=E[(f-E(f))^2]=E(f^2)-E^2(f)
$$
$$
Cov(x,y)=E_{x,y}[(x-E(x))(y-E(y))]=E_{x,y}(xy)-E(x)E(y)
$$

![协方差正负相关示意](/blog/artificial-intelligence-foundations/covariance-examples.png)

协方差小于 0 表示负相关，大于 0 表示正相关，绝对值越大相关性越大。$n$ 维高斯分布：
$$
N(x|\mu,\Sigma)=\frac1{\sqrt{(2\pi)^n|\Sigma|}}e^{-\frac12(x-\mu)^T\Sigma^{-1}(x-\mu)}
$$

### MLE 与 MAP

最大似然估计 MLE 假设数据服从某个分布，选择让数据似然最大的参数：
$$
\theta_{MLE}=\arg \max_{\theta} \log p(X|\theta)
$$

使用 $\log$ 可以把乘法变成加法，并缓解计算精度问题。

最大后验概率 MAP 将 $\theta$ 视为从先验分布 $p(\theta)$ 而来的随机变量：
$$
\theta_{MAP}=\arg\max_{\theta}P(\theta|X)=\arg\max_{\theta}P(X|\theta)P(\theta)
$$

MLE 只看似然，MAP 同时看似然和先验。

### 信息论与矩阵求导

自信息：
$$
I(x)=-\log P(x)
$$
概率越小的事件信息量越大；独立事件的信息量可加。

香农熵：
$$
H(x)=\mathbb E_{x\sim P}[I(x)]=-\mathbb E_{x\sim P}[\log P(x)]
$$

KL 散度：
$$
D_{KL}(P||Q)=\mathbb E_{x\sim P}\left[\log\frac{P(x)}{Q(x)}\right]
$$
它非负且不对称，用来衡量基于 $Q$ 而不是真实分布 $P$ 计算时的期望信息损失。

交叉熵：
$$
H(P,Q)=H(P)+D_{KL}(P||Q)=\int P(x)(-\log Q(x))dx
$$
当 $P$ 固定、调控 $Q$ 时，最小化交叉熵通常等价于最小化 KL 散度。

矩阵求导中常用关系包括：
$$
d(XY)=(dX)Y+X(dY),\quad d(X^T)=(dX)^T,\quad dX^{-1}=-X^{-1}dXX^{-1}
$$
$$
\frac{\partial x^TA}{\partial x}=A,\quad
\frac{\partial x^Tx}{\partial x}=2x,\quad
\frac{\partial x^TAx}{\partial x}=Ax+A^Tx
$$

<div class="quiz-question" data-answer="C">
  <p><strong>1. 在 MAP 中，后验概率的核心组成是什么？</strong></p>
  <label><input type="radio" name="aiq1" value="A" /> A. 后验概率只由先验决定，与观测数据无关</label>
  <label><input type="radio" name="aiq1" value="B" /> B. 后验概率只由似然决定，与先验无关</label>
  <label><input type="radio" name="aiq1" value="C" /> C. 后验概率正比于似然与先验的乘积</label>
  <label><input type="radio" name="aiq1" value="D" /> D. 后验概率等于 KL 散度与交叉熵之和</label>
  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：C。<br />解析：贝叶斯定理给出 posterior 与 likelihood 和 prior 的乘积成正比；MAP 正是最大化这一后验量。</p>
</div>

## 机器学习基础方法

### 基本要素

机器学习三要素是任务、经验、表现：
$$
Data(experience)\xrightarrow{Learning\ algorithm}Knowledge(performance\ on\ task)
$$

任务包括：

- 有监督学习：图片分类、房价预测、医疗图像分析等。
- 无监督学习：密度估计、聚类、降维等。
- 半监督学习、弱监督学习、强化学习等。

离散标签对应分类问题，连续标签对应回归问题。训练数据属于经验，测试数据用于衡量表现。好的算法既不能过拟合训练数据，也要能泛化到测试数据。

损失函数示例：

- 二分类：$loss(Y,f(X))=[f(X)\neq Y]$。
- 回归：$loss(Y,f(X))=(f(X)-Y)^2$。
- 密度估计：$loss(f(X))=-\log(P_f(X))$。

### 线性回归、岭回归与 Lasso

线性模型用输入 $x$ 的线性组合预测 $y$：
$$
\arg \min \frac1n\sum_{i=1}^n(\vec w^T\vec x_i+b-y_i)^2
$$

写成矩阵形式后有闭式解：
$$
\hat\beta=(A^TA)^{-1}A^TY
$$
该式要求 $A^TA$ 可逆；当样本数量 $n<p+1$ 时，$A^TA$ 一定不可逆。

用 MAP 可引入参数先验。岭回归假设 $\beta$ 属于正态分布 $N(0,\tau^2I)$：
$$
\hat\beta=\arg \min_\beta \sum_{i=1}^n(Y_i-X_i\beta)^2+\lambda\sum w_i^2
$$
矩阵形式：
$$
\hat\beta=(A^TA+\lambda I)^{-1}A^TY
$$

Lasso 假设 $\beta$ 属于拉普拉斯分布：
$$
\hat\beta=\arg \min_\beta \sum_{i=1}^n(Y_i-X_i\beta)^2+\lambda\sum |w_i|
$$

![岭回归与 Lasso 正则化几何直观](/blog/artificial-intelligence-foundations/ridge-lasso-regularization.png)

岭回归通常让参数变小但不为 0；Lasso 具有稀疏性，很多系数会变为 0，因此可用于特征选择。

广义线性模型允许使用单调可微函数 $g$：
$$
y=g^{-1}(w^Tx+b)
$$

当闭式解计算代价过大时，可用梯度下降：
$$
\beta_{k+1}=\beta_k-\frac\alpha2\frac{\partial J(\beta)}{\partial\beta}
$$

### 逻辑回归与线性分类器

逻辑回归实际用于二分类。Sigmoid 函数：
$$
y=\frac1{1+e^{-z}},\quad
\log\frac y{1-y}=w^Tx+b
$$

逻辑回归通过最大化样本出现概率，等价于最小化交叉熵：
$$
\arg\min -\sum_i[y^i\ln f(x^i)+(1-y^i)\ln(1-f(x^i))]
$$

如果逻辑回归使用均方误差，当 $f(x)$ 接近真实值 0 或 1 时梯度趋近 0，更新困难。逻辑回归局限是无法实现异或这类线性不可分问题；增加层数可以处理。

线性分类器将图片像素转为向量 $x$，用 $f(x,W)=Wx+b$ 输出不同类别的打分。多项逻辑回归用 softmax 将分数转为概率：
$$
softmax(z_i)=\frac{e^{z_i}}{\sum_t e^{z_t}}
$$
再与真实类别概率向量计算交叉熵。

### KNN 与 K-means

KNN 是无参方法。对待分类数据点，选最近的 $k$ 个邻居，用类别众数作为分类结果。超参数包括 $k$ 和距离度量方法。

超参数选择通常将数据分成训练集、验证集、测试集。K-Fold 交叉验证把训练集分成 $k$ 份，每次选一份作为验证集，其余作为训练集；测试集只在最后运行一次。

K-means 是无监督聚类：

1. 输入希望分出的类数 $k$。
2. 随机生成 $k$ 个中心。
3. 将每个数据点分配给距离最近的中心。
4. 把中心移动到对应类别距离和最小的位置。
5. 重复分配和移动，直到收敛。

局限性：对初始种子敏感，对异常值敏感。

<div class="quiz-question" data-answer="B">
  <p><strong>2. Lasso 回归与岭回归相比，最突出的效果是什么？</strong></p>
  <label><input type="radio" name="aiq2" value="A" /> A. Lasso 一定让所有参数都更接近均值向量</label>
  <label><input type="radio" name="aiq2" value="B" /> B. Lasso 的 $\mathcal L_1$ 正则可能让许多系数变为 0，从而产生稀疏性</label>
  <label><input type="radio" name="aiq2" value="C" /> C. Lasso 不需要损失函数，只需要距离度量</label>
  <label><input type="radio" name="aiq2" value="D" /> D. Lasso 只能用于无监督聚类问题</label>
  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：B。<br />解析：原笔记对比指出，岭回归通常让系数变小但不归零；Lasso 使用绝对值正则，解有稀疏性，可实现特征选择。</p>
</div>

## 神经网络

### 单个神经元与激活函数

神经元是只有一个输出 $z$ 的单层神经网络：
$$
z=\sum x_iw_i+b
$$
因为输出与所有输入连接，这一层也称全连接层或 dense layer。$|w_i|$ 越大，$x_i$ 的影响越大。偏置 $b$ 使输出可以上下浮动，二维中决策边界 $z=0$ 可由偏置调整；若 $b=0$，决策边界必须经过原点。

激活函数为神经网络提供非线性：

- Sigmoid：$f(z)=\frac1{1+e^{-z}}$，常用于表达概率。
- Tanh：$f(z)=\frac{e^z-e^{-z}}{e^z+e^{-z}}$，输出限制在 $[-1,1]$。
- ReLU：$f(z)=\max(0,z)$，可用于特征选择和简化优化，但负输出被置 0 会丢失信息；Leaky ReLU 和 PReLU 用负区间斜率缓解。
- Softmax：$a_i=\frac{e^{z_i}}{\sum e^{z_i}}$，把多类分数转为概率。

### MLP、损失函数与反向传播

多层感知器 MLP 在单层全连接网络上扩展，至少有两层全连接层，因此具备更强表达能力。每层输出可写为：
$$
a^l=f(z^l)
$$

![MLP 编码、解码和分类示意](/blog/artificial-intelligence-foundations/mlp-encoder-decoder.png)

把可见输入 $x$ 转为隐表达 $z$ 的过程称为编码，反之称为解码。

损失函数量化预测输出与训练数据输出的误差，是优化网络参数的目标：

- 二分类逻辑回归损失：
  $$
  \mathcal L=\sum-[y^i\log(a_i)+(1-y^i)\log(1-a_i)]
  $$
- 多分类交叉熵：
  $$
  \mathcal L=\sum_{i=1}^n\sum_{j=1}^K-y_j^i\log(a_j^i)
  $$
- $\mathcal L_p$ 范数：
  $$
  ||x||_p=(\sum |x_i|^p)^{\frac1p}
  $$
- MSE：$\mathcal L_{MSE}=\frac1n||y-a||_2^2$。
- MAE：$\mathcal L_{MAE}=\frac1n||y-a||$。

梯度下降更新：
$$
\hat w_i=w_i-\alpha\frac{\partial\mathcal L}{\partial w_i}
$$
其中 $\alpha$ 是学习率。

反向传播设：
$$
a^l=f(z^l),\quad z^l=a^{l-1}w^l+b^l,\quad \mathcal L=\frac12(y-a^L)^2
$$
令 $\delta^l=\frac{\partial\mathcal L}{\partial z^l}$，则：
$$
\frac{\partial\mathcal L}{\partial w^l}={a^{l-1}}^T\delta^l,\quad
\frac{\partial\mathcal L}{\partial b^l}=\delta^l
$$

Sigmoid 在输出接近 0 或 1 时导数很小，反向传播中 $\delta$ 会逐层变小，引发梯度消失；原笔记指出一般使用 ReLU 代替 Sigmoid，也可以逐层训练。

### 优化与正则化

SGD 每次更新不使用全部训练样本，而是随机取一批 mini-batch。覆盖一次完整训练集称为一个 epoch。

自适应学习率方法包括 RMSProp、Adagrad、Adam、AMSGrad、AdaBound 等。

常见超参数：

- 网络层数。
- 每层神经元数。
- 激活函数。
- 损失函数。
- batch size。
- 训练 epoch 数。

正则化方法：

- 数据增强：图像可做水平翻转、旋转、平移、缩放等。
- 提前停止：网络开始过拟合时停止训练。
- 权重衰减：只用于权重 $w$，不用于偏置 $b$，$\mathcal L_{total}=\mathcal L+\lambda||w||$。
- Dropout：训练时按比例随机将隐藏输出置 0，测试时不再随机置 0；可理解为训练时拆成多个子网络，测试时一起投票。

<div class="quiz-question" data-answer="D">
  <p><strong>3. 为什么深层网络中常用 ReLU 替代 Sigmoid？</strong></p>
  <label><input type="radio" name="aiq3" value="A" /> A. ReLU 输出一定是概率，因此适合所有分类任务</label>
  <label><input type="radio" name="aiq3" value="B" /> B. ReLU 不需要权重和偏置即可完成学习</label>
  <label><input type="radio" name="aiq3" value="C" /> C. Sigmoid 无法表达非线性，而 ReLU 可以</label>
  <label><input type="radio" name="aiq3" value="D" /> D. Sigmoid 在接近 0 或 1 时梯度很小，容易造成梯度消失；ReLU 可缓解这一问题</label>
  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：D。<br />解析：Sigmoid 导数在饱和区很小，反向传播时梯度会逐层变弱；ReLU 在正区间保持线性，有助于缓解梯度消失。</p>
</div>

## 卷积神经网络与视觉应用

### 图像表示、增强与卷积动机

图像基本单位是像素。灰度图每个像素用 8 位表示，范围是 0 到 255；彩色图可看作 RGB 三个矩阵。

灰度直方图可以表示总像素数、亮度、对比度，但没有空间分布信息。图像增强包括：

- 整体增强：将灰度直方图值均一化。
- 局部增强：根据像素与邻域的灰度关系重新调整该像素。
- 平滑：平均、高斯、中间值等。
- 锐化：使用强调中心与邻域差异的掩模。
- 边缘增强：水平或竖直方向上的规律增强。

CNN 的动机：

- 像素太多，直接全连接存储和计算成本过高。
- 人眼具有平移不变性。
- 希望获得空间上权值共享、稀疏连接和等变表示。

### 卷积、感受野与池化

1-D 卷积：
$$
s_t=(x*w)_t=\sum x_kw_{t-k}
$$

2-D 灰度图边缘检测：
$$
s_{r,c}=((x*W))_{r,c}=\sum\sum x_{i,j}w_{r-i,c-j}
$$

RGB 图像的卷积核是 $3\times3\times3$ 张量，第三维为通道数。

关键参数：

- Filter size：卷积矩阵大小。
- Padding：边缘补的像素数。
- Strides：卷积矩阵移动步长。
- Kernel/Filter shape：filter_height × filter_width × input_channels × n_filters。

![卷积参数示意](/blog/artificial-intelligence-foundations/convolution-parameters.png)

输出高度：
$$
\texttt{feature_height}=\left\lfloor\frac{\texttt{input_height}+2\texttt{padding}-\texttt{filter_height}}{\texttt{strides}}\right\rfloor+1
$$

感受野是输出矩阵上一个像素对应输入矩阵的贡献范围。多层卷积可增大感受野：
$$
R_n=R_{n-1}+(K_{n-1}-1)\prod_{i=1}^{n-1}S_i
$$

![空洞卷积扩大感受野示意](/blog/artificial-intelligence-foundations/receptive-field.png)

池化用于增强平移不变性，是一种特征聚合。空间金字塔池化针对不同尺寸进行分割后池化，提取从细节到整体的多维度特征。

![空间金字塔池化](/blog/artificial-intelligence-foundations/spatial-pyramid-pooling.png)

### CNN 结构

- AlexNet：不断通过卷积和池化，最终转成向量输入分类器。
- VGG16：使用连续 $3\times3$ 卷积层，相当于更大感受野，同时增加非线性、减少参数。
- ResNet：残差块让信息经过很多层后仍能保留，也缓解梯度消失。

![ResNet 残差块](/blog/artificial-intelligence-foundations/residual-block.png)

- SqueezeNet：先用逐点卷积压缩通道数，减少后续计算，再扩大通道并拼接。
- MobileNet：深度可分离卷积由深度卷积和逐点卷积组成；前者对每个通道分别卷积，后者用 $1\times1$ 卷积合并并扩大通道。

![深度可分离卷积](/blog/artificial-intelligence-foundations/depthwise-separable-convolution.png)

- ShuffleNet：组卷积把通道分组，打乱层将不同组的信息合并。
- 转置卷积：先填充数据再卷积，使输出尺寸变大。

### 目标检测、图像分割与其他视觉任务

目标检测评价指标：

- IoU：
  $$
  IoU=\frac{S(\cap)}{S(\cup)}
  $$
- Precision：$Precision=\frac{TP}{TP+FP}$。
- Recall：$Recall=\frac{TP}{TP+FN}$。
- AP：P-R 曲线下方面积。
- mAP：不同类别 AP 的平均。

![目标检测 IoU 示例](/blog/artificial-intelligence-foundations/object-detection-iou.png)

R-CNN 流程：

1. 选择性搜索提取约 2000 个候选区域。
2. 调整候选区域尺寸。
3. 输入 VGG 提取特征并分类。
4. 通过回归获得边界框位置。

R-CNN 的局限是选择性搜索慢、区域单独输入 CNN 耗时、候选区域尺寸比例影响准确性、非端到端训练。

NMS 用于移除重叠边界框：

1. 按置信度排序。
2. 选择最高置信度框作为基准。
3. 与其他框比较，超过阈值的框被抑制。
4. 重复直到所有框处理完。

SPP Net 用空间金字塔池化解决候选区域尺寸问题，但仍依赖选择性搜索。Fast R-CNN 使用 ROI 池化，Faster R-CNN 用 RPN 替换选择性搜索。YOLO 将目标检测看作回归问题，不需要区域提议；但对靠得近的物体和很小的群体效果不好。

图像分割是像素级分类。FCN 用全卷积结构输出像素级预测；跳跃连接将低级特征带到解码过程，提高细节表现并缓解梯度消失。

![全卷积网络结构](/blog/artificial-intelligence-foundations/fully-convolutional-network.png)

分割损失：

- 像素级交叉熵：每个像素作为单独标签分类；面积大的物体会对损失权重更大。
- Dice 系数：
  $$
  Dice=\frac{2|A\cap B|}{|A|+|B|}=\frac{2TP}{2TP+FP+FN}
  $$

实例分割 = 目标分类 + 目标检测 + 语义分割，Mask R-CNN 是一种实例分割算法。

人脸识别包括检测人脸、对齐到图像中心、进行身份识别。Face Identification 是从人脸库中确定身份；Face Verification 是判断两张图是否属于同一人。Open-set 任务通常是特征提取问题。

姿态估计：

- 自顶向下：先检测每个人，再估计每个人姿态；依赖目标检测，推理时间与人数有关。
- 自底向上：先检测所有关键点，再分配给不同人；推理时间固定，但关键点分配困难。

![CPM 姿态估计多阶段示意](/blog/artificial-intelligence-foundations/convolutional-pose-machine.png)

其他视觉应用包括人员重识别、人物属性分类、深度估计、风格迁移、超分辨率、图像到图像翻译、无监督图像翻译和语义图像生成。

<div class="quiz-question" data-answer="A">
  <p><strong>4. CNN 相比全连接网络更适合图像任务的主要原因是什么？</strong></p>
  <label><input type="radio" name="aiq4" value="A" /> A. CNN 利用权值共享、稀疏连接和局部感受野降低图像建模成本</label>
  <label><input type="radio" name="aiq4" value="B" /> B. CNN 不需要训练数据即可获得分类器</label>
  <label><input type="radio" name="aiq4" value="C" /> C. CNN 只能处理一维向量，不能处理 RGB 图像</label>
  <label><input type="radio" name="aiq4" value="D" /> D. CNN 会删除所有空间结构，只保留灰度直方图</label>
  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：A。<br />解析：原笔记把 CNN 的目的概括为空间权值共享、稀疏连接和等变表示，这正是处理高维图像输入的重要动机。</p>
</div>

## GAN 与生成模型

### 生成式模型与朴素 GAN

生成式模型希望学习高维数据 $x$ 的概率分布 $P(x)$，可用于：

- 生成采样：$x\sim P(x)$。
- 密度估计：合理数据应有更高 $P(x)$。
- 无监督表示学习：模型自己找到特征。

判别式模型用于分类数据；生成模型学习联合分布 $P(x,y)$，可通过：
$$
P(y=k|x)=\frac{P(x,y=k)}{P(x)}
$$
完成分类。

朴素 GAN 中，生成器 $G$ 根据向量 $z$ 生成图片 $\hat x$，判别器 $D$ 判断真实图片 $x$ 与生成图片 $\hat x$ 的真假。

![朴素 GAN 结构](/blog/artificial-intelligence-foundations/vanilla-gan.png)

判别器损失：
$$
\mathcal L_D=-\mathbb E_{x\sim P_{data}}[\log D(x)]-\mathbb E_{z\sim P_z}[\log(1-D(G(z)))]
$$
生成器损失：
$$
\mathcal L_G=-\mathbb E_{z\sim P_z}[\log D(G(z))]
$$

目标问题：
$$
\min_G\max_D V(G,D)
=\mathbb E_{x\sim P_{data}}[\log D(x)]
+\mathbb E_{z\sim P_z}[\log(1-D(G(z)))]
$$

当 $G$ 固定时，最优判别器：
$$
D^*=\frac{p_{data}}{p_{data}+p_g}
$$
当 $D^*$ 固定时：
$$
V(G,D)=-\log4+2JS(P_{data}||P_g)
$$
因此全局最优解为 $P_g=P_{data}$。

训练算法是循环采样一批 $z$ 和 $x$，更新判别器，再更新生成器。若一方先被高强度训练，另一方可能失去优化方向。

### DCGAN、条件 GAN 与潜在表示

DCGAN 使用 CNN 作为生成器和判别器。潜编码 $z$ 是特征的高维抽象，可进行语义级运算，例如潜向量插值产生渐变图像。

Adversarial Loss 相比 MSE 能自适应增大细节权重，减少细节缺失。

VAE = Generator + Encoder；Vanilla GAN = Generator + Discriminator；Better GAN = Generator + Discriminator + Encoder。

条件 GAN 将条件 $c$ 和噪声 $z$ 同时输入生成器，判别器不仅判断真假，还输出分类。它可用于文字到图像生成这类多模态生成问题 $P(x|t,z)$。

寻找潜在表示的方法：

- 基于优化：给定图片 $x$，寻找 $\arg\min_z||x-G(z)||_2^2$，缺点是慢。
- 学习编码器：训练编码器把图像映射到潜编码。

模式坍塌指生成器只能生成真实数据集中一部分容易仿造的图像，甚至总是同一张图。

### BiGAN、CoGAN、CycleGAN 与逆向强化学习

BiGAN 自带编码器，判别器对 $(x,\hat z)$ 和 $(\hat x,z)$ 进行判别，使 $G,E$ 在对抗中拉近两类联合分布。局限是 $z$ 压缩过度时效果不好。

CoGAN 用共享权重的两套生成器和判别器学习两个领域的联合分布，但不能给定一张图片翻译成对应图片。

CycleGAN 处理无监督图像到图像翻译。它加入 cycle-consistency loss 和 adversarial loss，使转化图片既像目标域，又能转回原图保持信息。Identity loss 用于保证数据一致性。

![CycleGAN identity loss 示意](/blog/artificial-intelligence-foundations/cyclegan-identity-loss.png)

逆向强化学习：

- 行为克隆：回报函数 + 环境 -> 智能体学习。
- 逆向强化学习：专家示范 + 环境 -> 回报函数。

与 GAN 对比：

- 真实图片对应专家示范轨迹。
- 生成器对应智能体生成的轨迹。
- 判别器对应回报函数。

区别是回报函数不可直接对智能体求导，需要通过强化学习传递。

<div class="quiz-question" data-answer="C">
  <p><strong>5. 朴素 GAN 达到全局最优时，生成分布与真实数据分布的关系是什么？</strong></p>
  <label><input type="radio" name="aiq5" value="A" /> A. 生成分布必须与先验分布完全相同，而不是与真实数据相同</label>
  <label><input type="radio" name="aiq5" value="B" /> B. 判别器能以概率 1 区分所有真假样本</label>
  <label><input type="radio" name="aiq5" value="C" /> C. 生成分布等于真实数据分布，判别器无法区分真假</label>
  <label><input type="radio" name="aiq5" value="D" /> D. 生成器只需要最小化 MSE 即可保证最优</label>
  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：C。<br />解析：原笔记推导给出 $V(G,D)=-\log4+2JS(P_{data}||P_g)$，最小时 JS 散度为 0，因此 $P_g=P_{data}$，判别器最优输出为 0.5。</p>
</div>

## RNN、注意力与 Transformer

### 词表示与 RNN

时间序列数据不适合简单前馈网络，RNN 专门处理序列。

词表示：

- one-hot vector：每个单词对应一个 01 维度；缺点是维数灾难、词之间独立且稀疏。
- 词袋模型：用单词频率表示句子；缺点是维数灾难、丢失单词位置信息。
- 词嵌入：用浮点向量表示单词，使相似单词距离更近；实际操作中直接取 embedding table 的对应行。

Word2Vec：

- CBOW：根据上下文预测中间词。
- Skip-Gram：通过中间词预测上下文。
- NCE：对负样本随机抽样，减少 SG 计算损失的开销。

序列任务形式：

- one to many：图片描述。
- many to one：句子情感分类。
- many to many 同步：每个时间步输入并输出。
- many to many 异步 Seq2Seq：输入完一个句子后再开始翻译。

RNN 与 FNN 的区别在于：RNN 会把前一个时间步的信息传给下一个时间步。

![朴素 RNN 展开示意](/blog/artificial-intelligence-foundations/vanilla-rnn.png)

朴素 RNN：
$$
h_t=\tanh(W_hx_t+U_hh_{t-1}+b_h)
$$
$$
y_t=\sigma_y(W_yh_t+b_y)
$$
局限性是长期依赖问题。

### LSTM 与序列生成

LSTM 在隐藏状态 $h_t$ 外引入细胞向量 cell vector。

![LSTM 总体结构](/blog/artificial-intelligence-foundations/lstm-overview.png)

门控函数将输入向量与门控向量点乘，门控向量接近 0 的维度表示关闭，接近 1 的维度表示打开。

遗忘门：
$$
f_t=\texttt{sigmoid}([h_{t-1},x_t]W_f+b_f)
$$

输入门：
$$
i_t=\texttt{sigmoid}([h_{t-1},x_t]W_i+b_i)
$$
$$
\hat C_t=\tanh([h_{t-1},x_t]W_c+b_c)
$$
$$
C_t=f_t\odot C_{t-1}+i_t\odot \hat C_t
$$

输出门：
$$
o_t=\texttt{sigmoid}([h_{t-1},x_t]W_o+b_o)
$$
$$
h_t=o_t\odot\tanh(C_t)
$$

GRU 没有 Cell State，计算成本和内存使用更低。

RNN 也可看作序列生成模型：
$$
P(x_1,\ldots,x_n)=P(x_1)P(x_2|x_1)\ldots P(x_n|x_1,\ldots,x_{n-1})
$$

### 注意力机制与 Transformer

RNN 处理长序列存在梯度消失和梯度爆炸，LSTM 计算效率较低，CNN 感受野有限，不能直接捕捉全局依赖。注意力机制用于选择性关注信息。

在自注意力中：

- Query 对应自主性提示。
- Key、Value 对应非自主性提示。
- 注意力汇聚由打分函数、注意力权重矩阵和加权平均组成。

输入序列转成嵌入矩阵 $X$ 后，通过 $W_q,W_k,W_v$ 线性投影得到 $Q,K,V$。缩放点积注意力用 $K^TQ$ 或对应矩阵乘法计算相似度，再除以缩放因子，softmax 得到权重。

多头注意力让不同头关注不同特征维度，且便于并行化：

![多头注意力结构](/blog/artificial-intelligence-foundations/multi-head-attention.png)

Transformer 由编码器和解码器构成。编码器和解码器都由多个相同层组成，每层包含多头注意力和全连接前馈网络，并通过残差连接和层归一化相连。

位置编码用于补充词的顺序信息：
$$
PE_{pos,2i}=\sin(pos/10000^{2i/d_{model}})
$$
$$
PE_{pos,2i+1}=\cos(pos/10000^{2i/d_{model}})
$$

![Transformer 架构示意](/blog/artificial-intelligence-foundations/transformer-architecture.png)

编码器流程：

1. 词嵌入加位置编码。
2. 线性层得到 $Q,K,V$。
3. 计算缩放点积注意力。
4. 残差连接。
5. 层归一化。
6. 逐位前馈网络。
7. 多个编码器可串联。

解码器额外包含 Masked Multihead Attention，屏蔽未来序列信息：
$$
Attention(Q,K,V,mask)=\texttt{softmax}\left(\frac{QK^T}{\sqrt{d_k}}+mask\right)V
$$

GPT 使用 Transformer 解码器堆叠，单向上下文表示，自回归预测下一个词；BERT 使用 Transformer 编码器堆叠，双向上下文表示，通过 MLM 和 NSP 训练。

LLM 的涌现来自大规模训练数据、模型容量、自回归和无监督训练、迁移学习与微调、多任务学习等因素。

<div class="quiz-question" data-answer="B">
  <p><strong>6. Transformer 解码器中的 Mask 机制主要解决什么问题？</strong></p>
  <label><input type="radio" name="aiq6" value="A" /> A. 删除所有低频词，减少词表大小</label>
  <label><input type="radio" name="aiq6" value="B" /> B. 屏蔽未来序列信息，使预测当前词时只能使用前文</label>
  <label><input type="radio" name="aiq6" value="C" /> C. 把所有 token 的注意力权重都强制设为相同</label>
  <label><input type="radio" name="aiq6" value="D" /> D. 让编码器输出直接作为解码器输入，不再需要注意力层</label>
  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：B。<br />解析：解码器自注意力用于语言建模时不能看到未来词，Mask 把不应使用的位置设为接近无贡献，从而只利用已有上下文。</p>
</div>

## X Learning、搜索与局部搜索

### X Learning

原笔记用几个方向串联不同监督信号：

- Unsupervised Learning：以 HoloGAN 为例，噪声 $z$ 影响图像，参数 $\theta$ 影响角度。
- Semi-supervised Learning：以半监督 GAN 为例，少量有标签数据和大量无标签数据共同训练。
- Weakly-supervised Learning：以 Attention CycleGAN 为例，Attention 学得需要改变的部分和可保留的背景。
- Dual Learning：如中英文相互翻译。
- Self-supervised Learning：如把彩图转黑白后学习从黑白到彩图。

### 问题建模与无信息搜索

搜索的关键是把问题用统一模型表示清楚，并分清开节点集、闭节点集、树搜索和图搜索。一个搜索问题包括：

1. 初始状态 $S_0$。
2. 动作集合 $\alpha=ACTIONS(s)$。
3. 状态转移模型 $s'=RESULT(s,\alpha)$。
4. 目标状态。
5. 路径花费。

解是从初始状态到目标状态的动作序列；最优解是所有解中花费最小的。

开节点集 frontier/open list 表示未展开节点，闭节点集 closed/explored list 表示已展开节点。图搜索记录闭节点集，避免重复展开和死循环；树搜索遇到旧点仍可能继续扩展。

效率评价：

- 完备性：有解时是否一定找到。
- 最优性：是否能找到最优解。
- 时间复杂度。
- 空间复杂度。

BFS：

- 用 FIFO 队列维护开节点。
- 时间 $O(b^d)$，空间 $O(b^d)$。
- 具有完备性；总答案数有限时具有最优性。

DFS：

- 用栈或递归，LIFO。
- 常用树搜索，空间 $O(bd)$。
- 不具有完备性和最优性。

深度受限搜索用最大深度 $L$ 防止死循环；迭代加深用 DFS 依次搜索 $L=1,2,3,\ldots$；双向搜索从初始和目标同时搜索，复杂度可降到 $O(b^{d/2})$。

一致代价搜索 UCS 即 Dijkstra，按根到当前点代价 $g(n)$ 排序，适合单步代价不同的问题。

### 启发式搜索、局部搜索与 CSP

贪婪最佳优先搜索使用估价函数 $h(n)$ 决定搜索顺序，但未必最优。

A* 使用：
$$
f(n)=g(n)+h(n)
$$

树搜索中，若 $h(n)\leq$ 实际花费，即可采纳，则 A* 可找到最优解。图搜索中，若：
$$
h(n)\leq c(n,a,n')+h(n')
$$
即一致，则 A* 可找到最优解。

若可采纳启发式函数 $h_2(n)\geq h_1(n)$，则 $h_2$ 支配 $h_1$。多个可采纳启发式函数的最大值仍可采纳，并支配其他函数。

局部搜索从任意解出发，通过邻居调整寻找可行解。性能受解空间形状影响，包括全局最值、局部极值、平台和肩状平台。

爬山法每次移动到相邻节点中最好的一个，会停在局部极值。改进包括随机平移、随机爬山、第一选择爬山、随机重启。

模拟退火在爬山基础上，以 $e^{\Delta E/T}$ 概率接受更劣解，温度 $T$ 逐渐衰减。

局部束搜索维护 $k$ 个节点，从所有后代中保留最优 $k$ 个。遗传算法按打分相关概率杂交，并引入变异。

CSP 由变量、取值范围和约束组成。约束可分绝对约束和优先约束；带优先约束的 CSP 称为 COP。约束传播可用约束缩小变量取值，包含点一致和边一致。

<div class="quiz-question" data-answer="D">
  <p><strong>7. A* 搜索在树搜索中保证最优性的关键条件是什么？</strong></p>
  <label><input type="radio" name="aiq7" value="A" /> A. 启发式函数必须总是大于真实剩余花费</label>
  <label><input type="radio" name="aiq7" value="B" /> B. 搜索时只能使用 DFS 的栈结构</label>
  <label><input type="radio" name="aiq7" value="C" /> C. 所有边的代价必须为 0</label>
  <label><input type="radio" name="aiq7" value="D" /> D. 启发式函数可采纳，即不高估实际剩余花费</label>
  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：D。<br />解析：树搜索中若 $h(n)$ 不超过实际花费，A* 按 $g(n)+h(n)$ 展开时可找到最优解；高估可能错过真正最优路径。</p>
</div>

## 对抗搜索、强化学习与 MDP

### MINIMAX、alpha-beta 与 MCTS

双人零和完全信息游戏包含初始局面、轮到哪个玩家、可行动作、状态转移、终止测试和效用函数。

MINIMAX 的直觉是假设对手同样聪明：自己最大化收益，对手最小化自己的收益。搜索树中 MAX 层取子节点最大值，MIN 层取子节点最小值。

alpha-beta 剪枝维护区间 $[\alpha,\beta]$：

- MAX 层若当前返回值 $v\geq\beta$，直接返回，否则 $\alpha=\max(\alpha,v)$。
- MIN 层若当前返回值 $v\leq\alpha$，直接返回，否则 $\beta=\min(\beta,v)$。

![alpha-beta 剪枝示意](/blog/artificial-intelligence-foundations/alpha-beta-pruning.png)

分枝顺序影响剪枝效率。最优情况下复杂度约为 $O(b^{m/2})$，随机排布时大致为 $O(b^{3m/4})$。

不完美实时策略用 cutoff-test 替代 terminal test，用启发式函数替代 utility，并在时间限制内迭代加深。

MCTS 流程：

1. 选择：按树策略走到未访问节点。
2. 扩展：展开一个或多个子节点。
3. 模拟：用默认策略随机模拟到终局。
4. 反向传播：更新路径上的胜率。
5. 重复迭代，最后选择根节点平均胜率最高的动作。

UCT：
$$
\frac{val(v)}{cnt(v)}+exploration\sqrt{\frac{2\ln cnt(u)}{cnt(v)}}
$$
第一项代表利用，第二项代表探索。

### 强化学习基本框架

强化学习关注智能体与环境交互，通过奖励学习策略。

![智能体与环境交互循环](/blog/artificial-intelligence-foundations/agent-environment-loop.png)

环境包括：

- 初始状态 $S_0$。
- 当前玩家 $C$。
- 动作 $A$。
- 状态转移 $P(S_{t+1}|S_t,A_t)$。
- 终止状态 $S_T$。
- 奖励 $R_t(S_t,A_t)$。

智能体包括：

- 策略 $\pi$，例如 $A_t=\pi(S_t)$。
- 目标：寻找 $\pi$，最大化从 $S_0$ 到 $S_T$ 的累积收益 $\sum R_t$。

状态估值表思想：

1. 初始化胜利为 1，失败为 0，暂时无法评价为 0.5。
2. 多次与对手游戏，使用既利用又探索的策略。
3. 用后继状态修正当前状态：
   $$
   V'(S_t)=V(S_t)+\alpha[V(S_{t+1})-V(S_t)]
   $$

引入概率后：
$$
\sum_{s'}P(s,a,s')=1,\quad \sum_rR(s,a,r)=1,\quad \sum_a\pi(s,a)=1
$$

折扣累计收益：
$$
G=\sum\gamma^{i-1}R_i
$$

状态价值：
$$
V_\pi(s)=\mathbb E[G_t|S_t=s]
$$
动作价值：
$$
Q_\pi(s,a)=\mathbb E[G_t|S_t=s,A_t=a]
$$

二者关系：
$$
V_\pi(s)=\sum_a\pi(a|s)Q_\pi(s,a)
$$
$$
Q_\pi(s,a)=\sum_{s',r}p(s',r|s,a)[r+\gamma V_\pi(s')]
$$

### 探索策略、AlphaGo、MDP 与 DP

多臂老虎机中，动作价值：
$$
Q^*(a)\approx\mathbb E[R_t|A_t=a]
$$

增量更新：
$$
Q_{n+1}=Q_n+\frac1n[R_n-Q_n]
$$
用常数 $\alpha$ 替代 $\frac1n$ 时，新奖励权重更高，适合动作收益随时间变化的情况。

策略：

- 贪心：总选估值最高动作。
- $\epsilon$-贪心：大概率利用，小概率随机探索。
- 乐观初值贪心：把初值设高，促使纯贪心探索大量动作；但收益随时间变化时不如 $\epsilon$-贪心。
- UCB：
  $$
  A_t=\arg\max_a[Q_t(a)+c\sqrt{\frac{\ln t}{N_t(a)}}]
  $$
- Gradient Bandit：为每个动作维护优先度，用 softmax 转为选择概率。

强化学习核心挑战是平衡利用和探索。

AlphaGo 主框架是 MCTS，估值函数通过监督学习和强化学习得到：

1. 用人类数据监督学习得到 rollout policy $p_\pi$ 和 SL policy network $p_\sigma$。
2. 以监督学习结果为初值，通过强化学习得到 RL policy network $p_\rho$。
3. $p_\rho$ 自我对弈，训练值网络 $v_\theta$。
4. 决策时使用 $Q(s,a)+u(s,a)$ 选择扩展，并结合值网络和快速 rollout。

MDP 的马尔科夫性：在状态 $S$ 下，状态转移模型 $P$ 和奖励函数 $R$ 与 $S$ 之前的状态和动作无关。

Bellman 期望方程：
$$
V_\pi(s)=\sum_a\pi(a|s)\sum_{s',r}p(s',r|s,a)[r+\gamma V_\pi(s')]
$$
$$
Q_\pi(s,a)=\sum_{s',r}p(s',r|s,a)[r+\gamma V_\pi(s')]
$$

Bellman 最优方程：
$$
V^*(s)=\max_a\sum_{s',r}p(s',r|s,a)[r+\gamma V^*(s')]
$$
$$
Q^*(s,a)=\sum_{s',r}p(s',r|s,a)[r+\gamma\max_{a'}Q^*(s',a')]
$$

策略迭代：

- 策略估值：给定 $\pi$，迭代求 $v_\pi$。
- 策略提升：$\pi'(s)=\arg\max_aQ_\pi(s,a)$。
- 轮流估值和提升，在有限 MDP 中有限步收敛到最优策略和值。

值迭代只做一次估值就进行策略提升，可看作策略迭代的极端改进。

采样方法比较：

- 动态规划：环境已知。
- 蒙特卡洛学习：环境未知，不使用 bootstrap。
- 时序差分学习：环境未知，使用 bootstrap。

更新式：
$$
v_\pi(s)\leftarrow v_\pi(s)+\alpha[G_t-v_\pi(s)]
$$
$$
v_\pi(s)\leftarrow v_\pi(s)+\alpha[R_{t+1}+\gamma v_\pi(s')-v_\pi(s)]
$$

<div class="quiz-question" data-answer="A">
  <p><strong>8. 蒙特卡洛学习、时序差分学习和动态规划的关键区别是什么？</strong></p>
  <label><input type="radio" name="aiq8" value="A" /> A. DP 假设环境已知；MC 环境未知且不 bootstrap；TD 环境未知但使用 bootstrap</label>
  <label><input type="radio" name="aiq8" value="B" /> B. MC 必须知道完整转移概率，TD 不能从采样中更新</label>
  <label><input type="radio" name="aiq8" value="C" /> C. DP 只能用于 GAN，不能用于 MDP</label>
  <label><input type="radio" name="aiq8" value="D" /> D. TD 与 MC 都要求状态空间只有一个状态</label>
  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：A。<br />解析：原笔记明确区分：动态规划需要已知环境模型；蒙特卡洛不使用后继估值 bootstrap；时序差分在未知环境中用采样到的奖励和后继估值更新。</p>
</div>

## AI 系统

### 系统流程与角色

AI 系统会经过问题形式化、数据获取、模型训练、模型部署和持续维护等阶段。

![AI 系统流程](/blog/artificial-intelligence-foundations/ai-system-pipeline.png)

不同阶段挑战：

- 问题形式化：关注最重要且最可行的问题。
- 数据：高质量数据稀缺，涉及隐私安全。
- 模型训练：模型更复杂，对数据需求更大，训练代价高。
- 模型部署：复杂模型实时推理能力差。
- 持续维护：数据分布会变化。

相关角色：

- 领域专家：有商业洞见，知道什么数据重要、如何获取、如何识别模型真实影响。
- 数据科学家：掌握数据挖掘、模型训练和部署。
- 机器学习专家：定制先进模型。
- 软件开发工程师：开发和维护数据、模型训练、在线服务。

### 数据获取、标注与预处理

外部数据来源包括科研数据、政府公开数据、竞赛数据、企业公开数据。学术论文数据集质量较高、难度适中、便于论文对比，但选择少、规模小、特征相对简单。企业/竞赛数据更贴近实际应用，但问题热门且常因隐私匿名化。

原始数据获取包括网页数据抽取：Scraping = Crawling + Data Extraction。特点是数据质量不可控、数据量大。

生成数据来源：

- GAN、Stable Diffusion 等生成图片。
- 模拟器生成，如自动驾驶。
- 数据增强，如图像和文本增强。

数据标注：

- 仿真：罕见场景可用仿真生成大量标记数据。
- 众包：质量参差不齐，价格较高。

半监督学习：

- Self-Training：用已标记数据训练模型，对高置信度无标签样本生成伪标签，加入训练集反复训练。局限是计算成本高、误差累积。
- Active-Training：让模型选择最“有趣”的数据给标记者，如不确定性采样、委员会查询。

弱监督学习通过自动化或半自动化生成标签。数据编程可使用启发式规则、关键词、字符串匹配、第三方模型。

自监督学习通过数据自身构造预测标签。文本任务包括预测下一个词和完形填空；图像任务包括视频预测下一帧、拼图、对比学习。

对比学习中，同一图像经不同增强方式得到正样本；不同图像增强得到负样本；loss 基于 representation 向量相似度。

数据清理关注异常值、规则违反、模式违反和缺失数据。缺失值可直接删除或补全，补全方法包括均值/中位数、默认值、前后值、线性插值、机器学习方法等。

数据转化包括归一化/规范化、裁剪压缩、词干提取和词形还原、token 提取。

特征工程包括表格数值/分类/字符串特征、文本词袋/词嵌入、图像手工特征或预训练深度网络特征。

<div class="quiz-question" data-answer="B">
  <p><strong>9. Self-Training 半监督学习的主要风险是什么？</strong></p>
  <label><input type="radio" name="aiq9" value="A" /> A. 它完全不能使用无标签数据</label>
  <label><input type="radio" name="aiq9" value="B" /> B. 高置信度伪标签也可能出错，反复加入训练集会造成误差累积</label>
  <label><input type="radio" name="aiq9" value="C" /> C. 它只适用于没有模型训练阶段的系统</label>
  <label><input type="radio" name="aiq9" value="D" /> D. 它要求所有标签都由众包立即完成，不能自动生成</label>
  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：B。<br />解析：Self-Training 用模型为无标签数据生成伪标签，高置信度样本仍可能错误；反复训练会把错误向后传播，形成误差累积。</p>
</div>

# 易错点 / 高频考点

- 概率密度函数在连续变量单点处不是概率；PDF 描述的是局部密度，积分才对应概率。
- 后验、似然、先验不要混淆：MAP 最大化的是似然与先验的乘积，MLE 只最大化似然。
- KL 散度不对称，$D_{KL}(P||Q)$ 与 $D_{KL}(Q||P)$ 含义和结果可能差异很大。
- 线性回归闭式解 $\hat\beta=(A^TA)^{-1}A^TY$ 要求 $A^TA$ 可逆；样本数小于特征维度时一定不可逆。
- 岭回归是 $\mathcal L_2$ 正则，通常压小系数；Lasso 是 $\mathcal L_1$ 正则，可能产生稀疏解。
- 逻辑回归是二分类方法，不是回归；它常用交叉熵而不是均方误差。
- Softmax 用于把多类分数归一化成概率；Sigmoid 常用于二分类概率。
- Dropout 训练时随机断开神经元，测试时不再随机置 0。
- CNN 输出尺寸由输入尺寸、padding、stride 和 filter size 决定；输出 channel 数等于滤波器数量。
- IoU、Precision、Recall、AP、mAP 分别衡量不同方面，不能混用。
- GAN 训练不能让一方过早过强，否则另一方可能没有可用优化方向；模式坍塌是生成覆盖不足的问题。
- RNN 传递前一时间步信息但有长期依赖问题；LSTM 用门控和细胞状态缓解。
- Transformer 的位置编码用于补充顺序信息，Mask 用于屏蔽未来 token。
- BFS 空间开销大但有完备性；DFS 省空间但不保证完备和最优；UCS 适合步长代价不同。
- A* 的最优性依赖启发式不高估实际剩余花费；图搜索还需要一致性条件。
- alpha-beta 剪枝不改变 MINIMAX 结果，但效率高度依赖分枝顺序。
- 强化学习的核心矛盾是探索与利用；$\epsilon$-贪心、乐观初值、UCB 和梯度强盗都是不同平衡方式。
- DP 需要已知环境模型；MC 不 bootstrap；TD 使用 bootstrap 且可从采样中更新。
- AI 系统的性能不只取决于模型，还取决于问题定义、数据质量、标注方式、预处理、部署和持续维护。
