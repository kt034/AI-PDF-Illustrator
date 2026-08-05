import axios from 'axios';

const BASE = 'http://localhost:5000/api';
export const uploadPDF = (file) => {
  const form = new FormData();
  form.append('pdf', file);
  return axios.post(`${BASE}/extract/upload`, form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const summarizePage = (pageText, pageNumber) =>
  axios.post(`${BASE}/extract/summarize`, { pageText, pageNumber });

export const generateImage = (prompt) =>
  axios.post(`${BASE}/generate`, { prompt });
