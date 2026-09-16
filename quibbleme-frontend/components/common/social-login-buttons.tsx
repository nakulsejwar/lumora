"use client";
import React from "react";

import GoogleButton from "./google-button";
import FacebookButton from "./facebook-button";
function SocialLoginButtons() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  return (
    <div className="space-y-2">
      <GoogleButton loading={isLoading} setLoading={setIsLoading} />
      <FacebookButton loading={isLoading} setLoading={setIsLoading} />
    </div>
  );
}

export default SocialLoginButtons;
