// src/pages/admin/Subscription/SubscriptionList.jsx
import React, { useEffect, useState } from "react";
import useSubscriptionStore from "@/store/useSubscriptionStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Pagination from "@/components/Pagination";
import { Link, useSearchParams, Outlet } from "react-router";
import DashboardLayout from "@/layouts/admin/DashboardLayout";
import LoadingOverlay from "@/components/LoadingOverlay";
import { CheckCircle, Eye, Ban } from "lucide-react";
import RejectDialog from "@/components/RejectDialog";

export default function List() {
  const {
    subscriptionsAdmin,
    listAdmin,
    verifyAdmin,
    rejectAdmin,
    loading,
    error,
  } = useSubscriptionStore();

  const [searchParams, setSearchParams] = useSearchParams();
  const [status, setStatus] = useState(searchParams.get("status") || ""); // default kosong → semua tampil
  const page = Number(searchParams.get("page")) || 1;

  const handleVerify = async (id) => {
    await verifyAdmin(id);
    listAdmin(page, status);
  };

  const handleReject = async (id) => {
    await rejectAdmin(id);
    listAdmin(page, status);
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage, status });
  };

  const statusSubscriptions = [
    { label: "Semua", value: "" },
    { label: "Verifikasi", value: "verify" },
    { label: "Aktif", value: "active" },
    { label: "Expired", value: "expired" },
    { label: "Ditolak", value: "rejected" },
    { label: "Dibatalkan", value: "canceled" },
  ];

  useEffect(() => {
    const timeout = setTimeout(() => {
      listAdmin(page, status);
    }, 500); // debounce 500ms

    return () => clearTimeout(timeout);
  }, [page, status, listAdmin]);

  console.log(subscriptionsAdmin);

  return (
    <DashboardLayout>
      {/* overlay loading */}
      {loading && <LoadingOverlay />}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Daftar Langganan</h1>

        <Tabs value={status} onValueChange={setStatus} className="w-auto">
          <TabsList className=" bg-teal-100 dark:bg-[#1f2d3a]">
            <TabsTrigger
              className="hover:bg-teal-200 dark:hover:bg-gray-300 text-teal-600 dark:text-gray-500"
              value=""
            >
              Semua
            </TabsTrigger>
            <TabsTrigger
              className="hover:bg-teal-200 dark:hover:bg-gray-300 text-teal-600 dark:text-gray-500"
              value="verify"
            >
              Verifikasi
            </TabsTrigger>
            <TabsTrigger
              className="hover:bg-teal-200 dark:hover:bg-gray-300 text-teal-600 dark:text-gray-500"
              value="active"
            >
              Aktif
            </TabsTrigger>
            <TabsTrigger
              className="hover:bg-teal-200 dark:hover:bg-gray-300 text-teal-600 dark:text-gray-500"
              value="expired"
            >
              Expired
            </TabsTrigger>
            <TabsTrigger
              className="hover:bg-teal-200 dark:hover:bg-gray-300 text-teal-600 dark:text-gray-500"
              value="rejected"
            >
              Ditolak
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <Card className="border border-teal-100 dark:border-[#1f2937]">
        <CardContent className="bg-teal-100 dark:bg-[#1f2937]">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-600 dark:text-white">
                    ID
                  </TableHead>
                  <TableHead className="text-gray-600 dark:text-white">
                    Sekolah
                  </TableHead>
                  <TableHead className="text-gray-600 dark:text-white">
                    Status
                  </TableHead>
                  <TableHead className="text-gray-600 dark:text-white">
                    Start Date
                  </TableHead>
                  <TableHead className="text-gray-600 dark:text-white">
                    End Date
                  </TableHead>
                  <TableHead className="text-gray-600 dark:text-white">
                    Fitur
                  </TableHead>
                  <TableHead className="text-gray-600 dark:text-white">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptionsAdmin?.data?.map((sub, index) => (
                  <TableRow
                    key={sub.id}
                    className="hover:bg-teal-200 dark:hover:bg-gray-500"
                  >
                    <TableCell className="text-gray-600 dark:text-white px-3 py-4">
                      {subscriptionsAdmin.from + index}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-white px-3 py-4">
                      {sub.school?.name ?? "-"}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-white px-3 py-4">
                      {statusSubscriptions.find((s) => s.value === sub.status)
                        ?.label ?? "-"}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-white px-3 py-4">
                      {sub.start_date ?? "-"}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-white px-3 py-4">
                      {sub.end_date ?? "-"}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-white px-3 py-4">
                      {sub.features && sub.features.length > 0 ? (
                        <div>
                          {sub.features.map((f, i) => (
                            <React.Fragment key={i}>
                              {f.name}
                              {i < sub.features.length - 1 && ", "}
                              {(i + 1) % 2 === 0 && <br />}
                            </React.Fragment>
                          ))}
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="flex items-center gap-2">
                      {sub.status === "verify" && (
                        <>
                          {/* Verifikasi */}
                          <Button
                            size="sm"
                            className="bg-teal-600 text-white hover:bg-teal-500"
                            onClick={() => handleVerify(sub.id)}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          {/* Tolak */}
                          <RejectDialog
                            onConfirm={handleReject}
                            triggerLabel={<Ban className="w-4 h-4" />}
                          />
                        </>
                      )}
                      {sub.status === "rejected" && (
                        <Button
                          size="sm"
                          className="bg-teal-600 text-white hover:bg-teal-500"
                          onClick={() => handleVerify(sub.id)}
                        >
                          {/* Verifikasi */}
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                      <Link
                        to={`/admin/subscription/${sub.id}/verify`}
                        className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-md"
                      >
                        <Eye className="w-4 h-4" />
                        {/* Lihat */}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          <Pagination
            pagination={subscriptionsAdmin}
            onPageChange={handlePageChange}
          />
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
