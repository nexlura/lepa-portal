import { BookOpenIcon } from "@heroicons/react/24/outline"

const ClassesStats = () => {
    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <BookOpenIcon className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">
                                    Total Classes
                                </dt>
                                <dd className="text-lg font-medium text-gray-900">{classes.length}</dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <BookOpenIcon className="h-6 w-6 text-green-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">
                                    Total Capacity
                                </dt>
                                <dd className="text-lg font-medium text-gray-900">{totalCapacity}</dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ClassesStats