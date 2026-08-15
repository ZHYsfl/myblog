import { useLang } from '@/lib/useLang';

const copy = {
  zh: {
    label: '简历',
    download: '下载 PDF',
    education: {
      title: '教育背景',
      school: '上海交通大学 · 人工智能学院 · 直博生（AudioCC Lab / 张王优老师）',
      school2: '吉林大学 · 软件学院 · 软件工程 · 本科（2023.09 — 2027.06 预计）',
      gpa: 'GPA 3.79 / 4.0，专业前 4.94%（18 / 364），英语六级 549 分。',
      math: '核心课程：机器学习 96.4；线性代数 98.1；大学物理 97.2；算法设计与分析 94.5。',
      cs: '概率论 94.8；数据结构期末机考 100；微积分三学期均分 91.8。',
      summary:
        '直博方向：语音智能体与语音 Benchmark 构建。具备扎实的数理基础、强化学习理论，以及大模型 SFT / RL 多卡微调实践经验。',
    },
    research: {
      title: '科研与项目经历',
      items: [
        {
          title: 'AudioCC Lab — 语音智能体研究',
          date: '2026.08 — 至今',
          sub: '拟录取直博生 · 张王优老师 · 上海交通大学人工智能学院 · 进行中',
          body: `聚焦交互场景语音 Benchmark 构建，评估语音 LLM / Omni 大模型的推理与理解能力，为语音智能体系统奠定评测基础。<br />结合 AudioCC Lab 在音频内容计算的积累，探索语音智能体在复杂声音场景下的感知、推理与行动机制。`,
        },
        {
          title: 'SCRIBE — Agentic RL 长循环训练范式研究',
          date: '2026.04 — 2026.08',
          sub: '研究助理 · 冯二虎老师',
          body: `面向 Agentic RL 与 Loop Engineering，提出 <strong>ReAct + Reflect + Summarize</strong> 三阶段显式训练范式，让 Agent 在多轮循环中沉淀可复用的反思与总结能力。<br />设计 <strong>Turn / Step / Token 三级信用分配</strong>机制，将 GRPO 轨迹级优势逐层分解到每个生成 token，解决长循环训练中的 credit assignment 问题。<br />构建面向 Agentic RL 的 <strong>13 维多维度奖励体系</strong>（格式正确性、摘要忠实度、方向中立性、token 复用率等），抑制 reward hacking 并稳定训练信号。<br />完成数据格式、历史压缩策略与 SFT / RL 训练 pipeline 设计，支撑在真实 Agent 任务上的端到端训练实验。`,
        },
        {
          title: 'AgentGenesis — 智能体学习与评测平台',
          date: '2026.02 — 至今',
          sub: '负责人 · 跨校团队（山大 / 北师大 / 吉大 / 太原理工）· 开源 · 已上线 PyPI',
          body: `针对当前智能体评测环境碎片化、标准不统一的问题，设计并实现 <strong>三层渐进式评测协议</strong>（L1 单 Agent 循环、L2 同沙箱多 Agent 编排、L3 跨沙箱连接原语），统一单 / 多 Agent 评测标准。<br />后端采用 <strong>Go + gRPC + Docker</strong> 架构，实现 OS 级多 Agent 隔离评测，支持 <strong>22+ 评测任务</strong>的并发多测点执行。<br />设计 Adapter 模式解耦题目 API 与核心运行时，新增评测任务仅需更新适配器，无需改动调度引擎。<br />代码开源并采用 GitHub Flow 进行跨校协作开发。`,
        },
        {
          title: 'EducationAgent — 语音多智能体实时协作系统',
          date: '2026.03 — 2026.05',
          sub: '负责人 · 学院实践课项目 · 开源',
          body: `独立设计 <strong>VoiceAgent + PPTAgent 异步协作架构</strong>，选用 Go 语言实现高并发低延迟的实时交互系统。<br />突破传统固定顺序执行范式，实现 Observation / Thinking / Action <strong>动态编排</strong>，支持"边听边想"的流式交互。<br />设计专用通信协议实现双 Agent <strong>完全异步协作</strong>，提升语音智能体与 PPT 智能体之间的实时协同效率。`,
        },
        {
          title: 'ToolCallingGo — Go 语言 Agent 工具框架',
          date: '2026.03 — 2026.04',
          sub: '独立开发 · 开源',
          body: `针对 Go 生态 Agent 工具链薄弱的问题，独立开发轻量级 Agent SDK（基于 openai-go/v3）。<br />实现 <strong>双层并行机制</strong>：单 Agent 内多工具并行调用 + 多 Agent 会话级并行（Batch / BatchRace）。<br />内置级联终止、错误重试、事件流观测等可靠性机制，提供完整的调试与可观测性支持。`,
        },
        {
          title: '生成式重排序算法研究',
          date: '2025.09 — 2026.01',
          body: `从数学建模 Agent 研究转向，创新提出基于 <strong>Pairwise 的生成式重排序算法簇</strong>。<br />独立构建评测数据集，在 AutoDL <strong>4×A800</strong> 上完成 SFT 与 RL 全流程微调。<br />在 BRIGHT Benchmark 上完成系统评测；通过实验与数学推导发现算法固有局限，形成完整的科研闭环。`,
        },
      ],
    },
    honors: {
      title: '竞赛与荣誉',
      items: [
        '中国大学生服务外包创新创业大赛 · 全国三等奖（2025.06）——队长，Voice Agent 方向，赴青岛现场答辩',
        '中关村 AI Agents Vibe Coding 黑客松 · 特别表彰（2025.07）——组长，获刘俊明老师与 Pine AI CTO 李博杰老师特别表彰',
        'CleanRL 开源贡献 PR #535（2026.01）——改进 cleanrl_utils/buffers.py 张量重塑一致性处理',
      ],
    },
    skills: {
      title: '专业技能',
      items: [
        '系统开发：精通 Go / Python；熟悉 gRPC、Docker、并发编程；具备从架构设计到部署上线的全栈工程能力。',
        'AI 与 Agent：深入理解 Multi-Agent 通信协议、Tool Calling、RAG、MCP；具备大模型 SFT / RL 微调实战经验（Unsloth、AutoDL 多卡训练）。',
        '工程素养：注重代码 review 与测试，长期践行 Vibe Coding + 文档驱动 + 人工 review 的开发模式；具备开源协作与跨校团队管理经验。',
      ],
    },
    traits: {
      title: '个人特质',
      items: [
        '自驱型学习者：吉林大学鼎新图书馆打卡 800+ 次；完成强化学习 44 页手写笔记、机器学习 70 页手写及电子笔记；GitHub 过去一年 1.5k+ 次 commit。',
        '团队领导力：大学期间所有项目均担任队长 / 负责人，曾为跨校团队成员开展 Git 协作培训，规范 GitHub Flow 开发流程。',
        '抗压与解决问题能力：在科研探索中经历多次方向调整与失败实验，能够从中提炼方法论并持续改进。',
      ],
    },
    contact: {
      title: '联系方式',
      items: [
        '邮箱：zhouhy5523@mails.jlu.edu.cn',
        '手机：13223291973',
        'GitHub：github.com/ZHYsfl',
      ],
    },
  },
  en: {
    label: 'Resume',
    download: 'Download PDF',
    education: {
      title: 'Education',
      school:
        'Shanghai Jiao Tong University · School of AI · Direct PhD (AudioCC Lab / Prof. Zhang Wangyou)',
      school2:
        'Jilin University · Software College · Software Engineering, B.E. (Sep 2023 — Jun 2027 expected)',
      gpa: 'GPA 3.79 / 4.0, top 4.94% of major (18 / 364), CET-6 549.',
      math: 'Core courses: Machine Learning 96.4; Linear Algebra 98.1; College Physics 97.2; Algorithm Design & Analysis 94.5.',
      cs: 'Probability 94.8; Data Structures (machine exam) 100; Calculus avg. 91.8.',
      summary:
        'Direct PhD focus: voice agents and voice benchmark construction. Solid math foundation, reinforcement learning theory, and hands-on LLM SFT / RL multi-GPU fine-tuning experience.',
    },
    research: {
      title: 'Research & Projects',
      items: [
        {
          title: 'AudioCC Lab — Voice Agent Research',
          date: 'Aug 2026 — Present',
          sub: 'Admitted direct PhD student · Prof. Zhang Wangyou · SJTU School of AI · In progress',
          body: `Focusing on voice benchmark construction for interactive scenarios, evaluating the reasoning and understanding of voice LLMs / Omni models to lay the evaluation foundation for voice agent systems.<br />Building on AudioCC Lab's expertise in audio content computing to explore voice agents' perception, reasoning, and action in complex acoustic scenes.`,
        },
        {
          title: 'SCRIBE — Agentic RL Long-Horizon Training Paradigm',
          date: 'Apr — Aug 2026',
          sub: 'Research Assistant · Prof. Feng Erhu',
          body: `Proposed a <strong>ReAct + Reflect + Summarize</strong> three-stage explicit training paradigm for Agentic RL and Loop Engineering, letting agents accumulate reusable reflection and summarization abilities across long loops.<br />Designed <strong>Turn / Step / Token three-level credit assignment</strong>, decomposing GRPO trajectory-level advantages down to each generated token to address long-horizon credit assignment.<br />Built a <strong>13-dimension reward system</strong> (format correctness, summary fidelity, direction neutrality, token reuse rate, etc.) to suppress reward hacking and stabilize training signals.<br />Completed data format, history compression, and SFT / RL training pipeline design, supporting end-to-end experiments on real agent tasks.`,
        },
        {
          title: 'AgentGenesis — Agent Learning & Evaluation Platform',
          date: 'Feb 2026 — Present',
          sub: 'Lead · cross-university team (SDU / BNU / JLU / TYUT) · Open source · Published on PyPI',
          body: `Designed a <strong>three-level progressive evaluation protocol</strong> (L1 single-agent loop, L2 multi-agent orchestration in a shared sandbox, L3 cross-sandbox connection primitives) to unify single- / multi-agent evaluation standards.<br />Backend on <strong>Go + gRPC + Docker</strong> with OS-level multi-agent isolation, supporting <strong>22+ evaluation tasks</strong> with concurrent multi-checkpoint execution.<br />Adapter pattern decouples task APIs from the core runtime; adding a task only requires a new adapter, no changes to the scheduling engine.<br />Open-sourced with GitHub Flow for cross-university collaboration.`,
        },
        {
          title: 'EducationAgent — Voice Multi-Agent Real-Time Collaboration System',
          date: 'Mar — May 2026',
          sub: 'Lead · school practice course · Open source',
          body: `Independently designed a <strong>VoiceAgent + PPTAgent async collaboration architecture</strong> in Go for high-concurrency, low-latency real-time interaction.<br />Broke the fixed sequential execution paradigm with <strong>dynamic Observation / Thinking / Action orchestration</strong>, enabling "listen-while-thinking" streaming interaction.<br />Custom communication protocol for <strong>fully asynchronous dual-agent collaboration</strong>, improving real-time coordination between the voice and PPT agents.`,
        },
        {
          title: 'ToolCallingGo — Go Agent Tool Framework',
          date: 'Mar — Apr 2026',
          sub: 'Solo developer · Open source',
          body: `Built a lightweight Agent SDK for Go's weak agent toolchain (based on openai-go/v3).<br /><strong>Two-level parallelism</strong>: multi-tool parallel calls within one agent + session-level multi-agent parallelism (Batch / BatchRace).<br />Built-in cascade termination, error retry, and event-stream observability for complete debugging and monitoring support.`,
        },
        {
          title: 'Generative Reranking Algorithm Research',
          date: 'Sep 2025 — Jan 2026',
          body: `Pivoted from a math-modeling agent to an innovative <strong>pairwise-based generative reranking algorithm cluster</strong>.<br />Built the evaluation dataset independently; full SFT & RL fine-tuning on <strong>4×A800</strong> (AutoDL).<br />Systematic evaluation on BRIGHT Benchmark; identified inherent limitations through experiments and mathematical derivation — a complete research loop.`,
        },
      ],
    },
    honors: {
      title: 'Honors & Experience',
      items: [
        'National Third Prize, China College Students Service Outsourcing Innovation & Entrepreneurship Competition (Jun 2025) — team leader, Voice Agent, on-site defense in Qingdao',
        'Special recognition, Zhongguancun AI Agents Vibe Coding Hackathon (Jul 2025) — team leader, recognized by mentor Liu Junming and Pine AI CTO Li Bojie',
        'CleanRL open-source contribution PR #535 (Jan 2026) — improved tensor reshaping consistency in cleanrl_utils/buffers.py',
      ],
    },
    skills: {
      title: 'Skills & Engineering',
      items: [
        'Systems: proficient in Go / Python; familiar with gRPC, Docker, concurrency; full-stack capability from architecture design to deployment.',
        'AI & Agents: deep understanding of multi-agent communication protocols, tool calling, RAG, MCP; hands-on LLM SFT / RL fine-tuning (Unsloth, multi-GPU AutoDL).',
        'Engineering: code review and testing; long-term Vibe Coding + documentation-driven + human-review workflow; open-source collaboration and cross-university team management.',
      ],
    },
    traits: {
      title: 'Core Traits',
      items: [
        'Self-driven learner: 800+ check-ins at Jilin University Dingxin Library; 44 pages of handwritten RL notes, 70 pages of handwritten & digital ML notes; 1.5k+ GitHub commits in the past year.',
        'Team leadership: led every university project as captain / lead; trained cross-university teammates in Git collaboration and GitHub Flow.',
        'Resilience & problem solving: navigated multiple direction changes and failed experiments in research, distilling methodology and improving continuously.',
      ],
    },
    contact: {
      title: 'Contact',
      items: [
        'Email: zhouhy5523@mails.jlu.edu.cn',
        'Phone: +86 13223291973',
        'GitHub: github.com/ZHYsfl',
      ],
    },
  },
};

export function ResumeSection() {
  const [lang] = useLang();
  const t = copy[lang];

  return (
    <section className="mb-20">
      <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4 border-b border-border pb-4">
        <h2 className="font-serif text-2xl font-semibold text-fg">{t.label}</h2>
        <a
          href="/CV/个人简历.pdf"
          target="_blank"
          rel="noopener noreferrer"
          download
          className="text-sm font-medium text-accent transition-colors hover:underline"
        >
          {t.download}
        </a>
      </div>

      {/* magazine photo grid */}
      <div className="mb-14 grid grid-cols-12 gap-4 sm:gap-6">
        <div className="col-span-12 aspect-[4/3] overflow-hidden rounded-2xl sm:col-span-7 sm:row-span-2 sm:aspect-auto">
          <img
            src="/images/about/photo1.jpg"
            alt="Haoyang Zhou"
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>
        <div className="col-span-6 aspect-square overflow-hidden rounded-2xl sm:col-span-5">
          <img
            src="/images/about/photo2.jpg"
            alt="Haoyang Zhou"
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>
        <div className="col-span-6 aspect-square overflow-hidden rounded-2xl sm:col-span-5">
          <img
            src="/images/about/photo3.jpg"
            alt="Haoyang Zhou"
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>
      </div>

      <div className="space-y-16">
        {/* education */}
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <h3 className="mb-4 font-serif text-xl font-semibold text-fg">{t.education.title}</h3>
          <div className="space-y-2 leading-relaxed text-muted">
            <p className="text-fg">{t.education.school}</p>
            <p className="text-fg">{t.education.school2}</p>
            <p>{t.education.gpa}</p>
            <p>{t.education.math}</p>
            <p>{t.education.cs}</p>
            <p>{t.education.summary}</p>
          </div>
        </div>

        {/* research timeline */}
        <div>
          <h3 className="mb-6 font-serif text-xl font-semibold text-fg">{t.research.title}</h3>
          <div className="relative space-y-10 border-l border-border pl-6">
            {t.research.items.map((item, i) => (
              <div key={i} className="relative">
                <span className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent ring-4 ring-bg"></span>
                {item.title && <p className="mb-1 font-medium text-fg">{item.title}</p>}
                <p className="mb-1 text-sm font-medium text-accent">{item.date}</p>
                {item.sub && <p className="mb-2 text-sm italic text-muted">{item.sub}</p>}
                <p
                  className="leading-relaxed text-muted"
                  dangerouslySetInnerHTML={{ __html: item.body }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* honors / skills / traits / contact */}
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <div className="space-y-10">
            <div>
              <h3 className="mb-4 font-serif text-xl font-semibold text-fg">{t.honors.title}</h3>
              <ul className="space-y-3 text-muted">
                {t.honors.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-serif text-xl font-semibold text-fg">{t.traits.title}</h3>
              <ul className="space-y-3 text-muted">
                {t.traits.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-10">
            <div>
              <h3 className="mb-4 font-serif text-xl font-semibold text-fg">{t.skills.title}</h3>
              <ul className="space-y-3 text-muted">
                {t.skills.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-serif text-xl font-semibold text-fg">{t.contact.title}</h3>
              <ul className="space-y-2 text-muted">
                {t.contact.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
