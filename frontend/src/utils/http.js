import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
	baseURL,
	timeout: 15000,
	headers: {
		'Content-Type': 'application/json'
	}
});

export default api;


