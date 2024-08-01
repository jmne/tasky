import {PostgrestResponseFailure, PostgrestResponseSuccess,} from '@supabase/postgrest-js';
import {z} from 'zod';

import {procedure, router} from '@/server/trpc';
import {createClient} from '@/utils/supabase/server';

import {Tables} from '../../../types/supabase';

/**
 * Router for task-related operations.
 */
export const taskRouter = router({
    /**
     * Fetches tasks for a given project.
     * @param {Object} ops - The input object.
     * @param {number} ops.input.project_id - The ID of the project.
     * @returns {Promise<Tables<'task'>[]>} - The list of tasks.
     */
    getTasks: procedure
        .input(
            z.object({
                project_id: z.number(),
            })
        )
        .query(async (ops) => {
            const supabase = createClient();

            const tasks:
                | PostgrestResponseSuccess<Tables<'task'>[]>
                | PostgrestResponseFailure = await supabase
                .from('task')
                .select('*')
                .eq('project', ops.input.project_id)
                .order('name')
                .returns<Tables<'task'>[]>();
            if (tasks.error) {
                throw new Error(tasks.error.message);
            }
            return tasks.data;
        }),

    /**
     * Fetches a task by its ID.
     * @param {Object} ops - The input object.
     * @param {number} ops.input.task_id - The ID of the task.
     * @returns {Promise<Tables<'task'>>} - The task data.
     */
    getTaskById: procedure
        .input(
            z.object({
                task_id: z.number(),
            })
        )
        .query(async (ops) => {
            const supabase = createClient();

            const task:
                | PostgrestResponseSuccess<Tables<'task'>>
                | PostgrestResponseFailure = await supabase
                .from('task')
                .select('*')
                .eq('id', ops.input.task_id)
                .single<Tables<'task'>>();
            if (task.error) {
                throw new Error(task.error.message);
            }
            return task.data;
        }),

    /**
     * Fetches assignees for a given task.
     * @param {Object} input - The input object.
     * @param {number} input.project_id - The ID of the project.
     * @param {number} input.task_id - The ID of the task.
     * @returns {Promise<Tables<'profile'>[]>} - The list of assignee profiles.
     */
    getTaskAssignees: procedure
        .input(
            z.object({
                project_id: z.number(),
                task_id: z.number(),
            })
        )
        .query(async ({input}) => {
            const supabase = createClient();

            const assignees:
                | PostgrestResponseSuccess<Tables<'assignment_task'>[]>
                | PostgrestResponseFailure = await supabase
                .from('assignment_task')
                .select('assignee')
                .eq('task_id', input.task_id)
                .returns<Tables<'assignment_task'>[]>();
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
     * Updates a task.
     * @param {Object} ops - The input object.
     * @param {number} ops.input.id - The ID of the task.
     * @param {string} ops.input.name - The name of the task.
     * @param {string|null} ops.input.content - The content of the task.
     * @param {number|null} ops.input.priority - The priority of the task.
     * @param {('To-Do'|'In progress'|'Done')|null} ops.input.status - The status of the task.
     * @returns {Promise<Tables<'task'>>} - The updated task data.
     */
    postTask: procedure
        .input(
            z.object({
                id: z.number(),
                name: z.string(),
                content: z.string().nullable(),
                priority: z.number().nullable(),
                status: z.enum(['To-Do', 'In progress', 'Done']).nullable(),
            })
        )
        .mutation(async (ops) => {
            const {input} = ops;

            const supabase = createClient();

            const task:
                | PostgrestResponseSuccess<Tables<'task'>>
                | PostgrestResponseFailure = await supabase
                .schema('public')
                .from('task')
                .update({
                    name: input.name,
                    content: input.content,
                    priority: input.priority,
                    status: input.status,
                })
                .eq('id', input.id)
                .returns();
            if (task.error) {
                throw new Error(task.error.message);
            }
            return task.data;
        }),

    /**
     * Assigns a user to a task.
     * @param {Object} input - The input object.
     * @param {number} input.task_id - The ID of the task.
     * @param {string} input.assignee - The username of the assignee.
     * @returns {Promise<Tables<'assignment_task'>[]>} - The task assignment data.
     */
    postTaskAssignment: procedure
        .input(
            z.object({
                task_id: z.number(),
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

            const task:
                | PostgrestResponseSuccess<Tables<'assignment_task'>[]>
                | PostgrestResponseFailure = await supabase
                .from('assignment_task')
                .insert({
                    task_id: input.task_id,
                    assignee: uid,
                })
                .returns<Tables<'assignment_task'>[]>();
            if (task.error) {
                throw new Error(task.error.message);
            }
            return task.data;
        }),

    /**
     * Removes a user from a task assignment.
     * @param {Object} input - The input object.
     * @param {number} input.task_id - The ID of the task.
     * @param {string} input.assignee - The username of the assignee.
     * @returns {Promise<Tables<'assignment_task'>[]>} - The task assignment data.
     */
    removeTaskAssignment: procedure
        .input(
            z.object({
                task_id: z.number(),
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

            const task:
                | PostgrestResponseSuccess<Tables<'assignment_task'>[]>
                | PostgrestResponseFailure = await supabase
                .from('assignment_task')
                .delete()
                .eq('task_id', input.task_id)
                .eq('assignee', uid)
                .returns<Tables<'assignment_task'>[]>();
            if (task.error) {
                throw new Error(task.error.message);
            }
            return task.data;
        }),

    /**
     * Creates a new task.
     * @param {Object} ops - The input object.
     * @param {string} ops.input.name - The name of the task.
     * @param {string|null} ops.input.content - The content of the task.
     * @param {number|null} ops.input.priority - The priority of the task.
     * @param {('To-Do'|'In progress'|'Done')|null} ops.input.status - The status of the task.
     * @param {number} ops.input.project - The ID of the project.
     * @returns {Promise<Tables<'task'>>} - The created task data.
     */
    createTask: procedure
        .input(
            z.object({
                name: z.string(),
                content: z.string().nullable(),
                priority: z.number().nullable(),
                status: z.enum(['To-Do', 'In progress', 'Done']).nullable(),
                project: z.number(),
            })
        )
        .mutation(async (ops) => {
            const {input} = ops;

            const supabase = createClient();

            const task:
                | PostgrestResponseSuccess<Tables<'task'>>
                | PostgrestResponseFailure = await supabase
                .schema('public')
                .from('task')
                .insert({
                    name: input.name,
                    content: input.content,
                    priority: input.priority,
                    status: input.status,
                    project: input.project,
                })
                .returns();
            if (task.error) {
                throw new Error(task.error.message);
            }
            return task.data;
        }),

    /**
     * Deletes a task.
     * @param {Object} ops - The input object.
     * @param {number} ops.input.id - The ID of the task.
     * @returns {Promise<Tables<'task'>>} - The deleted task data.
     */
    deleteTask: procedure
        .input(
            z.object({
                id: z.number(),
            })
        )
        .mutation(async (ops) => {
            const {input} = ops;

            const supabase = createClient();

            const task:
                | PostgrestResponseSuccess<Tables<'task'>>
                | PostgrestResponseFailure = await supabase
                .schema('public')
                .from('task')
                .delete()
                .eq('id', input.id)
                .returns();
            if (task.error) {
                throw new Error(task.error.message);
            }
            return task.data;
        }),
});
