import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import test from 'node:test';
import { validateContent } from './content-lint.mjs';

const tempRoot = mkdtempSync(join(tmpdir(), 'blog-content-lint-'));
const publicDir = join(tempRoot, 'public');
mkdirSync(join(publicDir, 'blog/test'), { recursive: true });
writeFileSync(join(publicDir, 'blog/test/figure.png'), 'fixture');
test.after(() => rmSync(tempRoot, { recursive: true, force: true }));

function fixture(overrides = {}) {
  const answer = overrides.answer ?? 'B';
  const explained = overrides.explained ?? answer;
  const secondName = overrides.secondName ?? 'q2';
  const image = overrides.image ?? '/blog/test/figure.png';
  const headings = overrides.headings ?? ['原笔记信息', '复习 / 预习建议', '速览', '知识点整理', '易错点 / 高频考点'];
  const sections = {
    '原笔记信息': '- 原笔记来源：[note.md](https://github.com/example/notes/blob/main/note.md)\n- **本资料由原笔记蒸馏整理，建议配合原笔记查漏补缺。**',
    '复习 / 预习建议': '- 先建立主线。',
    速览: '- 一\n- 二\n- 三\n- 四\n- 五',
    知识点整理: `![示意图](${image})\n\n${quiz('q1', answer, explained)}\n\n${quiz(secondName, 'C', 'C')}`,
    '易错点 / 高频考点': '- 不要混淆两个概念。',
  };
  return `---\ntitle: "测试课程"\ndescription: "校验器测试文稿"\npubDate: 2026-08-01\ndraft: false\ntags: ["课程笔记"]\n---\n\n${headings.map((heading) => `# ${heading}\n${sections[heading] ?? '- 内容'}`).join('\n\n')}`;
}

function quiz(name, answer, explained) {
  return `<div class="quiz-question" data-answer="${answer}">
  <p><strong>问题？</strong></p>
  ${['A', 'B', 'C', 'D'].map((value) => `<label><input type="radio" name="${name}" value="${value}" /> ${value}. 选项</label>`).join('\n  ')}
  <div class="quiz-actions"><button type="button" class="submit-answer">提交答案</button><button type="button" class="show-answer">显示答案</button></div>
  <p class="quiz-result" hidden></p>
  <p class="quiz-explanation" hidden>正确答案：${explained}。<br />解析：测试解析。</p>
</div>`;
}

test('accepts a valid course note', () => {
  assert.deepEqual(validateContent(fixture(), { filePath: 'valid.md', publicDir }), []);
});

test('rejects duplicate radio names', () => {
  assert.match(validateContent(fixture({ secondName: 'q1' }), { filePath: 'duplicate.md', publicDir }).join('\n'), /name 重复/);
});

test('rejects an answer mismatch', () => {
  assert.match(validateContent(fixture({ answer: 'B', explained: 'A' }), { filePath: 'answer.md', publicDir }).join('\n'), /不一致/);
});

test('rejects a missing image', () => {
  assert.match(validateContent(fixture({ image: '/blog/test/missing.png' }), { filePath: 'image.md', publicDir }).join('\n'), /图片不存在/);
});

test('rejects the wrong heading order', () => {
  const headings = ['原笔记信息', '速览', '复习 / 预习建议', '知识点整理', '易错点 / 高频考点'];
  assert.match(validateContent(fixture({ headings }), { filePath: 'headings.md', publicDir }).join('\n'), /一级标题必须依次/);
});
