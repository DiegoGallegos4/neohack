"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { formatEther, parseEther } from "ethers";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTimer } from "react-timer-hook";
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
import { useToast } from "@/hooks/use-toast";

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

interface CountdownTimerProps {
  endTime: Date;
  onComplete: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  endTime,
  onComplete,
}) => {
  const { seconds, minutes, hours, isRunning } = useTimer({
    expiryTimestamp: endTime,
    onExpire: onComplete,
  });

  return (
    <>
      <p>{`${minutes}m ${seconds}s`}</p>
      {!isRunning && <p>0s</p>}
    </>
  );
};

// component starts
export function UnStakingForm({
  refetchSusde,
  refetchUsde,
}: {
  refetchSusde: () => void;
  refetchUsde: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [coolingLoading, setCoolingLoading] = useState(false);
  const activeAccount = useActiveAccount();
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [oldValue, setOldValue] = useState<number>(0);
  const { toast } = useToast();

  const {
    mutate: sendAndConfirmUnStakeTx,
    isSuccess: unStakeSuccess,
    error: unStakeError,
    isPending: unStakePending,
  } = useSendAndConfirmTransaction();

  const {
    mutate: sendAndConfirmCoolingTx,
    isSuccess: coolingSuccess,
    error: coolingError,
    isPending: coolingPending,
  } = useSendAndConfirmTransaction();

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
  const { data: usdeRatio } = useReadContract({
    contract,
    method: "function convertToAssets(uint256) returns(uint256)",
    params: [BigInt(toWeiAmount(Number(amt) || 0))],
  });

  //  Define a submit handler.
  function startUnstake() {
    setIsLoading(true);

    if (!activeAccount?.address) return;
    const transaction = prepareContractCall({
      contract,
      method: "function unstake(address)",
      params: [activeAccount?.address],
    });
    sendAndConfirmUnStakeTx(transaction);
  }

  function startCountdown() {
    const newEndTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
    localStorage.setItem("endTime", newEndTime.toISOString());
    setEndTime(newEndTime);
  }

  function handleCompletion() {
    toast({
      title: "Cooldown status ",
      description: " Token cool-down time completed.",
    });
    localStorage.removeItem("endTime");
    setEndTime(null);
  }

  function countdownRunning(): boolean {
    if (!endTime) return false;
    return new Date() < endTime;
  }

  function startCoolDownProcess() {
    setCoolingLoading(true);
    const amt = toWeiAmount(form.getValues("amount"));

    const transaction = prepareContractCall({
      contract,
      method: "function cooldownShares(uint256)",
      params: [BigInt(amt)],
    });

    sendAndConfirmCoolingTx(transaction);
  }

  useEffect(() => {
    if (unStakeSuccess || unStakeError) {
      //remove amount set to be cooled
      localStorage.removeItem("coolAmount");
      setOldValue(0);
      setIsLoading(false);

      refetchUsde();
      refetchSusde();
      form.resetField("amount");
    }
  }, [unStakeSuccess]);

  useEffect(() => {
    if (coolingSuccess) {
      startCountdown();
      const val = oldValue + Number(form.getValues("amount"));
      //save amount being cooled
      localStorage.setItem("coolAmount", val.toString());
      setOldValue(val);
      form.resetField("amount");
      setCoolingLoading(false);
    }
    if (coolingError) {
      setCoolingLoading(false);
    }
  }, [coolingSuccess, coolingError]);

  useEffect(() => {
    const savedEndTime = localStorage.getItem("endTime");
    const oldValue = Number(localStorage.getItem("coolAmount")) || 0;
    setOldValue(oldValue);
    if (savedEndTime) {
      setEndTime(new Date(savedEndTime));
    }
  }, []);

  return (
    <Form {...form}>
      <form className="space-y-8 h-full ">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="block h-[85px] lg:h-[150px] rounded-xl  bg-gray-200">
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
                  <div className="h-[30%] flex  justify-between">
                    <div className="h-full flex px-3 gap-2">
                      <span className="text-gray-500 font-semibold text-xs">
                        USDe Ratio:
                      </span>
                      <span className="text-gray-600 text-xs font-bold">
                        {usdeRatio
                          ? Number(formatEther(usdeRatio)).toFixed(2)
                          : 0}
                      </span>
                    </div>
                    <div className="h-full flex px-3 gap-2">
                      <span className="text-gray-500 font-semibold text-xs">
                        Cooled :
                      </span>
                      <span className="text-gray-600 text-xs font-bold">
                        {countdownRunning() ? 0 : oldValue}
                      </span>
                    </div>

                    {endTime && (
                      <div className="h-full flex px-3 gap-2 whitespace-nowrap">
                        <span className="text-gray-500 font-semibold text-xs ">
                          <CountdownTimer
                            endTime={endTime}
                            onComplete={handleCompletion}
                          />
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 h-12">
          <Button
            type="button"
            onClick={startCoolDownProcess}
            variant="default"
            disabled={coolingLoading || coolingPending || countdownRunning()}
            className="w-full h-full bg-secondary text-primary hover:text-white"
          >
            {coolingLoading || coolingPending ? (
              <>
                <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-3"></span>
              </>
            ) : (
              "Cool down"
            )}
          </Button>
          <Button
            type="button"
            onClick={startUnstake}
            disabled={
              isLoading || unStakePending || oldValue == 0 || countdownRunning()
            }
            className="w-full h-full"
          >
            {isLoading || unStakePending ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></span>
              </>
            ) : (
              <>{`Claim ${oldValue}`}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
