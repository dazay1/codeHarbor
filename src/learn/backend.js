import { curriculum } from '../data/curriculum';

// Course content lives in the frontend: src/data/curriculum.js holds every course, chapter and
// exercise (task, starter code, hint and the check that grades the answer). No server is called.
export function useCourse(courseId) {
    const course = curriculum[courseId];
    return { course: course ?? null, loading: false };
}
