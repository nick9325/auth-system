import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import Register from '../src/app/register/page'
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import fetchMock from 'jest-fetch-mock';



jest.mock('next/navigation', () => ({
    useRouter: jest.fn(() => ({ push: jest.fn() })),
}));

jest.mock('react-hot-toast', () => ({
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
    dismiss: jest.fn(),
}));

describe('Register', () => {

    beforeEach(() => {
        useRouter.mockReturnValue({ push: jest.fn() });
    });

    it('should render the sign in form', () => {
        const { getByLabelText } = render(<Register />);
        expect(getByLabelText('Name')).toBeInTheDocument();
        expect(getByLabelText('Email')).toBeInTheDocument();
        expect(getByLabelText('Password')).toBeInTheDocument();
        expect(getByLabelText('Confirm Password')).toBeInTheDocument();
    });




    it('should display an error if name is empty', async () => {
        render(<Register />);
        fireEvent.click(screen.getByRole('button', { type: 'submit' }));
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Name required!');
        });
    });


    it('should display an error if email is empty', async () => {
        render(<Register />);
        fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Nikhil Magar' } });
        fireEvent.click(screen.getByRole('button', { type: 'submit' }));
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Email required!');
        });
    });

    it('should display an error if email is invalid', async () => {
        render(<Register />);
        fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Nikhil Magar' } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid-email' } });
        fireEvent.click(screen.getByRole('button', { type: 'submit' }));
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Please enter valid email!');
        });
    });

    it('should display an error if password is empty', async () => {
        render(<Register />);
        fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Nikhil Magar' } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'nikhildmagar@gmail.com' } });
        fireEvent.click(screen.getByRole('button', { type: 'submit' }));
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Password required!');
        });
    });

    it('should display an error if confirm password is empty', async () => {
        render(<Register />);
        fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Nikhil Magar' } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'nikhildmagar@gmail.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: '1234' } });
        fireEvent.click(screen.getByRole('button', { type: 'submit' }));
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Confirm password required!');
        });
    });

    it('should show error message for mismatched passwords', () => {
        render(<Register />);
        fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Nikhil Magar' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'nikhildmagar@gmail.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: '1234' } });
        fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: '3232' } });
        fireEvent.click(screen.getByRole('button'));

        expect(toast.error).toHaveBeenCalledWith('Passwords mismatched!');
    });




    it('handles successful register', async () => {

        const mockFetch = jest.fn().mockResolvedValueOnce(
            new Response(JSON.stringify({}))
          );
      
          global.fetch = mockFetch; 

          
        render(<Register />);
        fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Nikhil Magar' } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'nikhildmagar@gmail.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: '1234' } });
        fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: '1234' } });
        fireEvent.click(screen.getByRole('button'));


        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalled();
            expect(toast.success).toHaveBeenCalledWith('Signed Up successfully!');
            expect(useRouter().push).toHaveBeenCalledWith('/login');
        });



    });



});



