

export default async function request_api(path: string, credentials: RequestCredentials = "include", cookie?: string) {
    const api_url = import.meta.env.BACKEND_API_URL || import.meta.env.PUBLIC_FRONTEND_API_URL

    const request = await fetch(`${api_url}${path}`, {
        credentials: credentials,
        headers: cookie ? {
            'Cookie': cookie
        } : undefined
    })

    if(request.ok) {
        return await request.json()
    } else {
        console.log(request.url, request.status)
        console.log(request)
        throw new Error(`Request error`)
    }
}