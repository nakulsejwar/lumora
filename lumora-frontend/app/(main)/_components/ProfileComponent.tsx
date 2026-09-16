"use client";

import { useGlobalContext } from "@/components/providers/GlobalProvider";
import { getToken } from "@/lib/utils/utils.client";
import { Avatar } from "@/types/types";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { FC, useState } from "react";
import Modal from "react-modal";
import { useToast } from "@/components/ui/use-toast";
import { useAuthUserStore } from "@/lib/hooks/use-auth-user";
import { Button } from "@/components/ui/button";

const ProfileComponent = () => {
  const { userAvatar, setUserAvatar, userAvatarArray } = useGlobalContext();
  const queryCleint = useQueryClient();
  const { authUser } = useAuthUserStore();
  const [selectedAvatar, setSelectedAvatar] = useState(authUser.image);

  const { toast } = useToast();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const setModalIsOpenToTrue = () => {
    setModalIsOpen(true);
  };

  const setModalIsOpenToFalse = () => {
    setModalIsOpen(false);
  };

  // avatar modal
  const [avatarModalIsOpen, setAvatarModalIsOpen] = useState(false);
  const setAvatarModalIsOpenToTrue = () => {
    setAvatarModalIsOpen(true);
  };

  const setAvatarModalIsOpenToFalse = () => {
    setAvatarModalIsOpen(false);
  };

  const handleAvatarChange = async () => {
    try {
      const token = await getToken();
      const link = `${process.env.NEXT_PUBLIC_API_URL}/lumora/`;
      const response = await fetch(link + "set-user-data/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          email: authUser.email,
          username: authUser.name,
          image: selectedAvatar,
        }),
      });

      const json = await response.json();

      if (json["Notification-text"] === "failed") {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Please try again later!",
        });
      } else {
        setUserAvatar(selectedAvatar!);
        toast({
          title: json["Notification-text"],
        });
        queryCleint.invalidateQueries({
          queryKey: ["currentAuthUserData"],
        });
      }
    } catch (error) {
      // console.log("error", error);
      console.log("");
    }
  };

  if (authUser && Object.keys(authUser).length === 0)
    return <div>loading...</div>;

  return (
    <div className=" rounded-lg  flex flex-col items-center w-full  pt-8 md:pt-10 min-h-screen">
      <div className="title-container block uppercase tracking-wide text-gray-700 text-xl font-bold mb-2">
        <h1>Your Account Details</h1>
      </div>

      <div className="max-w-md p-8 sm:flex sm:space-x-6 text-gray-900 ">
        <div className="flex flex-col items-center justify-center  w-full sm:h-32 mb-6 sm:mb-0">
          <Image
            width={100}
            height={100}
            src={authUser.image ? authUser.image : userAvatar}
            alt=""
            className="object-cover object-center w-32  rounded-full bg-gray-500"
          />
          <p
            className="text-center cursor-pointer bg-gradient-to-r from-yellow-800 to-red-700 to-20%  text-transparent bg-clip-text"
            onClick={setAvatarModalIsOpenToTrue}
          >
            {" "}
            Edit
          </p>
        </div>
        <div className="flex flex-col space-y-1">
          <div>
            <h2 className="text-2xl  ">{authUser.name}</h2>
            {/* <span className="text-sm text-gray-400">Premium Userr</span> */}
          </div>
          <div className="space-y-1">
            <span className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                aria-label="Email address"
                className="w-4 h-4"
              >
                <path
                  fill="currentColor"
                  d="M274.6,25.623a32.006,32.006,0,0,0-37.2,0L16,183.766V496H496V183.766ZM464,402.693,339.97,322.96,464,226.492ZM256,51.662,454.429,193.4,311.434,304.615,256,268.979l-55.434,35.636L57.571,193.4ZM48,226.492,172.03,322.96,48,402.693ZM464,464H48V440.735L256,307.021,464,440.735Z"
                ></path>
              </svg>
              <span className="text-gray-500">{authUser.email}</span>
            </span>
            {/* <span className="flex items-center space-x-2">
              <span className="text-gray-500">Referral Code: </span>
              <span>{userReferral}</span>
            </span> */}
          </div>
        </div>
      </div>
      <div className=" hidden  items-center justify-center gap-5 w-full">
        <Link href="/dashboard">
          <button className="flex justify-center gap-1 py-1 px-4 bg-customThemePrimary to-20% rounded-full text-xs   text-gray-200 shadow-md  my-5">
            Back
          </button>
        </Link>
        <button
          className="py-1 px-4 bg-customThemePrimary to-20% rounded-full text-xs   text-gray-200 shadow-md "
          onClick={setModalIsOpenToTrue}
        >
          Change Password
        </button>
      </div>

      {/* <Modal
    isOpen={modalIsOpen}
    className=" max-w-md z-50 mx-5 sm:mx-auto my-10 md:my-16 rounded-lg shadow-lg text-center"
    overlayClassName="bg-black z-50 bg-opacity-60 fixed inset-0 overflow-y-auto"
    onRequestClose={() => setModalIsOpen(false)}
  >
    <button
      onClick={setModalIsOpenToFalse}
      className=" px-2 pb-1 button rounded-lg shadow-lg focus:outline-none cursor-pointer hover:bg-red-800 hover:text-white bg-gradient-to-r from-yellow-200 to-red-200 text-sm   flex-shrink"
    >
      x
    </button>
    <ChangePassword onClick={setModalIsOpenToFalse} />
  </Modal> */}

      {/* avatar modal */}
      <Modal
        isOpen={avatarModalIsOpen}
        className=" max-w-md z-50 mx-5 sm:mx-auto my-10 md:my-16 focus:outline-none rounded-lg shadow-lg text-center"
        overlayClassName="bg-black z-50 bg-opacity-60 fixed inset-0 overflow-y-auto"
        onRequestClose={() => setAvatarModalIsOpen(false)}
      >
        <button
          onClick={setAvatarModalIsOpenToFalse}
          className="flex justify-start mb-1  px-2 pb-1 button rounded-lg shadow-lg focus:outline-none cursor-pointer hover:bg-red-800 hover:text-white bg-yellow-400 text-sm   flex-shrink"
        >
          x
        </button>
        <div className="bg-white p-5 rounded-xl">
          <div className="grid grid-cols-3 gap-2 mb-2 justify-items-center">
            {userAvatarArray.map((item: Avatar) => (
              <Image
                key={item.id}
                onClick={() => setSelectedAvatar(item.url)}
                src={item.url}
                alt=""
                width={100}
                height={100}
                className={`w-16 h-16 rounded-full cursor-pointer p-1 ${
                  selectedAvatar === item.url ? "opacity-30" : ""
                }`}
              />
            ))}
          </div>

          <div className="flex items-center justify-center space-x-4">
            <Button
              onClick={() => {
                setAvatarModalIsOpen(false);
                setSelectedAvatar(userAvatar);
              }}
              variant="theme"
              className=" rounded-full w-32   text-md  my-1 shadow-md "
            >
              cancel
            </Button>
            <Button
              onClick={() => {
                handleAvatarChange();

                setAvatarModalIsOpenToFalse();
              }}
              variant="theme"
              className=" rounded-full  w-32   text-md  my-1 shadow-md "
            >
              save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfileComponent;
