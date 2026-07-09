const API_BASE_URL = 'http://localhost:9002/api';

const getAuthHeaders = (method: string = "GET") => {
  const token = localStorage.getItem("token");

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  if (method !== "GET") {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

const getErrorMessage = (status: number, body: any) => {
  // For server errors, prefer any message returned by the backend (JSON.message or plain text),
  // but fall back to a friendly generic string when the response body contains nothing useful.
  if (status >= 500) {
    if (typeof body?.message === 'string' && body.message.trim()) {
      return body.message;
    }

    if (typeof body === 'string' && body.trim()) {
      return body;
    }

    return 'Something went wrong. Please try again later.';
  }

  if (typeof body?.message === 'string' && body.message.trim()) {
    return body.message;
  }

  if (typeof body === 'string' && body.trim()) {
    return body;
  }

  return 'Request failed. Please try again.';
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json');

  if (!response.ok) {
    // Read raw text from the response so we can surface any plain-text error message
    // (Spring backends sometimes return plain text for exceptions).
    const rawText = await response.text().catch(() => '');
    let body: any = null;
    if (rawText) {
      try {
        body = JSON.parse(rawText);
      } catch {
        body = rawText;
      }
    }

    const errorMessage = getErrorMessage(response.status, body);

    if (response.status >= 500) {
      alert(errorMessage);
    }

    throw new ApiError(errorMessage, response.status, body);
  }

  if (isJson) {
    return response.json();
  }

  return response.text() as Promise<T>;
};

export const authApi = {
  register: async (data: {
    fullName: string;
    email: string;
    password: string;
    role?: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      }),
    });

    return handleResponse<string>(response);
  },

  login: async (data: { email: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await handleResponse<any>(response);
    const rawRole = result.role;
    const normalizedRole = rawRole === 'BANK_MANAGER' ? 'MANAGER' : rawRole;

    return {
      token: result.token,
      user: {
        userId: result.userId,
        fullName: result.fullName,
        email: result.email,
        role: normalizedRole,
        active: result.active,
      },
    };
  },
};

export const bankApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/banks/all`, {
      headers: getAuthHeaders('GET'),
    });
    return handleResponse<Bank[]>(response);
  },
};

export const customerApi = {
  submitAccountOpening: async (data: FormData) => {
    const token = localStorage.getItem("token");

    console.log("TOKEN =", token);

    const response = await fetch(`${API_BASE_URL}/customer/account-opening`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });

    return handleResponse<string>(response);
  },

  getAccounts: async (userId: number) => {
    const response = await fetch(`${API_BASE_URL}/profile/accounts/${userId}`, {
      headers: getAuthHeaders("GET"),
    });
    return handleResponse<any[]>(response);
  },

  getProfile: async (userId: number, bankId?: number) => {
    const resolvedBankId = bankId ?? 1;
    const response = await fetch(`${API_BASE_URL}/profile/${userId}/${resolvedBankId}`, {
      headers: getAuthHeaders("GET"),
    });

    return handleResponse<any>(response);
  },

  updateProfile: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/profile/update`, {
      method: 'PATCH',
      headers: getAuthHeaders('PATCH'),
      body: JSON.stringify(data),
    });

    return handleResponse<string>(response);
  },
};

export const managerApi = {
  getPendingRequests: async () => {
    const response = await fetch(`${API_BASE_URL}/manager/requests`, {
      headers: getAuthHeaders('GET'),
    });
    return handleResponse<AccountOpeningRequest[]>(response);
  },

  approveRequest: async (requestId: number) => {
    const response = await fetch(
      `${API_BASE_URL}/manager/approve/${requestId}`,
      {
        method: 'POST',
        headers: getAuthHeaders('POST'),
      }
    );
    return handleResponse<string>(response);
  },

  getCustomers: async (sort: string = 'newest') => {
    const response = await fetch(`${API_BASE_URL}/manager/customers?sort=${sort}`, {
      headers: getAuthHeaders('GET'),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch customers');
    }

    return response.json();
  },

  getCustomerById: async (customerId: number) => {
    const response = await fetch(
      `${API_BASE_URL}/manager/customer/${customerId}`,
      { headers: getAuthHeaders('GET') }
    );
    return handleResponse<any>(response);
  },

  deactivateCustomer: async (customerId: number) => {
    const response = await fetch(
      `${API_BASE_URL}/manager/customer/deactivate/${customerId}`,
      { method: 'PUT', headers: getAuthHeaders('PUT') }
    );
    return handleResponse<string>(response);
  },

  activateCustomer: async (customerId: number) => {
    const response = await fetch(
      `${API_BASE_URL}/manager/customer/activate/${customerId}`,
      { method: 'PUT', headers: getAuthHeaders('PUT') }
    );
    return handleResponse<string>(response);
  },

  getAllAccounts: async () => {
    const response = await fetch(`${API_BASE_URL}/manager/accounts`, {
      headers: getAuthHeaders('GET'),
    });
    return handleResponse<any[]>(response);
  },

  lockAccount: async (accountId: number) => {
    const response = await fetch(
      `${API_BASE_URL}/manager/account/lock/${accountId}`,
      { method: 'PUT', headers: getAuthHeaders('PUT') }
    );
    return handleResponse<string>(response);
  },

  unlockAccount: async (accountId: number) => {
    const response = await fetch(
      `${API_BASE_URL}/manager/account/unlock/${accountId}`,
      { method: 'PUT', headers: getAuthHeaders('PUT') }
    );
    return handleResponse<string>(response);
  },

  closeAccount: async (accountId: number) => {
    const response = await fetch(
      `${API_BASE_URL}/manager/account/close/${accountId}`,
      { method: 'PUT', headers: getAuthHeaders('PUT') }
    );
    return handleResponse<string>(response);
  },

  getAccountByNumber: async (accountNumber: string) => {
    const response = await fetch(
      `${API_BASE_URL}/manager/account/${accountNumber}`,
      { headers: getAuthHeaders('GET') }
    );
    return handleResponse<Account>(response);
  },

  getDashboard: async () => {
    const response = await fetch(`${API_BASE_URL}/manager/dashboard`, {
      headers: getAuthHeaders('GET'),
    });
    return handleResponse<any>(response);
  },
};

export const transactionApi = {
  deposit: async (data: DepositRequest) => {
    const response = await fetch(`${API_BASE_URL}/transaction/deposit`, {
      method: 'POST',
      headers: getAuthHeaders('POST'),
      body: JSON.stringify(data),
    });
    return handleResponse<string>(response);
  },

  withdraw: async (data: WithdrawRequest) => {
    const response = await fetch(`${API_BASE_URL}/transaction/withdraw`, {
      method: 'POST',
      headers: getAuthHeaders('POST'),
      body: JSON.stringify(data),
    });
    return handleResponse<string>(response);
  },

  transfer: async (data: TransferRequest) => {
    const response = await fetch(`${API_BASE_URL}/transaction/transfer`, {
      method: 'POST',
      headers: getAuthHeaders('POST'),
      body: JSON.stringify(data),
    });
    return handleResponse<string>(response);
  },

  statement: async (
    accountNumber: string,
    page: number,
    size: number
  ) => {
    const response = await fetch(
      `${API_BASE_URL}/transaction/statement/${accountNumber}?page=${page}&size=${size}`,
      {
        headers: getAuthHeaders('GET'),
      }
    );

    return handleResponse<any>(response);
  },

  getBalance: async (accountNumber: string) => {
    const response = await fetch(
      `${API_BASE_URL}/transaction/balance/${accountNumber}`,
      {
        headers: getAuthHeaders('GET'),
      }
    );
    return handleResponse<number>(response);
  },

  downloadStatement: async (accountNumber: string) => {
    const url = `${API_BASE_URL}/transaction/statement/download/${accountNumber}`;
    const token = localStorage.getItem("token");

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const rawText = await response.text().catch(() => '');
      let body: any = null;
      if (rawText) {
        try {
          body = JSON.parse(rawText);
        } catch {
          body = rawText;
        }
      }
      const errorMessage = getErrorMessage(response.status, body);
      throw new ApiError(errorMessage, response.status, body);
    }

    // Return raw ArrayBuffer so callers can build a Blob
    return await response.arrayBuffer();
  },
};

// Import types
import type {
  Bank,
  Account,
  AccountOpeningRequest,
 
  DepositRequest,
  WithdrawRequest,
  TransferRequest,
} from '../types';
