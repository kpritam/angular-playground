import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
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

  rowData = of(shipsData);
  getDataPath = (data: Ship) => data.brand;

  onRowSelectionChange = (ships: Ship[]) => {
    console.log(ships);

    this.onSelectedShips.emit(ships);
  };
}
