"use client";
import React, { useState, useEffect } from "react";
import RichTextEditor from "@/Hooks/RichTextEditor";
import { useRouter } from "next/navigation";
import ScrollToTopButton from "@/Hooks/useScrollTopButton";
import "bootstrap/dist/css/bootstrap.min.css";
import uploadImageForTicket from "@/models/UpdateImage";
import {
  TextField,
  Button,
  Box,
  Autocomplete,
  Typography,
} from "@mui/material";
import Cookies from "js-cookie";
import "@/Css/AddTicketModal.css";
import { useParams } from "next/navigation";
import { fetchImage } from "@/models/FetchImage";

interface Province {
  Id: number;
  Code: string;
  Name: string;
}

interface District {
  Id: number;
  Code: string;
  Name: string;
  ProvinceId: number;
}
interface Ward {
  Id: number;
  Code: string;
  Name: string;
  DistrictId: number;
}

interface FormDataType {
  name: string;
  cost: string;
  location: string;
  date: string;
  image: string;
  description: string;
  Qrcode: string[]; // Change this to an array of files
  categories: Category[];
}

interface Category {
  categoryId: string;
  name: string;
}

const UpdateTicketModal: React.FC = () => {
  const initialFormData: FormDataType = {
    name: "",
    cost: "",
    location: "",
    date: "",
    image: "",
    description: "",
    Qrcode: [],
    categories: [],
  };

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [qrFileNames, setQrFileNames] = useState(Array(quantity).fill(""));
  const [qrFiles, setQrFiles] = useState(Array(quantity).fill(null));
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const router = useRouter();

  const [houseNumber, setHouseNumber] = useState<string>("");
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
  const [selectedWard, setSelectedWard] = useState<number | null>(null);
  const [minDateTime, setMinDateTime] = useState("");
  const [imageId, setImageId] = useState<string>("");
  const [initialquantity, setInitialquantity] = useState(quantity);

  const toDateTimeLocalFormat = (date: string | Date): string => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = `0${d.getMonth() + 1}`.slice(-2);
    const day = `0${d.getDate()}`.slice(-2);
    const hours = `0${d.getHours()}`.slice(-2);
    const minutes = `0${d.getMinutes()}`.slice(-2);
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const fetchProvinces = async () => {
    try {
      const response = await fetch(
        "https://api.npoint.io/ac646cb54b295b9555be"
      );
      const data = await response.json();
      setProvinces(data);
      return data;
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
      return filteredDistricts;
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

      // Filter wards by DistrictId
      const filteredWards = data.filter(
        (ward) => ward.DistrictId === districtId
      );
      setWards(filteredWards);
      return filteredWards;
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

  useEffect(() => {
    fetchProvinces();
  }, []);

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

  const handleProvinceChange = (selectedProvinceId: number | null) => {
    setSelectedProvince(selectedProvinceId);
    setSelectedDistrict(null); // Clear district and ward when province changes
    setSelectedWard(null);
  };

  const handleDistrictChange = (selectedDistrictId: number | null) => {
    setSelectedDistrict(selectedDistrictId);
    setSelectedWard(null); // Clear ward when district changes
  };

  const handleWardChange = (selectedWardId: number | null) => {
    setSelectedWard(selectedWardId);
  };

  const getProvinceName = (provinceId: number | null) => {
    const province = provinces.find((prov) => prov.Id === provinceId);
    return province ? province.Name : "";
  };

  const getDistrictName = (districtId: number | null) => {
    const district = districts.find((dist) => dist.Id === districtId);
    return district ? district.Name : "";
  };

  const getWardName = (wardId: number | null) => {
    const ward = wards.find((wrd) => wrd.Id === wardId);
    return ward ? ward.Name : "";
  };

  useEffect(() => {
    if (selectedProvince && selectedDistrict && selectedWard) {
      const provinceName = getProvinceName(selectedProvince);
      const districtName = getDistrictName(selectedDistrict);
      const wardName = getWardName(selectedWard);

      setFormData((prevData) => ({
        ...prevData,
        location: `${houseNumber}, ${wardName}, ${districtName}, ${provinceName}`,
      }));
    }
  }, [houseNumber, selectedProvince, selectedDistrict, selectedWard]);

  useEffect(() => {
    const getCurrentDateTime = () => {
      const now = new Date();
      return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
    };

    setMinDateTime(getCurrentDateTime());
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch(
        `http://localhost:5296/api/ticket/readbybaseid/${id}`
      );
      const result = await response.json();
      console.log("Fetched Ticket Data:", result.data);

      if (!result.data || result.data.length === 0) {
        console.log("No data found");
        return;
      }

      const firstTicket = result.data[0];

      setImageId(firstTicket.image);
      // Format start date if available
      const formattedDateForInput = firstTicket.startDate
        ? toDateTimeLocalFormat(firstTicket.startDate)
        : null;

      // Split and extract location details
      const locationParts = firstTicket.location
        ? firstTicket.location.split(", ").map((part: string) => part.trim())
        : [];
      const houseNumber = locationParts[0] || "";
      const wardName = locationParts[1] || "";
      const districtName = locationParts[2] || "";
      const provinceName = locationParts[3] || "";

      setHouseNumber(houseNumber);

      const updatedQrFiles: string[] = [];

      result.data.forEach((ticket: any) => {
        if (Array.isArray(ticket.qrcode)) {
          // If qrcode is an array, map over each QR code and push it to updatedQrFiles
          ticket.qrcode.forEach((qrCode: string) => {
            const mimeType = detectMimeType(qrCode);
            updatedQrFiles.push(`data:${mimeType};base64,${qrCode}`);
          });
        } else if (typeof ticket.qrcode === "string") {
          // If qrcode is a single string, push it to updatedQrFiles
          const mimeType = detectMimeType(ticket.qrcode);
          updatedQrFiles.push(`data:${mimeType};base64,${ticket.qrcode}`);
        }
      });

      setFormData((prevData) => ({
        ...prevData,
        ...firstTicket,
        date: formattedDateForInput,
        Qrcode: updatedQrFiles,
      }));

      if (updatedQrFiles.length > 0) {
        setQrFiles(updatedQrFiles);
      }
      setInitialquantity(updatedQrFiles.length);
      setQuantity(updatedQrFiles.length);
      // Fetch provinces
      const fetchedProvinces = await fetchProvinces();
      console.log("Fetched Provinces:", fetchedProvinces);

      if (!fetchedProvinces.length) {
        console.log("No provinces available yet.");
        return;
      }

      setProvinces(fetchedProvinces);

      // Find the selected province ID
      const selectedProv =
        fetchedProvinces.find(
          (p: Province) =>
            p.Name.trim().toLowerCase() === provinceName.trim().toLowerCase()
        )?.Id || null;

      if (selectedProv) {
        const fetchedDistricts = await fetchDistricts(selectedProv);

        if (Array.isArray(fetchedDistricts)) {
          const selectedDist =
            fetchedDistricts.find(
              (d) =>
                d.Name.trim().toLowerCase() ===
                districtName.trim().toLowerCase()
            )?.Id || null;

          if (selectedDist) {
            const fetchedWards = await fetchWards(selectedDist);

            if (Array.isArray(fetchedWards)) {
              const selectedWrd =
                fetchedWards.find(
                  (w) =>
                    w.Name.trim().toLowerCase() ===
                    wardName.trim().toLowerCase()
                )?.Id || null;

              setSelectedProvince(selectedProv);
              setSelectedDistrict(selectedDist);
              setSelectedWard(selectedWrd);
            }
          }
        } else {
          console.error("Fetched districts is not an array:", fetchedDistricts);
        }
      }

      // Fetch and set the image if available
      if (firstTicket.image) {
        const { imageUrl, error } = await fetchImage(firstTicket.image);
        if (imageUrl) {
          setFormData((prevData) => ({
            ...prevData,
            image: imageUrl,
          }));
        } else {
          console.error(`Error fetching image for ticket: ${error}`);
        }
      }
    } catch (error) {
      console.error("Error fetching ticket items:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [id]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5296/api/Category/read");
      const result = await response.json();

      if (Array.isArray(result.data)) {
        setCategories(result.data);
      } else {
        console.error("Expected array but got:", result.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "cost") {
      let baseValue = value.replace(/000$/, "");

      baseValue = baseValue.replace(/\D/g, "");

      setFormData({
        ...formData,
        [name]: baseValue + "000",
      });
    } else if (name === "date") {
      const newDate = new Date(value);
      const minDate = new Date(minDateTime);

      if (newDate < minDate) {
        alert("Selected date is before the minimum allowed date.");
        return;
      }

      setFormData({
        ...formData,
        [name]: value,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleCategoriesChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: Category[]
  ) => {
    setFormData({
      ...formData,
      categories: value,
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setFormData((prevData) => ({
        ...prevData,
        image: file.name,
      }));

      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  const detectMimeType = (base64String: string) => {
    if (base64String.startsWith("/9j/")) {
      return "image/jpeg";
    } else if (base64String.startsWith("iVBORw0KGgo")) {
      return "image/png";
    } else if (base64String.startsWith("UklGR")) {
      return "image/webp";
    }
    return "image/png";
  };

  const handleQrFileChange = async (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const files = Array.from(event.target.files);
      const newQrFiles = [...qrFiles]; // Copy existing QR files
      const newQrFileNames = [...qrFileNames]; // Copy existing QR file names

      // Process each selected file
      await Promise.all(
        files.map((file, fileIndex) => {
          return new Promise<void>((resolve) => {
            // Specify the return type as void
            const reader = new FileReader();

            reader.onloadend = () => {
              const targetIndex = index + fileIndex; // Calculate the target index

              newQrFiles[targetIndex] = reader.result as string; // Set the QR file data
              newQrFileNames[targetIndex] = file.name; // Set the file name

              resolve(); // Resolve the promise when done
            };

            reader.readAsDataURL(file); // Read the file
          });
        })
      );

      // Update state after all files are processed
      setQrFiles(newQrFiles);
      setQrFileNames(newQrFileNames);

      // Update form data to reflect the new QR files
      setFormData((prevData) => ({
        ...prevData,
        Qrcode: newQrFiles, // Assuming you're storing QR codes in this field
      }));
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);

    setQrFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      while (updatedFiles.length < newQuantity) {
        updatedFiles.push(null);
      }
      return updatedFiles.slice(0, newQuantity);
    });

    setQrFileNames((prevNames) => {
      const updatedNames = [...prevNames];
      while (updatedNames.length < newQuantity) {
        updatedNames.push("");
      }
      return updatedNames.slice(0, newQuantity);
    });
  };

  const deleteManyTickets = async (ticketIds: string[]) => {
    try {
      const response = await fetch(
        `http://localhost:5296/api/Ticket/deletemany/${id}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(ticketIds),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete tickets");
      }

      console.log("Successfully deleted tickets");
    } catch (error) {
      console.error("Error deleting tickets:", error);
    }
  };

  const handleSave = async () => {
    const sellerId = Cookies.get("id");

    // Validate required fields
    if (
      !formData.name ||
      !formData.cost ||
      !formData.location ||
      !formData.date ||
      !formData.image ||
      !formData.description ||
      !formData.Qrcode // Make sure this is an array and has values
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    // Prepare tickets
    const tickets = Array.from({ length: quantity }).map((_, index) => ({
      TicketId: `${id}_${index + 1}`,
      SellerId: sellerId,
      Name: formData.name,
      Cost: parseFloat(formData.cost),
      Location: formData.location,
      StartDate: new Date(formData.date),
      Status: 1,
      Image: id,
      Qrcode: qrFiles[index] || formData.Qrcode[index],
      CategoriesId: formData.categories.map((category) => category.categoryId),
      Description: formData.description,
    }));

    console.log("Tickets to update:", tickets);

    // Function to update QR codes
    const updateQrCodes = async (tickets) => {
      const qrCodePromises = tickets.map(async (ticket) => {
        if (ticket.Qrcode) {
          const response = await fetch(
            `http://localhost:5296/api/Ticket/update/qr/${ticket.TicketId}`,
            {
              method: "PUT",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ Qr: ticket.Qrcode }),
            }
          );

          if (!response.ok) {
            throw new Error(
              `Failed to update QR code for ticket ${ticket.TicketId}: ${response.statusText}`
            );
          }

          const result = await response.json();
          console.log("QR code update result:", result);
          return result;
        }
      });

      await Promise.allSettled(qrCodePromises); // Wait for all QR code updates to settle
    };

    // Function to update images
    const updateImages = async () => {
      if (selectedFile && tickets.length > 0) {
        const firstTicket = tickets[0];
        console.log(firstTicket);

        const imageUpdateResult = await uploadImageForTicket(
          firstTicket,
          selectedFile
        );
        return imageUpdateResult;
      } else {
        console.error("No file selected or no tickets available.");
        return null;
      }
    };

    // Function to update tickets
    const updateTickets = async () => {
      const updateTicketPromises = tickets.map(async (ticket) => {
        const response = await fetch(
          `http://localhost:5296/api/Ticket/update/${ticket.TicketId}`,
          {
            method: "PUT",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(ticket),
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to update ticket ${ticket.TicketId}: ${response.statusText}`
          );
        }

        const result = await response.json();
        console.log(`Ticket ${ticket.TicketId} updated successfully.`);
        return result;
      });

      await Promise.allSettled(updateTicketPromises); // Wait for all ticket updates to settle
      console.log("All tickets updated successfully.");
    };

    try {
      const imageUpdateSuccess = await updateImages();
      console.log("Image update success:", imageUpdateSuccess);

      // Only delete tickets if image update was successful
      if (imageUpdateSuccess) {
        if (tickets.length > 1) {
          await deleteManyTickets(tickets.map((ticket) => ticket.TicketId)); // Call delete many if needed
        }
      }

      await updateQrCodes(tickets); // Update QR codes in parallel
      await updateTickets(); // Update tickets in parallel
      console.log("All operations completed successfully.");

      router.push("/sell");
      window.location.href = "/sell";
    } catch (error) {
      console.error("Error during save operation:", error);
    }
  };

  const handleCancel = () => {
    router.push("/sell");
    window.location.href = "/sell";
  };

  return (
    <div>
      <Box className="modal-style">
        <div className="modal-contentt">
          <ScrollToTopButton />
          <h2>Add Ticket</h2>
          <TextField
            className="custom-text-field"
            fullWidth
            label="Quantity"
            value={quantity}
            onChange={(e) => {
              const newQuantity = Number(e.target.value);
              if (newQuantity <= initialquantity) {
                handleQuantityChange(newQuantity); // Allow decrease only
              }
            }}
            type="number"
            margin="normal"
            inputProps={{ min: 1, max: initialquantity }} // Disable if the quantity reaches the minimum
          />
          {/* File input for image */}

          <div className="upload-container">
            <Typography
              variant="h6"
              margin="normal"
              style={{ fontSize: "20px" }}
            >
              Upload Image:
            </Typography>

            <div className="row p-3 justify-between">
              <div
                className="col-md-5 p-0  mb-4  upload-box large-box "
                onClick={() =>
                  document.getElementById("ticketImageInput")?.click()
                }
              >
                <div>
                  <input
                    id="ticketImageInput"
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: "none" }}
                    required
                  />

                  {/* Show uploaded image preview if available */}
                  {imagePreview && (
                    <div className="image-preview">
                      <img
                        src={imagePreview}
                        style={{ width: "100%", height: "42vh" }}
                      />
                    </div>
                  )}

                  {/* Show fetched image if no uploaded image */}
                  {!imagePreview && formData.image && (
                    <div className="image-preview ">
                      <img
                        src={formData.image}
                        style={{ width: "100%", height: "42vh" }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-5 p-3 mb-4 upload-box small-box">
                {Array.from({ length: quantity }).map((_, index) => (
                  <div key={index}>
                    <input
                      id={`qrImageInput${index}`}
                      type="file"
                      onChange={(event) => handleQrFileChange(index, event)}
                      accept="image/*"
                      multiple
                      style={{ display: "none" }}
                      required
                    />
                    <div className="text-center qr-text">
                      <span>QR image {index + 1}</span>
                    </div>

                    {/* Conditionally show empty box or the QR preview */}
                    {!qrFiles[index] && !formData.Qrcode?.[index] && (
                      <div
                        className="items-center qr-image-box"
                        onClick={() =>
                          document
                            .getElementById(`qrImageInput${index}`)
                            ?.click()
                        }
                      />
                    )}
                    {qrFiles[index] && (
                      <div
                        className="qr-preview mt-3"
                        onClick={() =>
                          document
                            .getElementById(`qrImageInput${index}`)
                            ?.click()
                        }
                      >
                        <img
                          src={qrFiles[index]}
                          alt={`QR Code ${index + 1}`}
                          className="img-fluid"
                          style={{ maxWidth: "40%", height: "auto" }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <TextField
            className="custom-text-field"
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            type="string"
            required
          />

          <TextField
            className="custom-text-field"
            fullWidth
            label="Cost"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            margin="normal"
            type="number"
            inputProps={{ min: 1 }}
            required
          />
          {/* Location (Province, District, Ward) */}

          <div className="address-fields-container">
            <TextField
              className="address-field"
              label="House Number/Street"
              value={houseNumber}
              onChange={(e) => setHouseNumber(e.target.value)}
              margin="normal"
              fullWidth
              required
            />

            <Autocomplete
              options={provinces}
              getOptionLabel={(option: Province) => option.Name}
              value={
                provinces.find(
                  (province) => province.Id === selectedProvince
                ) || null
              }
              onChange={(event, newValue: Province | null) => {
                handleProvinceChange(newValue ? newValue.Id : null);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  className="address-field"
                  label="Province"
                  margin="normal"
                  fullWidth
                  required
                />
              )}
            />

            <Autocomplete
              options={districts}
              getOptionLabel={(option: District) => option.Name}
              value={
                districts.find(
                  (district) => district.Id === selectedDistrict
                ) || null
              }
              onChange={(event, newValue: District | null) => {
                handleDistrictChange(newValue ? newValue.Id : null); // Pass Id, not Name
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  className="address-field"
                  label="District"
                  margin="normal"
                  fullWidth
                  value={
                    districts.find(
                      (district) => district.Id === selectedDistrict
                    ) || null
                  }
                  required
                  disabled={!selectedProvince}
                />
              )}
            />

            <Autocomplete
              options={wards}
              getOptionLabel={(option: Ward) => option.Name}
              value={wards.find((ward) => ward.Id === selectedWard) || null}
              onChange={(event, newValue: Ward | null) => {
                handleWardChange(newValue ? newValue.Id : null); // Pass Id, not Name
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  className="address-field"
                  label="Ward"
                  margin="normal"
                  fullWidth
                  value={wards.find((ward) => ward.Id === selectedWard) || null}
                  required
                  disabled={!selectedDistrict}
                />
              )}
            />
          </div>
          <TextField
            className="custom-text-field"
            label="Please select address "
            value={formData.location}
            margin="normal"
            fullWidth
            required
            disabled={true}
          />
          <TextField
            className="custom-text-field"
            fullWidth
            label="Date and Time"
            name="date"
            value={formData.date}
            onChange={handleChange}
            margin="normal"
            type="datetime-local"
            InputLabelProps={{
              shrink: true,
            }}
            required
            inputProps={{
              min: minDateTime,
            }}
          />
          {/* Autocomplete for selecting multiple categories */}
          <Autocomplete
            multiple
            options={categories}
            getOptionLabel={(option: Category) => option.name}
            value={formData.categories}
            onChange={handleCategoriesChange}
            renderInput={(params) => (
              <TextField
                className="custom-text-field"
                {...params}
                label="Categories"
                margin="normal"
              />
            )}
            loading={loading}
            isOptionEqualToValue={(option, value) =>
              option.categoryId === value.categoryId
            }
          />
          <div className="border rounded-md mb-4 ">
            <div className="custom-text-field">
              <RichTextEditor
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button variant="outlined" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
          </Box>
        </div>
      </Box>
    </div>
  );
};

export default UpdateTicketModal;
