import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function BankSelectedCard({ bank, className }) {
  return (
    <Card className={className}>
      <CardHeader>
        {!bank ? (
          <>
            <CardTitle>Bank belum dipilih</CardTitle>
            <CardDescription>
              Silakan pilih bank tujuan transfer.
            </CardDescription>
          </>
        ) : (
          <>
            <CardTitle>{bank.name}</CardTitle>
            <CardDescription>
              {bank.account_number} — {bank.account_name}
            </CardDescription>
          </>
        )}
      </CardHeader>
    </Card>
  );
}
