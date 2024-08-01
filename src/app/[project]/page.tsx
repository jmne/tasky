"use client"
import CreateTask from "@/components/tasks/CreateTask";
import TaskGrid from "@/components/tasks/TaskGrid";

/**
 * Renders the home page for a specific project.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.params - The route parameters.
 * @param {string} props.params.project - The project ID as a string.
 * @returns {JSX.Element} The rendered component.
 */
export default function ProjectHome({params}: { params: { project: string } }) {

    const project_id = parseInt(params.project)

    return (
        <main className='w-full'>
            <CreateTask project_id={project_id}/>
            <TaskGrid project_id={project_id}/>
        </main>
    )
}
