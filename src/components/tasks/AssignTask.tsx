"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {UserIcon} from "lucide-react";
import React from "react";
import {useForm} from "react-hook-form";
import z from "zod";

import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Form, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {
    MultiSelector,
    MultiSelectorContent,
    MultiSelectorInput,
    MultiSelectorItem,
    MultiSelectorList,
    MultiSelectorTrigger,
} from "@/components/ui/selectbox";

import {trpc} from "@/utils/trpc";

const form = z.object({
    value: z.array(z.string()),
});

type Form = z.infer<typeof form>;


export default function AssignTask({project_id}: { project_id: number }) {
    const user = trpc.getAllUser.useQuery()
    const users = user.data ? user.data.map((data) => {
        return {
            name: data.id ? data.id : "",
            value: data.username ? data.username : ""
        }
    }) : []

    const mutate = trpc.postProjectAssignment.useMutation({
        onSuccess: () => {
            console.log("Project assignees updated")
        },
        onError: (error) => {
            console.error(error)
        }
    });

    const multiForm = useForm<Form>({
        resolver: zodResolver(form),
        defaultValues: {
            value: users.map((user) => user.value),
        }
    });

    const onSubmit = (data: Form) => {
        console.log(data);
        mutate.mutate({
            project_id: project_id,
            assignee: data.value
        });
    }

    const [open, setOpen] = React.useState(false)


    return (
        <Dialog open={open} onOpenChange={setOpen}> <DialogTrigger asChild>
            <Button className="ml-2"><UserIcon/></Button>
        </DialogTrigger>
            <DialogContent aria-describedby="Project">
                <DialogTitle>
                    Assign user to project
                </DialogTitle>
                <Form {...multiForm}>
                    <form
                        onSubmit={multiForm.handleSubmit(onSubmit)}
                        className="space-y-3 grid gap-3 w-full"
                    >
                        <FormField
                            control={multiForm.control}
                            name="value"
                            render={({field}) => (
                                <FormItem className="w-full">
                                    <FormLabel>Invite people</FormLabel>
                                    <MultiSelector
                                        onValuesChange={field.onChange}
                                        values={field.value}
                                    >
                                        <MultiSelectorTrigger>
                                            <MultiSelectorInput placeholder="Select people to invite"/>
                                        </MultiSelectorTrigger>
                                        <MultiSelectorContent>
                                            <MultiSelectorList>
                                                {/* TODO: Bug here, the list is not clickable*/}
                                                {users.map((user) => (
                                                    <MultiSelectorItem key={user.name} value={user.name}
                                                                       className="z-50">
                                                        <div className="flex items-center space-x-2">
                                                            <Avatar><AvatarFallback>{user.name.substring(0, 1)}</AvatarFallback></Avatar>
                                                            <span>{user.name}</span>
                                                        </div>
                                                    </MultiSelectorItem>
                                                ))}
                                            </MultiSelectorList>
                                        </MultiSelectorContent>
                                    </MultiSelector>
                                    <FormDescription>
                                        Assign user to project..
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
;
