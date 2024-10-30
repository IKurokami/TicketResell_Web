import React, { useState } from "react";
import { Eye, EyeOff, Check, X } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/Components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/Components/ui/input";
import { Alert, AlertDescription } from "@/Components/ui/alert";

const PasswordChangeForm = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false,
  });
  const [errors, setErrors] = useState<any>({});
  const [success, setSuccess] = useState(false);

  const passwordRequirements = [
    { label: "At least 8 characters", test: (pwd: any) => pwd.length >= 8 },
    {
      label: "Contains uppercase letter",
      test: (pwd: any) => /[A-Z]/.test(pwd),
    },
    {
      label: "Contains lowercase letter",
      test: (pwd: any) => /[a-z]/.test(pwd),
    },
    { label: "Contains number", test: (pwd: any) => /\d/.test(pwd) },
    {
      label: "Contains special character",
      test: (pwd: any) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    },
  ];

  const validatePassword = (password: any) => {
    return passwordRequirements.every((req) => req.test(password));
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setSuccess(false);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const newErrors: any = {};

    if (!validatePassword(formData.newPassword)) {
      newErrors.newPassword = "Password does not meet requirements";
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSuccess(true);
    setFormData({ newPassword: "", confirmPassword: "" });
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Change Password
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Input
                type={showPassword.new ? "text" : "password"}
                name="newPassword"
                placeholder="New Password"
                value={formData.newPassword}
                onChange={handleChange}
                className={`pr-10 ${
                  errors.newPassword ? "border-red-500" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword.new ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-sm text-red-500">{errors.newPassword}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Input
                type={showPassword.confirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`pr-10 ${
                  errors.confirmPassword ? "border-red-500" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword.confirm ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          <Button type="submit" className="w-full">
            Change Password
          </Button>

          {success && (
            <Alert className="mt-4">
              <Check className="h-5 w-5 text-green-500" />
              <AlertDescription className="text-green-600">
                Password changed successfully!
              </AlertDescription>
            </Alert>
          )}
          {Object.values(errors).some(Boolean) && (
            <Alert className="mt-4">
              <X className="h-5 w-5 text-red-500" />
              <AlertDescription className="text-red-600">
                Please fix the errors above.
              </AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-center text-gray-500">
          Please ensure your new password meets all the requirements.
        </p>
      </CardFooter>
    </Card>
  );
};

export default PasswordChangeForm;
