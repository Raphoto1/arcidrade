import { getCampaignLeads } from "@/controller/campaign.controller";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Lógica para obtener los leads de la campaña
      const leads: any[] = await getCampaignLeads();
    return NextResponse.json({ payload: leads }, { status: 200 });
  } catch (error) {
    console.error("Error al obtener los leads de la campaña:", error);
    return NextResponse.json({ message: "Error al obtener los leads de la campaña" }, { status: 500 });
  }
}
