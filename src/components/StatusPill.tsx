import { statusColorMap } from "@/utils/statusColors";

const StatusPill = ({ status, label }: { status: string, label?: string }) => {
    const normalized = status?.toLowerCase() || "inactive";

    return (
        <span
            className={`capitalize inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColorMap[normalized] ?? "bg-gray-200 text-gray-700"
                }`}
        >
            {label || status}
        </span>
    );
}

export default StatusPill