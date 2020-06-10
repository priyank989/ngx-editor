import { MessageService } from '../common/services/message.service';
export declare class NgxEditorMessageComponent {
    private _messageService;
    ngxMessage: string;
    constructor(_messageService: MessageService);
    clearMessage(): void;
}
