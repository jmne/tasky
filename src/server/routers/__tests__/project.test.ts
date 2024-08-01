import {projectRouter} from '@/server/routers/project';
import {createClient} from '@/utils/supabase/server';

jest.mock('@/utils/supabase/server');

describe('projectRouter', () => {
    describe('getProjectById', () => {
        it('retrieves a project by its ID', async () => {
            const mockClient = {
                from: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({data: {id: 1, name: 'Test Project'}, error: null}),
            };
            (createClient as jest.Mock).mockReturnValue(mockClient);

            const result = await projectRouter.getProjectById({
                ctx: {},
                rawInput: {id: 1},
                path: 'getProjectById',
                type: 'query'
            });
            expect(result).toEqual({id: 1, name: 'Test Project'});
        });

        it('throws an error if the project retrieval fails', async () => {
            const mockClient = {
                from: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({data: null, error: {message: 'Error'}}),
            };
            (createClient as jest.Mock).mockReturnValue(mockClient);

            await expect(projectRouter.getProjectById({
                ctx: {},
                rawInput: {id: 1},
                path: 'getProjectById',
                type: 'query'
            })).rejects.toThrow('Error');
        });
    });

    describe('getProjects', () => {
        it('retrieves all projects', async () => {
            const mockClient = {
                from: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                order: jest.fn().mockReturnThis(),
                mockResolvedValue: jest.fn().mockResolvedValue({data: [{id: 1, name: 'Test Project'}], error: null}),
            };
            (createClient as jest.Mock).mockReturnValue(mockClient);

            const result = await projectRouter.getProjects({ctx: {}, rawInput: {}, path: 'getProjects', type: 'query'});
            expect(result).toEqual([{id: 1, name: 'Test Project'}]);
        });

        it('throws an error if the project retrieval fails', async () => {
            const mockClient = {
                from: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                order: jest.fn().mockReturnThis(),
                mockResolvedValue: jest.fn().mockResolvedValue({data: null, error: {message: 'Error'}}),
            };
            (createClient as jest.Mock).mockReturnValue(mockClient);

            await expect(projectRouter.getProjects({
                ctx: {},
                rawInput: {},
                path: 'getProjects',
                type: 'query'
            })).rejects.toThrow('Error');
        });
    });

    describe('getProjectAssignees', () => {
        it('retrieves the assignees of a project', async () => {
            const mockClient = {
                from: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                in: jest.fn().mockReturnThis(),
                mockResolvedValueOnce: jest.fn().mockResolvedValueOnce({data: [{assignee: 1}], error: null})
                    .mockResolvedValueOnce({data: [{id: 1, username: 'user1'}], error: null}),
            };
            (createClient as jest.Mock).mockReturnValue(mockClient);

            const result = await projectRouter.getProjectAssignees({
                ctx: {},
                rawInput: {project_id: 1},
                path: 'getProjectAssignees',
                type: 'query'
            });
            expect(result).toEqual([{id: 1, username: 'user1'}]);
        });

        it('throws an error if the assignee retrieval fails', async () => {
            const mockClient = {
                from: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                in: jest.fn().mockReturnThis(),
                mockResolvedValueOnce: jest.fn().mockResolvedValueOnce({data: null, error: {message: 'Error'}}),
            };
            (createClient as jest.Mock).mockReturnValue(mockClient);

            await expect(projectRouter.getProjectAssignees({
                ctx: {},
                rawInput: {project_id: 1},
                path: 'getProjectAssignees',
                type: 'query'
            })).rejects.toThrow('Error');
        });
    });

    describe('postProject', () => {
        it('updates a project', async () => {
            const mockClient = {
                from: jest.fn().mockReturnThis(),
                update: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                mockResolvedValue: jest.fn().mockResolvedValue({data: [{id: 1, name: 'Updated Project'}], error: null}),
            };
            (createClient as jest.Mock).mockReturnValue(mockClient);

            const result = await projectRouter.postProject({
                ctx: {},
                rawInput: {id: 1, name: 'Updated Project', description: 'Updated Description'},
                path: 'postProject',
                type: 'mutation'
            });
            expect(result).toEqual([{id: 1, name: 'Updated Project'}]);
        });

        it('throws an error if the project update fails', async () => {
            const mockClient = {
                from: jest.fn().mockReturnThis(),
                update: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                mockResolvedValue: jest.fn().mockResolvedValue({data: null, error: {message: 'Error'}}),
            };
            (createClient as jest.Mock).mockReturnValue(mockClient);

            await expect(projectRouter.postProject({
                ctx: {},
                rawInput: {id: 1, name: 'Updated Project', description: 'Updated Description'},
                path: 'postProject',
                type: 'mutation'
            })).rejects.toThrow('Error');
        });
    });

    describe('postProjectAssignment', () => {
        it('assigns a user to a project', async () => {
            const mockClient = {
                from: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({data: {id: 1}, error: null}),
                insert: jest.fn().mockReturnThis(),
                mockResolvedValue: jest.fn().mockResolvedValue({data: [{project_id: 1, assignee: 1}], error: null}),
            };
            (createClient as jest.Mock).mockReturnValue(mockClient);

            const result = await projectRouter.postProjectAssignment({
                ctx: {},
                rawInput: {project_id: 1, assignee: 'user1'},
                path: 'postProjectAssignment',
                type: 'mutation'
            });
            expect(result).toEqual([{project_id: 1, assignee: 1}]);
        });

        it('throws an error if the assignment fails', async () => {
            const mockClient = {
                from: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({data: {id: 1}, error: null}),
                insert: jest.fn().mockReturnThis(),
                mockResolvedValue: jest.fn().mockResolvedValue({data: null, error: {message: 'Error'}}),
            };
            (createClient as jest.Mock).mockReturnValue(mockClient);

            await expect(projectRouter.postProjectAssignment({
                ctx: {},
                rawInput: {project_id: 1, assignee: 'user1'},
                path: 'postProjectAssignment',
                type: 'mutation'
            })).rejects.toThrow('Error');
        });
    });

    describe('removeProjectAssignment', () => {
        it('removes a user from a project', async () => {
            const mockClient = {
                from: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({data: {id: 1}, error: null}),
                delete: jest.fn().mockReturnThis(),
                mockResolvedValue: jest.fn().mockResolvedValue({data: [{project_id: 1, assignee: 1}], error: null}),
            };
            (createClient as jest.Mock).mockReturnValue(mockClient);

            const result = await projectRouter.removeProjectAssignment({
                ctx: {},
                rawInput: {project_id: 1, assignee: 'user1'},
                path: 'removeProjectAssignment',
                type: 'mutation'
            });
            expect(result).toEqual([{project_id: 1, assignee: 1}]);
        });

        it('throws an error if the removal fails', async () => {
            const mockClient = {
                from: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({data: {id: 1}, error: null}),
                delete: jest.fn().mockReturnThis(),
                mockResolvedValue: jest.fn().mockResolvedValue({data: null, error: {message: 'Error'}}),
            };
            (createClient as jest.Mock).mockReturnValue(mockClient);

            await expect(projectRouter.removeProjectAssignment({
                ctx: {},
                rawInput: {project_id: 1, assignee: 'user1'},
                path: 'removeProjectAssignment',
                type: 'mutation'
            })).rejects.toThrow('Error');
        });
    });

    describe('createProject', () => {
        it('creates a new project', async () => {
            const mockClient = {
                from: jest.fn().mockReturnThis(),
                insert: jest.fn().mockReturnThis(),
                mockResolvedValue: jest.fn().mockResolvedValue({data: [{id: 1, name: 'New Project'}], error: null}),
            };
            (createClient as jest.Mock).mockReturnValue(mockClient);

            const result = await projectRouter.createProject({
                ctx: {},
                rawInput: {name: 'New Project', description: 'New Description', owner: 'owner1'},
                path: 'createProject',
                type: 'mutation'
            });
            expect(result).toEqual([{id: 1, name: 'New Project'}]);
        });

        it('throws an error if the project creation fails', async () => {
            const mockClient = {
                from: jest.fn().mockReturnThis(),
                insert: jest.fn().mockReturnThis(),
                mockResolvedValue: jest.fn().mockResolvedValue({data: null, error: {message: 'Error'}}),
            };
            (createClient as jest.Mock).mockReturnValue(mockClient);

            await expect(projectRouter.createProject({
                ctx: {},
                rawInput: {name: 'New Project', description: 'New Description', owner: 'owner1'},
                path: 'createProject',
                type: 'mutation'
            })).rejects.toThrow('Error');
        });
    });

    describe('deleteProject', () => {
        it('deletes a project', async () => {
            const mockClient = {
                from: jest.fn().mockReturnThis(),
                delete: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                mockResolvedValue: jest.fn().mockResolvedValue({data: [{id: 1, name: 'Deleted Project'}], error: null}),
            };
            (createClient as jest.Mock).mockReturnValue(mockClient);

            const result = await projectRouter.deleteProject({
                ctx: {},
                rawInput: {id: 1},
                path: 'deleteProject',
                type: 'mutation'
            });
            expect(result).toEqual([{id: 1, name: 'Deleted Project'}]);
        });

        it('throws an error if the project deletion fails', async () => {
            const mockClient = {
                from: jest.fn().mockReturnThis(),
                delete: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                mockResolvedValue: jest.fn().mockResolvedValue({data: null, error: {message: 'Error'}}),
            };
            (createClient as jest.Mock).mockReturnValue(mockClient);

            await expect(projectRouter.deleteProject({
                ctx: {},
                rawInput: {id: 1},
                path: 'deleteProject',
                type: 'mutation'
            })).rejects.toThrow('Error');
        });
    });
});
