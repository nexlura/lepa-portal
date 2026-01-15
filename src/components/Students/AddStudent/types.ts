import type { MultiSelectOption } from '@/components/UIKit/MultiSelect'

export type StudentAttachment = {
  file: File
  fileName: string
  type: string
  size: number
  preview?: string // For image previews
}

export type AddStudentForm = {
  firstName: string
  lastName: string
  middleName: string
  gender: string
  dateOfBirth: string
  address: string
  enrollmentDate: string
  assignedClass: MultiSelectOption | null
  attachments: StudentAttachment[]
}

export type AddStudentFormErrors = Partial<Record<keyof AddStudentForm, string>>


