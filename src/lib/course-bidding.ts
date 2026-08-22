export interface CourseInput {
  id: string;
  name: string;
  capacity: number;
  enrolled: number;
  happiness: number;
  recommended?: boolean;
}

export interface CourseRecommendation extends CourseInput {
  points: number;
  probability: number;
  expectedHappiness: number;
  needsLottery: boolean;
}

const TOTAL_POINTS = 99;

function estimatedAveragePoints(capacity: number, enrolled: number) {
  const demandFactor = Math.pow(enrolled / capacity - 1, 0.125) + 1;
  const fittedAverage = -101 * demandFactor ** 2 + 392.6 * demandFactor - 347.8 + 0.5;
  return 0.92 * fittedAverage + 0.08 * 99.5;
}

function estimatedLostHappiness(
  happiness: number,
  capacity: number,
  enrolled: number,
  relativePoints: number,
) {
  return happiness
    * Math.pow(1 - capacity / (enrolled + relativePoints), 0.55 * relativePoints + 0.5)
    * Math.pow(enrolled / (enrolled - capacity), 0.5 - 0.45 * relativePoints);
}

export function recommendCoursePoints(courses: CourseInput[]): CourseRecommendation[] {
  const recommendations: CourseRecommendation[] = courses.map((course) => ({
    ...course,
    points: 0,
    probability: 100,
    expectedHappiness: course.happiness,
    needsLottery: course.enrolled > course.capacity,
  }));
  const lotteryIndexes = recommendations
    .map((course, index) => course.needsLottery && !course.recommended ? index : -1)
    .filter((index) => index >= 0);

  const calculateRecommendedProbability = () => {
    recommendations.forEach((course) => {
      if (!course.recommended || !course.needsLottery) return;
      const average = estimatedAveragePoints(course.capacity, course.enrolled);
      const lostHappiness = estimatedLostHappiness(
        course.happiness,
        course.capacity,
        course.enrolled,
        (TOTAL_POINTS + 0.5) / average,
      );
      course.points = TOTAL_POINTS;
      course.expectedHappiness = course.happiness - lostHappiness;
      course.probability = course.expectedHappiness / course.happiness * 100;
    });
  };

  if (!lotteryIndexes.length) {
    calculateRecommendedProbability();
    return recommendations;
  }

  const lotteryCourses = lotteryIndexes.map((index) => recommendations[index]);
  const averages = lotteryCourses.map((course) => estimatedAveragePoints(course.capacity, course.enrolled));
  const points = new Array<number>(lotteryCourses.length).fill(0);
  let anchor = 0;
  points[0] = TOTAL_POINTS;

  for (let courseOffset = 0; courseOffset < lotteryCourses.length; courseOffset += 1) {
    if (points[(anchor + courseOffset) % lotteryCourses.length] === 0) continue;

    for (let targetOffset = 1; targetOffset < lotteryCourses.length; targetOffset += 1) {
      const sourceIndex = (anchor + courseOffset) % lotteryCourses.length;
      const targetIndex = (anchor + courseOffset + targetOffset) % lotteryCourses.length;
      const source = lotteryCourses[sourceIndex];
      const target = lotteryCourses[targetIndex];
      const currentLoss = estimatedLostHappiness(
        source.happiness,
        source.capacity,
        source.enrolled,
        (points[sourceIndex] + 0.5) / averages[sourceIndex],
      ) + estimatedLostHappiness(
        target.happiness,
        target.capacity,
        target.enrolled,
        (points[targetIndex] + 0.5) / averages[targetIndex],
      );
      const movedLoss = estimatedLostHappiness(
        source.happiness,
        source.capacity,
        source.enrolled,
        (points[sourceIndex] - 0.5) / averages[sourceIndex],
      ) + estimatedLostHappiness(
        target.happiness,
        target.capacity,
        target.enrolled,
        (points[targetIndex] + 1.5) / averages[targetIndex],
      );

      if (currentLoss > movedLoss) {
        points[sourceIndex] -= 1;
        points[targetIndex] += 1;
        anchor = targetIndex;
        courseOffset = 0;
        targetOffset = 1;
      }
    }
  }

  lotteryIndexes.forEach((courseIndex, lotteryIndex) => {
    const course = recommendations[courseIndex];
    const lostHappiness = estimatedLostHappiness(
      course.happiness,
      course.capacity,
      course.enrolled,
      (points[lotteryIndex] + 0.5) / averages[lotteryIndex],
    );
    course.points = points[lotteryIndex];
    course.expectedHappiness = course.happiness - lostHappiness;
    course.probability = course.expectedHappiness / course.happiness * 100;
  });

  calculateRecommendedProbability();

  return recommendations;
}
