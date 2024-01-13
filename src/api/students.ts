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

export async function getStudent(nim: string) {
  const response = await api.get<StudentInputs>(routes.getStudent(nim));
  const student = response.data;

  return student;
}

export function createStudent(student: StudentInputs) {
  return api.post(routes.createStudent(), student);
}

export function updateStudent(nim: string, student: StudentInputs) {
  return api.patch(routes.updateStudent(nim), student);
}

export function deleteStudent(nim: string) {
  return api.delete(routes.deleteStudent(nim));
}
