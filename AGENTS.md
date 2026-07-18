# AGENTS.md

本文件约束在当前仓库内工作的 AI agent。

## Git 操作

- 没有用户明确要求时，不要执行 `git commit`。
- 没有用户明确要求时，不要执行 `git push`。
- 不要回滚或覆盖用户已有改动，除非用户明确要求。

## 构建与预览

- 默认只需要保障项目编译通过。
- 验证时优先运行 `npm run build`。
- 没有用户明确要求时，不要启动后台预览服务，例如 `npm run dev` 或 `npm run preview`。
- 用户会自行本地预览页面效果。

## UI 检查

- 如果用户要求检查 UI 美观、布局、视觉效果或截图表现，必须实际打开本地预览并通过截图检查。
- 不要只根据 CSS 数值、宽高、间距或代码推断 UI 是否美观。
- 截图检查完成后，清理临时截图文件；如启动了预览服务，检查完成后关闭服务。
- 仅在用户明确要求检查 UI 时启动预览服务。推荐命令：
  `npm run preview -- --host 127.0.0.1 --port 4321`
- 截图时优先使用项目根目录下的相对输出文件名，例如：
  `chromium --headless --disable-gpu --no-sandbox --window-size=1440,2200 --screenshot=ui-check.png http://127.0.0.1:4321/`
- 如果 `4321` 端口被占用，可以换用其它端口，但完成时需要说明实际端口。
- UI 检查完成后删除临时截图，例如 `ui-check.png`，并停止预览服务。

## 工作方式

- 修改前先阅读相关文件，保持改动聚焦。
- 完成后说明改动内容、验证结果，以及未执行的操作。

## 功能性 Tag

- 功能性 tag 指会触发专属样式、脚本、Markdown 写法或内容约定的 tag。
- 每次开发或修改功能性 tag 时，必须同步检查该 tag 是否有 demo 文章。
- 如果该功能性 tag 没有 demo，必须同步创建 `src/content/blog/<tag>-demo.md` 或语义清晰的等价文件名，并在 frontmatter 中标注对应 `tags`。
- 如果该功能性 tag 已有 demo，必须同步更新 demo，说明触发条件、推荐写法、最小可复制示例、常见维护方式和注意事项。
- demo 应优先使用当前项目真实支持的写法，不要只描述概念；涉及静态资源时说明资源应放在 `public/blog/<文章 slug>/` 下以及正文中的引用路径。
- 标志性 tag 只用于分类或标记，不触发专属功能，不需要创建自己的 demo 文件；例如 `demo` tag 只是标记 demo 文章。
- 当前已有 tag demo 约定：
  - `课程笔记`：维护 `src/content/blog/course-note-demo.md`，覆盖目录/编号规则、选择题模块、公式、代码、表格和常见正文样式。
  - `地图`：维护 `src/content/blog/map-demo.md`，覆盖底图资源、marker 写法、Markdown 详情块和 `?map-edit=1` 鼠标取点流程。
