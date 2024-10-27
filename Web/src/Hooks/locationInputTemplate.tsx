import React, { useEffect, useState, useCallback } from "react";

type Province = {
  Id: number;
  Name: string;
};

type District = {
  Id: number;
  Name: string;
  ProvinceId: number;
};

type Ward = {
  Id: number;
  Name: string;
  DistrictId: number;
};

interface InputAddressFieldsProps {
  houseNumber: string;
  setHouseNumber: React.Dispatch<React.SetStateAction<string>>;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const InputAddressFields: React.FC<InputAddressFieldsProps> = ({
  houseNumber,
  setHouseNumber,
  setFormData,
}) => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
  const [selectedWard, setSelectedWard] = useState<number | null>(null);

  const fetchProvinces = async () => {
    try {
      const response = await fetch(
        "https://api.npoint.io/ac646cb54b295b9555be"
      );
      const data = await response.json();
      setProvinces(data);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  const fetchDistricts = async (provinceId: number) => {
    try {
      const response = await fetch(
        "https://api.npoint.io/34608ea16bebc5cffd42"
      );
      const data: District[] = await response.json();
      const filteredDistricts = data.filter(
        (district) => district.ProvinceId === provinceId
      );
      setDistricts(filteredDistricts);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const fetchWards = async (districtId: number) => {
    try {
      const response = await fetch(
        "https://api.npoint.io/dd278dc276e65c68cdf5"
      );
      const data: Ward[] = await response.json();
      const filteredWards = data.filter(
        (ward) => ward.DistrictId === districtId
      );
      setWards(filteredWards);
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

  useEffect(() => {
    fetchProvinces();
  }, []);

  const handleProvinceChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      setSelectedProvince(value ? Number(value) : null);
      setSelectedDistrict(null);
      setSelectedWard(null);
      setDistricts([]);
      setWards([]);
    },
    []
  );

  const handleDistrictChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      setSelectedDistrict(value ? Number(value) : null);
      setSelectedWard(null);
      setWards([]);
    },
    []
  );

  const handleWardChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      setSelectedWard(value ? Number(value) : null);
    },
    []
  );

  useEffect(() => {
    if (selectedProvince) {
      fetchDistricts(selectedProvince);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      fetchWards(selectedDistrict);
    }
  }, [selectedDistrict]);

  useEffect(() => {
    const updateFormData = () => {
      const provinceName =
        provinces.find((prov) => prov.Id === selectedProvince)?.Name || "";
      const districtName =
        districts.find((dist) => dist.Id === selectedDistrict)?.Name || "";
      const wardName = wards.find((wrd) => wrd.Id === selectedWard)?.Name || "";

      if (houseNumber && provinceName && districtName && wardName) {
        const fullAddress =
          `${houseNumber}, ${wardName}, ${districtName}, ${provinceName}`.trim();
        setFormData((prevData) => ({
          ...prevData,
          address: fullAddress,
        }));
      }
    };

    updateFormData();
  }, [
    houseNumber,
    selectedProvince,
    selectedDistrict,
    selectedWard,
    provinces,
    districts,
    wards,
    setFormData,
  ]);

  const handleHouseNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setHouseNumber(e.target.value);
    },
    [setHouseNumber]
  );

  return (
    <div className="grid grid-cols-2 gap-4 w-full">
      <div className="flex flex-col">
        <label
          htmlFor="houseNumber"
          className="mb-1 text-sm font-medium text-gray-700"
        >
          House Number/Street
        </label>
        <input
          id="houseNumber"
          type="text"
          value={houseNumber}
          onChange={handleHouseNumberChange}
          className="w-full px-3 py-2 bg-[#F5F7FC] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="flex flex-col">
        <label
          htmlFor="province"
          className="mb-1 text-sm font-medium text-gray-700"
        >
          Province
        </label>
        <select
          id="province"
          value={selectedProvince || ""}
          onChange={handleProvinceChange}
          className="w-full px-3 py-2 bg-[#F5F7FC] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select Province</option>
          {provinces.map((province) => (
            <option key={province.Id} value={province.Id}>
              {province.Name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label
          htmlFor="district"
          className="mb-1 text-sm font-medium text-gray-700"
        >
          District
        </label>
        <select
          id="district"
          value={selectedDistrict || ""}
          onChange={handleDistrictChange}
          disabled={!selectedProvince}
          className="w-full px-3 py-2 bg-[#F5F7FC] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">Select District</option>
          {districts.map((district) => (
            <option key={district.Id} value={district.Id}>
              {district.Name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label
          htmlFor="ward"
          className="mb-1 text-sm font-medium text-gray-700"
        >
          Ward
        </label>
        <select
          id="ward"
          value={selectedWard || ""}
          onChange={handleWardChange}
          disabled={!selectedDistrict}
          className="w-full px-3 py-2 bg-[#F5F7FC] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">Select Ward</option>
          {wards.map((ward) => (
            <option key={ward.Id} value={ward.Id}>
              {ward.Name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default InputAddressFields;
