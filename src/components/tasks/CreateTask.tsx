"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {PlusIcon} from "lucide-react";
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
 * Component for creating a new task.
 *
 * @param {Object} props - The component props.
 * @param {number} props.project_id - The ID of the project to which the task belongs.
 * @returns {JSX.Element} The rendered component.
 */
export default function CreateTask({project_id}: { project_id: number }) {

    const {mutate} = trpc.createTask.useMutation({
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
            name: "",
            content: "",
            priority: 0,
            status: "To-Do",
        },
    })

    /**
     * Handles form submission for creating a new task.
     *
     * @param {Object} values - The form values.
     * @param {string} values.name - The name of the task.
     * @param {string} values.content - The content/description of the task.
     * @param {number} values.priority - The priority of the task.
     * @param {string} values.status - The status of the task.
     */
    function onSubmit(values: z.infer<typeof formSchema>) {
        mutate({
            name: values.name,
            content: values.content,
            priority: values.priority,
            status: values.status,
            project: project_id,
        })
        setOpen(false);
    }

    const [open, setOpen] = React.useState(false)

    const {reset} = form;
    const {isSubmitSuccessful} = form.formState;

    React.useEffect(() => {
        isSubmitSuccessful && reset()

    }, [isSubmitSuccessful, reset])
    return (
        <Dialog open={open} onOpenChange={setOpen}> <DialogTrigger asChild>
            <Button
                variant='outline'
                size='icon'
                className='absolute bottom-5 right-10 z-50 h-16 w-16 rounded-full'
            >
                <PlusIcon/>
            </Button>
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
