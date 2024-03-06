import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import 'ag-grid-enterprise';
import { Ship, shipsData } from './data';
import { AgTreeSelectComponent } from '../ag-tree-select/ag-tree-select.component';
import { of } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'ships-and-brands',
  standalone: true,
  templateUrl: './ships-and-brands.component.html',
  styleUrl: './ships-and-brands.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AgTreeSelectComponent, AsyncPipe],
})
export class ShipsAndBrandsComponent {
  @Input()
  showDropdown = false;

  @Output()
  onSelectedShips = new EventEmitter<Ship[]>();

  @ViewChild(AgTreeSelectComponent, { static: true })
  treeSelect?: AgTreeSelectComponent<Ship>;

  rowData = of(shipsData);
  getDataPath = (data: Ship) => data.brand;

  onRowSelectionChange = (ships: Ship[]) => {
    this.onSelectedShips.emit(ships);
  };

  public clear = () => this.treeSelect?.deselectAll();
}
