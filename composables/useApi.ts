
export async function useApi(path: string, method = 'GET', body?: any) {
    const config = useRuntimeConfig();
    const token = localStorage.getItem('token');

    const options: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        ...(body && { body: JSON.stringify(body) }),
    };

    const res = await fetch(`${config.public.apiBase}${path}`, options);
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'API Error');
    return data;
}
