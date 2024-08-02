import {zodResolver} from "@hookform/resolvers/zod";
import {UserIcon} from "lucide-react";
import React from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";

import {Button} from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input"

import {trpc} from "@/utils/trpc";

const formSchema = z.object({
    username: z.string(),
})

/**
 * AssignProject component
 *
 * This component renders a dialog form to assign or remove a user from a project.
 *
 * @param {Object} props - The component props
 * @param {number} props.project_id - The ID of the project
 * @returns {JSX.Element} The rendered dialog form component
 */
export default function AssignProject({project_id}: { project_id: number }) {

    const mutatePost = trpc.postProjectAssignment.useMutation({
        onSuccess: () => {
            // TODO:: Add toast notification
            console.log("Project updated")
        },
        onError: (error) => {
            console.error(error)
        }
    })

    const mutateDel = trpc.removeProjectAssignment.useMutation({
        onSuccess: () => {
            // TODO:: Add toast notification
            console.log("Project updated")
        },
        onError: (error) => {
            console.error(error)
        }
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
        },
    })

    /**
     * Handles form submission for adding a user to the project
     *
     * @param {Object} values - The form values
     */
    function onSubmit(values: z.infer<typeof formSchema>) {

        mutatePost.mutate({
            project_id: project_id,
            assignee: values.username,
        })
        setOpen(false);
    }

    /**
     * Handles form submission for removing a user from the project
     *
     * @param {Object} values - The form values
     */
    function onSubmitDel(values: z.infer<typeof formSchema>) {

        mutateDel.mutate({
            project_id: project_id,
            assignee: values.username,
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
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="ml-2"><UserIcon></UserIcon></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Project assignment</DialogTitle>
                    <DialogDescription>
                        Add or remove people from this project
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} onReset={form.handleSubmit(onSubmitDel)}
                          className="space-y-4">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Username" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit">Add</Button>
                            <Button type="reset" variant="destructive">Remove</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
