import { auth } from '@/auth';
import ClassesView from '@/components/Classes/ClassView';
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
}

const ClassesPage = async () => {

    const session = await auth();

    // Fetch the data using server-side connector with auth cookie
    const res = await getModel(`/classes`,
        {
            headers: {
                'X-Lepa-Host-Header': 'schoolA.lepa.com',
                'Authorization': `Bearer ${session?.user.accessToken}`
            },
        }
    );


    const transformedData: SchoolClass[] = res.data.classes.map((classK: BackendClassesData) => {

        return {
            id: classK.id,
            capacity: classK.capacity,
            className: classK.name,
            createdAt: classK.created_at
        }
    });

    return (
        <ClassesView classes={transformedData} />
    );
};

export default ClassesPage