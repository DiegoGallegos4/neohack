"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { formatEther, parseEther } from "ethers";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getContract, prepareContractCall } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import {
  useActiveAccount,
  useReadContract,
  useSendAndConfirmTransaction,
} from "thirdweb/react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { client } from "../../app/client";

const formSchema = z.object({
  amount: z
    .string()
    .transform((val) => parseFloat(val)) // Convert string to number
    .refine((val) => val !== 0, {
      message: "Amount to stake must be greater than zero.",
    }),
});

const contract = getContract({
  address: process.env.NEXT_PUBLIC_SUSDE as string,
  chain: sepolia,
  client,
});

const tokenContract = getContract({
  address: process.env.NEXT_PUBLIC_USDE as string,
  chain: sepolia,
  client,
});

export function StakingForm({
  refetchSusde,
  refetchUsde,
}: {
  refetchSusde: () => void;
  refetchUsde: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const activeAccount = useActiveAccount();

  const {
    mutate: sendAndConfirmTx,
    error,
    isSuccess,
    isPending,
  } = useSendAndConfirmTransaction();
  const {
    mutate: sendAndConfirmStakeTx,
    isSuccess: stakeSuccess,
    error: stakeError,
  } = useSendAndConfirmTransaction();

  const [amount, setAmount] = useState("");

  // define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
    },
  });

  function toWeiAmount(amt: number) {
    return parseEther(String(amt)).toString();
  }

  const amt = form.watch("amount");
  const { data: susdeRatio } = useReadContract({
    contract,
    method: "function convertToShares(uint256) returns(uint256)",
    params: [BigInt(toWeiAmount(Number(amt) || 0))],
  });

  //  Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const weiAmount = toWeiAmount(values.amount);

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

  function stake() {
    if (!activeAccount?.address) return;
    const transaction = prepareContractCall({
      contract,
      method: "function deposit(uint256, address)",
      params: [BigInt(amount), activeAccount?.address],
    });
    sendAndConfirmStakeTx(transaction);
  }

  useEffect(() => {
    if (isSuccess) {
      stake();
    }
    if (error) {
      setIsLoading(false);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (stakeSuccess || stakeError) {
      setIsLoading(false);
      //refetch data
      refetchUsde();
      refetchSusde();
      form.resetField("amount");
    }
  }, [stakeSuccess]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 h-full "
      >
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="block h-[100px] lg:h-[150px] rounded-xl  bg-gray-200 ">
              <FormControl className=" ">
                <div className="h-full ">
                  <div className=" h-[70%]">
                    {" "}
                    <Input
                      type="number"
                      placeholder="0.00"
                      min={0}
                      {...field}
                      className="h-full w-full border-transparent outline-transparent ring-transparent shadow-none font-semibold text-3xl "
                    />
                  </div>
                  <div className="h-[30%] flex px-3 gap-2">
                    <span className="text-gray-500 font-semibold text-xs">
                      SUSDe Ratio:
                    </span>
                    <span className="text-gray-600 text-xs font-bold">
                      {susdeRatio
                        ? Number(formatEther(susdeRatio)).toFixed(2)
                        : 0}
                    </span>
                  </div>
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isLoading || isPending}
          className="w-full h-12"
        >
          {isLoading || isPending ? (
            <>
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></span>
            </>
          ) : (
            "Stake"
          )}
        </Button>
      </form>
    </Form>
  );
}
