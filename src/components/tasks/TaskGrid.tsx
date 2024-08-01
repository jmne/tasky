"use client"

import React from "react";

import DeleteTask from "@/components/tasks/DeleteTask";
import {ModifyTask} from "@/components/tasks/ModifyTask";
import TaskAvatarStack from "@/components/tasks/TaskAvatarStack";
import {Badge} from "@/components/ui/badge";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";

import {trpc} from "@/utils/trpc";

export default function TaskGrid({project_id}: { project_id: number }) {
    const {data: tasks} = trpc.getTasks.useQuery({project_id});

    // TODO: Check for project assignment

    if (!tasks) return <div className="m-10">Loading..</div>;

    if (tasks.length === 0) return <div className="m-10">No tasks to show..</div>;

    return (
        <div className="w-full flex flex-wrap gap-4 justify-center p-10 pr-10">
            {tasks?.map((task) => {
                    return (
                        <div key={task.id} className="min-w-[500px] mt-5">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="w-full text-start align-text-bottom h-12">
                                        <div className="w-full flex">
                                            <p className="w-2/3 p-1">{task.name}</p>
                                            {/*TODO: Owner of project should be displayed as first avatar*/}
                                            <TaskAvatarStack task_id={task.id} project_id={project_id}/>
                                        </div>
                                    </CardTitle>
                                    <Separator/>
                                </CardHeader>
                                <CardContent>
                                    <div className="w-full p-1 mb-6 whitespace-pre-wrap">{task.content}</div>
                                    <Separator/>
                                </CardContent>
                                <CardFooter className="w-full">
                                    <div className="w-full flex justify-end">
                                        <div className="flex justify-start w-full">
                                            <Badge variant="secondary" className="p-2">Priority: {task.priority}</Badge>
                                            <Badge variant="secondary" className="p-2 ml-2">{task.status}</Badge>
                                        </div>
                                        <ModifyTask id={task.id} title={task.name}
                                                    content={task.content ? task.content : ""}
                                                    status={task.status ? task.status : "To-Do"}
                                                    priority={task.priority ? task.priority : 0}
                                        />
                                        <DeleteTask id={task.id}/>
                                    </div>
                                </CardFooter>
                            </Card>
                        </div>
                    )
                }
            )}
        </div>
    );
}
