import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PRODUCT_TREE } from './utils';
import { TreeSelectComponent } from './components/tree-select/tree-select.component';
import { TreeNode, FlatTreeNode } from './components/tree-select/tree-select.model';

type Ship = {
  name: string;
  fullName?: string;
};

const SHIP_DATA: TreeNode<Ship>[] = [
  {
    data: { name: 'Norwegian' },
    children: [
      { data: { name: 'Bliss' } },
      { data: { name: 'America', fullName: 'Pride Of America' } },
    ],
  },
  {
    data: { name: 'Regent' },
    children: [{ data: { name: 'Seven Seas' } }],
  },
];

const FOOD_DATA: TreeNode<{ name: string }>[] = [
  {
    data: { name: 'Fruit' },
    children: [
      { data: { name: 'Apple' } },
      { data: { name: 'Banana' } },
      { data: { name: 'Fruit loops' } },
    ],
  },
  {
    data: { name: 'Vegetables' },
    children: [
      {
        data: { name: 'Green' },
        children: [{ data: { name: 'Broccoli' } }, { data: { name: 'Brussels sprouts' } }],
      },
      {
        data: { name: 'Orange' },
        children: [{ data: { name: 'Pumpkins' } }, { data: { name: 'Carrots' } }],
      },
    ],
  },
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TreeSelectComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'angular-playground';

  shipData = SHIP_DATA;
  foodData = FOOD_DATA;
  productData = PRODUCT_TREE;

  onChange(data: FlatTreeNode<{ name: string }>[]) {
    console.table(data);
  }
}
