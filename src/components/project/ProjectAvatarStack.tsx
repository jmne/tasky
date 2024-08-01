'use client';
import { AvatarStack } from '@/components/ui/avatarstack';
import { trpc } from '@/utils/trpc';

/**
 * ProjectAvatarStack component
 *
 * This component renders a stack of avatars for the assignees of a project.
 *
 * @param {Object} props - The component props
 * @param {number} props.project_id - The ID of the project
 * @returns {JSX.Element} The rendered avatar stack component
 */
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
