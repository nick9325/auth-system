import '@testing-library/jest-dom'
import { act, render, screen, waitFor } from '@testing-library/react'
import Home from '../src/app/page'
import { useRouter } from 'next/navigation';
import fetchMock from 'jest-fetch-mock';



jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

describe('Homepage', () => {
    let mockPush;
    
    beforeEach(() => {
        mockPush = jest.fn();
        useRouter.mockReturnValue({
            push: mockPush,
        });


        Storage.prototype.getItem = jest.fn(() => 'mocked-token');
        Storage.prototype.setItem = jest.fn();
        
   
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ name: 'Nikhil Magar' }),
            })
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should show a loading spinner while fetching user data', () => {
        render(<Home />);

        expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should render the welcome message with user data', async () => {
        render(<Home />);

        await waitFor(() => screen.getByText('Welcome, Nikhil Magar'));

        expect(screen.getByText('Welcome, Nikhil Magar')).toBeInTheDocument();
        expect(screen.getByText('You have successfully logged in')).toBeInTheDocument();
    });

    it('should redirect to login if the user is unauthorized', async () => {
        global.fetch.mockImplementationOnce(() =>
            Promise.resolve({ ok: false, status: 401 })
        );

        render(<Home />);

        await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/login'));
        expect(localStorage.setItem).toHaveBeenCalledWith('token', '');
    });


});





