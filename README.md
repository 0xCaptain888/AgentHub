# AgentHub — 跨境电商AI智能平台

> 5个AI Agent协同工作的跨境电商运营平台，覆盖客服、Listing、内容、竞品、供应链全链路。

## 在线演示

👉 **[Live Demo](https://0xcaptain888.github.io/AgentHub/output/)**

> 演示站点使用模拟数据运行，接入真实API后可处理实际业务数据。

## 功能模块

| 模块 | Agent | 核心能力 |
|------|-------|---------|
| 总览面板 | — | KPI看板、ECharts图表、AI洞察引擎、全球订单地图、Agent协作网络、客户转化漏斗 |
| 智能客服 | Agent 1 | 多平台对话、意图分类、知识库检索(TF-IDF)、订单查询、情绪分析、满意度评分 |
| Listing生成 | Agent 2 | Amazon/TikTok双平台Listing、SEO评分、关键词优化、竞品对比 |
| TikTok内容 | Agent 3 | 视频脚本生成、直播话术、7天内容日历、AI选品雷达、发布时间热力图 |
| 竞品监控 | Agent 4 | 价格追踪、BSR变动、动态定价建议、竞品搜索、每日简报 |
| 供应链 | Agent 5 | 多仓库存管理(FBA+TikTok)、补货计划、需求预测、供应链预警 |
| 利润分析 | — | P&L报表、利润趋势、平台对比、财务KPI |

## 全局功能

- **AI指挥中心** — `Ctrl+K` 输入自然语言指令，自动路由到对应Agent
- **4套主题皮肤** — 深空蓝 / 浅色模式 / 商务金 / 极客绿
- **大屏投放模式** — 一键全屏展示，适合会议投屏
- **新手引导Tour** — 6步交互式教学
- **实时模拟通知** — Toast通知模拟真实运营事件
- **专业报告导出** — CSV数据导出 + 打印报告

## 技术架构

```
AgentHub/
├── app/                          # Python后端 (FastAPI)
│   ├── server.py                 # 主服务器 + 18个API路由
│   ├── config.py                 # API密钥配置中心
│   ├── llm.py                    # LLM统一接口 (OpenAI兼容)
│   └── agents/
│       ├── customer_service.py   # Agent 1: 智能客服
│       ├── listing_agent.py      # Agent 2: Listing生成
│       ├── content_agent.py      # Agent 3: TikTok内容
│       ├── competitor_agent.py   # Agent 4: 竞品监控
│       └── supply_chain.py       # Agent 5: 供应链
│
└── output/                       # 前端静态资源
    ├── index.html                # HTML结构
    ├── css/style.css             # 样式 / 主题 / 动画 / 响应式
    └── js/app.js                 # 业务逻辑 + 离线演示模式
```

## 快速启动

### 1. 克隆仓库

```bash
git clone https://github.com/0xCaptain888/AgentHub.git
cd AgentHub
```

### 2. 安装依赖

```bash
pip install fastapi uvicorn httpx scikit-learn
```

### 3. 配置API密钥（可选）

编辑 `app/config.py`，填入你的API密钥：

```python
LLM_API_KEY = "your-key"        # OpenAI / Claude / DeepSeek
AMAZON_SP_API_KEY = "your-key"  # Amazon Seller API
TIKTOK_SHOP_KEY = "your-key"    # TikTok Shop API
SERPER_API_KEY = "your-key"     # 网页搜索
```

> 不配置密钥也能运行，系统自动使用模板/演示数据。

### 4. 启动服务

```bash
PYTHONPATH=. python -m app.server
```

访问 `http://localhost:8080`

## API接口文档

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/status` | 系统状态 |
| GET | `/api/dashboard` | 仪表盘数据 |
| POST | `/api/cs/chat` | 客服对话 |
| GET | `/api/cs/stats` | 客服统计 |
| POST | `/api/listing/generate` | 生成Listing |
| POST | `/api/content/script` | 生成视频脚本 |
| POST | `/api/content/live` | 生成直播话术 |
| GET | `/api/content/calendar` | 内容日历 |
| POST | `/api/competitor/overview` | 竞品分析 |
| GET | `/api/competitor/briefing` | 每日简报 |
| GET | `/api/supply/overview` | 库存总览 |
| POST | `/api/supply/restock` | 补货计划 |
| POST | `/api/supply/forecast` | 需求预测 |

## License

MIT
