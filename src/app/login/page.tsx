"use client"
import {zodResolver} from "@hookform/resolvers/zod"
import Link from "next/link"
import {useForm} from "react-hook-form"
import {z} from "zod"

import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input"
import {login} from "@/app/login/actions";


const formSchema = z.object({
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(4, {message: "Password must be at least 4 characters long"}),
})


export default function Dashboard() {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const error = await login(values)
        if (error) {
            form.setError("email", {message: error})
        }
    }

    return (
        <div className="w-full lg:grid lg:min-h-[600px] xl:min-h-[800px]">
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold">Login</h1>
                        <p className="text-balance text-muted-foreground">
                            Enter your email below to login to your account
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
                                name="password"
                                render={({field}) => {
                                    return (
                                        <FormItem>
                                            <FormLabel id="password">Email</FormLabel>
                                            <FormControl id="password">
                                                <Input type={"password"} placeholder="******" {...field} />
                                            </FormControl>
                                            <FormMessage id="password"/>
                                        </FormItem>)
                                }}/>
                            <Button type="submit" className="w-full">Submit</Button>
                        </form>
                    </Form>
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link href="#" className="underline">
                            Sign up
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    )
}
