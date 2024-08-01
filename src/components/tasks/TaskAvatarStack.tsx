'use client';
import { AvatarStack } from '@/components/ui/avatarstack';

import { trpc } from '@/utils/trpc';

export default function TaskAvatarStack({
  task_id,
  project_id,
}: {
  task_id: number;
  project_id: number;
}) {
  const assignees = trpc.getTaskAssignees.useQuery({ project_id, task_id });

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
      className='w-1/3 justify-end'
      maxAvatarsAmount={3}
    />
  );
}
