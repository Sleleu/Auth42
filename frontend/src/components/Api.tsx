export interface User {
    username: string;
    id?: number;
    elo?: number;
    win?: number;
    loose?: number;
    createAt?: string;
    updateAt?: string;
    state?: string;
    avatar?: string;
  }

export const getUserProfile = async () => {
    const response = await fetch("http://localhost:5000/users/profile", {
      method: "GET",
      credentials: 'include'
    });
  
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Failed to fetch user profile');
    }
  };

export async function logout() {
    const response = await fetch('http://localhost:5000/users/logout', {
      method: 'POST',
      credentials: 'include',
    });
  
    if (!response.ok) {
      throw new Error(`Failed to log out: ${response.statusText}`);
    }
  }

  export const enableTwoFA = async () => {
    const response = await fetch("http://localhost:5000/intra/enable-2fa", {
      method: "POST",
      credentials: 'include'
    });
  
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Failed to enable two-factor authentication');
    }
  };
  