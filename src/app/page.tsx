"use client";

import { useQuery } from "react-query";
import { getStudents } from "@/api/students";
import { DataTable } from "@/components/students/data-table";
import { columns } from "@/components/students/columns";

export default function DemoPage() {
  const { data: students, isLoading } = useQuery({
    queryKey: "students",
    queryFn: getStudents,
  });

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={students || []} />
    </div>
  );
}
