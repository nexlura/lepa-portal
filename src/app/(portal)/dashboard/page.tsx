import { getModel } from '@/lib/connector';
import Calendar from '@/components/Dashboard/Calender';
import RecentActivities from '@/components/Dashboard/RecentActivities';
import DashboardStats from '@/components/Dashboard/Analytics/Stats';
import ClassOverview from '@/components/Dashboard/Analytics/ClassOverview';
import TeachersSection from '@/components/Dashboard/Analytics/TeachersSection';
import StudentInsights from '@/components/Dashboard/Analytics/StudentInsights';

interface BackendStudent {
    id: string;
    first_name: string;
    last_name: string;
    sex?: string;
    date_of_birth?: string;
    created_at: string;
}

interface BackendTeacher {
    id: string;
    first_name?: string;
    last_name?: string;
    name?: string;
    assigned_classes?: { id: string; name: string }[];
    created_at: string;
}

interface BackendClass {
    id: string;
    name: string;
    current_size: number;
    teachers: { id: string; full_name: string }[];
}

// Calculate age from date of birth
const calculateAge = (dateOfBirth: string): number | null => {
    if (!dateOfBirth) return null;
    const birthDate = new Date(dateOfBirth);
    if (isNaN(birthDate.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

// Group ages into ranges
const groupAges = (ages: number[]): { range: string; count: number }[] => {
    const ranges = [
        { min: 0, max: 5, label: '0-5 years' },
        { min: 6, max: 10, label: '6-10 years' },
        { min: 11, max: 15, label: '11-15 years' },
        { min: 16, max: 20, label: '16-20 years' },
        { min: 21, max: 25, label: '21-25 years' },
        { min: 26, max: 100, label: '26+ years' },
    ];

    return ranges.map(range => ({
        range: range.label,
        count: ages.filter(age => age >= range.min && age <= range.max).length,
    }));
};

export default async function AdminDashboard() {
    // Fetch all data in parallel
    const [studentsRes, teachersRes, classesRes] = await Promise.all([
        getModel<{ students: BackendStudent[]; total: number }>('/students?page=1&limit=1000'),
        getModel<{ teachers: BackendTeacher[]; total: number }>('/teachers?page=1&limit=1000'),
        getModel<{ classes: BackendClass[]; total: number }>('/classes?page=1&limit=1000'),
    ]);

    const students = studentsRes?.students || [];
    const teachers = teachersRes?.teachers || [];
    const classes = classesRes?.classes || [];

    // Calculate summary statistics
    const studentsCount = students.length;
    const teachersCount = teachers.length;
    const classesCount = classes.length;
    const studentTeacherRatio = teachersCount > 0 ? studentsCount / teachersCount : 0;

    // Prepare class overview data
    const classOverviewData = classes.map(cls => ({
        id: cls.id,
        name: cls.name,
        studentCount: cls.current_size || 0,
        hasTeacher: cls.teachers && cls.teachers.length > 0,
    }));

    // Prepare teacher data
    const teacherData = teachers.map(teacher => {
        const fullName = teacher.first_name && teacher.last_name
            ? `${teacher.first_name} ${teacher.last_name}`
            : teacher.name || 'Unknown';

        const hasClasses = !!(teacher.assigned_classes && teacher.assigned_classes.length > 0);

        // Calculate total students for this teacher
        const teacherClassIds = teacher.assigned_classes?.map(ac => ac.id) || [];
        const teacherClasses = classes.filter(cls =>
            teacherClassIds.includes(cls.id)
        );
        const studentCount = teacherClasses.reduce((sum, cls) => sum + (cls.current_size || 0), 0);

        return {
            id: teacher.id,
            name: fullName,
            hasClasses,
            studentCount,
        };
    });

    // Calculate average students per teacher
    const teachersWithClasses = teacherData.filter(t => t.hasClasses);
    const totalStudentsInClasses = teachersWithClasses.reduce((sum, t) => sum + t.studentCount, 0);
    const averageStudentsPerTeacher = teachersWithClasses.length > 0
        ? totalStudentsInClasses / teachersWithClasses.length
        : 0;

    // Prepare gender distribution
    const genderDistribution = {
        male: students.filter(s => s.sex?.toLowerCase() === 'male' || s.sex?.toLowerCase() === 'm').length,
        female: students.filter(s => s.sex?.toLowerCase() === 'female' || s.sex?.toLowerCase() === 'f').length,
        other: students.filter(s => {
            const sex = s.sex?.toLowerCase();
            return sex && sex !== 'male' && sex !== 'm' && sex !== 'female' && sex !== 'f';
        }).length,
    };

    // Prepare age ranges
    const ages = students
        .map(s => s.date_of_birth ? calculateAge(s.date_of_birth) : null)
        .filter((age): age is number => age !== null);
    const ageRanges = groupAges(ages);

    // Prepare recent students and teachers (sorted by created_at, most recent first)
    const recentStudents = students
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)
        .map(s => ({
            id: s.id,
            name: `${s.first_name} ${s.last_name}`.trim() || 'Unknown Student',
            addedAt: s.created_at,
        }));

    const recentTeachers = teachers
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)
        .map(t => ({
            id: t.id,
            name: t.first_name && t.last_name
                ? `${t.first_name} ${t.last_name}`
                : t.name || 'Unknown Teacher',
            addedAt: t.created_at,
        }));

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Welcome to your Lepa admin dashboard. Here&apos;s an overview of your school&apos;s data.
                </p>
            </div>

            {/* Top Summary Cards */}
            <DashboardStats
                studentsCount={studentsCount}
                teachersCount={teachersCount}
                classesCount={classesCount}
                studentTeacherRatio={studentTeacherRatio}
            />

            {/* Main layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main content - Left column (3/4 width) */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Section 1: Class Overview */}
                    <ClassOverview classes={classOverviewData} />

                    {/* Section 2: Teachers */}
                    <TeachersSection
                        teachers={teacherData}
                        averageStudentsPerTeacher={averageStudentsPerTeacher}
                    />

                    {/* Section 3: Student Insights */}
                    <StudentInsights
                        genderDistribution={genderDistribution}
                        ageRanges={ageRanges.length > 0 ? ageRanges : undefined}
                    />
                </div>

                {/* Sidebar - Right column (1/4 width) */}
                <div className="space-y-6">
                    {/* Calendar */}
                    <Calendar />

                    {/* Section 4: Recent Activity */}
                    <RecentActivities
                        recentStudents={recentStudents}
                        recentTeachers={recentTeachers}
                    />
                </div>
            </div>
        </div>
    );
}
