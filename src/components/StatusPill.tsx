import { statusColorMap } from "@/utils/statusColors";

const StatusPill = ({ status }: { status: string }) => {
    const normalized = status?.toLowerCase() || "inactive";

    return (
        <span
            className={`capitalize inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColorMap[normalized] ?? "bg-gray-200 text-gray-700"
                }`}
        >
            {status}
        </span>
    );
}

export default StatusPill