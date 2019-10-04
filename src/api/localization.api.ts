import axios, { AxiosResponse } from 'axios';

export const fetchLocalizations = async (lang: string) => {
  const response: AxiosResponse = await axios.get(`assets/${lang}.lang.json`);
  return response.data;
};