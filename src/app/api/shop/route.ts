import { NextRequest, NextResponse } from "next/server";
import { getShopItems, saveShopItems, ShopItem } from "@/lib/shopStore";
import { randomUUID } from "crypto";

export async function GET() {
  const items = await getShopItems();
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as Partial<ShopItem> & {
    title?: string;
    description?: string;
    price?: string;
    image?: string;
    purchaseLink?: string;
  } | null;

  if (!body || !body.title || !body.price || !body.image || !body.purchaseLink) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const now = new Date().toISOString();

  const item: ShopItem = {
    id: body.id ?? randomUUID(),
    title: body.title,
    description: body.description ?? "",
    price: body.price,
    image: body.image,
    purchaseLink: body.purchaseLink,
    createdAt: now,
    updatedAt: now,
  };

  const items = await getShopItems();
  items.push(item);
  await saveShopItems(items);

  return NextResponse.json(item, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as {
    id?: string;
    title?: string;
    description?: string;
    price?: string;
    image?: string;
    purchaseLink?: string;
  } | null;

  if (!body?.id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const items = await getShopItems();
  const index = items.findIndex((item) => item.id === body.id);
  if (index === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const current = items[index];
  const updated: ShopItem = {
    ...current,
    ...body,
    id: current.id,
    updatedAt: new Date().toISOString(),
  };

  items[index] = updated;
  await saveShopItems(items);

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as { id?: string } | null;
  const id = body?.id;

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const items = await getShopItems();
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  items.splice(index, 1);
  await saveShopItems(items);

  return NextResponse.json({ ok: true });
}
