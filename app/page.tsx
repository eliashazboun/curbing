"use client";
import HouseItem, { StatusOptions } from "@/components/house-item";
import { Button } from "@/components/ui/button";
import { db } from "@/firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  or,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { Loader2, Plus, ListChecks } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import HouseHolder from "@/components/house-item";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

export interface HouseItem {
  address: string;
  status: StatusOptions;
  id: string;
}

export default function Home() {
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const [houses, setHouses] = useState<HouseItem[]>([]);

  const router = useRouter();

  const removeHouse = (id: string) => {
    setHouses(houses.filter((house) => house.id !== id));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const colRef = collection(db, "curbing");
    try {
      const docRef = await addDoc(colRef, {
        address: address,
        status: "Unvisited",
      });

      const docSnap = await getDoc(docRef);
      const data = docSnap.data() as HouseItem;

      const house = {
        ...data,
        id: docRef.id,
      };

      setHouses((prev) => [house, ...prev]);
    } catch (err) {
      console.log(err);
    } finally {
      setAddress("");
      setLoading(false);
    }
  };

  const finishDay = () => {
    houses.forEach(async (house, idx) => {
      if (house.status === "No Answer") {
        const docRef = doc(db, "curbing", house.id);
        try {
          await updateDoc(docRef, {
            status: "Unvisited",
          });
        } catch (err) {
          console.log(err);
        } finally {
          if (idx + 1 === houses.length) {
            window.location.reload();
          }
        }
      }
      if (idx + 1 === houses.length) {
        window.location.reload();
      }
    });
  };

  const getAll = async () => {
    try {
      const curbingRef = collection(db, "curbing");
      const q = query(
        curbingRef,
        or(
          where("status", "==", "Unvisited"),
          where("status", "==", "No Answer")
        )
      );
      const querySnapshot = await getDocs(q);
      const all: HouseItem[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as HouseItem;
        const house = {
          ...data,
          id: doc.id,
        };

        all.push(house);
      });
      setHouses(all);
    } catch (err) {
      console.log(err);
    } finally {
      setInitialLoad(false);
    }
  };

  useEffect(() => {
    getAll();
  }, []);

  return (
    <div className="home ">
      <h1 className="text-center text-2xl font-bold font-mono mt-5 mb-2">
        Curbing
      </h1>
      <Separator className="mb-2" />

      {initialLoad ? (
        <Loader2 className="animate-spin m-auto" size={50} />
      ) : (
        <>
          <div className="item-container pb-10">
            {houses.length === 0 && (
              <p className="text-center">No houses, go out and find some!</p>
            )}
            {houses.map((house: HouseItem) => (
              <HouseHolder
                key={house.id}
                house={house}
                removeHouse={removeHouse}
              />
            ))}
          </div>

          <Dialog>
            <DialogTrigger>
              <ListChecks className="rounded-md h-10 w-10 p-0 fixed bottom-2 left-2 bg-black text-white" />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Complete your day?</DialogTitle>
                <DialogDescription>
                  Submit to reset all unanswered homes.
                </DialogDescription>
              </DialogHeader>

              <div className="flex justify-center gap-10">
                <DialogClose asChild>
                  <Button
                    disabled={loading}
                    type="button"
                    variant={"secondary"}
                  >
                    Close
                  </Button>
                </DialogClose>
                <Button disabled={loading} onClick={finishDay}>
                  {loading ? <Loader2 className="animate-spin" /> : "Submit"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog onOpenChange={() => setAddress("")}>
            <DialogTrigger>
              <Plus className="rounded-md h-10 w-10 p-0 fixed bottom-2 right-2 bg-black text-white" />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add House</DialogTitle>
                <DialogDescription>
                  Please enter the address of the home.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={onSubmit}>
                <Input
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mb-5"
                />
                <div className="flex justify-center gap-10">
                  <DialogClose asChild>
                    <Button
                      disabled={loading}
                      type="button"
                      variant={"secondary"}
                    >
                      Close
                    </Button>
                  </DialogClose>
                  <Button disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" /> : "Submit"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
