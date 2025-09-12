import { ReactElement } from 'react';

interface EmptyStateProps {
  heading: string;
  subHeading: string;
  button: ReactElement;
  icon: ReactElement;
}

interface EmptyListItem {
  heading: string;
  subHeading: string;
  button?: ReactElement;
  icon: ReactElement;
}

const EmptyListItem = ({
  heading,
  subHeading,
  button,
  icon,
}: EmptyListItem) => {
  return (
    <div className="h-[calc(100vh-200px)] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex justify-center ">{icon}</div>
        <h3 className="mt-2 text-sm font-semibold text-gray-900">{heading}</h3>
        <p className="mt -1 mb-5 text-sm text-gray-500">{subHeading}</p>
        {button}
      </div>
    </div>
  );
};

const EmptyState = ({ heading, subHeading, button, icon }: EmptyStateProps) => {
  return (
    <EmptyListItem
      heading={heading}
      subHeading={subHeading}
      button={button}
      icon={icon}
    />
  );
};

export default EmptyState;
