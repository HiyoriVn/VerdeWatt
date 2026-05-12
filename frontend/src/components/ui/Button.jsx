export default function Button({
  type = "button",
  className = "",
  children,
  ...props
}) {
  const nextClassName = `ui-button ${className}`.trim();

  return (
    <button
      type={type}
      className={nextClassName}
      {...props}
    >
      {children}
    </button>
  );
}
