"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {PlusIcon} from "lucide-react";
import React, {useEffect} from "react";
import {useForm} from "react-hook-form"
import {z} from "zod"

import {Button} from "@/components/ui/button"
import {Dialog, DialogContent, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea";

import {supabase} from "@/utils/supabase/client";
import {trpc} from "@/utils/trpc";

const formSchema = z.object({
    name: z.string(),
    description: z.string(),
    owner: z.string(),
})

/**
 * CreateProject component
 *
 * This component renders a dialog form to create a new project with the given properties.
 *
 * @returns {JSX.Element} The rendered dialog form component
 */
export default function CreateProject() {

    const {mutate} = trpc.createProject.useMutation({
        onSuccess: () => {
            // TODO:: Add toast notification
            console.log("Project created successfully")
        },
        onError: (error) => {
            // TODO:: Add toast notification
            console.error(error)
        }
    })

    useEffect(() => {
        const fetchUser = async () => {
            const {data} = await supabase.auth.getUser();
            form.setValue("owner", data?.user?.id ? data.user.id : "");
        };
        fetchUser();
    }, [supabase.auth]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    })

    /**
     * Handles form submission
     *
     * @param {Object} values - The form values
     */
    function onSubmit(values: z.infer<typeof formSchema>) {
        mutate({
            name: values.name,
            description: values.description,
            owner: values.owner,
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
