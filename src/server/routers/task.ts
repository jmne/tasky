import {
  PostgrestResponseFailure,
  PostgrestResponseSuccess,
} from '@supabase/postgrest-js';
import { z } from 'zod';

import { procedure, router } from '@/server/trpc';
import { createClient } from '@/utils/supabase/server';

import { Tables } from '../../../types/supabase';

export const taskRouter = router({
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
  getTaskAssignees: procedure
    .input(
      z.object({
        project_id: z.number(),
        task_id: z.number(),
      })
    )
    .query(async ({ input }) => {
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
      const { input } = ops;

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
  postTaskAssignment: procedure
    .input(
      z.object({
        task_id: z.number(),
        assignee: z.string(),
      })
    )
    .mutation(async ({ input }) => {
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
  removeTaskAssignment: procedure
    .input(
      z.object({
        task_id: z.number(),
        assignee: z.string(),
      })
    )
    .mutation(async ({ input }) => {
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
      const { input } = ops;

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
  deleteTask: procedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async (ops) => {
      const { input } = ops;

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
