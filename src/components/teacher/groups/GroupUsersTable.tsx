"use client";
import { FC, useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Avatar,
  Paper,
  InputAdornment,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { Loader2, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface User {
  id: string;
  name: string;
  email: string;
  photoURL: string;
}

interface GroupUsersTableProps {
  groupId: string;
}

const GroupUsersTable: FC<GroupUsersTableProps> = ({ groupId }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchGroupUsers = async () => {
      try {
        const response = await fetch(`/api/getGroupUsers?groupId=${groupId}`);
        const data = await response.json();
        setUsers(data.users);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching group users:", error);
        setIsLoading(false);
      }
    };

    fetchGroupUsers();
  }, [groupId]);

  const handleRowClick = (userId: string) => {
    router.push(`/t/groups/${groupId}/${userId}`);
  };

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (user) =>
          user.name &&
          user.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [searchTerm, users]
  );

  return (
    <div className="space-y-4 w-full h-full">
      <TextField
        label="Search Users"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by name or email"
        className="mb-4 w-[30%]"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search className="w-5 h-5" />
            </InputAdornment>
          ),
        }}
      />
      {isLoading ? (
        <div className="w-full h-full flex flex-col justify-center items-center flex-grow pt-20 ">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <TableContainer className="rounded-lg border">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>

                <TableCell>Email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow
                  key={user.id}
                  onClick={() => handleRowClick(user.id)}
                  className="cursor-pointer hover:bg-slate-100"
                >
                  <TableCell className="flex justify-start items-center gap-3">
                    <Avatar
                      alt={user.name}
                      src={user.photoURL}
                      sx={{ width: 30, height: 30 }}
                    />
                    <p className="font-medium">{user.name}</p>
                  </TableCell>

                  <TableCell>{user.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default GroupUsersTable;
