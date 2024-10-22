// components/UsersSection.tsx
'use client';

import { FaUserAlt, FaTrashAlt } from 'react-icons/fa';
import { Button } from '@/Components/ui/button';
import { Card } from '@/Components/ui/card';
import { useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const initialUsers: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
];

export default function UsersSection() {
  const [users, setUsers] = useState(initialUsers);

  const handleDelete = (id: number) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <Card className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-green-500">Users</h2>
      <div className="overflow-x-auto">
        <table className="min-w
