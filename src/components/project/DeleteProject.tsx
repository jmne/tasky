"use client"
import {trpc} from "@/utils/trpc";
import {Button} from "@/components/ui/button";
import {TrashIcon} from "lucide-react";

export default function DeleteProject({id}: { id: number }) {
    const {mutate} = trpc.deleteProject.useMutation({
        onSuccess: () => {
            // To-do: Add toast notification
            console.log("Project deleted")
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
            className="ml-2 bg-red-500 hover:bg-red-800 rounded-md">
            <TrashIcon/>
        </Button>
    );
}
