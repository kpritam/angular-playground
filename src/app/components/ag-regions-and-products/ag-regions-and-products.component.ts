import { Component, EventEmitter, Output } from '@angular/core';
import { of } from 'rxjs';
import { ProductNode, productsRowData } from './data';
import { Product } from '../../utils';
import { AsyncPipe } from '@angular/common';
import { AgTreeSelectComponent } from '../ag-tree-select/ag-tree-select.component';

@Component({
  selector: 'ag-regions-and-products',
  standalone: true,
  imports: [AgTreeSelectComponent, AsyncPipe],
  templateUrl: './ag-regions-and-products.component.html',
  styleUrl: './ag-regions-and-products.component.scss',
})
export class AgRegionsAndProductsComponent {
  @Output()
  onSelectedShips = new EventEmitter<Product[]>();

  rowData = of(productsRowData);
  getDataPath = (data: ProductNode) => data.path;

  onRowSelectionChange = (products: ProductNode[]) => this.onSelectedShips.emit(products);
}
