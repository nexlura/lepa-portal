'use client';

import {
  ArrowUpOnSquareIcon,
  ClipboardDocumentListIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { useContext, useState } from 'react';
import { useSession } from 'next-auth/react';

import { Button } from '@/components/UIKit/Button';
import EmptyState from '@/components/EmptyState';
import { Student } from '@/app/(portal)/students/[pid]/page';
import StudentsTable from '@/components/Students/StudentTable';
import StudentsStats from './StudentsStats';
import ImportStudentsModal from './ImportStudentsModal';
import { postFormData } from '@/lib/connector';
import revalidatePage from '@/app/actions/revalidate-path';
import { FeedbackContext } from '@/context/feedback';
import BulkUploadFeedback, { BulkUploadResult } from '../BulkUploadFeedback';
import StudentsMainHeader from './MainHeader';

interface StudentsAnalytics {
  totalStudents: number;
  enrolledStudents: number;
  studentsByGender: {
    male: number;
    female: number;
    other: number;
  };
}

export interface StudentsViewProps {
  students: Student[];
  totalPages: number;
  analytics: StudentsAnalytics;
}

const StudentsView = ({
  students,
  totalPages,
  analytics,
}: StudentsViewProps) => {
  const { data: session } = useSession();
  const { setFeedback } = useContext(FeedbackContext);

  const [isImportModal, setIsImportModal] = useState(false);
  const [bulkResult, setBulkResult] = useState<BulkUploadResult | null>(null);
  const [showBulkDetails, setShowBulkDetails] = useState(false);

  const handleImpModalClose = () => {
    setIsImportModal(false);
  };

  const handleImportSubmit = async (file: File, selectedClassId: string) => {
    if (!session?.user?.tenantId) {
      console.error('Tenant ID not found for bulk upload');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('tenant_id', session.user.tenantId);
      formData.append('file', file);
      formData.append('current_class_id', selectedClassId);

      const resp = await postFormData('/students/bulk-upload', formData);

      let successCount = 0;
      let failureCount = 0;
      let totalCount = 0;
      let failedMessages: string[] = [];

      if (
        resp &&
        typeof resp === 'object' &&
        'data' in resp &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (resp as any).data
      ) {
        const data = (resp as { data: Record<string, unknown> }).data;
        successCount = Number(data?.success_count ?? 0);
        failureCount = Number(data?.failure_count ?? 0);
        totalCount = Number(data?.total_count ?? successCount + failureCount);
        failedMessages = Array.isArray(data?.failed)
          ? (data.failed as string[])
          : [];
      }

      let status: 'success' | 'error' = 'success';
      let text = '';

      const plural = (n: number, word: string) =>
        `${n} ${word}${n === 1 ? '' : 's'}`;

      if (successCount === totalCount) {
        status = 'success';
        text = `${plural(successCount, 'student')} uploaded successfully.`;
        revalidatePage('/students/1');
        setFeedback({ status, text });
        setBulkResult(null);
        return;
      } else if (successCount === 0 && failureCount === totalCount) {
        status = 'error';

        const allExist =
          failedMessages.length > 0 &&
          failedMessages.every((msg) =>
            msg.toLowerCase().includes('already exists'),
          );

        if (allExist) {
          text = `Upload failed. All ${plural(totalCount, 'student')} already exist for this academic year.`;
        } else {
          text = `Upload failed. All ${plural(totalCount, 'row')} failed validation.`;
        }
      } else {
        status = 'error';

        const allExist =
          failedMessages.length > 0 &&
          failedMessages.every((msg) =>
            msg.toLowerCase().includes('already exists'),
          );

        text = [
          'Upload completed with issues.',
          `${plural(successCount, 'student')} created successfully.`,
          allExist
            ? `${plural(failureCount, 'student')} were skipped because they already exist.`
            : `${plural(failureCount, 'row')} were skipped due to validation errors.`,
        ].join(' ');

        if (successCount > 0) {
          revalidatePage('/students/1');
        }
      }

      setBulkResult({
        successCount,
        failureCount,
        totalCount,
        failedMessages,
      });
      setShowBulkDetails(false);
    } catch (error) {
      console.error('Error during students bulk upload:', error);
      setFeedback({
        status: 'error',
        text: 'An unexpected error occurred during bulk upload. Please try again.',
      });
    }
  };

  if (students.length < 1) {
    return (
      <>
        {bulkResult && bulkResult.failureCount > 0 && (
          <BulkUploadFeedback
            bulkResult={bulkResult}
            showBulkDetails={showBulkDetails}
            setShowBulkDetails={setShowBulkDetails}
            setBulkResult={setBulkResult}
          />
        )}
        <EmptyState
          heading="No Students Found"
          subHeading="Import students from a CSV or add a student manually."
          button={
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button href="/students/new" color="primary">
                <PlusIcon className="h-4 w-4 mr-2 text-white" color="white" />
                Add Student
              </Button>
              <Button
                type="button"
                outline
                onClick={() => setIsImportModal(true)}
              >
                <ArrowUpOnSquareIcon
                  className="h-4 w-4 mr-2 text-white"
                  color="white"
                />
                Import Students
              </Button>
            </div>
          }
          icon={<ClipboardDocumentListIcon className="size-12 text-gray-500" />}
        />
        <ImportStudentsModal
          open={isImportModal}
          onClose={handleImpModalClose}
          onSubmit={handleImportSubmit}
        />
      </>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <StudentsMainHeader setIsImportModal={setIsImportModal} />

        {bulkResult && bulkResult.failureCount > 0 && (
          <BulkUploadFeedback
            bulkResult={bulkResult}
            showBulkDetails={showBulkDetails}
            setShowBulkDetails={setShowBulkDetails}
            setBulkResult={setBulkResult}
          />
        )}

        {/* Stats */}
        <StudentsStats analytics={analytics} />

        <StudentsTable totalPages={totalPages} students={students} />
      </div>
      <ImportStudentsModal
        open={isImportModal}
        onClose={handleImpModalClose}
        onSubmit={handleImportSubmit}
      />
    </>
  );
};

export default StudentsView;
