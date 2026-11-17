export const revalidate = 0;

import Container from "./components/Container";
import HomeBanner from "./components/HomeBanner";
import NullData from "./components/products/NullData";
import ProductCard from "./components/products/ProductCard";
import getProducts, { IProductsParams } from "@/actions/getProducts";

interface HomeProps {
  searchParams: IProductsParams;
}

export default async function Home({ searchParams }: HomeProps) {
  const products = await getProducts(searchParams);

  if (products.length === 0) {
    return (
      <Container>
        <NullData title="No products found. Try another search or clear the filters." />
      </Container>
    );
  }

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <Container>
        <HomeBanner />
        <section aria-label="Product catalogue" className="mt-8">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Discover our selection
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                Featured products
              </h1>
            </div>
            <span className="text-sm text-slate-500">
              {products.length} {products.length === 1 ? "product" : "products"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} data={product} />
            ))}
          </div>
        </section>
      </Container>
    </main>
  );
}
