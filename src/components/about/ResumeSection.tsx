import { useLang } from '@/lib/useLang';

const copy = {
  zh: {
    label: '简历',
    download: '下载 PDF',
    education: {
      title: '教育背景',
      school: '吉林大学软件学院 · 2023 级本科生（大三）',
      gpa: '绩点 3.79/4，专业排名前 5%，英语六级 549 分。',
      math: '数理基础：线性代数 98.1、微积分三学期均分 91.8、概率论 94.8、大学物理 97.2。',
      cs: '算法与理论：算法设计与分析 94.5、数据结构期末 91 / 机考 100、机器学习 96.4。',
      summary: '具备扎实的数理基础、强化学习理论，以及大模型 SFT/RL 多卡微调实践经验。',
    },
    research: {
      title: '科研与项目经历',
      items: [
        {
          date: '2025.03 — 2025.06',
          body: `作为队长带领团队参加<strong>中国大学生服务外包创新创业大赛</strong>，做 Voice Agent 方向，赴青岛现场答辩，获得<strong>国家级三等奖</strong>。`,
        },
        {
          date: '2025.07',
          body: `自学 React、MCP、A2A、RAG 等技术，智能体学习笔记接近 <strong>500 页</strong>，为后续多智能体系统开发打下基础。`,
        },
        {
          date: '2025.08',
          body: `担任组长参加<strong>中关村 AI Agents vibe coding 黑客松线下训练营</strong>，5 天内探索 Voice Agent 与 computer use agent 的实时交互机制，项目因团队管理与答辩展示获训练营导师刘俊明老师和 Pine AI CTO 李博杰老师的<strong>特别表彰</strong>。`,
        },
        {
          date: '2025.09 — 2026.01',
          body: `<strong>强化学习与 Agentic RL</strong>：系统学习 DQN、PPO、GRPO 等算法，深入研读 CleanRL 项目的 DQN / PPO 源码，并基于 Python "显式优于隐式" 的哲学向 CleanRL 提交 PR（#535），优化张量重塑的一致性处理。这段经历建立了"通过阅读优秀源码快速掌握前沿算法"的科研学习方法论。`,
        },
        {
          date: '2025.09 — 2026.01',
          body: `<strong>生成式重排序算法簇</strong>：本想做一个数学建模自进化 Agent，在设计自进化机制时创新了一套基于 pairwise 的生成式重排序算法簇。与团队在本校王琪老师指导下，自行构建数据集，在 AutoDL 上投入近万元，用 4 张 A800 进行 SFT 与 RL 微调。虽然最终在 BRIGHT Benchmark 上效果未达预期，但通过数学推导发现算法存在固有局限，这让我深刻认识到：做科研需要严谨的数学理论验证，也要充分调研。`,
        },
        {
          date: '2026.02 — 至今',
          body: `组建跨校团队（山东大学、北京师范大学、吉林大学、太原理工大学）开发<strong>AgentGenesis</strong>——一个智能体学习与评测平台。平台支持单 Agent / 多 Agent 实时交互评测，设计了三层渐进式评测协议，基于 gRPC 与 Docker 实现 OS 级多 Agent 隔离评测。项目已开源：<a href="https://github.com/ZHYsfl/AgentGenesis" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">GitHub</a>。在这个过程中，我逐渐形成对 Agent 机制的理解：LLM 驱动的 Agent 本质是强化学习，即 LLM 与 Environment 的交互；多 Agent 协同本质是每个 Agent 环境的交互（上下文工程）。`,
        },
        {
          date: '2026.03 — 2026.05',
          body: `<strong>EducationAgent</strong>：学院实践课项目，带领同学做了一个 VoiceAgent + PPTAgent 异步协作运行的系统，用户只需说话即可完成 PPT 制作与实时修改。选型 Go 语言，实现 InteractiveReact、observation / thinking / action 顺序动态调整，做到人与 VoiceAgent 的低延迟交互与边听边想、边想边说。项目地址：<a href="https://github.com/ZHYsfl/EducationAgent" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">GitHub</a>。`,
        },
        {
          date: '2026.03 — 2026.04',
          body: `<strong>ToolCallingGo</strong>：为团队写了一个 Go 语言的轻量级 Agent 框架，支持多 Agent 并行与工具调用并行的双层并行机制，包含错误重试与并行工具调用的级联终止机制。项目地址：<a href="https://github.com/ZHYsfl/tool-calling-go" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">GitHub</a>。`,
        },
      ],
    },
    honors: {
      title: '荣誉与经历',
      items: [
        '中国大学生服务外包创新创业大赛国家级三等奖（队长）',
        '中关村 AI Agents vibe coding 黑客松训练营特别表彰（组长）',
        'CleanRL 开源项目贡献 PR #535：优化张量重塑一致性处理',
      ],
    },
    skills: {
      title: '技能与工程能力',
      items: [
        'Python / Go 全栈开发，熟悉 Agent 系统、高并发架构与通信协议设计。',
        '强化学习（DQN / PPO / GRPO）、LLM SFT/RL 微调、多卡训练与数据集构建。',
        '重视代码 review、测试与工程规范；GitHub 过去一年 1000+ 次 commit。',
        '能独立完成从架构设计到部署上线的完整流程，具备跨校团队管理经验。',
      ],
    },
    traits: {
      title: '核心特质',
      items: [
        '崇尚努力至上，本科两年半在吉林大学鼎新图书馆学习 800 余次。',
        '习惯从失败实验中反思总结，持续改进研究方法与 research taste。',
        '性格开朗、沟通能力强，认为科研既是脑力劳动，也需要高质量的社交反馈。',
        '抗压能力好，愿意面对有挑战性的问题，把挫折当作成长机会。',
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
      school: 'Jilin University, Software College · Class of 2023 (Junior)',
      gpa: 'GPA 3.79/4, top 5% of major, CET-6 549.',
      math: 'Math & Physics: Linear Algebra 98.1, Calculus avg. 91.8, Probability 94.8, College Physics 97.2.',
      cs: 'Algorithms & Theory: Algorithm Design & Analysis 94.5, Data Structures final 91 / lab 100, Machine Learning 96.4.',
      summary:
        'Solid foundation in mathematics, reinforcement learning theory, and hands-on LLM SFT/RL multi-GPU fine-tuning.',
    },
    research: {
      title: 'Research & Projects',
      items: [
        {
          date: 'Mar — Jun 2025',
          body: `Led a team in the <strong>China College Students Service Outsourcing Innovation & Entrepreneurship Competition</strong> on Voice Agent, won <strong>National Third Prize</strong> after on-site defense in Qingdao.`,
        },
        {
          date: 'Jul 2025',
          body: `Self-studied React, MCP, A2A, and RAG; compiled nearly <strong>500 pages</strong> of agent notes, laying the groundwork for later multi-agent systems.`,
        },
        {
          date: 'Aug 2025',
          body: `Led a team at the <strong>Zhongguancun AI Agents vibe coding hackathon training camp</strong>. In five days we explored real-time interaction between Voice Agent and computer-use agent. The project received <strong>special recognition</strong> from mentor Liu Junming and Pine AI CTO Li Bojie for team management and presentation.`,
        },
        {
          date: 'Sep 2025 — Jan 2026',
          body: `<strong>Reinforcement Learning & Agentic RL</strong>: studied DQN, PPO, and GRPO in depth, read CleanRL's DQN/PPO source code, and contributed PR #535 to CleanRL optimizing tensor reshaping consistency. This established my research methodology: mastering frontier algorithms by reading high-quality source code.`,
        },
        {
          date: 'Sep 2025 — Jan 2026',
          body: `<strong>Generative reranking algorithm cluster</strong>: while trying to build a self-evolving math-modeling agent, I designed a pairwise-based generative reranking algorithm cluster. Under Prof. Wang Qi's guidance, my team built a dataset from scratch and spent nearly 10,000 RMB on AutoDL to SFT/RL fine-tune on 4×A800 GPUs. The final BRIGHT Benchmark results were underwhelming, but mathematical analysis revealed inherent limitations. This taught me that rigorous theoretical validation and thorough literature review are essential in research.`,
        },
        {
          date: 'Feb 2026 — Present',
          body: `Built a cross-university team (Shandong University, Beijing Normal University, Jilin University, Taiyuan University of Technology) to develop <strong>AgentGenesis</strong>, an agent learning & evaluation platform supporting single-agent and multi-agent real-time evaluation, a three-level progressive evaluation protocol, and OS-level isolated evaluation via gRPC and Docker. Open source: <a href="https://github.com/ZHYsfl/AgentGenesis" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">GitHub</a>. Through this work I came to see LLM-driven agents as reinforcement learning: an LLM interacting with an environment, where multi-agent collaboration is essentially context engineering across environments.`,
        },
        {
          date: 'Mar — May 2026',
          body: `<strong>EducationAgent</strong>: a course project where I led classmates to build a VoiceAgent + PPTAgent async collaboration system. Users can create and edit PPTs by voice. We chose Go for its concurrency model, implemented InteractiveReact, dynamic observation / thinking / action ordering, and low-latency interaction with listen-think-speak. Project: <a href="https://github.com/ZHYsfl/EducationAgent" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">GitHub</a>.`,
        },
        {
          date: 'Mar — Apr 2026',
          body: `<strong>ToolCallingGo</strong>: a lightweight Go agent framework I wrote for the team, supporting two-level parallelism (multi-agent + multi-tool), error retry, and cascade termination for parallel tool calls. Project: <a href="https://github.com/ZHYsfl/tool-calling-go" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">GitHub</a>.`,
        },
      ],
    },
    honors: {
      title: 'Honors & Experience',
      items: [
        'National Third Prize, China College Students Service Outsourcing Innovation & Entrepreneurship Competition (team leader)',
        'Special recognition, Zhongguancun AI Agents vibe coding hackathon training camp (team leader)',
        'CleanRL open-source contribution PR #535: tensor reshaping consistency optimization',
      ],
    },
    skills: {
      title: 'Skills & Engineering',
      items: [
        'Python / Go full-stack development; agent systems, concurrency, and protocol design.',
        'Reinforcement learning (DQN / PPO / GRPO), LLM SFT/RL fine-tuning, multi-GPU training, and dataset construction.',
        'Strong focus on code review, testing, and engineering discipline; 1,000+ GitHub commits in the past year.',
        'Able to take projects from architecture to deployment; experienced in cross-university team management.',
      ],
    },
    traits: {
      title: 'Core Traits',
      items: [
        'Believes in hard work: studied at Jilin University Dingxin Library more than 800 times in two and a half years.',
        'Reflects on failed experiments to refine methodology and research taste.',
        'Outgoing and communicative; sees research as both intellectual work and a social activity requiring feedback.',
        'Resilient under pressure; treats setbacks as opportunities to grow.',
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
                <p className="mb-2 text-sm font-medium text-accent">{item.date}</p>
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
