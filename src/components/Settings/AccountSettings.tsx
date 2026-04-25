'use client';

import { useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { isErrorResponse, patchModel } from '@/lib/connector';
import { Button } from '@/components/UIKit/Button';

type AccountSettingsProps = {
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

export default function AccountSettings({
  userId,
  initialName,
  initialEmail,
}: AccountSettingsProps) {
  const { update } = useSession();
  const nameParts = useMemo(() => splitName(initialName), [initialName]);

  const [firstName, setFirstName] = useState(nameParts.firstName);
  const [lastName, setLastName] = useState(nameParts.lastName);
  const [email, setEmail] = useState(initialEmail || '');
  const [phone, setPhone] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [securityError, setSecurityError] = useState<string | null>(null);
  const [securitySuccess, setSecuritySuccess] = useState<string | null>(null);
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [isSecuritySaving, setIsSecuritySaving] = useState(false);

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

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);

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
      if (phone.trim()) {
        payload.phone = phone.trim();
      }

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

  const handleSecuritySave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityError(null);
    setSecuritySuccess(null);

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

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900">Profile Settings</h2>
        <p className="mt-1 text-sm text-gray-500">
          Update your account profile and contact details.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleProfileSave}>
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First name
            </label>
            <input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last name
            </label>
            <input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 6281234567890"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
            />
          </div>

          {profileError && <p className="text-sm text-red-600">{profileError}</p>}
          {profileSuccess && <p className="text-sm text-green-600">{profileSuccess}</p>}

          <Button type="submit" color="primary" disabled={isProfileSaving}>
            {isProfileSaving ? 'Saving profile...' : 'Save profile'}
          </Button>
        </form>
      </section>

      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900">Security Settings</h2>
        <p className="mt-1 text-sm text-gray-500">
          Change your account password.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSecuritySave}>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              New password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
              minLength={6}
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
              minLength={6}
              required
            />
          </div>

          {securityError && <p className="text-sm text-red-600">{securityError}</p>}
          {securitySuccess && <p className="text-sm text-green-600">{securitySuccess}</p>}

          <Button type="submit" color="primary" disabled={isSecuritySaving}>
            {isSecuritySaving ? 'Updating password...' : 'Update password'}
          </Button>
        </form>
      </section>
    </div>
  );
}
