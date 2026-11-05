
const DashboardCard = ({
    title,
    value,
    subtitle,
    icon,
    iconClass = "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400",
}) => {
    return (
        <div className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                        {title}
                    </p>

                    <p className="mt-3 break-words text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {value}
                    </p>

                    <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
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
