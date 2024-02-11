export type TreeData = {
  name: string;
};

export type TreeNode<T extends TreeData> = {
  data: T;
  children?: TreeNode<T>[];
};

export type FlatTreeNode<T> = {
  expandable: boolean;
  data: T;
  level: number;
};
