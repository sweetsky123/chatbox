// 修改自 https://github.com/raycast/extensions/blob/main/extensions/model-context-protocol-registry/src/registries/builtin/entries.ts
/// <reference types="vite/client" />
import { fromPairs } from 'lodash'

// 使用 Vite 的 import.meta.glob 动态导入所有 PNG 文件
// 即使 TypeScript 在 commonjs 模块设置下无法识别 import.meta.glob，Vite 也会在构建时对其进行处理
// @ts-ignore - import.meta.glob 是 Vite 提供的特性
const logosModules = import.meta.glob<{ default: string }>('../../../static/logos/*.png', {
  eager: true,
})

const logos: Record<string, string> = fromPairs(
  Object.entries(logosModules).map(([path, module]) => {
    const name = path.split('/').pop() || ''
    return [name, (module as { default: string }).default]
  }),
)

function getIcon(filename: string): string {
  return logos[filename]
}

export interface MCPRegistryEntry {
  name: string
  title: string
  description: string
  icon: string
  homepage: string
  configuration: {
    command: string
    args: string[]
    env?: Record<string, string>
  }
}

export const MCP_ENTRIES_OFFICIAL: MCPRegistryEntry[] = [
  {
    name: 'brave-search',
    title: 'Brave Search',
    description: '面向 Brave Search 的 MCP 服务器。该服务器提供了一系列工具，使LLM能够读取、搜索和操作 Brave Search 资源库。',
    icon: 'https://svgl.app/library/brave.svg',
    homepage: 'https://github.com/modelcontextprotocol/servers/tree/HEAD/src/brave-search',
    configuration: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-brave-search'],
      env: {
        BRAVE_API_KEY: 'YOUR_API_KEY_HERE',
      },
    },
  },
  {
    name: 'chroma',
    title: 'Chroma',
    description: '提供由 Chroma 驱动的数据检索能力，使 AI 模型能够基于生成的数据和用户输入创建集合，并通过向量搜索、全文搜索、元数据过滤等多种方式检索这些数据。',
    icon: getIcon('chroma.png'),
    homepage: 'https://github.com/chroma-core/chroma-mcp',
    configuration: {
      command: 'uvx',
      args: [
        'chroma-mcp',
        '--client-type',
        'cloud',
        '--tenant',
        'YOUR_TENANT_ID_HERE',
        '--database',
        'YOUR_DATABASE_NAME_HERE',
        '--api-key',
        'YOUR_API_KEY_HERE',
      ],
    },
  },
  {
    name: 'context-7',
    title: 'Context 7',
    description: 'Context7 MCP 直接从源头获取最新的、特定版本的文档与代码示例，并将其直接注入你的提示词中。',
    icon: getIcon('context-7.png'),
    homepage: 'https://github.com/upstash/context7',
    configuration: {
      command: 'npx',
      args: ['-y', '@upstash/context7-mcp@latest'],
    },
  },
  {
    name: 'git',
    title: 'Git',
    description: '面向 Git 仓库交互与自动化的 MCP 服务器。该服务器提供了一系列工具，使LLM能够读取、搜索和操作 Git 仓库。',
    icon: 'https://svgl.app/library/git.svg',
    homepage: 'https://github.com/modelcontextprotocol/servers/tree/main/src/git',
    configuration: {
      command: 'uvx',
      args: ['mcp-server-git'],
    },
  },
  {
    name: 'github',
    title: 'GitHub',
    description: 'GitHub MCP Server 是一个 MCP 服务器，可与 GitHub API 无缝集成，为开发者和工具提供高级自动化与交互能力。',
    icon: 'https://svgl.app/library/github_light.svg',
    homepage: 'https://github.com/github/github-mcp-server?utm_source=Blog&utm_medium=GitHub&utm_campaign=proplus&utm_notesblogtop',
    configuration: {
      command: 'docker',
      args: ['run', '-i', '--rm', '-e', 'GITHUB_PERSONAL_ACCESS_TOKEN', 'ghcr.io/github/github-mcp-server'],
      env: {
        GITHUB_PERSONAL_ACCESS_TOKEN: '<YOUR_TOKEN>',
      },
    },
  },
  {
    name: 'gitlab',
    title: 'GitLab',
    description: '面向 GitLab API 的 MCP 服务器，支持项目管理、文件操作等多种功能。',
    icon: 'https://svgl.app/library/gitlab.svg',
    homepage: 'https://github.com/modelcontextprotocol/servers/tree/main/src/gitlab',
    configuration: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-gitlab'],
      env: {
        GITLAB_PERSONAL_ACCESS_TOKEN: '<YOUR_TOKEN>',
        GITLAB_API_URL: 'https://gitlab.com/api/v4', // 可选，用于自托管实例
      },
    },
  },
  {
    name: 'e2b',
    title: 'E2B Code Interpreter',
    description: '由 [E2B](https://e2b.dev/) 提供的 MCP 服务器，用于在安全沙箱中运行代码。',
    icon: getIcon('e2b.png'),
    homepage: 'https://github.com/e2b-dev/mcp-server/blob/main/packages/js/README.md',
    configuration: {
      command: 'npx',
      args: ['-y', '@e2b/mcp-server'],
      env: {
        E2B_API_KEY: 'YOUR_API_KEY_HERE',
      },
    },
  },
  {
    name: 'exa',
    title: 'Exa',
    description: '一个 MCP 服务器，让 Claude 等 AI 助手能够使用 Exa AI 搜索 API 进行网络搜索。这种配置使 AI 模型能够以安全、可控的方式获取实时网络信息。',
    icon: getIcon('exa.png'),
    homepage: 'https://github.com/exa-labs/exa-mcp-server',
    configuration: {
      command: 'npx',
      args: ['exa-mcp-server'],
      env: {
        EXA_API_KEY: 'YOUR_API_KEY_HERE',
      },
    },
  },
  {
    name: 'google-drive',
    title: 'Google Drive',
    description: '该 MCP 服务器与 Google Drive 集成，支持列出、读取和搜索文件。',
    icon: 'https://svgl.app/library/drive.svg',
    homepage: 'https://github.com/modelcontextprotocol/servers/tree/main/src/gdrive',
    configuration: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-gdrive'],
      env: {
        GDRIVE_CREDENTIALS_PATH: '/path/to/.gdrive-server-credentials.json',
      },
    },
  },
  {
    name: 'jetbrains',
    title: 'JetBrains',
    description: '该服务器负责将客户端的请求代理转发至 JetBrains IDE。',
    icon: 'https://svgl.app/library/jetbrains.svg',
    homepage: 'https://github.com/JetBrains/mcp-jetbrains',
    configuration: {
      command: 'npx',
      args: ['-y', '@jetbrains/mcp-proxy'],
    },
  },
  {
    name: 'heroku',
    title: 'Heroku',
    description: 'Heroku Platform MCP Server 是一个专门的 MCP 实现，旨在实现 LLM 与 Heroku 平台之间的无缝交互。该服务器提供了一套完善的工具与能力，使LLM能够读取、管理和操作 Heroku 平台资源。',
    icon: getIcon('heroku.png'),
    homepage: 'https://github.com/heroku/heroku-mcp-server',
    configuration: {
      command: 'npx',
      args: ['-y', '@heroku/mcp-server'],
      env: {
        HEROKU_API_KEY: 'YOUR_API_KEY_HERE',
      },
    },
  },
  {
    name: 'filesystem',
    title: 'Filesystem',
    description: '实现了 MCP 协议的 Node.js 服务器，用于文件系统操作。该服务器仅允许在通过 args 参数指定的目录内执行操作。',
    icon: 'filesystem.svg',
    homepage: 'https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem',
    configuration: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-filesystem', 'YOUR_ALLOWED_PATH_HERE'],
    },
  },
  {
    name: 'paddle',
    title: 'Paddle',
    description: 'Paddle Billing 是以开发者为先的记录商户，通过一套统一的 API 即可处理支付、税务、订阅和指标等所有事务。这是一个 MCP 服务器，提供与 Paddle API 交互所需的工具。',
    icon: getIcon('paddle.png'),
    homepage: 'https://github.com/PaddleHQ/paddle-mcp-server',
    configuration: {
      command: 'npx',
      args: ['-y', '@paddle/paddle-mcp', '--api-key=PADDLE_API_KEY', '--environment=(sandbox|production)'],
    },
  },
  {
    name: 'perplexity',
    title: 'Perplexity',
    description: '一个 MCP 服务器实现，集成了 Sonar API，为 Claude 提供无与伦比的实时全网研究能力。',
    icon: 'https://svgl.app/library/perplexity.svg',
    homepage: 'https://github.com/ppl-ai/modelcontextprotocol',
    configuration: {
      command: 'npx',
      args: ['-y', 'server-perplexity-ask'],
      env: {
        PERPLEXITY_API_KEY: 'YOUR_API_KEY_HERE',
      },
    },
  },
  {
    name: 'sentry',
    title: 'Sentry',
    description: "该服务提供一个 MCP 服务，用于与 Sentry 的 API 进行交互。",
    icon: getIcon('sentry.png'),
    homepage: 'https://mcp.sentry.dev/',
    configuration: {
      command: 'npx',
      args: ['-y', 'mcp-remote', 'https://mcp.sentry.dev/sse'],
    },
  },
  {
    name: 'slack',
    title: 'Slack',
    description: "该服务提供一个 MCP 服务，用于与 Slack 的 API 进行交互。",
    icon: 'https://svgl.app/library/slack.svg',
    homepage: 'https://github.com/modelcontextprotocol/servers/tree/main/src/slack',
    configuration: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-slack'],
      env: {
        SLACK_BOT_TOKEN: 'xoxb-your-bot-token',
        SLACK_TEAM_ID: 'T01234567',
        SLACK_CHANNEL_IDS: 'C01234567, C76543210',
      },
    },
  },
  {
    name: 'square',
    title: 'Square',
    description: "该项目遵循 MCP 标准，使 AI 助手能够与 Square 的 Connect API 进行交互。",
    icon: getIcon('square.png'),
    homepage: 'https://github.com/square/square-mcp-server',
    configuration: {
      command: 'npx',
      args: ['mcp-remote', 'https://mcp.squareup.com/sse'],
    },
  },
  {
    name: 'stripe',
    title: 'Stripe',
    description: "该项目遵循 MCP 标准，使 AI 助手能够与 Stripe 的 API 进行交互。",
    icon: 'https://svgl.app/library/stripe.svg',
    homepage: 'https://github.com/stripe/agent-toolkit',
    configuration: {
      command: 'npx',
      args: ['-y', '@stripe/mcp', '--tools=all', '--api-key=YOUR_STRIPE_SECRET_KEY'],
    },
  },
  {
    name: 'supabase',
    title: 'Supabase',
    description: "该项目遵循 MCP 标准，使 AI 助手能够与 Supabase 的 API 进行交互。",
    icon: 'https://svgl.app/library/supabase.svg',
    homepage: 'https://supabase.com/docs/guides/getting-started/mcp',
    configuration: {
      command: 'npx',
      args: ['-y', '@supabase/mcp-server-supabase@latest', '--access-token', '<personal-access-token>'],
    },
  },
  {
    name: 'tavily',
    title: 'Tavily',
    description: "该项目遵循 MCP 标准，使 AI 助手能够与 Tavily 的 API 进行交互。",
    icon: getIcon('tavily.png'),
    homepage: 'https://github.com/tavily-ai/tavily-mcp',
    configuration: {
      command: 'npx',
      args: ['-y', 'tavily-mcp'],
      env: {
        TAVILY_API_KEY: 'YOUR_API_KEY_HERE',
      },
    },
  },
  {
    name: 'xero',
    title: 'Xero',
    description: "这是一个面向 Xero 的 MCP 服务器实现。它在 MCP 协议与 Xero 的 API 之间架起桥梁，从而能够以标准化的方式访问 Xero 的会计和业务功能。",
    icon: getIcon('xero.png'),
    homepage: 'https://github.com/XeroAPI/xero-mcp-server',
    configuration: {
      command: 'npx',
      args: ['-y', '@xeroapi/xero-mcp-server@latest'],
      env: {
        XERO_CLIENT_ID: 'YOUR_CLIENT_ID_HERE',
        XERO_CLIENT_SECRET: 'YOUR_CLIENT_SECRET_HERE',
      },
    },
  },
  {
    name: 'firecrawl',
    title: 'Firecrawl',
    description: '一个与 Firecrawl 集成的 MCP 服务器实现，提供网页抓取能力。',
    icon: '🔥',
    homepage: 'https://github.com/mendableai/firecrawl-mcp-server',
    configuration: {
      command: 'npx',
      args: ['-y', 'firecrawl-mcp'],
      env: {
        FIRECRAWL_API_KEY: 'YOUR_API_KEY_HERE',
      },
    },
  },
  {
    name: 'playwright',
    title: 'Playwright',
    description: '一个基于 Playwright 提供浏览器自动化能力的 MCP 服务器。该服务器使LLM能够通过结构化的无障碍快照与网页交互，无需依赖截图或视觉调优模型。',
    icon: 'https://playwright.dev/img/playwright-logo.svg',
    homepage: 'https://github.com/microsoft/playwright-mcp',
    configuration: {
      command: 'npx',
      args: ['@playwright/mcp@latest'],
    },
  },
  {
    name: 'notion',
    title: 'Notion',
    description: 'Notion MCP Server 是一个 MCP 服务器，可与 Notion API 无缝集成，为开发者和工具提供高级自动化与交互能力。',
    icon: 'https://svgl.app/library/notion.svg',
    homepage: 'https://github.com/makenotion/notion-mcp-server',
    configuration: {
      command: 'npx',
      args: ['-y', '@notionhq/notion-mcp-server'],
      env: {
        OPENAPI_MCP_HEADERS: '{"Authorization": "Bearer ntn_****", "Notion-Version": "2022-06-28" }',
      },
    },
  },
  {
    name: 'pydantic-run-python',
    title: 'Pydantic Run Python',
    description: 'MCP Run Python 包是一个 MCP 服务器，允许智能体在安全的沙箱环境中执行 Python 代码。它借助 Pyodide 在 Deno 的 JavaScript 环境中运行 Python 代码，使代码执行与宿主系统相互隔离。',
    icon: getIcon('pydantic.png'),
    homepage: 'https://ai.pydantic.dev/mcp/run-python/',
    configuration: {
      command: 'deno',
      args: [
        'run',
        '-N',
        '-R=node_modules',
        '-W=node_modules',
        '--node-modules-dir=auto',
        'jsr:@pydantic/mcp-run-python',
        'stdio',
      ],
    },
  },
  {
    name: 'pydantic-logfire',
    title: 'Pydantic Logfire',
    description: "该仓库包含一个 MCP 服务器，其中的工具可以访问你发送到 Logfire 的 OpenTelemetry 链路追踪与指标数据。\n\n该 MCP 服务器使LLM能够检索应用程序的遥测数据、分析分布式链路追踪，并利用通过 Logfire API 执行的任意 SQL 查询结果。",
    icon: getIcon('pydantic.png'),
    homepage: 'https://github.com/pydantic/logfire-mcp',
    configuration: {
      command: 'uvx',
      args: ['logfire-mcp', '--read-token=YOUR_TOKEN_HERE'],
    },
  },
  {
    name: 'polar',
    title: 'Polar',
    description: '将 Polar 用作 MCP 服务器，扩展你的 AI 智能体的能力',
    icon: getIcon('polar.png'),
    homepage: 'https://docs.polar.sh/integrate/mcp',
    configuration: {
      command: 'npx',
      args: ['-y', '--package', '@polar-sh/sdk', '--', 'mcp', 'start', '--access-token', 'YOUR_ACCESS_TOKEN_HERE'],
    },
  },
  {
    name: 'elevenlabs',
    title: 'ElevenLabs',
    description: 'ElevenLabs 官方 MCP 服务器，支持与强大的文本转语音和音频处理 API 进行交互。该服务器使 Claude Desktop、Cursor、Windsurf、OpenAI Agents 等 MCP 客户端能够生成语音、克隆声音、转录音频等。',
    icon: getIcon('elevenlabs.png'),
    homepage: 'https://github.com/elevenlabs/elevenlabs-mcp',
    configuration: {
      command: 'uvx',
      args: ['elevenlabs-mcp'],
      env: {
        ELEVENLABS_API_KEY: 'YOUR_API_KEY_HERE',
      },
    },
  },
]

export const MCP_ENTRIES_COMMUNITY: MCPRegistryEntry[] = [
  {
    name: 'talk-to-figma',
    title: 'Talk to Figma',
    description: '该项目实现了 Cursor AI 与 Figma 之间的 MCP 集成，使 Cursor 能够与 Figma 通信，从而读取设计并以编程方式进行修改。',
    icon: 'https://svgl.app/library/figma.svg',
    homepage: 'https://github.com/sonnylazuardi/cursor-talk-to-figma-mcp',
    configuration: {
      command: 'bunx',
      args: ['cursor-talk-to-figma-mcp@latest'],
    },
  },
  {
    name: 'airbnb',
    title: 'Airbnb',
    description: '用于搜索 Airbnb 并获取房源详情的 MCP 服务器。',
    icon: 'https://svgl.app/library/airbnb.svg',
    homepage: 'https://github.com/openbnb-org/mcp-server-airbnb',
    configuration: {
      command: 'npx',
      args: ['-y', '@openbnb/mcp-server-airbnb', '--ignore-robots-txt'],
    },
  },
  {
    name: 'airtable',
    title: 'Airtable',
    description: '提供 Airtable 数据库读写访问能力的 MCP 服务器。该服务器使LLM能够先检查数据库结构，再读取和写入记录。',
    icon: getIcon('airtable.png'),
    homepage: 'https://github.com/domdomegg/airtable-mcp-server',
    configuration: {
      command: 'npx',
      args: ['-y', 'airtable-mcp-server'],
      env: {
        AIRTABLE_API_KEY: 'YOUR_API_KEY_HERE',
      },
    },
  },
  {
    name: 'apple-script',
    title: 'Apple Script',
    description: '一个 MCP 服务器，让你能够运行 AppleScript 代码与 Mac 进行交互。该 MCP 刻意采用简单、直接、直观的设计，只需最少的配置即可使用。',
    icon: getIcon('applescript.png'),
    homepage: 'https://github.com/peakmojo/applescript-mcp',
    configuration: {
      command: 'npx',
      args: ['@peakmojo/applescript-mcp'],
    },
  },
  {
    name: 'basic-memory',
    title: 'Basic Memory',
    description: 'Basic Memory 让你通过与 Claude 等 LLM 进行自然对话来构建持久化知识，同时将所有内容以简单的 Markdown 文件形式保存在你的电脑上。它使用 MCP 协议，使任何兼容的 LLM 都能读写你的本地知识库。',
    icon: 'memory.svg',
    homepage: 'https://github.com/basicmachines-co/basic-memory',
    configuration: {
      command: 'uvx',
      args: ['basic-memory', 'mcp'],
    },
  },
  {
    name: 'big-query',
    title: 'BigQuery',
    description: '提供 BigQuery 访问能力的 MCP 服务器。该服务器使LLM能够检查数据库结构并执行查询。',
    icon: getIcon('bigquery.png'),
    homepage: 'https://github.com/LucasHild/mcp-server-bigquery',
    configuration: {
      command: 'uvx',
      args: ['mcp-server-bigquery', '--project', 'YOUR_PROJECT_ID', '--location', 'YOUR_LOCATION'],
    },
  },
  {
    name: 'clickup',
    title: 'ClickUp',
    description: '一个用于将 ClickUp 任务与 AI 应用集成的 MCP 服务器。该服务器使 AI 智能体能够通过标准化协议与 ClickUp 的任务、空间、列表和文件夹进行交互。',
    icon: getIcon('clickup.png'),
    homepage: 'https://github.com/TaazKareem/clickup-mcp-server',
    configuration: {
      command: 'npx',
      args: ['-y', '@taazkareem/clickup-mcp-server@latest'],
      env: {
        CLICKUP_API_KEY: 'YOUR_API_KEY_HERE',
        CLICKUP_TEAM_ID: 'YOUR_TEAM_ID_HERE',
        DOCUMENT_SUPPORT: 'true',
      },
    },
  },
  {
    name: 'discord',
    title: 'Discord',
    description: '一个面向 Discord API (JDA) 的 MCP 服务器，使 Discord Bot 能够与 Claude Desktop 等兼容 MCP 的应用无缝集成。让你的 AI 助手顺畅地与 Discord 交互，轻松管理频道、发送消息和获取服务器信息，并以强大的自动化能力提升你的 Discord 使用体验。',
    icon: 'https://svgl.app/library/discord.svg',
    homepage: 'https://github.com/SaseQ/discord-mcp',
    configuration: {
      command: 'npx',
      args: ['mcp-remote', 'https://gitmcp.io/SaseQ/discord-mcp'],
      env: {
        DISCORD_TOKEN: 'YOUR_DISCORD_BOT_TOKEN',
      },
    },
  },
  {
    name: 'firebase',
    title: 'Firebase',
    description: 'Firebase MCP 使 AI 助手能够直接使用 Firebase 服务。',
    icon: 'https://svgl.app/library/firebase.svg',
    homepage: 'https://github.com/gannonh/firebase-mcp',
    configuration: {
      command: 'npx',
      args: ['-y', '@gannonh/firebase-mcp'],
      env: {
        SERVICE_ACCOUNT_KEY_PATH: '/absolute/path/to/serviceAccountKey.json',
        FIREBASE_STORAGE_BUCKET: 'your-project-id.firebasestorage.app',
      },
    },
  },
  {
    name: 'ghost',
    title: 'Ghost',
    description: '一个 MCP 服务器，用于通过 Claude 等 LLM 界面与 Ghost CMS 进行交互。该服务器借助 JWT 身份验证和一整套丰富的 MCP 工具，为你的 Ghost 博客提供安全而全面的访问能力，支持管理文章、用户、会员、订阅等级、优惠和邮件通讯。',
    icon: getIcon('ghost.png'),
    homepage: 'https://github.com/MFYDev/ghost-mcp',
    configuration: {
      command: 'npx',
      args: ['-y', '@fanyangmeng/ghost-mcp'],
      env: {
        GHOST_API_URL: 'https://yourblog.com',
        GHOST_ADMIN_API_KEY: 'your_admin_api_key',
        GHOST_API_VERSION: 'v5.0',
      },
    },
  },
  {
    name: 'iterm',
    title: 'iTerm',
    description: '提供 iTerm 会话访问能力的 MCP 服务器。',
    icon: getIcon('iterm.png'),
    homepage: 'https://github.com/ferrislucas/iterm-mcp',
    configuration: {
      command: 'npx',
      args: ['-y', 'iterm-mcp'],
    },
  },
  {
    name: 'lightdash',
    title: 'Lightdash',
    description: "该服务器提供与 MCP 兼容的 Lightdash API 访问能力，使 AI 助手能够通过标准化接口与你的 Lightdash 数据进行交互。",
    icon: getIcon('lightdash.png'),
    homepage: 'https://github.com/syucream/lightdash-mcp-server',
    configuration: {
      command: 'npx',
      args: ['-y', 'lightdash-mcp-server'],
      env: {
        LIGHTDASH_API_KEY: 'YOUR_API_KEY_HERE',
        LIGHTDASH_API_URL: 'https://<your base url>',
      },
    },
  },
  {
    name: 'monday',
    title: 'Monday',
    description: '面向 monday.com 的 MCP 服务器，使 MCP 客户端能够与 Monday.com 的看板、条目、更新和文档进行交互。',
    icon: getIcon('monday.png'),
    homepage: 'https://github.com/sakce/mcp-server-monday',
    configuration: {
      command: 'uvx',
      args: ['mcp-server-monday'],
      env: {
        MONDAY_API_KEY: 'your-monday-api-key',
        MONDAY_WORKSPACE_NAME: 'your-monday-workspace-name',
      },
    },
  },
]
