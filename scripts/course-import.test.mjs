import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { parseCourseSelectionText, prepareImportedCourses } from '../src/lib/course-import.mjs';

const expected = [
  ['90010001:1', '构造体协同作战基础', 40, 63],
  ['90010002:2', '意识海稳定性训练', 80, 52],
  ['90010003:1', '空中花园防卫史', 120, 98],
  ['90010004:3', '逆元装置维护原理', 36, 71],
  ['90010005:1', '帕弥什污染区生存实践', 24, 24],
  ['90010006:12', '战术终端与信号分析', 60, 87],
];

test('parses the sanitized course-selection fixture', async () => {
  const text = await readFile(new URL('./fixtures/course-selection-sanitized.txt', import.meta.url), 'utf8');
  const result = parseCourseSelectionText(text);
  assert.equal(result.skipped, 0);
  assert.deepEqual(
    result.courses.map((course) => [course.sourceKey, course.name, course.capacity, course.enrolled]),
    expected,
  );
});

test('parser rejects unrelated pasted text', () => {
  assert.deepEqual(parseCourseSelectionText('课程名\t限数/已选\n没有课程数据'), { courses: [], skipped: 0 });
});

test('preserves happiness only for the same imported course', () => {
  const imported = [
    { sourceKey: '90010001:1', name: '构造体协同作战基础', capacity: 40, enrolled: 70 },
    { sourceKey: '90010002:2', name: '意识海稳定性训练', capacity: 80, enrolled: 60 },
  ];
  const existing = [
    { sourceKey: '90010001:1', name: '旧课程名不影响匹配', happiness: 3.5 },
    { sourceKey: '90019999:1', name: '意识海稳定性训练', happiness: 9 },
  ];

  assert.deepEqual(
    prepareImportedCourses(imported, existing, true).map((course) => course.happiness),
    [3.5, null],
  );
  assert.deepEqual(
    prepareImportedCourses(imported, existing, false).map((course) => course.happiness),
    [null, null],
  );
});
