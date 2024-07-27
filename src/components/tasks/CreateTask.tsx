import { PlusIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export default function CreateTask() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          size='icon'
          className='absolute bottom-5 right-10 z-50 h-16 w-16 rounded-full'
        >
          <PlusIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[700px]'>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Input
              id='title'
              placeholder='Task title'
              className='col-span-full focus:outline-none focus:ring-0 focus-visible:ring-0'
            />
          </div>
          <form>
            <div className='mb-4 w-full rounded-lg border'>
              <div className='0 flex items-center justify-between border-b px-3 py-2'>
                <div className='flex flex-wrap items-center sm:divide-x sm:rtl:divide-x-reverse'>
                  <div className='flex items-center space-x-1 rtl:space-x-reverse sm:pe-4'>
                    <button
                      type='button'
                      className='cursor-pointer rounded p-2 '
                    >
                      <svg
                        className='h-4 w-4'
                        aria-hidden='true'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 12 20'
                      >
                        <path
                          stroke='currentColor'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='M1 6v8a5 5 0 1 0 10 0V4.5a3.5 3.5 0 1 0-7 0V13a2 2 0 0 0 4 0V6'
                        />
                      </svg>
                      <span className='sr-only'>Attach file</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className='rounded-b-lg px-4 py-2'>
                <textarea
                  id='editor'
                  className='block w-full bg-transparent px-0 text-sm ring-0 focus:outline-none focus:ring-0'
                  placeholder='Very important stuff..'
                  required
                  rows={10}
                ></textarea>
              </div>
            </div>
          </form>
        </div>
        <DialogFooter>
          <Button type='submit'>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
