import { Button } from "@/components/ui/button";
import { useForm, Controller, SubmitHandler } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { createStudent } from "@/api/students";
import { useMutation, useQueryClient } from "react-query";
import { useToast } from "../ui/use-toast";
import { DateField } from "../ui/date-time-picker/date-field";
import { CalendarDate } from "@internationalized/date";

export function CreateFormDialog() {
  const { toast, dismiss } = useToast();
  const [date, setDate] = React.useState<CalendarDate>();
  const [open, setOpen] = React.useState(false);

  const { handleSubmit, control, reset } = useForm<StudentInputs>({
    defaultValues: {
      id: "",
      firstName: "",
      lastName: "",
      dob: "",
    },
  });

  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = useMutation(
    async (data: StudentInputs) => {
      return await createStudent(data);
    },
    {
      onSuccess: () => {
        toast({
          title: "Student created",
          description: "Student has been created successfully.",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "An error has occurred.",
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["students"] });

        // Close the dialog after 7 seconds
        setTimeout(() => {
          dismiss();
        }, 7000);

        setOpen(false);
      },
    }
  );

  const onSubmit: SubmitHandler<StudentInputs> = (data) => {
    if (!date) {
      return;
    }

    const convertedDate = format(
      new Date(date.year, date.month - 1, date.day),
      "yyyy-MM-dd"
    );

    const student = {
      ...data,
      dob: convertedDate,
    };

    mutateAsync(student);

    setDate(undefined);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Student</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add Student</DialogTitle>
            <DialogDescription>Insert student data here.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="id" className="text-right">
                Student ID
              </Label>
              <Controller
                name="id"
                control={control}
                render={({ field }) => (
                  <Input
                    id="id"
                    placeholder="21481250PA20950"
                    className="col-span-3"
                    disabled={isLoading}
                    required
                    {...field}
                  />
                )}
              ></Controller>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                First Name
              </Label>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <Input
                    id="firstName"
                    placeholder="Jonathan"
                    className="col-span-3"
                    disabled={isLoading}
                    required
                    {...field}
                  />
                )}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                Last Name
              </Label>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <Input
                    id="lastName"
                    placeholder="Edmund"
                    className="col-span-3"
                    disabled={isLoading}
                    {...field}
                  />
                )}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dateOfBirth" className="text-right">
                Birth Date
              </Label>
              <DateField
                aria-label="Date of Birth"
                isRequired
                validate={(value) => {
                  if (!value) {
                    return "Date of Birth is required";
                  }
                  return null;
                }}
                onChange={(e) => {
                  const calendarDate = new CalendarDate(e.year, e.month, e.day);
                  setDate(calendarDate);
                }}
                value={date}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
