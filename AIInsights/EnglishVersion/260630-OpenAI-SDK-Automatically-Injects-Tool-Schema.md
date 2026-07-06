# OpenAI SDK Automatically Injects Tool Schema

When using the OpenAI SDK for LLM calls, do you need to write a long system prompt describing the tool name, parameters, and configuration in detail, or even paste the entire tool JSON Schema explicitly into the system prompt? The answer is no.

This doesn't mean the system prompt has no tool JSON Schema. Instead, the OpenAI SDK automatically appends the JSON Schema of the tools we pass to the `create` method to the system prompt. So the system prompt only needs a natural-language description at most (or even none at all, since the JSON Schema's own `description` is usually enough).

Without a deep understanding of the SDK's underlying mechanism, you may keep wasting tokens on verbose tool descriptions.

Of course, if you're not using the OpenAI SDK or the OpenAI Chat Completions API, the behavior may differ. Different frameworks have different implementations. But in the end, looking closely at chat templates and running small ad-hoc experiments will always help ensure the correctness of the context.

Context correctness is not fatal when using LLMs, because LLMs have strong processing capabilities. But during training, overlooking any hidden detail can be disastrous.
