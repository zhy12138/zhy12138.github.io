/**
 * @typedef {{
 *   sourceKey: string,
 *   courseCode: string,
 *   classNumber: string,
 *   name: string,
 *   capacity: number,
 *   enrolled: number,
 * }} ImportedCourse
 */

/**
 * @param {string} input
 * @returns {{ courses: ImportedCourse[], skipped: number }}
 */
export function parseCourseSelectionText(input) {
  const text = input.replace(/\r\n?/g, '\n').replaceAll('\u00a0', ' ');
  const starts = [...text.matchAll(/^(\d{8})\t([^\t\n]+)\t/gm)];
  /** @type {ImportedCourse[]} */
  const courses = [];
  let skipped = 0;

  starts.forEach((start, index) => {
    const blockEnd = starts[index + 1]?.index ?? text.length;
    const block = text.slice(start.index, blockEnd);
    const firstLine = block.split('\n', 1)[0];
    const columns = firstLine.split('\t');
    const courseCode = columns[0]?.trim() ?? '';
    const name = columns[1]?.trim() ?? '';
    const classNumber = columns[6]?.trim() ?? '';
    const countMatch = block.match(/(?:^|\t)(\d+)\s*\/\s*(\d+)(?=\t|\n|$)/m);

    if (!courseCode || !name || !countMatch) {
      skipped += 1;
      return;
    }

    courses.push({
      sourceKey: classNumber ? `${courseCode}:${classNumber}` : courseCode,
      courseCode,
      classNumber,
      name,
      capacity: Number(countMatch[1]),
      enrolled: Number(countMatch[2]),
    });
  });

  const uniqueCourses = [...new Map(courses.map((course) => [course.sourceKey, course])).values()];
  return { courses: uniqueCourses, skipped: skipped + courses.length - uniqueCourses.length };
}

/**
 * @template {{ sourceKey: string }} T
 * @param {T[]} importedCourses
 * @param {{ sourceKey?: string | null, happiness?: number | null }[]} existingCourses
 * @param {boolean} preserveHappiness
 * @returns {(T & { happiness: number | null })[]}
 */
export function prepareImportedCourses(importedCourses, existingCourses, preserveHappiness) {
  const happinessBySourceKey = new Map(
    existingCourses
      .filter((course) => typeof course.sourceKey === 'string' && course.sourceKey)
      .map((course) => [course.sourceKey, course.happiness ?? null]),
  );

  return importedCourses.map((course) => ({
    ...course,
    happiness: preserveHappiness && happinessBySourceKey.has(course.sourceKey)
      ? happinessBySourceKey.get(course.sourceKey) ?? null
      : null,
  }));
}
