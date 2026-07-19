---
title: "计网"
description: "计算机网络笔记蒸馏，覆盖网络基础、应用层、传输层、网络层、链路层、无线网络和移动性。"
pubDate: 2026-07-19
draft: false
tags: ["课程笔记"]
---

# 原笔记信息
- 原笔记来源：[计网.md](https://github.com/zhy12138/class_notes/blob/main/%E8%AE%A1%E7%BD%91/%E8%AE%A1%E7%BD%91.md)
- **本资料由原笔记蒸馏整理，建议配合原笔记查漏补缺。**

# 复习 / 预习建议
- 先按“网络基础 -> 应用层 -> 传输层 -> 网络层 -> 链路层 -> 无线与移动性”的顺序过一遍，建立分层和封装主线。
- 复习时优先记接口、协议职责、报文格式、关键状态机和性能公式，例如 HTTP/DNS、TCP、IPv4、以太网和 802.11。
- 对传输层重点比较 UDP/TCP、GBN/SR/TCP、流量控制/拥塞控制，以及 TCP Reno、CUBIC、BBR、DCTCP 的思路差异。
- 对网络层重点抓转发与路由、最长前缀匹配、ARP/DHCP/NAT/ICMP、DV/LS、OSPF/BGP、SDN 和 IPv6 迁移。
- 用章节后的选择题检查概念边界；涉及报文头字段、握手流程和算法细节时，建议回原笔记逐项补漏。

# 速览
- 计算机网络由结点和链路组成，目标是把信息更快、更稳定、更好用地传输；核心要素是实体、服务、协议、实现与管理。
- Internet 采用分组交换和端到端原则：网络核心尽量简单，复杂可靠性、恢复和应用逻辑主要放在端系统。
- 分层架构用接口隔离上下层、用协议连接同层实体；发送端层层封装，接收端层层解封装。
- 应用层通过 socket 调用传输层，典型协议包括 HTTP、DNS、SMTP/POP3/IMAP、P2P、流媒体、CDN、Telnet、FTP、SNMP。
- 传输层把主机到主机交付扩展为进程到进程交付；UDP 简单低开销，TCP 提供字节流、可靠传输、流量控制和拥塞控制。
- 网络层提供跨多跳的尽力而为数据报服务；路由器数据平面负责转发，控制平面负责路由计算。
- 链路层在物理相连结点间传输帧，处理成帧、差错检测、介质访问控制、以太网交换、VLAN 和生成树。
- 无线网络需要处理信号衰减、隐藏终端、CSMA/CA、802.11 帧和移动性；移动 IP 和蜂窝网用代理、注册和切换维护通信。

# 知识点整理

## 基础：实体、服务、协议和分层

### 网络组成与实体

网络 = 结点 + 链路。结点包括计算终端、路由器、交换机等；链路包括网线、光纤、无线媒介。网络的基本目标是信息传输，终极目标是更快、更稳定、更好用。

网络设计的四要素：

- 对等实体：实体的识别、命名和组织形式。
- 服务：传输接口、服务性能、可靠性和安全保障。
- 协议：传输内容的格式、语义和顺序。
- 实现与管理：把功能和协议映射到实体，并完成资源分配与调度。

网络类型：

- PAN：个域网，短距离通信，如蓝牙耳机。
- LAN：局域网，如企业网络、办公室组网、WLAN 和打印机共享。
- MAN：城域网。
- WAN：广域网，覆盖地区或国家。

Internet 是网络的网络。ISP 提供接入与互联服务。网络组成包括网络边缘、接入网和网络核心：

- 网络边缘：端系统与主机，运行应用程序。
- 接入网：把端系统连到边缘路由器。
- 网络核心：由分组交换设备和通信链路构成。

主机内部包括网卡、内核驱动、内核协议栈和用户软件。主机/接口命名包括 MAC 地址、IP 地址和主机名。MAC 地址通常全球唯一且不可修改；IP 地址可配置，便于管理。

### 分组交换、电路交换和性能指标

路由是全局规划：计算源到目的主机的路径。转发是本地执行：每个结点根据本地路由表把数据交给下一跳。

分组交换把大消息拆成分组，以分组为转发单位。每个分组头部含地址等控制信息，可独立选择路径，支持统计多路复用。

分组交换使用存储-转发：路由器必须收到完整分组，才能向下一跳发送。额外传输延迟为 $\frac LR$，其中 $L$ 是分组长度，$R$ 是发送速率。缺点是容易拥塞、排队甚至丢包，无法天然提供服务质量保证。

电路交换先建立连接并预留端到端资源，连接期间物理通路被独占，性能有保障但难以灵活复用，无法适应突发流量。FDM 和 TDM 是电路交换常见多路复用方式。

主要性能指标：

- 带宽：通道最高数据率，单位 bit/s。
- 包转发率 PPS：设备每秒转发包数。
- 比特率：单位时间主机向信道传输的数据量。
- 吞吐量：单位时间通过某位置的数据量。
- 有效吞吐量 goodput：目的地正确收到的有用信息量。
- 利用率：信道或网络被利用的比例。
- 丢包率：丢失包数量占发送包比例。
- 时延：传输时延、传播时延、处理时延、排队时延。
- RTT：从发送数据到收到确认的往返时间。
- 时延带宽积：传播时延乘以带宽，表示按 bit 计的链路长度。
- 抖动：时延变化。
- 可靠性、完整性、隐私性、可审计性。

排队论中 Little 公式：
$$
L=A\times W
$$
其中 $L$ 为平均队列长度，$A$ 为平均到达速率，$W$ 为平均等待时间。

### 协议、封装与分层架构

网络协议是通信双方共同遵守的规则、标准或约定，三要素是语法、语义、时序。

![网络分层模型](/blog/computer-networks/network-layering.png)

分层架构的核心：

- 每层提供特定功能与服务。
- 层与层之间有接口调用。
- 同层实体通过该层协议对话。
- 屏蔽各层实现细节。

好处是降低复杂度、增加灵活性；坏处是引入额外开销，且跨层信息有时重要。

OSI 七层：物理层、数据链路层、网络层、传输层、会话层、表示层、应用层。TCP/IP 模型包括网络接口层、互联网层、传输层、应用层。

![协议封装与解封装](/blog/computer-networks/protocol-encapsulation.png)

发送端层层封装头部，接收端层层解封装。端系统实现所有分层；交换机主要实现物理层和链路层；路由器实现物理层、链路层和网络层。

Internet 的实现主线：

- 端到端原则：复杂功能由端系统实现，网络核心保持简单。
- IP 为核心：IP over everything，Everything over IP。
- 优点：网络核心可扩展、易互连、屏蔽上层应用和底层通信。
- 局限：层间功能重叠、IP 难升级、资源管理和性能控制依赖端系统。

<div class="quiz-question" data-answer="B">
  <p><strong>1. 在分层网络体系中，协议和接口的区别是什么？</strong></p>
  <label><input type="radio" name="cnq1" value="A" /> A. 协议是上下层之间的调用关系，接口是同层实体之间的通信规则</label>
  <label><input type="radio" name="cnq1" value="B" /> B. 协议连接同层对等实体，接口用于上下层之间调用服务</label>
  <label><input type="radio" name="cnq1" value="C" /> C. 协议只存在物理层，接口只存在应用层</label>
  <label><input type="radio" name="cnq1" value="D" /> D. 协议和接口都只描述报文头部格式，不涉及服务调用</label>
  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：B。<br />解析：同层实体通过协议对话，上层实体通过接口调用下层实体提供的服务；这是分层架构中“水平协议、垂直接口”的核心。</p>
</div>

## 应用层

### 应用层实体、架构和传输服务

不同主机上的程序通过应用层完成交互。应用程序以进程形式运行，利用 socket 发送和接收消息。

应用通常希望传输层提供可靠传输、高吞吐、低延迟和安全。实际上传统传输层主要提供：

- TCP：面向连接、可靠传输、有序传输、流量控制、拥塞控制；不能保证延迟、吞吐量和安全。
- UDP：无连接、不可靠、无顺序、无流量控制和拥塞控制；简单、性能开销小，适合部分实时或单次请求/响应应用。

应用进程命名依赖 IP 地址 + 端口号，例如 HTTP 服务器 80、邮件服务器 25。

应用组织架构：

- C/S：客户端主动请求服务，服务器被动提供服务。服务器可采用循环方式或并发方式；TCP 并发服务器常用监听套接字和连接套接字。
- P2P：进程之间不区分固定请求方和提供方，结点可动态加入退出，任意两个实体可直接通信，扩展性好但管理开销更大。

### Web、HTTP、缓存和 Cookie

Web 由 HTTP 客户端和服务器、Web 对象、URL、HTTP 协议组成。HTTP 通常运行在 TCP 上，默认端口 80。HTTP 是无状态协议，服务器端不保存之前请求状态。

HTTP/1.0 默认非持久连接，获取每个对象都要建立、请求/响应、关闭连接。HTTP/1.1 默认持久连接，可复用 TCP 连接，减少慢启动和 RTT 开销；pipeline 支持流水线但需要按序响应。HTTP/2 请求/响应允许交错，可设置优先级和服务器推送。HTTP/3 主要换成 UDP + QUIC。

![HTTP 请求报文格式](/blog/computer-networks/http-request-format.png)

HTTP 请求报文由请求行、首部行和实体主体组成。GET 参数在 URL 中，通常有长度限制；POST 参数在实体主体中，通常不受 URL 长度限制。

![HTTP 响应报文格式](/blog/computer-networks/http-response-format.png)

HTTP 响应报文由状态行、首部行和实体主体组成。状态码表示请求处理结果。

缓存：

- 浏览器缓存：保存在用户主机。
- 代理服务器缓存：ISP 或代理缓存服务器保存 Web 副本。
- 一致性策略：启发式缓存用 Last-Modified 和 Expires；询问式缓存用 If-Modified-Since。

Cookie 用于在无状态 HTTP 上保存用户状态：

1. 服务器通过响应首部 `set-cookie` 分配唯一 cookie。
2. 后续请求带上 cookie。
3. Cookie 保存在用户主机中，由浏览器管理。
4. 服务器后端数据库以 cookie 为关键字记录相关信息。

Cookie 字段包括域、路径、内容、过期时间和安全标志。Cookie 可以简化操作，但也可能泄漏隐私。

### DNS

DNS 负责域名和 IP 地址映射，可双向查询。DNS 提供的是网络层相关功能，但以应用层技术实现，体现了把复杂功能放在网络边缘的思想。

DNS 使用层次化、基于域的命名模式和分布式数据库，避免单点故障并处理海量流量。

![DNS 名字服务器层次](/blog/computer-networks/dns-server-hierarchy.png)

名字服务器：

- 根服务器：知道所有顶级域名服务器的域名和 IP。
- 顶级域名服务器：管理相应 TLD 下的二级域名。
- 二级域/权威名字服务器：保存具体区的权威记录。
- 本地 DNS 服务器：ISP 或组织部署，离用户较近，常称递归服务器。

查询方式：

- 主机到本地 DNS 通常使用递归查询。
- DNS 服务器向上层服务器通常使用迭代查询。

![DNS 查询流程](/blog/computer-networks/dns-query-flow.png)

DNS 报文使用 UDP，端口 53。报文由首部、问题、资源记录组成。

![DNS 报文格式](/blog/computer-networks/dns-message-format.png)

资源记录 RR 格式：
$$
(name,ttl,class,type,value)
$$

常见类型：

- A：主机名到 IPv4 地址。
- CNAME：别名到规范名。
- NS：域到权威名字服务器。
- MX：域到 SMTP 邮件服务器。
- AAAA：域到 IPv6 地址。
- PTR：IP 地址到域名。

DNS 广泛使用缓存，以减少查询延迟和根服务器负载。原始设计未充分考虑安全，因此存在污染、伪造等安全风险。

### 邮件、P2P、流媒体、CDN 和其他应用协议

电子邮件系统包括用户代理、邮件服务器和协议。SMTP 用于发送邮件，POP3/IMAP 用于最终交付，Webmail 通过 Web 接口访问邮件。

P2P 通过 peer 共享资源。索引方式包括中心化索引、Query Flood、混合索引和 DHT。BitTorrent 把文件分成 chunk，peer 通过 tracker 找到其他 peer，并倾向下载稀有块；发送策略偏向给自己贡献大的 peer，并周期性随机尝试新 peer。Chord DHT 把 peer 和 key 哈希到环上，每个 key 由顺时针下一个 peer 管理。

流媒体需要处理高端到端性能约束、时序约束和一定容错性。媒体点播可边下载边播放，客户端缓冲区用于抵消抖动。实时音视频常用 RTP/RTCP 传输和监控媒体流，用 RTSP 控制播放过程。基于 HTTP 的 DASH 把视频切成片段，并根据吞吐量和缓冲情况自适应选择码率。

CDN 把内容拷贝部署到靠近用户的位置，降低时延、避免拥塞、缓解原始服务器压力并提升可扩展性。资源选择可通过 HTTP 重定向、DNS 辅助或页面链接重写完成。

Telnet 通过 NVT 屏蔽异构终端差异，默认 TCP 23。FTP 使用控制连接和数据连接，控制连接通常在 TCP 21，数据连接用于实际文件传输。SNMP 用于网络管理，包括配置、故障、性能、计费和安全管理。

<div class="quiz-question" data-answer="C">
  <p><strong>2. DNS 为什么采用分布式层次结构，而不是单个集中式文件保存全部映射？</strong></p>
  <label><input type="radio" name="cnq2" value="A" /> A. 因为域名只能单向映射到 MAC 地址</label>
  <label><input type="radio" name="cnq2" value="B" /> B. 因为 DNS 必须运行在 TCP 之上，无法缓存</label>
  <label><input type="radio" name="cnq2" value="C" /> C. 为了避免单点故障、处理海量查询流量，并按域名层次分散管理</label>
  <label><input type="radio" name="cnq2" value="D" /> D. 为了让每个 Web 服务器都直接成为根服务器</label>
  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：C。<br />解析：DNS 从 hosts 文件演化为层次化分布式数据库，核心原因是名称规模变大后需要避免集中管理和单点故障，并支撑海量查询。</p>
</div>

## 传输层

### 端口、复用分用、UDP

传输层位于应用层和网络层之间，基于网络层服务，为不同主机上的应用程序提供端到端服务。网络层是主机到主机，传输层是进程到进程。

端口号是套接字标识的一部分，16 bit。报文段携带源端口号和目的端口号。

复用和分用：

- 复用：发送方传输层把套接字标识放入报文段，交给网络层。
- 分用：接收方传输层根据报文段中的套接字标识交付到正确 socket。

UDP 用 $<IP,Port>$ 标识套接字。TCP 连接套接字用四元组标识：`<源IP, 目的IP, 源Port, 目的Port>`。

UDP 是最低限度的传输服务：

- 主机到主机交付变成进程到进程交付。
- 发送/接收单位是数据报，应用层感知报文边界。
- 可选校验和检错。
- 无连接、简单、开销小、尽快发送。
- 适合容忍丢包但对延迟敏感的应用，以及单次请求/响应应用，如 DNS。

UDP 校验和把报文段看成 16 bit 整数组成的序列，求和并取反；计算时包含伪头部，避免 IP 地址错误造成误投递。

### 可靠数据传输：rdt、GBN、SR 和 TCP

不可靠信道可能数据损坏、丢失、乱序。可靠传输要保证数据完整、正确、有序地从源到目的传送。

停等式协议 rdt 2.0 使用 ACK/NAK 和 ARQ。rdt 2.1 加序号处理 ACK/NAK 出错和重复包。rdt 2.2 在 ACK 中携带最近成功的序号，去掉 NAK。rdt 3.0 增加计时器，处理丢包。

停等效率：
$$
U=\frac{F}{F+R\times RTT}
$$
在长肥网络中效率很低。

流水线传输允许未收到确认前连续发送多个包。滑动窗口限制最多 $N$ 个未确认包。

![滑动窗口机制](/blog/computer-networks/sliding-window.png)

GBN：

- 接收端遇到出错或乱序报文就丢弃。
- 发送端超时后重传所有未确认报文。
- 接收端简单，发送端和信道重传开销大。
- 窗口大小 $N$ 时，序号至少需要 $N+1$ 个。

SR：

- 接收方对每个包独立确认。
- 发送方只重传超时或未确认的具体包。
- 接收端需缓存乱序包，发送端需逐包计时。
- 窗口大小 $N$ 时，序号至少需要 $2N$ 个。

![选择重传机制](/blog/computer-networks/selective-repeat.png)

TCP 在不可靠 IP 上提供可靠字节流：

- 对字节编号，而不是对报文编号。
- ACK 值表示下一个期待字节。
- 使用流水线、累积确认、超时重传、快速重传、动态超时估计。
- 接收端可推迟确认，但最多推迟 500ms，且至少每隔一个报文段正常确认。

超时估计：
$$
EstimatedRTT'=(1-\alpha)EstimatedRTT+\alpha SampleRTT
$$
$$
DevRTT'=(1-\beta)DevRTT+\beta|SampleRTT-EstimatedRTT|
$$
$$
TimeoutInterval=EstimatedRTT'+DevRTT'
$$
Karn 算法在重传时不测 SampleRTT，并在连续超时时指数增大超时值。

### TCP 报文、连接管理和流量控制

![TCP 报文段头部](/blog/computer-networks/tcp-header.png)

TCP 关键字段：

- sequence number：数据载荷第一个字节在字节流中的序号。
- acknowledgement number：期望接收的下一个字节。
- 头长度：4 bit，以 4 字节为单位，最大 60 字节。
- Options：MSS、window scale、SACK 等。

三次握手：

1. 客户端发送 SYN，给出客户端起始序号。
2. 服务器发送 SYNACK，分配缓存和变量，给出服务器起始序号并确认客户端序号。
3. 客户端发送 ACK，确认服务器起始序号，可能携带数据。

两次握手的问题是服务器无法确认客户端也在线，旧连接的延迟请求可能导致服务器误开新连接。起始序号要避免新旧连接序号重叠；现代系统常基于密码学哈希和随机机制选择。

关闭连接通过 FIN 和 ACK。双方各自发送 FIN、各自确认对方 FIN，通常是四次握手，FIN 与 ACK 可合并优化。

安全隐患：

- SYN 洪泛攻击：伪造大量 SYN，使服务器维护大量半连接并耗尽资源。
- TCP 端口扫描：通过 SYN、FIN 等探测端口服务状态。

流量控制防止接收端缓存溢出。接收窗口：
$$
RecvWindow=RcvBuffer-(LastByteRcvd-LastByteRead)
$$
发送方限制：
$$
LastByteSent-LastByteAcked\leq RecvWindow
$$

零窗口时，发送方停止发送。为避免非零窗口通告无法触发，TCP 使用坚持定时器发送零窗口探测。

糊涂窗口综合征指接收方不断通告微小窗口，发送方不断发送小分组，导致报头开销浪费。Clark 策略和 Nagle 算法用于缓解。

### 拥塞控制和新型传输协议

拥塞控制限制发送速度不超过网络处理能力；流量控制限制发送速度不超过接收端处理能力。

![拥塞导致吞吐下降](/blog/computer-networks/congestion-collapse.png)

拥塞导致丢包、延迟增大，并浪费重传、转发最终被丢弃分组等网络资源。

拥塞控制需要解决：

- 如何感知拥塞：超时、重复 ACK、ECN 等。
- 如何限制发送速率：拥塞窗口 cwnd。
- 如何调节 cwnd：AIMD、慢启动、拥塞避免、快速恢复等。

发送限制：
$$
LastByteSent-LastByteAcked\leq cwnd
$$
发送速率近似：
$$
rate=\frac{cwnd}{RTT}
$$

AIMD：

- 乘性减：检测丢包后将 cwnd 减半。
- 加性增：无丢包时每 RTT 增加一个 MSS。

![TCP AIMD 公平性](/blog/computer-networks/tcp-aimd-fairness.png)

慢启动从 $cwnd=1MSS$ 开始，每 RTT 近似翻倍，直到丢包或达到 ssthresh。拥塞避免阶段线性增长。快速恢复区分三次重复 ACK 和超时：重复 ACK 说明网络仍有一定传输能力，Reno 会进入快速恢复；超时则重新慢启动。

长期 TCP 平均吞吐量近似：
$$
Average\ throughput=\frac{0.75W}{RTT}
$$
其中 $W$ 是丢包时拥塞窗口。

新型拥塞控制：

- New Reno：快速恢复阶段处理多个丢包，但每 RTT 只能判断并重传一个包。
- SACK：选择确认，ACK 中报告已收到的不连续字节区间。
- BIC：用二分方式寻找合适 cwnd，高 BDP 网络中比 Reno 更积极，但 RTT 公平性差。
- CUBIC：窗口增长只取决于距上次丢包时间，减少 RTT 影响。
- Vegas：用 RTT 而不是丢包影响拥塞窗口。
- Westwood：用于无线网络，基于 ACK 到达速率估计带宽。
- BBR：估计瓶颈带宽和最小 RTT，认为 BDP 是最优窗口，目标是高吞吐低延迟，但与 loss-based 算法共存有公平争议。
- DCTCP：数据中心协议，用 ECN 衡量拥塞程度，按 $\alpha$ 精细减小窗口，维持低队列长度。

新型传输层协议：

- DCCP = UDP + 拥塞控制，提供不可靠数据报流和模块化拥塞控制。
- MPTCP：把单一数据流拆到多个 TCP 子流，聚合多路径带宽，提升可靠性，对应用和网络层透明。
- QUIC：基于 UDP，实现 TCP/TLS/HTTP 部分特性，用户态实现，支持低时延连接建立、多流复用、连接 ID 和更精确 RTT。

![QUIC 协议栈](/blog/computer-networks/quic-stack.png)

<div class="quiz-question" data-answer="A">
  <p><strong>3. TCP 中流量控制和拥塞控制的核心区别是什么？</strong></p>
  <label><input type="radio" name="cnq3" value="A" /> A. 流量控制防止接收端缓存溢出，拥塞控制防止网络核心过载</label>
  <label><input type="radio" name="cnq3" value="B" /> B. 流量控制只用于 UDP，拥塞控制只用于 DNS</label>
  <label><input type="radio" name="cnq3" value="C" /> C. 流量控制依靠 IP 地址，拥塞控制依靠 MAC 地址</label>
  <label><input type="radio" name="cnq3" value="D" /> D. 流量控制保证低延迟，拥塞控制保证绝不丢包</label>
  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：A。<br />解析：流量控制依据接收窗口约束未确认字节数，目标是不淹没接收端；拥塞控制依据 cwnd 调整发送速率，目标是不超过网络承载能力。</p>
</div>

## 网络层

### 网络层服务、路由器和数据平面

网络层不仅在端系统实现，也在中间网络设备上实现。发送端把传输层数据封装进数据包，接收端解封装并交付给传输层，中间路由器检查首部并转发到下一跳。

Internet 提供无连接数据报服务和尽力而为交付：不保证可靠传输、顺序、低时延或带宽，但网络造价低、运行灵活、适应多种应用。

关键功能：

- 转发：单个路由器本地功能，把数据报从输入端口传到正确输出端口，属于数据平面。
- 路由：选择源到目的路径，依赖路由算法和协议，属于控制平面。

![路由器结构](/blog/computer-networks/router-architecture.png)

IP 转发流程：

1. 链路层解封装，校验 IP 头。
2. 获取目的 IP。
3. 按最长前缀匹配查询转发表。
4. 查询失败丢弃。
5. 查询成功则 TTL 减一、重新计算头部校验和、获取输出接口和下一跳链路层地址、重新链路层封装并发送。

普通 IP 转发过程中，路由器不查看传输层及上层协议内容。

输入端口可独立查转发表，实现线速。转发表可用 TCAM 实现并行匹配。输入排队可能产生排头阻塞。交换结构可用共享内存、共享总线、Crossbar 或多级结构。输出端口需要缓冲和调度，常见调度有 FIFO、优先级、轮询、WFQ。

### IPv4、ARP、DHCP、NAT 和 ICMP

IPv4 是无连接协议，执行寻址和分片。

![IPv4 头部格式](/blog/computer-networks/ipv4-header.png)

重要字段：

- 版本、首部长度、总长度。
- 标识、标志、片偏移：用于分片。
- TTL：每过一个路由器减一，防止循环转发。
- 协议：标识 TCP/UDP/ICMP。
- 首部校验和。
- 源地址、目的地址。

MTU 限制数据报大小。IPv4 可以途中分片，目的端重组。

![IPv4 分片](/blog/computer-networks/ip-fragmentation.png)

IP 地址按接口分配。CIDR 允许任意长度网络前缀，如 `127.0.0.1/8`。地址聚合减少对外路由条目，最长前缀匹配保证更具体规则优先。

ARP 获取同一子网内 IP 到 MAC 的映射：

1. 有缓存则直接使用。
2. 无缓存则广播 ARP query。
3. 目标主机返回 MAC。
4. 请求方缓存映射，超时删除。

![IP 地址与 MAC 地址在转发中的关系](/blog/computer-networks/arp-link-ip-addresses.png)

ARP 无状态，收到响应也可能更新 ARP 表，因此存在 ARP spoofing 攻击。

DHCP 用于动态获取 IP、网关、DNS、掩码等配置，基于 UDP，服务器 67 端口、客户端 68 端口。流程是 Discover、Offer、Request、ACK。

![DHCP 工作流程](/blog/computer-networks/dhcp-flow.png)

NAT 将私有地址转换为公有地址，缓解 IPv4 地址不足。

![NAT 工作机制](/blog/computer-networks/nat-mechanism.png)

NAT 出数据报时替换源私有 IP 和端口为 NAT 公网 IP 和新端口，维护转换表；入数据报根据转换表改回内部地址和端口。NAT 优点是节省地址、保护内部结构，缺点是违反分层和端到端模型，并需要处理上层协议。

ICMP 让主机和路由器报告差错和异常，封装在 IP 数据报中，协议号 1。Ping 使用回送请求/回答；Traceroute 通过递增 TTL 并接收 ICMP 超时报文发现路径。

### 路由算法、OSPF 和 BGP

路由目标是为源主机和目的主机找到好的传输路径。网络可抽象成图，边权可以是跳数、带宽倒数、拥塞相关值。

路由算法分类：

- 全局：每个路由器知道完整拓扑和链路开销，典型为链路状态 LS。
- 局部：每个路由器只知道邻居和邻居距离向量，典型为距离向量 DV。
- 静态/动态：路径是否随网络状态变化。

DV 使用 Bellman-Ford 思想。每个结点维护到所有结点的估计距离，并与邻居交换距离向量。优点是每个结点计算和存储要求小；缺点是坏消息传播慢，可能出现无穷计数。毒性逆转可缓解但不能彻底解决。

LS 中每个结点通过链路状态广播获得相同拓扑，再以自己为源运行最短路算法生成转发表。消息数量约 $O(nE)$，每个结点计算 $O(n^2)$ 或 $O(n\log n)$，故障影响较小。

层次路由通过自治系统 AS 解决扩展性和自治管理问题。AS 内使用 IGP，如 RIP、OSPF、IS-IS；AS 间使用 EGP，典型是 BGP。

OSPF 基于链路状态：

1. 发现邻居。
2. 测量链路代价。
3. 洪泛链路信息。
4. 每个路由器获得区域拓扑，计算 Dijkstra。

![OSPF 区域和主干区域](/blog/computer-networks/ospf-areas.png)

OSPF 可划分 area 和 backbone，链路状态只在局部区域或主干区域传播。OSPF 用 Hello、DD、LSR、LSU、LSACK 等报文同步 LSDB。

BGP 是自治域间实际运行的路由协议。AS 内最短路不适用于 AS 间，因为规模巨大且策略目标不同。

![BGP 自治系统间路由](/blog/computer-networks/bgp-overview.png)

BGP：

- eBGP：从相邻 AS 获取可达信息。
- iBGP：在 AS 内传播可达信息。
- 根据可达信息和策略决定路由。
- BGP 路由器通过 TCP 179 端口建立连接并交换 Open、Update、Keepalive、Notification 报文。

重要路径属性：

- AS-PATH：到达目的网络需经过的 AS 号序列。
- NEXT-HOP：使用该路径对应的下一跳 IP。

BGP 路由选择自上而下：本地偏好值、最短 AS-PATH、最近 NEXT-HOP、附加标准、最低路由器 ID。AS 内常用 Hot Potato 策略，选择最近出口，最小化流量在本 AS 停留时间。

### SDN、IPv6、MPLS、VPN 和 QoS

SDN 解决传统网络设备封闭、不可编程、控制平面分布式收敛慢、流量工程难等问题。

![SDN 架构](/blog/computer-networks/sdn-architecture.png)

SDN 三层：

- 数据平面：SDN 交换机，使用流表实现“匹配 - 动作”。
- 控制平面：SDN 控制器，维护全网状态，通过南向接口控制交换机，通过北向接口给应用提供能力。
- 网络应用：基于北向接口实现路由、防火墙、负载均衡等功能。

OpenFlow 流表包括匹配字段、动作、优先级和计数器。

![OpenFlow 流表项](/blog/computer-networks/openflow-flow-table.png)

IPv6 初始动机是解决 32 bit 地址空间耗尽，后续动机包括简化头部、提升处理速度和服务质量。IPv6 地址 128 bit，头部固定 40 字节，不允许途中分片。

![IPv6 头部格式](/blog/computer-networks/ipv6-header.png)

IPv6 去除了首部长度、首部校验和、IPv4 分片字段；选项通过扩展头实现，分片只在源端完成，并使用 Path MTU 发现。

IPv4 到 IPv6 迁移主流技术：

- 隧道技术：把一种网络的数据包封装为另一种网络的载荷。
- 翻译技术：转换 IP 字段、校验和、ICMP、DNS 和部分应用层协议。

MPLS 从基于 IP 转发改为基于标签转发，介于链路层和网络层之间。

![MPLS 域内标签交换](/blog/computer-networks/mpls-domain.png)

MPLS 操作包括入口加标签、域内标签交换、出口去标签。标签只在两个 LSR 之间有意义。FEC 表示一组以同样方式处理的报文，常按目的 IP 前缀、QoS、VPN 等定义。

VPN 建立在 Internet 上，通过隧道、加密、认证和数据验证实现逻辑隔离。

QoS 可量化为带宽、时延、抖动、丢包率等。机制包括调度、流量工程、流量整形、综合服务、区分服务。流量工程可用线性规划分配路径流量，目标如最小化最大链路利用率。

<div class="quiz-question" data-answer="D">
  <p><strong>4. 普通 IP 路由器转发一个 IPv4 数据报时，通常会改变哪些内容？</strong></p>
  <label><input type="radio" name="cnq4" value="A" /> A. 一定会修改源 IP 和目的 IP，并解析 HTTP 头部</label>
  <label><input type="radio" name="cnq4" value="B" /> B. 一定会修改 TCP 端口号和应用层载荷</label>
  <label><input type="radio" name="cnq4" value="C" /> C. 只改变 DNS 资源记录，不改变链路层封装</label>
  <label><input type="radio" name="cnq4" value="D" /> D. TTL 减一并重算 IP 头校验和，同时更新下一跳链路层封装</label>
  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：D。<br />解析：普通 IP 转发根据目的 IP 查转发表，转发时 TTL 减一、头部校验和更新，并重新进行链路层封装；通常不查看传输层和应用层内容。</p>
</div>

## 链路层、有线局域网和无线网络

### 链路层服务、成帧和差错控制

链路层在物理相连的两个结点间传输帧。主机、路由器等都是结点；链路可以是有线信道、无线信道或整个局域网。

链路层特点是差异性：不同链路采用不同协议，提供不同服务。它通常由网卡硬件、固件和软件共同实现。

链路层服务：

- 成帧。
- 差错控制。
- 流量控制。
- 无确认无连接服务，如以太网。
- 有确认无连接服务，如 802.11。
- 有确认有连接服务，适用于长延迟不可靠信道。

![成帧模型](/blog/computer-networks/framing-model.png)

成帧要选择定界符，使接收方从比特流中区分帧开始和结束。方法包括字节计数、字节填充定界符、比特填充定界符和物理编码违例。

差错控制通过冗余校验信息处理位错误。常见方法：

- 奇偶校验：检查奇数个位错误；二维奇偶校验可纠正单比特错误。
- 校验和：发送方 16 bit 求和取反，接收方检查。
- CRC：选定生成多项式，对补零后的数据取模得到校验码；以太网和 WLAN 使用 CRC-32。

海明距离用于分析检错纠错能力。检查 $d$ 个错需要距离 $d+1$；纠正 $d$ 个错需要距离 $2d+1$。

### 多路访问控制、以太网、交换机和 VLAN

多点访问信道中多个站点共享信道，可能冲突，需要介质访问控制。目标是在单站点传输时接近速率 $R$，多站点传输时公平、去中心化、简单。

信道划分：

- TDMA：按时间片分。
- FDMA：按频段分。
- CDMA：按编码分。

随机访问：

- 纯 ALOHA：收到上层数据立即发，最大效率约 $18.4\%$。
- 分隙 ALOHA：只在时间槽开始发，最大效率约 $36.8\%$。
- CSMA：先听后发。
- CSMA/CD：发送过程中检测冲突，冲突后立即中止并退避。以太网使用二进制指数后退。

轮流协议：

- 轮询：主结点轮流授权。
- 令牌传递：拿到令牌才可发送。
- 位图协议：竞争期举手，传输期按序发送。
- 二进制倒计数、有限竞争协议用于折中低负载延迟和高负载效率。

以太网是主流有线局域网技术，特点是简单、低成本、易扩展、高速。

![以太网帧格式](/blog/computer-networks/ethernet-frame.png)

以太网帧字段：

- Preamble：同步时钟和定界。
- 目的 MAC、源 MAC。
- 类型：如 `0x0800` 表示 IP。
- 数据：46 到 1500 字节。
- CRC：检错，错误帧直接丢弃。

最小帧长 64B，最大 1518B，MTU 1500B。以太网提供无连接、不可靠服务，重传交给上层。

交换机工作在链路层，根据 MAC 地址表转发帧。它通过逆向学习源地址建立 MAC 地址到端口的映射，并带老化时间。处理帧时可能转发、过滤或泛洪。

VLAN 在一套物理交换设备上运行多个虚拟局域网，每个 VLAN 是独立广播域。最常见是基于端口的 VLAN。跨交换机 VLAN 通过 trunk port 和 802.1Q 标签实现。

![802.1Q VLAN 帧格式](/blog/computer-networks/vlan-8021q-frame.png)

VLAN 好处：控制广播域、增强安全、灵活构建工作组、提高可管理性。

生成树协议用于冗余链路下避免二层环路引起广播风暴、重复帧和 MAC 表不稳定。

![生成树协议选举](/blog/computer-networks/spanning-tree-election.png)

STP 选举根桥、根端口、指定端口，形成无环生成树；拓扑变化时重新构造。

### 无线网络、802.11 和移动性

无线网络元素：

- 无线主机。
- 基站或 AP。
- 无线链路。

无线网络分为基于基础设施和自组织网络。核心问题包括无线链路传输、多路访问控制、主机移动、IP 地址和 TCP 连接保持。

无线链路特点：

- 信号强度随距离和障碍衰减。
- 受其他信号源干扰。
- 多路径传播。
- SNR 越高，越容易提取信息。
- BER 随传输速率和信噪比变化。

隐藏终端和信号衰减使无线中难以实现 CSMA/CD，因此 802.11 使用 CSMA/CA。

802.11 WLAN 由 BSS 组成，基础设施模式下 AP 是基站角色。主机发送网络层数据前需与 AP 关联：监听信标帧或主动扫描，选择 AP，进行可选认证并获取 IP。

CSMA/CA：

1. 发送前侦听信道。
2. 若 DIFS 空闲则发送整个帧。
3. 若忙则选择随机倒计时，空闲时递减，忙时暂停。
4. 计时器到 0 后发送并等待 ACK。
5. 未收到 ACK 则增大随机范围并重传。
6. 接收方正确收到帧后等待 SIFS 发送 ACK。

RTS/CTS 预约机制用小报文预约信道，避免大帧传输冲突。

![802.11 RTS/CTS 预约机制](/blog/computer-networks/wifi-rts-cts.png)

802.11 帧有多个地址字段，用于无线主机、AP、路由器等不同方向转发。

![802.11 帧地址字段](/blog/computer-networks/wifi-frame-addresses.png)

同一子网下从一个 BSS 移动到另一个 BSS 时，IP 地址不变，交换机可通过逆向学习更新端口。

802.11 还支持自适应传输速率和功率管理。802.15 个人域网基于蓝牙，使用主从模式和跳频扩频。

蜂窝网中，每个基站服务一个小区，通过有线链路连到移动交换中心。2G 主要使用语音网络，3G 增加数据网络，4G LTE 使用 IP 承载语音和数据，控制平面与数据平面分离。

移动性管理：

- 通过路由：为移动设备永久地址创建路由表项，难以支持海量设备。
- 通过代理：常用方法，包括间接路由和直接路由。

![移动 IP 间接路由](/blog/computer-networks/mobile-ip-indirect-routing.png)

间接路由对通信者透明，但有三角路由效率问题。直接路由解决三角路由，但通信者必须获取转交地址，移动后可能失效。锚外部代理或锚 MSC 是二者折中。

无线移动性对高层逻辑影响不大，但实际会因高比特错误、切换导致丢包/延迟，影响 TCP 拥塞控制和实时应用。

<div class="quiz-question" data-answer="C">
  <p><strong>5. 为什么 802.11 无线局域网采用 CSMA/CA，而不是像经典以太网那样采用 CSMA/CD？</strong></p>
  <label><input type="radio" name="cnq5" value="A" /> A. 因为无线网络没有任何冲突风险</label>
  <label><input type="radio" name="cnq5" value="B" /> B. 因为无线链路不能发送 ACK</label>
  <label><input type="radio" name="cnq5" value="C" /> C. 因为无线信号衰减、隐藏终端等问题使发送时检测冲突很困难，所以发送前尽量避免冲突</label>
  <label><input type="radio" name="cnq5" value="D" /> D. 因为 CSMA/CA 不需要侦听信道，也不需要随机退避</label>
  <div class="quiz-actions">
    <button type="button" class="submit-answer">提交答案</button>
    <button type="button" class="show-answer">显示答案</button>
  </div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：C。<br />解析：无线中发送时很难同时可靠侦听冲突，且隐藏终端会让站点听不到彼此，因此 802.11 用 CSMA/CA、ACK 和 RTS/CTS 等机制在发送前尽量避免冲突。</p>
</div>

# 易错点 / 高频考点

- 路由是全局路径计算，转发是本地查表执行；两者不要混为一谈。
- 分组交换不预留资源，灵活且适合突发流量，但会排队、丢包且没有天然 QoS 保证。
- 协议是同层实体之间的规则，接口是上下层之间的服务调用。
- HTTP 是无状态协议；Cookie 是服务器在无状态 HTTP 上维护用户状态的一种方式。
- DNS 是应用层实现，但服务于域名和 IP 映射；主机到本地 DNS 常递归，本地 DNS 到上层服务器常迭代。
- UDP 保留报文边界，TCP 是字节流，不保留应用报文边界。
- UDP 的校验和包含伪头部，用于降低误投递风险。
- GBN 接收端丢弃乱序包，SR 接收端缓存乱序包；窗口大小为 $N$ 时，GBN 至少 $N+1$ 个序号，SR 至少 $2N$ 个序号。
- TCP ACK 是下一个期待字节序号，不是最后一个收到字节序号。
- TCP 三次握手不仅确认双方在线，还同步初始序号和连接参数；两次握手在不可靠网络中可能误建连接。
- 流量控制看接收端窗口，拥塞控制看网络承载能力和 cwnd。
- 慢启动是指数增长，并不是“速度慢”；慢是相对无拥塞控制直接按接收窗口发。
- NAT 解决地址不足但破坏端到端模型和分层模型，路由器需要处理传输层端口。
- ARP 只在同一局域网内解析 IP 到 MAC；跨子网时链路层目的 MAC 是网关接口。
- IPv4 允许途中分片，目的端重组；IPv6 不允许途中分片，只在源端分片。
- BGP 不追求简单最短路，而是基于可达性和策略；OSPF 是 AS 内链路状态协议。
- SDN 的关键是控制平面和数据平面分离，OpenFlow 用匹配 - 动作流表描述数据平面行为。
- 以太网错误帧直接丢弃，不负责可靠重传；可靠性通常由上层处理。
- VLAN 是二层广播域隔离，VLAN 间通信通常需要三层路由。
- STP 用于二层冗余拓扑中消除环路，避免广播风暴和 MAC 表不稳定。
- WiFi 因隐藏终端和信号衰减难以做冲突检测，所以使用 CSMA/CA 和 ACK。
- 无线移动性逻辑上不改变 IP 尽力而为模型，但实际会导致丢包、延迟和 TCP 拥塞窗口误降。
