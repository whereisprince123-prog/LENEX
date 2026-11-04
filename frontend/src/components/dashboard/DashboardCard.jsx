
const DashboardCard = ({
    title,
    value,
    subtitle,
    icon,
    iconClass = "bg-sky-100 text-sky-600",
}) => {
    return (
        <div className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-500">
                        {title}
                    </p>

                    <p className="mt-3 break-words text-2xl font-bold tracking-tight text-gray-900">
                        {value}
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                        {subtitle}
                    </p>
                </div>

                <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
                >
                    {icon}
                </div>
            </div>
        </div>
    );
};

export default DashboardCard;
