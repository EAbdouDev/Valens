"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { dateSchema } from "./date";

export const DateComp = ({ res }: { res?: dateSchema }) => {
  return (
    <div className="bg-white border p-4 rounded-2xl m-4 max-w-prose space-y-2">
      <h1 className="text-sm font-medium">{res?.date}</h1>
      <p className="text-lg ">{res?.resp}</p>
    </div>
  );
};
