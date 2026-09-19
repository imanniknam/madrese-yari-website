import {
  BackpackIcon,
  BookStackIcon,
  StationeryIcon,
  GlobeIcon,
  WhiteboardIcon,
  ChairIcon,
  FlaskIcon,
  SportsIcon,
} from "@/components/illustrations/category-icons";
import type { Product } from "@/lib/mock-data";
import type { SVGProps } from "react";

export const productIconMap: Record<Product["image"], (props: SVGProps<SVGSVGElement>) => React.ReactElement> = {
  backpack: BackpackIcon,
  notebook: BookStackIcon,
  pencil: StationeryIcon,
  globe: GlobeIcon,
  board: WhiteboardIcon,
  chair: ChairIcon,
  lab: FlaskIcon,
  sports: SportsIcon,
  book: BookStackIcon,
};
