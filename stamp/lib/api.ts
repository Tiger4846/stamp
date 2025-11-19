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

export interface StampAddRequest {
  phone: string;
  amount?: number;
}

export interface StampAddResponse {
  transaction: {
    id: string;
    userId: string;
    sponsorId: string;
    amount: number;
    createdAt: string;
  };
  newTotal: number;
  user: {
    name: string;
    phone: string;
  };
  sponsor: {
    name: string;
  };
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

export const stampApi = {
  addStamp: async (data: StampAddRequest, token: string): Promise<StampAddResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/stamp/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.error || 'Failed to add stamp');
    }

    return response.json();
  },
};
