import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "../ui/use-toast";
import { useMutation, useQueryClient } from "react-query";
import { deleteStudent } from "@/api/students";

export function DeleteDialog(props: { student: Student }) {
  const { toast, dismiss } = useToast();

  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = useMutation(
    async () => {
      return await deleteStudent(props.student.nim);
    },
    {
      onSuccess: () => {
        toast({
          title: "Student deleted.",
          description: `Student ${props.student.nim} has been deleted.`,
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
      },
    }
  );

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <p className="flex flex-1 p-0">Delete</p>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            student{" "}
            <strong>
              {props.student.fullName} ({props.student.nim})
            </strong>{" "}
            from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              mutateAsync();
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
