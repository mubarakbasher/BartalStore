import { redirect } from 'next/navigation';

interface PageProps {
  params: { locale: string; slug: string };
}

export default function CategoryPage({ params }: PageProps) {
  redirect(`/${params.locale}/products?category=${params.slug}`);
}
