import { NgxEditorComponent } from '../ngx-editor.component';
export declare class NgxGrippieComponent {
    private _editorComponent;
    height: number;
    oldY: number;
    grabber: boolean;
    constructor(_editorComponent: NgxEditorComponent);
    onMouseMove(event: MouseEvent): void;
    onMouseUp(event: MouseEvent): void;
    onResize(event: MouseEvent, resizer?: Function): void;
}
