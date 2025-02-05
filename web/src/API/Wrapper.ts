import type { User } from "@interfaces/User"
import RequestAPI from "./APIFunctions/RequestAPI"
import type { Cart, DetailedProduct, FullRating, IndividualRating, Product, ProductFilter, ProductFullTextSearch, Rating } from "@interfaces/Product"
import type { Schedule } from "@interfaces/Schedule"
import type { Seller } from "@interfaces/Seller"
import type { UserResults } from "@components/pages/home/search/Search"
import type { SellerOrder } from "@interfaces/Orders"
import type { ChatMessage, ChatPreview } from "@interfaces/Chat"

class APIWrapper<F extends RequestAPIFrom> {
    private from: F

    constructor(from: F) {
        this.from = from
    }

    async getCurrentSession(session_id?: F extends RequestAPIFrom.Server ? string : never): Promise<User> {
        switch(this.from) {
            case RequestAPIFrom.Client:
                return this.getCurrentSessionFromClient()
            case RequestAPIFrom.Server:
                return this.getCurrentSessionFromServer(session_id)
        }
    }

    private async getCurrentSessionFromClient(): Promise<User> {
        const data = await RequestAPI(this.from, "/v1/users/@me", null, "include") as User
        return data
    }

    private async getCurrentSessionFromServer(session_id: string): Promise<User> {
        const data = await RequestAPI(this.from, "/v1/users/@me", null, "include", {
            'Cookie': `session_id=${session_id}`
        }) as User
        return data
    }

    public async getRecentProducts(page: number = 1): Promise<Product[]> {
        const searchParams = new URLSearchParams()

        searchParams.append("page", String(page))
        searchParams.append("per_page", String(10))

        const data = await RequestAPI(this.from, "/v1/users/@me/home/most_recent", searchParams, "include") as Product[]
        return data
    }

    public async getMoreOrderProducts(page: number = 1): Promise<Product[]> {
        const searchParams = new URLSearchParams()

        searchParams.append("page", String(page))
        searchParams.append("per_page", String(10))

        const data = await RequestAPI(this.from, "/v1/users/@me/home/more_orders", searchParams, "include") as Product[]
        return data
    }

    public async getProducts(filter: ProductFilter): Promise<Product[]> {
        const searchParams = new URLSearchParams()

        if(!filter.page) {
            filter.page = 1
        }

        if(!filter.per_page) {
            filter.per_page = 10
        }

        const keys = Object.keys(filter)

        for(const key of keys) {
            const value = filter[key]

            searchParams.append(key, value)
        }

        const data = await RequestAPI(this.from, "/v1/products", searchParams, "include") as Product[]
        return data
    }

    public async searchUsers(query: string, page: number, per_page: number) {
        const searchParams = new URLSearchParams()

        searchParams.set("page", page.toString())
        searchParams.set("per_page", per_page.toString())
        searchParams.set("query", query)
        
        const data = await RequestAPI(this.from, "/v1/users", searchParams, "include") as UserResults[]

        return data
    }
    
    public async search(query?: string, page: number = 1, per_page: number = 10, session_id?: F extends RequestAPIFrom.Server ? string : never): Promise<ProductFullTextSearch[]> {
        switch (this.from) {
            case RequestAPIFrom.Client:
                return await this.searchFromClient(query, page, per_page)
                break;
            case RequestAPIFrom.Server:
                return await this.searchFromServer(query || "", page, per_page, session_id)
        }
    }

    private async searchFromClient(query?: string, page: number = 1, per_page: number = 10) {
        const searchParams = new URLSearchParams()
    
        if(query) {
            searchParams.append("query", query)
        }
        searchParams.append("page", String(page))
        searchParams.append("per_page", String(per_page))
    
        const types = await RequestAPI(this.from, "/v1/resources/products", searchParams, "include") as ProductFullTextSearch[]
    
        return types
    }

    private async searchFromServer(query: string, page: number, per_page: number, session_id: string): Promise<ProductFullTextSearch[]> {
        const searchParams = new URLSearchParams()
    
        if(query.length) {
            searchParams.append("query", query)
        }
        searchParams.append("page", String(page))
        searchParams.append("per_page", String(per_page))
    
        const types = await RequestAPI(this.from, "/v1/resources/products", searchParams, undefined, {
            "Cookie": `session_id=${session_id}`
        }) as ProductFullTextSearch[]
    
        return types
    }

    public async getProduct(product_id: number, session_id?: F extends RequestAPIFrom.Server ? string : never): Promise<DetailedProduct> {
        switch(this.from) {
            case RequestAPIFrom.Server:
                return await this.getProductFromServer(product_id, session_id);
            
        }
    }

    private async getProductFromServer(product_id: number, session_id: string): Promise<DetailedProduct> {
        const data = await RequestAPI(this.from, `/v1/products/${product_id}`, null, "include", {
            "Cookie": `session_id=${session_id}`
        })

        return data as DetailedProduct
    }

    public async getProductRatings(seller_id: number, product_id: number, session_id?: F extends RequestAPIFrom.Server ? string : never): Promise<FullRating> {
        switch(this.from) {
            case RequestAPIFrom.Server:
                return await this.getProductRatingsFromServer(seller_id, product_id, session_id);   
        }
    }

    private async getProductRatingsFromServer(seller_id: number, product_id: number, session_id: string): Promise<FullRating> {
        const params = new URLSearchParams()

        params.append("page", "1")
        params.append("per_page", "10")

        const data = await RequestAPI(this.from, `/v1/sellers/${seller_id}/products/${product_id}/ratings`, params, "include", {
            "Cookie": `session_id=${session_id}`
        }) as FullRating

        return data
    }

    public async getCustomerRatings(customer_id: number, page: number, session_id?: F extends RequestAPIFrom.Server ? string : never): Promise<IndividualRating[]> {
        switch(this.from) {
            case RequestAPIFrom.Server:
                return await this.getCustomerRatingsFromServer(customer_id, page, session_id);
            break;
            case RequestAPIFrom.Client:
                return await this.getCustomerRatingsFromClient(customer_id, page)
        }
    }

    private async getCustomerRatingsFromClient(customer_id: number, page: number,): Promise<IndividualRating[]> {
        const params = new URLSearchParams()

        params.append("page", page.toString())
        params.append("per_page", "10")

        const data = await RequestAPI(this.from, `/v1/customers/${customer_id}/ratings`, params, "include") as IndividualRating[]

        return data
    }

    private async getCustomerRatingsFromServer(customer_id: number, page: number, session_id: string): Promise<IndividualRating[]> {
        const params = new URLSearchParams()

        params.append("page", page.toString())
        params.append("per_page", "10")

        const data = await RequestAPI(this.from, `/v1/customers/${customer_id}/ratings`, params, "include", {
            "Cookie": `session_id=${session_id}`
        }) as IndividualRating[]

        return data
    }

    public async getSellerRatings(seller_id: number, page: number, session_id?: F extends RequestAPIFrom.Server ? string : never): Promise<IndividualRating[]> {
        switch(this.from) {
            case RequestAPIFrom.Server:
                return await this.getSellersRatingsFromServer(seller_id, page, session_id);
            break;
            case RequestAPIFrom.Client:
                return await this.getSellerRatingsFromClient(seller_id, page)
        }
    }

    private async getSellerRatingsFromClient(seller_id: number, page: number,): Promise<IndividualRating[]> {
        const params = new URLSearchParams()

        params.append("page", page.toString())
        params.append("per_page", "10")

        const data = await RequestAPI(this.from, `/v1/sellers/${seller_id}/ratings`, params, "include") as IndividualRating[]

        return data
    }

    private async getSellersRatingsFromServer(seller_id: number, page: number, session_id: string): Promise<IndividualRating[]> {
        const params = new URLSearchParams()

        params.append("page", page.toString())
        params.append("per_page", "10")

        const data = await RequestAPI(this.from, `/v1/sellers/${seller_id}/ratings`, params, "include", {
            "Cookie": `session_id=${session_id}`
        }) as IndividualRating[]

        return data
    }

    public async getSellerProducts(seller_id: number, page: number, session_id?: F extends RequestAPIFrom.Server ? string : never): Promise<Product[]> {
        switch(this.from) {
            case RequestAPIFrom.Server:
                return await this.getSellersProductsFromServer(seller_id, page, session_id);
            break;
            case RequestAPIFrom.Client:
                return await this.getSellerProductsFromClient(seller_id, page)
        }
    }

    private async getSellerProductsFromClient(seller_id: number, page: number,): Promise<Product[]> {
        const params = new URLSearchParams()

        params.append("page", page.toString())
        params.append("per_page", "10")

        const data = await RequestAPI(this.from, `/v1/sellers/${seller_id}/products`, params, "include") as Product[]

        return data
    }

    private async getSellersProductsFromServer(seller_id: number, page: number, session_id: string): Promise<Product[]> {
        const params = new URLSearchParams()

        params.append("page", page.toString())
        params.append("per_page", "10")

        const data = await RequestAPI(this.from, `/v1/sellers/${seller_id}/products`, params, "include", {
            "Cookie": `session_id=${session_id}`
        }) as Product[]

        return data
    }

    public async getCart(): Promise<Cart[]> {
        const data = await RequestAPI(this.from, `/v1/users/@me/cart`, undefined, "include") as Cart[]

        return data
    }

    public async getSellerSchedules(seller_id: number, session_id?: F extends RequestAPIFrom.Server ? string : never): Promise<Schedule[]> {
        switch (this.from) {
            case RequestAPIFrom.Server:
                return await this.getSellerSchedulesFromServer(seller_id, session_id)
            case RequestAPIFrom.Client:
                return await this.getSellerSchedulesFromClient(seller_id)
        }
    }

    private async getSellerSchedulesFromClient(seller_id: number) {
        const data = await RequestAPI(this.from, `/v1/sellers/${seller_id}/schedules`, undefined, "include") as Schedule[]

        return data
    }

    private async getSellerSchedulesFromServer(seller_id: number, session_id: string) {
        const data = await RequestAPI(this.from, `/v1/sellers/${seller_id}/schedules`, undefined, "include", {
            "Cookie": `session_id=${session_id}`
        }) as Schedule[]

        return data
    }

    public async getSeller(seller_id: number, session_id: F extends RequestAPIFrom.Server ? string : never): Promise<Seller> {
        switch (this.from) {
            case RequestAPIFrom.Server:
                return await this.getSellerFromServer(seller_id, session_id)
        }
    }

    private async getSellerFromServer(seller_id: number, session_id: string) {
        const data = await RequestAPI(this.from, `/v1/users/${seller_id}`, undefined, "include", {
            "Cookie": `session_id=${session_id}`
        }) as Seller

        return data
    }

    async createProduct(seller_id: number, productData: FormData) {
        const data = await RequestAPI(this.from, `/v1/sellers/${seller_id}/products`, undefined, "include", undefined, "POST", productData)
        
        return data
    }

    async editProduct(seller_id: number, product_id, productData: FormData) {
        const data = await RequestAPI(this.from, `/v1/sellers/${seller_id}/products/${product_id}`, undefined, "include", undefined, "PATCH", productData)
        
        return data
    }

    async getOrder(orderId: string, session_id: string) {
        const data = await RequestAPI(this.from, `/v1/users/@me/orders/${orderId}`, undefined, "include", {
            "Cookie": `session_id=${session_id}`
        })
        
        return data
    }

    async getOrdersFromClient(): Promise<SellerOrder[]> {
        const data = await RequestAPI(this.from, `/v1/users/@me/orders`, undefined, "include") as SellerOrder[]
        
        return data
    }

    async deleteOrder(orderId: number) {
        const data = await RequestAPI(this.from, `/v1/users/@me/orders/${orderId}`, undefined, "include", undefined, "DELETE") as unknown
        
        return data
    }

    private async getChatsFromClient() {
        const data = await RequestAPI(this.from, `/v1/users/@me/chats`, undefined, "include") as ChatPreview[]

        return data
    }
    
    private async getChatsFromServer(session_id: string) {
        const data = await RequestAPI(this.from, `/v1/users/@me/chats`, undefined, "include", {
            "Cookie": `session_id=${session_id}`
        }) as ChatPreview[]

        return data
    }

    public async getChats(session_id: F extends RequestAPIFrom.Server ? string : undefined) {
        switch (this.from) {
            case RequestAPIFrom.Client:
                return await this.getChatsFromClient()
            case RequestAPIFrom.Server:
                return await this.getChatsFromServer(session_id)
        }
    }

    public async getChatMessagesFromClient(chat_id: number, page: number, per_page: number) {
        const params = new URLSearchParams()
        params.append("page", page.toString())
        params.append("per_page", per_page.toString())

        return await RequestAPI(this.from, `/v1/users/@me/chats/${chat_id}/messages`, params, "include") as ChatMessage[]
    }

    public async getChatMessagesFromServer(chat_id: number, page: number, per_page: number, session_id: string) {
        const params = new URLSearchParams()
        params.append("page", page.toString())
        params.append("per_page", per_page.toString())

        return await RequestAPI(this.from, `/v1/users/@me/chats/${chat_id}/messages`, params, "include", {
            "Cookie": `session_id=${session_id}`
        }) as ChatMessage[]
    }

    public async getChatMessages(chat_id: number, page: number, per_page: number, session_id: F extends RequestAPIFrom.Server ? string : undefined) {
        switch (this.from) {
            case RequestAPIFrom.Client:
                return await this.getChatMessagesFromClient(chat_id, page, per_page)
            case RequestAPIFrom.Server:
                return await this.getChatMessagesFromServer(chat_id, page, per_page, session_id)
        }
    }
}


enum RequestAPIFrom {
    Server = 1,
    Client = 2
}

export {
    RequestAPIFrom
}

export default APIWrapper