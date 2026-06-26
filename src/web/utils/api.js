/**
 * API Utility - Wrapper sobre fetch para manejar JWT automáticamente
 */
const api = {
    /**
     * Realiza una petición fetch incluyendo el token JWT si está disponible.
     * @param {string} url - URL de la API
     * @param {Object} options - Opciones de fetch
     */
    async fetch(url, options = {}) {
        const token = localStorage.getItem('token');
        
        // Inicializar headers si no existen
        const headers = options.headers || {};
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        // Asegurar que las credenciales se incluyan para soportar el modo híbrido (sesiones)
        options.credentials = "include";

        const finalOptions = {
            ...options,
            headers: {
                ...headers
            }
        };

        const response = await fetch(url, finalOptions);

        if (response.status === 401) {
            console.warn('Sesión expirada o no autorizada');
            // Opcional: Redirigir a login si es un fallo global
            // window.location.href = '/login.html';
        }

        return response;
    },

    get: (url, options) => api.fetch(url, { ...options, method: 'GET' }),
    post: (url, data, options) => api.fetch(url, { 
        ...options, 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json', ...options?.headers },
        body: JSON.stringify(data)
    }),
    put: (url, data, options) => api.fetch(url, { 
        ...options, 
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json', ...options?.headers },
        body: JSON.stringify(data)
    }),
    delete: (url, options) => api.fetch(url, { ...options, method: 'DELETE' }),

    /**
     * Obtiene el mensaje de error legible de una respuesta JSON de la API
     * @param {Object} errObj - Objeto de error parseado desde la respuesta
     */
    getErrorMessage(errObj) {
        if (!errObj) return 'Error desconocido';
        
        if (errObj.error) {
            if (typeof errObj.error === 'string') {
                return errObj.error;
            }
            if (errObj.error.message) {
                let msg = errObj.error.message;
                if (errObj.error.details && Array.isArray(errObj.error.details)) {
                    const detailsStr = errObj.error.details
                        .map(d => {
                            const field = d.path && d.path.length > 0 ? d.path[d.path.length - 1] : '';
                            return `${field}: ${d.message}`;
                        })
                        .join(', ');
                    msg += ` (${detailsStr})`;
                }
                return msg;
            }
        }
        
        if (typeof errObj.message === 'string') {
            return errObj.message;
        }
        
        if (typeof errObj === 'string') {
            return errObj;
        }
        
        return JSON.stringify(errObj);
    }
};

// Exponer globalmente para los scripts legacy
window.api = api;
