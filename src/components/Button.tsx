import {
  useAccount,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import abi from "@/abi/abi.json";
import tokenAbi from "@/abi/token.json";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const OLD_TOKEN = "0x61B83eDF87Ea662C695439A807c386455c9E797C";
const NEW_TOKEN = "0xB2CdD9F28F1A216547d23A3022A2d83693d10DED";
const CONTRACT = "0xCDB5FF1C441f454726cf8EE253409451fA2c620E";

const Button: React.FC = () => {
  const [allError, isError] = useState(false);
  const [approveBalance, setApproveBalance] = useState(0);
  const [isApproving, setIsApproving] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const { address, isConnected } = useAccount();
  const [transactionHash, setTransactionHash] = useState<`0x${string}`>();
  const [userBalanceFrom, setUserBalance] = useState(0);
  const [userBalanceFromNew, setUserBalanceNew] = useState(0);

  const contractRead = useContractRead({
    address: OLD_TOKEN,
    abi: tokenAbi,
    functionName: "allowance",
    args: [address, CONTRACT],
    watch: true,
  });

  const userBalance = useContractRead({
    address: OLD_TOKEN,
    abi: tokenAbi,
    functionName: "balanceOf",
    args: [address],
    watch: true,
  });

  const userBalanceNew = useContractRead({
    address: NEW_TOKEN,
    abi: tokenAbi,
    functionName: "balanceOf",
    args: [address],
    watch: true,
  });

  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: OLD_TOKEN,
    abi: tokenAbi,
    functionName: "approve",
    args: [CONTRACT, userBalance.data],
    onSettled(data, error) {
      console.log(data);
    },
    onError(error) {
      console.log(error.message);
      toast.error("Failed to approve tokens: " + error);
      setIsApproving(false);
    },
    onSuccess(data) {
      setTransactionHash(data.hash);
      toast.success("Transaction successfully sent 👌");
    },
  });

  const upgrade = useContractWrite({
    address: CONTRACT,
    abi: abi,
    functionName: "upgrade",
    args: [1 * 10 ** 18],
    onSettled(data, error) {
      console.log(data);
    },
    onError(error) {
      console.log(error.message);
      toast.error("Failed to send: " + error);
      setIsUpgrading(false);
    },
    onSuccess(data) {
      setTransactionHash(data.hash);
      toast.success("Transaction successfully sent 👌");
      setIsUpgrading(false);
    },
  });

  // const transactionData = useWaitForTransaction({
  //   hash: transactionHash,
  //   enabled: false,
  // });

  // console.log(transactionData.data);

  useEffect(() => {
    setApproveBalance(Number(contractRead.data) / 10 ** 18);
    setUserBalance(Number(userBalance.data) / 10 ** 18);
    setUserBalanceNew(Number(userBalanceNew.data) / 10 ** 18);
  }, [contractRead.data, userBalance.data, userBalanceNew.data]);
  //console.log(Number(contractRead.data));
  // console.log((Number(userBalance.data) / 10 ** 18).toFixed(10));

  async function Call() {
    if (isApproving) return;
    write?.();
    setIsApproving(true);
  }

  async function Upgrade() {
    if (isUpgrading) return;
    upgrade?.write();
    setIsUpgrading(true);
  }

  return (
    <div className="flex flex-col justify-center item-center mt-80 rounded-lg border-2 border-[#22c55e4d] max-w-[350px] md:max-w-[600px] mx-auto p-10">
      <div className="text-black mb-2 grid grid-rows-3 grid-flow-col gap-4 ">
        <div className="flex row-span-3 ">Wallet Balance :</div>
        <div className="col-span-2">
          {userBalanceFrom ? userBalanceFrom : 0}{" "}
          <span className="font-bold">(OLD 4TOKEN)</span>
        </div>
        <div className="row-span-2 col-span-2">
          {userBalanceFromNew ? userBalanceFromNew : 0}{" "}
          <span className="font-bold">(NEW 4TOKEN)</span>
        </div>
      </div>

      {userBalanceFrom > 1 ? (
        approveBalance > 0 ? (
          <button
            className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-[150px]] ${
              isUpgrading ? "opacity-25 cursor-not-allowed" : ""
            }`}
            onClick={() => Upgrade()}
          >
            {isUpgrading ? "Upgrading..." : "Upgrade"}
          </button>
        ) : isConnected ? (
          <button
            className={`bg-[#02ad02] ${
              isApproving ? "" : "hover:bg-green-700"
            } text-white font-bold py-2 px-4 rounded ${
              isApproving ? "opacity-25 cursor-not-allowed" : ""
            }`}
            onClick={() => Call()}
            disabled={isApproving}
          >
            {isApproving ? "Approving..." : "Approve"}
          </button>
        ) : (
          <button
            className={`bg-[#02ad02] ${
              isApproving ? "" : "hover:bg-green-700"
            } text-white font-bold py-2 px-4 rounded 
            opacity-25 cursor-not-allowed
          }`}
            onClick={() => Call()}
            disabled={isApproving}
          >
            Connect Wallet
          </button>
        )
      ) : (
        <button
          className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-[150px]] opacity-25 cursor-not-allowed`}
        >
          Your token balance is low
        </button>
      )}
    </div>
  );
};

export default Button;
