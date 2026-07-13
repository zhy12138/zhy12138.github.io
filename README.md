# zhy12138.github.io

这是一个基于 Astro 的静态博客站点，部署目标是 GitHub Pages。

## 每次修改后要做什么

1. 进入仓库根目录：

   ```bash
   cd zhy12138.github.io
   ```

2. 运行构建检查：

   ```bash
   npm run build
   ```

   这个命令会先执行 `astro check`，再执行 `astro build`。只有没有 error 时再继续提交和部署。

3. 本地预览：

   ```bash
   npm run preview -- --host 127.0.0.1 --port 4322
   ```

   然后打开：

   ```text
   http://127.0.0.1:4322/
   ```

   如果改了文章页，也要检查对应文章地址，例如：

   ```text
   http://127.0.0.1:4322/blog/design-and-analysis-of-algorithms/
   ```

4. 检查改动范围：

   ```bash
   git status --short
   git diff
   ```

   确认只包含本次要发布的改动。不要把无关文件一起提交。

5. 提交改动：

   ```bash
   git add <本次修改的文件>
   git commit -m "你的提交说明"
   ```

   如果这次明确要提交当前全部站点状态，可以使用：

   ```bash
   git add -A
   git commit -m "Update site"
   ```

## 如何部署

部署由 GitHub Actions 自动完成。仓库已经配置了 `.github/workflows/deploy.yml`，当代码 push 到 `master` 分支时，会自动：

1. 安装依赖：`npm ci`
2. 构建站点：`npm run build`
3. 上传 `dist/`
4. 发布到 GitHub Pages

触发部署：

```bash
git push origin master
```

部署后到 GitHub 仓库的 `Actions` 页面检查 `Deploy to GitHub Pages` 是否成功。成功后访问：

```text
https://zhy12138.github.io
```

一般不要手动提交 `dist/`。GitHub Actions 会在部署时重新构建并发布 `dist/`。
