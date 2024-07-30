import {
  PostgrestResponseFailure,
  PostgrestResponseSuccess,
} from '@supabase/postgrest-js';
import { z } from 'zod';

import { procedure, router } from '@/server/trpc';
import { createClient } from '@/utils/supabase/server';

import { Tables } from '../../../types/supabase';

export const projectRouter = router({
  getProjectById: procedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ input }) => {
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
  postProject: procedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ input }) => {
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
});
