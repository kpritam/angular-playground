import { Product, flatProduts } from '../../utils';

export type ProductNode = Product & {
  name: string;
  path: string[];
};

export const mkProductNode = (product: Product): ProductNode => ({
  ...product,
  name: product.mainProduct,
  path: [product.region, product.subProduct, product.mainProduct],
});

export const productsRowData = flatProduts.map((p) => mkProductNode(p));
