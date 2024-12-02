interface BannerProps {
  title: string;
  description: string;
}

export default function Banner({ title, description }: BannerProps) {
  return (
    <div className="h-[30%] py-4 flex flex-col gap-4 justify-center bg-slate-900 text-white px-4 items-center">
      <h3 className="font-semibold text-xl">{title}</h3>
      <p className="prose text-white">{description}</p>
    </div>
  );
}
