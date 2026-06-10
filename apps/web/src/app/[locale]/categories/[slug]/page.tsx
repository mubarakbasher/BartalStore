import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function CategoryPage(props: PageProps) {
  const params = await props.params;
  redirect(`/${params.locale}/products?category=${params.slug}`);
}
