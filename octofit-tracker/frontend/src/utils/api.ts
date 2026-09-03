/**
 * API utility for making authenticated requests
 */

interface ApiResponse<T> {
  ok: boolean;
  status: number;
  data: T;
}

export const apiCall = async <T = any>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const token = localStorage.getItem('token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    const data = await response.json();

    // If token is invalid, clear it and redirect to login
    if (response.status === 401 && data.message === 'Invalid token') {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return { ok: false, status: response.status, data };
    }

    return {
      ok: response.ok,
      status: response.status,
      data
    };
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};
