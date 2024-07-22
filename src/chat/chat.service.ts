import { Injectable } from '@nestjs/common';

interface Client {
    id: string;
    name: string;
}

@Injectable()
export class ChatService {
    private client: Record<string, Client> = {};

    onClientConnected( client: Client ){
        this.client[ client.id ] = client;
    }

    onClientDisconnected(id: string){
        delete this.client[id];
    }

    getClients(){
        return Object.values(this.client)
    }
}
