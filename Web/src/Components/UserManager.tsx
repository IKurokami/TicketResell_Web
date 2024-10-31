import React, { useState, useEffect, useCallback } from "react";
import {
  FaSearch,
  FaTrash,
  FaEdit,
  FaSort,
  FaUserCog,
  FaUserSlash,
  FaKey,
} from "react-icons/fa";
import { User } from "@/models/UserManagement";

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  options: {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    className?: string;
  }[];
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  onClose,
  options,
}) => {
  useEffect(() => {
    const handleClick = () => onClose();
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [onClose]);

  return (
    <div
      className="fixed bg-white shadow-lg rounded-lg py-2 z-50 min-w-[200px] border border-gray-200"
      style={{ top: y, left: x }}
    >
      {options.map((option, index) => (
        <button
          key={index}
          onClick={(e) => {
            e.stopPropagation();
            option.onClick();
            onClose();
          }}
          className={`w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 ${
            option.className || "text-gray-700"
          }`}
        >
          {option.icon}
          {option.label}
        </button>
      ))}
    </div>
  );
};

interface UserManagerProps {
  users: User[];
  onEdit?: (userId: string) => void;
  onDisableAccount?: (userId: string) => void;
  onDisableSeller?: (userId: string) => void;
  onEnableAccount?: (userId: string) => void;
  onResetPassword?: (userId: string) => void;
}

const UserManager: React.FC<UserManagerProps> = ({
  users,
  onEdit,
  onDisableAccount,
  onEnableAccount,
  onDisableSeller,
  onResetPassword,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
  const [sortField, setSortField] = useState<
    "fullname" | "userId" | "gmail" | "createDate"
  >("fullname");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (
    field: "fullname" | "userId" | "gmail" | "createDate"
  ) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  useEffect(() => {
    const filterAndSortUsers = () => {
      let filtered = users;

      // Apply search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (user) =>
            user.fullname.toLowerCase().includes(searchLower) ||
            user.userId.toLowerCase().includes(searchLower) ||
            user.gmail.toLowerCase().includes(searchLower)
        );
      }

      // Apply sorting
      filtered = [...filtered].sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];

        if (sortField === "createDate") {
          return sortDirection === "asc"
            ? new Date(aValue).getTime() - new Date(bValue).getTime()
            : new Date(bValue).getTime() - new Date(aValue).getTime();
        }

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortDirection === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return 0;
      });

      setFilteredUsers(filtered);
      setCurrentPage(1);
    };

    filterAndSortUsers();
  }, [searchTerm, users, sortField, sortDirection]);

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPaginationButtons = () => {
    const maxVisiblePages = 5;
    const pageButtons = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pageButtons.push(
        <button
          key="first"
          onClick={() => handlePageChange(1)}
          className="w-10 h-10 mx-1 rounded-full transition-colors duration-200 bg-white text-blue-500 border border-blue-500 hover:bg-blue-100"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pageButtons.push(
          <span key="ellipsis1" className="mx-1">
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-10 h-10 mx-1 rounded-full transition-colors duration-200 ${
            currentPage === i
              ? "bg-blue-500 text-white"
              : "bg-white text-blue-500 border border-blue-500 hover:bg-blue-100"
          }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageButtons.push(
          <span key="ellipsis2" className="mx-1">
            ...
          </span>
        );
      }
      pageButtons.push(
        <button
          key="last"
          onClick={() => handlePageChange(totalPages)}
          className="w-10 h-10 mx-1 rounded-full transition-colors duration-200 bg-white text-blue-500 border border-blue-500 hover:bg-blue-100"
        >
          {totalPages}
        </button>
      );
    }

    return pageButtons;
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field)
      return <FaSort className="w-3 h-3 ms-1.5 text-gray-400" />;
    return (
      <FaSort
        className={`w-3 h-3 ms-1.5 ${
          sortDirection === "asc" ? "text-blue-500" : "text-blue-700"
        }`}
      />
    );
  };

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    userId: string;
    isActive: boolean;
    isSeller: boolean;
  } | null>(null);

  const handleContextMenu = useCallback(
    (
      e: React.MouseEvent,
      userId: string,
      isActive: boolean,
      isSeller: boolean
    ) => {
      e.preventDefault();
      const { pageX, pageY } = e;
      setContextMenu({ x: pageX, y: pageY, userId, isActive, isSeller });
    },
    []
  );

  return (
    <div className="flex-1 flex flex-col px-4 lg:px-16 ">
      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email tài khoản hoặc email thanh toán"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-12 w-full pl-10 pr-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Table */}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                <div
                  className="flex items-center cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort("fullname")}
                >
                  Tên
                  {getSortIcon("fullname")}
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                <div
                  className="flex items-center cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort("userId")}
                >
                  Email Tài Khoản
                  {getSortIcon("userId")}
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                <div
                  className="flex items-center cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort("gmail")}
                >
                  Email Thanh Toán
                  {getSortIcon("gmail")}
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                Vai Trò
              </th>
              <th scope="col" className="px-6 py-3">
                Trạng Thái
              </th>
              <th scope="col" className="px-6 py-3">
                <div
                  className="flex items-center cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort("createDate")}
                >
                  Ngày Tham Gia
                  {getSortIcon("createDate")}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr
                key={user.userId}
                onContextMenu={(e) =>
                  handleContextMenu(
                    e,
                    user.userId,
                    user.status === 1,
                    user.roles.some((role) => role.roleId === "RO2")
                  )
                }
                className="border-b hover:bg-gray-50 transition-colors duration-150 cursor-context-menu"
              >
                <td className="px-6 py-4 font-medium text-gray-900 truncate text-nowrap">
                  {user.fullname || user.username}
                </td>
                <td className="px-6 py-4 text-blue-600">{user.userId}</td>
                <td className="px-6 py-4">{user.gmail}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {user.roles.map((role, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                      >
                        {role.rolename}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 text-nowrap py-4">
                  {user.status === 1 ? (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Hoạt Động
                    </span>
                  ) : (
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Không Hoạt Động
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {new Date(user.createDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          options={[
            {
              label: "Chỉnh Sửa Người Dùng",
              icon: <FaEdit className="w-4 h-4" />,
              onClick: () => onEdit?.(contextMenu.userId),
            },
            {
              label: contextMenu.isSeller ? "Vô Hiệu Hóa Người Bán" : "",
              icon: <FaUserSlash className="w-4 h-4" />,
              onClick: () => {
                if (contextMenu.isSeller) {
                  onDisableSeller?.(contextMenu.userId);
                }
              },
              className: contextMenu.isSeller ? "text-orange-600" : "hidden",
            },
            {
              label: contextMenu.isActive
                ? "Vô Hiệu Hóa Tài Khoản"
                : "Kích Hoạt Tài Khoản",
              icon: <FaUserSlash className="w-4 h-4" />,
              onClick: () =>
                contextMenu.isActive
                  ? onDisableAccount?.(contextMenu.userId)
                  : onEnableAccount?.(contextMenu.userId),
              className: contextMenu.isActive
                ? "text-orange-600"
                : "text-green-600",
            },
            {
              label: "Đặt Lại Mật Khẩu",
              icon: <FaKey className="w-4 h-4" />,
              onClick: () => onResetPassword?.(contextMenu.userId),
            },
          ]}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-10 h-10 mx-1 rounded-full bg-white text-blue-500 border border-blue-500 hover:bg-blue-100 disabled:opacity-50"
          >
            &lt;
          </button>
          {renderPaginationButtons()}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-10 h-10 mx-1 rounded-full bg-white text-blue-500 border border-blue-500 hover:bg-blue-100 disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default UserManager;