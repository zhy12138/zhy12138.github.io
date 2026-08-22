import assert from 'node:assert/strict';
import test from 'node:test';
import { recommendCoursePoints } from '../src/lib/course-bidding.ts';

const course = (id, overrides = {}) => ({
  id,
  name: id,
  capacity: 10,
  enrolled: 20,
  happiness: 1,
  ...overrides,
});

test('non-over-capacity recommended courses stay out of the lottery budget', () => {
  const recommendations = recommendCoursePoints([
    course('recommended', { recommended: true, capacity: 20, enrolled: 10, happiness: 5 }),
    course('ordinary', { happiness: 4 }),
  ]);

  assert.equal(recommendations[0].points, 0);
  assert.equal(recommendations[0].probability, 100);
  assert.equal(recommendations[0].needsLottery, false);
  assert.equal(recommendations[1].points, 99);
  assert.equal(recommendations[1].needsLottery, true);
  assert.equal(recommendations[0].expectedHappiness, 5);
});

test('non-over-capacity recommended courses have a 100% probability', () => {
  const [recommendation] = recommendCoursePoints([
    course('recommended', { recommended: true, capacity: 10, enrolled: 5 }),
  ]);

  assert.deepEqual(
    {
      points: recommendation.points,
      probability: recommendation.probability,
      needsLottery: recommendation.needsLottery,
    },
    { points: 0, probability: 100, needsLottery: false },
  );
});

test('over-capacity recommended courses estimate probability with virtual 99 points', () => {
  const recommendations = recommendCoursePoints([
    course('recommended', { recommended: true, capacity: 10, enrolled: 20, happiness: 5 }),
    course('ordinary-a', { happiness: 3 }),
    course('ordinary-b', { happiness: 2 }),
  ]);
  const [recommendation, ...ordinaryCourses] = recommendations;

  assert.equal(recommendation.points, 99);
  assert.equal(recommendation.needsLottery, true);
  assert.ok(recommendation.probability < 100);
  assert.ok(recommendation.probability > 0);
  assert.ok(recommendation.expectedHappiness < recommendation.happiness);
  assert.equal(ordinaryCourses.reduce((total, item) => total + item.points, 0), 99);
});
