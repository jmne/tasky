import CreateProject from '@/components/project/CreateProject';
import ProjectGrid from '@/components/project/ProjectGrid';

/**
 * Home component
 *
 * This component renders the main page with a project creation form and a grid of existing projects.
 *
 * @returns {Promise<JSX.Element>} The rendered home component
 */
export default async function Home() {
    return (
        <main className='w-full'>
            <CreateProject />
            <ProjectGrid />
        </main>
    );
}
