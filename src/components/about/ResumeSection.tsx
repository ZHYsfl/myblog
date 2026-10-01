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
      summary: '直博方向：语音智能体。',
    },
    research: {
      title: '科研与项目经历',
      items: [
        {
          title: 'AudioCC Lab —— 语音智能体与 Benchmark 研究',
          date: '2026.08 — 至今',
          sub: '拟录取直博生 · 张王优老师 · 上海交通大学人工智能学院 · 进行中',
          body: `聚焦语音智能体的评测问题：构建交互场景语音 Benchmark，评估语音 LLM / Omni 大模型的推理与理解能力。`,
        },
        {
          title: 'VoxFlow —— 语音多智能体交互系统',
          date: '2026.03 — 至今',
          sub: 'AudioCC Lab · 负责人 · 独立提出并完成 · 因学术保密已闭源',
          link: { label: 'GitHub', url: 'https://github.com/ZHYsfl/VoxFlow' },
          body: `定义问题：多智能体系统中 Agent 数量增长带来的交互入口碎片化——每个 Agent 各需一个界面，与人自然习惯的语音通道相矛盾。<br />提出 <strong>单语音入口 + 多 Agent 总线</strong>架构，将多 Agent 协作的交互复杂度收敛至单一语音通道；新增 Agent 仅需注册三件套，系统交互能力随 Agent 注册持续扩展。<br />提出 <strong>"边听边想边做"</strong>的流式交互机制，支持中英文混说与播放中途打断（barge-in），打通本地全链路语音识别与合成，实现低延迟连续语音交互。<br />以课件制作为首任务闭环验证：纯语音完成需求澄清、初稿生成与多轮修改，预览随改随更新。`,
        },
        {
          title: 'SCRIBE —— Agentic RL 长循环训练范式研究',
          date: '2026.04 — 2026.08',
          sub: '研究助理 · 冯二虎老师',
          body: `定义问题：长循环 Agentic RL 中，轨迹级 GRPO 优势无法归因到单个决策与生成 token，长程任务训练信号稀薄。<br />提出 <strong>ReAct + Reflect + Summarize 三阶段显式训练范式</strong>，设计 <strong>Turn / Step / Token 三级信用分配</strong>机制，将轨迹级优势逐层分解至每个生成 token。<br />构建 <strong>13 维多维度奖励体系</strong>（格式正确性、摘要忠实度、方向中立性、token 复用率等），抑制 reward hacking 并稳定训练信号。<br />完成数据格式、历史压缩与 SFT / RL 训练 pipeline 设计，支撑真实 Agent 任务端到端训练，Agent 在多轮循环中收敛稳定并沉淀可复用的反思与总结能力。`,
        },
        {
          title: 'AgentGenesis —— 智能体评测协议与平台',
          date: '2026.02 — 至今',
          sub: '负责人 · 跨校团队（山大 / 北师大 / 吉大 / 太原理工）· 开源 · 已上线 PyPI',
          link: { label: 'GitHub', url: 'https://github.com/ZHYsfl/AgentGenesis' },
          body: `定义问题：智能体评测环境碎片化、协议不统一，跨工作的评测结果不可比。<br />提出 <strong>三层渐进式评测协议</strong>（L1 单 Agent 循环、L2 同沙箱多 Agent 编排、L3 跨沙箱连接原语），统一单 / 多 Agent 评测标准；平台支撑 <strong>22+ 评测任务</strong>并发执行，开源并上线 PyPI。`,
        },
        {
          title: '生成式重排序算法研究',
          date: '2025.09 — 2026.01',
          body: `定义问题：生成式重排序在推理密集型检索任务上的能力边界缺乏系统性验证。<br />提出基于 <strong>Pairwise 的生成式重排序算法簇</strong>，独立构建评测数据集，在 AutoDL <strong>4×A800</strong> 上完成 SFT 与 RL 全流程微调。<br />在 BRIGHT Benchmark 上完成系统评测，通过实验与数学推导发现算法固有局限，形成"假设—验证—结论"的完整科研闭环。`,
        },
      ],
    },
    honors: {
      title: '竞赛与荣誉',
      items: [
        '中国大学生服务外包创新创业大赛 · 全国三等奖（2025.06）——队长，Voice Agent 方向，赴青岛现场答辩',
        '中关村 AI Agents Vibe Coding 黑客松 · 特别表彰（2025.07）——组长，获刘俊明老师与 Pine AI 前首席科学家李博杰老师特别表彰',
        'CleanRL 开源贡献 PR #535（2026.01）——改进 cleanrl_utils/buffers.py 张量重塑一致性处理',
      ],
    },
    skills: {
      title: '专业技能',
      items: [
        '研究能力：完整的科研闭环经验——问题定义、方法创新、评测构建与实验分析；具备大模型 SFT / RL 训练实战经验。',
        '研究方向：语音智能体、Agentic RL、多智能体系统与人机语音交互。',
        '理论基础：扎实的数理基础与强化学习理论；兼具将研究想法快速验证落地的实现能力。',
      ],
    },
    traits: {
      title: '个人特质',
      items: [
        '研究自驱：独立完成多个从问题定义到实验验证的完整科研闭环；完成强化学习 44 页手写笔记，GitHub 过去一年 1.7k+ 次 commit。',
        '团队领导力：大学期间所有项目均担任队长 / 负责人，主导跨校团队协作、代码评审与开发流程规范。',
        '抗压与迭代：在多次科研方向调整与失败实验中提炼方法论并持续改进。',
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
      summary: 'Direct PhD focus: voice agents.',
    },
    research: {
      title: 'Research & Projects',
      items: [
        {
          title: 'AudioCC Lab — Voice Agents & Benchmark Research',
          date: 'Aug 2026 — Present',
          sub: 'Admitted direct PhD student · Prof. Zhang Wangyou · SJTU School of AI · In progress',
          body: `Focusing on the evaluation problem of voice agents: constructing an interactive-scenario voice benchmark to assess the reasoning and understanding of voice LLMs / Omni models.`,
        },
        {
          title: 'VoxFlow — Voice Multi-Agent Interaction System',
          date: 'Mar 2026 — Present',
          sub: 'AudioCC Lab · Lead · independently conceived and built · Closed source for academic confidentiality',
          link: { label: 'GitHub', url: 'https://github.com/ZHYsfl/VoxFlow' },
          body: `Formulated the problem: interaction entries fragment as agents multiply — each agent demands its own screen, conflicting with the natural human habit of conversation.<br />Proposed a <strong>single-voice-entry + multi-agent bus</strong> architecture that converges interaction complexity onto one voice channel; registering a new agent takes only three pieces, so system capability grows as agents are added.<br />Proposed a <strong>"listen-while-thinking"</strong> streaming mechanism with code-mixed Chinese-English speech and mid-playback <strong>barge-in</strong>, backed by a local full-stack ASR/TTS pipeline for low-latency continuous voice interaction.<br />Validated with a PPT-authoring task loop: requirement clarification, draft generation, and multi-round revision completed by voice alone, with preview updating as changes are made.`,
        },
        {
          title: 'SCRIBE — Agentic RL Long-Horizon Training Paradigm',
          date: 'Apr — Aug 2026',
          sub: 'Research Assistant · Prof. Feng Erhu',
          body: `Formulated the problem: in long-horizon Agentic RL, trajectory-level GRPO advantage cannot be attributed to individual decisions or generated tokens, leaving long-horizon training signals sparse.<br />Proposed a <strong>ReAct + Reflect + Summarize three-stage explicit training paradigm</strong> with <strong>Turn / Step / Token three-level credit assignment</strong>, decomposing trajectory-level advantages down to each generated token.<br />Built a <strong>13-dimension reward system</strong> (format correctness, summary fidelity, direction neutrality, token reuse rate, etc.) to suppress reward hacking and stabilize training signals.<br />Designed the data format, history compression, and SFT / RL pipeline, supporting end-to-end training on real agent tasks; agents converge stably and accumulate reusable reflection and summarization across loops.`,
        },
        {
          title: 'AgentGenesis — Agent Evaluation Protocol & Platform',
          date: 'Feb 2026 — Present',
          sub: 'Lead · cross-university team (SDU / BNU / JLU / TYUT) · Open source · Published on PyPI',
          link: { label: 'GitHub', url: 'https://github.com/ZHYsfl/AgentGenesis' },
          body: `Formulated the problem: fragmented agent evaluation environments and inconsistent protocols make results across works incomparable.<br />Proposed a <strong>three-level progressive evaluation protocol</strong> (L1 single-agent loop, L2 in-sandbox multi-agent orchestration, L3 cross-sandbox connection primitives), unifying single- and multi-agent evaluation standards; the platform runs <strong>22+ evaluation tasks</strong> concurrently, open-sourced and published on PyPI.`,
        },
        {
          title: 'Generative Reranking Algorithm Research',
          date: 'Sep 2025 — Jan 2026',
          body: `Formulated the problem: the capability boundary of generative rerankers on reasoning-intensive retrieval tasks lacked systematic verification.<br />Proposed a <strong>pairwise-based generative reranking algorithm cluster</strong>; built the evaluation dataset independently and completed full SFT & RL fine-tuning on <strong>4×A800</strong> (AutoDL).<br />Systematic evaluation on the BRIGHT Benchmark; identified inherent limitations through experiments and mathematical derivation — a complete hypothesis-verify-conclude research loop.`,
        },
      ],
    },
    honors: {
      title: 'Honors & Experience',
      items: [
        'National Third Prize, China College Students Service Outsourcing Innovation & Entrepreneurship Competition (Jun 2025) — team leader, Voice Agent, on-site defense in Qingdao',
        'Special recognition, Zhongguancun AI Agents Vibe Coding Hackathon (Jul 2025) — team leader, recognized by mentor Liu Junming and Pine AI former Chief Scientist Li Bojie',
        'CleanRL open-source contribution PR #535 (Jan 2026) — improved tensor reshaping consistency in cleanrl_utils/buffers.py',
      ],
    },
    skills: {
      title: 'Skills',
      items: [
        'Research: full research-loop experience — problem formulation, method innovation, benchmark construction, and experiment analysis; hands-on LLM SFT / RL training.',
        'Focus: voice agents, Agentic RL, multi-agent systems, and human-agent voice interaction.',
        'Theory: solid mathematical foundation and reinforcement learning theory, plus the ability to validate research ideas quickly.',
      ],
    },
    traits: {
      title: 'Core Traits',
      items: [
        'Research-driven: independently completed multiple research loops from problem formulation to experimental validation; 44 pages of handwritten RL notes; 1.7k+ GitHub commits in the past year.',
        'Team leadership: led every university project as captain / lead; directed cross-university collaboration, code review, and development workflow.',
        'Resilience: distilled methodology from multiple direction changes and failed experiments, iterating continuously.',
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
                {item.title && (
                  <p className="mb-1 font-medium text-fg">
                    {item.title}
                    {'link' in item && item.link && (
                      <a
                        href={item.link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-xs font-normal text-accent hover:underline"
                      >
                        {item.link.label} ↗
                      </a>
                    )}
                  </p>
                )}
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
