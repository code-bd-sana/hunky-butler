'use client'
import React, { useState } from 'react'
import DashNav from '../Dashboard/DashNav/DashNav'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import logo from "@/public/logo/logo.png";
import { FaChevronLeft, FaEdit, FaPhone, FaUnlockAlt, FaUser, FaEnvelope, FaCalendarAlt, FaUserCircle } from 'react-icons/fa'
import { useChangePasswordMutation, useMyProfileQuery, useUpdateMyProfileMutation } from '@/features/auth'
import { uploadToImgBB } from '@/utils/utils'
import toast, { Toaster } from 'react-hot-toast'

export default function Profile() {
  const { data } = useSession();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [imgbbLoader, setImgbbLoader ] = useState(false)


const [updateMyProfile, {isLoading, error}] = useUpdateMyProfileMutation();



  console.log(data?.user, "user is here")
  const user = data?.user;
  console.log(user, "Joy Bangla Joy Bangabandhu");

  const { data:profile, refetch} = useMyProfileQuery(user?.id);
  console.log(profile, "Eta tomar profile")
  const [changePassword, {isLoading:changeLoading, error:changePasswordError}] = useChangePasswordMutation()
  console.log(profile, "mama barir abdar");
  const [up] = useUpdateMyProfileMutation()
  
  // Mock user data - in real app this would come from your backend
  const [userData, setUserData] = useState({
    firstName: profile?.data?.firstName ,
    lastName: profile?.data?.lastName ,
    email: profile?.data?.email,
    phone: profile?.data?.phone,
    createdAt: profile?.data?.createdAt ,
    profileImage: "/default-avatar.png",
    role: "butler",
    location: profile?.data?.location ,
    postcode: profile?.data?.postcode,
    dob: profile?.data?.dob,
    gender: profile?.data?.gender ,
    bio: profile?.data?.bio 
  });

  const [formData, setFormData] = useState({ ...userData });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [applicationData, setApplicationData] = useState({
    firstName: profile?.data?.firstName,
    lastName: profile?.data?.lastName,
    email:profile?.data?.email,
    bio: profile?.data?.bio,
    isButler: 'pending',
    email: user?.email


   
   
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApplicationChange = (e) => {
    const { name, value } = e.target;
    setApplicationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = async(e) => {
    try {

      setImgbbLoader(true)
    e.preventDefault();
   
    const image = await uploadToImgBB(formData?.image);
    console.log(image, "Image upload hoise ni re???")


    if(!image){
      formData.image = profile?.data?.image
    }
    else{
    formData.image = image
    }




    formData.email = user?.email

     console.log("Profile data submitted:", formData);
   
    setUserData(formData);
    // setIsEditModalOpen(false);
    const resp = await updateMyProfile(formData).unwrap();
    toast.success('Profile update sucessfully');
      setImgbbLoader(false)
    refetch();
    console.log(resp, "kire hoisto")
      
    } catch (error) {
      setImgbbLoader(false)
      toast.error(error?.message || 'Something went wrong!');
      console.log(error, "Tor ki somossa???")
    }
  };

  const handlePasswordSubmit = async(e) => {
    e.preventDefault();
    console.log("Password change submitted:", passwordData);
    setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    try {

    passwordData.email = user?.email

       await  changePassword(passwordData).unwrap();
       toast.success('Password change successfully')
      
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong!")
      console.log(error?.data?.message)
    }
  };

  const handleApplicationSubmit = async(e) => {
    e.preventDefault();
    console.log("Application submitted:", applicationData);
    applicationData.email = user?.email
    const resp = await updateMyProfile(applicationData);
    console.log(resp, 'Response is done hea hea hea hea hea hea ')
    refetch();
    toast.success('Applicaiton submitted')
    setIsApplicationModalOpen(false);
    try {
      
    } catch (error) {
      toast.error(error?.data?.message || 'Something went wrong please try again later!')
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          profileImage: e.target.result,
          image:file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashNav />
      <Toaster/>
      
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#424242]">Profile Management</h1>
              <p className="text-[#666] mt-1">Manage your account settings and preferences</p>
            </div>
            <button
              onClick={() => {
                setFormData(userData);
                setIsEditModalOpen(true);
              }}
              className="bg-[#FF006A] text-white px-6 cursor-pointer py-3 rounded-full font-medium flex items-center gap-2 hover:bg-[#e5005f] transition-colors"
            >
              <FaEdit/>
              Edit Profile
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-3xl shadow-sm p-6">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-3 rounded-xl cursor-pointer transition-colors ${
                    activeTab === 'profile' 
                      ? 'bg-[#FF006A] text-white' 
                      : 'text-[#424242] hover:bg-gray-100'
                  }`}
                >
                  Profile Information
                </button>
                <button
                  onClick={() => setActiveTab('password')}
                  className={`w-full text-left px-4 py-3 cursor-pointer rounded-xl transition-colors ${
                    activeTab === 'password' 
                      ? 'bg-[#FF006A] text-white' 
                      : 'text-[#424242] hover:bg-gray-100'
                  }`}
                >
                  Change Password
                </button>
                {user?.role === 'butler' && (
                  <button
                    onClick={() => setActiveTab('professional')}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                      activeTab === 'professional' 
                        ? 'bg-[#FF006A] text-white' 
                        : 'text-[#424242] hover:bg-gray-100'
                    }`}
                  >
                    Professional Info
                  </button>
                )}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Profile Information */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-[#424242] mb-6">Profile Information</h2>
                
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Profile Image */}
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                     { profile?.data?.image ? <Image 
                       src={profile?.data?.image || formData?.profileImage} 
                        alt="Profile" 
                        width={128} 
                        height={128} 
                        className="w-full h-full object-cover"
                      /> : <FaUserCircle  className='text-4xl'/>}
                    </div>
                  </div>

                  {/* Profile Details */}
                  <div className="flex-1 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <FaUser className="text-[#FF006A]"/>
                        <div>
                          <p className="text-sm text-[#666]">Full Name</p>
                          <p className="font-medium text-[#424242]">{profile?.data?.firstName} {profile?.data?.lastName}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <FaEnvelope className="text-[#FF006A]"/>
                        <div>
                          <p className="text-sm text-[#666]">Email Address</p>
                          <p className="font-medium text-[#424242]">{profile?.data?.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <FaPhone className="text-[#FF006A]"/>
                        <div>
                          <p className="text-sm text-[#666]">Phone Number</p>
                          <p className="font-medium text-[#424242]">{profile?.data?.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <FaCalendarAlt className="text-[#FF006A]"/>
                        <div>
                          <p className="text-sm text-[#666]">Member Since</p>
                          <p className="font-medium text-[#424242]">  {profile?.data?.createdAt && new Date(profile?.data?.createdAt).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <FaUser className="text-[#FF006A]"/>
                        <div>
                          <p className="text-sm text-[#666]">Location</p>
                          <p className="font-medium text-[#424242]">{profile?.data?.location}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <FaUser className="text-[#FF006A]"/>
                        <div>
                          <p className="text-sm text-[#666]">Postcode</p>
                          <p className="font-medium text-[#424242]">{profile?.data?.postcode}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-[#666] mb-2">Account Role</p>
                      <span className="inline-block uppercase bg-[#FF006A] text-white px-3 py-1 rounded-full text-sm font-medium">
                        {profile?.data?.role}
                      </span>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-[#666] mb-2">Bio</p>
                      <p className="font-medium text-[#424242]">{profile?.data.bio}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Change Password */}
            {activeTab === 'password' && (
              <div className="bg-white rounded-3xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-[#424242] mb-6">Change Password</h2>
                
                <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
                  <div>
                    <label htmlFor="oldPassword" className="block text-sm font-medium text-[#424242] mb-2">
                      Old Password
                    </label>
                    <input
                      type="password"
                      id="oldPassword"
                      name="oldPassword"
                      value={passwordData.oldPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 border border-[#e5eaf2] rounded-xl outline-none transition-colors focus:border-[#FF006A]"
                      placeholder="Enter your old password"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-[#424242] mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 border border-[#e5eaf2] rounded-xl outline-none transition-colors focus:border-[#FF006A]"
                      placeholder="Enter your new password"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#424242] mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 border border-[#e5eaf2] rounded-xl outline-none transition-colors focus:border-[#FF006A]"
                      placeholder="Confirm your new password"
                      required
                    />
                  </div>

                  <button
                    type="submit" 
                    className="bg-[#FF006A] text-white px-6 cursor-pointer py-3 rounded-full font-medium flex items-center gap-2 hover:bg-[#e5005f] transition-colors"
                  >
                    <FaUnlockAlt/>
                    Update Password
                  </button>
                </form>
              </div>
            )}

            {/* Professional Information (Butler only) */}
{activeTab === "professional" && user?.role === "butler" && (
  <div className="bg-white rounded-3xl shadow-sm p-6">
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-xl font-bold text-[#424242]">Professional Information</h2>
        <p className="text-sm text-[#777] mt-1">Your Butler profile details and application status.</p>
      </div>

      <button
        onClick={() => setIsApplicationModalOpen(true)}
        className="bg-[#FF006A] text-white px-6 py-3 rounded-full font-medium hover:bg-[#e5005f] transition-colors"
      >
        {profile?.data?.isButler === "none" ? "Apply Now" : "Update Details"}
      </button>
    </div>

    {/* Application Status */}
    <div className="p-4 bg-gray-50 rounded-xl mb-6 flex items-center justify-between">
      <div>
        <p className="text-sm text-[#666]">Application Status</p>
        <p
          className={`inline-flex items-center gap-2 mt-1 px-3 py-1 rounded-full text-sm font-medium
            ${
              profile?.data?.isButler === "active"
                ? "bg-green-100 text-green-700"
                : profile?.data?.isButler === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-100 text-gray-600"
            }`}
        >
          {profile?.data?.isButler === "active"
            ? "Active"
            : profile?.data?.isButler === "pending"
            ? "Pending Approval"
            : "Not Applied"}
        </p>
      </div>

      {/* Optional small icon */}
      {profile?.data?.isButler === "active" && (
        <span className="text-green-600 text-lg font-semibold">●</span>
      )}
      {profile?.data?.isButler === "pending" && (
        <span className="text-yellow-600 text-lg font-semibold animate-pulse">●</span>
      )}
    </div>

    {/* Only show professional details if application exists */}
    {profile?.data?.isButler !== "none" && (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-[#666]">Full Name</p>
            <p className="font-medium text-[#424242]">{profile?.data?.firstName + " " + profile?.data?.lastName || "N/A"}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-[#666]">Postcode</p>
            <p className="font-medium text-[#424242]">{profile?.data?.postcode || "N/A"}</p>
          </div>
{/* 
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-[#666]">Services</p>
            <p className="font-medium text-[#424242]">
              {userData.services || "Not specified"}
            </p>
          </div> */}

          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-[#666]">Bank Info</p>
            <p className="font-medium text-[#424242]">
              {profile?.data?.bankInfo ? "•••• •••• ••••" : "Not provided"}
            </p>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-xl mt-4">
          <p className="text-sm text-[#666]">Bio</p>
          <p className="font-medium text-[#424242] whitespace-pre-line">
            {userData.bio || "N/A"}
          </p>
        </div>

        {userData.photo && (
          <div className="p-4 bg-gray-50 rounded-xl mt-4 flex items-center gap-4">
            <img
              src={userData.photo}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border"
            />
            <div>
              <p className="text-sm text-[#666]">Profile Photo</p>
              <p className="text-[#424242] text-sm">Uploaded</p>
            </div>
          </div>
        )}
      </>
    )}

    {/* If not yet applied */}
    {profile?.data?.isButler === "none" && (
      <div className="p-6 bg-gray-50 rounded-2xl text-center mt-6">
        <p className="text-[#555] text-sm mb-2">You haven’t applied as a Butler yet.</p>
        <button
          onClick={() => setIsApplicationModalOpen(true)}
          className="px-6 py-3 bg-[#FF006A] text-white rounded-full hover:bg-[#e5005f] transition-colors font-medium"
        >
          Submit Application
        </button>
      </div>
    )}
  </div>
)}


          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-[#424242] mb-6">Edit Profile</h3>
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              {/* Profile Image Upload */}
              <div className="flex flex-col items-center mb-4">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-3">
                  <Image 
                    src={ formData?.profileImage || profile?.data?.image } 
                    alt="Profile" 
                    width={96} 
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="profileImage"
                  className="text-[#FF006A] text-sm font-medium hover:text-[#e5005f] transition-colors cursor-pointer"
                >
                  Change Photo
                </label>
              </div>

              {/* Two Column Layout for Desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-[#424242] mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                
                    defaultValue={profile?.data?.firstName}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-[#e5eaf2] rounded-xl outline-none transition-colors focus:border-[#FF006A]"
                    placeholder="Enter your first name"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-[#424242] mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                     defaultValue={profile?.data?.lastName}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-[#e5eaf2] rounded-xl outline-none transition-colors focus:border-[#FF006A]"
                    placeholder="Enter your last name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-[#424242] mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                      defaultValue={profile?.data?.email}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-[#e5eaf2] rounded-xl outline-none transition-colors focus:border-[#FF006A]"
                    placeholder="Enter your email address"
                    readOnly
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-[#424242] mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                      defaultValue={profile?.data?.phone}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-[#e5eaf2] rounded-xl outline-none transition-colors focus:border-[#FF006A]"
                    placeholder="Enter your phone number"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-[#424242] mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    defaultValue={profile?.data?.location}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-[#e5eaf2] rounded-xl outline-none transition-colors focus:border-[#FF006A]"
                    placeholder="Enter your location"
                  />
                </div>

                {/* Postcode */}
                <div>
                  <label className="block text-sm font-medium text-[#424242] mb-2">Postcode</label>
                  <input
                    type="number"
                    name="postcode"
                     defaultValue={profile?.data?.postcode}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-[#e5eaf2] rounded-xl outline-none transition-colors focus:border-[#FF006A]"
                    placeholder="Enter your postcode"
                  />
                </div>
              </div>

              {/* Full Width Fields */}
              <div className="space-y-6">
                {/* Address */}
             

                {/* Date of Birth */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#424242] mb-2">Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                       defaultValue={profile?.data?.dob}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-[#e5eaf2] rounded-xl outline-none transition-colors focus:border-[#FF006A]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#424242] mb-2">Gender</label>
                    <select
                      name="gender"
                       defaultValue={profile?.data?.gender}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-[#e5eaf2] rounded-xl outline-none transition-colors focus:border-[#FF006A]"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-[#424242] mb-2">Bio</label>
                  <textarea
                    name="bio"
                     defaultValue={profile?.data?.bio}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-[#e5eaf2] rounded-xl outline-none transition-colors focus:border-[#FF006A] min-h-[100px]"
                    placeholder="Tell us about yourself"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 px-4 py-3 cursor-pointer border border-[#e5eaf2] text-[#424242] rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-[#FF006A] text-white cursor-pointer rounded-xl hover:bg-[#e5005f] transition-colors"
                >
                  {
                    isLoading || imgbbLoader ? 'Loading...' : "Save Changes"
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Application Modal */}
  {isApplicationModalOpen && (
  <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <h3 className="text-xl font-bold text-[#424242] mb-6">Butler Application Form</h3>
      <form onSubmit={handleApplicationSubmit} className="space-y-6">

        {/* Personal Details */}
        <div>
          <label className="block text-sm font-medium text-[#424242] mb-2">First Name</label>
          <input
            type="text"
            name="firstName"
            value={applicationData.firstName}
            onChange={handleApplicationChange}
            defaultValue={profile?.data?.firstName}
            placeholder="Enter your full name"
            className="w-full px-4 py-3 border border-[#e5eaf2] rounded-xl outline-none focus:border-[#FF006A]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#424242] mb-2">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={applicationData.lastName}
                       defaultValue={profile?.data?.lastName}
            onChange={handleApplicationChange}
            placeholder="Enter your full name"
            className="w-full px-4 py-3 border border-[#e5eaf2] rounded-xl outline-none focus:border-[#FF006A]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#424242] mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={profile?.data?.email}
            readOnly
            defaultValue={profile?.data?.email}
            onChange={handleApplicationChange}
            placeholder="Enter your email address"
            className="w-full px-4 py-3 border border-[#e5eaf2] rounded-xl outline-none focus:border-[#FF006A]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#424242] mb-2">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={applicationData.phone}
            defaultValue={profile?.data?.phone}
            onChange={handleApplicationChange}
            placeholder="e.g., +44 7123 456789"
            className="w-full px-4 py-3 border border-[#e5eaf2] rounded-xl outline-none focus:border-[#FF006A]"
          />
        </div>

        {/* Postcode */}
        <div>
          <label className="block text-sm font-medium text-[#424242] mb-2">Postcode</label>
          <input
            type="number"
            name="postcode"
            value={applicationData.postcode}
            defaultValue={profile?.data?.postcode}
            onChange={handleApplicationChange}
            placeholder="Enter your postcode"
            className="w-full px-4 py-3 border border-[#e5eaf2] rounded-xl outline-none focus:border-[#FF006A]"
          />
        </div>

        {/* Services */}
        {/* <div>
          <label className="block text-sm font-medium text-[#424242] mb-2">Services You Offer</label>
          <select
            name="services"
            value={applicationData.services}
            onChange={handleApplicationChange}
            className="w-full px-4 py-3 border border-[#e5eaf2] rounded-xl outline-none focus:border-[#FF006A]"
          >
            <option value="">Select services</option>
            <option value="buff-butlers">Buff Butlers</option>
            <option value="cleaning">Cleaning</option>
            <option value="hospitality">Hospitality</option>
            <option value="event-staff">Event Staff</option>
          </select>
        </div> */}

        {/* Bank Info */}
        <div>
          <label className="block text-sm font-medium text-[#424242] mb-2">Bank Account Info</label>
          <input
            type="text"
            name="bankInfo"
            value={profile?.data?.bankInfo}
            onChange={handleApplicationChange}
            placeholder="Account Number / IBAN"
            className="w-full px-4 py-3 border border-[#e5eaf2] rounded-xl outline-none focus:border-[#FF006A]"
          />
        </div>

        {/* Bio & Photo */}
        <div>
          <label className="block text-sm font-medium text-[#424242] mb-2">Short Bio</label>
          <textarea
            name="bio"
            value={profile?.data?.bio}
            onChange={handleApplicationChange}
            placeholder="Tell us a bit about yourself..."
            className="w-full px-4 py-3 border border-[#e5eaf2] rounded-xl outline-none focus:border-[#FF006A] min-h-[100px]"
          />
        </div>

        {/* <div>
          <label className="block text-sm font-medium text-[#424242] mb-2">Profile Photo</label>
          <input
            type="file"
            name="photo"
            accept="image/*"
            // onChange={handlePhotoUpload}
            className="w-full text-sm text-[#424242]"
          />
        </div> */}

        {/* Terms & Conditions */}
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            name="agreeTerms"
            checked={applicationData.agreeTerms}
            onChange={handleApplicationChange}
            className="mt-1"
          />
          <label className="text-sm text-[#424242]">
            I agree to the{" "}
            <a href="/terms" className="text-[#FF006A] hover:underline">
              Terms & Conditions
            </a>
            .
          </label>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => setIsApplicationModalOpen(false)}
            className="flex-1 px-4 py-3 border border-[#e5eaf2] text-[#424242] rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-3 bg-[#FF006A] text-white rounded-xl hover:bg-[#e5005f] transition-colors"
          >
          {isLoading ? "Loading..." :   "Submit Application"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  )
}

