import TeachersView from '@/components/Teachers/TeachersView'
import { PageProps } from '../../classes/[pageNumber]/page'
import { auth } from '@/auth'
import { getRequestHostAction } from '@/app/actions/get-host'
import { getModel } from '@/lib/connector'

interface Teacher {
    id: number
    name: string
    email: string
    subject: string
    status: string
    joinDate: string
    phone?: string
    department?: string
}

interface BackendTeachersData {
    id: number
    name: string,
    subject: string
    status: string
}

const TeachersPage = async ({ params }: PageProps) => {
    const { pageNumber } = await params

    const session = await auth();
    const host = await getRequestHostAction()

    // Fetch the data using server-side connector with auth cookie(getRequestHostAction());
    const res = await getModel(`/teachers?page=${pageNumber}`,
        {
            headers: {
                'X-Lepa-Host-Header': host,
                'Authorization': `Bearer ${session?.user.accessToken}`
            },
        }
    );

    console.log('teachers res', res);


    const transformedData: Teacher[] = res.data.teachers?.map((teacher: BackendTeachersData) => {

        return {
            id: teacher.id,
            name: teacher.name,
            status: teacher.status
        }
    });


    return (
        <TeachersView teachers={transformedData} session={session} />
    )
}

export default TeachersPage