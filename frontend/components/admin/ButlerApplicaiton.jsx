'use client'
import React, { useState } from 'react'
import DashNav from '../Dashboard/DashNav/DashNav'
import { useButlerApplicationQuery } from '@/features/auth';
import toast, { Toaster } from 'react-hot-toast';
import { useActiveButlerMutation, useRejectButlerMutation } from '@/features/butler';

// Application Details Modal Component
const ApplicationDetailsModal = ({ application, isOpen, onClose }) => {
  if (!isOpen) return null;






  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-800">Application Details</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h4 className="text-lg font-medium text-gray-800 mb-4">Personal Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Full Name</label>
                <p className="text-gray-900 font-medium">
                  {application?.firstName} {application?.lastName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-gray-900">{application?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Phone</label>
                <p className="text-gray-900">{application?.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                <p className="text-gray-900">
                  {application?.dob ? new Date(application.dob).toLocaleDateString() : "N/A"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Gender</label>
                <p className="text-gray-900 capitalize">{application?.gender}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Application Status</label>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-600">
                  Pending
                </span>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div>
            <h4 className="text-lg font-medium text-gray-800 mb-4">Location Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Location</label>
                <p className="text-gray-900">{application?.location}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Postcode</label>
                <p className="text-gray-900">{application?.postcode}</p>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div>
            <h4 className="text-lg font-medium text-gray-800 mb-4">Profile Information</h4>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Bio</label>
                <p className="text-gray-900 mt-1">{application?.bio}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Profile Image</label>
                <div className="mt-2">
                  <img 
                    src={application?.profileImage || application?.image} 
                    alt="Profile" 
                    className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div>
            <h4 className="text-lg font-medium text-gray-800 mb-4">Account Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Role</label>
                <p className="text-gray-900 capitalize">{application?.role}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Verified</label>
                <p className="text-gray-900">{application?.isVerified ? "Yes" : "No"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Auth Provider</label>
                <p className="text-gray-900 capitalize">{application?.authProvider}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Member Since</label>
                <p className="text-gray-900">
                  {application?.createdAt ? new Date(application.createdAt).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#FF006A] text-white rounded-full font-medium hover:bg-[#e5005f] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Accept Confirmation Modal Component
const AcceptConfirmationModal = ({ application, isOpen, onClose, onAccept }) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleAccept = async () => {
    setIsLoading(true);
    await onAccept(application?._id, application?.email);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-800">Accept Application</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            disabled={isLoading}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h4 className="text-lg font-medium text-gray-800 mb-2">Confirm Acceptance</h4>
            <p className="text-gray-600 mb-4">
              Are you sure you want to accept the butler application for <strong>{application?.firstName} {application?.lastName}</strong>?
            </p>
            <p className="text-sm text-gray-500">
              This action will grant butler privileges to this user.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleAccept}
            disabled={isLoading}
            className="px-6 py-2 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              'Accept Application'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Reject Confirmation Modal Component
const RejectConfirmationModal = ({ application, isOpen, onClose, onReject }) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleReject = async () => {
    setIsLoading(true);
    await onReject(application?._id, application?.email);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-800">Reject Application</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            disabled={isLoading}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h4 className="text-lg font-medium text-gray-800 mb-2">Confirm Rejection</h4>
            <p className="text-gray-600 mb-4">
              Are you sure you want to reject the butler application for <strong>{application?.firstName} {application?.lastName}</strong>?
            </p>
            <p className="text-sm text-gray-500">
              This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleReject}
            disabled={isLoading}
            className="px-6 py-2 bg-red-600 text-white rounded-full font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              'Reject Application'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ButlerApplication() {
  const { data, isLoading, error, refetch } = useButlerApplicationQuery();
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  
  const [activeButler, {isLoading:loader, error:updateError}] = useActiveButlerMutation()
  const [rejectButler, {isLoading:Loading, error:rejectError}] = useRejectButlerMutation();

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setDetailsModalOpen(true);
  };

  const handleAcceptApplication = async(application) => {
    setSelectedApplication(application);
    setAcceptModalOpen(true);
  };

  const handleRejectApplication = (application) => {
    setSelectedApplication(application);
    setRejectModalOpen(true);
  };

  const handleAcceptConfirm = async (id, email) => {


    try {
      await activeButler(email).unwrap();
      toast.success('Success');
      refetch();

      
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message)
    }
    
    // Here you would typically make an API call to accept the application
 
    
    // Close the modal
    setAcceptModalOpen(false);
    
    // You might want to refetch the applications list here
    // refetch();
  };

  const handleRejectConfirm = async (id, email) => {
 
    
try {

  await rejectButler(email).unwrap();
  toast.success('Success')
   setRejectModalOpen(false);
   refetch()
  
} catch (error) {
  toast.error(error?.data?.message)
}
   
    
    // You might want to refetch the applications list here
    // refetch();
  };

  const closeModals = () => {
    setDetailsModalOpen(false);
    setAcceptModalOpen(false);
    setRejectModalOpen(false);
    setSelectedApplication(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <div>
        <DashNav />
        <div className="bg-white rounded-xl shadow-md p-6 mt-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Loading applications...</div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div>
        <DashNav />
        <div className="bg-white rounded-xl shadow-md p-6 mt-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-red-600">Error loading applications</div>
          </div>
        </div>
      </div>
    );
  }

  const applications = data?.data || [];

  return (
    <div>
      <DashNav />
      <Toaster />
      
      <div className="bg-white rounded-xl shadow-md p-6 mt-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between pb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 md:mb-0">
            Butler Applications ({applications.length})
          </h2>
        </div>

        {/* Applications Table */}
        <div className="overflow-x-scroll max-w-[76vw] ">
          <table className="w-full overflow-x-scroll text-left border-collapse">
            <thead>
              <tr className="text-gray-700 border-b text-base">
                <th className="p-4 font-medium">Applicant</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Phone</th>
                <th className="p-4 font-medium">Location</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Applied On</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr key={application._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={application.profileImage || application.image} 
                        alt={application.firstName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {application.firstName} {application.lastName}
                        </p>
                        <p className="text-sm text-gray-500 capitalize">{application.gender}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-gray-900">{application.email}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-gray-900">{application.phone}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-gray-900">{application.location}</p>
                    <p className="text-sm text-gray-500">{application.postcode}</p>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-600">
                      Pending
                    </span>
                  </td>
                  <td className="p-4">
                    <p className="text-gray-900">
                      {application.createdAt ? new Date(application.createdAt).toLocaleDateString() : "N/A"}
                    </p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetails(application)}
                        className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleAcceptApplication(application)}
                        className="px-3 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-sm"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRejectApplication(application)}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors text-sm"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {applications.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">No pending applications found</div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ApplicationDetailsModal
        application={selectedApplication}
        isOpen={detailsModalOpen}
        onClose={closeModals}
      />

      <AcceptConfirmationModal
        application={selectedApplication}
        isOpen={acceptModalOpen}
        onClose={closeModals}
        onAccept={handleAcceptConfirm}
      />

      <RejectConfirmationModal
        application={selectedApplication}
        isOpen={rejectModalOpen}
        onClose={closeModals}
        onReject={handleRejectConfirm}
      />
    </div>
  );
}