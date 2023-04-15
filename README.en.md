[中文](README.md) | [English](README.en.md)

# chatgpt

Build your OpenAI ChatGPT web site.

The voice recognition function defaults to using local voice recognition mode. When local voice recognition fails, it will automatically switch to using `OpenAI Whisper` for recognition. It can also be set to use `Only use Whisper` for recognition.

Note: Due to the Android system's characteristics, Android phone users cannot perform local voice recognition and recording services at the same time. Therefore, mobile phone users should enable `Only use Whisper` mode.

- Custom OpenAI domain name, direct connection, no need to worry about key leakage;
- Your own API Key;
- All data is stored locally;
- Model selection;
- Assistant prompt can be set;
- Multiple prompts are pre-installed;
- Session history record (local storage);
- Support for setting the `temperature` parameter;
- Support for "sse", which is the `stream` in the OpenAI API;
- Support for automatic text playback (TTS);
- Support for voice input (ASR).
- Support for `OpenAI Whisper` recognition (default using local voice recognition)

More people are welcome to improve this [prompt list](https://github.com/excing/chatgpt/blob/main/prompts.json).

## Deployment

Fork this project and then enable your GitHub Pages.