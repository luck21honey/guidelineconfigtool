import { Component, OnInit, Output, EventEmitter, Input, OnDestroy, ElementRef, Inject, HostListener, ChangeDetectorRef } from '@angular/core';
import 'tinymce';
import { Store } from '@ngrx/store';
import { Node, Footnotes } from 'src/app/models/dto/node';
import { State } from 'src/app/store/node-store/node.reducer';
import { create, update, remove } from 'src/app/store/node-store/node.actions';
import { DialogData, ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { DELETE_NODE_CONFIRMATION, confirmationDialogConfig,footnotesDialogConfig } from 'src/app/constants';
import { AlertType } from 'src/app/models/enums/alert-type';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
declare var tinymce: any;

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss']
})
export class TextEditorComponent implements OnInit, OnDestroy {
  public currentContent: string;
  public nodeID: number;
  public footnotes: Footnotes[] = [];
  @Input() currentNode: Node;
  @Input() top: number;
  @Input() left: number;
  @Output() contentChanged: EventEmitter<any> = new EventEmitter();
  @Output() cancel = new EventEmitter();

  constructor(private cdRef:ChangeDetectorRef,private store: Store<State>, public dialog: MatDialog, private elem: ElementRef) { }

  ngOnInit(): void {
    this.currentContent = this.currentNode.content;
    if(this.currentNode.footnotes) {
      this.footnotes = [...this.currentNode.footnotes];
    }
    this.initiateEditor();
  }

  ngOnDestroy(): void {
    tinymce.remove();
    tinymce.EditorManager.execCommand('mceRemoveControl',true, "#text-editor");
    document.querySelector('mat-sidenav-content').scrollLeft = 0;
    document.querySelector('mat-sidenav-content').scrollTop = 0;
    document.querySelector('mat-sidenav-content').scrollLeft = this.left;
    document.querySelector('mat-sidenav-content').scrollTop = this.top;
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onSave(): void {
    const node = { ...this.currentNode };
    node.content = this.currentContent;
    node.footnotes = this.footnotes;
    if (node.root && node.id === null) {
      // Root node needs to be created
      this.store.dispatch(create({ node }));
    } else {
      // Child node and relationship exist so we are just updating content here
      this.store.dispatch(update({ id: node.id, changes: node }));
    }
    this.onCancel();
  }

  handleEvent = (newContent: string) => {
    this.currentContent = newContent;
    // Removing deleted footnotes link
    for(let i=0;  i<=this.footnotes.length ;i++){
      const currentFootnote = this.footnotes[i];
      if(currentFootnote){
        if (!newContent.includes('<sup id="foot-note-ref" style="font-family: Roboto; font-size: 12px; font-weight: normal; color: #0066cc;">'+currentFootnote.reference+'</sup>')) {
          this.footnotes.splice(i,1);
        }
      }      
    }      
    this.cdRef.detectChanges();
  }

  initiateEditor = () => {
    const data =  this.currentContent;
    const handleEvent = this.handleEvent;
    setTimeout(() => {
      tinymce.init({
        base_url: '/tinymce',
        suffix: '.min',
        selector: 'textarea#text-editor',
        node_id: this.currentNode.id,
        footnotes: this.footnotes,
        close_emit: this.cancel,
        content_style:
  "@import url('https://fonts.googleapis.com/css2?family=Lato:wght@900&family=Roboto&display=swap'); " 
  + "body { border:none !important;font-family: Roboto;font-size: 16px;font-weight: normal;letter-spacing: 0.5px;color: rgba(0, 0, 0, 0.6); }",
        
        setup (editor) {
          editor.on('init', (e) => {
            tinymce.get('text-editor').setContent(data);
          });
          editor.on('keyup', (e) => {
            const myContent = tinymce.get('text-editor').getContent();
            handleEvent(myContent);
          });
          editor.on('change', (e) => {
            const myContent = tinymce.get('text-editor').getContent();
            handleEvent(myContent);
          });
        },
        height: '23.875rem',
        menubar: false,
        branding: false,
        statusbar: false,
        plugins: [
          'autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount',
          'footnote',
          'delete'
        ],
        toolbar: 'bold underline italic | undo redo | link superscript | ' +
        'bullist numlist | footnote | delete',
      }); 
      
      // Adding custom plugins to the editor
      this.createFootnotePlugin();
      this.createDeletePlugin();
    }, 0);
  }

  // Creating Delete icon plugin
  createDeletePlugin = () => {
    const store = this.store;
    const dialogCopy = this.dialog;
    const openDeleteDialog = this.openDeleteDialog;
    tinymce.PluginManager.add('delete', function(editor) {
      editor.ui.registry.addButton('delete', {
        icon: 'remove',
        onAction() {
          openDeleteDialog(editor.settings.node_id,dialogCopy,store,editor.settings.close_emit);
        }
      });
    });
  }

  // Function to open delete confirmation dialog box
  openDeleteDialog(id: number, dialogCopy: MatDialog, store:Store<State>, cancel): void {
    const data: DialogData = {
      title: 'Delete Confirmation',
      content: DELETE_NODE_CONFIRMATION,
      type: AlertType.Warning,
      acceptText: 'Confirm',
      declineText: 'Cancel'
    };
    const dialogRef = dialogCopy.open(
      ConfirmationDialogComponent,
      {
        ...confirmationDialogConfig,
        data,
        panelClass: 'confirmation-dialog'
      }
    );

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        store.dispatch(remove({ id }));
        cancel.emit();
      }
     });
  }

  // Creating footnotes plugin
  createFootnotePlugin = () => {
    const dialogCopy = this.dialog;
    const openFootnotesDialog = this.openFootnotesDialog;
    // Adding custom footnote plugin to the editor
    tinymce.PluginManager.add('footnote', function(editor) {
        editor.ui.registry.addButton('footnote', {
          text: 'Footnotes', // button text
          icon: 'comment-add', // icon
          content_style:
    "@import url('https://fonts.googleapis.com/css2?family=Lato:wght@900&family=Roboto&display=swap');",
          onAction() {
            openFootnotesDialog(dialogCopy,editor.settings.footnotes);
          }
        });
    });
  }

  // Funciton to open footnotes addition dialog box
  openFootnotesDialog(dialogCopy: MatDialog, footnotes): void {
    const dialogRef = dialogCopy.open(
      FootnotesDialogComponent,
      {
        ...footnotesDialogConfig,
        panelClass: 'footnotes-dialog'
      }
    );
    const eventSubscription = dialogRef.componentInstance.addFootnote.subscribe((footnote) => {
      tinymce.activeEditor.execCommand('mceInsertContent', false, '<sup id="foot-note-ref" style="font-family: Roboto;font-size: 12px;font-weight: normal;color: #0066cc;">'+footnote.footnoteRef+'</sup><span style="display:inline-block;font-family: Roboto;font-size: 16px;font-weight: normal;letter-spacing: 0.5px ">&nbsp;<span>');
      let newFootnote = {
        id: null,
        reference: footnote.footnoteRef,
        content: footnote.footnoteText      
      }
      footnotes.push(newFootnote);
      dialogRef.close();      
    });
    dialogRef.afterClosed().subscribe(() => eventSubscription.unsubscribe()).unsubscribe();
 
  }
}

@Component({
  selector: 'foot-notes-dialog',
  templateUrl: 'foot-notes-dialog.component.html',
  styleUrls: ['./text-editor.component.scss']
})
export class FootnotesDialogComponent {

  addFootnote = new EventEmitter();
  footnoteRef = '';
  footnoteText = '';

  constructor(
    private dialogRef: MatDialogRef<FootnotesDialogComponent>) { }

  submit(): void {
    const footnote = {footnoteRef: this.footnoteRef, footnoteText:this.footnoteText}
    this.addFootnote.emit(footnote);
    this.dialogRef.close();
  } 

}