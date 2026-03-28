'use client';

import { useState } from 'react';
import {
  PlusIcon,
  ArrowDownTrayIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/components/UIKit/Button';
import { ImportStudentsModal } from '@/components/Students';
import AdmissionsTable from '@/components/Admissions/AdmissionTable';
import DetailsModal from '@/components/Admissions/DetailsModal';
import EmptyState from '@/components/EmptyState';

export interface StudentRecord {
  id: number;
  name: string;
  gender?: string;
  dateOfBirth?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  grade: string;
  classSection?: string;
  enrollmentDate: string;
  previousSchool?: string;
  guardianName?: string;
  guardianRelationship?: string;
  guardianEmail?: string;
  guardianPhone?: string;
  status: 'Pending' | 'Enrolled';
}

type ImportStudent = {
  name: string;
  grade: string;
  email: string;
  guardianName: string;
  guardianPhone: string;
};

type ImportStudents = {
  students: ImportStudent[];
  classId: string;
};

export default function StudentAdmissionsPage() {
  const [students, setStudents] = useState<StudentRecord[]>([]);

  const [showImportModal, setShowImportModal] = useState(false);

  const [viewTarget, setViewTarget] = useState<StudentRecord | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const handleImportStudents = (importStudents: ImportStudents) => {
    const startId = Math.max(0, ...students.map((s) => s.id)) + 1;
    const imported: StudentRecord[] = importStudents.students.map(
      (student: ImportStudent, idx: number) => ({
        id: startId + idx,
        name: student.name,
        grade: student.grade,
        email: student.email,
        guardianName: student.guardianName,
        guardianPhone: student.guardianPhone,
        enrollmentDate: new Date().toISOString().split('T')[0],
        status: 'Pending',
      }),
    );
    setStudents((prev) => [...prev, ...imported]);
    setShowImportModal(false);
  };

  if (students.length < 1) {
    return (
      <>
        <EmptyState
          heading="No Admissions Found"
          subHeading="Get started by importing admissions data"
          button={
            <Button onClick={() => setShowImportModal(true)} color="primary">
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Import Admissions
            </Button>
          }
          icon={<ClipboardDocumentListIcon className="size-12 text-gray-500" />}
        />
        {/* Individual admission moved to dedicated page */}
        <ImportStudentsModal
          open={showImportModal}
          onClose={setShowImportModal}
          onSubmit={(file: File, selectedClassId: string) =>
            handleImportStudents({
              students: [
                {
                  name: '',
                  grade: '',
                  email: '',
                  guardianName: '',
                  guardianPhone: '',
                },
              ] as ImportStudent[],
              classId: selectedClassId,
            } as ImportStudents)
          }
        />
      </>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Student Admissions
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Admit students individually or by CSV import. Complete minimal
            imports later.
          </p>
        </div>
        <div className="flex gap-3">
          <Button outline onClick={() => setShowImportModal(true)}>
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Batch Import
          </Button>
          <Button color="primary" href="/dashboard/students/admissions/new">
            <PlusIcon className="h-4 w-4 mr-2 text-white" />
            Admit Student
          </Button>
        </div>
      </div>
      {/* Table */}
      <AdmissionsTable
        students={students}
        setViewTarget={setViewTarget}
        setShowViewModal={setShowViewModal}
      />

      {/* Individual admission moved to dedicated page */}
      <ImportStudentsModal
        open={showImportModal}
        onClose={setShowImportModal}
        onSubmit={(file: File, selectedClassId: string) =>
          handleImportStudents({
            students: [
              {
                name: '',
                grade: '',
                email: '',
                guardianName: '',
                guardianPhone: '',
              },
            ] as ImportStudent[],
            classId: selectedClassId,
          } as ImportStudents)
        }
      />

      {/* Applicant View Modal */}
      {/* <ApplicantDetailsModal showViewModal={showViewModal} setShowViewModal={setShowViewModal} viewTarget={viewTarget} setViewTarget={setViewTarget} /> */}
      <DetailsModal
        showViewModal={showViewModal}
        setShowViewModal={setShowViewModal}
        viewTarget={viewTarget}
        setViewTarget={setViewTarget}
      />
    </div>
  );
}
