'use client';
import { AvatarStack } from '@/components/ui/avatarstack';

import { trpc } from '@/utils/trpc';

export default function ProjectAvatarStack({
  project_id,
}: {
  project_id: number;
}) {
  const assignees = trpc.getProjectAssignees.useQuery({
    project_id: project_id,
  });

  return (
    <AvatarStack
      avatars={
        assignees.data
          ? assignees.data.map((data) => {
              return {
                name: data.username ? data.username : '',
                image: data.avatar_url ? data.avatar_url : '',
              };
            })
          : []
      }
      className='w-1/2 justify-start'
      maxAvatarsAmount={3}
    />
  );
}
