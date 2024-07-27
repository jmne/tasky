'use server';

import { Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

import { createClient } from '@/utils/supabase/server';
import useDarkMode from '@/utils/theme';

const supabase = createClient();
const { data } = await supabase.auth.getUser();

export default async function NavigationMenuDemo() {
  return (
    <header className='bg-background sticky top-0 z-30 m-3 flex h-14 items-center gap-4 border-b px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6'>
      <Link href='/' className='content flex items-center py-2'>
        <Image
          src='/favicon/android-chrome-192x192.png'
          alt='Logo'
          width={40}
          height={40}
        />
        <p className='item-body px-2 align-middle text-xl font-bold'>Tasky</p>
      </Link>
      <div className='relative ml-auto flex-1 md:grow-0'>
        <Search className='text-muted-foreground absolute left-2.5 top-2.5 h-4 w-4' />
        <Input
          type='search'
          placeholder='Search...'
          className='bg-background w-full rounded-lg pl-8 md:w-[200px] lg:w-[336px]'
        />
      </div>
      <Button
        size='icon'
        onClick={useDarkMode}
        className='overflow-hidden rounded-full bg-transparent hover:bg-transparent'
      >
        <Image
          src='/images/darkmode.png'
          id='darkmode-icon'
          className=''
          alt='Dark Mode'
          width={30}
          height={30}
        />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='outline'
            size='icon'
            className='overflow-hidden rounded-full'
          >
            <Avatar>
              <AvatarFallback>
                {data.user?.email?.substring(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>{data.user?.email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
