import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { TreeData, TreeNode, FlatTreeNode } from './tree-select.model';

@Component({
  selector: 'app-tree-select',
  standalone: true,
  imports: [MatTreeModule, MatButtonModule, MatIconModule, MatCheckboxModule],
  templateUrl: './tree-select.component.html',
  styleUrl: './tree-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeSelectComponent<T extends TreeData> {
  @Input({ required: true }) data!: TreeNode<T>[];
  @Output() selectionChange = new EventEmitter<FlatTreeNode<T>[]>();

  checklistSelection = new SelectionModel<FlatTreeNode<T>>(true);

  private _transformer = (node: TreeNode<T>, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      data: node.data,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<FlatTreeNode<T>>(
    (node) => node.level,
    (node) => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  ngOnInit() {
    this.dataSource.data = this.data;
  }

  hasChild = (_: number, node: FlatTreeNode<T>) => node.expandable;

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected = (node: FlatTreeNode<T>): boolean =>
    this.treeControl
      .getDescendants(node)
      .every((child) => this.checklistSelection.isSelected(child));

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected = (node: FlatTreeNode<T>): boolean => {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some((child) => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  };

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection = (node: FlatTreeNode<T>): void => {
    let parent: FlatTreeNode<T> | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  };

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection = (node: FlatTreeNode<T>): void => {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every((child) => this.checklistSelection.isSelected(child));

    if (nodeSelected && !descAllSelected) this.checklistSelection.deselect(node);
    else if (!nodeSelected && descAllSelected) this.checklistSelection.select(node);
  };

  /* Get the parent node of a node */
  getParentNode = (node: FlatTreeNode<T>): FlatTreeNode<T> | null => {
    const currentLevel = node.level;
    if (currentLevel < 1) return null;

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (currentNode.level < currentLevel) return currentNode;
    }
    return null;
  };

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  toggleNode = (node: FlatTreeNode<T>): void => {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    this.checkAllParentsSelection(node);
    this.selectionChange.emit(this.getSelectedNodes());
  };

  /**
   * Returns an array of selected FlatNodes, including descendants.
   */
  getSelectedNodes = (): FlatTreeNode<T>[] => this.checklistSelection.selected;
}

/**  Copyright 2018 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */
