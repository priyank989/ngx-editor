import { EventEmitter, ElementRef } from '@angular/core';
export declare class NgxEditorToolbarComponent {
    config: any;
    enableToolbar: boolean;
    showToolbar: boolean;
    execute: EventEmitter<string>;
    colorElement: ElementRef;
    constructor();
    canEnableToolbarOptions(value: any): boolean;
    triggerCommand(command: string): void;
    triggerCommandColor($event: Event): void;
}
