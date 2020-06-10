import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
export declare class MessageService {
    private message;
    constructor();
    getMessage(): Observable<string>;
    sendMessage(message: string): void;
    private clearMessageIn(milliseconds);
}
