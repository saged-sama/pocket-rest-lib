export default function crud(incomingHeaders?: {[key: string]: string}){
    const headers: HeadersInit = {
        "Access-Control-Request-Headers": "content-type",
        ...incomingHeaders
    }
    
    async function GET(url: string){
        try{
            const response = await fetch(url, {
                method: "GET",
                headers: headers
            });
        
            if(response.ok){
                return await response.json();
            } else {
                throw new Error(response.statusText);
            }
        }
        catch(e){
            console.error("Error while fetching", e);
        }
    }
    
    async function POST(url: string, body: Object | FormData){
        try{
            const reqBody = body instanceof FormData ? body : JSON.stringify(body);
            const reqHeaders = body instanceof FormData ? {...headers} : {...headers, "Content-Type": "application/json"};

            const response = await fetch(url, {
                method: "POST",
                headers: reqHeaders,
                body: reqBody
            });
        
            if(response.ok){
                // console.log(response);
                return await response.json();
            } else {
                throw new Error(response.statusText);
            }
        }
        catch(e){
            console.error("Error while fetching", e);
        }
    }
    
    async function PATCH(url: string, body: Object | FormData){
        try{
            const reqBody = body instanceof FormData ? body : JSON.stringify(body);
            const reqHeaders = body instanceof FormData ? {...headers} : {...headers, "Content-Type": "application/json"};
            const response = await fetch(url, {
                method: "PATCH",
                headers: reqHeaders,
                body: reqBody
            });
        
            if(response.ok){
                return await response.json();
            } else {
                throw new Error(response.statusText);
            }
        }
        catch(e){
            console.error("Error while fetching", e);
        }
    }
    
    async function DELETE(url: string){
        try{
            const response = await fetch(url, {
                method: "DELETE",
                headers: headers
            });
        
            if(response.ok){
                return await response.json();
            } else {
                throw new Error(response.statusText);
            }
        }
        catch(e){
            console.error("Error while fetching", e);
        }
    }

    return { GET, POST, PATCH, DELETE };
}