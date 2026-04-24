'use client';

import { Dialog, DialogBody, DialogTitle, DialogActions } from '@/components/UIKit/Dialog';
import { Button } from '@/components/UIKit/Button';
import type { Permission } from '@/lib/rbac';

interface PermissionDetailsModalProps {
    open: boolean;
    onClose: () => void;
    permission: Permission | null;
}

const PermissionDetailsModal = ({ open, onClose, permission }: PermissionDetailsModalProps) => {
    if (!permission) return null;

    return (
        <Dialog size="lg" open={open} onClose={onClose} className="relative z-20">
            <DialogTitle>Permission Details</DialogTitle>
            <DialogBody>
                <div className="mt-4 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <div className="text-xs text-gray-500 mb-1">Name</div>
                            <div className="text-sm font-medium text-gray-900">
                                {permission.name || 'N/A'}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 mb-1">Code</div>
                            <div className="text-sm text-gray-900">
                                {permission.code || 'N/A'}
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <div className="text-xs text-gray-500 mb-1">Description</div>
                            <div className="text-sm text-gray-900">
                                {permission.description || 'No description'}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 mb-1">Resource</div>
                            <div className="text-sm text-gray-900">
                                {permission.resource || 'N/A'}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 mb-1">Action</div>
                            <div className="text-sm text-gray-900">
                                {permission.action || 'N/A'}
                            </div>
                        </div>
                    </div>
                </div>
            </DialogBody>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default PermissionDetailsModal;

