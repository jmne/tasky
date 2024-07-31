"use client"
import {trpc} from "@/utils/trpc";
import {Button} from "@/components/ui/button";
import {TrashIcon} from "lucide-react";

export default function DeleteTask({id}: { id: number }) {
    const {mutate} = trpc.deleteTask.useMutation({
        onSuccess: () => {
            // To-do: Add toast notification
            console.log("Task deleted")
            window.location.reload();
        },
        onError: (error) => {
            console.error(error)
        }
    });
    return (
        <Button
            onClick={() => {
                mutate({id});
            }}
            className="w-2/12 ml-2 bg-red-500 rounded-md hover:bg-red-800">
            <TrashIcon/>
        </Button>
    );
}
