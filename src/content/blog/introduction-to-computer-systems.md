---
title: "计算机系统导论"
description: "计算机系统导论笔记蒸馏，覆盖数据表示、机器代码、处理器、性能、存储层次、链接、进程、虚拟内存、I/O、网络与并发。"
pubDate: 2026-07-29
draft: false
tags: ["课程笔记"]
---

# 原笔记信息
- 原笔记来源：[ICS.md](https://github.com/zhy12138/class_notes/blob/main/ics/ICS.md)
- **本资料由原笔记蒸馏整理，建议配合原笔记查漏补缺。**

# 复习 / 预习建议
- 先按“数据如何表示—程序如何执行—数据如何移动—程序如何与系统交互”的主线阅读速览和各章首段。
- 机器级程序、流水线、缓存、链接、虚拟内存和并发是机制密集区，复习时要能顺着图说出每一步的数据与控制流。
- 公式不要孤立记忆：同时记住适用条件、单位和优化目标，尤其是补码转换、流水线吞吐量、缓存地址划分和地址翻译。
- 系统调用按序列记忆：`fork/execve/waitpid`、`open/read/write/close`、客户端与服务器套接字流程、信号量 `P/V`。
- 做完每章选择题后，用错误选项反查概念边界；汇编指令表、完整 HCL 和长代码仍应回原笔记查漏补缺。

# 速览
- 计算机把程序与数据都编码为字节；补码、IEEE 浮点和大小端规则决定位模式如何解释。
- 编译器把 C 翻译为机器指令；寄存器、栈、条件码、跳转与调用约定共同实现控制流和过程。
- Y86-64 将指令执行拆成取指、译码、执行、访存、写回和更新 PC；流水线以冒险处理换取更高吞吐量。
- 性能优化的关键是减少无效工作、缩短关键路径并增加指令级并行，同时警惕寄存器溢出、分支预测失败和内存瓶颈。
- 存储层次利用时间与空间局部性，用更小更快的层缓存更大更慢的层；缓存参数和访问顺序直接影响命中率。
- 链接器完成符号解析和重定位；异常、进程、信号与非本地跳转让系统跨越普通顺序控制流。
- 虚拟内存同时承担缓存、地址管理和保护；页表、TLB、内存映射与动态分配器连接虚拟地址和实际存储。
- Unix I/O、套接字与线程把单机程序扩展到文件、网络和并发环境，而同步负责维持共享状态的正确性。

# 知识点整理

## 信息的表示和处理

### 字节、字长与字节顺序

计算机通常以 8 位字节作为最小可寻址单位。机器级程序把内存视为字节数组，每个字节以地址唯一标识，所有地址组成虚拟地址空间。一个十六进制数字对应 4 位，一个字节对应两个十六进制数字。

字长是指针数据的标称大小，也决定虚拟地址空间的最大规模。笔记中的常见数据大小如下：

| 类型 | 32 位 | 64 位 |
| --- | ---: | ---: |
| `char` | 1 | 1 |
| `short` | 2 | 2 |
| `int` / `float` | 4 | 4 |
| `long` / 指针 | 4 | 8 |
| `int64_t` / `double` | 8 | 8 |

对字节序列 $[b_{n-1},\ldots,b_0]$：

- 小端法按地址从小到大存储 $b_0,\ldots,b_{n-1}$。
- 大端法按地址从小到大存储 $b_{n-1},\ldots,b_0$。

字节顺序在网络传输、阅读机器代码及用强制类型转换观察对象表示时尤其重要。C 字符串是以值为 0 的 `null` 字符结尾的字符数组；在编码相同的前提下，它不受字长与字节序影响。

### 整数编码、转换与运算

无符号数和补码的值分别为：

$$
B2U_w(\vec{x})=\sum_{i=0}^{w-1}x_i2^i
$$

$$
B2T_w(\vec{x})=-x_{w-1}2^{w-1}+\sum_{i=0}^{w-2}x_i2^i
$$

同宽有符号与无符号转换不改变位模式：

$$
T2U_w(x)=\begin{cases}x+2^w&x<0\\x&x\ge 0\end{cases}
\qquad
U2T_w(x)=\begin{cases}x&x\le TMax_w\\x-2^w&x>TMax_w\end{cases}
$$

混合有符号和无符号运算时，C 会隐式地把有符号数转成无符号数。扩展位数时，无符号数零扩展、有符号数符号扩展；截断则直接丢弃高位。

- 无符号加法和乘法按模 $2^w$ 运算；若无符号和 $s=x+y$ 满足 $s<x$ 或 $s<y$，说明溢出。
- 补码加法、乘法与同位宽无符号运算具有相同的位级结果。
- 整数除法向零舍入。有符号数用算术右移除以 $2^k$ 时，负数应先加偏置：`(x < 0 ? x + (1 << k) - 1 : x) >> k`。
- 位移量应小于操作数位数；机器可能只取位移量低位，但 C 不保证这种行为。

### IEEE 浮点

浮点值写作：

$$V=(-1)^sM2^E$$

`float` 的符号、阶码、尾数字段为 1、8、23 位，`double` 为 1、11、52 位。

| 阶码字段 | 类别 | $E$ | $M$ |
| --- | --- | --- | --- |
| $0<exp<MAX$ | 规格化 | $e-Bias$ | $1.f$ |
| $exp=0$ | 非规格化 | $1-Bias$ | $0.f$ |
| $exp=MAX,f=0$ | 无穷 | — | — |
| $exp=MAX,f\ne0$ | `NaN` | — | — |

舍入采用“向最近值舍入，正好居中时向偶数舍入”。浮点运算每次都可能舍入，所以加法不满足结合律。`NaN` 与任何数运算仍为 `NaN`，对 `NaN` 唯一为真的比较是 `NaN != NaN`。

类型转换边界：`int` 到 `float` 可能舍入但不会溢出；`int` 或 `float` 到 `double` 不会溢出且不舍入；`double` 到 `float` 可能舍入或溢出；浮点到整数向零取整且可能溢出，C 对后者没有给出确定行为。

<div class="quiz-question" data-answer="C">
  <p><strong>1. 一个负的 `int` 与一个 `unsigned` 参与同宽运算时，通常先发生什么？</strong></p>
  <label><input type="radio" name="icsq1" value="A" /> A. 无符号数转换为有符号数</label>
  <label><input type="radio" name="icsq1" value="B" /> B. 两者都转换为浮点数</label>
  <label><input type="radio" name="icsq1" value="C" /> C. 有符号数按相同位模式转换为无符号数</label>
  <label><input type="radio" name="icsq1" value="D" /> D. 编译器必然报告错误</label>
  <div class="quiz-actions"><button type="button" class="submit-answer">提交答案</button><button type="button" class="show-answer">显示答案</button></div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：C。<br />解析：同宽转换保持位模式不变，负补码会被解释为很大的无符号值，因此混合比较尤其容易出错。</p>
</div>

## 程序的机器级表示

### 从源程序到机器代码

`gcc p1.c p2.c -Og -o p` 依次经历预处理、编译为汇编、汇编为目标文件以及链接。目标文件已有指令的二进制表示，但全局符号地址要到链接阶段才能确定。

![C 程序的编译系统流程](/blog/introduction-to-computer-systems/compilation-system.png)

处理器可见状态包括程序计数器、整数寄存器、条件码和内存。程序计数器给出下一条指令地址；整数寄存器保存地址与数据；条件码记录最近算术或逻辑操作的状态。

![处理器与内存中的机器级程序状态](/blog/introduction-to-computer-systems/processor-state.png)

AT&T 格式中，立即数以 `$` 开头，寄存器以 `%` 开头。通用内存操作数可写作 $Imm(r_b,r_i,s)$，有效地址为：

$$Imm+R[r_b]+R[r_i]\cdot s,\quad s\in\{1,2,4,8\}$$

#### 汇编数据格式与寄存器规则

x86-64 用后缀标明操作数大小：`b/w/l/q` 分别对应 1、2、4、8 字节。整数寄存器可以按 64、32、16、8 位子寄存器访问；写 1 或 2 字节会保留其余高位，写 32 位寄存器则自动把对应 64 位寄存器的高 32 位清零。

| 64 位寄存器 | 典型职责 | 保存约定 |
| --- | --- | --- |
| `%rax` | 返回值 | 调用者保存 |
| `%rdi/%rsi/%rdx/%rcx/%r8/%r9` | 前六个整数或指针参数 | 调用者保存 |
| `%rsp` | 栈顶指针 | 特殊 |
| `%rbx/%rbp/%r12`～`%r15` | 局部状态 | 被调用者保存 |
| `%r10/%r11` | 临时值 | 调用者保存 |

操作数有三类：立即数 `$Imm`、寄存器 `R[r_a]` 和内存引用 $M_b[Addr]$。比例变址中的变址寄存器不能是 `%rsp`。没有 `$` 的裸数表示内存地址，而不是立即数。

`movq` 的立即数通常只能编码为符号扩展后的 32 位补码；任意 64 位立即数要用 `movabsq`，且目的只能是寄存器。`movzxy` 把较小源零扩展到较大寄存器，`movsxy` 做符号扩展；没有 `movzlq`，因为写 32 位寄存器本身就会清零高 32 位。

`mov` 传送数据，`movz` 零扩展，`movs` 符号扩展；通常不能用一条 `mov` 完成内存到内存的复制。`pushq` 先将 `%rsp` 减 8 再写栈，`popq` 先读栈再将 `%rsp` 加 8。

### 算术、条件码与控制

`leaq` 计算有效地址但不访存，也常用于普通算术。常见运算还包括一元操作、加减、乘法、移位，以及产生 128 位结果的乘除法。

`sal/shl` 左移并补零，`shr` 逻辑右移并补零，`sar` 算术右移并复制符号位。可变移位量只能放在 `%cl` 中。单操作数 `imulq/mulq` 把 128 位积写入 `%rdx:%rax`；除法也把 `%rdx:%rax` 作为被除数，商写入 `%rax`、余数写入 `%rdx`。有符号除法前可用 `cqto` 把 `%rax` 符号扩展到 `%rdx:%rax`。

条件码包括：

- `CF`：无符号运算进位或借位。
- `ZF`：结果为零。
- `SF`：结果为负。
- `OF`：补码运算溢出。

`cmp` 像减法一样设置条件码但不保存结果，`test` 像按位与一样设置条件码。`set` 指令把条件码组合写成单字节 0 或 1；条件跳转直接改变 PC，条件传送先计算两个分支再按条件选择，适合两边都安全且计算量较小的场景。

循环最终由条件跳转实现。`switch` 在分支较多且值域紧凑时可使用跳转表，以索引直接选择目标地址。

#### 条件控制与条件传送的取舍

条件控制会让处理器预测分支方向；预测失败时必须丢弃已取出的错误路径指令。条件传送同时计算两个候选值，再依据条件码选择结果，避免控制冒险，但不适合以下情况：

- 任一分支可能产生错误或副作用，例如无效指针解引用。
- 两边计算量很大，全部计算反而比预测分支更慢。
- 编译器不能确认改写仍保持源程序语义。

`do-while` 先执行循环体再测试；`while` 可翻译为先跳到测试位置，或先用条件测试跳过循环；`for(init; test; update)` 可视为初始化后执行等价的 `while`，在循环体末完成更新。

### 过程、数据结构与安全

过程调用要处理控制转移、参数传递和局部存储。`call` 把返回地址压栈并跳转，`ret` 从栈顶取回地址。前六个整数或指针参数依次放入 `%rdi`、`%rsi`、`%rdx`、`%rcx`、`%r8`、`%r9`，返回值放在 `%rax`；更多参数放在栈中。

运行时栈向低地址增长。调用者保存寄存器可由被调用过程自由覆盖；被调用者保存寄存器若被使用，必须先保存并在返回前恢复。递归过程可行，是因为每次调用都有自己的栈帧。

#### 栈帧与参数传递细节

`call` 压入的返回地址属于调用者栈帧。被调用过程通过减小 `%rsp` 分配局部区域，返回前恢复 `%rsp`。叶子过程若局部值都能放入寄存器，可以没有栈帧。必须把局部变量放在栈上的典型情形是：寄存器不足、变量被取地址，或变量是必须在内存中布局的数组与结构。

第 7 个及后续参数由调用者放在栈上，第 7 个参数位于返回地址上方；栈上传参区域按 8 字节对齐。返回值从 `%rax` 取得。

数组元素地址按“首地址 + 索引 × 元素大小”计算；嵌套数组按行优先布局。结构体字段按声明顺序存储，可能插入对齐填充；联合的字段共享同一段存储，其大小由最大字段及对齐要求决定。

对元素大小为 $L$ 的数组 `T A[N]`，`A[i]` 地址为 $x_A+Li$。二维数组 `T D[R][C]` 中：

$$\&D[i][j]=x_D+L(Ci+j)$$

指针相减的结果是地址差除以所指类型大小，只对同一数组对象内的指针有定义。结构体要求每个字段地址满足自身对齐，结构总大小还要满足最大对齐要求；这会同时影响字段偏移和数组中相邻结构体的间距。

#### 浮点参数与运算

浮点机器代码使用 XMM 寄存器。浮点参数从 `%xmm0` 开始传递，返回值放在 `%xmm0`；浮点寄存器均为调用者保存。浮点传送与算术指令以后缀 `ss` 表示标量单精度、`sd` 表示标量双精度。浮点比较会设置 `ZF/PF/CF`，其中 `PF` 用于识别含 `NaN` 的无序比较。

越界写可能破坏返回地址。防护机制包括：

- 栈随机化，使栈位置难以预测。
- 栈金丝雀，在返回前检查栈是否被破坏。
- 将内存区域标为不可执行，限制把注入数据当代码运行。

<div class="quiz-question" data-answer="B">
  <p><strong>2. 指令 `leaq 8(%rax,%rbx,4), %rdx` 的核心作用是什么？</strong></p>
  <label><input type="radio" name="icsq2" value="A" /> A. 从内存读取 8 字节到 `%rdx`</label>
  <label><input type="radio" name="icsq2" value="B" /> B. 把 `%rax + 4*%rbx + 8` 写入 `%rdx`</label>
  <label><input type="radio" name="icsq2" value="C" /> C. 把 `%rdx` 写入计算出的内存地址</label>
  <label><input type="radio" name="icsq2" value="D" /> D. 将栈指针增加 8</label>
  <div class="quiz-actions"><button type="button" class="submit-answer">提交答案</button><button type="button" class="show-answer">显示答案</button></div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：B。<br />解析：`leaq` 只计算有效地址而不访问该地址，因此也可用来高效完成线性整数运算。</p>
</div>

## 处理器体系结构

### Y86-64 指令集与顺序实现

Y86-64 是简化的 64 位指令集。程序员可见状态包括 15 个程序寄存器、条件码、程序计数器、内存以及状态码 `Stat`。每条指令首字节的高 4 位为指令代码 `icode`，低 4 位为功能码 `ifun`；寄存器以 4 位编码，`0xF` 表示无寄存器。整数采用小端编码，指令长度为 1～10 字节。

#### 指令编码与语义

Y86-64 指令族包括寄存器、立即数与内存传送，整数运算，条件跳转与条件传送，以及调用、返回、压栈和弹栈。不同指令复用统一字段：首字节总是 `icode:ifun`；需要寄存器时，下一字节编码 `rA:rB`；立即数 `valC` 占 8 字节并按小端排列。指令格式必须让处理器仅凭首字节就能确定长度和其余字段。

- `rrmovq` 把 `rA` 复制到 `rB`，条件传送复用该格式并以 `ifun` 指定条件。
- `irmovq` 把立即数送到 `rB`。
- `rmmovq` 以 `R[rB]+D` 为地址写入 `R[rA]`；`mrmovq` 从该地址读到 `rA`。
- `OPq` 对 `R[rB]` 与 `R[rA]` 运算，结果写回 `rB` 并设置条件码。
- `call`、`pushq` 让栈指针减 8；`ret`、`popq` 让栈指针加 8。

状态码区分正常运行 `AOK`、暂停 `HLT`、非法地址 `ADR` 与非法指令 `INS`。Y86-64 不允许从一个内存位置直接传送到另一个内存位置，也不支持以比例变址形式生成地址。

SEQ 将一条指令组织为六个阶段：

1. **取指**：从 PC 读取指令字节，得到 `icode/ifun`、寄存器字段和常数，并计算 `valP`。
2. **译码**：读取最多两个寄存器操作数 `valA`、`valB`。
3. **执行**：ALU 运算、计算有效地址，并按需要设置条件码。
4. **访存**：读写数据内存。
5. **写回**：把结果写入寄存器文件。
6. **更新 PC**：选择 `valP`、分支目标或返回地址作为新 PC。

#### 各阶段的关键选择

不同指令共享数据通路，控制逻辑根据 `icode` 选择信号：

| 阶段 | 关键任务 |
| --- | --- |
| 取指 | 判断是否有寄存器字节和常数字段，计算顺序地址 `valP` |
| 译码 | 用 `srcA/srcB` 选择读寄存器，用 `dstE/dstM` 指定写回目标 |
| 执行 | 选择 `aluA/aluB` 和 `alufun`，得到 `valE`，必要时更新条件码 |
| 访存 | 选择读写地址与写数据，读出 `valM`，检测地址错误 |
| 写回 | 把 `valE` 写入 `dstE`，把 `valM` 写入 `dstM` |
| PC 更新 | 在 `valP`、调用/跳转目标与返回地址之间选择 |

例如，`mrmovq` 在执行阶段计算 `valE=valB+valC`，访存阶段取得 `valM`，再写回 `rA`；`call` 把 `valP` 写到新栈顶并跳到 `valC`；`ret` 从旧栈顶读出新 PC，同时更新 `%rsp`。

时钟寄存器把组合逻辑分隔开；SEQ 在一个周期内完成一条指令，时钟周期必须覆盖最慢指令经过的组合逻辑路径。

### 流水线、冒险与控制

流水线把计算拆成阶段，使多条指令重叠执行。若总逻辑延迟为 300 ps、寄存器开销为 20 ps，非流水化吞吐量约为 $1/320\text{ ps}=3.12$ GIPS；拆成三个各 100 ps 的阶段后，周期为 120 ps，吞吐量约为 8.33 GIPS，但单条指令延迟增加。

![Y86-64 流水线数据通路](/blog/introduction-to-computer-systems/pipeline-datapath.png)

流水线局限包括阶段划分不均、寄存器开销、流水线过深以及带反馈的相关关系。PIPE 在阶段之间加入流水线寄存器，并预测下一 PC；条件跳转默认预测选择分支，`ret` 的目标则要等返回地址从栈中读出。

流水线寄存器 `F/D/E/M/W` 保存下一阶段所需状态。信号名称用阶段前缀区分，例如 `D_icode` 是译码阶段寄存器中的指令代码，`e_valE` 是执行阶段组合逻辑刚计算出的值。SEQ+ 先把 PC 更新移到周期开始，再插入这些流水线寄存器形成 PIPE。

三类关键冒险：

- **数据冒险**：后续指令需要尚未写回的结果。可暂停，也可把执行或访存阶段结果转发到译码阶段。
- **加载/使用冒险**：加载结果到访存阶段末才可用，紧随其后的使用者通常仍需暂停一个周期。
- **控制冒险**：分支预测错误或处理 `ret` 时，必须暂停取指或向错误路径插入气泡。

#### 暂停、气泡与转发优先级

暂停保持流水线寄存器原值；气泡把寄存器改成等价于 `nop` 的状态。控制逻辑必须避免要求同一流水线寄存器同时暂停和插入气泡。

- 一般数据相关优先使用转发：译码逻辑从执行、访存或写回阶段选择最新值，而不是等待寄存器文件更新。
- 若 E 阶段是加载或 `popq`，且 `E_dstM` 等于 D 阶段指令的 `d_srcA` 或 `d_srcB`，则暂停 F、D，并向 E 插入气泡。
- 流水线中存在 `ret` 时暂停取指，直到返回地址可供 PC 选择；若同时发生加载/使用冒险，不能错误清除仍需保留的 `ret`。
- 条件跳转预测错误时，把进入 D 和 E 的错误路径指令变成气泡。

异常处理遵循：只报告流水线中最深指令造成的异常；异常指令之后的指令不能改变程序员可见状态；发生异常的指令到达写回阶段时停止处理器。

### 流水线性能与现实限制

平均每条指令使用的周期数为 CPI，理想单发射流水线的 CPI 接近 1。加载/使用暂停、分支预测错误和 `ret` 都会插入气泡并提高 CPI，因此优化既要缩短阶段延迟，也要减少处罚发生次数。

笔记中的 PIPE 仍省略了两类现实问题：多周期指令无法在一个执行阶段周期内完成；指令缓存或数据缓存不命中时，存储系统无法立即返回。完整实现需暂停相关阶段，等功能单元或存储器给出结果后恢复。

<div class="quiz-question" data-answer="D">
  <p><strong>3. 为什么转发通常不能完全消除紧邻的加载/使用冒险？</strong></p>
  <label><input type="radio" name="icsq3" value="A" /> A. 加载指令不会写寄存器</label>
  <label><input type="radio" name="icsq3" value="B" /> B. 所有内存读取都需要两条指令</label>
  <label><input type="radio" name="icsq3" value="C" /> C. 转发只能处理控制冒险</label>
  <label><input type="radio" name="icsq3" value="D" /> D. 被加载的数据到访存阶段末才产生，下一条指令需要得更早</label>
  <div class="quiz-actions"><button type="button" class="submit-answer">提交答案</button><button type="button" class="show-answer">显示答案</button></div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：D。<br />解析：时间上来不及直接转发给紧随其后的执行阶段，因此需暂停一个周期，再转发已得到的加载值。</p>
</div>

<div class="quiz-question" data-answer="B">
  <p><strong>3.1. PIPE 检测到紧邻的加载/使用冒险时，应怎样控制流水线？</strong></p>
  <label><input type="radio" name="icsq13" value="A" /> A. 清空所有流水线寄存器并重新启动</label>
  <label><input type="radio" name="icsq13" value="B" /> B. 暂停 F、D，并向 E 插入气泡</label>
  <label><input type="radio" name="icsq13" value="C" /> C. 只暂停写回阶段</label>
  <label><input type="radio" name="icsq13" value="D" /> D. 让两条指令同时写同一寄存器</label>
  <div class="quiz-actions"><button type="button" class="submit-answer">提交答案</button><button type="button" class="show-answer">显示答案</button></div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：B。<br />解析：保留取指和译码中的指令，向执行阶段送入气泡，可等待加载值产生后再转发。</p>
</div>

## 优化程序性能

### 度量与基本变换

编译器必须遵守语言语义，且通常不能假定指针不会别名、函数调用没有副作用，因此某些看似明显的优化需要程序员重写代码才能安全实施。

每元素周期数 CPE 用渐近方式表示处理 $n$ 个元素所需时间：

$$T(n)=CPE\cdot n+Overhead$$

基本优化包括：

- 把循环中不变的计算移到循环外，例如只计算一次字符串长度。
- 减少循环中的过程调用。
- 用局部变量累积结果，避免每轮都读写内存。
- 选择合适的数据类型和运算，不依赖编译器完成不被语义允许的变换。

#### 编译器优化的边界

两类障碍尤其重要：

- **内存别名**：两个指针可能指向同一位置，编译器不能随意交换或消除读写。把结果累积在局部变量、循环结束后只写回一次，能显式消除反复的内存引用。
- **函数副作用**：编译器不能假设一次函数调用只依赖参数，也不能随意减少调用次数。像循环条件中反复调用 `strlen` 会把线性循环变成二次复杂度；先保存长度即可消除低效率。

优化前应先选择合适算法与数据结构，再编写编译器容易优化的代码，最后用测量定位热点。代码移动、减少过程调用和消除不必要内存访问主要减少工作量；展开和多累积变量主要提高流水线利用率。

### 指令级并行与限制

现代乱序处理器会取指、译码为操作、把操作分派到不同功能单元执行，再按顺序提交结果。数据流图中的最长依赖链形成关键路径；吞吐量还受功能单元数量与发射容量限制。

循环展开减少循环控制开销，但仅展开而仍使用单一累积变量，关键依赖链未必缩短。使用多个独立累积变量可形成并行链；重新结合变换也能改变依赖结构，但浮点运算因不满足结合律而可能改变结果。

#### 延迟界限与吞吐量界限

功能单元具有“延迟、发射时间、容量”三个指标：延迟决定相关操作间至少间隔多少周期；发射时间决定同类操作多久能启动一次；容量表示处理器中有多少个同类单元。程序 CPE 下界取决于两类约束：

- **延迟界限**：关键依赖链无法并行。例如单累积变量的每次乘法依赖上一次乘积。
- **吞吐量界限**：每周期需要的操作数超过功能单元供给，即使它们互不依赖也无法更快。

多累积变量打断单一依赖链，但展开因子太大时，活跃临时值超过寄存器数量会溢出到栈，重新引入内存访问。整数重新结合通常保持结果；浮点重新结合可能改变舍入次序，必须确认允许这种语义变化。

进一步限制包括寄存器不足导致溢出到栈、分支预测错误处罚、加载延迟和存储/加载地址相关。可预测分支通常不是主要瓶颈；难预测且两边计算都安全时，条件传送可能更好。

存储操作还存在地址与数据两条依赖链。加载的吞吐量可很高，但连续“读取一个值，再用它生成下一地址”的链受加载延迟限制。存储后紧接着从可能相同的地址加载时，处理器必须确认地址关系，无法确认会限制并行。

![指令数据流与关键依赖路径](/blog/introduction-to-computer-systems/dependency-path.png)

<div class="quiz-question" data-answer="A">
  <p><strong>4. 对使用单一累积变量的求和循环，只做循环展开却没有明显降低 CPE，最可能的原因是什么？</strong></p>
  <label><input type="radio" name="icsq4" value="A" /> A. 累积操作之间仍有串行数据依赖</label>
  <label><input type="radio" name="icsq4" value="B" /> B. 循环展开必然增加分支次数</label>
  <label><input type="radio" name="icsq4" value="C" /> C. 处理器不能执行展开后的代码</label>
  <label><input type="radio" name="icsq4" value="D" /> D. CPE 与数据依赖无关</label>
  <div class="quiz-actions"><button type="button" class="submit-answer">提交答案</button><button type="button" class="show-answer">显示答案</button></div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：A。<br />解析：展开可减少循环控制开销，但单累积变量仍形成一条关键依赖链；多个独立累积变量才可提高并行性。</p>
</div>

<div class="quiz-question" data-answer="C">
  <p><strong>4.1. 多累积变量优化主要突破哪一种性能限制？</strong></p>
  <label><input type="radio" name="icsq14" value="A" /> A. 可执行文件大小限制</label>
  <label><input type="radio" name="icsq14" value="B" /> B. 虚拟地址位数限制</label>
  <label><input type="radio" name="icsq14" value="C" /> C. 单一累积链造成的延迟界限</label>
  <label><input type="radio" name="icsq14" value="D" /> D. 系统调用权限限制</label>
  <div class="quiz-actions"><button type="button" class="submit-answer">提交答案</button><button type="button" class="show-answer">显示答案</button></div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：C。<br />解析：多个独立累积链让处理器并行执行操作，但最终仍可能受功能单元吞吐量或寄存器数量限制。</p>
</div>

## 存储器层次结构

### 存储技术与局部性

SRAM 比 DRAM 更快、更贵，常用于高速缓存；DRAM 用作主存。DRAM 芯片把位组织为超单元阵列，通过行地址与列地址访问。磁盘访问时间由寻道时间、旋转延迟和传送时间组成；固态硬盘用闪存页和块组织数据，随机写需要先擦除整块且会磨损。

存储技术的核心趋势是容量提高快于访问速度。系统因而把寄存器、L1/L2/L3 缓存、主存和本地/远程存储组织为层次：上层更快、更小、更贵，下层更慢、更大、更便宜。

![存储器层次结构](/blog/introduction-to-computer-systems/memory-hierarchy.png)

程序反复引用近期访问的数据体现时间局部性，访问相邻地址体现空间局部性。步长为 1 的顺序访问通常有良好空间局部性；循环体越小、重复执行越多，指令局部性越好。

### 高速缓存组织与写策略

一个高速缓存可描述为 $(S,E,B,m)$：$S=2^s$ 个组，每组 $E$ 行，每行含 $B=2^b$ 字节数据块，地址共 $m$ 位。地址拆为标记、组索引和块偏移：

$$m=(m-s-b)+s+b$$

读缓存过程是：用组索引选组，在组内比较有效行的标记，命中后由块偏移选择字节。直接映射缓存有 $E=1$；组相联有 $1<E<C/B$；全相联只有一组。缓存不命中可分为冷不命中、冲突不命中和容量不命中。

#### 直接映射与组相联的访问步骤

对地址 A 的读取可严格分成三步：

1. 用中间 $s$ 位选择唯一组。
2. 在该组中寻找 `valid=1` 且标记等于地址高位的行。直接映射只检查一行；组相联并行检查 $E$ 行。
3. 命中后用低 $b$ 位选出块内字节；不命中则从下一层取整个块并选择牺牲行。

直接映射的牺牲行唯一。组相联通常采用最近最少使用 LRU 或随机替换。全相联无需组索引，可把块放入任意行，查找成本最高。

假设数组元素映射到相同少数几组，即使缓存总容量足够，也可能来回驱逐，形成冲突不命中；修改数组起始位置、循环顺序或给结构增加适当间隔都可能改变映射。

写命中可采用直写或写回；写不命中可采用写分配或非写分配。写回减少总线传输，但需要脏位并使替换更复杂。

| 情况 | 策略 | 行为 |
| --- | --- | --- |
| 写命中 | 直写 | 同时更新缓存和下一层，流量较大但一致性简单 |
| 写命中 | 写回 | 只更新缓存并置脏位，驱逐时才写下一层 |
| 写不命中 | 写分配 | 先把块调入缓存，再更新；常与写回配合 |
| 写不命中 | 非写分配 | 绕过缓存直接写下一层；常与直写配合 |

影响性能的因素包括命中率、命中时间和不命中处罚。增大块能利用空间局部性，但块过大会减少行数、增加传输时间；提高相联度可减少冲突，却使查找和替换更复杂。

![工作集大小与访问步长形成的存储器山](/blog/introduction-to-computer-systems/memory-mountain.png)

多维数组按内存布局顺序遍历可显著改善空间局部性。笔记的矩阵示例说明，交换循环次序就可能从逐行访问变为大步长访问。

<div class="quiz-question" data-answer="B">
  <p><strong>5. 对一个参数为 $(S,E,B,m)$ 的缓存，地址中的组索引位数和块偏移位数分别是多少？</strong></p>
  <label><input type="radio" name="icsq5" value="A" /> A. $E$ 和 $B$</label>
  <label><input type="radio" name="icsq5" value="B" /> B. $\log_2S$ 和 $\log_2B$</label>
  <label><input type="radio" name="icsq5" value="C" /> C. $m-S$ 和 $m-B$</label>
  <label><input type="radio" name="icsq5" value="D" /> D. 都是 $\log_2E$</label>
  <div class="quiz-actions"><button type="button" class="submit-answer">提交答案</button><button type="button" class="show-answer">显示答案</button></div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：B。<br />解析：若 $S=2^s$、$B=2^b$，组索引为 $s$ 位，块偏移为 $b$ 位，其余高位作为标记。</p>
</div>

<div class="quiz-question" data-answer="D">
  <p><strong>5.1. 写回缓存中的脏位表示什么？</strong></p>
  <label><input type="radio" name="icsq15" value="A" /> A. 该行标记比较失败</label>
  <label><input type="radio" name="icsq15" value="B" /> B. 该行从未被读取</label>
  <label><input type="radio" name="icsq15" value="C" /> C. 该行必须立即失效</label>
  <label><input type="radio" name="icsq15" value="D" /> D. 该行已修改且下一层尚未同步</label>
  <div class="quiz-actions"><button type="button" class="submit-answer">提交答案</button><button type="button" class="show-answer">显示答案</button></div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：D。<br />解析：写回策略只修改缓存并置脏位，直到该行被驱逐时才写回下一层。</p>
</div>

## 链接

### 目标文件、符号解析与重定位

静态链接器以可重定位目标文件为输入，执行两项主要任务：

1. **符号解析**：把每个符号引用关联到一个符号定义。
2. **重定位**：合并代码与数据节，确定地址，并修改对符号的引用。

ELF 可重定位目标文件包括 ELF 头、`.text`、`.rodata`、`.data`、`.bss`、重定位节、符号表和节头表。`.data` 保存已初始化全局/静态变量，`.bss` 表示未初始化或初始化为零的数据，本身不占用实际文件空间。

![ELF 可重定位目标文件结构](/blog/introduction-to-computer-systems/elf-object-file.png)

符号分为由本模块定义并可被其他模块引用的全局符号、由其他模块定义的外部符号，以及只在本模块定义和引用的局部符号。局部非静态变量通常不进入符号表，而由栈管理。

#### ELF 节与符号表字段

常见节还包括：`.symtab` 符号表、`.rel.text` 代码重定位、`.rel.data` 数据重定位、`.debug` 调试信息、`.line` 源码行号映射和 `.strtab` 字符串表。节头表记录各节的类型、地址、偏移、大小和对齐。

每个符号表条目至少描述名称、值、大小、类型、绑定属性和所在节。特殊伪节包括：`ABS` 表示不应重定位的绝对符号，`UNDEF` 表示未定义符号，`COMMON` 表示尚未分配位置的未初始化数据。局部 `static` 变量若同名，编译器会在符号表中为它们生成不同的局部名字。

对同名全局符号，函数和已初始化全局变量是强符号，未初始化全局变量是弱符号。规则是：不允许多个同名强符号；一个强符号与多个弱符号同名时选择强符号；只有多个弱符号时任选其一。由此产生的类型不匹配可能静默破坏数据。

静态库把多个目标模块打包。链接器按命令行从左到右扫描文件，只从库中取出解决当前未解析引用所需的成员，因此库的次序会影响结果。

链接器维护已确定符号集合、未解析符号集合和已纳入目标模块集合。扫描普通目标文件时直接加入；扫描静态库时，只反复抽取能解决当前未解析符号的成员。因而引用某库的目标文件应放在该库之前；库之间相互依赖时可能需要重复列出库。

#### 重定位条目与两种引用

汇编器遇到最终位置未知的引用，会生成重定位条目。条目给出待修改位置的偏移、引用符号、重定位类型和加数。链接器先为输入节与符号分配运行时地址，再修改引用。

- `R_X86_64_PC32`：32 位 PC 相对引用，写入“目标地址 + 加数 − 引用运行时地址”。调用指令常用它，使代码搬移后相对距离仍有效。
- `R_X86_64_32`：32 位绝对引用，写入“目标地址 + 加数”，常用于数据中的指针。

若重定位字段占 4 字节，条目加数可能为 -4，以便相对基准落在下一条指令地址。区分“节中文件偏移”和“装入后的运行时地址”是手算重定位的关键。

### 可执行文件、共享库与打桩

可执行目标文件已包含装入内存所需的信息。加载器把代码和数据映射到地址空间，跳到入口点，再由启动代码调用 `main`。

ELF 程序头表描述文件片段到内存段的映射，包括文件偏移 `off`、虚拟地址 `vaddr`、文件大小 `filesz`、内存大小 `memsz`、权限和对齐。`.bss` 使 `memsz` 可以大于 `filesz`，多出的内存清零。映射需满足：

$$vaddr\bmod align=off\bmod align$$

加载器依据程序头建立代码、数据、堆和栈区域，跳到 `_start`；启动代码初始化环境后调用 `main`。映射不意味着启动时复制全部内容，页面可在首次访问时按需调入。

共享库可在加载时动态链接；应用也可用 `dlopen`、`dlsym`、`dlclose` 在运行时加载。位置无关代码 PIC 通过全局偏移量表 GOT 引用数据，并借助过程链接表间接调用外部函数，使共享代码无需因装入地址不同而修改。

`dlopen` 的 `RTLD_NOW` 立即解析外部符号，`RTLD_LAZY` 推迟到使用时解析；`dlsym` 从句柄查找符号地址，`dlerror` 返回最近错误。运行时动态加载适合插件和无需重启即可更新的服务组件。

PIC 利用同一模块中代码段与数据段距离固定，以 PC 相对寻址访问模块内部符号。外部全局数据经 GOT 间接访问；外部函数由 PLT 与 GOT 配合延迟绑定：第一次调用进入动态链接器并把真实地址写回 GOT，以后的调用直接通过 GOT 跳转。

库打桩允许截获对共享库函数的调用，可在编译时、链接时或运行时实现，用于跟踪、计数和替换函数行为。

- 编译时打桩用宏把目标函数名替换成包装函数，需要源代码。
- 链接时打桩用链接器 `--wrap` 把 `f` 映射到 `__wrap_f`，包装器以 `__real_f` 调回真实函数，需要可重定位文件。
- 运行时打桩把包装函数制成共享库并通过 `LD_PRELOAD` 优先解析，只需要可执行文件；包装器可用 `dlsym(RTLD_NEXT, ...)` 找到下一定义。

<div class="quiz-question" data-answer="C">
  <p><strong>6. 静态链接器处理目标文件时最核心的两项任务是什么？</strong></p>
  <label><input type="radio" name="icsq6" value="A" /> A. 分页与调度</label>
  <label><input type="radio" name="icsq6" value="B" /> B. 编译与汇编</label>
  <label><input type="radio" name="icsq6" value="C" /> C. 符号解析与重定位</label>
  <label><input type="radio" name="icsq6" value="D" /> D. 压缩与加密</label>
  <div class="quiz-actions"><button type="button" class="submit-answer">提交答案</button><button type="button" class="show-answer">显示答案</button></div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：C。<br />解析：符号解析把引用绑定到定义，重定位确定最终地址并修正代码和数据中的符号引用。</p>
</div>

<div class="quiz-question" data-answer="A">
  <p><strong>6.1. `R_X86_64_PC32` 重定位写入的核心量是什么？</strong></p>
  <label><input type="radio" name="icsq16" value="A" /> A. 目标地址相对引用位置的位移</label>
  <label><input type="radio" name="icsq16" value="B" /> B. 目标文件的总字节数</label>
  <label><input type="radio" name="icsq16" value="C" /> C. 符号名称字符串的长度</label>
  <label><input type="radio" name="icsq16" value="D" /> D. 共享库在磁盘上的 inode</label>
  <div class="quiz-actions"><button type="button" class="submit-answer">提交答案</button><button type="button" class="show-answer">显示答案</button></div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：A。<br />解析：PC 相对重定位用目标运行时地址加上加数，再减去引用位置的运行时地址。</p>
</div>

## 异常控制流

### 异常与进程

异常是控制流的突变，由处理器状态变化触发。异常处理程序运行后可能返回当前指令、返回下一条指令，或终止程序。

| 类别 | 原因 | 同步性 | 典型返回位置 |
| --- | --- | --- | --- |
| 中断 | 外部 I/O 信号 | 异步 | 下一条指令 |
| 陷阱 | 有意执行指令 | 同步 | 下一条指令 |
| 故障 | 潜在可恢复错误 | 同步 | 当前指令或终止 |
| 终止 | 不可恢复错误 | 同步 | 不返回 |

系统调用属于陷阱。应用以系统调用号和参数请求内核服务，处理器从用户模式进入内核模式，完成后返回。

异常表把异常号映射到处理程序地址。处理器检测事件后通过异常表转移控制，异常处理程序在内核模式运行。中断来自处理器外部并在指令边界处理；陷阱是程序有意请求；故障可能由处理程序修复后重新执行当前指令；终止直接交给内核结束程序。

进程为程序提供独立的逻辑控制流和私有地址空间。多个流在时间上重叠就是并发流。上下文切换保存当前进程寄存器等状态，恢复另一进程状态，并把控制交给新进程。

用户模式不能执行特权指令，也不能直接访问内核地址空间；进程通过系统调用进入内核。内核可能在系统调用阻塞、定时器中断或其他异常发生后决定调度另一进程，于是保存当前上下文并恢复目标进程上下文。

![异常进入内核并返回应用的控制转移](/blog/introduction-to-computer-systems/exception-control-flow.png)

### 进程控制

`fork()` 创建子进程。它调用一次、返回两次：父进程得到子进程 PID，子进程得到 0。子进程获得父进程虚拟地址空间的副本，并继承打开的文件描述符。

`exit(status)` 终止进程；已终止但尚未回收的子进程是僵死进程。父进程用 `waitpid` 回收子进程并取得状态。`execve(filename, argv, envp)` 在当前进程中加载新程序，覆盖代码、数据、栈并设置入口；成功时不返回，PID 不变。

`waitpid(pid, &status, options)` 的等待集合由 `pid` 决定：大于 0 等待指定子进程，-1 等待任一子进程。默认阻塞到子进程终止；`WNOHANG` 在没有已终止子进程时立即返回 0，`WUNTRACED` 也报告停止的子进程。状态可用 `WIFEXITED/WEXITSTATUS`、`WIFSIGNALED/WTERMSIG`、`WIFSTOPPED/WSTOPSIG` 检查。

父进程若不回收子进程，僵死状态会保留到父进程终止，再由系统接管回收。并发创建多个子进程时，不能假设它们按创建顺序结束。

可靠的 shell 风格启动序列是：父进程 `fork`，子进程调用 `execve`，父进程用 `waitpid` 等待前台作业或继续管理后台作业。

### 信号与非本地跳转

信号是通知进程发生某类事件的小消息。发送信号只设置待处理状态；接收信号时，进程可以忽略、终止或执行用户处理程序。一个类型至多有一个待处理信号，后续同类信号不会排队。

信号可由内核异常、`kill` 命令或函数、键盘控制字符、`alarm` 等来源发送。进程组允许一次把信号发送给作业中的所有进程。信号的默认行为包括终止、终止并转储、停止或忽略；`signal`/`sigaction` 可安装处理程序，但 `SIGSTOP` 和 `SIGKILL` 不能被捕获或忽略。

可用 `sigprocmask` 阻塞或解除阻塞信号。处理程序与主程序并发，因而应保持简短，只调用异步信号安全函数，保存并恢复 `errno`，并以 `volatile sig_atomic_t` 访问共享标志。为避免“检查条件后再休眠”之间丢失信号，应先阻塞信号、检查状态，再用 `sigsuspend` 原子地临时解除阻塞并等待。

处理 `SIGCHLD` 时一次信号可能对应多个已结束子进程，所以处理程序应循环调用 `waitpid(-1, ..., WNOHANG)`，直到没有可回收子进程。创建子进程前先阻塞 `SIGCHLD`，把 PID 加入作业表后再解除，可避免子进程过快退出、处理程序先于父进程登记作业的竞态。

`setjmp` 保存调用环境，直接返回 0；之后 `longjmp` 恢复该环境，使 `setjmp` 再次返回非零值。它可从深层调用中立即返回，但不会自动回收 C 栈以外的资源。

<div class="quiz-question" data-answer="A">
  <p><strong>7. `execve` 成功执行后，当前进程会发生什么？</strong></p>
  <label><input type="radio" name="icsq7" value="A" /> A. 装入新程序且不返回原调用点，PID 保持不变</label>
  <label><input type="radio" name="icsq7" value="B" /> B. 创建一个新 PID 并让原进程继续</label>
  <label><input type="radio" name="icsq7" value="C" /> C. 只替换一个函数，其他代码不变</label>
  <label><input type="radio" name="icsq7" value="D" /> D. 必须先把所有文件描述符关闭</label>
  <div class="quiz-actions"><button type="button" class="submit-answer">提交答案</button><button type="button" class="show-answer">显示答案</button></div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：A。<br />解析：`execve` 替换当前进程的程序映像而不创建进程；成功后控制从新程序入口开始，因此不返回原调用点。</p>
</div>

<div class="quiz-question" data-answer="C">
  <p><strong>7.1. `SIGCHLD` 处理程序为何通常循环调用非阻塞 `waitpid`？</strong></p>
  <label><input type="radio" name="icsq17" value="A" /> A. 每个子进程会发送无限多个信号</label>
  <label><input type="radio" name="icsq17" value="B" /> B. `waitpid` 一次会创建一个子进程</label>
  <label><input type="radio" name="icsq17" value="C" /> C. 同类型信号不排队，一次处理时可能已有多个子进程结束</label>
  <label><input type="radio" name="icsq17" value="D" /> D. 信号处理程序必须永久阻塞</label>
  <div class="quiz-actions"><button type="button" class="submit-answer">提交答案</button><button type="button" class="show-answer">显示答案</button></div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：C。<br />解析：普通信号只记录是否待处理，不累计次数，所以一次进入处理程序时要尽可能回收所有已终止子进程。</p>
</div>

## 虚拟内存

### 缓存、管理与保护

CPU 生成虚拟地址，内存管理单元 MMU 将其翻译为物理地址。每个进程看到独立、连续的虚拟地址空间，而物理页可以分散、共享或暂不驻留。

虚拟内存的三个作用：

- **缓存**：把磁盘上的虚拟页按需缓存在 DRAM 中。
- **管理**：为每个进程提供一致地址空间，简化链接、加载、共享与分配。
- **保护**：页表项的读、写、执行和特权位限制进程访问。

页表以虚拟页号 VPN 索引页表项 PTE。PTE 有效时给出物理页号 PPN；无效项可能表示尚未分配，或页面在磁盘上。访问不驻留页触发缺页异常，内核选择牺牲页、必要时写回，再装入目标页并重新执行指令。

DRAM 缓存与 SRAM 缓存的代价不同：缺页处罚极高，且磁盘扇区访问粒度较大，所以虚拟页通常较大、采用全相联放置，并使用更复杂的替换策略。写策略采用写回，而不是每次写都同步到磁盘。良好局部性使工作集可留在物理内存；工作集总量超过物理内存会导致频繁换页。

### 地址翻译、TLB 与多级页表

若页大小为 $P=2^p$，虚拟地址拆为 VPN 与 $p$ 位虚拟页偏移 VPO；物理地址拆为 PPN 与同一组物理页偏移 PPO。页内偏移在翻译中不变。

TLB 是页表项的小型组相联缓存。TLB 命中时无需访问内存页表；未命中时硬件或异常处理程序取 PTE 并填入 TLB。高速缓存常以翻译后的物理地址访问。

![带 TLB 的地址翻译路径](/blog/introduction-to-computer-systems/tlb-address-translation.png)

多级页表只为已使用的地址区域分配下级表。虚拟地址的 VPN 分成多个索引，逐级定位最终 PTE，从而节省页表空间，但 TLB 未命中时需要更多次内存访问。

#### 地址翻译的判定顺序

一次地址访问可能组合出不同路径：

1. CPU 产生 VA，TLB 用 VPN 的索引与标记查找 PTE。
2. TLB 命中且权限允许，直接得到 PPN；TLB 未命中则读取页表。
3. PTE 有效就把映射填入 TLB；PTE 无效且页面已分配则触发缺页；地址未分配或权限不允许则触发保护异常。
4. PPN 与不变的 VPO 拼成 PA，再访问物理高速缓存；缓存也可能命中或不命中。

因此“TLB 命中”不保证数据缓存命中，“TLB 未命中”也不等于缺页。前者缓存地址翻译，后者缓存普通内存块。

### 内存映射与动态分配

内存映射把虚拟内存区域与磁盘对象关联。私有对象采用写时复制：多个进程先共享物理页，任一进程写入时才复制。`fork` 借此高效创建子进程；`execve` 删除原区域并映射新程序的代码、数据、堆、栈及共享对象。

`mmap` 可创建文件或匿名映射，`munmap` 删除映射。共享映射的修改可反映到底层对象，私有映射的修改不会。

私有映射在页表项中先标成只读；写入时触发保护故障，内核复制物理页、更新写进程 PTE 后重新执行写操作。这一写时复制机制同时支撑私有文件映射与 `fork`。

动态分配器维护堆中的已分配块和空闲块。显式分配器通过 `malloc/free` 管理，必须立即响应请求、只使用堆、满足对齐且不能移动已分配块。目标是在吞吐率和峰值内存利用率之间折中。

碎片分为：

- 内部碎片：已分配块比有效载荷大。
- 外部碎片：空闲空间总量足够，但没有足够大的连续块。

隐式空闲链表通过块头的大小与分配位遍历所有块；放置策略有首次适配、下一次适配和最佳适配。分割减少内部碎片，合并相邻空闲块减少假碎片。边界标记在块尾保存副本，使分配器可在常数时间找到前一块。显式链表只连接空闲块；分离空闲链表按大小类组织链表。

#### 堆块操作与合并情形

块大小必须包含头部、有效载荷、填充，以及空闲块可能需要的脚部和链表指针，并满足双字对齐。因为低地址位因对齐恒为 0，可把“已分配位”塞进块大小字段低位。

找到空闲块后，如果剩余空间足以形成合法空闲块就分割，否则把整块分配。没有合适块时通过 `sbrk` 扩展堆，并把新空间与末尾空闲块合并。释放块时相邻状态有四种：前后均已分配、仅后空闲、仅前空闲、前后均空闲；边界标记让分配器无需从头扫描即可读取前块大小。

显式空闲链表把空闲块组织为双向链表，使首次适配只遍历空闲块，但释放时插入次序会影响局部性与合并成本。分离链表为不同块大小维护独立链表，可以近似最佳适配并提高搜索速度。

![带边界标记的堆块格式](/blog/introduction-to-computer-systems/boundary-tag-block.png)

Mark & Sweep 垃圾收集从根结点递归标记可达块，再扫描堆回收未标记块。C 中只能保守判断某个字是否可能是指针，因此可能保留实际不可达的块。

C 中常见错误包括间接引用坏指针、栈缓冲区越界、错算对象大小、指针算术尺度错误、返回局部变量地址、释放后继续使用、重复释放和忘记释放。尤其要区分“指针本身大小”和“指向对象大小”，为数组分配时应按元素数乘 `sizeof(元素类型)`。

<div class="quiz-question" data-answer="D">
  <p><strong>8. 在页大小为 $2^p$ 字节的系统中，虚拟地址翻译后哪一部分保持不变？</strong></p>
  <label><input type="radio" name="icsq8" value="A" /> A. 虚拟页号 VPN</label>
  <label><input type="radio" name="icsq8" value="B" /> B. 页表索引的所有高位</label>
  <label><input type="radio" name="icsq8" value="C" /> C. 物理页号 PPN</label>
  <label><input type="radio" name="icsq8" value="D" /> D. 低 $p$ 位页内偏移</label>
  <div class="quiz-actions"><button type="button" class="submit-answer">提交答案</button><button type="button" class="show-answer">显示答案</button></div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：D。<br />解析：页表把 VPN 映射为 PPN，页内字节位置不变，所以 VPO 直接成为 PPO。</p>
</div>

<div class="quiz-question" data-answer="B">
  <p><strong>8.1. 下列哪种情况属于 TLB 未命中但不是缺页？</strong></p>
  <label><input type="radio" name="icsq18" value="A" /> A. 虚拟地址没有分配且没有 PTE</label>
  <label><input type="radio" name="icsq18" value="B" /> B. TLB 中没有映射，但页表项有效且页面驻留内存</label>
  <label><input type="radio" name="icsq18" value="C" /> C. PTE 表示页面在磁盘上</label>
  <label><input type="radio" name="icsq18" value="D" /> D. 写入只读页面并且权限不允许</label>
  <div class="quiz-actions"><button type="button" class="submit-answer">提交答案</button><button type="button" class="show-answer">显示答案</button></div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：B。<br />解析：TLB 未命中只需查页表；若 PTE 有效，可填充 TLB 后继续，不需要从磁盘调页。</p>
</div>

## 系统级 I/O

### Unix I/O 与文件

Unix 把许多 I/O 设备统一为文件。应用通过描述符引用打开文件：

```c
int open(const char *filename, int flags, mode_t mode);
ssize_t read(int fd, void *buf, size_t n);
ssize_t write(int fd, const void *buf, size_t n);
int close(int fd);
```

`read` 返回实际读取字节数，0 表示 EOF，-1 表示错误；`write` 也可能发生不足值。稳健 I/O（RIO）通过循环处理不足值：无缓冲函数适合网络二进制数据，带缓冲函数适合逐行文本输入。

#### 不足值与 RIO

不足值不是错误：磁盘读到 EOF、终端一次只提供一行、网络缓冲区当前只有部分数据时，`read` 都可能少于请求量。对网络程序，不能假设一次 `read/write` 完成全部传输。

- `rio_readn` 与 `rio_writen` 反复调用 Unix I/O，直到传完指定字节、遇到 EOF 或错误；被信号中断且 `errno==EINTR` 时重试。
- `rio_readinitb` 为描述符建立内部缓冲区。
- `rio_readlineb` 从缓冲区逐字符复制到用户缓冲区，读到换行、最大长度或 EOF 为止。
- `rio_readnb` 从同一缓冲区读取指定数量的二进制数据。

带缓冲 RIO 不是线程间共享同一个缓冲状态的接口；每个连接应维护自己的 `rio_t`。

普通文件由字节序列组成，目录是文件名到文件位置的映射。内核用 `stat` 返回文件元数据；`opendir/readdir/closedir` 遍历目录。

`open` 的 `O_RDONLY/O_WRONLY/O_RDWR` 指定访问方式，`O_CREAT` 在不存在时创建，`O_TRUNC` 截断已有文件，`O_APPEND` 让每次写在文件尾进行。新文件权限由 `mode` 与进程 `umask` 共同决定。应用必须检查系统调用返回值并在所有路径关闭不再使用的描述符。

### 描述符共享、重定向与 I/O 选择

描述符表属于进程；打开文件表记录当前位置、引用计数等；v-node 表保存文件元数据。不同描述符可以指向同一个打开文件表项，`fork` 后父子进程的描述符表分别指向共同的打开文件表项，因此共享文件位置。

![描述符表、打开文件表与 v-node 的共享关系](/blog/introduction-to-computer-systems/file-descriptor-sharing.png)

`dup2(oldfd, newfd)` 让 `newfd` 指向 `oldfd` 对应的打开文件，shell 用它实现标准输入输出重定向。

标准 I/O 用 `FILE` 流和用户缓冲区封装 Unix I/O。网络套接字上不要混用多个带缓冲包；读取元数据用 Unix I/O，网络使用 RIO，磁盘和终端通常优先标准 I/O。

标准 I/O 流不能直接用于读取目录元数据；复制二进制文件时也要避免把 EOF 与某个字节值混淆。在同一描述符上混合 RIO 与标准 I/O 会让不同用户缓冲区对内核文件位置产生不一致认识。

<div class="quiz-question" data-answer="B">
  <p><strong>9. `fork` 后父子进程继承同一个打开文件描述符，二者最重要的共享状态是什么？</strong></p>
  <label><input type="radio" name="icsq9" value="A" /> A. 各自的描述符表数组本身</label>
  <label><input type="radio" name="icsq9" value="B" /> B. 描述符指向的打开文件表项及文件位置</label>
  <label><input type="radio" name="icsq9" value="C" /> C. 两个进程的整个虚拟地址空间</label>
  <label><input type="radio" name="icsq9" value="D" /> D. 两个进程的 PID</label>
  <div class="quiz-actions"><button type="button" class="submit-answer">提交答案</button><button type="button" class="show-answer">显示答案</button></div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：B。<br />解析：父子各有描述符表副本，但相应条目指向同一打开文件表项，因而共享当前文件位置。</p>
</div>

## 网络编程

### 客户端—服务器模型与互联网

客户端向服务器发送请求，服务器处理后返回响应。网络从主机看是一个 I/O 设备；适配器把主机连接到局域网，路由器连接不同网络，协议规定如何把数据从一台主机送到另一台主机。

IP 地址是 32 位无符号数，网络程序应使用 `htonl/htons` 和 `ntohl/ntohs` 在主机字节序与网络字节序之间转换。域名系统维护域名与 IP 地址间的映射。一个连接由两端套接字唯一确定，可记为 `(客户端 IP:客户端端口, 服务器 IP:服务器端口)`。

IP 地址通常写成点分十进制。域名按层次组织，最右是顶级域；一个域名可映射到多个地址，一个地址也可有多个域名。端口是 16 位整数，知名服务使用约定端口，客户端临时端口由内核分配。

### 套接字接口

客户端基本流程：

```text
socket -> connect -> rio_writen/rio_readlineb -> close
```

服务器基本流程：

```text
socket -> bind -> listen -> accept -> read/write -> close
```

![客户端与服务器的套接字调用流程](/blog/introduction-to-computer-systems/socket-call-sequence.png)

`socket` 创建套接字描述符；`connect` 主动建立连接；`bind` 把地址与描述符关联；`listen` 把主动套接字转换为监听套接字；`accept` 返回已连接描述符。监听描述符用于接收新连接，已连接描述符用于与单个客户端通信，两者不能混为一谈。

套接字地址结构把地址族、端口和 IP 放入统一字节布局。传给接口时常转换成通用 `struct sockaddr *`。服务器通常把监听套接字绑定到通配地址，使任一网络接口都能接收连接；`listen` 的 backlog 暗示内核为未完成请求维护的队列规模。

`getaddrinfo` 把主机名、服务名转换成套接字地址结构链表，支持协议无关代码；`getnameinfo` 完成反向转换。辅助函数 `open_clientfd` 与 `open_listenfd` 封装常用调用。

健壮的客户端遍历 `getaddrinfo` 返回的候选地址：对每项依次 `socket`、`connect`，失败就关闭并尝试下一项。服务器同样逐项尝试 `socket`、`setsockopt`、`bind`，成功后 `listen`。最后用 `freeaddrinfo` 释放链表。

### Web 与 HTTP

Web 客户端和服务器以 HTTP 交换内容。静态内容来自磁盘文件；动态内容由服务器运行程序生成。HTTP 请求包含请求行、首部和空行；响应包含状态行、首部、空行和主体。HTTP/1.0 的典型事务是客户端连接、发送请求、服务器响应并关闭连接。

动态内容常通过 CGI 约定传参：服务器把请求参数放入环境变量，子进程标准输出重定向到客户端连接，再执行 CGI 程序。

静态内容请求需要解析 URI、检查文件类型与读取权限，发送状态行、`Content-length`、`Content-type` 等首部后复制文件。动态请求把 URI 中 `?` 后的参数取出，设置 `QUERY_STRING`，`fork` 子进程、用 `dup2` 把标准输出连接到客户端，再 `execve` CGI 程序。服务器必须处理不存在、无权限和方法不支持等错误响应。

<div class="quiz-question" data-answer="C">
  <p><strong>10. 并发服务器为什么通常同时保留监听描述符和已连接描述符？</strong></p>
  <label><input type="radio" name="icsq10" value="A" /> A. 两者分别表示客户端 IP 的高位和低位</label>
  <label><input type="radio" name="icsq10" value="B" /> B. 一个用于读、另一个只能用于写</label>
  <label><input type="radio" name="icsq10" value="C" /> C. 监听描述符接收新连接，已连接描述符服务特定客户端</label>
  <label><input type="radio" name="icsq10" value="D" /> D. TCP 规定每个进程必须打开两个连续端口</label>
  <div class="quiz-actions"><button type="button" class="submit-answer">提交答案</button><button type="button" class="show-answer">显示答案</button></div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：C。<br />解析：`accept` 不会替换监听端点，而会返回一个专门对应某次连接的新描述符。</p>
</div>

## 并发编程

### 进程、I/O 多路复用与线程

三类并发服务器模型各有权衡：

- **基于进程**：每个客户端使用独立进程，隔离清晰，但共享状态和进程切换开销较大，必须回收子进程。
- **I/O 多路复用**：用 `select` 在一个进程内等待多个描述符就绪，以事件驱动方式服务客户端；控制流清晰且共享容易，但一个慢处理会阻塞所有客户端，代码粒度较复杂。
- **基于线程**：每个客户端使用线程，共享进程地址空间，切换开销通常较低；共享方便也意味着更容易竞争。

#### 三类服务器的资源管理

基于进程的服务器在 `accept` 后 `fork`。子进程关闭监听描述符并服务客户端，父进程关闭自己的已连接描述符副本；父进程还要捕获 `SIGCHLD` 并回收所有结束子进程。描述符引用计数意味着父子必须各自关闭不需要的副本，连接才会真正关闭。

I/O 多路复用服务器维护“描述符集合 + 每个描述符的客户端状态”。`select` 会修改传入集合，所以每轮应从完整集合复制出就绪集合；然后检查监听描述符以接受新连接，再遍历已连接描述符处理输入。它把逻辑流写成显式状态机。

线程服务器通常为每个连接创建线程。主线程把已连接描述符交给工作线程，工作线程应分离自己并在结束时关闭描述符。若把主线程循环变量地址直接传入，会产生竞争；应为每次连接分配独立参数或确保复制完成后再复用。

线程由内核调度，每个线程有独立线程上下文和栈，但共享代码、数据、堆与打开文件。`pthread_create` 创建，`pthread_join` 回收可结合线程，`pthread_detach` 使线程终止后自动回收；对共享初始化可使用 `pthread_once`。

线程可通过从线程例程返回、调用 `pthread_exit`、被其他线程 `pthread_cancel`，或主进程调用 `exit` 而终止。任一对等线程都能回收另一个可结合线程；分离线程不能被 `join`。线程 ID 只在线程库范围内标识线程，与进程 PID 不同。

### 共享变量、信号量与进度图

变量是否共享取决于多个线程是否引用同一内存实例，而不是变量名或作用域本身。全局变量只有一个实例；局部自动变量在线程栈中各有实例，但指针仍可让其他线程访问它。

信号量是非负整数，只能通过原子操作访问：

```text
P(s): 等待 s > 0，然后 s = s - 1
V(s): s = s + 1，必要时唤醒等待线程
```

以初值 1 的信号量保护临界区可实现互斥。计数信号量可表示可用资源数量；生产者—消费者缓冲区通常用 `mutex` 保护槽位、`slots` 统计空槽、`items` 统计已有项目。读者—写者问题需要在读并发与写独占之间调度。

#### 生产者—消费者与读者—写者

有 $n$ 个槽的有界缓冲区可初始化 `mutex=1`、`slots=n`、`items=0`：

```text
insert(item): P(slots) -> P(mutex) -> 写入槽位 -> V(mutex) -> V(items)
remove():     P(items) -> P(mutex) -> 取出项目 -> V(mutex) -> V(slots)
```

资源计数信号量应在互斥锁之前获取，避免线程持有互斥锁却等待资源，使另一线程无法进入释放资源。

读者优先方案允许第一个读者锁住写信号量、最后一个读者释放，多个读者可并行；持续到来的读者可能使写者饥饿。写者优先方案反过来可能使读者饥饿，因此选择方案要明确公平性目标。

进度图把每个线程的指令序列作为坐标轴。两个临界区同时执行形成不安全区；正确轨迹不能进入不安全区。

![两个线程的安全轨迹与不安全区](/blog/introduction-to-computer-systems/semaphore-progress-graph.png)

### 线程安全、竞争与死锁

线程不安全函数常见原因：不保护共享变量、跨调用保持状态、返回静态变量指针、调用其他不安全函数。修复方式包括互斥、把状态作为参数传递、复制返回结果或选择可重入版本。可重入函数不引用任何共享数据，是线程安全函数的重要子集。

线程安全不等于可重入：通过锁保护静态状态的函数可以线程安全，但若在信号处理程序中重入仍可能死锁。后缀 `_r` 的函数通常要求调用者提供结果缓冲区，把隐式共享状态改为显式参数。

竞争发生在程序正确性依赖线程到达某一点的先后顺序时。传给线程的参数若指向循环中反复修改的同一变量，就可能使多个线程读取到错误值。

若一组线程各自等待永远不会发生的事件，就形成死锁。使用二元信号量时，所有线程按一致的全局顺序获取锁可避免循环等待。

#### 用线程提高并行性

并发程序只有把任务分到多个核并减少串行部分，才可能获得并行加速。把输入区间均匀划分给线程，每个线程维护私有局部结果，最后合并，通常比在内层循环频繁争用一个共享信号量更高效。

线程开销、负载不均和同步会限制加速。任务规模过小时，创建与回收线程的成本可能超过收益；预线程化服务器提前建立固定工作线程，用共享缓冲区把已连接描述符交给工作线程，可摊薄创建开销并限制并发数。

<div class="quiz-question" data-answer="A">
  <p><strong>11. 用信号量实现互斥时，保护单个临界区的信号量通常应如何初始化？</strong></p>
  <label><input type="radio" name="icsq11" value="A" /> A. 初始化为 1，进入前 `P`，离开后 `V`</label>
  <label><input type="radio" name="icsq11" value="B" /> B. 初始化为 0，进入前 `P`，离开后仍 `P`</label>
  <label><input type="radio" name="icsq11" value="C" /> C. 初始化为线程数，且从不修改</label>
  <label><input type="radio" name="icsq11" value="D" /> D. 初始化为 -1，进入前 `V`</label>
  <div class="quiz-actions"><button type="button" class="submit-answer">提交答案</button><button type="button" class="show-answer">显示答案</button></div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：A。<br />解析：初值 1 表示一个可用许可；`P` 原子取得许可，`V` 释放许可，使任一时刻最多一个线程进入临界区。</p>
</div>

<div class="quiz-question" data-answer="D">
  <p><strong>12. 多个线程需要同时获取锁 A 和锁 B 时，哪种约束最直接地降低死锁风险？</strong></p>
  <label><input type="radio" name="icsq12" value="A" /> A. 每个线程随机决定获取顺序</label>
  <label><input type="radio" name="icsq12" value="B" /> B. 获取锁后不再释放</label>
  <label><input type="radio" name="icsq12" value="C" /> C. 把两个锁的初值都设为 0</label>
  <label><input type="radio" name="icsq12" value="D" /> D. 所有线程都按同一全局顺序获取锁</label>
  <div class="quiz-actions"><button type="button" class="submit-answer">提交答案</button><button type="button" class="show-answer">显示答案</button></div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：D。<br />解析：统一加锁顺序打破循环等待条件；随机顺序仍可能形成 A 等 B、B 等 A 的环。</p>
</div>

# 易错点 / 高频考点

- **位模式不等于数值**：同一组位在补码与无符号解释下数值不同；混合类型运算会先发生隐式转换。
- **浮点不是实数运算**：每一步都可能舍入，加法和乘法不保证结合律，`NaN` 也不等于自身。
- **`leaq` 不访存**：它只计算有效地址；`cmp/test` 只设置条件码，不保存结果。
- **调用约定要分清责任**：参数寄存器顺序、返回值寄存器、调用者保存与被调用者保存寄存器经常组合考查。
- **吞吐量不等于延迟**：流水线提高单位时间完成的指令数，却可能因流水线寄存器增加单条指令延迟。
- **转发不是万能的**：加载/使用相关仍需暂停；预测错误和 `ret` 属于控制冒险。
- **循环展开不自动带来并行**：关键依赖链没有改变时，CPE 仍受延迟下界限制；过度展开还会导致寄存器溢出。
- **缓存三字段顺序**：先用组索引选组，再比标记，最后用块偏移取字节；写回/直写与写分配/非写分配是两组不同策略。
- **链接顺序有意义**：静态库按命令行从左向右扫描；强弱符号规则可能让错误不在编译期显现。
- **`fork` 与 `execve` 不同**：`fork` 创建新进程并返回两次，`execve` 替换当前进程映像且成功不返回。
- **信号不是队列**：同类型待处理信号通常只保留一个；处理程序与主程序并发，不能随意调用不安全函数。
- **虚拟页偏移不翻译**：VPN 变成 PPN，但 VPO 原样成为 PPO；TLB 缓存的是页表项而不是普通数据块。
- **内部与外部碎片不同**：前者浪费在已分配块内部，后者是空闲块不连续。
- **文件描述符不是文件本身**：描述符表、打开文件表和 v-node 是三层结构；`fork` 后可共享打开文件位置。
- **监听套接字不传业务数据**：`accept` 返回的已连接描述符才对应具体客户端。
- **线程共享不等于自动正确**：共享地址空间降低通信成本，也带来竞争；互斥要覆盖完整不变量，加锁顺序要避免环路。
