import { auth } from '@/auth';
import ClassesView from '@/components/SchoolClasses/ClassView';
import { getModel } from '@/lib/connector';

type BackendClassesData = {
    id: string,
    tenant_id: string,
    name: string,
    grade: string,
    capacity: number,
    current_size: number,
    is_active: boolean,
    room_number: string,
    created_at: string
}

export type SchoolClass = {
    id: string
    className: string
    capacity: number
    teacher?: string
    createdAt?: string
    currentSize?: number
}

export type PageProps = {
    params: Promise<{ pageNumber: string }>;
};

const ClassesPage = async ({ params }: PageProps) => {
    const { pageNumber } = await params
    const session = await auth();
    // Headers are automatically handled by the connector
    const res = await getModel(`/classes?page=${pageNumber}&limit=5`);
    const totalPages = res.data?.total_pages
    const classes = res.data?.classes

    const transformedData: SchoolClass[] = classes.map((classK: BackendClassesData) => {

        return {
            id: classK.id,
            capacity: classK.capacity,
            className: classK.name,
            createdAt: classK.created_at,
            currentSize: classK.current_size.toString()
        }
    });

    return (
        <ClassesView
            classes={transformedData}
            session={session}
            totalPages={totalPages}
        />
    );
};

export default ClassesPage