interface TableControlsProps {
    searchInput: React.ReactElement
}

const StudentTableControls = ({
    searchInput
}: TableControlsProps) => {
    return (
        <div className='flex justify-between items-center mb-6'>
            <h3 className="text-lg leading-6 font-medium text-gray-900 ">
                All Students
            </h3>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                {/* SEARCH INPUT */}
                {searchInput}
            </div>
        </div>
    )
}

export default StudentTableControls
