import React from 'react';
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <div className="flex justify-between items-center w-full mt-5 border-b-2 pb-1 sm:px-4 px-2 ">
      <Link href="/" className="flex space-x-3 ml-10">
        <Image
          alt="header text"
          src="/OpenCopilot.png"
          className="sm:w-12 sm:h-12 w-8 h-8 ml-10"
          width={32}
          height={20}
        />
        <h1 className="sm:text-4xl text-2xl font-bold ml-2 tracking-tight">
          GPT2bpftrace: Transforming natural language into a bpftrace program online
        </h1>
      </Link>
      <a
        href="https://github.com/eunomia-bpf/GPT2Bpftrace"
        target="_blank"
        rel="noreferrer"
      >
        <Image
          alt="Github Icon"
          src="/github.svg"
          className="sm:w-8 sm:h-[27px] w-8 h-[28px]"
          width={32}
          height={20}
        />
      </a>
      
    </div>
  );
}