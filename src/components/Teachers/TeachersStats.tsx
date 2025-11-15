import { AcademicCapIcon } from "@heroicons/react/24/outline"

const TeachersStats = () => {
    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <AcademicCapIcon className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">
                                    Total Teachers
                                </dt>
                                <dd className="text-lg font-medium text-gray-900">{ }</dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <AcademicCapIcon className="h-6 w-6 text-green-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">
                                    Active Teachers
                                </dt>
                                <dd className="text-lg font-medium text-gray-900">
                                    4
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <AcademicCapIcon className="h-6 w-6 text-blue-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">
                                    Departments
                                </dt>
                                <dd className="text-lg font-medium text-gray-900">
                                    6
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TeachersStats