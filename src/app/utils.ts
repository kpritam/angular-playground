import _ from 'lodash';
import { TreeNode } from './components/tree-select/tree-select.component';

type FlatNode = {
  region: string;
  subProduct: string;
  mainProduct: string;
};

const flatNodes: FlatNode[] = [
  {
    region: 'Region A',
    subProduct: 'SubProduct 1',
    mainProduct: 'MainProduct 1',
  },
  {
    region: 'Region A',
    subProduct: 'SubProduct 1',
    mainProduct: 'MainProduct 2',
  },
  {
    region: 'Region A',
    subProduct: 'SubProduct 2',
    mainProduct: 'MainProduct 3',
  },
  {
    region: 'Region B',
    subProduct: 'SubProduct 3',
    mainProduct: 'MainProduct 4',
  },
];

const groupByRegionThenSubProduct = (nodes: FlatNode[]) =>
  _.chain(nodes)
    .groupBy('region')
    .map((subProducts, region) => ({
      region,
      subProducts: _.chain(subProducts)
        .groupBy('subProduct')
        .map((mainProducts, subProduct) => ({
          subProduct,
          mainProducts: _.map(mainProducts, 'mainProduct'),
        }))
        .value(),
    }))
    .value();

type ProductTree = {
  region: string;
  subProducts: {
    subProduct: string;
    mainProducts: string[];
  }[];
};

const productData: ProductTree[] = groupByRegionThenSubProduct(flatNodes);

export type TreeData = {
  name: string;
};

const convertToTreeNode = (
  tree: {
    region: string;
    subProducts: { subProduct: string; mainProducts: string[] }[];
  }[],
): TreeNode<TreeData>[] =>
  _.map(tree, (node) => ({
    data: { name: node.region },
    children: _.map(node.subProducts, (subProduct) => ({
      data: { name: subProduct.subProduct },
      children: _.map(subProduct.mainProducts, (mainProduct) => ({
        data: { name: mainProduct },
      })),
    })),
  }));

export const PRODUCT_TREE: TreeNode<{ name: string }>[] =
  convertToTreeNode(productData);
