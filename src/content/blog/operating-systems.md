---
title: "操作系统"
description: "操作系统笔记蒸馏，覆盖进程线程、文件与 IPC、同步、调度、虚拟内存、I/O、文件系统、事务和分布式文件系统。"
pubDate: 2026-07-17
draft: false
tags: ["课程笔记"]
---

# 原笔记信息
- 原笔记来源：[操作系统.md](https://github.com/zhy12138/class_notes/blob/main/%E6%93%8D%E7%BB%9F/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F.md)
- **本资料由原笔记蒸馏整理，建议配合原笔记查漏补缺。**

# 复习 / 预习建议
- 先按“抽象 - 并发 - 调度 - 内存 - I/O - 文件系统”的顺序建立主线，每章都问自己操作系统在抽象什么、保护什么、优化什么。
- 复习同步和内存时不要只背定义，要能写出关键伪代码：Peterson、test-and-set 锁、管程生产者消费者、死锁检测、Clock。
- 调度、I/O 和内存章节优先记目标函数、性能公式和适用条件，例如 SRTF 最小化平均完成时间、EDF 的可行条件、EAT、M/M/1 和 M/G/1。
- 文件系统章节按路径解析、inode/FAT/FFS/NTFS、buffer cache、日志事务、2PC/GFS 的流程串起来。
- 用选择题查概念边界；对 API、伪代码和图示细节仍建议回原笔记逐项补漏。

# 速览
- 线程是 CPU 调度的执行单元，进程是资源分配和保护边界；线程共享地址空间和 I/O 状态，私有寄存器与栈。
- 文件描述符、open file description、pipe、socket 是 Unix I/O 和进程间通信的核心抽象。
- 同步问题的核心是不确定调度下共享状态会竞争；锁、信号量、管程和条件变量分别解决互斥和调度约束。
- 调度算法在平均完成时间、吞吐量、公平性、尾延迟和实时保证之间权衡，没有单一最优策略。
- 虚拟内存靠地址翻译、保护、分页、TLB 和按需调页提供隔离、共享和大地址空间。
- I/O 性能受设备慢速、排队和突发影响；利用率接近 1 时延会急剧上升。
- 文件系统把块设备转换为文件、目录、权限和可靠持久结构；inode、buffer cache、RAID、日志和事务是核心机制。
- 分布式文件系统增加透明性和容错目标，但必须处理协议、共识、复制、故障和一致性。

# 知识点整理

## 基本知识：线程、地址空间、进程与双模式

### 线程

线程是并发的单元，用于让操作系统和程序同时处理多个任务：

- 网络服务器同时处理多个连接。
- 并行程序利用多核提升性能。
- UI 程序一边计算一边响应用户。
- 网络和磁盘受限程序用并发掩盖高延迟。

线程状态：

- `RUNNING`：正在执行。
- `READY`：准备执行但尚未获得 CPU。
- `BLOCKED`：等待 I/O 或事件，暂时不能执行。

线程共享与私有状态：

- 共享：地址空间、全局变量、堆、文件描述符、网络连接。
- 私有：TCB 中的寄存器、PC、执行栈、参数、临时变量、返回地址等。

![进程内共享状态与线程私有状态](/blog/operating-systems/screenshot-08.png)

### 地址空间、进程与双模式

进程是一个受限执行环境：

- 一个或多个线程在单一地址空间中执行。
- 拥有自己的文件描述符、网络连接等资源。
- 进程之间、进程和操作系统之间受到保护。

线程是对虚拟 CPU 核心的抽象，是调度的最小单位；进程是对机器的抽象，是资源分配和保护的最小单位。

![单线程进程与多线程进程的地址空间](/blog/operating-systems/screenshot-30.png)

双模式用于保护操作系统：

- 用户态执行普通应用。
- 内核态执行特权指令、设备访问、页表修改等操作。
- 系统调用、异常和中断会让控制权进入内核。

<div class="quiz-question" data-answer="B">
  <p class="quiz-prompt"><span class="quiz-number">1.</span><strong>线程和进程的核心区别是什么？</strong></p>
  <label><input type="radio" name="osq1" value="A" /> A. 线程拥有独立地址空间，进程只能共享地址空间</label>
  <label><input type="radio" name="osq1" value="B" /> B. 线程是调度执行单元，进程是资源分配和保护边界</label>
  <label><input type="radio" name="osq1" value="C" /> C. 进程没有文件描述符，线程才有文件描述符</label>
  <label><input type="radio" name="osq1" value="D" /> D. 线程只能串行执行，进程才能并发执行</label>
  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：B。<br />解析：线程抽象虚拟 CPU，是 CPU 调度的执行单位；进程抽象执行环境，是资源管理和隔离保护边界。</p>
</div>

## 抽象：线程、进程、文件与 IPC

### pthread 线程 API

创建线程：

```c
#include <pthread.h>
typedef void *(func)(void *);
int pthread_create(pthread_t *tid, pthread_attr_t *attr, func *f, void *arg);
pthread_t pthread_self(void);
```

终止线程：

```c
void pthread_exit(void *thread_return);
int pthread_cancel(pthread_t tid);
```

回收线程：

```c
int pthread_join(pthread_t tid, void **thread_return);
```

分离线程：

```c
int pthread_detach(pthread_t tid);
```

动态初始化共享全局变量：

```c
pthread_once_t once_control = PTHREAD_ONCE_INIT;
int pthread_once(pthread_once_t *once_control, void (*init_routine)(void));
```

并发正确性关键词：

- **不确定性**：线程可任意顺序运行，也可在任意时刻切换。
- **竞争**：共享资源被不同线程以不确定顺序访问。
- **同步**：协调线程使用共享资源。
- **互斥**：同一时刻只允许一个线程执行临界区。
- **锁**：通过 `acquire` 和 `release` 实现互斥。
- **信号量**：非负整数，`P/down` 等到正数后减一，`V/up` 加一并可能唤醒。

### 进程 API

退出：

```c
void exit(int status);
```

创建：

```c
pid_t fork(void);
```

`fork` 在父进程返回子进程 PID，在子进程返回 0；子进程复制父进程虚拟地址空间和打开文件描述符映射，但 PID 不同。

等待：

```c
pid_t wait(int *statusp);
```

执行：

```c
int execve(const char *filename, const char *argv[], const char *envp[]);
int execv(const char *path, char *const argv[]);
```

`execve` 在当前进程上下文中加载新程序，替换代码段、数据段、堆栈和寄存器，保留 PID、组标志和默认文件描述符；成功时不会返回。

信号：

```c
int kill(pid_t pid, int sig);
int sigaction(int signum, const struct sigaction *act, struct sigaction *oldact);
```

### 文件和 I/O 抽象

POSIX 将许多对象抽象为 file I/O 接口。

![I/O 抽象层次](/blog/operating-systems/screenshot-01.png)

High-level I/O 使用 `FILE *` 流：

```c
FILE *fopen(const char *filename, const char *mode);
int fclose(FILE *fp);
int fputc(int c, FILE *fp);
int fgetc(FILE *fp);
size_t fread(void *ptr, size_t size, size_t num, FILE *a_file);
size_t fwrite(const void *ptr, size_t size, size_t num, FILE *a_file);
int fseek(FILE *stream, long int offset, int whence);
long int ftell(FILE *stream);
```

Low-level I/O 使用文件描述符：

```c
int open(const char *filename, int flags, mode_t mode);
int creat(const char *filename, mode_t mode);
int close(int fd);
ssize_t read(int fd, void *buffer, size_t maxsize);
ssize_t write(int fd, const void *buffer, size_t size);
off_t lseek(int fd, off_t offset, int whence);
int dup2(int old, int new);
int dup(int old);
int pipe(int pipefd[2]);
```

`FILE *` 包含文件描述符、用户态 buffer 和 lock。High-level I/O 的优点是减少系统调用、接口方便；缺点是刷新行为带来不确定性。混用 `fread` 和 `read` 可能因用户缓冲导致读到不可预期的数据。

每个进程维护文件描述符到 OFD 的映射。OFD 包含磁盘位置和当前文件偏移；`fork`、`dup` 和 `dup2` 会导致多个描述符共享同一个 OFD。

![fork 后文件描述符到 OFD 的共享](/blog/operating-systems/screenshot-02.png)

### IPC、pipe 与 socket

pipe 本质是内核中的固定大小队列：

```c
int pipe(int fd[2]); // fd[0] 读端，fd[1] 写端
```

- 写满时 producer 阻塞。
- 读空时 consumer 阻塞。
- 所有写描述符关闭后，读返回 `EOF`。
- 所有读描述符关闭后，写产生 `SIGPIPE`，继续写会得到 `EPIPE`。

![Unix pipe 通信模型](/blog/operating-systems/screenshot-03.png)

socket 用于跨网络 IPC；连接包含两个单向 queue。Server 调用序列：

1. `socket()` 创建 server socket。
2. `bind()` 绑定地址。
3. `listen()` 监听连接请求。
4. `accept()` 创建 connection socket 服务特定客户。

Client 调用序列：

1. `socket()` 创建 socket。
2. `connect()` 连接服务器地址。

![socket 连接结构](/blog/operating-systems/screenshot-05.png)

并发服务器可用 `fork` 或多线程实现。进程隔离好但开销大，线程效率高但共享状态无保护；常见做法是限制进程 / 线程池大小，避免过多并发降低吞吐。

<div class="quiz-question" data-answer="D">
  <p class="quiz-prompt"><span class="quiz-number">2.</span><strong><code>fork</code> 后父子进程对同一已打开文件的文件描述符关系是什么？</strong></p>
  <label><input type="radio" name="osq2" value="A" /> A. 子进程只能获得文件名，不能获得文件描述符</label>
  <label><input type="radio" name="osq2" value="B" /> B. 父子进程必然拥有完全独立的磁盘文件副本</label>
  <label><input type="radio" name="osq2" value="C" /> C. 子进程复制描述符后立即关闭父进程描述符</label>
  <label><input type="radio" name="osq2" value="D" /> D. 子进程复制文件描述符到 OFD 的映射，可能共享文件偏移和状态</label>
  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：D。<br />解析：fork 会复制文件描述符映射，描述符可能指向同一个 open file description，因此共享偏移和文件状态。</p>
</div>

## 同步：锁、信号量、管程和读者写者

### 并发与锁

同步需求来自两个事实：

- 线程执行顺序不可预测。
- 共享资源状态会被并发访问改变。

Bounded Buffer 的 producer-consumer 是经典同步问题：producer 写入有限缓冲区，consumer 读取；满时 producer 等待，空时 consumer 等待。

### Peterson 算法

Peterson 用两个线程的意图位和轮次变量实现互斥：

```c
bool flag[2] = {0, 0};
int turn = 0;

void thread0() {
    while (1) {
        flag[0] = 1;
        turn = 1;
        while (flag[1] && turn == 1) ;
        /* critical section */
        flag[0] = 0;
    }
}

void thread1() {
    while (1) {
        flag[1] = 1;
        turn = 0;
        while (flag[0] && turn == 0) ;
        /* critical section */
        flag[1] = 0;
    }
}
```

忙等结束意味着对方没有意图进入，或对方把轮次让给自己。缺点是只适合极简模型，现代硬件和编译器语义下不能直接作为通用锁。

### 中断与原子指令锁

关中断锁伪代码：

```pseudocode
acquire:
    disable_interrupt
    if locked:
        put thread to sleep_queue
        wait
    else:
        lock
    enable_interrupt

release:
    disable_interrupt
    if sleep_queue not empty:
        pop a waiter
        put to ready_queue
    else:
        unlock
    enable_interrupt
```

优点：无忙等，无优先级反转。缺点：不能提供给用户，且多处理器上禁用所有处理器中断代价很高。

原子指令：

```c
test&set(&address)
{
    result = M[address];
    M[address] = 1;
    return result;
}

int value = 0; // free
Acquire:
    while (test&set(value));
Release:
    value = 0;
```

优点：用户可用，多处理器可用。缺点：busy-wait 消耗 CPU，可能产生优先级反转。改进思路是用一个短暂 busy-wait 的 `guard` 保护锁内部状态，等待锁本身时把线程放入睡眠队列。

### 管程与条件变量

管程由一个锁和若干条件变量组成：

- `wait(&cond, &lock)`：原子释放锁并睡眠，醒来后重新获得锁。
- `signal(&cond)`：唤醒一个等待者。
- `broadcast(&cond)`：唤醒所有等待者。

Producer-consumer 管程写法：

```c
lock buf_lock;
condition producer_CV;
condition consumer_CV;

Producer(item) {
    acquire(&buf_lock);
    while (buffer_full) {
        cond_wait(&producer_CV, &buf_lock);
    }
    enqueue(item);
    cond_signal(&consumer_CV);
    release(&buf_lock);
}

Consumer() {
    acquire(&buf_lock);
    while (buffer_empty) {
        cond_wait(&consumer_CV, &buf_lock);
    }
    item = dequeue();
    cond_signal(&producer_CV);
    release(&buf_lock);
    return item;
}
```

Mesa vs Hoare：

- **Mesa-style**：`signal` 只把等待者放入 ready queue，之后由调度器运行；条件可能已变化，所以必须用 `while` 重新判断。
- **Hoare-style**：唤醒后立即转交 lock 和 CPU，语义更直接，但上下文切换开销大。

![Mesa monitor 中 signal 后等待者进入 ready queue](/blog/operating-systems/screenshot-12.png)

### 读者写者问题

读者可并发读；写者必须独占。原笔记给出写者优先实现：

```c
int AR=0, WR=0, AW=0, WW=0;
condition okToRead=NIL;
condition okToWrite=NIL;

Reader() {
    acquire(&lock);
    while ((AW + WW) > 0) {
        WR++;
        cond_wait(&okToRead, &lock);
        WR--;
    }
    AR++;
    release(&lock);
    /* read */
    acquire(&lock);
    AR--;
    if (AR == 0 && WW > 0)
        cond_signal(&okToWrite);
    release(&lock);
}

Writer() {
    acquire(&lock);
    while ((AW + AR) > 0) {
        WW++;
        cond_wait(&okToWrite, &lock);
        WW--;
    }
    AW++;
    release(&lock);
    /* write */
    acquire(&lock);
    AW--;
    if (WW > 0)
        cond_signal(&okToWrite);
    else if (WR > 0)
        cond_broadcast(&okToRead);
    release(&lock);
}
```

该实现会让等待写者优先于后来的读者，可能导致读者饥饿。

<div class="quiz-question" data-answer="C">
  <p class="quiz-prompt"><span class="quiz-number">3.</span><strong>Mesa-style monitor 中为什么条件等待通常要写成 <code>while</code> 而不是 <code>if</code>？</strong></p>
  <label><input type="radio" name="osq3" value="A" /> A. <code>while</code> 可以自动释放所有锁，<code>if</code> 不会释放锁</label>
  <label><input type="radio" name="osq3" value="B" /> B. Mesa-style 不支持条件变量</label>
  <label><input type="radio" name="osq3" value="C" /> C. 被唤醒线程只是进入 ready queue，真正运行时条件可能已不满足</label>
  <label><input type="radio" name="osq3" value="D" /> D. <code>while</code> 可以避免所有类型的死锁</label>
  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：C。<br />解析：Mesa-style 的 signal 不立即转交 CPU 和锁，等待者真正运行时共享状态可能已被其他线程改变，所以必须重新检查条件。</p>
</div>

## 调度：目标、经典算法、Linux、死锁与现代调度

### 调度目标与基础算法

执行模型：程序在 CPU burst 和 I/O burst 间切换。调度决定哪个任务获得下一次 CPU burst。

![CPU burst 与 I/O burst 交替](/blog/operating-systems/screenshot-13.png)

目标：

- 最小化完成时间 / 平均 JCT / tail JCT。
- 最大化吞吐量。
- 保证公平。

FCFS：

- 运行直到完成或阻塞。
- 简单，但有 HOL 排头阻塞，对短任务不友好。

RR：

- 时间片轮转，时间片 $q$ 通常为 $10\sim100ms$。
- $n$ 个进程时，等待至多 $(n-1)q$。
- $q$ 太大退化为 FCFS，太小则上下文切换开销大。

Strict Priority：

- 总是运行最高优先级任务。
- 缺点是低优先级可能饥饿，并可能出现优先级反转。
- 修复可用 CPU 比例分配、动态提升优先级或优先级捐赠。

SJF / SRTF：

- SJF：选运行时间最短任务，非抢占。
- SRTF：新任务剩余时间更短时抢占。
- 在最小化平均完成时间目标下，SJF / SRTF 分别是无抢占 / 有抢占最优策略。
- 缺点是长任务可能饥饿，且未来运行时间难以预测。

![调度策略对 CPU / I/O 利用率的影响](/blog/operating-systems/screenshot-32.png)

### 经典策略与实时调度

预测 CPU burst：

$$
\tau_n=\alpha t_{n-1}+(1-\alpha)\tau_{n-1}
$$

Lottery Scheduling：

- 每个任务持有若干 tickets。
- 每个时间片随机抽 ticket。
- 平均 CPU 时间与 ticket 数成比例。
- 至少一个 ticket 可避免饥饿，负载增删时比例自动变化。

MLFQ：

1. 多个队列，不同优先级。
2. 队列内可用 RR 或 FCFS。
3. 新作业进最高优先级。
4. 运行失败 / 耗尽时间片则降级。
5. 时间片内完成或交互式行为可提升。

MLFQ 近似 SRTF，但用户可插入短任务保持高优先级。

多核调度：

- 每核维护调度结构可减少争用。
- 亲和性调度让线程倾向回到同一 CPU，复用缓存。
- spinlock 在等待时间短且核数足够时减少睡眠 / 唤醒开销，但 `test&set` 会造成缓存一致性 ping-pong。
- Gang Scheduling 尝试把协作线程同时调度到多核上，使自旋等待更有效。

EDF：

- 假设任务周期 $P_i$ 和计算时间 $C_i$ 已知。
- 调度器总是运行 deadline 最近的任务。
- 若 $\sum \frac{C_i}{P_i}\leq 1$，则存在可行调度方案。

### Linux O(1) 与 CFS

Linux O(1) Scheduler：

- 每个任务有 nice 值，nice 负相关于优先级。
- active / expired 两个队列；时间片耗尽后进入 expired，active 空后交换。
- 每个队列内部按优先级组织。
- `sleep_avg=(sleep_time-active_time)*coeff` 提高 I/O 密集型任务优先级。
- Interactive Credit 平滑短期行为变化。
- 实时任务总是抢占非实时任务。

CFS：

- 按比例分配 CPU 时间，追踪每个线程的 vruntime。
- 每次选择 vruntime 最少的线程。
- 使用类似堆的结构，增删 $O(\log n)$。

时间片：

$$
Q_i=\frac{TL}{n}
$$

加入最小粒度：

$$
Q_i=\max(\frac{TL}{n}, MG)
$$

按权重比例：

$$
Q_i=\max(\frac{w_i}{\sum w_i}TL, MG)
$$

nice 可影响权重，例如：

$$
w_i=\frac{1024}{1.25^{nice}}
$$

调度评估图提醒：系统利用率接近 100% 时响应时间会非线性暴涨。

![响应时间随利用率上升的非线性变化](/blog/operating-systems/screenshot-15.png)

### 死锁

死锁条件：

1. 互斥。
2. 占有并等待。
3. 不可抢占。
4. 循环等待。

资源分配图用 $T_i$ 表示线程，$R_j$ 表示资源；请求边为 $T_i\rightarrow R_j$，分配边为 $R_j\rightarrow T_i$。

![资源分配图中的死锁和非死锁环](/blog/operating-systems/screenshot-16.png)

死锁检测算法：

```c
[Avail] = [FreeR];
UNFINISHED = All Thread;
do {
    done = true;
    for node in UNFINISHED:
        if ([Req_node] <= [Avail]) {
            UNFINISHED.remove(node);
            [Avail] += [Alloc_node];
            done = false;
        }
} until(done);
if (!UNFINISHED.empty())
    report deadlock;
```

死锁处理：

- **预防**：破坏死锁条件，例如一开始申请所有资源，或强制资源申请顺序。
- **恢复**：终止线程、抢占资源、回滚操作。
- **避免**：动态延迟资源请求，避免进入不安全状态。
- **否认**：忽略应用死锁，出问题重启。

Banker's Algorithm 将检测条件替换为：

```text
[Max_node] - [Alloc_node] <= [Avail]
```

即假设所有线程未来都顶格申请资源，仍要存在一种完成顺序。

### 现代调度

- **ZygOS**：微秒级 RPC tail latency，应用层和网络层间增加 Shuffle Layer，通过工作窃取接近单队列效果并保持低开销。
- **Shinjuku**：单队列，依赖快速抢占，关注微秒级 tail latency。
- **Tiresias**：深度学习集群调度，使用 LAS / 2D-LAS 和 MLFQ 近似最小化 JCT，同时考虑 GPU 放置。
- **DRF**：对 Dominant Share 做 max-min fairness，满足份额保证、strategy-proof 和帕累托效率。
- **FairRide**：分布式缓存公平共享，满足份额保证和 strategy-proof，但不追求完全帕累托最优。

![DRF 中 dominant share 的资源分配例子](/blog/operating-systems/screenshot-18.png)

<div class="quiz-question" data-answer="A">
  <p class="quiz-prompt"><span class="quiz-number">4.</span><strong>在已知任务运行时间且允许抢占的假设下，哪种调度策略用于最小化平均完成时间？</strong></p>
  <label><input type="radio" name="osq4" value="A" /> A. SRTF</label>
  <label><input type="radio" name="osq4" value="B" /> B. FCFS</label>
  <label><input type="radio" name="osq4" value="C" /> C. Strict Priority</label>
  <label><input type="radio" name="osq4" value="D" /> D. FIFO disk scheduling</label>
  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：A。<br />解析：SRTF 在可抢占且已知剩余运行时间的条件下，是最小化平均完成时间的标尺策略。</p>
</div>

## 内存：地址翻译、TLB、Demand Paging 与现代内存管理

### 虚拟地址空间与 Base/Bound

虚拟内存目标：

- **保护**：防止访问其他进程或内核私有内存。
- **翻译**：虚拟地址到物理地址。
- **可控重叠**：在共享内存等场景允许映射同一物理页。

Base and Bound：

- `Bound` 检查虚拟地址是否越界。
- `Base + virtual_address` 得到物理地址。
- 优点是简单、高效、保护清晰、上下文切换快。
- 缺点是外部碎片、稀疏地址空间支持差、共享困难。

![Base and Bound 的硬件运行时翻译](/blog/operating-systems/screenshot-23.png)

### 分段与分页

分段：

- 虚拟地址划分为 `seg# : offset`。
- 段表项包含 `Base, Limit, V/N`。
- `Base + offset` 得物理地址，`Limit` 做越界检查。
- 支持稀疏地址空间和权限保护，但仍有可变大小段带来的碎片和移动问题。

![分段地址翻译](/blog/operating-systems/screenshot-20.png)

分页：

- 固定大小页切分虚拟和物理内存。
- 虚拟地址划分为虚拟页号和 offset。
- 页表将虚拟页号映射到物理页号和权限。
- 优点是分配简单、共享容易；缺点是稀疏地址空间会浪费页表，页表过大不能全部常驻。

![分页地址翻译](/blog/operating-systems/screenshot-21.png)

二级页表和多级页表按需分配低层页表，支持稀疏地址空间。PTE 可用于 Demand Paging、Copy on Write、Zero Fill on Demand。

![二级页表结构](/blog/operating-systems/screenshot-24.png)

### TLB 与缓存协同

MMU 每次取指、load、store 都要翻译虚拟地址。TLB 缓存虚拟页号到物理页号映射。

![MMU、TLB、cache 和物理内存关系](/blog/operating-systems/screenshot-27.png)

TLB 特点：

- 即使多级页表，也能端到端缓存虚拟页号到物理页号映射。
- TLB miss 后页表本身可能仍在普通缓存中。
- 上下文切换后 TLB 虚拟地址映射可能失效，可全部失效或在 TLB 中加入 PID。

缓存地址划分：

- `Tag`：确认候选块。
- `Index`：选择候选组。
- `Offset`：块内偏移。

若虚拟地址 offset 部分覆盖 cache 需要的 index 和 byte，则可以让 TLB 查询与 cache 索引重叠。

![TLB 与 cache overlap](/blog/operating-systems/screenshot-35.png)

### Demand Paging

Page fault 可能由 PTE 无效、特权违规、权限违规或页面不存在引发。保护违规通常终止指令；可修复缺页由 OS 处理后重试。

Demand paging 流程：

1. PTE 标记 invalid 触发缺页。
2. MMU trap 到操作系统缺页处理程序。
3. OS 从磁盘调页到内存，可能驱逐旧页，脏页需写回。
4. 更新页表，重新调度并重试指令。
5. 成功翻译后更新 TLB。

![缺页异常和按需调页流程](/blog/operating-systems/screenshot-37.png)

典型使用：

- 扩展栈或堆。
- `fork` 的 Copy on Write。
- `exec` 时按需加载活跃二进制页面。
- `mmap` 将文件或共享区域映射为内存。

性能模型：

$$
Effective\ Access\ Time = Hit\ Time + Miss\ Rate \times Miss\ Penalty
$$

缺页类型：

- 强制缺页：页面从未访问，可用预取缓解。
- 容量缺页：内存不足，可增加 DRAM 或调整帧分配。
- 策略缺页：替换策略过早换出页面。

工作集模型认为进程在一段时间内访问稳定页面集合，内存不足以容纳工作集会发生抖动。

![工作集随时间变化](/blog/operating-systems/screenshot-38.png)

### 页替换策略

- FIFO：替换最老页，公平但可能换出频繁使用页。
- Random：简单但不可预测。
- MIN：替换未来最长时间不用的页，最优但不可实现。
- LRU：替换最长时间未使用页，是 MIN 近似，但精确维护开销高。

FIFO 不满足堆栈属性，可能出现 Belady anomaly。

![FIFO 页替换异常](/blog/operating-systems/screenshot-40.png)

Clock Algorithm：

```pseudocode
on page fault:
    loop:
        if current.accessed == 1:
            current.accessed = 0
            advance clock hand
        else:
            replace current page
            stop
```

Nth Chance：

```pseudocode
if accessed == 1:
    accessed = 0
    sweep = 0
elif accessed == 0:
    sweep += 1
    if sweep == N:
        replace
```

脏页替换要写回，常见做法是给脏页更多机会，例如干净页 `N=1`，脏页 `N=2`。

其他细节：

- 反向页映射用于驱逐共享页时找出所有相关 PTE。
- 全局置换吞吐高但不公平；局部置换隔离强但利用率低。
- 缺页频率分配：缺页率高则增加帧，低则减少帧。
- 若 $\sum_i WS_i(t)>m$，内存不足以容纳所有工作集，会抖动，应挂起或换出部分进程。

### 现代内存管理

- **FaRM**：用 RDMA 构建分布式共享地址空间，支持事务和 lock-free reads。
- **vLLM Paged Attention**：把 KV cache 切成 KV block，用 block table 映射，减少内部 / 外部碎片并支持共享。
- **InfiniSwap**：把集群空闲内存抽象为远程 swap，通过 RDMA remote paging 提高内存利用率。
- **AIFM**：应用集成远端内存，用数据结构库和用户态 runtime 捕获语义，降低 OS paging 语义 gap。
- **PipeSwitch**：深度学习 GPU 模型切换中，用分层传输和执行重叠实现流水线式上下文切换。
- **TGS**：容器 GPU 透明共享，通过速率控制、统一内存和驱逐实现性能与故障隔离。

![InfiniSwap 远程内存架构](/blog/operating-systems/screenshot-41.png)

<div class="quiz-question" data-answer="B">
  <p class="quiz-prompt"><span class="quiz-number">5.</span><strong>Clock 页替换算法为什么是 LRU 的近似而不是精确 LRU？</strong></p>
  <label><input type="radio" name="osq5" value="A" /> A. 它完全随机选择要替换的页</label>
  <label><input type="radio" name="osq5" value="B" /> B. 它只用 accessed 位区分新旧两类页面，不能记录完整最近使用顺序</label>
  <label><input type="radio" name="osq5" value="C" /> C. 它必须知道未来页面访问序列</label>
  <label><input type="radio" name="osq5" value="D" /> D. 它只适用于没有 TLB 的机器</label>
  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：B。<br />解析：精确 LRU 要维护所有页面的最近使用顺序；Clock 只通过引用位给页面第二次机会，因此只能近似。</p>
</div>

## I/O、Disk and SSD

### 总线与 I/O 交互

I/O 挑战：

- 设备种类多，需要统一抽象。
- 设备不可靠，可能介质故障和传输错误。
- 设备慢且不可预测。

总线是一组通用线路和传输协议。PCI 是并行总线，设备共享线路且易被慢设备拖慢；PCIe 使用串行通道集合，设备可用不同通道数量获得带宽，从时间复用转向空间复用。

CPU 与 I/O 控制器交互方式：

- Port-Mapped I/O：用 `in/out` 操作端口。
- Memory-Mapped I/O：把寄存器映射到地址空间，用 `load/store` 操作。

传输机制：

- Programmed I/O：CPU 控制每个字节传输，硬件简单但 CPU 开销随数据大小增加。
- DMA：DMA 控制器访问内存总线，减少 CPU 参与。

设备通知方式：

- Interrupt：适合不可预测事件，但开销高。
- Polling：周期检查状态寄存器，频繁操作时开销低，不频繁时浪费周期。
- 实践中常混合，例如第一个网络包触发中断，随后轮询直到队列清空。

驱动程序：

- 上半部分走系统调用路径，实现 `open/read/write/ioctl` 等。
- 下半部分作为中断例程运行，处理输入、输出和唤醒等待线程。

### 存储设备

磁盘：

- 扇区组成磁道，磁道堆叠形成柱面，磁头定位柱面。
- 读写时间包括寻道时间、旋转延迟、传输时间、控制器处理和软件排队。
- 有效利用磁盘的关键是减少寻道和旋转延迟。

SSD：

- 无机械部件，随机读和顺序读都能较高带宽。
- 写入慢于读取，擦除慢于写入。
- 以页读写、以块擦除。
- 通过 FTL 间接层、写时复制、磨损均衡和垃圾回收管理物理闪存。

### I/O 性能模型

基本指标：

- 响应时间 / 时延：一次操作耗时。
- 带宽 / 吞吐量：大量操作速率。

确定性环境：

$$
\mu=\frac{1}{T_S},\quad \lambda=\frac{1}{T_A},\quad U=\frac{\lambda}{\mu}=\frac{T_S}{T_A}
$$

在满载前吞吐增长、时延几乎不变；超过满载后吞吐不再增长、时延持续增长。

![确定性排队与利用率](/blog/operating-systems/screenshot-45.png)

突发建模中，到达间隔常用指数分布：

$$
f(x)=\lambda e^{-\lambda x}
$$

平方变异系数：

$$
C=\frac{\sigma^2}{m^2}
$$

排队论变量：

- $T_{ser}$：平均服务时间。
- $\mu=\frac{1}{T_{ser}}$：服务速率。
- $u=\lambda T_{ser}$：利用率。
- $T_q$：排队时间。
- $T_{sys}=T_q+T_{ser}$：系统响应时间。

M/M/1：

$$
T_q=T_{ser}\frac{u}{1-u}
$$

M/G/1：

$$
T_q=T_{ser}\frac{1+C}{2}\frac{u}{1-u}
$$

提升性能的方法：

- 加速服务。
- 并行化多个解耦系统。
- 重叠等待与计算。
- 优化瓶颈，提高服务速率。
- 准入控制限制队列和时延，但可能引入不公平。

磁盘调度：

- FIFO：简单但可能寻道大。
- SSTF：选择最近请求，减少寻道但可能饥饿。
- SCAN：电梯算法，方向内处理最近请求，无饥饿。
- C-SCAN：单方向扫描，更公平。

<div class="quiz-question" data-answer="D">
  <p class="quiz-prompt"><span class="quiz-number">6.</span><strong>M/G/1 排队模型中，利用率 $u$ 接近 1 时为什么危险？</strong></p>
  <label><input type="radio" name="osq6" value="A" /> A. 服务时间会自动变成 0</label>
  <label><input type="radio" name="osq6" value="B" /> B. 队列长度固定为 1，不会变化</label>
  <label><input type="radio" name="osq6" value="C" /> C. 到达率会自动下降为 0</label>
  <label><input type="radio" name="osq6" value="D" /> D. 公式中存在 $\frac{u}{1-u}$，排队时间会急剧上升</label>
  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：D。<br />解析：当利用率接近 1，分母 $1-u$ 接近 0，排队时间快速增大，响应时间会非线性恶化。</p>
</div>

## 文件系统：结构、经典设计、缓存、可靠性和事务

### 文件系统设计

文件系统把块设备转换为文件、目录、保护和可靠持久结构。内部操作以完整数据块为单位，例如 UNIX 中常见 4KB。

关键任务：

- 追踪哪些块属于哪些文件。
- 目录中追踪文件名到文件号。
- 追踪空闲块。
- 持久维护这些结构。

基本路径：

1. 文件名通过目录结构转换为文件号。
2. 文件号和偏移通过 inode 等索引结构定位数据块。
3. free space map 维护空闲位置。

![文件名、inode 和数据块关系](/blog/operating-systems/screenshot-47.png)

打开文件时：

- `open` 通过路径查找 inode。
- 系统级打开文件表创建内存 inode。
- 每进程打开文件表保存 offset 等状态。
- `read/write` 通过文件句柄找到内核 inode，再访问数据块。

![内存中文件系统打开表结构](/blog/operating-systems/screenshot-48.png)

### FAT、UNIX FS、FFS 与 NTFS

FAT：

- 文件编号作为 FAT 下标，找到该文件第一个块。
- 文件多个块在 FAT 中组织成链表。
- 访问第 $k$ 个块要沿链表走 $k-1$ 步。
- 简单，适合固件；随机访问和连续大文件性能差。

![FAT 链式块分配](/blog/operating-systems/screenshot-49.png)

UNIX FS：

- 文件编号是 inode 数组索引。
- inode 保存元数据和多级块指针。
- 12 个直接指针适合小文件。
- 一级间接指针增加约 4MB，二级约 4GB，三级约 4TB。
- inode 让一个文件可有多个目录名，即硬链接。

![UNIX inode 指针结构](/blog/operating-systems/screenshot-51.png)

FFS：

- 将卷划分为块组。
- inode 与父目录放在同一柱面组，提高局部性。
- 数据块、元数据、空闲空间交错排列。
- 使用 bitmap 而不是链表维护空闲块。
- 尝试连续分配，预留 $10\%\sim20\%$ 空闲空间避免碎片。

![FFS 块组布局](/blog/operating-systems/screenshot-52.png)

打开 `/my/book/count` 的流程：

1. 读根目录 inode。
2. 读根目录数据块，搜索 `my`。
3. 读 `my` inode 和数据块，搜索 `book`。
4. 读 `book` inode 和数据块，搜索 `count`。
5. 读 `count` inode。
6. 设置文件描述符指向该 inode，并检查权限。

链接：

- Hard link：目录项映射文件名到同一 inode；inode 维护引用计数，所有硬链接删除后文件内容可回收。
- Soft link：目录项映射文件名到目标文件名，访问时需再次解析，目标可能不存在。

大目录常用哈希和 B-Tree，避免线性搜索。

![大目录的 B-Tree / 哈希查找结构](/blog/operating-systems/screenshot-54.png)

NTFS：

- 使用 MFT 主文件表，每项最大 1KB。
- 几乎所有内容是 `<attribute: value>`。
- 小文件可把数据直接存在 MFT 记录中。
- 中文件记录 extent 起始块和长度。
- 大文件记录指向其他 MFT 记录，形成层次结构。

![NTFS MFT 与 extent](/blog/operating-systems/screenshot-55.png)

### mmap 与 Buffer Cache

`mmap` 把文件直接映射到进程地址空间：

```c
void *mmap(void *addr, size_t length, int prot, int flags, int fd, off_t offset);
```

用途：

- 直接操作文件，读时隐式换入，写后隐式换出。
- 进程间共享，例如父进程匿名映射后 `fork`，父子共享该区域。

Buffer Cache：

- 缓存磁盘块、inode、目录、free bitmap 等内核资源。
- 软件实现，可能包含脏块。
- LRU 常有效，但扫描整个文件系统时会失效；Use Once 可避免扫描污染。
- 需要在 buffer cache 和虚拟内存页之间平衡内存分配。

延迟写：

- `write` 先复制到内核缓冲区即可返回。
- 脏块在缓存满、周期刷新或其他时机写回。
- 优点是用户响应快，磁盘调度可重排序，延迟块分配可提高连续性，临时文件可能永不落盘。

Demand paging 与 buffer cache 区别：

- Demand paging 访问频繁，硬件维护精确 LRU 代价高，常用 clock 近似。
- Buffer cache 只在 I/O 调用中访问，软件 LRU 更可行。
- Buffer cache 会定期写回脏块以减少崩溃损失。

### 可靠性、RAID 与事务

可靠性包含可用性、安全性、容错 / 持久性。文件系统必须防止崩溃导致 inode、目录、bitmap 等结构不一致。

RAID：

- RAID 1：镜像，每个磁盘完整复制到影子盘，读可并行，写带宽牺牲，容量开销 100%。
- RAID 5：数据条带化，奇偶校验分布在磁盘上，任意损坏一块盘可由异或恢复。
- RAID 6：允许一个条带中两块磁盘故障，使用更复杂擦除码。

![RAID 条带与奇偶校验](/blog/operating-systems/screenshot-59.png)

可靠性方法：

- **谨慎排序和恢复**：按安全顺序写入，崩溃后 fsck 扫描修复。
- **版本控制与写时复制**：写新结构并链接未改变部分，最后声明新版本就绪。

![写时复制生成新版本](/blog/operating-systems/screenshot-60.png)

事务：

```text
Begin: 获取事务 id
执行更新:
    若失败或冲突则回滚
Commit: 提交事务
```

日志式文件系统：

1. 写开始事务。
2. 记录 bitmap、inode、数据块等日志项。
3. 写提交记录。
4. 文件系统访问先查日志，因为磁盘结构可能过时。
5. 后台把日志修改复制到磁盘并丢弃日志。
6. 恢复时扫描日志，丢弃未提交事务，重做完整事务。

现代系统常只对元数据记录日志，以减少写两遍的开销。

<div class="quiz-question" data-answer="A">
  <p class="quiz-prompt"><span class="quiz-number">7.</span><strong>UNIX inode 结构相比 FAT 的一个关键优势是什么？</strong></p>
  <label><input type="radio" name="osq7" value="A" /> A. inode 保存元数据和多级指针，使小文件和大文件都能较高效定位</label>
  <label><input type="radio" name="osq7" value="B" /> B. inode 要求所有文件块必须连续存储</label>
  <label><input type="radio" name="osq7" value="C" /> C. inode 禁止一个文件拥有多个文件名</label>
  <label><input type="radio" name="osq7" value="D" /> D. inode 不需要目录结构即可通过文件名直接找数据块</label>
  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：A。<br />解析：inode 用直接和多级间接指针兼顾小文件与大文件；FAT 链表访问第 k 个块需要沿链表走，随机访问较差。</p>
</div>

## 分布式系统与现代文件系统

### 分布式系统与 2PC

分布式系统目标包括更高可用性、持久性、安全性和协作，但现实中可能更差，因为需要协调多个副本、处理信任、安全、隐私和拒绝服务问题。

透明性目标：

- 位置透明。
- 迁移透明。
- 复制透明。
- 并发透明。
- 并行透明。
- 容错透明。

共识问题：多个节点提出值，部分节点可能崩溃，剩余节点最终决定一个共同值，且决策需持久化。

两阶段提交用于分布式事务，保证所有机器要么一起 commit，要么一起 abort。

准备阶段：

1. 协调者广播 `VOTE-REQ`。
2. 参与者根据自身情况记录 `VOTE-COMMIT` 或 `VOTE-ABORT` 到日志。
3. 参与者回复协调者。
4. 有任何 abort，协调者记录 abort 并广播 `GLOBAL-ABORT`。

提交阶段：

1. 所有参与者准备好后，协调者记录 commit。
2. 协调者广播 `GLOBAL-COMMIT`。
3. 参与者执行 commit 并 ACK。
4. 协调者收到 ACK 后记录 `Got Commit`。

![两阶段提交协调者与参与者状态机](/blog/operating-systems/screenshot-61.png)

缺点：阻塞。若 worker 已承诺 commit 后等待 `GLOBAL-*`，协调者故障会让 worker 阻塞并持有资源，直到协调者恢复或消息重发。

### Dedup、IOFlow 与 GFS

Dedup：

- 全局去冗余，把数据流切成 segment，用 fingerprint 判断是否重复。
- 重复则只保存 fingerprint；不重复则打包成容器、本地压缩并写磁盘。
- 技术包括总结向量、流感知数据段布局、局部性保留缓存。

![Dedup 局部性保留缓存结构](/blog/operating-systems/screenshot-64.png)

IOFlow：

- 面向企业数据中心的端到端存储控制平面。
- 数据平面 API 包括分类、队列服务、路由。
- 控制平面按 max-min fairness 计算 VM 控制速率。
- 在资源共享处做队列管理，在发送源附近做带宽控制，端到端做优先级控制。

GFS 背景：

- 节点故障频繁。
- 文件巨大。
- 多数修改是追加到文件尾部。
- 高持续带宽比低延迟更重要。

GFS 架构：

- 数据平面与控制平面分离。
- Master 管理命名空间、ACL、文件到 chunk 的映射、chunk 位置、租约、回收和负载均衡。
- Client 与 master 交换元数据，直接和 chunkserver 传输文件数据。
- Chunk 默认 64MB，通常复制三份。

![GFS master 与 chunkserver 架构](/blog/operating-systems/screenshot-65.png)

GFS 写入流程：

1. Client 向 master 询问 chunk 所在服务器。
2. Master 授予一个 lease 给主副本，增加版本号，并通知副本。
3. Client 把数据推送到所有服务器。
4. Client 向主副本发送写请求。
5. 主副本确定序列化顺序并本地应用。
6. 主副本把写请求和顺序发给辅助副本。
7. 辅助副本完成后 ACK 主副本。
8. 主副本回复 client 成功或错误。

![GFS 写入的控制流和数据流](/blog/operating-systems/screenshot-66.png)

### EC-Cache 与 Chord

EC-Cache：

- 面向分布式内存缓存的热点、网络不平衡和长尾延迟。
- 写时把数据切成 $k$ 个单元，编码生成 $r$ 个校验单元，随机缓存到不同服务器。
- 读时随机选择 $k+\Delta$ 个单元，使用最先到达的 $k$ 个恢复数据。
- 擦除码允许更精细内存开销控制，并通过额外读取降低长尾延迟。

Chord：

- 用于分布式文件共享中查找 key 所在节点。
- key 和节点都有 m 位 Chord ID，由哈希均匀分布到环上。
- 每个 key 保存在后继节点上。
- 每个节点维护 $O(\log n)$ 状态，查找需要 $O(\log n)$ 消息。

<div class="quiz-question" data-answer="B">
  <p class="quiz-prompt"><span class="quiz-number">8.</span><strong>GFS 为什么让 client 直接和 chunkserver 传输数据，而不是让 master 转发所有文件数据？</strong></p>
  <label><input type="radio" name="osq8" value="A" /> A. 因为 master 不保存任何元数据</label>
  <label><input type="radio" name="osq8" value="B" /> B. 因为控制流和数据流分离可避免 master 成为数据瓶颈</label>
  <label><input type="radio" name="osq8" value="C" /> C. 因为 chunkserver 不能保存本地磁盘数据</label>
  <label><input type="radio" name="osq8" value="D" /> D. 因为 GFS 禁止文件追加</label>
  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：B。<br />解析：GFS master 管元数据和控制决策，文件数据由 client 与 chunkserver 直接传输，从而避免单一 master 承担数据路径瓶颈。</p>
</div>

# 易错点 / 高频考点

- 线程共享地址空间和 I/O 状态，但寄存器和栈私有；进程隔离强但通信和切换更重。
- `fork` 复制文件描述符映射，不等于复制底层文件内容；OFD 的偏移可能被父子共享。
- 信号量有历史，条件变量无历史；条件变量必须配合锁使用。
- Mesa monitor 中等待条件用 `while`，因为醒来不代表条件仍成立。
- SRTF 平均完成时间最优，但需要知道任务长度且会让长任务饥饿。
- EDF 的可行性条件是 $\sum C_i/P_i\leq 1$；实时调度关心 deadline 保证，不是单纯跑得快。
- 死锁四条件缺一不可；Banker 关注是否仍存在安全完成顺序。
- TLB 缓存虚拟页到物理页映射；上下文切换和页表变化都涉及 TLB 一致性。
- Demand paging 的性能由 miss rate 和 miss penalty 主导；磁盘级缺页代价远大于普通缓存 miss。
- FIFO 页替换可能出现页框更多但缺页更多；LRU 和 MIN 满足堆栈属性。
- I/O 利用率接近 1 时，排队延迟会非线性上升，不能只看吞吐。
- FAT 是链表式块分配，inode 是多级指针索引；FFS 的关键是块组局部性和预留空间。
- Buffer cache 是软件缓存，可定期写回脏块；这和硬件 cache/TLB 的维护方式不同。
- RAID 提供介质故障冗余，但不能解决所有文件系统一致性问题；日志 / 事务用于崩溃恢复。
- 2PC 可以最终达成提交 / 终止决定，但协调者故障可能造成参与者阻塞。
