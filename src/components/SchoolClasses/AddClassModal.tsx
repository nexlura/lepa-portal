'use client'

import { useContext, useEffect, useRef, useState } from 'react'
import { Session } from 'next-auth'

import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/UIKit/Dialog'

import { Button } from '../UIKit/Button'
import { postModel } from '@/lib/connector'
import { FeedbackContext } from '@/context/feedback'
import revalidatePage from '@/app/actions/revalidate-path'
import {
    SL_LEVEL_BY_ID,
} from '@/data/sierraleone-grades'
import AddClassForm from './AddClassForm'
export interface AddModalProps {
    open: boolean;
    onClose: (open: boolean) => void;
}
interface AddClassModalProps extends AddModalProps {
    session: Session | null
}

export type ClassForm = {
    name: string,
    capacity: string,
    teacher: string,
}

export type ClassformErrors = {
    name?: string;
    grade?: string;
}


const AddClassModal = ({ open, onClose, session }: AddClassModalProps) => {
    const nameInputRef = useRef<HTMLInputElement>(null);
    const { setFeedback } = useContext(FeedbackContext)

    const [localError, setLocalError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [form, setForm] = useState({
        name: '',
        capacity: '',
        teacher: '',
    })

    const schoolLevel = session?.user?.schoolLevel; // e.g., 'primary', 'jss', 'sss

    const getYears = (level: string) =>
        SL_LEVEL_BY_ID[level]?.years.map(y => ({ id: y.id, name: y.name })) ?? [];

    const gradeOptions =
        schoolLevel === 'secondary'
            ? [
                ...getYears('jss'),
                ...getYears('sss'),
            ]
            : getYears(schoolLevel || 'primary');

    const [errors, setErrors] = useState<{ name?: string; grade?: string }>({})
    const [selectedLevel, setSelectedLevel] = useState(
        gradeOptions[0] || { id: '', name: '' }
    );

    const postData = {
        grade: selectedLevel.name,
        capacity: Number(form.capacity),
        name: form.name,
    }

    const resetForm = () => {
        setForm({
            name: '',
            capacity: '',
            teacher: '',
        });
        setErrors({});
        setLocalError(null);
        setSelectedLevel(gradeOptions[0] || { id: '', name: '' }); // reset dropdown to default
    };

    const handleVerificationSuccess = () => {
        revalidatePage('/classes/1');
        onClose(false)
        setFeedback({ status: 'success', text: 'Class added successfully!' })
    };

    const validate = () => {
        const next: { name?: string } = {};
        if (!form.name.trim()) {
            next.name = 'Class name is required';
            nameInputRef.current?.focus();
        }
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setLocalError(null)
        setIsLoading(true)

        try {
            const resp = await postModel(
                '/classes',
                postData
            );

            // Check if response is an error
            if (resp && typeof resp === 'object' && 'error' in resp && resp.error) {
                setLocalError(resp.message || 'Something went wrong. Please try again')
                return
            }

            // Check for 204 success response
            if (resp && typeof resp === 'object' && 'status' in resp && resp.status === 204) {
                handleVerificationSuccess()
                return
            }

            // If we have data or success response, treat as success
            if (!resp || (resp && typeof resp === 'object' && !('error' in resp))) {
                handleVerificationSuccess()
                return
            }

            // Fallback error
            setLocalError('Something went wrong. Please try again')
        } catch (error) {
            console.error('Error during POST request:', error);
            setLocalError('An unexpected error occurred. Please try again.')
        } finally {
            setIsLoading(false);
        }
    }


    useEffect(() => {
        if (!open) {
            resetForm();
        }
    }, [open]);

    return (
        <Dialog size="md" open={open} onClose={onClose} className="relative z-20">
            <DialogTitle>Add a Class</DialogTitle>
            <DialogDescription>Provide details for the new class.</DialogDescription>
            <DialogBody>
                <AddClassForm
                    errors={errors}
                    form={form}
                    gradeOptions={gradeOptions}
                    localError={localError}
                    nameInputRef={nameInputRef}
                    setForm={setForm}
                    selectedLevel={selectedLevel}
                    setSelectedLevel={setSelectedLevel}
                />
            </DialogBody>
            <DialogActions>
                <Button plain onClick={() => onClose(false)}>Cancel</Button>
                <Button
                    color="primary"
                    onClick={handleSubmit}
                    disabled={isLoading}

                >
                    {isLoading ? 'Saving' : 'Save Class'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default AddClassModal