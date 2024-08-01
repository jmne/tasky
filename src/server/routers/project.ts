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
  getProjectAssignees: procedure
    .input(z.object({ project_id: z.number() }))
    .query(async ({ input }) => {
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
  postProjectAssignment: procedure
    .input(
      z.object({
        project_id: z.number(),
        assignee: z.string().array(),
      })
    )
    .mutation(async ({ input }) => {
      const supabase = createClient();

      for (const assignee of input.assignee) {
        const project:
          | PostgrestResponseSuccess<Tables<'assignment_project'>[]>
          | PostgrestResponseFailure = await supabase
          .from('assignment_project')
          .insert({
            project_id: input.project_id,
            assignee: assignee,
          })
          .returns<Tables<'assignment_project'>[]>();
        if (project.error) {
          throw new Error(project.error.message);
        }
      }
    }),
  createProject: procedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        owner: z.string(),
      })
    )
    .mutation(async ({ input }) => {
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
  deleteProject: procedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input }) => {
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
