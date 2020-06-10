(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@angular/forms'), require('rxjs/Subject'), require('rxjs/add/operator/map')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common', '@angular/forms', 'rxjs/Subject', 'rxjs/add/operator/map'], factory) :
	(factory((global['ngx-editor'] = {}),global.ng.core,global.ng.common,global.ng.forms,global.Rx));
}(this, (function (exports,core,common,forms,Subject) { 'use strict';

var CommandExecutorService = (function () {
    function CommandExecutorService() {
    }
    /**
     * @param {?} command
     * @return {?}
     */
    CommandExecutorService.prototype.execute = function (command) {
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
            var /** @type {?} */ color = command.split(':')[1];
            document.execCommand('foreColor', false, color);
            return;
        }
        document.execCommand(command, false, null);
    };
    /**
     * @return {?}
     */
    CommandExecutorService.prototype.insertImage = function () {
        var /** @type {?} */ imageURI = prompt('Enter Image URL', 'http://');
        if (imageURI) {
            var /** @type {?} */ inserted = document.execCommand('insertImage', false, imageURI);
            if (!inserted) {
                throw new Error('Invalid URL');
            }
        }
        return;
    };
    /**
     * @return {?}
     */
    CommandExecutorService.prototype.createLink = function () {
        var /** @type {?} */ selection = document.getSelection();
        if (selection.anchorNode.parentElement.tagName === 'A') {
            var /** @type {?} */ linkURL = prompt('Enter URL', selection.anchorNode.parentElement.getAttribute('href'));
            if (linkURL) {
                document.execCommand('createLink', false, linkURL);
            }
        }
        else {
            if (selection['type'] === 'None') {
                throw new Error('No selection made');
            }
            else {
                var /** @type {?} */ linkURL = prompt('Enter URL', 'http://');
                if (linkURL) {
                    document.execCommand('createLink', false, linkURL);
                }
            }
        }
        return;
    };
    return CommandExecutorService;
}());
CommandExecutorService.decorators = [
    { type: core.Injectable },
];
/**
 * @nocollapse
 */
CommandExecutorService.ctorParameters = function () { return []; };
var FIVE_SECONDS = 5000;
var MessageService = (function () {
    function MessageService() {
        this.message = new Subject.Subject();
    }
    /**
     * @return {?}
     */
    MessageService.prototype.getMessage = function () {
        return this.message.asObservable();
    };
    /**
     * @param {?} message
     * @return {?}
     */
    MessageService.prototype.sendMessage = function (message) {
        this.message.next(message);
        this.clearMessageIn(FIVE_SECONDS);
        return;
    };
    /**
     * @param {?} milliseconds
     * @return {?}
     */
    MessageService.prototype.clearMessageIn = function (milliseconds) {
        var _this = this;
        setTimeout(function () {
            _this.message.next(undefined);
        }, milliseconds);
        return;
    };
    return MessageService;
}());
MessageService.decorators = [
    { type: core.Injectable },
];
/**
 * @nocollapse
 */
MessageService.ctorParameters = function () { return []; };
var ngxEditorConfig = {
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
            var /** @type {?} */ found = toolbar.filter(function (array) {
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
    for (var /** @type {?} */ i in ngxEditorConfig) {
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
var NgxEditorComponent = (function () {
    /**
     * @param {?} _elementRef
     * @param {?} _messageService
     * @param {?} _commandExecutor
     * @param {?} _renderer
     */
    function NgxEditorComponent(_elementRef, _messageService, _commandExecutor, _renderer) {
        this._elementRef = _elementRef;
        this._messageService = _messageService;
        this._commandExecutor = _commandExecutor;
        this._renderer = _renderer;
        this.resizer = 'stack';
        this.config = ngxEditorConfig;
        this.showToolbar = true;
        this.enableToolbar = false;
        this.Utils = Utils;
        this.lastViewModel = '';
    }
    /**
     * @return {?}
     */
    NgxEditorComponent.prototype.onFocus = function () {
        this.enableToolbar = true;
        return;
    };
    /**
     * @param {?} event
     * @return {?}
     */
    NgxEditorComponent.prototype.onDocumentClick = function (event) {
        this.enableToolbar = !!this._elementRef.nativeElement.contains(event.target);
    };
    /**
     * @param {?} html
     * @return {?}
     */
    NgxEditorComponent.prototype.onContentChange = function (html) {
        if (typeof this.onChange === 'function') {
            this.onChange(html);
        }
        return;
    };
    /**
     * @return {?}
     */
    NgxEditorComponent.prototype.onBlur = function () {
        if (typeof this.onTouched === 'function') {
            this.onTouched();
        }
        return;
    };
    /**
     * @param {?} offsetY
     * @return {?}
     */
    NgxEditorComponent.prototype.resizeTextArea = function (offsetY) {
        var /** @type {?} */ newHeight = parseInt(this.height, 10);
        newHeight += offsetY;
        this.height = newHeight + 'px';
        this.textArea.nativeElement.style.height = this.height;
        return;
    };
    /**
     * @param {?} commandName
     * @return {?}
     */
    NgxEditorComponent.prototype.executeCommand = function (commandName) {
        try {
            this._commandExecutor.execute(commandName);
        }
        catch (error) {
            this._messageService.sendMessage(error.message);
        }
        return;
    };
    /**
     * @param {?} value
     * @return {?}
     */
    NgxEditorComponent.prototype.writeValue = function (value) {
        if (value === undefined) {
            return;
        }
        this.refreshView(value);
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    NgxEditorComponent.prototype.registerOnChange = function (fn) {
        this.onChange = fn;
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    NgxEditorComponent.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    /**
     * @param {?} value
     * @return {?}
     */
    NgxEditorComponent.prototype.refreshView = function (value) {
        var /** @type {?} */ normalizedValue = value == null ? '' : value;
        this._renderer.setProperty(this.textArea.nativeElement, 'innerHTML', normalizedValue);
        return;
    };
    /**
     * @return {?}
     */
    NgxEditorComponent.prototype.getCollectiveParams = function () {
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
    };
    /**
     * @return {?}
     */
    NgxEditorComponent.prototype.ngOnInit = function () {
        // set configuartion
        this.config = this.Utils.getEditorConfiguration(this.config, ngxEditorConfig, this.getCollectiveParams());
        this.height = this.height || this.textArea.nativeElement.offsetHeight;
        this.executeCommand('enableObjectResizing');
    };
    return NgxEditorComponent;
}());
NgxEditorComponent.decorators = [
    { type: core.Component, args: [{
                selector: 'app-ngx-editor',
                template: "\n    <div class=\"ngx-editor\" id=\"ngxEditor\" [style.width]=\"config['width']\" [style.minWidth]=\"config['minWidth']\">\n\n      <app-ngx-editor-toolbar [config]=\"config\" [enableToolbar]=\"enableToolbar\" [showToolbar]=\"showToolbar\" (execute)=\"executeCommand($event)\"></app-ngx-editor-toolbar>\n\n      <!-- text area -->\n      <div class=\"ngx-editor-textarea\" [attr.contenteditable]=\"config['editable']\" [attr.placeholder]=\"config['placeholder']\" (input)=\"onContentChange($event.target.innerHTML)\"\n        [attr.translate]=\"config['translate']\" [attr.spellcheck]=\"config['spellcheck']\" [style.height]=\"config['height']\" [style.minHeight]=\"config['minHeight']\"\n        [style.resize]=\"Utils?.canResize(resizer)\" (focus)=\"onFocus()\" (blur)=\"onBlur()\" #ngxTextArea></div>\n\n      <app-ngx-editor-message></app-ngx-editor-message>\n\n      <app-ngx-grippie *ngIf=\"resizer === 'stack'\"></app-ngx-grippie>\n\n    </div>\n  ",
                styles: ["\n    /*\n     * editor styles\n     */\n    .ngx-editor {\n      position: relative; }\n      .ngx-editor ::ng-deep [contenteditable=true]:empty:before {\n        content: attr(placeholder);\n        display: block;\n        color: #868e96;\n        opacity: 1; }\n      .ngx-editor .ngx-editor-textarea {\n        min-height: 5rem;\n        padding: 0.5rem 0.8rem 1rem 0.8rem;\n        border: 1px solid #ddd;\n        background-color: #fff;\n        overflow-x: hidden;\n        overflow-y: auto; }\n        .ngx-editor .ngx-editor-textarea:focus, .ngx-editor .ngx-editor-textarea.focus {\n          outline: 0; }\n        .ngx-editor .ngx-editor-textarea ::ng-deep blockquote {\n          margin-left: 1rem;\n          border-left: 0.2em solid #dfe2e5;\n          padding-left: 0.5rem; }\n  "],
                providers: [
                    {
                        provide: forms.NG_VALUE_ACCESSOR,
                        useExisting: core.forwardRef(function () { return NgxEditorComponent; }),
                        multi: true
                    }
                ]
            },] },
];
/**
 * @nocollapse
 */
NgxEditorComponent.ctorParameters = function () { return [
    { type: core.ElementRef, },
    { type: MessageService, },
    { type: CommandExecutorService, },
    { type: core.Renderer2, },
]; };
NgxEditorComponent.propDecorators = {
    'editable': [{ type: core.Input },],
    'spellcheck': [{ type: core.Input },],
    'placeholder': [{ type: core.Input },],
    'translate': [{ type: core.Input },],
    'height': [{ type: core.Input },],
    'minHeight': [{ type: core.Input },],
    'width': [{ type: core.Input },],
    'minWidth': [{ type: core.Input },],
    'toolbar': [{ type: core.Input },],
    'resizer': [{ type: core.Input },],
    'config': [{ type: core.Input },],
    'showToolbar': [{ type: core.Input },],
    'textArea': [{ type: core.ViewChild, args: ['ngxTextArea',] },],
    'onDocumentClick': [{ type: core.HostListener, args: ['document:click', ['$event'],] },],
};
var NgxGrippieComponent = (function () {
    /**
     * @param {?} _editorComponent
     */
    function NgxGrippieComponent(_editorComponent) {
        this._editorComponent = _editorComponent;
        this.oldY = 0;
        this.grabber = false;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    NgxGrippieComponent.prototype.onMouseMove = function (event) {
        if (!this.grabber) {
            return;
        }
        this._editorComponent.resizeTextArea(event.clientY - this.oldY);
        this.oldY = event.clientY;
    };
    /**
     * @param {?} event
     * @return {?}
     */
    NgxGrippieComponent.prototype.onMouseUp = function (event) {
        this.grabber = false;
    };
    /**
     * @param {?} event
     * @param {?=} resizer
     * @return {?}
     */
    NgxGrippieComponent.prototype.onResize = function (event, resizer) {
        this.grabber = true;
        this.oldY = event.clientY;
        event.preventDefault();
    };
    return NgxGrippieComponent;
}());
NgxGrippieComponent.decorators = [
    { type: core.Component, args: [{
                selector: 'app-ngx-grippie',
                template: "\n    <div class=\"ngx-editor-grippie\">\n      <svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" style=\"isolation:isolate\" viewBox=\"651.6 235 26 5\"\n        width=\"26\" height=\"5\">\n        <g id=\"sprites\">\n          <path d=\" M 651.6 235 L 653.6 235 L 653.6 237 L 651.6 237 M 654.6 238 L 656.6 238 L 656.6 240 L 654.6 240 M 660.6 238 L 662.6 238 L 662.6 240 L 660.6 240 M 666.6 238 L 668.6 238 L 668.6 240 L 666.6 240 M 672.6 238 L 674.6 238 L 674.6 240 L 672.6 240 M 657.6 235 L 659.6 235 L 659.6 237 L 657.6 237 M 663.6 235 L 665.6 235 L 665.6 237 L 663.6 237 M 669.6 235 L 671.6 235 L 671.6 237 L 669.6 237 M 675.6 235 L 677.6 235 L 677.6 237 L 675.6 237\"\n            fill=\"rgb(147,153,159)\" />\n        </g>\n      </svg>\n    </div>\n  ",
                styles: ["\n    .ngx-editor-grippie {\n      height: 9px;\n      background-color: #f1f1f1;\n      position: relative;\n      text-align: center;\n      cursor: s-resize;\n      border: 1px solid #ddd;\n      border-top: transparent; }\n      .ngx-editor-grippie svg {\n        position: absolute;\n        top: 1.5px;\n        width: 50%;\n        right: 25%; }\n  "]
            },] },
];
/**
 * @nocollapse
 */
NgxGrippieComponent.ctorParameters = function () { return [
    { type: NgxEditorComponent, },
]; };
NgxGrippieComponent.propDecorators = {
    'onMouseMove': [{ type: core.HostListener, args: ['document:mousemove', ['$event'],] },],
    'onMouseUp': [{ type: core.HostListener, args: ['document:mouseup', ['$event'],] },],
    'onResize': [{ type: core.HostListener, args: ['mousedown', ['$event'],] },],
};
var NgxEditorMessageComponent = (function () {
    /**
     * @param {?} _messageService
     */
    function NgxEditorMessageComponent(_messageService) {
        var _this = this;
        this._messageService = _messageService;
        this.ngxMessage = '';
        this._messageService.getMessage().subscribe(function (message) { return _this.ngxMessage = message; });
    }
    /**
     * @return {?}
     */
    NgxEditorMessageComponent.prototype.clearMessage = function () {
        this.ngxMessage = undefined;
    };
    return NgxEditorMessageComponent;
}());
NgxEditorMessageComponent.decorators = [
    { type: core.Component, args: [{
                selector: 'app-ngx-editor-message',
                template: "\n    <div class=\"ngx-editor-message\" *ngIf=\"ngxMessage\" (dblclick)=\"clearMessage()\">\n      {{ ngxMessage }}\n    </div>\n  ",
                styles: ["\n    .ngx-editor-message {\n      font-size: 80%;\n      background-color: #f1f1f1;\n      border: 1px solid #ddd;\n      border-top: transparent;\n      padding: 0 0.5rem;\n      padding-bottom: 0.1rem;\n      -webkit-transition: 0.5s ease-in;\n      transition: 0.5s ease-in; }\n  "]
            },] },
];
/**
 * @nocollapse
 */
NgxEditorMessageComponent.ctorParameters = function () { return [
    { type: MessageService, },
]; };
var NgxEditorToolbarComponent = (function () {
    function NgxEditorToolbarComponent() {
        this.enableToolbar = false;
        this.showToolbar = true;
        this.execute = new core.EventEmitter();
    }
    /**
     * @param {?} value
     * @return {?}
     */
    NgxEditorToolbarComponent.prototype.canEnableToolbarOptions = function (value) {
        return canEnableToolbarOptions(value, this.config['toolbar']);
    };
    /**
     * @param {?} command
     * @return {?}
     */
    NgxEditorToolbarComponent.prototype.triggerCommand = function (command) {
        if (command === 'foreColor') {
            this.colorElement.nativeElement.click();
            return;
        }
        this.execute.emit(command);
    };
    /**
     * @param {?} $event
     * @return {?}
     */
    NgxEditorToolbarComponent.prototype.triggerCommandColor = function ($event) {
        this.execute.emit('foreColor:' + (($event.target)).value);
    };
    return NgxEditorToolbarComponent;
}());
NgxEditorToolbarComponent.decorators = [
    { type: core.Component, args: [{
                selector: 'app-ngx-editor-toolbar',
                template: "\n    <div class=\"ngx-toolbar\" *ngIf=\"showToolbar\">\n      <input type=\"color\" style=\"width: 0; height: 0; position: absolute; opacity: 0;\" (change)=\"triggerCommandColor($event)\" #colorElement>\n      <div class=\"ngx-toolbar-set\">\n        <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('foreColor')\" (click)=\"triggerCommand('foreColor')\"\n                title=\"Bold\" [disabled]=\"!enableToolbar\">\n          <i class=\"fa fa-tint\" aria-hidden=\"true\"></i>\n        </button>\n        <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('bold')\" (click)=\"triggerCommand('bold')\"\n          title=\"Bold\" [disabled]=\"!enableToolbar\">\n          <i class=\"fa fa-bold\" aria-hidden=\"true\"></i>\n        </button>\n        <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('italic')\" (click)=\"triggerCommand('italic')\"\n          title=\"Italic\" [disabled]=\"!enableToolbar\">\n          <i class=\"fa fa-italic\" aria-hidden=\"true\"></i>\n        </button>\n        <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('underline')\" (click)=\"triggerCommand('underline')\"\n          title=\"Underline\" [disabled]=\"!enableToolbar\">\n          <i class=\"fa fa-underline\" aria-hidden=\"true\"></i>\n        </button>\n        <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('strikeThrough')\" (click)=\"triggerCommand('strikeThrough')\"\n          title=\"Strikethrough\" [disabled]=\"!enableToolbar\">\n          <i class=\"fa fa-strikethrough\" aria-hidden=\"true\"></i>\n        </button>\n        <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('superscript')\" (click)=\"triggerCommand('superscript')\"\n          title=\"Superscript\" [disabled]=\"!enableToolbar\">\n          <i class=\"fa fa-superscript\" aria-hidden=\"true\"></i>\n        </button>\n        <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('subscript')\" (click)=\"triggerCommand('subscript')\"\n          title=\"Subscript\" [disabled]=\"!enableToolbar\">\n          <i class=\"fa fa-subscript\" aria-hidden=\"true\"></i>\n        </button>\n      </div>\n      <div class=\"ngx-toolbar-set\">\n        <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('justifyLeft')\" (click)=\"triggerCommand('justifyLeft')\"\n          title=\"Justify Left\" [disabled]=\"!enableToolbar\">\n          <i class=\"fa fa-align-left\" aria-hidden=\"true\"></i>\n        </button>\n        <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('justifyCenter')\" (click)=\"triggerCommand('justifyCenter')\"\n          title=\"Justify Center\" [disabled]=\"!enableToolbar\">\n          <i class=\"fa fa-align-center\" aria-hidden=\"true\"></i>\n        </button>\n        <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('justifyRight')\" (click)=\"triggerCommand('justifyRight')\"\n          title=\"Justify Right\" [disabled]=\"!enableToolbar\">\n          <i class=\"fa fa-align-right\" aria-hidden=\"true\"></i>\n        </button>\n        <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('justifyFull')\" (click)=\"triggerCommand('justifyFull')\"\n          title=\"Justify\" [disabled]=\"!enableToolbar\">\n          <i class=\"fa fa-align-justify\" aria-hidden=\"true\"></i>\n        </button>\n        <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('indent')\" (click)=\"triggerCommand('indent')\"\n          title=\"Indent\" [disabled]=\"!enableToolbar\">\n          <i class=\"fa fa-indent\" aria-hidden=\"true\"></i>\n        </button>\n        <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('outdent')\" (click)=\"triggerCommand('outdent')\"\n          title=\"Outdent\" [disabled]=\"!enableToolbar\">\n          <i class=\"fa fa-outdent\" aria-hidden=\"true\"></i>\n        </button>\n      </div>\n      <div class=\"ngx-toolbar-set\">\n        <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('cut')\" (click)=\"triggerCommand('cut')\" title=\"Cut\"\n          [disabled]=\"!enableToolbar\">\n          <i class=\"fa fa-scissors\" aria-hidden=\"true\"></i>\n        </button>\n        <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('copy')\" (click)=\"triggerCommand('copy')\"\n          title=\"Copy\" [disabled]=\"!enableToolbar\">\n          <i class=\"fa fa-files-o\" aria-hidden=\"true\"></i>\n        </button>\n        <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('delete')\" (click)=\"triggerCommand('delete')\"\n          title=\"Delete\" [disabled]=\"!enableToolbar\">\n          <i class=\"fa fa-trash\" aria-hidden=\"true\"></i>\n        </button>\n        <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('removeFormat')\" (click)=\"triggerCommand('removeFormat')\"\n          title=\"Clear Formatting\" [disabled]=\"!enableToolbar\">\n          <i class=\"fa fa-eraser\" aria-hidden=\"true\"></i>\n        </button>\n        <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('undo')\" (click)=\"triggerCommand('undo')\"\n          title=\"Undo\" [disabled]=\"!enableToolbar\">\n          <i class=\"fa fa-undo\" aria-hidden=\"true\"></i>\n        </button>\n        <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('redo')\" (click)=\"triggerCommand('redo')\"\n          title=\"Redo\" [disabled]=\"!enableToolbar\">\n          <i class=\"fa fa-repeat\" aria-hidden=\"true\"></i>\n        </button>\n      </div>\n      <div class=\"ngx-toolbar-set\">\n        <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('paragraph')\" (click)=\"triggerCommand('insertParagraph')\"\n          title=\"Paragraph\" [disabled]=\"!enableToolbar\">\n          <i class=\"fa fa-paragraph\" aria-hidden=\"true\"></i>\n        </button>\n        <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('blockquote')\" (click)=\"triggerCommand('blockquote')\"\n          title=\"Blockquote\" [disabled]=\"!enableToolbar\">\n          <i class=\"fa fa-quote-left\" aria-hidden=\"true\"></i>\n        </button>\n        <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('removeBlockquote')\" (click)=\"triggerCommand('removeBlockquote')\"\n          title=\"Remove Blockquote\" [disabled]=\"!enableToolbar\">\n          <i class=\"fa fa-quote-right\" aria-hidden=\"true\"></i>\n        </button>\n        <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('horizontalLine')\" (click)=\"triggerCommand('insertHorizontalRule')\"\n          title=\"Horizontal Line\" [disabled]=\"!enableToolbar\">\n          <i class=\"fa fa-minus\" aria-hidden=\"true\"></i>\n        </button>\n        <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('orderedList')\" (click)=\"triggerCommand('insertUnorderedList')\"\n          title=\"Unodered List\" [disabled]=\"!enableToolbar\">\n          <i class=\"fa fa-list-ul\" aria-hidden=\"true\"></i>\n        </button>\n        <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('unorderedList')\" (click)=\"triggerCommand('insertOrderedList')\"\n          title=\"Ordered List\" [disabled]=\"!enableToolbar\">\n          <i class=\"fa fa-list-ol\" aria-hidden=\"true\"></i>\n        </button>\n      </div>\n      <div class=\"ngx-toolbar-set\">\n        <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('link')\" (click)=\"triggerCommand('link')\"\n          title=\"Insert/Edit Link\" [disabled]=\"!enableToolbar\">\n          <i class=\"fa fa-link\" aria-hidden=\"true\"></i>\n        </button>\n        <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('unlink')\" (click)=\"triggerCommand('unlink')\"\n          title=\"Unlink\" [disabled]=\"!enableToolbar\">\n          <i class=\"fa fa-chain-broken\" aria-hidden=\"true\"></i>\n        </button>\n        <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('image')\" (click)=\"triggerCommand('image')\"\n          title=\"Insert Image\" [disabled]=\"!enableToolbar\">\n          <i class=\"fa fa-picture-o\" aria-hidden=\"true\"></i>\n        </button>\n      </div>\n    </div>\n  ",
                styles: ["\n    .ngx-toolbar {\n      background-color: #f5f5f5;\n      font-size: 0.8rem;\n      padding: 0.2rem;\n      border: 1px solid #ddd;\n      border-bottom: transparent; }\n      .ngx-toolbar .ngx-toolbar-set {\n        display: inline-block;\n        border: 1px solid #ddd;\n        border-radius: 5px;\n        background-color: white; }\n        .ngx-toolbar .ngx-toolbar-set .ngx-editor-button {\n          background-color: #f5f5f5;\n          background-color: transparent;\n          border: 0;\n          padding: 0.4rem;\n          min-width: 2.5rem;\n          float: left;\n          border-right: 1px solid #ddd; }\n          .ngx-toolbar .ngx-toolbar-set .ngx-editor-button:hover {\n            cursor: pointer;\n            background-color: #f1f1f1;\n            -webkit-transition: 0.2s ease;\n            transition: 0.2s ease; }\n          .ngx-toolbar .ngx-toolbar-set .ngx-editor-button:focus, .ngx-toolbar .ngx-toolbar-set .ngx-editor-button.focus {\n            outline: 0; }\n          .ngx-toolbar .ngx-toolbar-set .ngx-editor-button:last-child {\n            border-right: transparent; }\n          .ngx-toolbar .ngx-toolbar-set .ngx-editor-button:first-child {\n            border-top-left-radius: 5px;\n            border-bottom-left-radius: 5px; }\n          .ngx-toolbar .ngx-toolbar-set .ngx-editor-button:last-child {\n            border-top-right-radius: 5px;\n            border-bottom-right-radius: 5px; }\n          .ngx-toolbar .ngx-toolbar-set .ngx-editor-button:disabled {\n            background-color: #f5f5f5;\n            pointer-events: none;\n            cursor: not-allowed; }\n  "]
            },] },
];
/**
 * @nocollapse
 */
NgxEditorToolbarComponent.ctorParameters = function () { return []; };
NgxEditorToolbarComponent.propDecorators = {
    'config': [{ type: core.Input },],
    'enableToolbar': [{ type: core.Input },],
    'showToolbar': [{ type: core.Input },],
    'execute': [{ type: core.Output },],
    'colorElement': [{ type: core.ViewChild, args: ['colorElement',] },],
};
// components
// services
var NgxEditorModule = (function () {
    function NgxEditorModule() {
    }
    return NgxEditorModule;
}());
NgxEditorModule.decorators = [
    { type: core.NgModule, args: [{
                imports: [
                    common.CommonModule
                ],
                declarations: [NgxEditorComponent, NgxGrippieComponent, NgxEditorMessageComponent, NgxEditorToolbarComponent],
                exports: [NgxEditorComponent],
                providers: [CommandExecutorService, MessageService]
            },] },
];
/**
 * @nocollapse
 */
NgxEditorModule.ctorParameters = function () { return []; };

exports.NgxEditorModule = NgxEditorModule;
exports.ɵc = CommandExecutorService;
exports.ɵb = MessageService;
exports.ɵe = NgxEditorMessageComponent;
exports.ɵf = NgxEditorToolbarComponent;
exports.ɵa = NgxEditorComponent;
exports.ɵd = NgxGrippieComponent;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ngx-editor.umd.js.map
