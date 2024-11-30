"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
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
// eslint-disable-next-line import/no-unresolved
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface InvestmentFormProps {
  propertyName: string;
  minInvestment: number;
}

export function InvestmentForm({
  propertyName,
  minInvestment,
}: InvestmentFormProps) {
  const [amount, setAmount] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (Number(amount) < minInvestment) {
      toast({
        variant: "destructive",
        title: "Invalid Investment Amount",
        description: `The minimum investment for this property is $${minInvestment.toLocaleString()}.`,
      });
      return;
    }
    // Here you would typically send the investment data to your backend
    console.log(`Investment of $${amount} made for ${propertyName}`);
    toast({
      title: "Investment Submitted",
      description: `Your investment of $${Number(amount).toLocaleString()} for ${propertyName} has been submitted successfully.`,
    });
    setIsOpen(false);
    setAmount("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" size="lg">
          Invest Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invest in {propertyName}</DialogTitle>
          <DialogDescription>
            Enter the amount you wish to invest. Minimum investment is $
            {minInvestment.toLocaleString()}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <div className="col-span-3">
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter investment amount"
                min={minInvestment}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Submit Investment</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
