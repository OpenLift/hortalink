/**
 * Faz request para o endpoint de oauth, para obter informações da sessão.
 */
function getSession(oauth_type: string, session_id: string) {
    return new Promise((resolve, reject) => {
        fetch(`http://${import.meta.env.BACKEND_API_URL}/v1/oauth/${oauth_type}`, {
            headers: {
                'Cookie': `session_id=${session_id}`
            }
        }).then(request => {
            const ok = request.ok
            request.json().then(data => {
                if(!ok) {
                    reject(data)
                } else {
                    resolve(data)
                }
            })
        }).catch(error => reject(error))
    }) 
}

export default getSession