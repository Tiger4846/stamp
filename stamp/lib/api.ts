const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface SignInRequest {
  phone: string;
}

export interface SignInResponse {
  user: {
    id: string;
    name: string;
    phone: string;
    role: string;
    qrCode: string;
  };
  token: string;
}

export interface ApiError {
  error: string;
}

export const authApi = {
  signIn: async (data: SignInRequest): Promise<SignInResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.error || 'Sign in failed');
    }

    return response.json();
  },
};
