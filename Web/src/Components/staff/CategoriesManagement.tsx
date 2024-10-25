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
import { Button } from "@/Components/ui/button";
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
        <CardTitle>Quản lý danh mục</CardTitle>
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Tìm kiếm danh mục..."
              className="px-8 rounded-xl "
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
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Thêm danh mục
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Tên</th>
                <th className="py-3 px-4 text-left">Mô tả</th>
                <th className="py-3 px-4 text-left">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category) => (
                <tr
                  key={category.categoryId}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="py-3 px-4">{category.categoryId}</td>
                  <td className="py-3 px-4">{category.name}</td>
                  <td className="py-3 px-4">{category.description}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(category)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(category.categoryId)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
