"use client"

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";

import {trpc} from "@/utils/trpc";
import {ModifyTask} from "@/components/tasks/ModifyTask";
import DeleteTask from "@/components/tasks/DeleteTask";

export default function TaskGrid({project_id}: { project_id: number }) {
    const {data: tasks} = trpc.getTasks.useQuery({project_id});

    if (!tasks) return <div className={"m-10"}>Loading</div>;

    if (tasks.length === 0) return <div className={"m-10"}>No tasks to show..</div>;

    return (
        <div className="w-full flex flex-wrap gap-4 justify-center p-10 pr-10">
            {tasks.map((task) => (
                <div key={task.id} className="min-w-[500px] mt-5">
                    <Card>
                        <CardHeader>
                            <CardTitle className="w-full text-center">
                                <p className="w-full p-1">{task.name}</p>
                            </CardTitle>
                            <Separator/>
                        </CardHeader>
                        <CardContent>
                            <p className="w-full p-1">{task.content}</p>
                            <div className={"flex align-middle justify-center mt-6"}>
                                <ModifyTask id={task.id} title={task.name} content={task.content ? task.content : ""}
                                            status={task.status ? task.status : "To-Do"}
                                            priority={task.priority ? task.priority : 0}
                                />
                                <DeleteTask id={task.id}/>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ))}
        </div>
    );
}
