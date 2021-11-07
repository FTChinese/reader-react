import axios from 'axios';

const CancelToken = axios.CancelToken;
export const cancelSource = CancelToken.source();
