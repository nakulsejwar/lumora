"use client";

import * as React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from "next/link";

export function TopicsCollapsible({ topic }: { topic: any }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({
      behavior: "smooth",
    });
  };
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className=" space-y-2 ">
      <div className="flex items-center justify-between space-x-4 px-4">
        <button onClick={() => scrollToSection(topic?.topic_id)}>
          <h4 className="text-sm text-left font-semibold">
            {" "}
            <span className="text-muted-foreground">{topic.order}.</span>
            {topic?.name}
          </h4>
        </button>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="space-y-3">
        {topic?.related_levels?.map((level: any) => (
          <div
            key={level.level_id}
            className="rounded-md border p-1 px-2 font-mono text-sm bg-gray-50"
          >
            <LevelsCollapsible level={level} />
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

export function LevelsCollapsible({ level }: { level: any }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({
      behavior: "smooth",
    });
  };
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className=" space-y-2">
      <div className="flex items-center justify-between space-x-4 px-4">
        <button onClick={() => scrollToSection(level?.level_id)}>
          <h4 className="text-sm text-left font-semibold">
            <span className="text-muted-foreground">{level.order}.</span>
            {level?.name}
          </h4>
        </button>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="space-y-3 pt-2">
        {level?.related_games?.map((game: any) => (
          <button
            key={game.gameid}
            className="rounded-md border p-2 px-3 w-full font-mono text-sm bg-white"
            onClick={() => scrollToSection(game?.gameid)}
          >
            <h4 className="text-sm text-left font-semibold">
              <span className="text-muted-foreground">{game.order}.</span>
              {game?.name}
            </h4>
          </button>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
