import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridOptions, GetDataPath, GridApi } from 'ag-grid-community';
import 'ag-grid-enterprise';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

const headerClass = 'tree-select-header';
const rowClass = 'tree-select-row';

export type TreeNode = {
  name: string;
};

@Component({
  selector: 'ag-tree-select',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    NgTemplateOutlet,
    AgGridAngular,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './ag-tree-select.component.html',
  styleUrl: './ag-tree-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgTreeSelectComponent<T extends TreeNode> {
  @Input({ required: true })
  rowData!: T[] | null;

  @Input({ required: true })
  getDataPath!: GetDataPath;

  @Input()
  showDropdown = false;

  @Input()
  dropdownLabel = '';

  @Output()
  onRowSelectionChange = new EventEmitter<T[]>();

  private gridApi?: GridApi<T>;
  searchControl = new FormControl('');
  dropdownPlaceholder = signal('');

  defaultColDef: ColDef = {
    flex: 1,
    headerClass: headerClass,
    suppressHeaderContextMenu: true,
    suppressHeaderFilterButton: true,
    suppressHeaderMenuButton: true,
  };

  autoGroupColumnDef: ColDef = {
    minWidth: 300,
    cellRendererParams: {
      suppressCount: true,
      checkbox: true,
    },
  };

  constructor() {
    this.searchControl.valueChanges.pipe(takeUntilDestroyed()).subscribe((searchTxt) => {
      this.gridApi?.setGridOption('quickFilterText', searchTxt ?? '');
    });
  }

  gridOptions?: GridOptions;
  printSelected() {
    console.log('Rows');
    console.log(this.gridApi?.getSelectedRows());

    console.log('Nodes');
    console.log(this.gridApi?.getSelectedNodes());
  }

  ngOnInit(): void {
    this.gridOptions = {
      headerHeight: 0,
      columnDefs: [],
      defaultColDef: this.defaultColDef,
      rowData: this.rowData,
      domLayout: 'autoHeight',

      // Tree props
      treeData: true,
      autoGroupColumnDef: this.autoGroupColumnDef,
      groupSelectsChildren: true,
      getDataPath: this.getDataPath,

      // Row props
      rowSelection: 'multiple',
      rowClass: rowClass,
      suppressRowClickSelection: true,

      suppressCellFocus: true,
      suppressContextMenu: true,
      suppressRowHoverHighlight: true,

      onGridReady: (params) => (this.gridApi = params.api),
      onSelectionChanged: () => this.onSelectionChanged(),
    };
  }

  onSelectionChanged = () => {
    const selectedRows = this.gridApi?.getSelectedRows();
    this.dropdownPlaceholder.set(this.mkDropdownPlaceholder(selectedRows));
    this.onRowSelectionChange.emit(selectedRows);
  };

  mkDropdownPlaceholder = (selectedRows?: T[]) =>
    selectedRows?.map((s) => s.name).join(', ') ?? this.dropdownLabel;
}
