'use client'

import DataTable from '@/components/DataTable'
import { Teacher } from "../TeachersView"
import TeachersTableBody from "./TableBody"
import TeachersTableHead from "./TableHead"

interface BackendTeachersData {
    id: number
    first_name?: string
    last_name?: string
    name?: string
    email?: string
    phone?: string
    subjects?: string[]
    assigned_classes?: Array<{ id: string; name: string; grade?: string }>
    is_active?: boolean
    created_at?: string
    join_date?: string
    sex?: string
}

interface TeachersTableProps {
    teachers: Teacher[]
    totalPages: number
}

const TeachersTable = ({ teachers, totalPages }: TeachersTableProps) => {
    return (
        <DataTable<Teacher, BackendTeachersData>
            config={{
                endpoint: '/teachers',
                dataKey: 'teachers',
                transformData: (teacher: BackendTeachersData): Teacher => {
                    const fullName = teacher.first_name && teacher.last_name
                        ? `${teacher.first_name} ${teacher.last_name}`
                        : teacher.name || 'Unknown'

                    const subjects = teacher.subjects || []
                    const classes = teacher.assigned_classes?.map(cls =>
                        cls.grade ? `${cls.name} (${cls.grade})` : cls.name
                    ) || []

                    return {
                        id: teacher.id,
                        name: fullName,
                        email: teacher.email || '',
                        subjects: subjects.length > 0 ? subjects : undefined,
                        classes: classes.length > 0 ? classes : undefined,
                        status: teacher.is_active ? 'active' : 'inactive',
                        joinDate: teacher.join_date || teacher.created_at || '',
                        phone: teacher.phone,
                        sex: teacher.sex
                    }
                },
                title: 'All Teachers',
                tableHead: <TeachersTableHead />,
                tableBody: (teachers) => <TeachersTableBody teachers={teachers} />,
                searchPlaceholder: 'search teachers by name',
                columnCount: 7,
            }}
            initialData={teachers}
            initialTotalPages={totalPages}
        />
    )
}

export default TeachersTable