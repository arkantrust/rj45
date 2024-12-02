import { API_URL, ANALYTICS_URL } from './apis.js';

/**
 * fetchs as in fetch secure.
 * @param {string | URL} url - The request parameter.
 * @param options - The request options. It can include headers and/or method. The jwt is read from local storage.
 * @returns {Promise<Response>} The response object.
 * @example
 * // Returns a patient's data.
 * fetchs('http://localhost:8080/patients/1');
 */
export default async function fetchs(url, options) {
    const jwt = options['jwt'] || localStorage.getItem('jwt');
    
    const headers = options['headers'] || new Headers();
    headers.append('Authorization', `Bearer ${jwt}`);

    const method = options['method'] || 'GET';
    
    return await fetch(url, {
        method: method,
        headers: headers,
    });   
}

/**
 * Sets the base url to the core api.
 * @param {string | URL} url - The request parameter.
 * @param options - The request options. It can include headers and/or method. The jwt is read from local storage.
 * @returns {Promise<Response>} The response object.
 * @example
 * // Returns a patient's data.
 * fetchs('patients/1');
 */
export async function fetchApi(url, options) {
    return await fetchs(`${API_URL}/${url}`, options);
}

/**
 * Sets the base url to the analytics api.
 * @param {string | URL} url - The request parameter.
 * @param options - The request options. It can include headers and/or method. The jwt is read from local storage.
 * @returns {Promise<Response>} The response object.
 * @example
 * // Get analytics for a test
 * fetchs('tests/5ae82e02-647f-4d00-ab3e-c9a7e4755bbf');
 */
export async function fetchAnalytics(url, options) {
    return await fetchs(`${ANALYTICS_URL}/${url}`, options);
}