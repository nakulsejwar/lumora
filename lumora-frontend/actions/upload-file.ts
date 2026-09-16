"use server";

export const uploadFile = async (file: File) => {
  //TODO add file upload

  if (file) {
    return { success: "any" };
  } else {
    return { error: { message: "any" } };
  }
};
