import React from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";
// import { Separator } from "@radix-ui/react-separator";
type Props = {
  correct_answers: number;
  wrong_answers: number;
};

const MCQCounter = ({ correct_answers, wrong_answers }: Props) => {
  return (
    <Card className="flex flex-row items-center justify-center p-1">
      <CheckCircle2 color="green" size={22} />
      <span className=" mx-1 text-[green]">{correct_answers}</span>

      {/* <Separator orientation="vertical" /> */}

      <span className="mx-1  text-[red]">{wrong_answers}</span>
      <XCircle color="red" size={22} />
    </Card>
  );
};

export default MCQCounter;
