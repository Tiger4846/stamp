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

export interface GetMeResponse {
  user: {
    id: string;
    name: string;
    phone: string;
    role: string;
    qrCode: string;
    createdAt: string;
  };
}

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

export const userApi = {
  getMe: async (token: string): Promise<GetMeResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.error || 'Failed to fetch user data');
    }

    return response.json();
  },
};

export interface Sponsor {
  id: string;
  name: string;
  level: 'gold' | 'silver';
  logoUrl: string | null;
  createdAt: string;
}

export interface GetSponsorsResponse {
  sponsors: Sponsor[];
  total: number;
}

export interface UserStamp {
  sponsorId: string;
  sponsorName: string;
  sponsorLevel: string;
  total: number;
}

export interface GetUserStampsResponse {
  stamps: UserStamp[];
  totalStamps: number;
  sponsorCount: number;
}

export const sponsorApi = {
  listSponsors: async (): Promise<GetSponsorsResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/sponsor/list`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.error || 'Failed to fetch sponsors');
    }

    return response.json();
  },
};

export const stampsApi = {
  getUserStamps: async (token: string): Promise<GetUserStampsResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/user/stamps`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.error || 'Failed to fetch user stamps');
    }

    return response.json();
  },
};
