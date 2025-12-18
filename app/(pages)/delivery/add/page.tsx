"use client";

import { Upload, ArrowLeft, X } from "lucide-react";
import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface DriverForm {
  profilePhoto: File | null;
  profilePhotoPreview: string;
  name: string;
  mobileNumber: string;
  aadharOrPan: string;
  vehicleLicense: File | null;
  vehicleLicensePreview: string;
  vehicleInsurance: File | null;
  vehicleInsurancePreview: string;
  vehicleRC: File | null;
  vehicleRCPreview: string;
  vehicleNumber: string;
}

export default function AddDriverPage() {
  const router = useRouter();
  const profilePhotoRef = useRef<HTMLInputElement>(null);
  const vehicleLicenseRef = useRef<HTMLInputElement>(null);
  const vehicleInsuranceRef = useRef<HTMLInputElement>(null);
  const vehicleRCRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<DriverForm>({
    profilePhoto: null,
    profilePhotoPreview: "",
    name: "",
    mobileNumber: "",
    aadharOrPan: "",
    vehicleLicense: null,
    vehicleLicensePreview: "",
    vehicleInsurance: null,
    vehicleInsurancePreview: "",
    vehicleRC: null,
    vehicleRCPreview: "",
    vehicleNumber: "",
  });

  const handleInputChange = (field: keyof DriverForm, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFileChange = (
    field: "profilePhoto" | "vehicleLicense" | "vehicleInsurance" | "vehicleRC",
    file: File | null
  ) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          [field]: file,
          [`${field}Preview`]: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = (
    field: "profilePhoto" | "vehicleLicense" | "vehicleInsurance" | "vehicleRC"
  ) => {
    setFormData({
      ...formData,
      [field]: null,
      [`${field}Preview`]: "",
    });
  };

  const handleSave = () => {
    // Create FormData for file upload
    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("mobileNumber", formData.mobileNumber);
    submitData.append("aadharOrPan", formData.aadharOrPan);
    submitData.append("vehicleNumber", formData.vehicleNumber);

    if (formData.profilePhoto) {
      submitData.append("profilePhoto", formData.profilePhoto);
    }
    if (formData.vehicleLicense) {
      submitData.append("vehicleLicense", formData.vehicleLicense);
    }
    if (formData.vehicleInsurance) {
      submitData.append("vehicleInsurance", formData.vehicleInsurance);
    }
    if (formData.vehicleRC) {
      submitData.append("vehicleRC", formData.vehicleRC);
    }

    // Add your save logic here
    console.log("Driver data:", formData);
    // Navigate back to delivery management page
    router.push("/delivery");
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 hover:bg-[#ffce52]  px-3 py-2 rounded text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft size={16} />
          <span className="text-xs">Back to Delivery Management</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Add Driver</h1>
        <p className="text-gray-600 text-sm">
          Add new driver details for delivery assignments
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-8 ">
        <div className="space-y-8">
          {/* Profile Photo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Profile Photo <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-6">
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200 relative bg-gray-100 flex items-center justify-center">
                {formData.profilePhotoPreview ? (
                  <Image
                    src={formData.profilePhotoPreview}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <Upload className="text-gray-400" size={32} />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <input
                  ref={profilePhotoRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleFileChange(
                      "profilePhoto",
                      e.target.files?.[0] || null
                    )
                  }
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => profilePhotoRef.current?.click()}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Choose File
                </button>
                {formData.profilePhoto && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">
                      {formData.profilePhoto.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile("profilePhoto")}
                      className="text-red-500 flex gap-1 justify-center items-center hover:text-red-700"
                    >
                      <p className="text-xs">Remove file</p>
                      <X size={14} />
                    </button>
                  </div>
                )}
                <p className="text-xs text-gray-500">
                  Upload a profile photo (JPG, PNG, max 5MB)
                </p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter driver's full name"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.mobileNumber}
                onChange={(e) =>
                  handleInputChange("mobileNumber", e.target.value)
                }
                placeholder="+91 XXXXX XXXXX"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aadhar or PAN Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.aadharOrPan}
                onChange={(e) =>
                  handleInputChange("aadharOrPan", e.target.value)
                }
                placeholder="Enter Aadhar or PAN number"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.vehicleNumber}
                onChange={(e) =>
                  handleInputChange("vehicleNumber", e.target.value)
                }
                placeholder="KA-01-AB-1234"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Vehicle Documents */}
          <div>
            <h3 className="text-lg font-semibold  text-gray-900 mb-4">
              Vehicle Documents
            </h3>
            <div className="grid grid-cols-2 gap-6">
              {/* Vehicle License */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle License <span className="text-red-500">*</span>
                </label>
                <div className="flex items-start gap-4">
                  {formData.vehicleLicensePreview && (
                    <div className="w-40 h-28 rounded-lg overflow-hidden border border-gray-200 relative bg-gray-100">
                      <Image
                        src={formData.vehicleLicensePreview}
                        alt="Vehicle License"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      ref={vehicleLicenseRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileChange(
                          "vehicleLicense",
                          e.target.files?.[0] || null
                        )
                      }
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => vehicleLicenseRef.current?.click()}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium mb-2"
                    >
                      Choose File
                    </button>
                    {formData.vehicleLicense && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-600">
                          {formData.vehicleLicense.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile("vehicleLicense")}
                          className="text-red-500 flex gap-1 justify-center items-center hover:text-red-700"
                        >
                          <p className="text-xs">Remove file</p>
                          <X size={14} />
                        </button>
                      </div>
                    )}
                    <p className="text-xs text-gray-500">
                      Upload scanned copy of vehicle license
                    </p>
                  </div>
                </div>
              </div>

              {/* Vehicle Insurance */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Insurance <span className="text-red-500">*</span>
                </label>
                <div className="flex items-start gap-4">
                  {formData.vehicleInsurancePreview && (
                    <div className="w-40 h-28 rounded-lg overflow-hidden border border-gray-200 relative bg-gray-100">
                      <Image
                        src={formData.vehicleInsurancePreview}
                        alt="Vehicle Insurance"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      ref={vehicleInsuranceRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileChange(
                          "vehicleInsurance",
                          e.target.files?.[0] || null
                        )
                      }
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => vehicleInsuranceRef.current?.click()}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium mb-2"
                    >
                      Choose File
                    </button>
                    {formData.vehicleInsurance && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-600">
                          {formData.vehicleInsurance.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile("vehicleInsurance")}
                          className="text-red-500 flex gap-1 justify-center items-center hover:text-red-700"
                        >
                          <p className="text-xs">Remove file</p>
                          <X size={14} />
                        </button>
                      </div>
                    )}
                    <p className="text-xs text-gray-500">
                      Upload scanned copy of vehicle insurance
                    </p>
                  </div>
                </div>
              </div>

              {/* Vehicle RC */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle RC <span className="text-red-500">*</span>
                </label>
                <div className="flex items-start gap-4">
                  {formData.vehicleRCPreview && (
                    <div className="w-40 h-28 rounded-lg overflow-hidden border border-gray-200 relative bg-gray-100">
                      <Image
                        src={formData.vehicleRCPreview}
                        alt="Vehicle RC"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      ref={vehicleRCRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileChange(
                          "vehicleRC",
                          e.target.files?.[0] || null
                        )
                      }
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => vehicleRCRef.current?.click()}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium mb-2"
                    >
                      Choose File
                    </button>
                    {formData.vehicleRC && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-600">
                          {formData.vehicleRC.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile("vehicleRC")}
                          className="text-red-500 flex gap-1 justify-center items-center hover:text-red-700"
                        >
                          <p className="text-xs">Remove file</p>
                          <X size={14} />
                        </button>
                      </div>
                    )}
                    <p className="text-xs text-gray-500">
                      Upload scanned copy of vehicle RC (Registration
                      Certificate)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={() => router.back()}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-[#2196F3] text-white rounded-lg hover:bg-[#1976D2] transition-colors font-medium"
            >
              Save Driver Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
