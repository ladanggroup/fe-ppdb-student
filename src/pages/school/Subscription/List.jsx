import React, { useEffect } from "react";
import DashboardLayout from "@/layouts/school/DashboardLayout";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import formatIdr from "@/utils/formatIdr";
import useSubscriptionStore from "@/store/useSubscriptionStore";
import useAuthStore from "@/store/authStore";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useSearchParams } from "react-router";
import { Eye } from "lucide-react";
import Pagination from "@/components/Pagination";

const Subscription = () => {
  const { subscriptions, fetchSubscriptions, loading } = useSubscriptionStore();
  const { user } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;

  useEffect(() => {
    fetchSubscriptions(user.school_id, page);
  }, [fetchSubscriptions, user.school_id, page]);

  const handlePageChange = (page) => {
    setSearchParams({ page });
    fetchSubscriptions(user.school_id, page);
  };

  const hasVerify = subscriptions?.data?.some((sub) => sub.status === "verify");

  const hasReject = subscriptions?.data?.some((sub) => sub.status === "rejected");

  const STATUS_MAP = {
    active: {
      label: "Aktif",
      className:
        "bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium",
    },
    verify: {
      label: "Menunggu Verifikasi",
      className:
        "bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-xs font-medium",
    },
    rejected: {
      label: "Ditolak",
      className:
        "bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-medium",
    },
    expired: {
      label: "Kadaluarsa",
      className:
        "bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-medium",
    },
    default: {
      label: "Tidak Diketahui",
      className:
        "bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium",
    },
  };

  const getStatus = (status) => {
    return STATUS_MAP[status] || STATUS_MAP.default;
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Langganan Sekolah</h1>
          <Link to="/school/subscription/create">
            <Button className="bg-sky-500 hover:bg-sky-600 text-white">
              Tambah Langganan
            </Button>
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
          </div>
        ) : subscriptions.length === 0 ? (
          <p className="text-gray-600 dark:text-white">
            Belum ada data langganan.
          </p>
        ) : (
          <Card className="border border-sky-100 dark:border-[#1f2937]">
            <CardContent className="bg-sky-100 dark:bg-[#1f2937] rounded-xl">
              {loading ? (
                <p>Loading...</p>
              ) : (
                <Table>
                  <TableHeader className="">
                    <TableRow>
                      <TableHead className="text-gray-600 dark:text-white px-3 py-4">
                        No.
                      </TableHead>
                      <TableHead className="text-gray-600 dark:text-white">
                        Nama Langganan
                      </TableHead>
                      <TableHead className="text-gray-600 dark:text-white">
                        Tanggal Langganan
                      </TableHead>
                      <TableHead className="text-gray-600 dark:text-white">
                        Periode
                      </TableHead>
                      <TableHead className="text-gray-600 dark:text-white">
                        Harga
                      </TableHead>
                      {/* <TableHead className="text-gray-600 dark:text-white">
                        Fitur
                      </TableHead> */}
                      <TableHead className="text-gray-600 dark:text-white">
                        Status
                      </TableHead>
                      {(hasVerify || hasReject) && (
                        <TableHead className="text-gray-600 dark:text-white">
                          Aksi
                        </TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscriptions?.data?.map((sub, index) => (
                      <TableRow
                        key={sub.id}
                        className="hover:bg-sky-200 dark:hover:bg-gray-500"
                      >
                        <TableCell className="text-gray-600 dark:text-white px-3 py-4">
                          {subscriptions.from + index}
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-white px-3 py-4">
                          {sub.name}
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-white px-3 py-4">
                          {sub.start_date ?? "-"} s/d {sub.end_date ?? "-"}
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-white px-3 py-4">
                          {sub.duration} Bulan
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-white px-3 py-4">
                          {formatIdr(sub.price)}
                        </TableCell>
                        {/* <TableCell className="text-gray-600 dark:text-white px-3 py-4">
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
                        </TableCell> */}
                        <TableCell className="text-gray-600 dark:text-white px-3 py-4">
                          <span
                            className={`${
                              getStatus(sub.status).className
                            } inline-flex items-center whitespace-nowrap`}
                          >
                            {getStatus(sub.status).label}
                          </span>
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-white px-3 py-4">
                          {(sub.status === "verify" || sub.status === "rejected") && (
                            <Link
                              className="flex items-center justify-center bg-sky-500 hover:bg-sky-600 text-white px-2 py-1 rounded-md"
                              to={`/school/subscription/${sub.id}/show`}
                            >
                              <Eye className="w-5 h-5" />
                            </Link>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {/* Pagination */}
              <Pagination
                pagination={subscriptions}
                onPageChange={handlePageChange}
                className="bg-sky-200 dark:bg-sky-900 hover:bg-sky-300 dark:hover:bg-sky-700"
              />
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Subscription;
