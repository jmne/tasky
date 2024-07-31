"use client"
import CreateTask from "@/components/tasks/CreateTask";
import TaskGrid from "@/components/tasks/TaskGrid";

export default function ProjectHome({params}: { params: { project: string } }) {

    const project_id = parseInt(params.project)

    return (
        // tailwind Grid with dynamical count of tasks in a project
        <main className='w-full'>
            <CreateTask project_id={project_id}/>
            <TaskGrid project_id={project_id}/>
        </main>
    )
}
