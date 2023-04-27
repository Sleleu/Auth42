import React, { Fragment } from 'react';

const HandleClick =  async () => {
	if (process.env.REACT_APP_AUTH_URL)
	{
		window.open(process.env.REACT_APP_AUTH_URL)
	}
	else
		console.log('AUTH_URL is undefined');
}

const Login = () => {
	return (
		<>
		<h1>Login</h1>
		<button onClick={HandleClick}>Auth with 42</button>
		</>
	)
}

export default Login;