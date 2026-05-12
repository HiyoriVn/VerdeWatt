export default function PageSection({
  title,
  description,
  className = "",
  children,
  ...props
}) {
  return (
    <section className={className} {...props}>
      {(title || description) && (
        <div className="section-title-wrap">
          {title ? <h3>{title}</h3> : null}
          {description ? <p>{description}</p> : null}
        </div>
      )}
      {children}
    </section>
  );
}
