import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: "provide" | "borrow";
  asset: string;
}

export function ActionModal({
  isOpen,
  onClose,
  action,
  asset,
}: ActionModalProps) {
  const [amount, setAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for actual transaction logic
    console.log(`${action} ${amount} ${asset}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-secondary text-foreground">
        <DialogHeader>
          <DialogTitle>
            {action === "provide" ? "Provide Collateral" : "Borrow Asset"}
          </DialogTitle>
          <DialogDescription>
            {action === "provide"
              ? "Enter the amount of collateral you want to provide."
              : "Enter the amount you want to borrow."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="col-span-3 bg-background text-foreground"
                placeholder={`Enter ${asset} amount`}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" variant="secondary">
              {action === "provide" ? "Supply" : "Borrow"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
