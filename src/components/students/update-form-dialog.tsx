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
import { format, set } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { CalendarIcon } from "lucide-react";
import React from "react";
import { createStudent, getStudent, updateStudent } from "@/api/students";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useToast } from "../ui/use-toast";
import LoadingSpinner from "../ui/loading-spinner";

export function UpdateFormDialog(props: { student: Student }) {
  const { toast, dismiss } = useToast();
  const [date, setDate] = React.useState<Date>();
  const [open, setOpen] = React.useState(false);

  const { data: fetchedStudent, isLoading: isQueryLoading } = useQuery({
    queryKey: ["student", props.student.nim],
    queryFn: () => getStudent(props.student.nim),
    retry: false,
    onSuccess: (data) => {
      setDate(new Date(data.dob));
      reset({
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        dob: data.dob,
      });
    },
  });

  const { handleSubmit, control, reset } = useForm<StudentInputs>({
    defaultValues: {
      id: fetchedStudent?.id,
      firstName: fetchedStudent?.firstName,
      lastName: fetchedStudent?.lastName,
      dob: fetchedStudent?.dob,
    },
  });

  const queryClient = useQueryClient();
  const { mutateAsync, isLoading: isMutateLoading } = useMutation(
    async (data: StudentInputs) => {
      return await updateStudent(props.student.nim, data);
    },
    {
      onSuccess: () => {
        toast({
          title: "Student updated",
          description: `Student ${props.student.nim} has been updated.`,
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

  const isLoading = isQueryLoading || isMutateLoading;

  const onSubmit: SubmitHandler<StudentInputs> = (data) => {
    if (!date) {
      return;
    }
    const convertedDate = format(date, "yyyy-MM-dd");

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
        <p>Edit student details</p>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
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
                    disabled
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
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                    disabled={isLoading}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                handleSubmit(onSubmit)();
              }}
            >
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
