import {Search} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';

import HeaderBreadcrumb from "@/components/layout/HeaderBreadcrumb";
import HeaderDropdown from "@/components/layout/HeaderDropdown";
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';

import {createClient} from '@/utils/supabase/server';
import useDarkMode from '@/utils/theme';


export default async function NavigationMenu() {

    const supabase = createClient();
    const {data} = await supabase.auth.getUser();
    if (!data.user?.id) return null;

    return (
        <header
            className='sticky top-0 z-30 m-3 flex h-14 items-center gap-4 border-b px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 rounded-lg'>
            <div className="hover:scale-105">
                <Link href='/' className='content flex items-center py-2'>
                    <Image
                        src='/favicon/android-chrome-192x192.png'
                        alt='Logo'
                        className="rounded-md"
                        width={40}
                        height={40}
                    />
                    <p className='item-body px-2 align-middle text-xl font-bold'>Tasky</p>
                </Link>
            </div>
            <HeaderBreadcrumb/>
            <div className='relative ml-auto flex-1 md:grow-0'>
                <Search className='text-muted-foreground absolute left-2.5 top-2.5 h-4 w-4'/>
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
                    className='invert'
                    alt='Dark Mode'
                    width={30}
                    height={30}
                />
            </Button>
            <HeaderDropdown email={data.user?.email}/>
        </header>
    )
        ;
}
