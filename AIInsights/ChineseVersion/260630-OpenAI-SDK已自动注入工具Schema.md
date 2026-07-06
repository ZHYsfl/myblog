使用 LLM 的 OpenAI SDK 的时候，是否需要在系统提示词里大张旗鼓详细介绍工具的名称，参数等一系列配置，甚至把整个 tool 的 JSON Schema 全部打字显式放进 system prompt？答案是不用。

这并不是说 system prompt 里没有 tool 的 JSON Schema，而是，OpenAI SDK 在我们使用 create 方法传入 tools 的时候就已经自动帮我们把 tools 的 JSON Schema append 到 system prompt 了，所以系统提示词最多只是自然语言介绍一下（甚至，完全不介绍也可以，JSON Schema 的 description 够用了）即可。

如果不是深入理解这个 SDK 底层的机制，很可能你的 token 总会在 tool 这里啰嗦而导致浪费。

当然，不用 OpenAI SDK 或者 OpenAI Chat Completions API，那就是另行分析了。不同的框架，不同的行为。但归根结底，多看看 chat template，多做做临时小实验，总能保证上下文的正确性。

上下文的正确性在 use LLM 的时候其实没那么致命，因为 LLM 有强大的处理能力，但训练的时候，任何一处隐藏的细节被忽略，就会万劫不复。
