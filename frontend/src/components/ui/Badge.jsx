export default function Badge({
  className = "",
  children,
  ...props
}) {
  const nextClassName = `ui-badge ${className}`.trim();

  return (
    <span className={nextClassName} {...props}>
      {children}
    </span>
  );
}
