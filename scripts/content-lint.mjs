import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const REQUIRED_SECTIONS = [
  '原笔记信息',
  '复习 / 预习建议',
  '速览',
  '知识点整理',
  '易错点 / 高频考点',
];

function getFrontmatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  return match ? { raw: match[1], body: source.slice(match[0].length) } : null;
}

function extractQuizBlocks(body) {
  const lines = body.split(/\r?\n/);
  const blocks = [];
  let block = null;
  let depth = 0;

  for (const line of lines) {
    if (!block && /<div\s+class=["'][^"']*quiz-question/.test(line)) {
      block = [];
      depth = 0;
    }
    if (!block) continue;
    block.push(line);
    depth += (line.match(/<div\b/g) || []).length;
    depth -= (line.match(/<\/div>/g) || []).length;
    if (depth === 0) {
      blocks.push(block.join('\n'));
      block = null;
    }
  }
  return blocks;
}

function sectionBody(body, heading) {
  const lines = body.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === `# ${heading}`);
  if (start < 0) return '';
  const end = lines.findIndex((line, index) => index > start && /^# /.test(line));
  return lines.slice(start + 1, end < 0 ? undefined : end).join('\n');
}

export function validateContent(source, { filePath = 'article.md', publicDir = 'public' } = {}) {
  const errors = [];
  const frontmatter = getFrontmatter(source);
  const fail = (message) => errors.push(`${filePath}: ${message}`);
  if (!frontmatter) {
    fail('缺少有效的 frontmatter。');
    return errors;
  }

  const { raw, body } = frontmatter;
  const isCourse = /tags:\s*\[[^\]]*["']课程笔记["']/.test(raw);
  const isDemo = /tags:\s*\[[^\]]*["'](?:demo|演示)["']/i.test(raw) || /(?:^|\/)\w*-?demo\.md$/.test(filePath);
  for (const field of ['title', 'description', 'pubDate']) {
    if (!new RegExp(`^${field}:\\s*\\S+`, 'm').test(raw)) fail(`frontmatter 缺少 ${field}。`);
  }

  const images = [...body.matchAll(/!\[[^\]]*\]\(([^)\s]+)(?:\s+['"][^'"]*['"])?\)/g)];
  for (const [, target] of images) {
    if (/^https?:\/\//.test(target)) continue;
    if (!target.startsWith('/blog/')) {
      fail(`本地图片必须使用 /blog/ 根路径：${target}`);
      continue;
    }
    const decoded = decodeURIComponent(target.split(/[?#]/)[0]);
    const asset = resolve(publicDir, `.${decoded}`);
    const root = resolve(publicDir) + sep;
    if (!asset.startsWith(root) || !existsSync(asset)) fail(`图片不存在：${target}`);
  }

  if (/github\.com\/[^\s)]+\/tree\//.test(body)) fail('GitHub 源文件链接必须使用 blob，而不是 tree。');
  if (!isCourse || isDemo) return errors;

  const headings = [...body.matchAll(/^# (.+?)\s*$/gm)].map((match) => match[1]);
  if (headings.length !== REQUIRED_SECTIONS.length || !REQUIRED_SECTIONS.every((heading, index) => headings[index] === heading)) {
    fail(`一级标题必须依次且仅为：${REQUIRED_SECTIONS.join(' → ')}。`);
  }
  if (!/^# 原笔记信息[\s\S]*?原笔记来源：\[[^\]]+\]\(https:\/\/github\.com\/[^)]+\/blob\//m.test(body)) {
    fail('原笔记信息必须包含 GitHub blob 源文件链接。');
  }
  if (!/本资料由原笔记蒸馏整理，建议配合原笔记查漏补缺/.test(sectionBody(body, '原笔记信息'))) {
    fail('原笔记信息缺少蒸馏资料提示。');
  }
  const overviewCount = (sectionBody(body, '速览').match(/^\s*-\s+/gm) || []).length;
  if (overviewCount < 5 || overviewCount > 8) fail(`速览应有 5–8 条要点，当前为 ${overviewCount} 条。`);
  if (!sectionBody(body, '易错点 / 高频考点').trim()) fail('易错点 / 高频考点不能为空。');

  const blocks = extractQuizBlocks(body);
  if (blocks.length === 0) fail('课程文稿至少需要一道自测题。');
  const names = new Set();
  blocks.forEach((block, index) => {
    const question = index + 1;
    const answer = block.match(/data-answer=["']([A-D])["']/)?.[1];
    const inputs = [...block.matchAll(/<input\b[^>]*name=["']([^"']+)["'][^>]*value=["']([A-D])["'][^>]*>/g)];
    const values = inputs.map((match) => match[2]).sort().join('');
    if (!answer) fail(`第 ${question} 题缺少合法 data-answer。`);
    if (inputs.length !== 4 || values !== 'ABCD') fail(`第 ${question} 题必须且只能包含 A–D 四个选项。`);
    const inputNames = new Set(inputs.map((match) => match[1]));
    if (inputNames.size !== 1) fail(`第 ${question} 题的单选项必须共用一个 name。`);
    const name = inputs[0]?.[1];
    if (name && names.has(name)) fail(`单选题 name 重复：${name}。`);
    if (name) names.add(name);
    if (!/class=["'][^"']*submit-answer/.test(block) || !/class=["'][^"']*show-answer/.test(block)) fail(`第 ${question} 题缺少提交或显示答案按钮。`);
    if (!/class=["'][^"']*quiz-result/.test(block) || !/class=["'][^"']*quiz-explanation/.test(block)) fail(`第 ${question} 题缺少结果或解析区域。`);
    const explained = block.match(/正确答案：([A-D])。/)?.[1];
    if (!explained) fail(`第 ${question} 题解析中缺少“正确答案：X。”。`);
    else if (answer && explained !== answer) fail(`第 ${question} 题 data-answer (${answer}) 与解析答案 (${explained}) 不一致。`);
  });

  return errors;
}

export function lintDirectory({ contentDir, publicDir }) {
  const errors = [];
  for (const name of readdirSync(contentDir).filter((entry) => entry.endsWith('.md')).sort()) {
    const filePath = join(contentDir, name);
    errors.push(...validateContent(readFileSync(filePath, 'utf8'), { filePath: relative(process.cwd(), filePath), publicDir }));
  }
  return errors;
}

const isCli = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
if (isCli) {
  const scriptDir = dirname(fileURLToPath(import.meta.url));
  const root = resolve(scriptDir, '..');
  const errors = lintDirectory({ contentDir: join(root, 'src/content/blog'), publicDir: join(root, 'public') });
  if (errors.length) {
    console.error(`内容校验失败（${errors.length} 项）：\n${errors.map((error) => `- ${error}`).join('\n')}`);
    process.exitCode = 1;
  } else {
    console.log('内容校验通过。');
  }
}
