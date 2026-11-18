import type { Metadata } from "next";
import Radical from "../home-c/Radical";

export const metadata: Metadata = { title: "Homepage preview C (light)" };

// Alternative C in the live site's cream and blue palette.
export default function HomeCLight() {
  return <Radical light current="/preview/home-c-light" />;
}
