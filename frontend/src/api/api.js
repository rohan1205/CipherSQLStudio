import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

export const getAssignments = () => axios.get(`${BASE_URL}/assignments`);

export const getAssignment = (id) => axios.get(`${BASE_URL}/assignments/${id}`);

export const executeQuery = (query) => axios.post(`${BASE_URL}/execute`, { query });

export const getHint = (question, userQuery, tableName) =>
  axios.post(`${BASE_URL}/hint`, { question, userQuery, tableName });