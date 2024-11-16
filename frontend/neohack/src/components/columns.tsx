"use client";

import { Button } from "@/components/ui/button";
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import { IoTrashOutline } from "react-icons/io5";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaPencilAlt } from "react-icons/fa";
import {
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@radix-ui/react-dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import moment from "moment";
function truncateWalletAddress(address: string, startChars = 6, endChars = 4) {
  if (!address || typeof address !== "string") {
    throw new Error("Invalid wallet address");
  }

  const start = address.slice(0, startChars);
  const end = address.slice(-endChars);
  return `${start}...${end}`;
}

export type Transaction = {
  id: string;
  time: string;
  address: string;
  apy: string;
  value: string;
  action: "stake" | "unstake";
};

export const columns: ColumnDef<Transaction>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value: any) =>
  //         table.toggleAllPageRowsSelected(!!value)
  //       }
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value: any) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "time",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Time
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },

    cell: ({ row }) => (
      <p className="lowercase font-semibold">
        {formatDistanceToNow(new Date(row.getValue("time")), {
          addSuffix: true,
          includeSeconds: true,
        })}
      </p>
    ),
  },

  {
    accessorKey: "address",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Address
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },

    cell: ({ row }) => (
      <p
        onClick={() => navigator.clipboard.writeText(row.getValue("address"))}
        className="lowercase text-blue-600 cursor-pointer hover:underline"
      >
        {truncateWalletAddress(row.getValue("address"))}
      </p>
    ),
  },

  {
    accessorKey: "apy",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Apy
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase text-center">{row.getValue("apy")}</div>
    ),
  },

  {
    accessorKey: "value",
    header: () => <div className="">Value</div>,
    cell: ({ row }) => {
      const value = parseFloat(row.getValue("value"));
      return <div className=" font-medium">{value}</div>;
    },
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("action")}</div>
    ),
  },
  // {
  //   id: "actions",
  //   enableHiding: false,
  //   cell: ({ row }) => {
  //     const payment = row.original;

  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <DotsHorizontalIcon className="h-4 w-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem className="flex space-x-2 items-center cursor-pointer">
  //             <FaPencilAlt size={25} />
  //             <span>Edit</span>
  //           </DropdownMenuItem>
  //           <DropdownMenuItem className="flex space-x-2 items-center cursor-pointer">
  //             <IoTrashOutline size={25} />
  //             <span>Delete</span>
  //           </DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
];
