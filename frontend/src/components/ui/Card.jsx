export default function Card({
  as: Tag = "section",
  className = "",
  children,
  ...props
}) {
  const nextClassName = `card glass-card ${className}`.trim();

  return (
    <Tag className={nextClassName} {...props}>
      {children}
    </Tag>
  );
}
