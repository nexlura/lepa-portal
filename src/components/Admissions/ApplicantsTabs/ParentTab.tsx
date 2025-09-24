import { Dispatch, SetStateAction } from 'react'

import { Input } from '@/components/UIKit/Input'
import { Field, Label } from '@/components/UIKit/Fieldset'
import { Button } from '@/components/UIKit/Button'

type ParentData = {
    guardianName: string;
    guardianRelationship: string;
    guardianEmail: string;
    guardianPhone: string;
}

interface ParentTabProps {
    parentData: ParentData
    setParentData: Dispatch<SetStateAction<ParentData>>
}

const ParentTab = ({ parentData, setParentData }: ParentTabProps) => {
    const handleSaveParent = () => {
        // Save personal data
        console.log('Saving parent data:', parentData)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Parent/Guardian Information</h3>
                <Button color="primary" onClick={handleSaveParent}>
                    Save Changes
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field>
                    <Label>Guardian Name</Label>
                    <Input
                        value={parentData.guardianName}
                        onChange={(e) => setParentData(prev => ({ ...prev, guardianName: e.target.value }))}
                    />
                </Field>
                <Field>
                    <Label>Relationship</Label>
                    <Input
                        value={parentData.guardianRelationship}
                        onChange={(e) => setParentData(prev => ({ ...prev, guardianRelationship: e.target.value }))}
                    />
                </Field>
                <Field>
                    <Label>Guardian Email</Label>
                    <Input
                        type="email"
                        value={parentData.guardianEmail}
                        onChange={(e) => setParentData(prev => ({ ...prev, guardianEmail: e.target.value }))}
                    />
                </Field>
                <Field>
                    <Label>Guardian Phone</Label>
                    <Input
                        type="tel"
                        value={parentData.guardianPhone}
                        onChange={(e) => setParentData(prev => ({ ...prev, guardianPhone: e.target.value }))}
                    />
                </Field>
            </div>
        </div>
    )
}

export default ParentTab