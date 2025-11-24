import TeachersView from '@/components/Teachers/TeachersView'
import { PageProps } from '../../classes/[pageNumber]/page'
import { auth } from '@/auth'
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

    const res = await getModel(`/teachers?page=${pageNumber}`);

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