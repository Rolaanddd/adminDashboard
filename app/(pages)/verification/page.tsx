"use client";

import { Phone, Mail, MapPin, X, Check } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

interface BusinessRequest {
  id: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  shopPhotos: string[];
  status: "pending" | "approved" | "rejected";
  profileImage: string;
}

export default function BusinessVerificationPage() {
  const [requests, setRequests] = useState<BusinessRequest[]>([
    {
      id: "1",
      companyName: "FreshCompany",
      contactPerson: "Jane Doe",
      phone: "+91 80882 50263",
      email: "jane@gmail.com",
      address: "Koramangala, Near Forum Mall, 560034",
      shopPhotos: [
        "/assets/shop-photo.png",
        "/assets/shop-photo.png",
        "/assets/shop-photo.png",
      ],
      status: "pending",
      profileImage: "/assets/profile.jpg",
    },
    {
      id: "2",
      companyName: "FreshCompany",
      contactPerson: "Jane Doe",
      phone: "+91 80882 50263",
      email: "jane@gmail.com",
      address: "Koramangala, Near Forum Mall, 560034",
      shopPhotos: [
        "/assets/shop-photo.png",
        "/assets/shop-photo.png",
        "/assets/shop-photo.png",
      ],
      status: "approved",
      profileImage: "/assets/profile.jpg",
    },
    {
      id: "3",
      companyName: "FreshCompany",
      contactPerson: "Jane Doe",
      phone: "+91 80882 50263",
      email: "jane@gmail.com",
      address: "Koramangala, Near Forum Mall, 560034",
      shopPhotos: [
        "/assets/shop-photo.png",
        "/assets/shop-photo.png",
        "/assets/shop-photo.png",
      ],
      status: "rejected",
      profileImage: "/assets/profile.jpg",
    },
  ]);

  const handleVerify = (id: string) => {
    setRequests(
      requests.map((req) =>
        req.id === id ? { ...req, status: "approved" as const } : req
      )
    );
  };

  const handleReject = (id: string) => {
    setRequests(
      requests.map((req) =>
        req.id === id ? { ...req, status: "rejected" as const } : req
      )
    );
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Business Verification
        </h1>
        <p className="text-gray-600 text-sm">
          Review and approve new business registration requests
        </p>
      </div>

      {/* Verification Cards */}
      <div className="space-y-5">
        {requests.map((request) => (
          <div
            key={request.id}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex gap-6 flex-1">
                {/* Profile Image */}
                <div className="w-24 h-24 rounded-full overflow-hidden relative">
                  <Image
                    src={request.profileImage}
                    alt={request.contactPerson}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Company Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-7">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {request.companyName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {request.contactPerson}
                      </p>
                    </div>
                    {/* Contact Details */}
                    <div className="grid grid-cols-2  gap-3 mb-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={16} className="text-gray-500" />
                        <span>{request.phone}</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <MapPin size={16} className="text-gray-500" />
                        <span>{request.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={16} className="text-gray-500" />
                        <span>{request.email}</span>
                      </div>
                    </div>

                    {/* Action Buttons or Status Badge */}
                    {request.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleReject(request.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-[#F44336] text-white rounded-lg hover:bg-[#D32F2F] transition-colors text-sm font-medium"
                        >
                          <X size={16} />
                          Reject
                        </button>
                        <button
                          onClick={() => handleVerify(request.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45A049] transition-colors text-sm font-medium"
                        >
                          <Check size={16} />
                          Verify
                        </button>
                      </div>
                    )}

                    {request.status === "approved" && (
                      <div className="px-4 py-2 bg-[#E8F5E9] text-[#2E7D32] rounded-lg text-sm font-medium">
                        Approved
                      </div>
                    )}

                    {request.status === "rejected" && (
                      <div className="px-4 py-2 bg-[#FFEBEE] text-[#C62828] rounded-lg text-sm font-medium">
                        Rejected
                      </div>
                    )}
                  </div>

                  {/* Shop Photos */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      Shop Photos
                    </p>
                    <div className="flex gap-3">
                      {request.shopPhotos.map((photo, index) => (
                        <div
                          key={index}
                          className="w-[100px] h-[75px] rounded-lg overflow-hidden border border-gray-200 relative"
                        >
                          <Image
                            src={photo}
                            alt={`Shop ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
