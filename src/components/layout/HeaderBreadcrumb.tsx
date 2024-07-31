"use client"

import {ChevronDownIcon} from "lucide-react";
import Link from "next/link";
import {usePathname} from "next/navigation";

import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator} from "@/components/ui/breadcrumb";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";

import {trpc} from "@/utils/trpc";

export default function HeaderBreadcrumb() {

    const path = usePathname()

    if (path === "/") {
        return (
            <div className="flex w-full align-middle justify-start pl-6">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbSeparator/>
                        <BreadcrumbItem>
                            Home
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        )

    } else {

        const project_id = parseInt(path.split("/")[1])
        const projectsById = trpc.getProjectById.useQuery({id: project_id})
        const projects = trpc.getProjects.useQuery()

        return (
            <div className="flex w-full align-middle justify-start pl-6">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbSeparator/>
                        <BreadcrumbItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center gap-1">
                                    {projectsById.data?.name}
                                    <ChevronDownIcon/>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    {projects.data?.map((project) => (
                                        <DropdownMenuItem key={project.id}>
                                            <Link
                                                href={"/" + project.id}>{project.name}</Link></DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        )
    }
}
