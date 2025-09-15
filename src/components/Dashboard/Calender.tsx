import { CalendarDaysIcon } from "@heroicons/react/24/outline";

const Calendar = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const currentDate = today.getDate();

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const days = [];

    // Empty cells for days before the first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(<div key={`empty-${i}`} className="h-8"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = day === currentDate;
        days.push(
            <div
                key={day}
                className={`h-8 flex items-center justify-center text-sm rounded ${isToday
                    ? 'bg-blue-500 text-white font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                    }`}
            >
                {day}
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                    {today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
                <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center font-medium py-1">
                        {day}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {days}
            </div>
        </div>
    );
};

export default Calendar