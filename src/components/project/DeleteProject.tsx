"use client"
import {TrashIcon} from "lucide-react";

import {Button} from "@/components/ui/button";

import {trpc} from "@/utils/trpc";

/**
 * DeleteProject component
 *
 * This component renders a button that, when clicked, deletes a project with the given id.
 *
 * @param {Object} props - The component props
 * @param {number} props.id - The ID of the project to be deleted
 * @returns {JSX.Element} The rendered button component
 */
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
