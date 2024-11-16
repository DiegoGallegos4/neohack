"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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

const formSchema = z.object({
  amount: z.number().gt(0, {
    message: "Amount must be more than 0.",
  }),
});

export function StakingForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: undefined,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
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
                      Balance:
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
          Stake
        </Button>
      </form>
    </Form>
  );
}
