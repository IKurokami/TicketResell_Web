"use client";
import React, { useEffect, useState } from "react";
import { PlusCircle, Pencil, Trash2, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/Components/ui/input";

interface Category {
  categoryId: string;
  name?: string; // Làm cho tên không bắt buộc
  description?: string; // Làm cho mô tả không bắt buộc
}

const CategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<Partial<Category>>({});

  // Lấy danh mục từ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5296/api/Category/read");
        const result = await response.json();
        if (result.statusCode === 200) {
          setCategories(result.data);
        } else {
          console.error("Lấy danh mục không thành công:", result.message);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      }
    };

    fetchCategories();
  }, []);

  const generateUniqueCategoryId = (existingIds: string[]) => {
    const prefix = "CAT";
    let newIdNumber = 1; // Bắt đầu từ 1
    let newId;

    // Tìm ID duy nhất
    while (true) {
      newId = `${prefix}${newIdNumber.toString().padStart(3, "0")}`;
      if (!existingIds.includes(newId)) {
        break; // Tìm thấy ID duy nhất
      }
      newIdNumber++;
    }

    return newId;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentCategory) {
      // Chỉnh sửa danh mục
      try {
        const response = await fetch(
          `http://localhost:5296/api/Category/update/${currentCategory.categoryId}`,
          {
            method: "PUT",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: formData.name,
              description: formData.description,
            }),
          }
        );

        const result = await response.json();
        if (result.statusCode === 200) {
          setCategories((prevCategories) =>
            prevCategories.map((category) =>
              category.categoryId === currentCategory.categoryId
                ? { ...category, ...formData }
                : category
            )
          );
        } else {
          console.error("Cập nhật danh mục không thành công:", result.message);
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật danh mục:", error);
      }
    } else {
      // Thêm danh mục mới
      try {
        const existingIds = categories.map((cat) => cat.categoryId); // Lấy ID danh mục hiện có
        const newCategoryId = generateUniqueCategoryId(existingIds); // Tạo ID duy nhất

        const response = await fetch(
          "http://localhost:5296/api/Category/create",
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              categoryId: newCategoryId,
              name: formData.name,
              description: formData.description,
            }),
          }
        );

        const result = await response.json();
        if (result.statusCode === 200) {
          setCategories([
            ...categories,
            { categoryId: newCategoryId, ...formData },
          ]);
        } else {
          console.error("Tạo danh mục không thành công:", result.message);
        }
      } catch (error) {
        console.error("Lỗi khi tạo danh mục:", error);
      }
    }

    setIsOpen(false);
    setCurrentCategory(null);
    setFormData({});
  };

  const handleDelete = async (categoryId: string) => {
    try {
      const response = await fetch(
        `http://localhost:5296/api/Category/delete/${categoryId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const result = await response.json();
      if (result.statusCode === 200) {
        setCategories(
          categories.filter((category) => category.categoryId !== categoryId)
        );
      } else {
        console.error("Xóa danh mục không thành công:", result.message);
      }
    } catch (error) {
      console.error("Lỗi khi xóa danh mục:", error);
    }
  };

  const handleEdit = (category: Category) => {
    setCurrentCategory(category);
    setFormData(category);
    setIsOpen(true);
  };

  const filteredCategories = categories.filter(
    (category) =>
      (category.name &&
        category.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (category.description &&
        category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Quản lí danh mục</CardTitle>
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            <Input
              placeholder="Tìm danh mục..."
              className="px-10 py-4 rounded-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            onClick={() => {
              setCurrentCategory(null);
              setFormData({});
              setIsOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full py-3 px-6 shadow-md"
          >
            <PlusCircle className="mr-2 h-6 w-6" />
            Thêm danh mục
          </Button>
        </div>


      </CardHeader>
      <CardContent>
        <div className="shadow-lg border rounded-xl p-4 overflow-x-auto bg-white">
          <table className="w-full">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs tracking-wider border-b">
              <tr>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Danh mục</th>
                <th className="py-3 px-4 text-left">Mô tả</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category) => (
                <tr key={category.categoryId} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{category.categoryId}</td>
                  <td className="py-3 px-4">{category.name}</td>
                  <td className="py-3 px-4">{category.description}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      {/* Edit Icon */}
                      <div onClick={() => handleEdit(category)} className="cursor-pointer">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-blue-600"
                          viewBox="0 0 512 512"
                          fill="currentColor"
                        >
                          <path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z" />
                        </svg>
                      </div>

                      {/* Delete Icon */}
                      <div onClick={() => handleDelete(category.categoryId)} className="cursor-pointer">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-red-600"
                          fill="currentColor"
                          viewBox="0 0 448 512"
                        >
                          <path d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z" />
                        </svg>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </CardContent>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>
              {currentCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tên</label>
                <Input
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Mô tả</label>
                <textarea
                  className="w-full rounded-md border border-gray-300 p-2"
                  rows={3}
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <Button type="submit">
              {currentCategory ? "Cập nhật" : "Tạo"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CategoryManagement;
