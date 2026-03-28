'use client';

import { useContext, useState } from 'react';
import { Session } from 'next-auth';
import {
  ArrowUpOnSquareIcon,
  BookOpenIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

import { Button } from '@/components/UIKit/Button';
import { SchoolClass } from '@/app/(portal)/classes/[pageNumber]/page';
import { postFormData } from '@/lib/connector';
import EmptyState from '../EmptyState';
import ClassesStats from './ClassesStats';
import AddSchoolClassModal from './AddClassModal';
import SchoolClassesTable from '@/components/SchoolClasses/Table';
import ImportClassesModal from './ImportClassesModal';
import revalidatePage from '@/app/actions/revalidate-path';
import { FeedbackContext } from '@/context/feedback';
import BulkUploadFeedback from '../BulkUploadFeedback';
import ClassesMainHeader from './MainHeader';
interface ClassesAnalytics {
  totalClasses: number;
  totalCapacity: number;
  averageClassSize: number;
}

interface ClassesViewProps {
  classes: SchoolClass[];
  session: Session | null;
  totalPages: number;
  analytics: ClassesAnalytics;
}

type BulkUploadResult = {
  successCount: number;
  failureCount: number;
  totalCount: number;
  failedMessages: string[];
};

const SchoolClassesView = ({
  classes,
  totalPages,
  session,
  analytics,
}: ClassesViewProps) => {
  const { setFeedback } = useContext(FeedbackContext);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isImportModal, setIsImportModal] = useState(false);
  const [bulkResult, setBulkResult] = useState<BulkUploadResult | null>(null);
  const [showBulkDetails, setShowBulkDetails] = useState(false);

  const handleImpModalClose = () => {
    setIsImportModal(false);
  };
  //handle import classes
  const handleImportSubmit = async (file: File) => {
    if (!session?.user?.tenantId) {
      console.error('Tenant ID not found for bulk upload');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('tenant_id', session.user.tenantId);
      formData.append('file', file);

      const resp = await postFormData('/classes/bulk-upload', formData);

      // Default summary values
      let successCount = 0;
      let failureCount = 0;
      let totalCount = 0;
      let failedMessages: string[] = [];

      if (resp && typeof resp === 'object' && 'data' in resp && resp.data) {
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
        `${n} ${word}${n === 1 ? '' : 'es'}`;

      if (successCount === totalCount && failureCount === 0) {
        status = 'success';
        text = `${plural(successCount, 'class')} uploaded successfully.`;
        revalidatePage('/classes/1');
        setFeedback({ status: status, text: text });
      } else if (successCount === 0 && failureCount === totalCount) {
        status = 'error';

        const allExist =
          failedMessages.length > 0 &&
          failedMessages.every((msg) =>
            msg.toLowerCase().includes('already exists'),
          );

        if (allExist) {
          text = `Upload failed. All ${plural(totalCount, 'class')} already exist for this academic year.`;
        } else {
          text = `Upload failed. All ${plural(totalCount, 'row')} failed validation.`;
        }
      } else {
        const allExist =
          failedMessages.length > 0 &&
          failedMessages.every((msg) =>
            msg.toLowerCase().includes('already exists'),
          );

        text = [
          'Upload completed with issues.',
          `${plural(successCount, 'class')} created successfully.`,
          allExist
            ? `${plural(failureCount, 'class')} were skipped because they already exist.`
            : `${plural(failureCount, 'row')} were skipped due to validation errors.`,
        ].join(' ');
      }

      revalidatePage('/classes/1');

      setBulkResult({
        successCount,
        failureCount,
        totalCount,
        failedMessages,
      });
      setShowBulkDetails(false);
    } catch (error) {
      console.error('Error during classes bulk upload:', error);
      setFeedback({
        status: 'error',
        text: 'An unexpected error occurred during bulk upload. Please try again.',
      });
    }
  };
  //show empty-state component when we have zero items
  if (classes.length < 1) {
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
          heading="No Classes Found"
          subHeading="Add a class manually or import multiple classes from a CSV."
          button={
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button onClick={() => setIsAddOpen(true)} color="primary">
                <PlusIcon className="h-4 w-4 mr-2 text-white" color="white" />
                Add Class
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
                Import Classes
              </Button>
            </div>
          }
          icon={<BookOpenIcon className="size-12 text-gray-500" />}
        />
        <AddSchoolClassModal
          open={isAddOpen}
          onClose={setIsAddOpen}
          session={session}
        />
        <ImportClassesModal
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
        <ClassesMainHeader
          setIsAddOpen={setIsAddOpen}
          setIsImportModal={setIsImportModal}
        />
        {/* Bulk upload summary (if any) */}
        {bulkResult && bulkResult.failureCount > 0 && (
          <BulkUploadFeedback
            bulkResult={bulkResult}
            showBulkDetails={showBulkDetails}
            setShowBulkDetails={setShowBulkDetails}
            setBulkResult={setBulkResult}
          />
        )}

        <ClassesStats analytics={analytics} />

        {/* Classes table */}
        <SchoolClassesTable classes={classes} totalPages={totalPages} />
      </div>
      <AddSchoolClassModal
        open={isAddOpen}
        onClose={setIsAddOpen}
        session={session}
      />
      <ImportClassesModal
        onClose={handleImpModalClose}
        onSubmit={handleImportSubmit}
        open={isImportModal}
      />
    </>
  );
};

export default SchoolClassesView;
