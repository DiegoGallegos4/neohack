"use client";

import { useCallback, useEffect, useState } from "react";

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
import { Contract, parseEther } from "ethers";
import { useActiveAccount, useSendAndConfirmTransaction } from "thirdweb/react";
import { getContract, prepareContractCall } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { client } from "@/app/client";

interface InvestmentFormProps {
  propertyName: string;
  poolContract: string;
}

const tokenContract = getContract({
  address: process.env.NEXT_PUBLIC_USDE as string,
  chain: sepolia,
  client,
});

export function InvestmentForm({
  propertyName,
  poolContract,
}: InvestmentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const activeAccount = useActiveAccount();
  const [amount, setAmount] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const poolContractInstance = getContract({
    address: poolContract,
    chain: sepolia,
    client,
  });

  const {
    mutate: sendAndConfirmTx,
    error,
    isSuccess,
    isPending,
  } = useSendAndConfirmTransaction();

  const {
    mutate: sendAndConfirmDeposit,
    error: depositError,
    isSuccess: depositSuccess,
  } = useSendAndConfirmTransaction();

  useEffect(() => {
    if (isSuccess) {
      deposit();
    }
    if (error) {
      setIsLoading(false);
    }
  }, [isSuccess, error]);

  useEffect(() => {
    if (depositSuccess || depositError) {
      setIsLoading(false);
      setIsOpen(false);
      setAmount("");
      console.log(`Investment of $${amount} made for ${propertyName}`);
      toast({
        title: "Investment Submitted",
        description: `Your investment of $${Number(amount).toLocaleString()} for ${propertyName} has been submitted successfully.`,
      });
    }
  }, [depositSuccess, depositError, amount, propertyName, toast]);

  //  Define a submit handler.
  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    const weiAmount = parseEther(String(amount)).toString();

    setAmount(weiAmount);

    //approval
    const spender = process.env.NEXT_PUBLIC_SUSDE as string;
    const approvalTransaction = prepareContractCall({
      contract: tokenContract,
      method: "function approve(address spender, uint256 amount)",
      params: [spender, BigInt(weiAmount.toString())],
    });
    sendAndConfirmTx(approvalTransaction);
  }

  const deposit = useCallback(() => {
    if (!activeAccount?.address) return;
    const transaction = prepareContractCall({
      contract: poolContractInstance,
      method: "function deposit(uint256 amount)",
      params: [BigInt(amount.toString())],
    });
    console.log("transaction", transaction);
    sendAndConfirmDeposit(transaction);
  }, [
    activeAccount?.address,
    amount,
    poolContractInstance,
    sendAndConfirmDeposit,
  ]);

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
            Enter the amount you wish to invest.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4 py-4">
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
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading || isPending}>
              Submit Investment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
