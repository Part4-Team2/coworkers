// test/header/page.tsx
"use client";

import { useState } from "react";
import SideHeader from "@/app/components/Header/SideHeader";

export default function HeaderPage() {
  const [isOpen, setIsOpen] = useState(true);

  return <SideHeader isOpen={isOpen} onClick={() => setIsOpen(false)} />;
}
