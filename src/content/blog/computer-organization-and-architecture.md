---
title: "计算机组织与体系结构"
description: "计算机组织与体系结构笔记蒸馏，覆盖基本结构、指令系统、运算器、处理器、流水线、存储、中断、I/O、总线与先进互连技术。"
pubDate: 2026-07-29
draft: false
tags: ["课程笔记"]
---

# 原笔记信息
- 原笔记来源：[体系结构.md](https://github.com/zhy12138/class_notes/blob/main/%E4%BD%93%E7%B3%BB%E7%BB%93%E6%9E%84/%E4%BD%93%E7%B3%BB%E7%BB%93%E6%9E%84.md)
- **本资料由原笔记蒸馏整理，建议配合原笔记查漏补缺。**

# 复习 / 预习建议
- 先沿“指令—数据通路—控制器—存储与 I/O”建立整机主线，再分别深入 ISA、流水线和总线协议。
- 处理器部分要能从一条指令反推数据经过哪些部件、使用哪些控制信号，并区分单周期与流水线实现。
- 运算器、缓存和存储容量题优先记结构与计算方法；中断、DMA、AMBA 优先记时序和参与模块的职责。
- x86、MIPS、RISC-V、ARM 重点比较编码、寻址和设计取舍，不必把全部指令表孤立背诵。
- 每章做题检查概念边界；对复杂时序图、具体芯片控制字和完整指令表，可回原笔记对应小节补充。

# 速览
- 冯诺依曼结构以存储程序为核心，程序和数据统一存储，CPU 按取指、译码、执行、回写循环工作。
- ISA 是软硬件接口，规定指令、寄存器、寻址和异常；微体系结构是流水线、缓存、预测器等具体实现。
- ALU 由门电路、寄存器和加法器构成；超前进位、Booth 编码等方法以更多硬件换取更短关键路径。
- 单周期处理器让一条指令在一个周期走完整条数据通路；流水线以寄存器分段重叠执行，并处理结构、数据和控制冒险。
- 存储层次用 SRAM 缓存 DRAM；主存访问受行缓冲、突发传输和 DDR 预取影响，缓存性能取决于容量、块大小与相联度。
- 中断保存现场并依据向量进入服务程序；现代 APIC、MSI/MSI-X 解决多核、多设备与共享中断线问题。
- I/O 可独立编址或统一编址，可采用程序查询、中断或 DMA；DMA 让外设与存储器直接传输大块数据。
- 总线包含传输电路和协议；仲裁选择主模块、译码选择从模块，AMBA 以流水、等待周期和 Burst 提升利用率。

# 知识点整理

## 计算机基本结构

### 冯诺依曼结构与整机组成

冯诺依曼结构有五个组成部分：运算器、控制器、存储器、输入设备和输出设备。其核心原则是：程序与数据都以二进制形式存入存储器，由地址区分位置；计算机能自动取出指令并执行。运算器与控制器合称 CPU，存储器按“地址—内容”组织。

![冯诺依曼计算机的五大组成部分](/blog/computer-organization-and-architecture/von-neumann-structure.png)

简化计算机模型中的关键部件：

- `PC` 保存下一条指令地址，取指后按指令长度更新。
- `IR` 保存当前指令，译码器据操作码确定动作。
- `MAR` 保存正在访问的存储单元地址；`MDR` 暂存读出或待写入的数据。
- 通用寄存器暂存操作数，ALU 以 X、Y 为输入、Z 为结果暂存器，F 保存零、符号、进位和溢出状态。
- 地址总线宽 $n$ 位时，最多选择 $2^n$ 个编址单元；数据总线决定一次可传的数据宽度；控制总线携带读、写和完成信号。

![计算机结构简化模型及数据通路](/blog/computer-organization-and-architecture/basic-computer-model.png)

### 指令周期与微操作

执行一条指令通常分为取指、译码、执行和回写：

1. `PC_OUT, MAR_IN`：把下一条指令地址送入 MAR。
2. 发存储器读信号，主存把指令送入 MDR。
3. `MDR_OUT, IR_IN`：指令进入 IR，同时 PC 加上指令长度。
4. 译码器解释操作码，控制器按节拍发出微命令。
5. 数据在寄存器、ALU 和存储器之间移动，最后回写目的位置。

`LOAD R1,M1` 读取 M1 到 MDR，再写 R1；`ADD R1,M2` 读取 M2 到 Y，让 R1 经内部总线进入 ALU，结果经 Z 回写 R1；`STORE M3,R1` 把 R1 写入 MDR 后发存储器写；`JMP L` 把指令给出的目标写入 PC。

### 硬布线与微程序控制器

硬布线控制器由节拍发生器、指令译码器和组合逻辑微命令编码器组成。控制信号是“指令类别、当前节拍和状态”的逻辑函数。优点是速度快；缺点是电路复杂，修改和扩展困难。

微程序控制器把一条机器指令分解为一段微程序：

- 控制存储器 CM 保存微指令。
- 微指令寄存器 `μIR` 包含微操作控制字段和顺序控制字段。
- 微地址寄存器 `μAR` 指向当前微指令。
- 微地址形成电路结合下址字段、转移条件、机器操作码和运行状态，产生下一微地址。

![微程序控制器基本结构](/blog/computer-organization-and-architecture/microprogram-controller.png)

每条机器指令先执行公用取指微程序，再由操作码转入对应微程序入口，逐条发出微命令，结束后回到取指入口。微程序控制规整、灵活、便于兼容复杂 ISA，但每条机器指令需多次访问控制存储器，速度较慢。

### 现代结构演进

传统北桥连接 CPU、主存和高速 I/O，南桥连接低速设备；随后内存控制器和北桥高速功能逐步进入 CPU，余下部分形成 PCH。SoC 则把 CPU、存储控制和多种 I/O 集成到一块芯片。

CPU 用大缓存、复杂控制和低延迟 ALU 优化串行响应；GPU 用大量高能效 ALU、深流水和大量线程隐藏较长延迟，追求吞吐量。

<div class="quiz-question" data-answer="C">
  <p><strong>1. 在简化计算机模型中，MAR 和 MDR 的职责分别是什么？</strong></p>
  <label><input type="radio" name="caq1" value="A" /> A. MAR 保存指令，MDR 保存下一条指令地址</label>
  <label><input type="radio" name="caq1" value="B" /> B. MAR 保存运算状态，MDR 负责译码</label>
  <label><input type="radio" name="caq1" value="C" /> C. MAR 保存访存地址，MDR 暂存访存数据</label>
  <label><input type="radio" name="caq1" value="D" /> D. MAR 和 MDR 都只用于输入设备</label>
  <div class="quiz-actions"><button type="button" class="submit-answer">提交答案</button><button type="button" class="show-answer">显示答案</button></div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：C。<br />解析：MAR 对接地址总线，指出要访问的存储单元；MDR 对接数据总线，保存读出或待写入的数据。</p>
</div>

<div class="quiz-question" data-answer="B">
  <p><strong>2. 与硬布线控制器相比，微程序控制器的主要优势是什么？</strong></p>
  <label><input type="radio" name="caq2" value="A" /> A. 每条机器指令只需一个门延迟</label>
  <label><input type="radio" name="caq2" value="B" /> B. 控制逻辑规整，增加和修改指令较方便</label>
  <label><input type="radio" name="caq2" value="C" /> C. 不需要指令译码</label>
  <label><input type="radio" name="caq2" value="D" /> D. 不需要任何存储结构</label>
  <div class="quiz-actions"><button type="button" class="submit-answer">提交答案</button><button type="button" class="show-answer">显示答案</button></div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：B。<br />解析：微程序以存储逻辑组织微命令，修改微程序即可扩展控制；代价是执行机器指令时要读取一串微指令。</p>
</div>

## 指令系统体系结构

### ISA、语法与 x86 模型

ISA 规定指令集、寄存器、寻址方式、内存模型和异常，是软件与硬件的接口；微体系结构是在不改变 ISA 的前提下，用数据通路、流水线、缓存和预测器实现它。CISC 强调丰富、复杂指令，RISC 常用规则、定长指令和寄存器运算简化实现。

Intel 与 AT&T 汇编的主要差异：

| 项目 | Intel | AT&T |
| --- | --- | --- |
| 操作数顺序 | 目的、源 | 源、目的 |
| 寄存器/立即数 | 无前缀 | `%` / `$` |
| 内存 | `[base+index*scale+disp]` | `disp(base,index,scale)` |
| 大小 | `byte/word/dword ptr` | 指令后缀 `b/w/l` |

x86 从 8086 的 16 位实模式发展到保护模式和 64 位 long mode。早期分段地址由“段值 × 16 + 偏移”得到物理地址；保护模式用段选择子查描述符，得到段基址与权限；64 位模式弱化普通分段并扩展通用寄存器。

### x86 寄存器、寻址与指令

x86 寄存器包括通用寄存器、段寄存器、指令指针和标志寄存器。`AX/BX/CX/DX` 可拆为高低 8 位，`SP/BP/SI/DI` 有栈、基址与索引用途；32 位扩展为 E 前缀，64 位扩展为 R 前缀并增加 R8～R15。

常见寻址形式包括立即、寄存器、直接、寄存器间接、基址、变址和“基址 + 变址 × 比例 + 位移”。有效地址计算与操作数大小是两回事。

指令可按功能归纳：

- 传送：`MOV`、`PUSH/POP`、`XCHG`、`IN/OUT`、`LEA`、标志传送。
- 算术：`ADD/ADC`、`SUB/SBB`、`INC/DEC`、`CMP`、`MUL/IMUL`、`DIV/IDIV`。
- 逻辑与移位：`AND/OR/XOR/TEST/NOT`，逻辑、算术和循环移位。
- 控制转移：无条件跳转、按标志条件跳转、`CALL/RET`、循环控制和处理器控制。
- 复杂指令：串传送、串比较、串扫描、查表和十进制调整，可配合 `REP/REPE/REPNE`。

#### x86 复杂指令的隐含状态

- 串操作以字节或字为元素，源地址隐含在 `DS:SI`，目的地址隐含在 `ES:DI`，重复次数放在 `CX`。处理一个元素后硬件自动更新 `SI/DI`，带 `REP` 前缀时还会递减 `CX`。
- `DF` 决定串传送方向：`CLD` 清零后从低地址向高地址移动，`STD` 置位后反向移动；反向传送可处理源、目的区域重叠的情况。
- `LOOPNE label` 先执行 $CX\leftarrow CX-1$，仅当 $CX\neq0$ 且 `ZF=0` 时继续跳转，因此既受计数器也受比较结果控制。
- `XLAT` 用 `BX` 保存表基址、`AL` 保存索引，并把查到的字节写回 `AL`。
- `DAA` 跟在二进制加法之后，把 `AL` 中的结果调整成 BCD 格式；它体现了 x86 为兼容既有数据表示而保留的复杂语义。

### MIPS、RISC-V 与 ARM

MIPS 使用 32 个 32 位通用寄存器，指令定长 32 位。三种基本格式：

- R 型：`opcode(6) + rs(5) + rt(5) + rd(5) + shamt(5) + funct(6)`。
- I 型：`opcode + rs + rt + immediate(16)`，用于立即数、访存和条件分支。
- J 型：`opcode + address(26)`，用于远跳转。

![MIPS 的 R、I、J 三类指令编码](/blog/computer-organization-and-architecture/mips-instruction-formats.png)

MIPS 是 load/store 结构，算术操作数来自寄存器；分支常使用 PC 相对位移，跳转拼接目标字段。伪指令由汇编器展开为真实指令。

RISC-V 保留规则定长编码与 load/store 思想，基础整数寄存器为 32 个；把指令集拆为基础集和扩展，编码更规则、开放。ARM 同样是 RISC，传统 ARM 指令多为 32 位，Thumb 提供更紧凑编码，并广泛使用条件执行和多种寻址形式。

<div class="quiz-question" data-answer="A">
  <p><strong>3. ISA 与微体系结构的关系是什么？</strong></p>
  <label><input type="radio" name="caq3" value="A" /> A. ISA 定义软件可见接口，微体系结构给出具体硬件实现</label>
  <label><input type="radio" name="caq3" value="B" /> B. ISA 只描述晶体管，微体系结构只描述汇编语法</label>
  <label><input type="radio" name="caq3" value="C" /> C. 两者必须一一对应且不能有多种实现</label>
  <label><input type="radio" name="caq3" value="D" /> D. 微体系结构决定源语言语法</label>
  <div class="quiz-actions"><button type="button" class="submit-answer">提交答案</button><button type="button" class="show-answer">显示答案</button></div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：A。<br />解析：同一 ISA 可以有不同流水线、缓存和预测器实现，软件仍看到相同指令与寄存器接口。</p>
</div>

<div class="quiz-question" data-answer="D">
  <p><strong>4. MIPS 的 R 型指令中，具体算术或逻辑操作通常由哪个字段进一步区分？</strong></p>
  <label><input type="radio" name="caq4" value="A" /> A. immediate</label>
  <label><input type="radio" name="caq4" value="B" /> B. address</label>
  <label><input type="radio" name="caq4" value="C" /> C. PC</label>
  <label><input type="radio" name="caq4" value="D" /> D. funct</label>
  <div class="quiz-actions"><button type="button" class="submit-answer">提交答案</button><button type="button" class="show-answer">显示答案</button></div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：D。<br />解析：R 型主操作码标识这一大类，`funct` 再确定加、减、与、或等具体功能。</p>
</div>

## 算术逻辑单元

### 门电路、寄存器与基本运算

数字电路用高低电平表示 1 和 0。NMOS 在栅极为高时导通，PMOS 在栅极为低时导通；互补连接构成 CMOS 非门。与、或、异或等组合逻辑可由基本门搭建。

寄存器是时序电路。D 触发器在时钟有效边沿采样 D 并保持到 Q；多个 D 触发器组成多位寄存器。寄存器堆有多个读端口和写端口，读通常是组合逻辑，写在时钟边沿且由写使能控制。SRAM 单元以交叉耦合反相器保存状态，通过字线选择、位线读写。

逻辑运算按位独立进行。移位寄存器让相邻触发器在时钟边沿传递数据，可实现逻辑/算术移位以及串并转换。

### 加减法与超前进位

半加器产生 $S=A\oplus B$ 和 $C=A\cdot B$。全加器还接收低位进位：

$$S_i=A_i\oplus B_i\oplus C_i$$

$$C_{i+1}=A_iB_i+(A_i\oplus B_i)C_i$$

减法通过补码转换为加法：$A-B=A+\overline{B}+1$。串行进位加法器结构简单，但最高位必须等待前面每一级进位，延迟随位数增长。

令生成信号 $G_i=A_iB_i$，传播信号 $P_i=A_i\oplus B_i$，则：

$$C_{i+1}=G_i+P_iC_i$$

把递推式展开，可用组合逻辑直接计算各级进位，这就是超前进位；分组超前进位在硬件复杂度和速度之间折中。

![四位超前进位加法器](/blog/computer-organization-and-architecture/carry-lookahead-adder.png)

<div class="quiz-question" data-answer="B">
  <p><strong>5. 超前进位加法器为什么比串行进位加法器更快？</strong></p>
  <label><input type="radio" name="caq5" value="A" /> A. 它不计算进位</label>
  <label><input type="radio" name="caq5" value="B" /> B. 它用生成与传播逻辑并行求多级进位</label>
  <label><input type="radio" name="caq5" value="C" /> C. 它只支持一位加法</label>
  <label><input type="radio" name="caq5" value="D" /> D. 它把所有操作数存入磁盘</label>
  <div class="quiz-actions"><button type="button" class="submit-answer">提交答案</button><button type="button" class="show-answer">显示答案</button></div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：B。<br />解析：展开进位递推式后，各级进位由输入和初始进位直接组合产生，避免逐位等待。</p>
</div>

## 乘法器和除法器

### 移位加法乘法与 Booth 编码

无符号乘法可把乘数逐位扫描：当前最低位为 1 就把被乘数加到积，随后被乘数左移或“积—乘数”寄存器整体右移。一次处理一位需 $n$ 轮；增加多个加法器可一次处理多位，以面积换时间。

![移位加法乘法器数据通路](/blog/computer-organization-and-architecture/shift-add-multiplier.png)

Booth 算法利用连续 1 可写成两个 2 的幂之差。例如一段 `011110` 可视为高边界加一次、低边界减一次，减少连续 1 导致的加法次数，并自然支持补码有符号乘法。改进 Booth 每次观察相邻若干位，选择 $0,\pm X,\pm2X$ 等部分积。

### 恢复与不恢复除法

除法器维护余数和商。基本做法让余数试减除数：若结果非负，商位写 1；若为负则恢复余数并写 0，再移位进入下一位。不恢复除法不立即恢复，而在下一轮用相反操作修正，从而减少额外加法。

![移位试减除法器数据通路](/blog/computer-organization-and-architecture/divider-datapath.png)

除数为 0、商超出目标位宽以及有符号最小值除以 -1 都需要额外检测。乘除法通常比加法多周期，因此在流水线中由独立功能单元处理。

<div class="quiz-question" data-answer="C">
  <p><strong>6. Booth 乘法的核心优化思路是什么？</strong></p>
  <label><input type="radio" name="caq6" value="A" /> A. 把乘法全部改成除法</label>
  <label><input type="radio" name="caq6" value="B" /> B. 忽略乘数中的 1</label>
  <label><input type="radio" name="caq6" value="C" /> C. 用连续 1 的边界编码减少部分积加减次数</label>
  <label><input type="radio" name="caq6" value="D" /> D. 只计算结果的最低位</label>
  <div class="quiz-actions"><button type="button" class="submit-answer">提交答案</button><button type="button" class="show-answer">显示答案</button></div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：C。<br />解析：连续 1 可改写为高位的正幂减低位的正幂，长串部分积因此压缩成少量加减操作。</p>
</div>

## 单周期处理器

### 设计步骤与基本部件

处理器设计从目标指令集出发：列出每条指令的寄存器读写、ALU 运算、访存和 PC 更新需求，再搭建公共数据通路，最后根据操作码生成控制信号。

核心部件包括 PC、指令存储器、寄存器堆、立即数扩展、ALU、数据存储器、多路选择器和控制器。寄存器堆通常双读单写；指令存储器按 PC 读指令，数据存储器由 ALU 结果寻址。

![单周期 MIPS 处理器完整数据通路](/blog/computer-organization-and-architecture/single-cycle-datapath.png)

### 不同指令的数据通路

- R 型：读取 `rs/rt`，ALU 运算，结果写 `rd`，PC 加 4。
- `lw`：读取基址 `rs`，立即数符号扩展后相加形成地址，从数据存储器读出并写 `rt`。
- `sw`：地址计算相同，把 `rt` 的值写入数据存储器，不写寄存器。
- `beq`：比较两个寄存器，相等时 PC 选择 `PC+4+(signext(imm)<<2)`。
- 跳转：PC 选择由指令目标字段和当前 PC 高位拼接的地址。

主控制器根据 opcode 产生 `RegDst/ALUSrc/MemtoReg/RegWrite/MemRead/MemWrite/Branch/Jump/ALUOp`；ALU 控制器再结合 `ALUOp` 与 funct 选择具体 ALU 操作。

单周期时钟周期必须覆盖最慢指令，通常是 `lw` 经取指、读寄存器、ALU、数据存储器、写回的路径。较短指令也只能等待同样长的周期，硬件资源还常需复制以避免同周期冲突。

<div class="quiz-question" data-answer="D">
  <p><strong>7. 单周期处理器的时钟周期为什么通常由 `lw` 一类指令决定？</strong></p>
  <label><input type="radio" name="caq7" value="A" /> A. `lw` 不需要取指</label>
  <label><input type="radio" name="caq7" value="B" /> B. `lw` 只经过一个多路选择器</label>
  <label><input type="radio" name="caq7" value="C" /> C. 所有指令都必须写数据存储器</label>
  <label><input type="radio" name="caq7" value="D" /> D. `lw` 依次经过取指、寄存器、ALU、数据存储器和写回等长路径</label>
  <div class="quiz-actions"><button type="button" class="submit-answer">提交答案</button><button type="button" class="show-answer">显示答案</button></div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：D。<br />解析：单周期必须让最慢指令在一个周期内完成，所以全部指令都受最长组合路径约束。</p>
</div>

## 流水线处理器

### 流水线原理与两类扩展

经典五级流水线为 IF、ID、EX、MEM、WB。级间寄存器保存数据和控制，使多条指令分别处于不同阶段。理想情况下填满后每周期完成一条指令，吞吐量提高，但单条延迟不会按级数等比例降低。

超级流水线把阶段继续细分，以更高时钟频率工作；超标量在同一周期发射多条指令，需要多套功能单元、宽取指/译码、依赖检查和提交机制。前者增加深度，后者增加宽度。

![超标量处理器的多发射结构](/blog/computer-organization-and-architecture/superscalar-pipeline.png)

### 结构、数据与控制冒险

- 结构冒险：多条指令同周期争用同一硬件。可复制资源或暂停，例如分离指令/数据存储器。
- 数据冒险：后指令依赖前指令尚未写回的值。可转发 EX/MEM 或 MEM/WB 结果；紧邻 load-use 时数据到 MEM 后才产生，仍需暂停。
- 控制冒险：分支方向与目标未确定，后续取指可能错误。可提前判定、静态预测、动态预测或延迟分支。

### 动态分支预测与返回地址栈

一位预测器用上次结果预测，循环退出会造成一次错误，下一次进入又可能再错。两位饱和计数器需要连续两次相反结果才改变强预测方向，能抵抗偶发偏离。

![两位饱和计数器分支预测状态机](/blog/computer-organization-and-architecture/two-bit-predictor.png)

BTB 以分支指令地址索引，保存是否跳转的历史与目标地址，让取指阶段在识别到分支前就给出预测目标。全局/局部历史可与分支地址组合索引预测表，但历史越长硬件越大且收益递减。

![分支目标缓冲器与预测流程](/blog/computer-organization-and-architecture/branch-target-buffer.png)

函数返回目标会随调用点变化，普通 BTB 难以预测。返回地址栈 RAS 在 `call` 时压入返回地址，在 `ret` 时弹出预测；嵌套调用遵循栈结构时准确率很高。

<div class="quiz-question" data-answer="B">
  <p><strong>8. 为什么转发仍不能完全消除紧邻的 load-use 冒险？</strong></p>
  <label><input type="radio" name="caq8" value="A" /> A. load 从不写寄存器</label>
  <label><input type="radio" name="caq8" value="B" /> B. 加载数据到 MEM 阶段末才可用，使用者需要得更早</label>
  <label><input type="radio" name="caq8" value="C" /> C. 转发只能传递 PC</label>
  <label><input type="radio" name="caq8" value="D" /> D. 数据存储器不能读取</label>
  <div class="quiz-actions"><button type="button" class="submit-answer">提交答案</button><button type="button" class="show-answer">显示答案</button></div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：B。<br />解析：相邻使用者进入 EX 时加载值尚未产生，必须插入一个气泡后再转发。</p>
</div>

<div class="quiz-question" data-answer="C">
  <p><strong>9. 两位饱和计数器相比一位预测器的主要改进是什么？</strong></p>
  <label><input type="radio" name="caq9" value="A" /> A. 不再保存任何历史</label>
  <label><input type="radio" name="caq9" value="B" /> B. 能提前执行所有分支路径</label>
  <label><input type="radio" name="caq9" value="C" /> C. 一次偶发反向结果不会立刻翻转强预测方向</label>
  <label><input type="radio" name="caq9" value="D" /> D. 不需要分支地址</label>
  <div class="quiz-actions"><button type="button" class="submit-answer">提交答案</button><button type="button" class="show-answer">显示答案</button></div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：C。<br />解析：状态机具有强、弱两级，需连续相反结果才跨过中间状态改变预测方向。</p>
</div>

## 存储层次结构

### DRAM、SRAM 与主存访问

SRAM 用双稳态单元保存位，不需刷新、速度快但面积大，常用于缓存；DRAM 以电容电荷保存位，需周期刷新、密度高，常用于主存。

DRAM 芯片按行列组织。访问先激活一行，把整行送入行缓冲，再选择列读写；访问已打开行较快，换行需要预充电和重新激活。多个芯片并联可扩展数据宽度，多个存储体/片选可扩展容量。

![DRAM 芯片的阵列、译码和行缓冲结构](/blog/computer-organization-and-architecture/dram-organization.png)

SDRAM 与时钟同步并支持突发传输。DDR 在时钟上、下沿都传数据；DDR2 提高预取和 I/O 速率。Bank 分组允许不同 Bank 的激活和传输交错，隐藏行访问延迟。

### Cache 工作原理与设计

Cache 行包含有效位、标记和数据块。访问地址拆为标记、组索引和块内偏移：索引选择组，标记比较确认命中，偏移选择目标字节。未命中时从主存读入整块并按替换策略选择牺牲行。

![高速缓存命中与缺失处理流程](/blog/computer-organization-and-architecture/cache-access-flow.png)

设计要点：

- 容量增大通常降低容量缺失，但访问时间、面积和功耗增加。
- 块增大利用空间局部性，却减少总行数并增加缺失传输时间。
- 相联度提高可减少冲突缺失，但比较器和替换逻辑更复杂。
- 写命中可直写或写回；写缺失可写分配或非写分配。
- 多级缓存以小而快的 L1 降低命中时间，以更大的 L2/L3 降低主存访问次数。

平均存储访问时间可写为：

$$AMAT=HitTime+MissRate\times MissPenalty$$

### 容量计算与 HBM

按字节编址时，总容量等于可寻址单元数乘每单元字节数。芯片组织常写作“字数 × 位数”；用多个芯片组成目标存储器时，位扩展解决字长不足，字扩展解决地址数量不足，并用片选译码选择芯片。

HBM 把多层 DRAM die 堆叠，通过硅通孔连接，以很宽的接口在较低频率下提供高带宽，并靠近处理器封装；代价是封装、散热和成本更复杂。

<div class="quiz-question" data-answer="A">
  <p><strong>10. DRAM 访问同一已打开行中的另一列通常更快，原因是什么？</strong></p>
  <label><input type="radio" name="caq10" value="A" /> A. 该行已在行缓冲中，不必再次激活整行</label>
  <label><input type="radio" name="caq10" value="B" /> B. 同一行不需要地址</label>
  <label><input type="radio" name="caq10" value="C" /> C. DRAM 同一行使用 SRAM 编码</label>
  <label><input type="radio" name="caq10" value="D" /> D. 列地址总是零</label>
  <div class="quiz-actions"><button type="button" class="submit-answer">提交答案</button><button type="button" class="show-answer">显示答案</button></div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：A。<br />解析：行命中只需列选择；换行还要预充电并把新行激活到行缓冲。</p>
</div>

<div class="quiz-question" data-answer="D">
  <p><strong>11. 提高 Cache 相联度通常带来哪项权衡？</strong></p>
  <label><input type="radio" name="caq11" value="A" /> A. 必然增加冲突缺失</label>
  <label><input type="radio" name="caq11" value="B" /> B. 完全消除容量缺失</label>
  <label><input type="radio" name="caq11" value="C" /> C. 不再需要标记位</label>
  <label><input type="radio" name="caq11" value="D" /> D. 冲突缺失减少，但比较与替换逻辑更复杂</label>
  <div class="quiz-actions"><button type="button" class="submit-answer">提交答案</button><button type="button" class="show-answer">显示答案</button></div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：D。<br />解析：一个块可放入更多位置，冲突概率降低，但需要并行比较更多标记并选择牺牲行。</p>
</div>

## 中断和异常

### 来源、向量表与处理过程

中断与异常让 CPU 暂停当前程序并转入处理程序。外部中断来自设备和定时器，通常异步；内部异常来自正在执行的指令，如除法错、溢出、单步和断点。

向量表把中断类型号映射到处理程序入口。早期 x86 实模式每项保存段地址与偏移；保护模式使用中断描述符表 IDT，表项还含门类型、特权级和存在位。

![x86 实模式与保护模式的中断向量结构](/blog/computer-organization-and-architecture/interrupt-vector-structure.png)

典型处理过程：完成当前指令，确认中断并取得类型号；保存 FLAGS、CS、IP 等现场，必要时关闭可屏蔽中断；从向量表装入入口，执行服务程序；以 `IRET` 恢复现场。异常的保存位置取决于是否需要重执行故障指令。

#### 内部异常与软件中断

- 类型 0 除法错由除数为 0 或商超出目标宽度自动触发。
- 类型 4 溢出需在算术指令后显式执行 `INTO`，仅当 `OF=1` 时触发。
- `TF=1` 时每执行一条指令产生类型 1 单步中断；调试器可借此逐条显示机器状态。
- `INT 3` 是单字节断点指令，便于临时覆盖原指令；处理程序恢复原字节并调整 IP 后可继续执行。

`INT n` 会压入 FLAGS，清除 `IF/TF`，再压入 CS、IP 并按类型号取入口。BIOS 把自检、引导和基础 I/O 功能放在中断接口后；DOS 的 `INT 21H` 再以 `AH` 选择文件、存储、作业和设备管理功能。二者都体现了通过稳定向量隐藏具体实现。

### 外部中断、优先级与控制器

外设可通过共享中断请求线提出请求。确定来源可用软件轮询、硬件优先级编码或可编程中断控制器。Intel 8259A 支持请求屏蔽、优先级判定、级联和向量提供。

多核系统使用 Local APIC 管理每个 CPU 的本地中断，I/O APIC 接收外设中断并路由到目标 CPU。处理器间中断可让一个核通知另一个核。

![多核系统中的 Local APIC 与 I/O APIC](/blog/computer-organization-and-architecture/apic-architecture.png)

定时器按输入时钟计数，可在计数到零、中断后自动重装或产生方波。可编程定时器先写控制字选择通道、工作方式、初值宽度和编码，再向计数寄存器写初值：

- 方式 0：一次性倒计数，到 0 时输出上升沿，可作为事件计数或中断请求。
- 方式 2：每 $N$ 个输入时钟产生一个负脉冲并自动重复，可用作 DRAM 刷新频率。
- 方式 3：连续输出对称或近似对称方波，可提供系统计时基准或控制扬声器频率。

系统用定时器产生周期时钟中断、调度时间片和设备超时。

<div class="quiz-question" data-answer="B">
  <p><strong>12. 中断向量表的核心作用是什么？</strong></p>
  <label><input type="radio" name="caq12" value="A" /> A. 保存所有普通程序数据</label>
  <label><input type="radio" name="caq12" value="B" /> B. 把中断类型映射到处理程序入口及相关属性</label>
  <label><input type="radio" name="caq12" value="C" /> C. 替代主存保存指令</label>
  <label><input type="radio" name="caq12" value="D" /> D. 只记录磁盘容量</label>
  <div class="quiz-actions"><button type="button" class="submit-answer">提交答案</button><button type="button" class="show-answer">显示答案</button></div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：B。<br />解析：CPU 根据类型号查表获得服务程序入口；保护模式表项还承担权限和门类型检查。</p>
</div>

## 输入输出设备

### I/O 接口与编址

I/O 接口在 CPU/总线和外设之间缓冲速度与格式差异，包含数据缓冲、状态寄存器、控制寄存器、地址译码和握手/中断逻辑。输出路径把 CPU 数据锁存后交给设备，输入路径把设备数据缓冲并报告就绪状态。

分开编址给 I/O 端口独立地址空间，以 `IN/OUT` 访问，不占用存储地址；统一编址把接口寄存器放入存储地址空间，用普通访存指令访问，编程统一但占用地址范围并需明确缓存属性。

### 程序控制、中断与 DMA

三种控制方式逐步减少 CPU 数据搬运负担：

1. 无条件程序传送假定设备总是就绪，简单但不可靠。
2. 程序查询反复读取状态，可靠但浪费 CPU 时间；数据仍经通用寄存器中转。
3. 中断方式由设备主动通知，CPU 可与设备并行，但每次数据传送仍由中断服务程序完成。
4. DMA 由 DMAC 在外设与主存间直接传送块数据，CPU 只配置源地址、目的地址、地址增减方式和长度，结束后接收中断。

![CPU、DMA 控制器、主存与外设的数据通路](/blog/computer-organization-and-architecture/dma-data-path.png)

DMA 控制器既是 CPU 配置的从模块，又会在传输时成为总线主模块。高速网卡、显卡和磁盘控制器常集成专用 DMA，避免共享 DMAC 成为瓶颈。

### 串行、并行与差分信号

并行接口同周期传多位，低频下吞吐高，但线多、偏斜和串扰限制高频；串行接口线路少且易扩频，但需要串并转换。现代 USB、SATA、PCIe 以高速串行为主。PCIe 多 lane 是多条独立串行通道，不等同于传统并行总线。

差分传输在两根线上发送等幅反相信号，接收端取差值，可抵消共模干扰、降低电磁辐射并改善定时；布线要求两线等长、等宽、靠近。

Intel 8255A 展示了可编程并口的典型组织：A、B 是 8 位数据端口，C 可拆成两个 4 位端口并常作为 A、B 的握手信号；`A1/A0` 选择端口，控制端口用控制字规定输入输出方向和工作方式。方式 0 是无专用握手的基本单向 I/O，方式 1 用 C 口进行选通握手，方式 2 支持双向传输。

<div class="quiz-question" data-answer="C">
  <p><strong>13. DMA 方式相对中断驱动 I/O 的关键改进是什么？</strong></p>
  <label><input type="radio" name="caq13" value="A" /> A. 不再需要外设</label>
  <label><input type="radio" name="caq13" value="B" /> B. 每个字节仍由 CPU 指令搬运</label>
  <label><input type="radio" name="caq13" value="C" /> C. DMAC 控制外设与主存直接传送数据块</label>
  <label><input type="radio" name="caq13" value="D" /> D. 数据只能从主存传到主存</label>
  <div class="quiz-actions"><button type="button" class="submit-answer">提交答案</button><button type="button" class="show-answer">显示答案</button></div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：C。<br />解析：CPU 只负责配置与结束处理，DMAC 获得总线控制权后直接搬运，避免每个数据都经过 CPU 寄存器。</p>
</div>

## 总线及总线标准

### 总线结构、仲裁与译码

总线是在多个模块之间传信息的公共通路，既包括物理信号线，也包括管理传输的协议。片总线位于芯片内部，系统总线连接板内模块，通信总线连接不同系统。

主模块获得控制权后发起读写，如 CPU 和 DMAC；从模块响应地址、提供/接收数据，如存储器和 I/O 接口。仲裁器在多个主模块间授权，译码器根据地址选择从模块，多路器把获授权主模块和被选中从模块接入共享通路。

![多主多从总线的仲裁与译码结构](/blog/computer-organization-and-architecture/bus-arbitration-decoding.png)

总线标准规定机械、电气、功能和时序特性。ISA/EISA/PCI 是并行共享总线；AGP 是面向显卡的点对点通道；PCIe 使用高速差分串行、全双工、点对点连接并支持多 lane。

### AMBA/AHB 传输时序

AHB 将地址阶段与数据阶段流水重叠。最简单传输中，主模块先给地址和控制，下一周期传写数据或接收读数据；连续传输可让下一事务地址与当前事务数据并行。

![AHB 地址阶段与数据阶段的流水传输](/blog/computer-organization-and-architecture/ahb-pipelined-transfer.png)

从模块未准备好时拉低 `HREADY` 插入等待周期；等待期间主模块必须保持本事务地址、控制和写数据稳定。`HTRANS` 区分 `IDLE/BUSY/NONSEQ/SEQ`：Burst 首地址用 NONSEQ，后续地址用 SEQ，BUSY 表示主模块暂不能继续但未结束 Burst。

`HBURST` 指定单次、递增或回卷 Burst 及长度。INCR 可不定长并可能被仲裁打断；INCR4/8/16 长度固定。WRAP4/8/16 从关键字地址开始，到边界后回卷，有利于缓存缺失时关键字先行。`HSIZE` 指定有效数据宽度，窄传输只使用总线相应字节 lane。

<div class="quiz-question" data-answer="A">
  <p><strong>14. AHB 从模块拉低 `HREADY` 时，主模块必须怎样处理当前传输？</strong></p>
  <label><input type="radio" name="caq14" value="A" /> A. 保持地址、控制及相关写数据稳定，等待完成</label>
  <label><input type="radio" name="caq14" value="B" /> B. 立即改变为另一地址且丢弃事务</label>
  <label><input type="radio" name="caq14" value="C" /> C. 关闭系统时钟</label>
  <label><input type="radio" name="caq14" value="D" /> D. 让所有从模块同时写数据</label>
  <div class="quiz-actions"><button type="button" class="submit-answer">提交答案</button><button type="button" class="show-answer">显示答案</button></div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：A。<br />解析：低 `HREADY` 扩展当前传输，相关信号必须保持到从模块重新表示就绪并在时钟沿完成采样。</p>
</div>

<div class="quiz-question" data-answer="D">
  <p><strong>15. WRAP Burst 为什么适合缓存行填充？</strong></p>
  <label><input type="radio" name="caq15" value="A" /> A. 它不传输地址</label>
  <label><input type="radio" name="caq15" value="B" /> B. 它只允许传一个字节</label>
  <label><input type="radio" name="caq15" value="C" /> C. 它永远不使用数据总线</label>
  <label><input type="radio" name="caq15" value="D" /> D. 可从所需关键字开始，越过行尾后回卷补齐整行</label>
  <div class="quiz-actions"><button type="button" class="submit-answer">提交答案</button><button type="button" class="show-answer">显示答案</button></div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：D。<br />解析：关键字优先可让处理器较早继续执行，Burst 随后按固定边界回卷并完成整行传输。</p>
</div>

## 计算机系统先进技术

### AXI、片上网络与内存并行

共享片上总线同一时刻只能服务有限传输，复杂 SoC 因吞吐、功耗、延迟和信号完整性受到限制。AXI 分离读写通道，Burst 只给起始地址，支持多个未完成事务、乱序完成和不对齐访问，已接近总线与网络之间的互连。

片上网络以路由和并行链路提高吞吐，支持纠错与重传、可预测延迟以及全局异步局部同步，代价是路由器、缓冲和协议更复杂。

DDR3 通过更高预取与双沿传输提升带宽；继续简单提高预取和频率面临主板信号限制。Bank Grouping 把颗粒划成多个较小阵列，提供多个行缓冲，并让不同 Bank 的地址与数据交错，从并行未完成事务中获得吞吐。

### MSI/MSI-X 与封装

传统 PCI INTx 使用有限的异步引脚，多个设备共享且可能面临“中断先到、数据写尚未可见”的顺序问题。MSI 把中断编码成向特殊地址的写事务；总线的写顺序保证此前数据先完成。MSI-X 可提供更多独立向量，更适合多队列设备和多核路由。

![PCI 设备通过 MSI 写事务触发中断](/blog/computer-organization-and-architecture/msi-interrupt.png)

MSI 解决共享中断线、单设备向量不足和数据/中断排序问题，但占用少量总线带宽。PCIe 必须支持 MSI/MSI-X，可不支持传统 INTx。

芯片内部 die 可用引线键合或倒装连接到封装；常见封装包括 DIP、TSOP、QFP 和 PGA。倒装片缩短互连并增加连接密度，但封装、供电和散热设计更困难。

<div class="quiz-question" data-answer="B">
  <p><strong>16. MSI 相比传统 INTx 引脚中断的重要优势是什么？</strong></p>
  <label><input type="radio" name="caq16" value="A" /> A. 完全不经过互连系统</label>
  <label><input type="radio" name="caq16" value="B" /> B. 用写消息编码更多向量，并利用传输顺序保证数据先于中断</label>
  <label><input type="radio" name="caq16" value="C" /> C. 每个系统只能有一个中断号</label>
  <label><input type="radio" name="caq16" value="D" /> D. 只适用于单核且不能路由</label>
  <div class="quiz-actions"><button type="button" class="submit-answer">提交答案</button><button type="button" class="show-answer">显示答案</button></div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：B。<br />解析：消息内容可区分多个事件，且中断写不会越过之前的数据写，缓解共享引脚和异步排序问题。</p>
</div>

# 易错点 / 高频考点

- **ISA 不等于微体系结构**：前者是软件可见规范，后者是具体实现；流水线深度与缓存大小一般不属于 ISA。
- **MAR 与 PC 不同**：PC 专门指向下一条指令，MAR 保存当前任意访存地址；MDR 保存数据而不是地址。
- **硬布线快但难改，微程序规整但较慢**：两者的差异在控制信号如何生成，而不是是否需要控制信号。
- **Intel 与 AT&T 操作数顺序相反**：内存写法、寄存器前缀和大小标记也不同。
- **MIPS 是 load/store 结构**：算术通常不直接以内存为操作数；R、I、J 格式字段不能混淆。
- **进位与溢出不是一回事**：进位主要反映无符号范围，溢出反映补码有符号结果越界。
- **乘除法不是单纯组合加法**：移位方向、部分积/余数、符号修正和异常条件都是常考点。
- **单周期不是每条指令各用最短周期**：全体指令共享由最长路径决定的时钟周期。
- **流水线提升吞吐而非必然降低单条延迟**：级间寄存器还有额外开销，冒险会插入气泡。
- **转发不能解决紧邻 load-use**：数据产生时间晚于消费者需要时间；控制冒险还需预测或暂停。
- **BTB 与方向预测器职责不同**：一个提供目标，一个判断是否跳转；`ret` 更适合返回地址栈。
- **SRAM 与 DRAM 不要反记**：SRAM 快、贵、不刷新；DRAM 密度高、需刷新并有行缓冲时序。
- **缓存块、组、行不同**：地址先按索引选组，再比较标记，命中后用偏移选块内数据。
- **中断确认不等于立即执行服务程序**：CPU 要保存现场、查向量，并遵守屏蔽、优先级和特权规则。
- **中断方式仍由 CPU 搬数据，DMA 才是直接传输**：DMA 传输时 DMAC 会成为总线主模块。
- **统一编址不是“没有端口”**：接口寄存器仍存在，只是进入存储地址空间并用普通访存指令访问。
- **PCIe 多 lane 不是传统并行总线**：每条 lane 独立高速串行，协议层再聚合数据。
- **总线仲裁选择主模块，地址译码选择从模块**：两者控制对象不同。
- **AHB 等待周期要求保持信号稳定**：地址与数据阶段可流水重叠，但前一事务未完成会反压后续阶段。
- **MSI 是一次写事务**：它用消息而非专用引脚报告中断，仍会占用互连带宽。
