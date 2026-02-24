export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  subtitle,
  value,
  icon,
  className = "",
}) => {
  return (
    <section
      className={`rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-lg transition-shadow duration-200 focus-within:ring-2 focus-within:ring-blue-700 focus-within:ring-offset-2 flex flex-col items-center text-center ${className}`}
      aria-labelledby={`metric-title-${title.replaceAll(/\s+/g, '-')}`}
    >
      {icon && (
        <span
          className="w-14 h-14 mb-4 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 text-3xl md:text-4xl lg:text-5xl shadow-sm"
          aria-hidden="true"
          style={{ minWidth: 56, minHeight: 56 }}
        >
          {icon}
        </span>
      )}
      <p className="text-4xl font-extrabold text-blue-900 mb-1 leading-tight" aria-label={`Value: ${value}`}>{value}</p>
      <h3 id={`metric-title-${title.replaceAll(/\s+/g, '-')}`} className="text-base font-semibold text-gray-900 mb-1 truncate">
        {title}
      </h3>
      {subtitle && (
        <p className="text-xs text-gray-600 mt-1" aria-label={`Description: ${subtitle}`}>{subtitle}</p>
      )}
    </section>
  );
};