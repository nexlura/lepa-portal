import type { MultiSelectOption } from '@/components/UIKit/MultiSelect'

export type TeacherAttachment = {
  file: File
  fileName: string
  type: string
  size: number
  preview?: string // For image previews
}

export type AddTeacherForm = {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  address: string
  sex: string
  subjects: MultiSelectOption[]
  assignedClasses: MultiSelectOption[]
  attachments: TeacherAttachment[]
}

export type AddTeacherFormErrors = Partial<Record<keyof AddTeacherForm, string>>

