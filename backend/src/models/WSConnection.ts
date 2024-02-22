import {User} from "./db-models/User";

export class WSConnection {
    user: User
    client: any
    args: any


    constructor(user: User, client: any, args: any) {
        this.user = user;
        this.client = client;
        this.args = args;
    }
}