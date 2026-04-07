import { SetStateAction } from 'react';
import { PlusIcon, ArrowUpOnSquareIcon } from '@heroicons/react/24/outline';

import { Button } from '@/components/UIKit/Button';

interface StudentsMainHeaderProps {
  setIsImportModal: (value: SetStateAction<boolean>) => void;
}

const StudentsMainHeader = ({ setIsImportModal }: StudentsMainHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Students</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage all students, add new ones, or import in bulk via CSV.
        </p>
      </div>
      <div className="flex space-x-3">
        <Button href="/students/new" color="primary">
          <PlusIcon className="h-4 w-4 mr-2 text-white" color="white" />
          Add Student
        </Button>
        <Button type="button" outline onClick={() => setIsImportModal(true)}>
          <ArrowUpOnSquareIcon
            className="h-4 w-4 mr-2 text-white"
            color="white"
          />
          Import Students
        </Button>
      </div>
    </div>
  );
};

export default StudentsMainHeader;
