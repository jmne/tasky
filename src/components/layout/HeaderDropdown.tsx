"use client"
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import {logout} from "@/app/login/actions";
import {trpc} from "@/utils/trpc";


export default function HeaderDropdown({email, id}: {
    email?: string | undefined
    id: string
}) {

    const user = trpc.getUser.useQuery({id: id})

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant='outline'
                    size='icon'
                    className='overflow-hidden rounded-full min-w-fit'
                >
                    <Avatar>
                        <AvatarFallback>
                            {user?.data?.username ? user.data.username.substring(0, 1).toUpperCase() : 'U'}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                <DropdownMenuLabel
                    className="font-bold">{user?.data?.username ? user.data.username : ""} ({email})</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuItem onClick={() => logout()}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
