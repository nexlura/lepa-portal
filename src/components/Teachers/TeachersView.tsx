'use client';

import {
  AcademicCapIcon,
  ArrowUpOnSquareIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

import { Button } from '@/components/UIKit/Button';
import TeachersTable from './Table';
import TeachersStats from './TeachersStats';
import EmptyState from '../EmptyState';
import { useContext, useState } from 'react';
import ImportTeachersModal from './ImportTeachersModal';
import { useSession } from 'next-auth/react';
import { postFormData } from '@/lib/connector';
import revalidatePage from '@/app/actions/revalidate-path';
import { FeedbackContext } from '@/context/feedback';
import BulkUploadFeedback, { BulkUploadResult } from '../BulkUploadFeedback';
import TeachersMainHeader from './MainHeader';

export interface Teacher {
  id: number;
  name: string;
  email: string;
  subjects?: string[];
  classes?: string[];
  status: string;
  joinDate: string;
  phone?: string;
  department?: string;
  sex?: string;
}

interface TeachersAnalytics {
  totalTeachers: number;
  activeTeachers: number;
  averageStudentsPerTeacher: number;
}

interface TeachersViewProps {
  teachers: Teacher[];
  totalPages: number;
  analytics: TeachersAnalytics;
}

const TeachersView = ({
  teachers,
  totalPages,
  analytics,
}: TeachersViewProps) => {
  const { data: session } = useSession();
  const { setFeedback } = useContext(FeedbackContext);

  const [isImportModal, setIsImportModal] = useState(false);
  const [bulkResult, setBulkResult] = useState<BulkUploadResult | null>(null);
  const [showBulkDetails, setShowBulkDetails] = useState(false);

  const handleImpModalClose = () => {
    setIsImportModal(false);
  };

  const handleImportSubmit = async (file: File) => {
    if (!session?.user?.tenantId) {
      console.error('Tenant ID not found for bulk upload');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('tenant_id', session.user.tenantId);
      formData.append('file', file);

      const resp = await postFormData('/teachers/bulk-upload', formData);

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
        text = `${plural(successCount, 'teacher')} uploaded successfully.`;
        revalidatePage('/teachers/1');
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
          text = `Upload failed. All ${plural(totalCount, 'teacher')} already exist for this academic year.`;
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
          `${plural(successCount, 'teacher')} created successfully.`,
          allExist
            ? `${plural(failureCount, 'teacher')} were skipped because they already exist.`
            : `${plural(failureCount, 'row')} were skipped due to validation errors.`,
        ].join(' ');

        if (successCount > 0) {
          revalidatePage('/teachers/1');
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
      console.error('Error during teachers bulk upload:', error);
      setFeedback({
        status: 'error',
        text: 'An unexpected error occurred during bulk upload. Please try again.',
      });
    }
  };

  if (teachers?.length < 1) {
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
          heading="No Teachers Found"
          subHeading="Import teachers from a CSV or add a teacher manually."
          button={
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button href="/teachers/new" color="primary">
                <PlusIcon className="h-4 w-4 mr-2 text-white" color="white" />
                Add Teacher
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
                Import Teachers
              </Button>
            </div>
          }
          icon={<AcademicCapIcon className="size-12 text-gray-500" />}
        />
        <ImportTeachersModal
          onClose={handleImpModalClose}
          onSubmit={handleImportSubmit}
          open={isImportModal}
        />
      </>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Page header */}
        <TeachersMainHeader setIsImportModal={setIsImportModal} />

        {bulkResult && bulkResult.failureCount > 0 && (
          <BulkUploadFeedback
            bulkResult={bulkResult}
            showBulkDetails={showBulkDetails}
            setShowBulkDetails={setShowBulkDetails}
            setBulkResult={setBulkResult}
          />
        )}

        {/* Stats */}
        <TeachersStats analytics={analytics} />

        <TeachersTable teachers={teachers} totalPages={totalPages} />
      </div>
      <ImportTeachersModal
        onClose={handleImpModalClose}
        onSubmit={handleImportSubmit}
        open={isImportModal}
      />
    </>
  );
};

export default TeachersView;
