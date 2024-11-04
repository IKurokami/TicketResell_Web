"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import TextField from "@mui/material/TextField";
import AddressFields from "@/Hooks/location";
import TermsModal from "./TermModal";
import { InputAdornment } from "@mui/material";

interface ProfileData {
  gmail: string | null;
  fullname: string | null;
  sex: "male" | "female" | "other" | null;
  phone: string | null;
  location: string | null;
  birthday: string | null;
}

interface Errors {
  birthday?: string;
}

const ProfileForm: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    gmail: null,
    fullname: null,
    sex: null,
    phone: null,
    location: null,
    birthday: null,
  });
  const [notification, setNotification] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const router = useRouter();
  const [houseNumber, setHouseNumber] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});

  const [isOpen, setIsOpen] = useState(false);

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { name: string; value: string }
  ) => {
    const name = "target" in e ? e.target.name : e.name;
    const value = "target" in e ? e.target.value : e.value;

    // Update profileData state
    setProfileData((prev) => ({
      ...prev,
      [name]: value || null,
    }));

    // Validate birthday if the birthday field is changed
    if (name === "birthday") {
      validateBirthday(value);
    }
  };

  const validateBirthday = (birthday: string) => {
    const selectedDate = new Date(birthday);
    const today = new Date();

    // Calculate age by subtracting birth year from current year
    const age = today.getFullYear() - selectedDate.getFullYear();

    // Adjust age if the birthday hasn't occurred yet this year
    const hasHadBirthdayThisYear =
      today.getMonth() > selectedDate.getMonth() ||
      (today.getMonth() === selectedDate.getMonth() &&
        today.getDate() >= selectedDate.getDate());

    const finalAge = hasHadBirthdayThisYear ? age : age - 1;

    if (finalAge < 18) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        birthday: "Bạn phải từ 18 tuổi trở lên.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        birthday: "",
      }));
    }
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if there are any validation errors before submitting
    if (errors.birthday) {
      console.error("Form submission prevented due to validation errors");
      return;
    }

    console.log("Profile data before submission:", profileData);

    const id = Cookies.get("id");
    if (
      !profileData.fullname ||
      !profileData.gmail ||
      !profileData.birthday ||
      !profileData.location ||
      !isChecked
    ) {
      setNotification("Vui lòng điền đầy đủ thông tin.");
      return; // Prevent form submission
    }

    const profile = {
      gmail: profileData.gmail,
      fullname: profileData.fullname,
      sex: profileData.sex,
      phone: profileData.phone,
      address: profileData.location,
      birthday: profileData.birthday,
    };

    try {
      const response = await fetch(
        `http://${process.env.NEXT_PUBLIC_API_URL}/api/user/updateseller/${id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profile),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Profile updated successfully:", data);
        router.push("/sell");
      } else {
        console.error("Error updating profile:", response.status);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const textFieldStyle = {
    "& .MuiOutlinedInput-root": {
      "&:hover fieldset": {
        borderColor: "#22C55E",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#22C55E",
      },
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#22C55E",
    },
  };

  return (
    <div className="min-h-screen py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold">
                <span className="text-green-600">Ticket</span>
                <span className="bg-gradient-to-r text-black bg-clip-text">
                  Resell
                </span>
              </h1>
              <p className="text-sm text-gray-500 mt-2">
                Hoàn thành hồ sơ người bán
              </p>
            </div>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <TextField
                fullWidth
                label="Họ và tên"
                name="fullname"
                variant="outlined"
                placeholder="Nhập họ và tên của bạn"
                onChange={handleChange}
                sx={textFieldStyle}
              />

              <TextField
                fullWidth
                label="Email"
                name="gmail"
                type="email"
                variant="outlined"
                placeholder="Nhập địa chỉ email của bạn"
                onChange={handleChange}
                sx={textFieldStyle}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <img
                        src={"https://th.bing.com/th/id/OIP.wBKSzdf1HTUgx1Ax_EecKwHaHa?rs=1&pid=ImgDetMain"}
                        alt="Logo"
                        style={{ width: 30, height: 30 }}
                      />
                    </InputAdornment>
                  ),
                }}
              />    
              <p className="text-red-600 text-sm">* Email là tài khoản PayPal của bạn</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  fullWidth
                  label="Ngày sinh"
                  name="birthday"
                  type="date"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.birthday}
                  helperText={errors.birthday}
                  onChange={handleChange}
                  sx={textFieldStyle}
                />

                <TextField
                  fullWidth
                  select
                  label=""
                  name="sex"
                  value={profileData.sex || ""}
                  onChange={handleChange}
                  variant="outlined"
                  sx={textFieldStyle}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="" disabled>
                    Chọn giới tính
                  </option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </TextField>
              </div>

              <TextField
                fullWidth
                label="Số điện thoại"
                name="phone"
                type="tel"
                variant="outlined"
                placeholder="Nhập số điện thoại của bạn"
                onChange={handleChange}
                sx={textFieldStyle}
              />

              <div className="space-y-2">
                <AddressFields
                  houseNumber={houseNumber}
                  setHouseNumber={setHouseNumber}
                  setFormData={setProfileData}
                />
              </div>

              <TextField
                label="Vui lòng chọn địa chỉ"
                value={profileData.location || ""}
                margin="normal"
                fullWidth
                required
                disabled={true}
              />
              <div className="flex justify-between">
                <div className="flex items-center justify-start">
                  <input
                    type="checkbox"
                    id="myCheckbox"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                    className="form-checkbox h-5 w-5 items-center text-green-600 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="myCheckbox"
                    className="ml-2 items-center  text-gray-700"
                  >
                    Đồng ý với điều khoản
                  </label>
                </div>
                <Button
                  onClick={handleOpenModal}
                  className="bg-gray-200 shadow-none "
                >
                  Xem điều khoản
                </Button>
              </div>

              {notification && (
                <div className="text-red-600 text-sm mb-2">{notification}</div>
              )}
            </CardContent>

            <CardFooter className="pt-6">
              <Button
                type="submit"
                className="w-full h-12 bg-green-800 text-white hover:bg-green-500 font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
              >
                Hoàn thành hồ sơ
              </Button>
            </CardFooter>
          </form>
        </Card>
        <div className="pt-20">
          <TermsModal isOpen={isOpen} onClose={handleCloseModal} />
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
