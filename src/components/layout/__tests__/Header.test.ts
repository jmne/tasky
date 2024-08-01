import {render, screen} from '@testing-library/react';
import NavigationMenu from '@/components/layout/Header';
import {createClient} from '@/utils/supabase/server';
import {usePathname} from "next/navigation";

jest.mock('@/utils/supabase/server');

jest.mock('next/navigation', () => ({
    usePathname: jest.fn(),
}));

describe('NavigationMenu', () => {


    it('does not render the navigation menu when user is not authenticated', async () => {
        const mockClient = {
            auth: {
                getUser: jest.fn().mockResolvedValue({data: {user: null}}),
            },
        };
        (createClient as jest.Mock).mockReturnValue(mockClient);

        const result = await NavigationMenu();

        expect(result).toBeNull();
    });


});
