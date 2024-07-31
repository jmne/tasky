import * as React from 'react';

import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <header className='sticky top-0 z-30 m-3 flex h-14 items-center gap-4 rounded-lg border-b px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6'>
      <Skeleton className='h-10 w-10 rounded-full' />
      <p className='item-body px-2 align-middle text-xl font-bold'>Tasky</p>
      <div className='relative ml-auto flex-1 md:grow-0'>
        <Skeleton className='text-muted-foreground absolute left-2.5 top-2.5 h-4 w-4' />
        <Skeleton className='bg-background w-full rounded-lg pl-8 md:w-[200px] lg:w-[336px]' />
      </div>
      <Skeleton className='overflow-hidden rounded-full bg-transparent hover:bg-transparent' />
      <Skeleton className='rounded-full' />
    </header>
  );
}
