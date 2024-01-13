export const routes = {
  baseUrl: "http://localhost:8080",
  getStudents: () => `${routes.baseUrl}/students`,
  getStudent: (nim: string) => `${routes.baseUrl}/students/${nim}`,
};
