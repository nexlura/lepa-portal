import { Dispatch, ForwardRefExoticComponent, SVGProps, SetStateAction, RefAttributes } from "react";

type Tab = {
    id: string;
    name: string;
    icon: ForwardRefExoticComponent<Omit<SVGProps<SVGSVGElement>, "ref"> & {
        title?: string;
        titleId?: string;
    } & RefAttributes<SVGSVGElement>>;
}

interface TabNavigationProps {
    tabs: Tab[]
    activeTab: string
    setActiveTab: Dispatch<SetStateAction<string>>

}

const TabNavigation = ({ tabs, activeTab, setActiveTab }: TabNavigationProps) => {
    return (<div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`${activeTab === tab.id
                            ? 'border-primary-500 text-primary-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                    >
                        <Icon className="h-4 w-4 mr-2" />
                        {tab.name}
                    </button>
                )
            })}
        </nav>
    </div>)
}

export default TabNavigation