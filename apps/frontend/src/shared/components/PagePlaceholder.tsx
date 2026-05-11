type PagePlaceholderProps = {
  description: string;
  title: string;
};

export function PagePlaceholder({ description, title }: PagePlaceholderProps) {
  return (
    <section className="placeholder" aria-labelledby="page-title">
      <p className="section-label">Placeholder</p>
      <h3 id="page-title">{title}</h3>
      <p>{description}</p>
    </section>
  );
}
