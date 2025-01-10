import directusConfig from '~/configs/directusConfig';
import { toast } from './alert';

// Define the response structure for better type safety
interface ApiResponse<T> {
  data: T;
  errors?: Array<{ message: string }>;
}

interface AuthData {
  access_token: string;
  refresh_token: string;
}

export const register = async (email: string, password: string): Promise<boolean> => {
  try {
    const response = await fetch(`${directusConfig.baseURL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      toast('User registered successfully.', 'success', 'top');
      return true;
    } else {
      const data: ApiResponse<null> = await response.json();
      const errors = data.errors ?? [];
      errors.forEach(e => {
        toast(e.message, 'error');
      });
      console.error('Registration failed:', errors);
      return false;
    }
  } catch (error) {
    console.error('An error occurred:', error);
    toast('Failed to register. Please try again.', 'error');
    return false;
  }
};

export const login = async (email: string, password: string): Promise<boolean> => {
  try {
    const response = await fetch(`${directusConfig.baseURL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data: ApiResponse<AuthData> = await response.json();

    if (response.ok) {
      localStorage.setItem('access_token', data.data.access_token);
      localStorage.setItem('refresh_token', data.data.refresh_token);
      toast('Login successful.', 'success', 'top');
      return true;
    } else {
      const errors = data.errors ?? [];
      errors.forEach(e => {
        toast(e.message, 'error');
      });
      console.error('Login failed:', errors);
      return false;
    }
  } catch (error) {
    console.error('An error occurred:', error);
    toast('An error occurred.', 'error');
    return false;
  }
};

export const logout = (): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('profile');
};

export const forbiddenPage = (): boolean => {
  const access_token = localStorage.getItem('access_token');
  const refresh_token = localStorage.getItem('refresh_token');
  return !access_token || !refresh_token;
};
