import { Dispatch, SetStateAction } from 'react'

import { Input } from '@/components/UIKit/Input'
import { Field, Label } from '@/components/UIKit/Fieldset'
import { Button } from '@/components/UIKit/Button'

type PersonalData = {
    name: string;
    gender: string;
    dateOfBirth: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    grade: string;
    classSection: string;
    previousSchool: string;
}

interface PersonalDetsTabProps {
    personalData: PersonalData
    setPersonalData: Dispatch<SetStateAction<PersonalData>>
}

const PersonalDetailsTab = ({ personalData, setPersonalData }: PersonalDetsTabProps) => {

    const handleSavePersonal = () => {
        // Save personal data
        console.log('Saving personal data:', personalData)
    }

    return (<div className="space-y-6">
        <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Personal Details</h3>
            <Button color="primary" onClick={handleSavePersonal}>
                Save Changes
            </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field>
                <Label>Full Name</Label>
                <Input
                    value={personalData.name}
                    onChange={(e) => setPersonalData(prev => ({ ...prev, name: e.target.value }))}
                />
            </Field>
            <Field>
                <Label>Gender</Label>
                <Input
                    value={personalData.gender}
                    onChange={(e) => setPersonalData(prev => ({ ...prev, gender: e.target.value }))}
                />
            </Field>
            <Field>
                <Label>Date of Birth</Label>
                <Input
                    type="date"
                    value={personalData.dateOfBirth}
                    onChange={(e) => setPersonalData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                />
            </Field>
            <Field>
                <Label>Email</Label>
                <Input
                    type="email"
                    value={personalData.email}
                    onChange={(e) => setPersonalData(prev => ({ ...prev, email: e.target.value }))}
                />
            </Field>
            <Field>
                <Label>Phone</Label>
                <Input
                    type="tel"
                    value={personalData.phone}
                    onChange={(e) => setPersonalData(prev => ({ ...prev, phone: e.target.value }))}
                />
            </Field>
            <Field>
                <Label>Grade</Label>
                <Input
                    value={personalData.grade}
                    onChange={(e) => setPersonalData(prev => ({ ...prev, grade: e.target.value }))}
                />
            </Field>
            <Field>
                <Label>Class/Section</Label>
                <Input
                    value={personalData.classSection}
                    onChange={(e) => setPersonalData(prev => ({ ...prev, classSection: e.target.value }))}
                />
            </Field>
            <Field>
                <Label>Previous School</Label>
                <Input
                    value={personalData.previousSchool}
                    onChange={(e) => setPersonalData(prev => ({ ...prev, previousSchool: e.target.value }))}
                />
            </Field>
            <Field className="md:col-span-2">
                <Label>Address</Label>
                <Input
                    value={personalData.address}
                    onChange={(e) => setPersonalData(prev => ({ ...prev, address: e.target.value }))}
                />
            </Field>
            <Field>
                <Label>City</Label>
                <Input
                    value={personalData.city}
                    onChange={(e) => setPersonalData(prev => ({ ...prev, city: e.target.value }))}
                />
            </Field>
            <Field>
                <Label>State</Label>
                <Input
                    value={personalData.state}
                    onChange={(e) => setPersonalData(prev => ({ ...prev, state: e.target.value }))}
                />
            </Field>
            <Field>
                <Label>Postal Code</Label>
                <Input
                    value={personalData.postalCode}
                    onChange={(e) => setPersonalData(prev => ({ ...prev, postalCode: e.target.value }))}
                />
            </Field>
        </div>
    </div>)
}

export default PersonalDetailsTab