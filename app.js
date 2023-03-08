
window.addEventListener("keydown", (e) => {
  if (e.key == "Enter" && (e.ctrlKey || e.altKey)) {
    e.preventDefault()
    onSend()
  }
  if (e.key === "Escape") {
    showSettings(false)
    showHistory(false)
  }
}, { passive: false })

function onSend() {
  var value = (line.value || line.innerText).trim()

  if (!value) return

  addItem("user", value)
  postLine(value)

  line.value = ""
  line.innerText = ""
}

function addItem(type, content) {
  let request = document.createElement("div")
  request.className = type
  request.innerText = content
  box.appendChild(request)

  window.scrollTo({
    top: document.body.scrollHeight, behavior: "auto",
  })
  line.focus()
}

function postLine(line) {
  saveConv({ role: "user", content: line })
  if (config.isGpt3_5) {
    chat()
  } else {
    completions()
  }
}

var convId;
var messages = [];
function chat() {
  send(`${config.domain}/v1/chat/completions`, {
    "model": "gpt-3.5-turbo",
    "messages": messages,
    "max_tokens": config.maxTokens,
  }, (data) => {
    let msg = data.choices[0].message
    saveConv(msg)
    addItem("assistant", msg.content)
  })
}
function completions() {
  let _prompt = ""
  messages.forEach(msg => {
    _prompt += `${msg.role}: ${msg.content}\n`
  });
  _prompt += "assistant: "
  send(`${config.domain}/v1/completions`, {
    "model": "text-davinci-003",
    "prompt": _prompt,
    "max_tokens": config.maxTokens,
    "temperature": 0,
    "stop": ["\nuser: ", "\nassistant: "],
  }, (data) => {
    let msg = { role: "assistant", content: data.choices[0].text }
    saveConv(msg)
    addItem("assistant", msg.content)
  })
}
function send(reqUrl, body, scussionCall) {
  loader.hidden = false
  fetch(reqUrl, {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + config.apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).then((resp) => {
    return resp.json()
  }).then((data) => {
    loader.hidden = true
    if (data.error) {
      throw new Error(`${data.error.code}: ${data.error.message}`)
    }
    scussionCall(data)
  }).catch((e) => {
    loader.hidden = true
    if (e.message === 'Failed to fetch') {
      addItem("system", `Unable to access OpenAI, please check your network.`)
    } else {
      addItem("system", `${e.message}`)
    }
  })
}

function reset() {
  box.innerHTML = ''
  convId = uuidv4();
  messages = [config.firstPrompt]
  addItem(config.firstPrompt.role, config.firstPrompt.content)
}

const convKey = "conversations_"
function saveConv(message) {
  messages.push(message)
  localStorage.setItem(`${convKey}${convId}`, JSON.stringify(messages))
}

function switchConv(key) {
  if (key == null) {
    addItem("system", "No conversations")
    return
  }
  box.innerHTML = ''
  messages = JSON.parse(localStorage.getItem(key))
  messages.forEach(msg => {
    addItem(msg.role, msg.content)
  });
  convId = key.substring(convKey.length);
}

function showHistory(ok = true) {
  if (ok) {
    historyModal.style.display = ''
    historyList.innerHTML = ''
    for (let index = 0; index < localStorage.length; index++) {
      let key = localStorage.key(index);
      if (key.substring(0, convKey.length) != convKey) { continue }
      let itemJson = localStorage.getItem(key)
      let itemData;
      try {
        itemData = JSON.parse(itemJson)
      } catch (error) {
        continue
      }
      historyList.innerHTML += `<div class="history-item" onclick='switchConv("${key}"); showHistory(false);'>
          <div>SYST: ${itemData[0].content}</div>
          <div>USER: ${itemData[1].content} (${itemData.length}+)</div></div>`
    }
    if (0 == localStorage.length) {
      historyList.innerHTML = `<h4>There are no past conversations yet.</h4>`
    } else {
    }
  } else {
    historyModal.style.display = 'none'
  }
}

function showSettings(ok = true) {
  if (ok) {
    settingsModal.style.display = ''
  } else {
    settingsModal.style.display = 'none'
  }
}

var config = {
  domain: "",
  apiKey: "",
  maxTokens: 500,
  isGpt3_5: true,
  firstPrompt: null,
}
function saveSettings() {
  if (!apiKeyInput.value) {
    alert('OpenAI API key can not empty')
    return
  }
  config.domain = domainInput.value || config.domain
  config.apiKey = apiKeyInput.value || config.apiKey
  config.maxTokens = parseInt(maxTokensInput.value) || config.maxTokens
  config.isGpt3_5 = isGpt3_5.checked || config.isGpt3_5
  if (systemPromptInput.value) {
    config.firstPrompt = { role: "system", content: systemPromptInput.value }
  }
  messages[0] = config.firstPrompt
  localStorage.setItem("conversation_config", JSON.stringify(config))
  showSettings(false)
  addItem('system', 'Update successed')
}
function init() {
  let configJson = localStorage.getItem("conversation_config")
  let _config = JSON.parse(configJson)
  if (_config) {
    config = _config
  } else {
    showSettings(true)
  }
  domainInput.placeholder = "https://api.openai.com"
  maxTokensInput.placeholder = config.maxTokens
  systemPromptInput.placeholder = "You are a helpful assistant."

  apiKeyInput.value = config.apiKey

  if (!config.domain) {
    config.domain = domainInput.placeholder
  } else {
    domainInput.value = config.domain
  }
  if (!config.maxTokens) {
    config.maxTokens = parseInt(maxTokensInput.placeholder)
  } else {
    maxTokensInput.value = config.maxTokens
  }
  isGpt3_5.checked = config.isGpt3_5
  if (!config.firstPrompt) {
    config.firstPrompt = { role: "system", content: systemPromptInput.placeholder }
  } else {
    systemPromptInput.value = config.firstPrompt.content
  }

  reset()
}

window.scrollTo(0, document.body.clientHeight)
init()