"use client"
import {zodResolver} from "@hookform/resolvers/zod"
import Link from "next/link"
import {useForm} from "react-hook-form"
import {z} from "zod"

import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input"

import {signup} from "./actions";

// Define the schema for the form using Zod
const formSchema = z.object({
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(6, {message: "Password must be at least 6 characters long"}),
    username: z.string().min(4, {message: "Username must be at least 4 characters long"}),
})

/**
 * Dashboard component
 *
 * This component renders a login form for the dashboard.
 *
 * @returns {JSX.Element} The rendered dashboard component
 */
export default function Dashboard() {

    // Initialize the form with default values and validation schema
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            username: "",
            password: ""
        },
    })

    /**
     * Handle form submission
     *
     * @param {Object} values - The form values
     * @param {string} values.email - The email entered by the user
     * @param {string} values.password - The password entered by the user
     */
    async function onSubmit(values: z.infer<typeof formSchema>) {
        const error = await signup(values)
        console.log(error)
    }

    return (
        <div className="w-full lg:grid lg:min-h-[600px] xl:min-h-[800px]">
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold">Sign up</h1>
                        <p className="text-balance text-muted-foreground">
                            Create an account to get started
                        </p>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({field}) => {
                                    return (
                                        <FormItem>
                                            <FormLabel id="email">Email</FormLabel>
                                            <FormControl id="email">
                                                <Input placeholder="user@email.com" {...field} />
                                            </FormControl>
                                            <FormMessage id="email"/>
                                        </FormItem>)
                                }}/>
                            <FormField
                                control={form.control}
                                name="username"
                                render={({field}) => {
                                    return (
                                        <FormItem>
                                            <FormLabel id="username">Username</FormLabel>
                                            <FormControl id="username">
                                                <Input placeholder="user123" {...field} />
                                            </FormControl>
                                            <FormMessage id="username"/>
                                        </FormItem>)
                                }}/>
                            <FormField
                                control={form.control}
                                name="password"
                                render={({field}) => {
                                    return (
                                        <FormItem>
                                            <FormLabel id="password">Password</FormLabel>
                                            <FormControl id="password">
                                                <Input type="password" placeholder="******" {...field} />
                                            </FormControl>
                                            <FormMessage id="password"/>
                                        </FormItem>)
                                }}/>
                            <Button type="submit" className="w-full">Submit</Button>
                        </form>
                    </Form>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Link href="/login" className="underline">
                            Login
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    )
}
