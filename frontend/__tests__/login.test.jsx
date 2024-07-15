import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import Login from '../src/app/login/page'
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

describe('Login', () => {

  beforeEach(() => {
    useRouter.mockReturnValue({ push: jest.fn() });
  });

  it('should render the sign in form', () => {
    const { getByLabelText } = render(<Login />);
    expect(getByLabelText('Email')).toBeInTheDocument();
    expect(getByLabelText('Password')).toBeInTheDocument();
  });




  it('should display an error if email is empty', async () => {
    render(<Login />);
    fireEvent.click(screen.getByRole('button', { type: 'submit' }));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Email required!');
    });
  });

  it('should display an error if email is invalid', async () => {
    render(<Login />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid-email' } });
    fireEvent.click(screen.getByRole('button', { type: 'submit' }));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Please enter valid email!');
    });
  });

  it('should display an error if password is empty', async () => {
    render(<Login />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { type: 'submit' }));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Password required!');
    });
  });


  it('handles successful login', async () => {
    const mockFetch = jest.fn().mockResolvedValueOnce(
      new Response(JSON.stringify({ access_token: 'some_token' }))
    );

    global.fetch = mockFetch; 

    render(<Login />);

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'nikhildmagar@gmail.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: '1234' } });
    fireEvent.click(screen.getByRole('button'));


    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Signed In successfully!');
      expect(useRouter().push).toHaveBeenCalledWith('/');
    });

  
  
  });




 
  




});



