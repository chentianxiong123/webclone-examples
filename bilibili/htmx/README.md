# bili-htmx — B 站首页 Go + HTMX 重建

静态快照 → Go 模板 + HTMX 局部刷新的组件化 demo。
**原版 = 视觉基准；源码 = 自己的语义化代码（hc-* 类名，不抄原版规则）。**

## 结果
- 首页完整渲染（导航/轮播/频道/卡片），图片 44 张本地可加载（referrerpolicy no-referrer 绕过防盗链）
- 导航栏 hc-nav：坐标与原版**全 0 差**（左入口 9 项 / 搜索框 / 右入口 / 投稿按钮）
- HTMX 交互：原版"换一换"按钮（roll-btn）→ 服务端换批；"动态" → 服务端片段面板
- 69 条卡片数据 → feed.json，Go 循环位移分页

## 运行
```
cd /mnt/shared/bili-htmx && ./bili-htmx   # :8081
# 对照原版静态版: python3 -m http.server 8080 -d /tmp/bilibili-static
```

## 结构
```
main.go                 Go 服务（embed + 路由 + 分页）103 行
templates/
  layout.html           页面骨架（其他区块原版直贴）
  feed.html             feed 网格（prefix + display:contents 容器 + range）
  feed-cards.html       HTMX 换批响应（纯卡片列表）
  card.html             单卡片模板（6 个数据变量锚点）
components/nav/         导航栏组件（语义化重建 + bench.json 验收基准）
  nav.html / nav.css / bench.json
static/                 bili.css(原版) + override.css + nav.css + htmx.min.js
data/feed.json          69 条卡片数据
```

## 方法论（组件级像素复刻三步）
1. **实测基准**：拉原版组件每个元素坐标/宽/字号/色 → bench.json
2. **语义化重建**：自己的 hc-* 结构 + 样式（抄结果值，不抄规则）
3. **数值验收**：坐标表自动 diff，全 0 = 一样

## 踩坑记录
- 图片 CDN 防盗链 403 → img 加 referrerpolicy="no-referrer"
- 卡片错误挂进轮播容器 → 白屏（必须在网格层 container 直接子）
- `<div class="` 字符串拼接重复 → HTMLParser 栈平衡切块
- htmx 改 hx-get 属性不生效（path 缓存）→ htmx:configRequest 事件动态参数
- hx-target 不存在 → targetError 静默失败
- text/template（非 html/template）：原版 HTML 宽松，严格解析会崩
