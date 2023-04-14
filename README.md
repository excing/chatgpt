[中文](README.md) | [English](README.en.md)

# chatgpt
构建你的 OpenAI ChatGPT Web 站点

语音识别功能，默认使用本地语音识别模式，当本地语音识别失败，会自动使用 `OpenAI Whisper` 开始识别，也可以设置为 `仅使用 Wishper` 进行识别。

> 注：由于 Android 手机用户无法同时进行本地语音识别和录音服务（和 Android 系统特性有关），所以手机用户请开启 `仅使用 Wishper` 模式。

- 自定义 OpenAI 域名，直连，不经过他人服务器，无需担心 Key 泄露；
- 自己的 API Key；
- 所有数据都在本地存储；
- 模型选择；
- 可设置助手 `prompt`；
- 预置多个 `prompt`；
- 会话历史记录（本地存储）；
- 支持设置 `temperature` 参数；
- 支持 `sse`，即 openai api 中的 `stream`；
- 支持自动播放文本（TTS）；
- 支持语音录入（ASR）。
- 支持 `OpenAI Whisper` 识别（默认使用本地语音识别）

欢迎更多人来完善这个 [prompt list](https://github.com/excing/chatgpt/blob/main/prompts.json)。

## 部署

Fork 此项目，然后开启你的 GitHub Pages 即可。

如果你的 OpenAI 不可访问，可以尝试使用这个方案：[使用 Cloudflare Workers 让 OpenAI API 绕过 GFW 且避免被封禁](https://github.com/noobnooc/noobnooc/discussions/9)
