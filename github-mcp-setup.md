# GitHub MCP 配置指南

## 1. 获取 GitHub Personal Access Token

1. 访问 https://github.com/settings/tokens
2. 点击 **Generate new token (classic)**
3. 勾选以下权限：
   - `repo` — 读取/写入仓库代码
   - `issues` — 管理 Issues
   - `pull_requests` — 读取 Pull Requests
   - `read:user` — 读取用户基本信息
4. 生成并复制 Token（以 `ghp_` 开头）

## 2. 配置 Claude 桌面应用

### macOS

打开文件：
```bash
~/Library/Application Support/Claude/claude_desktop_config.json
```

### Windows

打开文件：
```
%APPDATA%\Claude\claude_desktop_config.json
```

## 3. 添加 GitHub MCP 配置

将以下内容添加到 `claude_desktop_config.json` 的 `mcpServers` 中（替换 `YOUR_GITHUB_TOKEN` 为你的真实 Token）：

### 方式 A：使用 npx（推荐，最简单）

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_TOKEN"
      }
    }
  }
}
```

### 方式 B：使用 Docker

```json
{
  "mcpServers": {
    "github": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "GITHUB_PERSONAL_ACCESS_TOKEN",
        "ghcr.io/github/github-mcp-server"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_TOKEN"
      }
    }
  }
}
```

## 4. 重启 Claude

保存配置文件后，**完全退出并重新打开 Claude 桌面应用**。

## 5. 验证

在新的对话中，你可以尝试发送：

> "帮我查看我 GitHub 上的仓库列表"

如果配置成功，我就能直接调用 GitHub API 为你操作了。

---

## 可用功能（配置成功后）

| 功能 | 说明 |
|------|------|
| 搜索代码/仓库 | 在 GitHub 上搜索代码片段或仓库 |
| 读取文件内容 | 查看仓库中的文件 |
| 创建/管理 Issues | 创建、列出、更新 Issues |
| 查看 Pull Requests | 读取 PR 信息和评论 |
| 提交代码 | 创建/更新文件并提交 |
