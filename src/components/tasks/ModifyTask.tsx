"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import React from "react";
import {useForm} from "react-hook-form"
import {z} from "zod"

import {Button} from "@/components/ui/button"
import {Dialog, DialogContent, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";

import {trpc} from "@/utils/trpc";

const formSchema = z.object({
    name: z.string(),
    content: z.string(),
    priority: z.number(),
    status: z.enum(["To-Do", "In progress", "Done"]),
})

/**
 * ModifyTask component
 *
 * This component renders a dialog form to modify a task with the given properties.
 *
 * @param {Object} props - The component props
 * @param {number} props.id - The ID of the task to be modified
 * @param {string} props.title - The title of the task
 * @param {string} props.content - The content/description of the task
 * @param {number} props.priority - The priority of the task
 * @param {"To-Do" | "In progress" | "Done"} props.status - The status of the task
 * @returns {JSX.Element} The rendered dialog form component
 */
export function ModifyTask({id, title, content, priority, status}: {
    id: number,
    title: string,
    content: string,
    priority: number,
    // TODO: Receive enum from backend
    status: "To-Do" | "In progress" | "Done"
}) {

    const {mutate} = trpc.postTask.useMutation({
        onSuccess: () => {
            // TODO:: Add toast notification
            console.log("Task updated")
        },
        onError: (error) => {
            console.error(error)
        }
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: title,
            content: content,
            priority: priority,
            status: status,
        },
    })

    /**
     * Handles form submission
     *
     * @param {Object} values - The form values
     */
    function onSubmit(values: z.infer<typeof formSchema>) {
        mutate({
            id: id,
            name: values.name,
            content: values.content,
            priority: values.priority,
            status: values.status
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
            <DialogContent aria-describedby="Task">
                <DialogTitle>
                    Edit task
                </DialogTitle>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Task title</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="content"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Task description</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <div className="flex grid-cols-2 w-full justify-center gap-10">
                            <FormField
                                control={form.control}
                                name="status"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Task status</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Select status"/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Status</SelectLabel>
                                                        <SelectItem value="To-Do">To-Do</SelectItem>
                                                        <SelectItem value="In progress">In progress</SelectItem>
                                                        <SelectItem value="Done">Done</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="priority"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Task priority</FormLabel>
                                        <FormControl>
                                            <Input onChange={event => field.onChange(+event.target.value)}
                                                   value={field.value}
                                                   type="number"/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button type="submit" className="w-full">Save</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
