import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import Image from "next/image";

const Page = () => {
    return (
        <main className="flex overflow-hidden flex-col justify-center items-center px-16 py-20 min-h-screen text-sm text-black bg-lendablack max-md:px-5 w-full">
            <div className="flex flex-wrap gap-[50px] justify-between items-center px-5 py-7 w-full bg-white rounded-3xl  md:max-w-[960px] ">
                <Image
                    src={"/images/login-cover.png"}
                    width={500}
                    height={500}
                    priority={true}
                    className="object-contain self-stretch my-auto rounded-3xl aspect-[0.77] w-full md:w-1/2"
                    alt="Sign up illustration"
                />
                <div className="flex flex-1 shrink gap-2.5 items-center self-stretch p-2.5 my-auto basis-0 w-full md:w-1/2 md:pr-[40px]">
                    <ForgotPasswordForm />
                </div>
            </div>
        </main>
    );
}

export default Page;