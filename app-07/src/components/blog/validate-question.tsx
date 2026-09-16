"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LoaderButton } from "../loader-button";
import { RelatedTile } from "@/types/course";
import { Card, CardContent, CardHeader } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";

export function ValidateQuestionModal({
  onConfirm,
  newTile,
  isOpen,
  setIsOpen,
  confirmText = "Replace",
  isPending,
  validationResult,
}: {
  onConfirm: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  newTile: RelatedTile;
  confirmText?: string;
  isPending: boolean;
  validationResult: any;
}) {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className=" md:max-w-2xl h-[90%] sm:h-fit">
        <AlertDialogHeader>
          <AlertDialogTitle>Question Validation</AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>
        </AlertDialogHeader>
        <ScrollArea className="h-full">
          {isPending || !newTile ? (
            <p>Validating question...</p>
          ) : (
            <div className="grid w-full items-center text-xs md:text-sm xl:text-base ">
              <div className="border rounded-md p-1">
                <span className="py-2">
                  Is the question valid ?{" "}
                  <span className="font-semibold md:text-lg">
                    {validationResult?.isValid}
                  </span>
                </span>
                <br />
                <span className="py-1">{validationResult?.reason}</span>
              </div>

              {validationResult?.isValid !== "yes" && (
                <>
                  <span className="text-sm font-semibold py-2">
                    Improved Version:
                  </span>

                  <div className="flex items-center flex-1 grow justify-between">
                    <p>
                      <span className="text-lg">Q.</span>
                      <span> {newTile.question}</span>
                    </p>
                  </div>
                  <div className="md:pl-5 space-y-1">
                    {newTile?.options?.map((question, index) => (
                      <p key={`${question.option}-${index}`}>
                        {question?.option &&
                          question?.option !== null &&
                          question?.option !== "" && (
                            <span>
                              <span className="text-xs ">{index + 1}</span>{" "}
                              {question.option}
                            </span>
                          )}
                      </p>
                    ))}

                    {newTile?.isMultiCorrect ? (
                      <div className="flex items-center gap-3 italic font-medium">
                        correct answers:{" "}
                        <p className="space-x-2 divide-x-2">
                          {newTile?.correctOption?.map((item, index) => (
                            <span key={`${index}-${item}`}>
                              {newTile?.options[item - 1]?.option}
                            </span>
                          ))}
                        </p>
                      </div>
                    ) : (
                      <p className="italic font-medium">
                        correct answer:{" "}
                        {
                          newTile?.options[newTile?.correctOption[0] - 1]
                            ?.option
                        }
                      </p>
                    )}
                    <p className="text-xs md:text-sm">
                      Reason: {newTile?.reason}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </ScrollArea>
        <AlertDialogFooter>
          {validationResult?.isValid === "yes" ? (
            <AlertDialogCancel>Close</AlertDialogCancel>
          ) : (
            <>
              <AlertDialogCancel>Cancel</AlertDialogCancel>

              <LoaderButton onClick={onConfirm} isLoading={isPending}>
                {confirmText}
              </LoaderButton>
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
