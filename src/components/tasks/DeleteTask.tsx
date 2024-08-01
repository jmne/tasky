"use client"
import {TrashIcon} from "lucide-react";

import {Button} from "@/components/ui/button";

import {trpc} from "@/utils/trpc";

export default function DeleteTask({task_id}: { task_id: number }) {
    const {mutate} = trpc.deleteTask.useMutation({
        onSuccess: () => {
            // TODO:: Add toast notification
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
                mutate({id: task_id});
            }}
            className="ml-2 bg-red-500 rounded-md hover:bg-red-800">
            <TrashIcon/>
        </Button>
    );
}
