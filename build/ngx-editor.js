import { Component, ElementRef, EventEmitter, HostListener, Injectable, Input, NgModule, Output, Renderer2, ViewChild, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject as Subject$1 } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

class CommandExecutorService {
    /**
     * @param {?} command
     * @return {?}
     */
    execute(command) {
        if (command === 'enableObjectResizing') {
            document.execCommand('enableObjectResizing', true, true);
            return;
        }
        if (command === 'blockquote') {
            document.execCommand('formatBlock', false, '<blockquote>');
            return;
        }
        if (command === 'removeBlockquote') {
            document.execCommand('formatBlock', false, 'div');
            return;
        }
        if (command === 'link') {
            this.createLink();
            return;
        }
        if (command === 'image') {
            this.insertImage();
            return;
        }
        if (command.includes('foreColor')) {
            const /** @type {?} */ color = command.split(':')[1];
            document.execCommand('foreColor', false, color);
            return;
        }
        document.execCommand(command, false, null);
    }
    /**
     * @return {?}
     */
    insertImage() {
        const /** @type {?} */ imageURI = prompt('Enter Image URL', 'http://');
        if (imageURI) {
            const /** @type {?} */ inserted = document.execCommand('insertImage', false, imageURI);
            if (!inserted) {
                throw new Error('Invalid URL');
            }
        }
        return;
    }
    /**
     * @return {?}
     */
    createLink() {
        const /** @type {?} */ selection = document.getSelection();
        if (selection.anchorNode.parentElement.tagName === 'A') {
            const /** @type {?} */ linkURL = prompt('Enter URL', selection.anchorNode.parentElement.getAttribute('href'));
            if (linkURL) {
                document.execCommand('createLink', false, linkURL);
            }
        }
        else {
            if (selection['type'] === 'None') {
                throw new Error('No selection made');
            }
            else {
                const /** @type {?} */ linkURL = prompt('Enter URL', 'http://');
                if (linkURL) {
                    document.execCommand('createLink', false, linkURL);
                }
            }
        }
        return;
    }
}
CommandExecutorService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
CommandExecutorService.ctorParameters = () => [];

const FIVE_SECONDS = 5000;
class MessageService {
    constructor() {
        this.message = new Subject$1();
    }
    /**
     * @return {?}
     */
    getMessage() {
        return this.message.asObservable();
    }
    /**
     * @param {?} message
     * @return {?}
     */
    sendMessage(message) {
        this.message.next(message);
        this.clearMessageIn(FIVE_SECONDS);
        return;
    }
    /**
     * @param {?} milliseconds
     * @return {?}
     */
    clearMessageIn(milliseconds) {
        setTimeout(() => {
            this.message.next(undefined);
        }, milliseconds);
        return;
    }
}
MessageService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
MessageService.ctorParameters = () => [];

const ngxEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    placeholder: 'Enter text here...',
    toolbar: [
        ['bold', 'italic', 'underline', 'strikeThrough', 'superscript', 'subscript', 'foreColor'],
        ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'indent', 'outdent'],
        ['cut', 'copy', 'delete', 'removeFormat', 'undo', 'redo'],
        ['paragraph', 'blockquote', 'removeBlockquote', 'horizontalLine', 'orderedList', 'unorderedList'],
        ['link', 'unlink', 'image']
    ]
};

/**
 * @param {?} value
 * @param {?} toolbar
 * @return {?}
 */
function canEnableToolbarOptions(value, toolbar) {
    if (value) {
        if (toolbar['length'] === 0) {
            return true;
        }
        else {
            const /** @type {?} */ found = toolbar.filter(array => {
                return array.indexOf(value) !== -1;
            });
            return found.length ? true : false;
        }
    }
    else {
        return false;
    }
}
/**
 * @param {?} value
 * @param {?} ngxEditorConfig
 * @param {?} input
 * @return {?}
 */
function getEditorConfiguration(value, ngxEditorConfig, input) {
    for (const /** @type {?} */ i in ngxEditorConfig) {
        if (i) {
            if (input[i]) {
                value[i] = input[i];
            }
            if (!value.hasOwnProperty(i)) {
                value[i] = ngxEditorConfig[i];
            }
        }
    }
    return value;
}
/**
 * @param {?} resizer
 * @return {?}
 */
function canResize(resizer) {
    if (resizer === 'basic') {
        return 'vertical';
    }
    return false;
}


var Utils = Object.freeze({
	canEnableToolbarOptions: canEnableToolbarOptions,
	getEditorConfiguration: getEditorConfiguration,
	canResize: canResize
});

class NgxEditorComponent {
    /**
     * @param {?} _elementRef
     * @param {?} _messageService
     * @param {?} _commandExecutor
     * @param {?} _renderer
     */
    constructor(_elementRef, _messageService, _commandExecutor, _renderer) {
        this._elementRef = _elementRef;
        this._messageService = _messageService;
        this._commandExecutor = _commandExecutor;
        this._renderer = _renderer;
        this.resizer = 'stack';
        this.config = ngxEditorConfig;
        this.showToolbar = true;
        this.buttonClickedParent = new EventEmitter();
        this.enableToolbar = false;
        this.Utils = Utils;
        this.lastViewModel = '';
    }
    /**
     * @return {?}
     */
    onFocus() {
        this.enableToolbar = true;
        return;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onDocumentClick(event) {
        this.enableToolbar = !!this._elementRef.nativeElement.contains(event.target);
    }
    /**
     * @param {?} html
     * @return {?}
     */
    onContentChange(html) {
        if (typeof this.onChange === 'function') {
            this.onChange(html);
        }
        return;
    }
    /**
     * @return {?}
     */
    onBlur() {
        if (typeof this.onTouched === 'function') {
            this.onTouched();
        }
        return;
    }
    /**
     * @param {?} offsetY
     * @return {?}
     */
    resizeTextArea(offsetY) {
        let /** @type {?} */ newHeight = parseInt(this.height, 10);
        newHeight += offsetY;
        this.height = newHeight + 'px';
        this.textArea.nativeElement.style.height = this.height;
        return;
    }
    /**
     * @param {?} commandName
     * @return {?}
     */
    executeCommand(commandName) {
        try {
            this._commandExecutor.execute(commandName);
        }
        catch (error) {
            this._messageService.sendMessage(error.message);
        }
        return;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    writeValue(value) {
        if (value === undefined) {
            return;
        }
        this.refreshView(value);
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) {
        this.onChange = fn;
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    refreshView(value) {
        const /** @type {?} */ normalizedValue = value == null ? '' : value;
        this._renderer.setProperty(this.textArea.nativeElement, 'innerHTML', normalizedValue);
        return;
    }
    /**
     * @return {?}
     */
    getCollectiveParams() {
        return {
            editable: this.editable,
            spellcheck: this.spellcheck,
            placeholder: this.placeholder,
            translate: this.translate,
            height: this.height,
            minHeight: this.minHeight,
            width: this.width,
            minWidth: this.minWidth,
            toolbar: this.toolbar
        };
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        // set configuartion
        this.config = this.Utils.getEditorConfiguration(this.config, ngxEditorConfig, this.getCollectiveParams());
        this.height = this.height || this.textArea.nativeElement.offsetHeight;
        this.executeCommand('enableObjectResizing');
    }
    /**
     * @return {?}
     */
    clickButtonParent() {
        this.buttonClickedParent.emit();
    }
}
NgxEditorComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-ngx-editor',
                template: `
    <div class="ngx-editor" id="ngxEditor" [style.width]="config['width']" [style.minWidth]="config['minWidth']">

      <app-ngx-editor-toolbar [config]="config" [enableToolbar]="enableToolbar" [showToolbar]="showToolbar"
                              (buttonClicked)="clickButtonParent()"
                              (execute)="executeCommand($event)"></app-ngx-editor-toolbar>

      <!-- text area -->
      <div class="ngx-editor-textarea" [attr.contenteditable]="config['editable']"
           [attr.placeholder]="config['placeholder']" (input)="onContentChange($event.target.innerHTML)"
           [attr.translate]="config['translate']" [attr.spellcheck]="config['spellcheck']" [style.height]="config['height']"
           [style.minHeight]="config['minHeight']"
           [style.resize]="Utils?.canResize(resizer)" (focus)="onFocus()" (blur)="onBlur()" #ngxTextArea></div>

      <app-ngx-editor-message></app-ngx-editor-message>

      <app-ngx-grippie *ngIf="resizer === 'stack'"></app-ngx-grippie>

    </div>
  `,
                styles: [`
    /*
     * editor styles
     */
    .ngx-editor {
      position: relative; }
      .ngx-editor ::ng-deep [contenteditable=true]:empty:before {
        content: attr(placeholder);
        display: block;
        color: #868e96;
        opacity: 1; }
      .ngx-editor .ngx-editor-textarea {
        min-height: 5rem;
        padding: 0.5rem 0.8rem 1rem 0.8rem;
        border: 1px solid #ddd;
        background-color: #fff;
        overflow-x: hidden;
        overflow-y: auto; }
        .ngx-editor .ngx-editor-textarea:focus, .ngx-editor .ngx-editor-textarea.focus {
          outline: 0; }
        .ngx-editor .ngx-editor-textarea ::ng-deep blockquote {
          margin-left: 1rem;
          border-left: 0.2em solid #dfe2e5;
          padding-left: 0.5rem; }
  `],
                providers: [
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => NgxEditorComponent),
                        multi: true
                    }
                ]
            },] },
];
/**
 * @nocollapse
 */
NgxEditorComponent.ctorParameters = () => [
    { type: ElementRef, },
    { type: MessageService, },
    { type: CommandExecutorService, },
    { type: Renderer2, },
];
NgxEditorComponent.propDecorators = {
    'editable': [{ type: Input },],
    'spellcheck': [{ type: Input },],
    'placeholder': [{ type: Input },],
    'translate': [{ type: Input },],
    'height': [{ type: Input },],
    'minHeight': [{ type: Input },],
    'width': [{ type: Input },],
    'minWidth': [{ type: Input },],
    'toolbar': [{ type: Input },],
    'resizer': [{ type: Input },],
    'config': [{ type: Input },],
    'showToolbar': [{ type: Input },],
    'buttonClickedParent': [{ type: Output },],
    'textArea': [{ type: ViewChild, args: ['ngxTextArea',] },],
    'onDocumentClick': [{ type: HostListener, args: ['document:click', ['$event'],] },],
};

class NgxGrippieComponent {
    /**
     * @param {?} _editorComponent
     */
    constructor(_editorComponent) {
        this._editorComponent = _editorComponent;
        this.oldY = 0;
        this.grabber = false;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onMouseMove(event) {
        if (!this.grabber) {
            return;
        }
        this._editorComponent.resizeTextArea(event.clientY - this.oldY);
        this.oldY = event.clientY;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onMouseUp(event) {
        this.grabber = false;
    }
    /**
     * @param {?} event
     * @param {?=} resizer
     * @return {?}
     */
    onResize(event, resizer) {
        this.grabber = true;
        this.oldY = event.clientY;
        event.preventDefault();
    }
}
NgxGrippieComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-ngx-grippie',
                template: `
    <div class="ngx-editor-grippie">
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="651.6 235 26 5"
        width="26" height="5">
        <g id="sprites">
          <path d=" M 651.6 235 L 653.6 235 L 653.6 237 L 651.6 237 M 654.6 238 L 656.6 238 L 656.6 240 L 654.6 240 M 660.6 238 L 662.6 238 L 662.6 240 L 660.6 240 M 666.6 238 L 668.6 238 L 668.6 240 L 666.6 240 M 672.6 238 L 674.6 238 L 674.6 240 L 672.6 240 M 657.6 235 L 659.6 235 L 659.6 237 L 657.6 237 M 663.6 235 L 665.6 235 L 665.6 237 L 663.6 237 M 669.6 235 L 671.6 235 L 671.6 237 L 669.6 237 M 675.6 235 L 677.6 235 L 677.6 237 L 675.6 237"
            fill="rgb(147,153,159)" />
        </g>
      </svg>
    </div>
  `,
                styles: [`
    .ngx-editor-grippie {
      height: 9px;
      background-color: #f1f1f1;
      position: relative;
      text-align: center;
      cursor: s-resize;
      border: 1px solid #ddd;
      border-top: transparent; }
      .ngx-editor-grippie svg {
        position: absolute;
        top: 1.5px;
        width: 50%;
        right: 25%; }
  `]
            },] },
];
/**
 * @nocollapse
 */
NgxGrippieComponent.ctorParameters = () => [
    { type: NgxEditorComponent, },
];
NgxGrippieComponent.propDecorators = {
    'onMouseMove': [{ type: HostListener, args: ['document:mousemove', ['$event'],] },],
    'onMouseUp': [{ type: HostListener, args: ['document:mouseup', ['$event'],] },],
    'onResize': [{ type: HostListener, args: ['mousedown', ['$event'],] },],
};

class NgxEditorMessageComponent {
    /**
     * @param {?} _messageService
     */
    constructor(_messageService) {
        this._messageService = _messageService;
        this.ngxMessage = '';
        this._messageService.getMessage().subscribe((message) => this.ngxMessage = message);
    }
    /**
     * @return {?}
     */
    clearMessage() {
        this.ngxMessage = undefined;
    }
}
NgxEditorMessageComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-ngx-editor-message',
                template: `
    <div class="ngx-editor-message" *ngIf="ngxMessage" (dblclick)="clearMessage()">
      {{ ngxMessage }}
    </div>
  `,
                styles: [`
    .ngx-editor-message {
      font-size: 80%;
      background-color: #f1f1f1;
      border: 1px solid #ddd;
      border-top: transparent;
      padding: 0 0.5rem;
      padding-bottom: 0.1rem;
      -webkit-transition: 0.5s ease-in;
      transition: 0.5s ease-in; }
  `]
            },] },
];
/**
 * @nocollapse
 */
NgxEditorMessageComponent.ctorParameters = () => [
    { type: MessageService, },
];

class NgxEditorToolbarComponent {
    constructor() {
        this.enableToolbar = false;
        this.showToolbar = true;
        this.execute = new EventEmitter();
        this.buttonClicked = new EventEmitter();
    }
    /**
     * @param {?} value
     * @return {?}
     */
    canEnableToolbarOptions(value) {
        return canEnableToolbarOptions(value, this.config['toolbar']);
    }
    /**
     * @param {?} command
     * @return {?}
     */
    triggerCommand(command) {
        if (command === 'foreColor') {
            this.colorElement.nativeElement.click();
            return;
        }
        this.execute.emit(command);
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    triggerCommandColor($event) {
        this.execute.emit('foreColor:' + (($event.target)).value);
    }
    /**
     * @return {?}
     */
    clickButton() {
        this.buttonClicked.emit();
    }
}
NgxEditorToolbarComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-ngx-editor-toolbar',
                template: `
    <div class="ngx-toolbar" *ngIf="showToolbar">
      <input type="color" style="width: 0; height: 0; position: absolute; opacity: 0;" (input)="triggerCommandColor($event)" #colorElement>
      <div class="ngx-toolbar-set">
        <button type="button" class="ngx-editor-button" *ngIf="canEnableToolbarOptions('foreColor')" (click)="triggerCommand('foreColor')"
                title="Bold" [disabled]="!enableToolbar">
          <i class="fa fa-tint" aria-hidden="true"></i>
        </button>
        <button type="button" class="ngx-editor-button" *ngIf="canEnableToolbarOptions('bold')" (click)="triggerCommand('bold')"
          title="Bold" [disabled]="!enableToolbar">
          <i class="fa fa-bold" aria-hidden="true"></i>
        </button>
        <button type="button" class="ngx-editor-button" *ngIf="canEnableToolbarOptions('italic')" (click)="triggerCommand('italic')"
          title="Italic" [disabled]="!enableToolbar">
          <i class="fa fa-italic" aria-hidden="true"></i>
        </button>
        <button type="button" class="ngx-editor-button" *ngIf="canEnableToolbarOptions('underline')" (click)="triggerCommand('underline')"
          title="Underline" [disabled]="!enableToolbar">
          <i class="fa fa-underline" aria-hidden="true"></i>
        </button>
        <button type="button" class="ngx-editor-button" *ngIf="canEnableToolbarOptions('strikeThrough')" (click)="triggerCommand('strikeThrough')"
          title="Strikethrough" [disabled]="!enableToolbar">
          <i class="fa fa-strikethrough" aria-hidden="true"></i>
        </button>
        <button type="button" class="ngx-editor-button" *ngIf="canEnableToolbarOptions('superscript')" (click)="triggerCommand('superscript')"
          title="Superscript" [disabled]="!enableToolbar">
          <i class="fa fa-superscript" aria-hidden="true"></i>
        </button>
        <button type="button" class="ngx-editor-button" *ngIf="canEnableToolbarOptions('subscript')" (click)="triggerCommand('subscript')"
          title="Subscript" [disabled]="!enableToolbar">
          <i class="fa fa-subscript" aria-hidden="true"></i>
        </button>
      </div>
      <div class="ngx-toolbar-set">
        <button type="button" class="ngx-editor-button" *ngIf="canEnableToolbarOptions('justifyLeft')" (click)="triggerCommand('justifyLeft')"
          title="Justify Left" [disabled]="!enableToolbar">
          <i class="fa fa-align-left" aria-hidden="true"></i>
        </button>
        <button type="button" class="ngx-editor-button" *ngIf="canEnableToolbarOptions('justifyCenter')" (click)="triggerCommand('justifyCenter')"
          title="Justify Center" [disabled]="!enableToolbar">
          <i class="fa fa-align-center" aria-hidden="true"></i>
        </button>
        <button type="button" class="ngx-editor-button" *ngIf="canEnableToolbarOptions('justifyRight')" (click)="triggerCommand('justifyRight')"
          title="Justify Right" [disabled]="!enableToolbar">
          <i class="fa fa-align-right" aria-hidden="true"></i>
        </button>
        <button type="button" class="ngx-editor-button" *ngIf="canEnableToolbarOptions('justifyFull')" (click)="triggerCommand('justifyFull')"
          title="Justify" [disabled]="!enableToolbar">
          <i class="fa fa-align-justify" aria-hidden="true"></i>
        </button>
        <button type="button" class="ngx-editor-button" *ngIf="canEnableToolbarOptions('indent')" (click)="triggerCommand('indent')"
          title="Indent" [disabled]="!enableToolbar">
          <i class="fa fa-indent" aria-hidden="true"></i>
        </button>
        <button type="button" class="ngx-editor-button" *ngIf="canEnableToolbarOptions('outdent')" (click)="triggerCommand('outdent')"
          title="Outdent" [disabled]="!enableToolbar">
          <i class="fa fa-outdent" aria-hidden="true"></i>
        </button>
      </div>
      <div class="ngx-toolbar-set">
        <button type="button" class="ngx-editor-button" *ngIf="canEnableToolbarOptions('cut')" (click)="triggerCommand('cut')" title="Cut"
          [disabled]="!enableToolbar">
          <i class="fa fa-scissors" aria-hidden="true"></i>
        </button>
        <button type="button" class="ngx-editor-button" *ngIf="canEnableToolbarOptions('copy')" (click)="triggerCommand('copy')"
          title="Copy" [disabled]="!enableToolbar">
          <i class="fa fa-files-o" aria-hidden="true"></i>
        </button>
        <button type="button" class="ngx-editor-button" *ngIf="canEnableToolbarOptions('delete')" (click)="triggerCommand('delete')"
          title="Delete" [disabled]="!enableToolbar">
          <i class="fa fa-trash" aria-hidden="true"></i>
        </button>
        <button type="button" class="ngx-editor-button" *ngIf="canEnableToolbarOptions('removeFormat')" (click)="triggerCommand('removeFormat')"
          title="Clear Formatting" [disabled]="!enableToolbar">
          <i class="fa fa-eraser" aria-hidden="true"></i>
        </button>
        <button type="button" class="ngx-editor-button" *ngIf="canEnableToolbarOptions('undo')" (click)="triggerCommand('undo')"
          title="Undo" [disabled]="!enableToolbar">
          <i class="fa fa-undo" aria-hidden="true"></i>
        </button>
        <button type="button" class="ngx-editor-button" *ngIf="canEnableToolbarOptions('redo')" (click)="triggerCommand('redo')"
          title="Redo" [disabled]="!enableToolbar">
          <i class="fa fa-repeat" aria-hidden="true"></i>
        </button>
      </div>
      <div class="ngx-toolbar-set">
        <button type="button" class="ngx-editor-button" *ngIf="canEnableToolbarOptions('paragraph')" (click)="triggerCommand('insertParagraph')"
          title="Paragraph" [disabled]="!enableToolbar">
          <i class="fa fa-paragraph" aria-hidden="true"></i>
        </button>
        <button type="button" class="ngx-editor-button" *ngIf="canEnableToolbarOptions('blockquote')" (click)="triggerCommand('blockquote')"
          title="Blockquote" [disabled]="!enableToolbar">
          <i class="fa fa-quote-left" aria-hidden="true"></i>
        </button>
        <button type="button" class="ngx-editor-button" *ngIf="canEnableToolbarOptions('removeBlockquote')" (click)="triggerCommand('removeBlockquote')"
          title="Remove Blockquote" [disabled]="!enableToolbar">
          <i class="fa fa-quote-right" aria-hidden="true"></i>
        </button>
        <button type="button" class="ngx-editor-button" *ngIf="canEnableToolbarOptions('horizontalLine')" (click)="triggerCommand('insertHorizontalRule')"
          title="Horizontal Line" [disabled]="!enableToolbar">
          <i class="fa fa-minus" aria-hidden="true"></i>
        </button>
        <button type="button" class="ngx-editor-button" *ngIf="canEnableToolbarOptions('orderedList')" (click)="triggerCommand('insertUnorderedList')"
          title="Unodered List" [disabled]="!enableToolbar">
          <i class="fa fa-list-ul" aria-hidden="true"></i>
        </button>
        <button type="button" class="ngx-editor-button" *ngIf="canEnableToolbarOptions('unorderedList')" (click)="triggerCommand('insertOrderedList')"
          title="Ordered List" [disabled]="!enableToolbar">
          <i class="fa fa-list-ol" aria-hidden="true"></i>
        </button>
      </div>
      <div class="ngx-toolbar-set">
        <button type="button" class="ngx-editor-button" *ngIf="canEnableToolbarOptions('link')" (click)="triggerCommand('link')"
          title="Insert/Edit Link" [disabled]="!enableToolbar">
          <i class="fa fa-link" aria-hidden="true"></i>
        </button>
        <button type="button" class="ngx-editor-button" *ngIf="canEnableToolbarOptions('unlink')" (click)="triggerCommand('unlink')"
          title="Unlink" [disabled]="!enableToolbar">
          <i class="fa fa-chain-broken" aria-hidden="true"></i>
        </button>
        <button type="button" class="ngx-editor-button" *ngIf="canEnableToolbarOptions('image')" (click)="clickButton()"
          title="Insert Image" [disabled]="!enableToolbar">
          <i class="fa fa-picture-o" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  `,
                styles: [`
    .ngx-toolbar {
      background-color: #f5f5f5;
      font-size: 0.8rem;
      padding: 0.2rem;
      border: 1px solid #ddd;
      border-bottom: transparent; }
      .ngx-toolbar .ngx-toolbar-set {
        display: inline-block;
        border: 1px solid #ddd;
        border-radius: 5px;
        background-color: white; }
        .ngx-toolbar .ngx-toolbar-set .ngx-editor-button {
          background-color: #f5f5f5;
          background-color: transparent;
          border: 0;
          padding: 0.4rem;
          min-width: 2.5rem;
          float: left;
          border-right: 1px solid #ddd; }
          .ngx-toolbar .ngx-toolbar-set .ngx-editor-button:hover {
            cursor: pointer;
            background-color: #f1f1f1;
            -webkit-transition: 0.2s ease;
            transition: 0.2s ease; }
          .ngx-toolbar .ngx-toolbar-set .ngx-editor-button:focus, .ngx-toolbar .ngx-toolbar-set .ngx-editor-button.focus {
            outline: 0; }
          .ngx-toolbar .ngx-toolbar-set .ngx-editor-button:last-child {
            border-right: transparent; }
          .ngx-toolbar .ngx-toolbar-set .ngx-editor-button:first-child {
            border-top-left-radius: 5px;
            border-bottom-left-radius: 5px; }
          .ngx-toolbar .ngx-toolbar-set .ngx-editor-button:last-child {
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px; }
          .ngx-toolbar .ngx-toolbar-set .ngx-editor-button:disabled {
            background-color: #f5f5f5;
            pointer-events: none;
            cursor: not-allowed; }
  `]
            },] },
];
/**
 * @nocollapse
 */
NgxEditorToolbarComponent.ctorParameters = () => [];
NgxEditorToolbarComponent.propDecorators = {
    'config': [{ type: Input },],
    'enableToolbar': [{ type: Input },],
    'showToolbar': [{ type: Input },],
    'execute': [{ type: Output },],
    'buttonClicked': [{ type: Output },],
    'colorElement': [{ type: ViewChild, args: ['colorElement',] },],
};

// components
// services
class NgxEditorModule {
}
NgxEditorModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule
                ],
                declarations: [NgxEditorComponent, NgxGrippieComponent, NgxEditorMessageComponent, NgxEditorToolbarComponent],
                exports: [NgxEditorComponent],
                providers: [CommandExecutorService, MessageService]
            },] },
];
/**
 * @nocollapse
 */
NgxEditorModule.ctorParameters = () => [];

/**
 * Generated bundle index. Do not edit.
 */

export { NgxEditorModule, CommandExecutorService as ɵc, MessageService as ɵb, NgxEditorMessageComponent as ɵe, NgxEditorToolbarComponent as ɵf, NgxEditorComponent as ɵa, NgxGrippieComponent as ɵd };
//# sourceMappingURL=ngx-editor.js.map
