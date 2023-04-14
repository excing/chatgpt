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

省流版：创建一个 Cloudflare Workers，编写内容并发布：

<details><summary>Worker JS</summary>

其中 `<your openai api key>` 填写你的 OpenAI api key 即可实现客户端无 key 使用。

```js
addEventListener('fetch', event => {
    event.respondWith(fetchAndApply(event.request));
})

async function fetchAndApply(request) {

    let response = null;
    let method = request.method;

    let url = new URL(request.url);
    let url_hostname = url.hostname;
    url.protocol = 'https:';
    url.host = 'api.openai.com';

    let request_headers = request.headers;
    let new_request_headers = new Headers(request_headers);
    new_request_headers.set('Host', url.host);
    new_request_headers.set('Referer', url.protocol + '//' + url_hostname);
    new_request_headers.set('Authorization', 'Bearer <your openai api key>');

    let original_response = await fetch(url.href, {
        method: method,
        headers: new_request_headers,
        body: request.body
    })

    // let original_response_clone = original_response.clone();
    let original_text = null;
    let response_headers = original_response.headers;
    let new_response_headers = new Headers(response_headers);
    let status = original_response.status;

    new_response_headers.set('Cache-Control', 'no-store');
    new_response_headers.set('access-control-allow-origin', '*');
    new_response_headers.set('access-control-allow-credentials', true);
    new_response_headers.delete('content-security-policy');
    new_response_headers.delete('content-security-policy-report-only');
    new_response_headers.delete('clear-site-data');

    original_text = original_response.body
    response = new Response(original_text, {
        status,
        headers: new_response_headers
    })

    return response
}

async function replace_response_text(response, upstream_domain, host_name) {
    let text = await response.text()

    var i, j;
    for (i in replace_dict) {
        j = replace_dict[i]
        if (i == '$upstream') {
            i = upstream_domain
        } else if (i == '$custom_domain') {
            i = host_name
        }

        if (j == '$upstream') {
            j = upstream_domain
        } else if (j == '$custom_domain') {
            j = host_name
        }

        let re = new RegExp(i, 'g')
        text = text.replace(re, j);
    }
    return text;
}
```
</details>
