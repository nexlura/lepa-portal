import {
  SetStateAction,
  Dispatch,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';

import { MultiSelectOption } from '../../UIKit/MultiSelect';
import type { AddStudentForm } from '@/components/Students/AddStudent/types';
import SearchableAssignSelect from './SearchableAssignSelect';
import { getModel } from '@/lib/connector';
import { BackendClassData } from '@/app/(portal)/school-classes/[pageNumber]/page';

interface AssignedClassTabsProps {
  form: AddStudentForm;
  setForm: Dispatch<SetStateAction<AddStudentForm>>;
}

const AssignedClassTabs = ({ form, setForm }: AssignedClassTabsProps) => {
  const fetchedRef = useRef(false);

  const [classes, setClasses] = useState<MultiSelectOption[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
  // // Fetch classes once
  const fetchClasses = useCallback(async () => {
    setLoadingClasses(true);

    try {
      const res = await getModel<{ data?: { classes?: BackendClassData[] } }>(
        '/classes?page=1&limit=100',
      );

      const serverClasses = res?.data?.classes;

      if (Array.isArray(serverClasses)) {
        const classOptions: MultiSelectOption[] = serverClasses.map((cls) => ({
          id: cls.id,
          name: `${cls.name} (${cls.grade})`,
        }));

        setClasses(classOptions);
      }
    } catch (err) {
      console.error('Error fetching classes:', err);
    } finally {
      setLoadingClasses(false);
    }
  }, []); // setters are stable, so no dependencies needed

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchClasses();
  }, [fetchClasses]);

  return (
    <section className="border-t border-zinc-200 mt-5 px-6">
      <div className="flex flex-col gap-2 mb-4 border-b border-zinc-100">
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-900">Assigned Class</h3>
          <p className="mt-1 text-sm text-gray-500">
            Select the class this student will be assigned to
          </p>
        </div>
      </div>
      <div className="rounded-md bg-white">
        <SearchableAssignSelect
          placeholder="Search classes…"
          options={classes}
          selected={form.assignedClass ? [form.assignedClass] : []}
          loading={loadingClasses}
          emptyLabel={
            !loadingClasses && classes.length === 0
              ? 'No classes available'
              : 'No matches found'
          }
          onChange={(selected) =>
            setForm((f) => ({
              ...f,
              assignedClass: selected.length > 0 ? selected[0] : null,
            }))
          }
        />
      </div>
    </section>
  );
};

export default AssignedClassTabs;
