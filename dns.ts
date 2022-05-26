//only work for the DNS zone management

const CloudflareDOMAIN = "https://api.cloudflare.com/client/v4";

export class Cloudflare_DNS {
    private apiKey: string = ""
    private workingZone: string = ""
    constructor(apiKey){
        this.apiKey = apiKey
        this.checkApiKey()
    }

    private async checkApiKey(){
        let check = await this.get("/user/tokens/verify")
        if(!check.success){
            console.log("API key is invalid")
            Deno.exit(1)
        }
    }

    public setWorkingZone(zoneid: string){
        this.workingZone = zoneid
    }

    //function part
    public async getAllZone(){
        return await this.get("/zones")
    }

    public async getZoneFromDomain(domain: string){
        let zones = await this.getAllZone()
        let zone = zones.result.find(zone => zone.name === domain)
        return zone
    }

    //DNS PART
    public async getAllDNSRecods(){
        return await this.get("/zones/"+this.workingZone+"/dns_records")
    }
    public async getDNSRecods(id:string){
        return await this.get("/zones/"+this.workingZone+"/dns_records/"+id)
    }

    public async createDNSRecord(type: string, name: string, content: string, ttl?: number, proxied?: boolean){
        if(!ttl){
            ttl = 3600
        }
        if(!proxied){
            proxied = true
        }
        let data = {
            type: type,
            name: name,
            content: content,
            ttl: ttl,
            proxied: proxied
        }
        return await this.post("/zones/"+this.workingZone+"/dns_records", data)
    }

    public async updateDNSRecord(id: string, type: string, name: string, content: string, ttl?: number, proxied?: boolean){
        if(!ttl){
            ttl = 3600
        }
        if(!proxied){
            proxied = true
        }
        let data = {
            type: type,
            name: name,
            content: content,
            ttl: ttl,
            proxied: proxied
        }
        return await this.put("/zones/"+this.workingZone+"/dns_records/"+id, data)
    }

    public async deleteDNSRecord(id: string){
        return await this.delete("/zones/"+this.workingZone+"/dns_records/"+id)
    }

    // contacting part
    private async get(url: string){
        let response = await fetch(CloudflareDOMAIN+url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.apiKey
            }
        })
        let data = await response.json()
        return data
    }

    private async delete(url: string){
        let response = await fetch(CloudflareDOMAIN+url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.apiKey
            }
        })
        let data = await response.json()
        return data
    }

    private async post(url: string, data: any){
        let response = await fetch(CloudflareDOMAIN+url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.apiKey
            },
            body: JSON.stringify(data)
        })
        let res = await response.json()
        return res
    }

    private async put(url: string, data: any){
        let response = await fetch(CloudflareDOMAIN+url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.apiKey
            },
            body: JSON.stringify(data)
        })
        let res = await response.json()
        return res
    }
}