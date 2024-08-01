import {PostgrestResponseFailure, PostgrestResponseSuccess,} from '@supabase/postgrest-js';
import {z} from 'zod';

import {procedure, router} from '@/server/trpc';
import {createClient} from '@/utils/supabase/server';

import {Tables} from '../../../types/supabase';

/**
 * Router for handling project-related operations.
 */
export const projectRouter = router({
    /**
     * Retrieves a project by its ID.
     *
     * @param {Object} input - The input object.
     * @param {number} input.id - The ID of the project.
     * @returns {Promise<Tables<'project'>>} The project data.
     * @throws Will throw an error if the project retrieval fails.
     */
    getProjectById: procedure
        .input(
            z.object({
                id: z.number(),
            })
        )
        .query(async ({input}) => {
            const supabase = createClient();

            const projects:
                | PostgrestResponseSuccess<Tables<'project'>>
                | PostgrestResponseFailure = await supabase
                .from('project')
                .select('*')
                .eq('id', input.id)
                .single<Tables<'project'>>();
            if (projects.error) {
                throw new Error(projects.error.message);
            }
            return projects.data;
        }),

    /**
     * Retrieves all projects.
     *
     * @returns {Promise<Tables<'project'>[]>} The list of projects.
     * @throws Will throw an error if the project retrieval fails.
     */
    getProjects: procedure.query(async () => {
        const supabase = createClient();

        const projects:
            | PostgrestResponseSuccess<Tables<'project'>[]>
            | PostgrestResponseFailure = await supabase
            .from('project')
            .select('*')
            .order('name')
            .returns<Tables<'project'>[]>();
        if (projects.error) {
            throw new Error(projects.error.message);
        }
        return projects.data;
    }),

    /**
     * Retrieves the assignees of a project.
     *
     * @param {Object} input - The input object.
     * @param {number} input.project_id - The ID of the project.
     * @returns {Promise<Tables<'profile'>[]>} The list of assignees.
     * @throws Will throw an error if the assignee retrieval fails.
     */
    getProjectAssignees: procedure
        .input(z.object({project_id: z.number()}))
        .query(async ({input}) => {
            const supabase = createClient();

            const assignees:
                | PostgrestResponseSuccess<Tables<'assignment_project'>[]>
                | PostgrestResponseFailure = await supabase
                .from('assignment_project')
                .select('assignee')
                .eq('project_id', input.project_id)
                .returns<Tables<'assignment_project'>[]>();
            if (assignees.error) {
                throw new Error(assignees.error.message);
            }

            const assigneProfiles:
                | PostgrestResponseSuccess<Tables<'profile'>[]>
                | PostgrestResponseFailure = await supabase
                .from('profile')
                .select('*')
                .in(
                    'id',
                    assignees.data.map((assignee) => assignee.assignee)
                )
                .returns<Tables<'profile'>[]>();

            if (assigneProfiles.error) {
                throw new Error(assigneProfiles.error.message);
            }

            return assigneProfiles.data;
        }),

    /**
     * Updates a project.
     *
     * @param {Object} input - The input object.
     * @param {number} input.id - The ID of the project.
     * @param {string} input.name - The name of the project.
     * @param {string} input.description - The description of the project.
     * @returns {Promise<Tables<'project'>[]>} The updated project data.
     * @throws Will throw an error if the project update fails.
     */
    postProject: procedure
        .input(
            z.object({
                id: z.number(),
                name: z.string(),
                description: z.string(),
            })
        )
        .mutation(async ({input}) => {
            const supabase = createClient();

            const project:
                | PostgrestResponseSuccess<Tables<'project'>[]>
                | PostgrestResponseFailure = await supabase
                .from('project')
                .update({
                    id: input.id,
                    name: input.name,
                    description: input.description,
                })
                .eq('id', input.id)
                .returns<Tables<'project'>[]>();
            if (project.error) {
                throw new Error(project.error.message);
            }
            return project.data;
        }),

    /**
     * Assigns a user to a project.
     *
     * @param {Object} input - The input object.
     * @param {number} input.project_id - The ID of the project.
     * @param {string} input.assignee - The username of the assignee.
     * @returns {Promise<Tables<'assignment_project'>[]>} The assignment data.
     * @throws Will throw an error if the assignment fails.
     */
    postProjectAssignment: procedure
        .input(
            z.object({
                project_id: z.number(),
                assignee: z.string(),
            })
        )
        .mutation(async ({input}) => {
            const supabase = createClient();

            const profile = await supabase
                .from('profile')
                .select('id')
                .eq('username', input.assignee)
                .single<Tables<'profile'>>();

            const uid = profile.data?.id ? profile.data.id : '';

            const project:
                | PostgrestResponseSuccess<Tables<'assignment_project'>[]>
                | PostgrestResponseFailure = await supabase
                .from('assignment_project')
                .insert({
                    project_id: input.project_id,
                    assignee: uid,
                })
                .returns<Tables<'assignment_project'>[]>();
            if (project.error) {
                throw new Error(project.error.message);
            }
            return project.data;
        }),

    /**
     * Removes a user from a project.
     *
     * @param {Object} input - The input object.
     * @param {number} input.project_id - The ID of the project.
     * @param {string} input.assignee - The username of the assignee.
     * @returns {Promise<Tables<'assignment_project'>[]>} The updated assignment data.
     * @throws Will throw an error if the removal fails.
     */
    removeProjectAssignment: procedure
        .input(
            z.object({
                project_id: z.number(),
                assignee: z.string(),
            })
        )
        .mutation(async ({input}) => {
            const supabase = createClient();

            const profile = await supabase
                .from('profile')
                .select('id')
                .eq('username', input.assignee)
                .single<Tables<'profile'>>();

            const uid = profile.data?.id ? profile.data.id : '';

            const project:
                | PostgrestResponseSuccess<Tables<'assignment_project'>[]>
                | PostgrestResponseFailure = await supabase
                .from('assignment_project')
                .delete()
                .eq('project_id', input.project_id)
                .eq('assignee', uid)
                .returns<Tables<'assignment_project'>[]>();
            if (project.error) {
                throw new Error(project.error.message);
            }
            return project.data;
        }),

    /**
     * Creates a new project.
     *
     * @param {Object} input - The input object.
     * @param {string} input.name - The name of the project.
     * @param {string} input.description - The description of the project.
     * @param {string} input.owner - The owner of the project.
     * @returns {Promise<Tables<'project'>[]>} The created project data.
     * @throws Will throw an error if the project creation fails.
     */
    createProject: procedure
        .input(
            z.object({
                name: z.string(),
                description: z.string(),
                owner: z.string(),
            })
        )
        .mutation(async ({input}) => {
            const supabase = createClient();

            const project:
                | PostgrestResponseSuccess<Tables<'project'>[]>
                | PostgrestResponseFailure = await supabase
                .from('project')
                .insert({
                    name: input.name,
                    description: input.description,
                    owner: input.owner,
                })
                .returns<Tables<'project'>[]>();
            if (project.error) {
                throw new Error(project.error.message);
            }
            return project.data;
        }),

    /**
     * Deletes a project.
     *
     * @param {Object} input - The input object.
     * @param {number} input.id - The ID of the project.
     * @returns {Promise<Tables<'project'>[]>} The deleted project data.
     * @throws Will throw an error if the project deletion fails.
     */
    deleteProject: procedure
        .input(
            z.object({
                id: z.number(),
            })
        )
        .mutation(async ({input}) => {
            const supabase = createClient();

            const project:
                | PostgrestResponseSuccess<Tables<'project'>[]>
                | PostgrestResponseFailure = await supabase
                .from('project')
                .delete()
                .eq('id', input.id)
                .returns<Tables<'project'>[]>();
            if (project.error) {
                throw new Error(project.error.message);
            }
            return project.data;
        }),
});
