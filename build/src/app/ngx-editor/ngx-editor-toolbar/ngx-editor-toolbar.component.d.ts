import { EventEmitter, ElementRef } from '@angular/core';
export declare class NgxEditorToolbarComponent {
    config: any;
    enableToolbar: boolean;
    showToolbar: boolean;
    execute: EventEmitter<string>;
    buttonClicked: EventEmitter<any>;
    colorElement: ElementRef;
    constructor();
    canEnableToolbarOptions(value: any): boolean;
    triggerCommand(command: string): void;
    triggerCommandColor($event: Event): void;
    clickButton(): void;
}
