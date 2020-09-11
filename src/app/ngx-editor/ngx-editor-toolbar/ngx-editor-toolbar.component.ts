import {Component, Input, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';
import * as Utils from '../common/utils/ngx-editor.utils';

@Component({
  selector: 'app-ngx-editor-toolbar',
  templateUrl: './ngx-editor-toolbar.component.html',
  styleUrls: ['./ngx-editor-toolbar.component.scss']
})

export class NgxEditorToolbarComponent {

  @Input() config: any;
  @Input() enableToolbar = false;
  @Input() showToolbar = true;
  @Output() execute: EventEmitter<string> = new EventEmitter<string>();
  @Output() buttonClicked: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('colorElement')
  colorElement: ElementRef;

  constructor() {
  }

  /*
   * enable or disable toolbar based on configuration
   */
  canEnableToolbarOptions(value): boolean {
    return Utils.canEnableToolbarOptions(value, this.config['toolbar']);
  }

  triggerCommand(command: string): void {
    if (command === 'foreColor') {
      this.colorElement.nativeElement.click();
      return;
    }
    this.execute.emit(command);
  }

  triggerCommandColor($event: Event) {
    this.execute.emit('foreColor:' + ($event.target as any).value);
  }

  clickButton() {
    this.buttonClicked.emit('test');
  }
}
