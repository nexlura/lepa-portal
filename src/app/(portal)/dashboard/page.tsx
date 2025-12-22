import { getModel, isErrorResponse } from '@/lib/connector';
import Calendar from '@/components/Dashboard/Calender';
import RecentActivities from '@/components/Dashboard/RecentActivities';
import DashboardStats from '@/components/Dashboard/Analytics/Stats';
import ClassOverview from '@/components/Dashboard/Analytics/ClassOverview';
import TeachersSection from '@/components/Dashboard/Analytics/TeachersSection';
import StudentInsights from '@/components/Dashboard/Analytics/StudentInsights';

// Type definitions for analytics API response
interface AnalyticsResponse {
    success?: boolean;
    code?: number;
    message?: string;
    data?: {
        total_counts?: {
            students?: number;
            teachers?: number;
            classes?: number;
            student_per_teacher_ratio?: number;
        };
        class_overview?: Array<{
            class_id: string;
            class_name: string;
            student_count?: number;
        }>;
        teacher_stats?: {
            total_teachers?: number;
            teachers_with_classes?: number;
            teachers_without_classes?: number;
            teachers_with_classes_list?: Array<{
                id: string;
                first_name?: string;
                last_name?: string;
                name?: string;
                assigned_classes?: Array<{
                    id: string;
                    name: string;
                }>;
                created_at?: string;
            }>;
            teachers_without_classes_list?: Array<{
                id: string;
                first_name?: string;
                last_name?: string;
                name?: string;
                created_at?: string;
            }>;
        };
        average_student_per_teacher?: number;
        teacher_assignment_status?: Array<{
            teacher_id: string;
            teacher_name: string;
            status: string;
            subjects?: Array<string>;
        }>;
        student_insights?: {
            gender_distribution?: {
                male?: number;
                female?: number;
                other?: number;
                unknown?: number;
            };
            age_distribution?: {
                age_0_to_5?: number;
                age_6_to_10?: number;
                age_11_to_15?: number;
                age_16_to_20?: number;
                age_21_to_25?: number;
                age_26_plus?: number;
            };
        };
    };
}

export default async function AdminDashboard() {
    // Fetch analytics data from API with error handling
    let analytics: AnalyticsResponse['data'] | undefined;
    let analyticsError: string | null = null;
    
    try {
        const analyticsRes = await getModel<AnalyticsResponse>('/analytics/tenant');
        
        // Check if response is an error
        if (isErrorResponse(analyticsRes)) {
            // Only show error message if it's not a 404 (endpoint may not exist yet)
            if (analyticsRes.status !== 404) {
                analyticsError = analyticsRes.message || 'Unknown error';
            }
        } else if (analyticsRes?.data) {
            analytics = analyticsRes.data;
        }
    } catch (error) {
        // Silently handle errors - endpoint may not exist yet or return invalid JSON
        console.warn('Error fetching dashboard analytics:', error);
    }

    // If no analytics data and not a handled error, show empty state
    if (!analytics && analyticsError) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Welcome to your Lepa admin dashboard.
                    </p>
                </div>
                <div className="bg-white shadow rounded-lg p-6">
                    <p className="text-gray-500">
                        Unable to load analytics: {analyticsError}
                    </p>
                </div>
            </div>
        );
    }

    // Use empty object as fallback if analytics is undefined
    const analyticsData = analytics || {};

    // Extract summary statistics from total_counts
    const totalCounts = analyticsData.total_counts || {};
    const studentsCount = totalCounts.students || 0;
    const teachersCount = totalCounts.teachers || 0;
    const classesCount = totalCounts.classes || 0;
    const studentTeacherRatio = totalCounts.student_per_teacher_ratio || (teachersCount > 0 ? studentsCount / teachersCount : 0);

    // Prepare class overview data
    const classOverviewData = (analyticsData.class_overview || []).map(cls => ({
        id: cls.class_id,
        name: cls.class_name,
        studentCount: cls.student_count || 0,
        hasTeacher: false, // Will be determined from teacher_stats
    }));

    // Prepare teacher-class mapping from teacher_stats
    const teacherStats = analyticsData.teacher_stats || {};
    const teachersWithClassesList = teacherStats.teachers_with_classes_list || [];
    
    // Get all class IDs that have teachers assigned
    const classesWithTeachersSet = new Set<string>();
    teachersWithClassesList.forEach(teacher => {
        teacher.assigned_classes?.forEach(cls => {
            classesWithTeachersSet.add(cls.id);
        });
    });
    
    // Map teachers to their class names
    const teachersWithClassesData = teachersWithClassesList
        .map(teacher => {
            const teacherName = teacher.name || 
                (teacher.first_name && teacher.last_name 
                    ? `${teacher.first_name} ${teacher.last_name}` 
                    : 'Unknown Teacher');
            const classNames = teacher.assigned_classes?.map(cls => cls.name) || [];
            const classCount = classNames.length;
            
            return {
                teacherId: teacher.id,
                teacherName,
                classCount,
                classNames, // Include class names for display
            };
        });
    
    // Count total classes with teachers (sum of all assigned_classes)
    const totalClassesWithTeachers = teachersWithClassesList.reduce(
        (sum, teacher) => sum + (teacher.assigned_classes?.length || 0),
        0
    );
    
    // Get classes without teachers
    const classesWithoutTeachers = classOverviewData.filter(cls => !classesWithTeachersSet.has(cls.id));
    const classesWithoutTeacherCount = classesWithoutTeachers.length;

    // Prepare teacher data from teacher_assignment_status
    const teacherData = (analyticsData.teacher_assignment_status || []).map(teacher => {
        const hasClasses = teacher.status === 'assigned';
        const subjects = teacher.subjects || [];

        return {
            id: teacher.teacher_id,
            name: teacher.teacher_name,
            hasClasses,
            subjects,
        };
    });

    // Get average students per teacher from API
    const averageStudentsPerTeacher = analyticsData.average_student_per_teacher || 0;

    // Prepare gender distribution from student_insights
    const genderDistribution = {
        male: analyticsData.student_insights?.gender_distribution?.male ?? 0,
        female: analyticsData.student_insights?.gender_distribution?.female ?? 0,
        other: (analyticsData.student_insights?.gender_distribution?.other ?? 0) + 
               (analyticsData.student_insights?.gender_distribution?.unknown ?? 0),
    };

    // Transform age distribution object to array format
    const ageDistribution = analyticsData.student_insights?.age_distribution || {};
    const ageRanges = [
        { range: '0-5 years', count: ageDistribution.age_0_to_5 || 0 },
        { range: '6-10 years', count: ageDistribution.age_6_to_10 || 0 },
        { range: '11-15 years', count: ageDistribution.age_11_to_15 || 0 },
        { range: '16-20 years', count: ageDistribution.age_16_to_20 || 0 },
        { range: '21-25 years', count: ageDistribution.age_21_to_25 || 0 },
        { range: '26+ years', count: ageDistribution.age_26_plus || 0 },
    ].filter(range => range.count > 0); // Only include ranges with students

    // Prepare recent activities from teacher_stats lists (sorted by created_at, most recent first)
    const allTeachersForActivity = [
        ...(teachersWithClassesList || []),
        ...(teacherStats.teachers_without_classes_list || []),
    ].sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA; // Most recent first
    });

    const recentTeachers = allTeachersForActivity.slice(0, 5).map(t => ({
        id: t.id,
        name: t.name || (t.first_name && t.last_name ? `${t.first_name} ${t.last_name}` : 'Unknown Teacher'),
        addedAt: t.created_at || new Date().toISOString(),
    }));

    // Recent students - not provided by API, using empty array
    const recentStudents: Array<{ id: string; name: string; addedAt: string }> = [];

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
                    <ClassOverview 
                        classes={classOverviewData}
                        teachersWithClasses={teachersWithClassesData}
                        classesWithTeacherCount={totalClassesWithTeachers}
                        classesWithoutTeacherCount={classesWithoutTeacherCount}
                        classesWithoutTeachers={classesWithoutTeachers}
                    />

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
