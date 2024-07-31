import CreateProject from '@/components/project/CreateProject';
import ProjectGrid from '@/components/project/ProjectGrid';

export default async function Home() {
  return (
    <main className='w-full'>
      <CreateProject />
      <ProjectGrid />
    </main>
  );
}
