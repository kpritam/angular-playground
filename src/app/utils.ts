import _ from 'lodash';
import { TreeNode } from './components/tree-select/tree-select.model';

export type Product = {
  region: string;
  subProduct: string;
  mainProduct: string;
};

type ProductTree = {
  region: string;
  subProducts: {
    subProduct: string;
    mainProducts: string[];
  }[];
};

export type TreeNodeData = {
  name: string;
};

export const flatProduts: Product[] = [
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

const groupByRegionThenSubProduct = (nodes: Product[]): ProductTree[] =>
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

const productData = groupByRegionThenSubProduct(flatProduts);

const convertToTreeNode = (tree: ProductTree[]): TreeNode<TreeNodeData>[] =>
  _.map(tree, (node) => ({
    data: { name: node.region },
    children: _.map(node.subProducts, (subProduct) => ({
      data: { name: subProduct.subProduct },
      children: _.map(subProduct.mainProducts, (mainProduct) => ({
        data: { name: mainProduct },
      })),
    })),
  }));

export const PRODUCT_TREE: TreeNode<TreeNodeData>[] = convertToTreeNode(productData);
