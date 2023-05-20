import React, { Component } from 'react';
import { useState, useEffect } from 'react';

export interface User {
    username: string;
    id: number;
    elo: number;
    win: number;
    loose: number;
    createAt: string;
    updateAt: string;
    state: string;
    avatar: string;
  }

function Home() {

    const [user, setUser] = useState<User>({ username: '', id: -1, elo: -1, win: -1, loose: -1, createAt: '', updateAt: '', state: 'inexistant', avatar:'' })
    const api = async () => {
        const data = await fetch("http://localhost:5000/users/profile", { 
			method: "GET",
			credentials: 'include'})
        const userProfile = await data.json();
        console.log('user in api', userProfile)
		return userProfile;
    }

    useEffect(() => {
        const getUser = async () => {
            const userFromServer = await api()
            setUser(userFromServer)
        }
        getUser()
    }, [])

    return (
            <>
            <p>
                <h1> Login : {user.username} </h1>
                <img src={user.avatar} />
            </p>
            </>
    );
}

export default Home;
