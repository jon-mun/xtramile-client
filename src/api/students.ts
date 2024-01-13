import { api } from "@/utils/api";
import { routes } from "@/utils/apiRoutes";

export async function getStudents() {
  const response = await api.get<Student[]>(routes.getStudents());

  const students = response.data.map((student) => {
    const { nim, fullName, age } = student;
    return { nim, fullName, age };
  });

  return students;
}

export function getStudent(nim: string) {
  return api.get<Student>(routes.getStudent(nim));
}

export function createStudent(student: StudentInputs) {
  return api.post(routes.createStudent(), student);
}
