"use client"
import {TrashIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import {trpc} from "@/utils/trpc";

/**
 * DeleteTask component
 *
 * This component renders a button that, when clicked, deletes a task with the given task_id.
 *
 * @param {Object} props - The component props
 * @param {number} props.task_id - The ID of the task to be deleted
 * @returns {JSX.Element} The rendered button component
 */
export default function DeleteTask({task_id}: { task_id: number }) {
    const {mutate} = trpc.deleteTask.useMutation({
        onSuccess: () => {
            // TODO:: Add toast notification
            console.log("Task deleted")
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
