export const routes = {
  baseUrl: "http://localhost:8080",
  getStudents: () => `${routes.baseUrl}/students`,
  createStudent: () => `${routes.baseUrl}/students`,
  getStudent: (nim: string) => `${routes.baseUrl}/students/${nim}`,
  updateStudent: (nim: string) => `${routes.baseUrl}/students/${nim}`,
  deleteStudent: (nim: string) => `${routes.baseUrl}/students/${nim}`,
};
