'use client';

import {ChevronDownIcon} from 'lucide-react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';

import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator,} from '@/components/ui/breadcrumb';
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from '@/components/ui/dropdown-menu';

import {trpc} from '@/utils/trpc';

/**
 * HeaderBreadcrumb component
 *
 * This component renders a breadcrumb navigation with a dropdown menu for project selection.
 *
 * @returns {JSX.Element} The rendered breadcrumb component
 */
export default function HeaderBreadcrumb() {
    const path = usePathname();
    const project_id = parseInt(path.split('/')[1]);
    const projects = trpc.getProjects.useQuery();
    const projectsById = trpc.getProjectById.useQuery({
        id: project_id ? project_id : 1,
    });

    if (path === '/' || !projectsById.data) {
        return (
            <div className='flex w-full justify-start pl-6 align-middle'>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbSeparator/>
                        <BreadcrumbItem>Home</BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        );
    } else {
        return (
            <div className='flex w-full justify-start pl-6 align-middle'>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbSeparator/>
                        <BreadcrumbItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger className='flex items-center gap-1'>
                                    {projectsById.data?.name}
                                    <ChevronDownIcon/>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align='start'>
                                    {projects.data?.map((project) => (
                                        <Link href={'/' + project.id} key={project.id}>
                                            <DropdownMenuItem key={project.id}>
                                                {project.name}
                                            </DropdownMenuItem>
                                        </Link>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        );
    }
}
