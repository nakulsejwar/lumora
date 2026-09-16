"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { XIcon } from "lucide-react";
import { useNickNameModal } from "@/lib/hooks/use-nickname-modal";
import { Button } from "../ui/button";
import React from "react";
// import { updateUser } from "@/actions/update-user";
import { useQueryClient } from "@tanstack/react-query";
import { getToken } from "@/lib/utils/utils.client";
import axios from "axios";
import { useAuthUserStore } from "@/lib/hooks/use-auth-user";
export const NickNameModal = () => {
  const queryclient = useQueryClient();
  const nickNameModal = useNickNameModal();
  const { authUser } = useAuthUserStore();
  const [name, setName] = React.useState<string>("");

  const updateUser = async (content: string) => {
    const token = await getToken();

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/lumora/set-user-data/`,
        content,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      return data;
    } catch (error) {
      throw new Error("Error fetching user data");
    }
  };

  const handleNickName = async () => {
    try {
      await updateUser(
        JSON.stringify({
          username: name,
          email: authUser.email,
          image: authUser.image,
        })
      );
      queryclient.invalidateQueries({ queryKey: ["currentAuthUserData"] });
      nickNameModal.onClose();
    } catch (error) {
      // console.log(error);
      console.log("");
    }
  };
  return (
    <Dialog open={nickNameModal.isOpen} onOpenChange={nickNameModal.onClose}>
      <DialogContent className=" p-5 overflow-hidden border-none bg-transparent shadow-none  ">
        <Card className="  border border-blue-200 relative">
          <XIcon
            onClick={nickNameModal.onClose}
            className="absolute top-2 right-2 text-blue-300 cursor-pointer"
          />
          <CardContent className="flex flex-col  px-5 py-6 text-sm ">
            <h3 className="text-lg py-2">What should we call you ?</h3>
            <input
              type="text"
              className="border border-blue-300 rounded-lg p-2 w-full"
              placeholder="Enter your nickname"
              onChange={(e) => setName(e.target.value)}
            />

            <Button
              onClick={handleNickName}
              className="w-1/3 mt-2 rounded-full"
              variant="theme"
            >
              Continue
            </Button>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
