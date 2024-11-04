import { RequestAPIFrom } from "../Wrapper";

function RequestAPI(from: RequestAPIFrom, path: string, searchParams?: URLSearchParams, credentials: RequestCredentials = "omit", headers?: HeadersInit): Promise<unknown> {
    return new Promise(async (resolve, reject) => {
        let base_url: string;

        switch (from) {
            case RequestAPIFrom.Server: 
                base_url = import.meta.env.BACKEND_API_URL
            break;
            case RequestAPIFrom.Client:
                base_url = import.meta.env.PUBLIC_FRONTEND_API_URL
            break;
            default:
                console.warn("INVALID API REQUEST FROM VALUE - using frontend API URL as fallback.")
                base_url = import.meta.env.PUBLIC_FRONTEND_API_URL
        }
    
        const paramsString = searchParams ? searchParams.toString() : null
        const params = paramsString ? "?" + paramsString : ""
    
        const request = await fetch(`${base_url}${path}${params}`, {
            credentials: credentials,
            headers: headers
        })
    
        if(!request.ok) {
            const response = await request.text()
            return reject(response)
        }
    
        const response = await request.json()
    
        resolve(response)
    })    
}

export default RequestAPI