import { auth } from '@/auth';
import SchoolClassesView from '@/components/SchoolClasses/ClassView';
import { MultiSelectOption } from '@/components/UIKit/MultiSelect';
import { getModel } from '@/lib/connector';

export type BackendClassesData = {
    id: string,
    tenant_id: string,
    name: string,
    grade: string,
    capacity: number,
    current_size: number,
    is_active: boolean,
    room_number: string,
    created_at: string
    teachers: { id: string, full_name: string }[]
}

export type SchoolClass = {
    id: string
    className: string
    capacity: number
    teachers?: MultiSelectOption[]
    createdAt?: string
    currentSize?: number
    grade: string
}

export type PageProps = {
    params: Promise<{ pageNumber: string }>;
};

const SchoolClassesPage = async ({ params }: PageProps) => {
    const { pageNumber } = await params
    const session = await auth();

    const res = await getModel(`/classes?page=${pageNumber}&limit=10`);
    const totalPages = res.data?.total_pages
    const classes = res.data?.classes

    const transformedData: SchoolClass[] = classes.map((classK: BackendClassesData) => {

        return {
            id: classK.id,
            capacity: classK.capacity,
            className: classK.name,
            createdAt: classK.created_at,
            currentSize: classK.current_size.toString(),
            teachers: classK.teachers.map(t => ({
                id: t.id,
                name: t.full_name
            })),
            grade: classK.grade
        }
    });

    return (
        <SchoolClassesView
            classes={transformedData}
            session={session}
            totalPages={totalPages}
        />
    );
};

export default SchoolClassesPage