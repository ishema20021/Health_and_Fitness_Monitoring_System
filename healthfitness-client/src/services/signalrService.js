import * as signalR from '@microsoft/signalr';
import { SIGNALR_HUB_URL } from '../utils/constants';
import { authService } from './authService';

class SignalRService {
    constructor() {
        this.connection = null;
    }

    async start(onNotification) {
        const token = authService.getToken();
        if (!token) return;

        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(SIGNALR_HUB_URL, {
                accessTokenFactory: () => token,
            })
            .withAutomaticReconnect()
            .build();

        this.connection.on('ReceiveNotification', (title, message, type) => {
            if (onNotification) {
                onNotification({ title, message, type });
            }
        });

        try {
            await this.connection.start();
            console.log('SignalR Connected');
        } catch (err) {
            console.error('SignalR Connection Error:', err);
        }
    }

    async stop() {
        if (this.connection) {
            await this.connection.stop();
            this.connection = null;
        }
    }
}

export default new SignalRService();
