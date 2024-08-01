"use client"
import {TrashIcon} from "lucide-react";

import {Button} from "@/components/ui/button";

import {trpc} from "@/utils/trpc";

export default function DeleteProject({id}: { id: number }) {
    const {mutate} = trpc.deleteProject.useMutation({
        onSuccess: () => {
            // TODO:: Add toast notification
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
