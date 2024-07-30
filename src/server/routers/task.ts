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
});
