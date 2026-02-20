import React, { useState } from "react";
import http from "../../../api/http";
import { Building, X, MapPin, Search } from "lucide-react";

const AddWarehouseModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    warehouse_name: "",
    warehouse_code: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
    capacity_sqft: "",
    timezone: "Asia/Kolkata",
    warehouse_type: "DISTRIBUTION_CENTER",
  });

  const [loading, setLoading] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [pincodeSuggestions, setPincodeSuggestions] = useState([]);
  const [showPincodeSuggestions, setShowPincodeSuggestions] = useState(false);

  if (!isOpen) return null;

  const warehouseTypes = [
    "DISTRIBUTION_CENTER",
    "FULFILLMENT",
    "COLD_STORAGE",
    "CROSS_DOCK",
    "GENERAL",
  ];

  const timezones = [
    "Asia/Kolkata",
    "Asia/Dubai",
    "America/New_York",
    "Europe/London",
    "Asia/Singapore",
    "Australia/Sydney",
  ];

  // Fetch pincode details from API
  const fetchPincodeDetails = async (pincode) => {
    if (pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
      setPincodeSuggestions([]);
      return;
    }

    setPincodeLoading(true);
    try {
      // Note: This API might be on a different domain, might need CORS handling
      const response = await fetch(
        `https://medicine.uur.co.in:4036/api/v1/pincode/${pincode}`,
      );
      const data = await response.json();

      if (data.success && data.data && data.data.length > 0) {
        setPincodeSuggestions(data.data);
        setShowPincodeSuggestions(true);

        // Auto-fill with first suggestion
        const firstSuggestion = data.data[0];
        setFormData((prev) => ({
          ...prev,
          city: firstSuggestion.city || "",
          state: firstSuggestion.state || "",
          country: firstSuggestion.country || "India",
        }));
      } else {
        setPincodeSuggestions([]);
        setShowPincodeSuggestions(false);
      }
    } catch (error) {
      console.error("Error fetching pincode details:", error);
      setPincodeSuggestions([]);
      setShowPincodeSuggestions(false);
    } finally {
      setPincodeLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.warehouse_name.trim()) {
      newErrors.warehouse_name = "Warehouse name is required";
    }

    if (!formData.warehouse_code.trim()) {
      newErrors.warehouse_code = "Warehouse code is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }

    if (!formData.capacity_sqft) {
      newErrors.capacity_sqft = "Capacity is required";
    } else if (parseInt(formData.capacity_sqft) <= 0) {
      newErrors.capacity_sqft = "Capacity must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const payload = {
        warehouse_name: formData.warehouse_name,
        warehouse_code: formData.warehouse_code,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        pincode: formData.pincode,
        capacity_sqft: parseInt(formData.capacity_sqft),
        timezone: formData.timezone,
        warehouse_type: formData.warehouse_type,
        // Add is_active field for creation (default true)
        is_active: true,
      };

      const response = await http.post("/warehouses", payload);

      if (response.data.success) {
        onSuccess?.(response.data.data);
        onClose();

        // Reset form
        setFormData({
          warehouse_name: "",
          warehouse_code: "",
          address: "",
          city: "",
          state: "",
          country: "India",
          pincode: "",
          capacity_sqft: "",
          timezone: "Asia/Kolkata",
          warehouse_type: "DISTRIBUTION_CENTER",
        });
        setPincodeSuggestions([]);
        setShowPincodeSuggestions(false);
      } else {
        throw new Error(response.data.message || "Failed to create warehouse");
      }
    } catch (error) {
      console.error("Error creating warehouse:", error);

      if (error.response?.data?.errors) {
        const apiErrors = {};
        Object.keys(error.response.data.errors).forEach((key) => {
          apiErrors[key] = error.response.data.errors[key][0];
        });
        setErrors(apiErrors);
      } else {
        alert(
          error.response?.data?.message ||
            "Error creating warehouse. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    // Trigger pincode lookup when pincode is entered
    if (field === "pincode" && value.length === 6 && /^\d{6}$/.test(value)) {
      fetchPincodeDetails(value);
    } else if (field === "pincode" && value.length !== 6) {
      setPincodeSuggestions([]);
      setShowPincodeSuggestions(false);
    }
  };

  const selectPincodeSuggestion = (suggestion) => {
    setFormData((prev) => ({
      ...prev,
      city: suggestion.city,
      state: suggestion.state,
      country: suggestion.country || "India",
    }));
    setShowPincodeSuggestions(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <Building className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">
              Create New Warehouse
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 hover:bg-gray-100"
            disabled={loading}
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Modal Body */}
        <form
          onSubmit={handleSubmit}
          className="max-h-[70vh] overflow-y-auto p-6"
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Basic Information */}
            <div className="sm:col-span-2">
              <h3 className="mb-4 text-sm font-semibold text-gray-700">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Warehouse Name *
                  </label>
                  <input
                    type="text"
                    value={formData.warehouse_name}
                    onChange={(e) =>
                      handleInputChange("warehouse_name", e.target.value)
                    }
                    className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                      errors.warehouse_name
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                    placeholder="Enter warehouse name"
                  />
                  {errors.warehouse_name && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.warehouse_name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Warehouse Code *
                  </label>
                  <input
                    type="text"
                    value={formData.warehouse_code}
                    onChange={(e) =>
                      handleInputChange("warehouse_code", e.target.value)
                    }
                    className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                      errors.warehouse_code
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                    placeholder="Enter warehouse code (e.g., WH001)"
                  />
                  {errors.warehouse_code && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.warehouse_code}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="sm:col-span-2">
              <h3 className="mb-4 text-sm font-semibold text-gray-700">
                Address Details
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Address *
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                      errors.address
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                    placeholder="Enter full address"
                  />
                  {errors.address && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.address}
                    </p>
                  )}
                </div>

                {/* Pincode with lookup */}
                <div className="relative">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Pincode *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.pincode}
                      onChange={(e) =>
                        handleInputChange(
                          "pincode",
                          e.target.value.replace(/\D/g, ""),
                        )
                      }
                      className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                        errors.pincode
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      }`}
                      placeholder="Enter 6-digit pincode"
                      maxLength="6"
                    />
                    {pincodeLoading && (
                      <div className="absolute right-3 top-2.5">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                      </div>
                    )}
                    {!pincodeLoading && formData.pincode.length === 6 && (
                      <button
                        type="button"
                        onClick={() => fetchPincodeDetails(formData.pincode)}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-blue-600"
                        title="Lookup pincode"
                      >
                        <Search className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  {errors.pincode && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.pincode}
                    </p>
                  )}

                  {/* Pincode Suggestions Dropdown */}
                  {showPincodeSuggestions && pincodeSuggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-60 overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
                      <div className="p-2 text-xs text-gray-500 border-b border-gray-100">
                        Select a location for pincode {formData.pincode}:
                      </div>
                      {pincodeSuggestions.map((suggestion, index) => (
                        <button
                          key={suggestion._id || index}
                          type="button"
                          onClick={() => selectPincodeSuggestion(suggestion)}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-medium">{suggestion.city}</div>
                          <div className="text-xs text-gray-500">
                            {suggestion.district}, {suggestion.state}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                      errors.city
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                    placeholder="City will auto-fill from pincode"
                    readOnly
                  />
                  {errors.city && (
                    <p className="mt-1 text-xs text-red-600">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    State *
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                      errors.state
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                    placeholder="State will auto-fill from pincode"
                    readOnly
                  />
                  {errors.state && (
                    <p className="mt-1 text-xs text-red-600">{errors.state}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Country *
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) =>
                      handleInputChange("country", e.target.value)
                    }
                    className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                      errors.country
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                    placeholder="Country will auto-fill from pincode"
                    readOnly
                  />
                  {errors.country && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.country}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Warehouse Configuration */}
            <div className="sm:col-span-2">
              <h3 className="mb-4 text-sm font-semibold text-gray-700">
                Warehouse Configuration
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Capacity (sq. ft.) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.capacity_sqft}
                    onChange={(e) =>
                      handleInputChange("capacity_sqft", e.target.value)
                    }
                    className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                      errors.capacity_sqft
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                    placeholder="Enter capacity"
                  />
                  {errors.capacity_sqft && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.capacity_sqft}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Timezone *
                  </label>
                  <select
                    value={formData.timezone}
                    onChange={(e) =>
                      handleInputChange("timezone", e.target.value)
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {timezones.map((tz) => (
                      <option key={tz} value={tz}>
                        {tz}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Warehouse Type *
                  </label>
                  <select
                    value={formData.warehouse_type}
                    onChange={(e) =>
                      handleInputChange("warehouse_type", e.target.value)
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {warehouseTypes.map((type) => (
                      <option key={type} value={type}>
                        {type.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="mt-8 flex justify-end gap-3 border-t border-gray-200 pt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Building className="h-4 w-4" />
                  Create Warehouse
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWarehouseModal;
