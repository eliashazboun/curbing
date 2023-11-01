"use client";
import React, { useState } from "react";
import { Check, X, Ban, MoreHorizontal, Trash ,Loader2} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/firebase";

import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { HouseItem } from "@/app/page";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "./ui/button";

export type StatusOptions = "Unvisited" | "Accepted" | "Declined" | "No Answer";

interface HouseHolderProps {
  house: HouseItem;
  removeHouse: (id:string) => void
}

const HouseHolder: React.FC<HouseHolderProps> = ({ 
  house,
  removeHouse
}) => {
  const [status, setStatus] = useState<StatusOptions>(house.status);
  const [loading, setLoading] = useState<boolean>(false)

  const handleClick = async (newStatus: StatusOptions) => {
    setStatus(newStatus);
    const docRef = doc(db, "curbing", house.id);
    await updateDoc(docRef, {
      status: newStatus,
    });
  };

  const handleDelete = async () => {
    setLoading(true)
    try{
      await deleteDoc(doc(db,'curbing',house.id))
      removeHouse(house.id)
    }catch(err){
      console.log(err)
    }finally{
      setLoading(false)
    }

  }
  return (
    <div className="house-item mb-4 relative">
      <Card className="p-1">
        <CardContent>
          <div className="grid grid-cols-2 gap-4 justify-evenly items-center">
            <p className="font-semibold">{house.address}</p>
            <Badge
              
              variant={"default"}
              className={cn(
                "text-center pointer-events-none",
                status === "Accepted"
                  ? "bg-green-400"
                  : status === "Declined"
                  ? "bg-red-400"
                  : status === "No Answer"
                  ? "bg-orange-400"
                  : ""
              )}
            >
              <p className=" w-full">{status}</p>
            </Badge>
          </div>
          <Separator className="w-[90%] m-auto mb-6 mt-3" />
          <div className="flex justify-evenly">
            <button
              className="bg-green-400 p-2 inline border border-black select-none rounded-md"
              onClick={() => handleClick("Accepted")}
            >
              <Check className="text-white" />
            </button>
            <button
              className="bg-red-400 p-2 border border-black select-none rounded-md"
              onClick={() => handleClick("Declined")}
            >
              <X className="text-white" />
            </button>
            <button
              className="bg-orange-400 p-2 border border-black select-none rounded-md relative"
              onClick={() => handleClick("No Answer")}
            >
              <Ban className="text-white" />
            </button>
          </div>
          <div className="absolute bottom-0 right-3 ">
            <Popover modal={true}>
              <PopoverTrigger>
                <Trash/>
              </PopoverTrigger>
              <PopoverContent>
                <div className="text-center">  
                  <p className="text-center">Are you sure you want to delete {house.address}?</p>
                  <Button onClick={handleDelete} className="mt-4 ">{loading ? <Loader2 className="animate-spin"/> : "Yes, delete it."}</Button>
                  <p className="text-sm text-gray-500">(Click away to cancel)</p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HouseHolder;
