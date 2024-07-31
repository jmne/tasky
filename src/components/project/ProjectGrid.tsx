"use client"
import Link from "next/link";

import DeleteProject from "@/components/project/DeleteProject";
import {ModifyProject} from "@/components/project/ModifyProject";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";

import {trpc} from "@/utils/trpc";

export default function ProjectGrid() {

    const projects = trpc.getProjects.useQuery()

    return (
        <div className="flex flex-wrap w-full gap-4 pl-10 pr-10 justify-center">
            {/* Project Card */}
            {projects.data?.map((project) => (
                <div key={project.id} className="m-5 w-auto min-w-[400px]">
                    <Card key={project.id}
                          className="hover:cursor-pointer hover:scale-105 transition">
                        <Link href={"/" + project.id}>
                            <CardHeader>
                                <CardTitle>{project.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {project.description}
                            </CardContent>
                        </Link>
                        <CardFooter className="w-full flex justify-end">
                            <div className="flex align-middle justify-center mt-6">
                                <ModifyProject id={project.id} title={project.name}
                                               description={project.description ? project.description : ""}/>
                                <DeleteProject id={project.id}/>
                            </div>

                        </CardFooter>
                    </Card>
                </div>
            ))}
        </div>
    );


}
