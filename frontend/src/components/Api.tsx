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
  