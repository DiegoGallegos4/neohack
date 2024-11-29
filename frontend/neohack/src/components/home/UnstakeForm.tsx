"use client";
import { ethers } from "ethers";

import abi from "@/abis/StakingVault.json";
import { useActiveAccount, useSendBatchTransaction } from "thirdweb/react";
import { approve, transferFrom } from "thirdweb/extensions/erc20";

import { getContract, prepareContractCall } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { useSendTransaction } from "thirdweb/react";
import { useSendAndConfirmTransaction } from "thirdweb/react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { client } from "../../app/client";
import { useEffect, useState } from "react";

const formSchema = z.object({
  amount: z
    .string()
    .transform((val) => parseFloat(val)) // Convert string to number
    .refine((val) => val !== 0, {
      message: "Amount to stake must be greater than zero.",
    }),
});

const contract = getContract({
  address: process.env.NEXT_PUBLIC_STAKING_VAULT as string,
  chain: sepolia,
  client,
});

const tokenContract = getContract({
  address: process.env.NEXT_PUBLIC_USDE as string,
  chain: sepolia,
  client,
});

export function UnStakingForm() {
  const {
    mutate: sendAndConfirmTx,
    data: transactionReceipt,
    error,
    isSuccess,
  } = useSendAndConfirmTransaction();
  const {
    mutate: sendAndConfirmStakeTx,
    isSuccess: stakeSuccess,
    error: stakeError,
  } = useSendAndConfirmTransaction();

  console.log(stakeError, stakeSuccess);
  const [amount, setAmount] = useState("");

  // define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: undefined,
    },
  });

  //  Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    const weiAmount = ethers.utils.parseUnits(String(values.amount), "ether");

    setAmount(weiAmount.toString());

    //approval
    const spender = process.env.NEXT_PUBLIC_STAKING_VAULT as string;
    const approvalTransaction = prepareContractCall({
      contract: tokenContract,
      method: "function approve(address spender, uint256 amount)",
      params: [spender, BigInt(weiAmount.toString())],
    });
    sendAndConfirmTx(approvalTransaction);
  }

  function stake() {
    console.log("ok");
    const transaction = prepareContractCall({
      contract,
      method: "function stake(uint256 amount)",
      params: [BigInt(amount)],
    });
    sendAndConfirmStakeTx(transaction);
  }

  useEffect(() => {
    if (isSuccess) {
      stake();
    }
  }, [isSuccess]);

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
            <FormItem className="block h-[100px] rounded-xl  bg-gray-200 ">
              <FormControl className=" ">
                <div className="h-full ">
                  <div className=" h-[70%]">
                    {" "}
                    <Input
                      type="number"
                      placeholder="0.00"
                      {...field}
                      className="h-full w-full border-transparent outline-transparent ring-transparent shadow-none font-semibold text-xl "
                    />
                  </div>
                  <div className="h-[30%] flex px-3 gap-2">
                    <span className="text-gray-500 font-semibold text-xs">
                      Matching USDe:
                    </span>
                    <span className="text-gray-600 text-xs font-bold">
                      00.0
                    </span>
                  </div>
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full h-12">
          UnStake
        </Button>
      </form>
    </Form>
  );
}
