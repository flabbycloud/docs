import { notFound } from "next/navigation";
import { DocsShell } from "@/components/docs-shell";
import { getAllDocs, getDoc } from "@/lib/docs";

export function generateStaticParams() {
  return getAllDocs().map((doc) => ({ slug: doc.slug }));
}

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = await getDoc(slug);
  if (!doc) notFound();

  return (
    <DocsShell docs={getAllDocs()} headings={doc.headings}>
      <div className="breadcrumb">Продукты / {doc.meta.category}</div>
      <article className="article">
        <h1>{doc.meta.title}</h1>
        <p className="lead">{doc.meta.description}</p>
        <p className="updated">Обновлено {doc.meta.updated}</p>
        <div className="markdown" dangerouslySetInnerHTML={{ __html: doc.contentHtml }} />
      </article>
    </DocsShell>
  );
}
