import Image from "next/image";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Button from "@/components/Button";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>IgnoreFud Token Upgrade</title>
        <meta name="description" content="IgnoreFud token upgrade" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Header />
      <Button />
    </>
  );
}
