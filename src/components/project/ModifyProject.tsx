"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import React from "react";
import {useForm} from "react-hook-form"
import {z} from "zod"

import {Button} from "@/components/ui/button"
import {Dialog, DialogContent, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea";

import {trpc} from "@/utils/trpc";

const formSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
})

export function ModifyProject({id, title, description}: {
    id: number,
    title: string,
    description: string,
}) {

    const {mutate} = trpc.postProject.useMutation({
        onSuccess: () => {
            // To-do: Add toast notification
            console.log("Project updated")
        },
        onError: (error) => {
            console.error(error)
        }
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: id,
            name: title,
            description: description,
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        mutate({
            id: id,
            name: values.name,
            description: values.description,
        })
        setOpen(false);
        window.location.reload();
    }

    const [open, setOpen] = React.useState(false)

    const {reset} = form;
    const {isSubmitSuccessful} = form.formState;

    React.useEffect(() => {
        isSubmitSuccessful && reset()

    }, [isSubmitSuccessful, reset])
    return (
        <Dialog open={open} onOpenChange={setOpen}> <DialogTrigger asChild>
            <Button>Edit</Button>
        </DialogTrigger>
            <DialogContent aria-describedby="Project">
                <DialogTitle>
                    Edit project
                </DialogTitle>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Project title</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Project description</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">Save</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
