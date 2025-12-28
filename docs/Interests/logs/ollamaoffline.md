下载https://bgithub.xyz/ollama/ollama/releases/download/v0.13.5/ollama-linux-amd64.tgz

预览

```
tar -tzf ollama-linux-amd64.tgz
```



解压

```
mkdir /usr/local/ollama
```

```
sudo tar -C /usr/local/ollama -xzf ollama-linux-amd64.tgz
```

```
nano ~/.bashrc
export PATH="/usr/local/ollama/bin:$PATH"
source ~/.bashrc
```



```
nohup ollama serve > ollama.logs 2>&1 &
```



默认目录在

```
～/.ollama
```



Modelfile

```
# Modelfile
FROM "./Qwen3VL-2B-Instruct-Q4_K_M.gguf"
# set the temperature to 1 [higher is more creative, lower is more coherent]
# PARAMETER temperature 1
# 许多聊天模式需要提示模板才能正确回答。默认提示模板可以使用TEMPLATE中的Modelfile指令指定
# TEMPLATE "[INST] {{ .Prompt }} [/INST]"

TEMPLATE "
{{ if .System }}<|start_header_id|>system<|end_header_id|>

{{ .System }}<|eot_id|>{{ end }}{{ if .Prompt }}<|start_header_id|>user<|end_header_id|>

{{ .Prompt }}<|eot_id|>{{ end }}<|start_header_id|>assistant<|end_header_id|>

{{ .Response }}<|eot_id|>
"
SYSTEM "
You are a helpful assistant.
"
PARAMETER stop <|start_header_id|>
PARAMETER stop <|end_header_id|>
PARAMETER stop <|eot_id|>
PARAMETER temperature 1
PARAMETER top_p 1
```



```
ps aux | grep ollama
```



```
root@1f92c32e482c:/workspace# ls
ollama  ollama.logs  test
root@1f92c32e482c:/workspace# cd ollama
root@1f92c32e482c:/workspace/ollama# ls
models  ollama-linux-amd64.tgz
root@1f92c32e482c:/workspace/ollama# cd models
root@1f92c32e482c:/workspace/ollama/models# ls
Nemotron-3-Nano-30B-A3B-Q4_K_M.gguf
root@1f92c32e482c:/workspace/ollama/models# ls
Modelfile  Nemotron-3-Nano-30B-A3B-Q4_K_M.gguf
root@1f92c32e482c:/workspace/ollama/models# ollama create Nemotron-3-Nano-30B-A3B-Q4_K_M -f Modelfile
gathering model components 
copying file sha256:0e7f6e51fdd9039928749d07eed9e846dbfd97681646544c5406bcdd788e5940 100% 
parsing GGUF 
using existing layer sha256:0e7f6e51fdd9039928749d07eed9e846dbfd97681646544c5406bcdd788e5940 
creating new layer sha256:fbbe9f68bba10a55bf72a29814695826e6486a69e768bd69b028f845243718e9 
creating new layer sha256:4fc7dad80c9b29b5329e89004c0a7a722cd7e0fd229072a9cd613c8d8a8657ec 
creating new layer sha256:bab587bdab0cfaf9e04a6feabec10bdc7db9c6b7d1f498175712130a2ad6487c 
writing manifest 
success 
```

