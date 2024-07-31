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

interface HeaderDropdownProps {
    email?: string | undefined
}

export default function HeaderDropdown({email}: HeaderDropdownProps) {
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
                            {email ? email.substring(0, 1).toUpperCase() : 'U'}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                <DropdownMenuLabel>{email}</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuItem onClick={() => logout()}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
