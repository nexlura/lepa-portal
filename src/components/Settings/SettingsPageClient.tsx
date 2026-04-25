'use client';

import { useMemo, useState } from 'react';
import { BellIcon, Cog6ToothIcon, EyeIcon, EyeSlashIcon, ShieldCheckIcon, UserIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/UIKit/Dialog';
import { Button } from '@/components/UIKit/Button';
import { isErrorResponse, patchModel } from '@/lib/connector';

type SettingsPageClientProps = {
  userId: string;
  initialName?: string | null;
  initialEmail?: string | null;
};

type UpdateResponse = {
  success?: boolean;
  message?: string;
};

const splitName = (name?: string | null) => {
  const safeName = (name || '').trim();
  if (!safeName) return { firstName: '', lastName: '' };
  const parts = safeName.split(/\s+/);
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' '),
  };
};

export default function SettingsPageClient({
  userId,
  initialName,
  initialEmail,
}: SettingsPageClientProps) {
  const { update } = useSession();
  const nameParts = useMemo(() => splitName(initialName), [initialName]);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);

  const [firstName, setFirstName] = useState(nameParts.firstName);
  const [lastName, setLastName] = useState(nameParts.lastName);
  const [email, setEmail] = useState(initialEmail || '');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [securityError, setSecurityError] = useState<string | null>(null);
  const [securitySuccess, setSecuritySuccess] = useState<string | null>(null);
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [isSecuritySaving, setIsSecuritySaving] = useState(false);

  const resetProfileFeedback = () => {
    setProfileError(null);
    setProfileSuccess(null);
  };
  const resetSecurityFeedback = () => {
    setSecurityError(null);
    setSecuritySuccess(null);
  };

  const validateProfile = () => {
    if (firstName.trim().length < 2 || firstName.trim().length > 50) {
      return 'First name must be between 2 and 50 characters.';
    }
    if (lastName.trim().length < 2 || lastName.trim().length > 50) {
      return 'Last name must be between 2 and 50 characters.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return 'Please enter a valid email address.';
    }
    if (phone.trim().length > 0 && (phone.trim().length < 10 || phone.trim().length > 15)) {
      return 'Phone number must be between 10 and 15 characters.';
    }
    return null;
  };

  const saveProfile = async () => {
    resetProfileFeedback();
    const validationError = validateProfile();
    if (validationError) {
      setProfileError(validationError);
      return;
    }

    setIsProfileSaving(true);
    try {
      const payload: Record<string, string> = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
      };
      if (phone.trim()) payload.phone = phone.trim();

      const response = await patchModel<UpdateResponse>(`/users/${userId}`, payload);
      if (!response || isErrorResponse(response)) {
        setProfileError(
          (response && isErrorResponse(response) ? response.message : null) ||
            'Unable to update profile settings.'
        );
        return;
      }

      await update({
        name: `${firstName.trim()} ${lastName.trim()}`.trim(),
        email: email.trim(),
      });
      setProfileSuccess('Profile updated successfully.');
    } catch {
      setProfileError('Unable to update profile settings.');
    } finally {
      setIsProfileSaving(false);
    }
  };

  const saveSecurity = async () => {
    resetSecurityFeedback();

    if (password.length < 6) {
      setSecurityError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setSecurityError('Password confirmation does not match.');
      return;
    }

    setIsSecuritySaving(true);
    try {
      const response = await patchModel<UpdateResponse>(`/users/${userId}`, { password });
      if (!response || isErrorResponse(response)) {
        setSecurityError(
          (response && isErrorResponse(response) ? response.message : null) ||
            'Unable to update password.'
        );
        return;
      }

      setPassword('');
      setConfirmPassword('');
      setSecuritySuccess('Password updated successfully.');
    } catch {
      setSecurityError('Unable to update password.');
    } finally {
      setIsSecuritySaving(false);
    }
  };

  const openProfileModal = () => {
    resetProfileFeedback();
    setIsProfileOpen(true);
  };
  const openSecurityModal = () => {
    resetSecurityFeedback();
    setIsSecurityOpen(true);
  };

  const settingsSections = [
    {
      id: 'profile',
      name: 'Profile Settings',
      description: 'Manage your account profile and personal information',
      icon: UserIcon,
      action: openProfileModal,
    },
    {
      id: 'notifications',
      name: 'Notification Preferences',
      description: 'Configure how you receive notifications and alerts',
      icon: BellIcon,
      action: undefined,
    },
    {
      id: 'security',
      name: 'Security Settings',
      description: 'Manage your password and security preferences',
      icon: ShieldCheckIcon,
      action: openSecurityModal,
    },
    {
      id: 'system',
      name: 'System Settings',
      description: 'Configure system-wide settings and preferences',
      icon: Cog6ToothIcon,
      action: undefined,
    },
  ];

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your account settings and preferences.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {settingsSections.map((section) => (
            <div
              key={section.id}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <section.icon className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{section.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{section.description}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={section.action}
                    disabled={!section.action}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Configure
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      <Dialog size="2xl" open={isProfileOpen} onClose={setIsProfileOpen}>
        <DialogTitle>Profile Settings</DialogTitle>
        <DialogDescription>Update your account profile and personal information.</DialogDescription>
        <DialogBody>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              void saveProfile();
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="profile-first-name" className="block text-sm font-medium text-gray-700">
                  First name
                </label>
                <input
                  id="profile-first-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label htmlFor="profile-last-name" className="block text-sm font-medium text-gray-700">
                  Last name
                </label>
                <input
                  id="profile-last-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="profile-email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="profile-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label htmlFor="profile-phone" className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                id="profile-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 6281234567890"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
              />
            </div>
            {profileError && <p className="text-sm text-red-600">{profileError}</p>}
            {profileSuccess && <p className="text-sm text-green-600">{profileSuccess}</p>}
          </form>
        </DialogBody>
        <DialogActions>
          <Button onClick={() => setIsProfileOpen(false)} disabled={isProfileSaving}>
            Cancel
          </Button>
          <Button color="primary" onClick={() => void saveProfile()} disabled={isProfileSaving}>
            {isProfileSaving ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog size="lg" open={isSecurityOpen} onClose={setIsSecurityOpen}>
        <DialogTitle>Security Settings</DialogTitle>
        <DialogDescription>Change your account password.</DialogDescription>
        <DialogBody>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              void saveSecurity();
            }}
          >
            <div>
              <label htmlFor="security-password" className="block text-sm font-medium text-gray-700">
                New password
              </label>
              <div className="mt-1 relative">
                <input
                  id="security-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-primary-500 focus:outline-none"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="security-confirm-password" className="block text-sm font-medium text-gray-700">
                Confirm password
              </label>
              <div className="mt-1 relative">
                <input
                  id="security-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-primary-500 focus:outline-none"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                  aria-label={showConfirmPassword ? 'Hide password confirmation' : 'Show password confirmation'}
                >
                  {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>
            {securityError && <p className="text-sm text-red-600">{securityError}</p>}
            {securitySuccess && <p className="text-sm text-green-600">{securitySuccess}</p>}
          </form>
        </DialogBody>
        <DialogActions>
          <Button onClick={() => setIsSecurityOpen(false)} disabled={isSecuritySaving}>
            Cancel
          </Button>
          <Button color="primary" onClick={() => void saveSecurity()} disabled={isSecuritySaving}>
            {isSecuritySaving ? 'Updating...' : 'Update password'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
