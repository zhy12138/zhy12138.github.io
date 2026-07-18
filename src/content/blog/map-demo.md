---
title: "地图功能 Demo"
description: "地图 tag 示例：在一张底图上放置点位，点击点位打开全屏详情层查看文字、图片和列表信息。"
pubDate: 2026-07-18
draft: false
tags: ["地图", "demo"]
---

# Demo 说明

这个示例用于维护 `地图` tag 的交互能力。只要 frontmatter 中包含 `tags: ["地图"]`，文章页就会启用地图点位、全屏详情层和鼠标取点辅助模式。

点地图上的标记，会打开一个覆盖当前页面的详情层；点右上角关闭按钮、点遮罩背景或按 Esc 可以回到底图。

# 底图资源

这里的底图是示例 SVG，文件保存在 `public/blog/map-demo/demo-map.svg`，正文中用 `/blog/map-demo/demo-map.svg` 引用。

实际使用现实地图、截图、导览图或平面图时，建议这样组织：

1. 把图片放到 `public/blog/<文章 slug>/map.png`。
2. 在文章中把 `map-image` 的 `src` 改成 `/blog/<文章 slug>/map.png`。
3. `alt` 写清楚底图内容，方便无障碍访问和后续维护。
4. 如果底图较大或点位较密集，在 `.map-widget` 上加 `data-map-layout="wide"`，让地图扩展到页面可用宽度。

# 地图最小示例

<div class="map-widget" data-map-id="campus-map" data-map-layout="wide" data-map-title="校园地图示例">
  <div class="map-stage" aria-label="校园地图示例">
    <img class="map-image" src="/blog/map-demo/demo-map.svg" alt="校园地图示例底图" />
    <button class="map-marker" type="button" data-x="18" data-y="21" data-target="demo-library" aria-label="查看图书馆"></button>
    <button class="map-marker" type="button" data-x="42" data-y="68" data-target="demo-studio" aria-label="查看创作室"></button>
    <button class="map-marker" type="button" data-x="76" data-y="20" data-target="demo-gallery" aria-label="查看展厅"></button>
  </div>
</div>

# 布局宽度

地图布局只由 `.map-widget` 上的 `data-map-layout` 控制。

默认布局不需要写 `data-map-layout`，地图会适应文章正文宽度，适合小地图、示意图和局部截图：

```html
<div class="map-widget" data-map-id="campus-map">
  <div class="map-stage" aria-label="校园地图示例">
    <img class="map-image" src="/blog/map-demo/demo-map.svg" alt="校园地图示例底图" />
  </div>
</div>
```

如果需要展示大地图、现实地图截图、路线图或点位很密集的平面图，只需要在 `.map-widget` 上增加 `data-map-layout="wide"`：

```html
<div class="map-widget" data-map-id="campus-map" data-map-layout="wide">
  <div class="map-stage" aria-label="校园地图示例">
    <img class="map-image" src="/blog/map-demo/demo-map.svg" alt="校园地图示例底图" />
  </div>
</div>
```

也就是说，从默认布局切换到宽版布局，只改这一处参数即可：

```diff
- <div class="map-widget" data-map-id="campus-map">
+ <div class="map-widget" data-map-id="campus-map" data-map-layout="wide">
```

宽版布局会突破正文宽度，但不会无限铺满超宽屏；移动端会自动回到正常宽度。点位坐标仍然使用百分比，不需要因为布局变宽而重新计算。

# Marker 写法

每个点位是一个 `button.map-marker`：

```html
<button
  class="map-marker"
  type="button"
  data-x="18"
  data-y="21"
  data-target="demo-library"
  aria-label="查看图书馆"
></button>
```

- `data-x` / `data-y` 是相对底图宽高的百分比坐标。
- `data-target` 要和详情块里的点位 ID 一致。
- `aria-label` 是点位名称，不会明显遮挡地图，但可以提供提示和无障碍信息。
- 同一篇文章可以放多个地图组件，每个地图组件用不同的 `data-map-id`。

# 鼠标取点

想用鼠标增加点位时，在地图文章 URL 后加 `?map-edit=1`。

进入编辑模式后，点击地图空白位置，页面右下角会生成一段可粘贴的 marker 代码，并尽量自动复制到剪贴板。复制后把 `data-target="new-place"` 改成真实点位 ID，再补上对应的 Markdown 详情块。

# Markdown 详情块

点位详情直接写在同一个 Markdown 文件中。用 `<!-- map-detail:地图ID:点位ID -->` 和 `<!-- /map-detail -->` 包住普通 Markdown 内容即可：

```md
<!-- map-detail:campus-map:demo-library -->

## 图书馆

这里可以写 **Markdown**、列表、图片、引用和公式。

<!-- /map-detail -->
```

<!-- map-detail:campus-map:demo-library -->

## 图书馆

这里可以写点位介绍、开放时间、历史背景或游览提示。详情内容使用普通 Markdown 编写，渲染后会被放进全屏详情层。

![图书馆所在位置示意](/blog/map-demo/demo-map.svg)

<!-- /map-detail -->

<!-- map-detail:campus-map:demo-studio -->

## 创作室

点位内容可以包含列表，适合写路线、任务、资料链接或复习提示。

- 适合放课程项目、地点说明、旅行记录。
- 点位坐标用百分比保存，底图缩放后仍能对齐。
- 同一篇文章可以放多个地图组件，只要使用不同的 `data-map-id`。

<!-- /map-detail -->

<!-- map-detail:campus-map:demo-gallery -->

## 展厅

这里模拟一个图文点位。你可以像写普通文章一样继续增加段落、引用或图片。

> 示例说明：点击地图上的展厅点进入这里，按 Esc 或点击按钮退出。

<!-- /map-detail -->
