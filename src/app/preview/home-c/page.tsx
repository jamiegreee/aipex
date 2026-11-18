import type { Metadata } from "next";
import Radical from "./Radical";

export const metadata: Metadata = { title: "Homepage preview C" };

export default function HomeC() {
  return <Radical current="/preview/home-c" />;
}
