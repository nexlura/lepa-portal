'use client';

import { Dialog, DialogBody, DialogTitle, DialogActions } from '@/components/UIKit/Dialog';
import { Button } from '@/components/UIKit/Button';
import { Agency } from '@/app/(portal)/system-admin/agencies/page';

interface AgencyDetailsModalProps {
    open: boolean;
    onClose: () => void;
    agency: Agency | null;
    onEdit: (agency: Agency) => void;
}

const AgencyDetailsModal = ({ open, onClose, agency, onEdit }: AgencyDetailsModalProps) => {
    if (!agency) return null;

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        } catch {
            return dateString;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'suspended':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleEdit = () => {
        onClose();
        onEdit(agency);
    };

    return (
        <Dialog size="lg" open={open} onClose={onClose} className="relative z-20">
            <DialogTitle>Agency Details</DialogTitle>
            <DialogBody>
                <div className="space-y-6">
                    {/* Agency Name */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{agency.name}</h3>
                        {agency.domain && agency.domain !== 'N/A' && (
                            <p className="mt-1 text-sm text-gray-500">{agency.domain}</p>
                        )}
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Domain</dt>
                            <dd className="mt-1 text-sm text-gray-900">{agency.domain || 'N/A'}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Type</dt>
                            <dd className="mt-1">
                                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                    {agency.type}
                                </span>
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</dt>
                            <dd className="mt-1">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(agency.status)}`}>
                                    {agency.status}
                                </span>
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Schools Managed</dt>
                            <dd className="mt-1 text-sm text-gray-900">{agency.tenantCount}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Email</dt>
                            <dd className="mt-1 text-sm text-gray-900">{agency.contactEmail !== 'N/A' ? agency.contactEmail : '-'}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Region</dt>
                            <dd className="mt-1 text-sm text-gray-900">{agency.region !== 'N/A' ? agency.region : '-'}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</dt>
                            <dd className="mt-1 text-sm text-gray-900">{formatDate(agency.createdAt)}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Agency ID</dt>
                            <dd className="mt-1 text-sm text-gray-500 font-mono">{agency.id}</dd>
                        </div>
                    </div>
                </div>
            </DialogBody>
            <DialogActions>
                <Button onClick={onClose}>
                    Close
                </Button>
                <Button color="primary" onClick={handleEdit}>
                    Edit Agency
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AgencyDetailsModal;

