interface BannerProps {
  title: string;
  description: string;
}

export default function Banner({ title, description }: BannerProps) {
  return (
    <div className="h-[30%] flex flex-col gap-4 justify-center bg-slate-900 text-white px-4 items-center">
      <h3 className="font-semibold text-xl">{title}</h3>
      <p className="prose text-white">{description}</p>

      <div className="  h-14  flex flex-row justify-between items-center w-full max-w-[300px]  lg:items-start">
        {/* <p className=" text-xl flex gap-3 items-center h-[50%] ">
          <span className="">Staked:</span>
          <span className="text-gray-500 font-semibold">
            {stakedAmount ? Number(stakedAmount) : 0}
          </span>
        </p> */}
        {/* <p className=" text-xl flex gap-3 items-center h-[50%] ">
          <span className="">Expected Reward:</span>
          <span className="text-gray-500 font-semibold">
            {usdeRatio
              ? Number(formatEther(usdeRatio.toString())).toFixed(2)
              : 0}
          </span>
        </p> */}
      </div>
    </div>
  );
}
