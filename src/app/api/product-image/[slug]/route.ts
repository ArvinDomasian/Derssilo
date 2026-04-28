import { readFile } from "node:fs/promises";
import { NextResponse } from "next/server";

const imageMap: Record<string, string> = {
  "powder-blue-coord-set":
    "C:\\Users\\ArvinQT\\.cursor\\projects\\c-Users-ArvinQT-Documents-GitHub-Derssilo\\assets\\c__Users_ArvinQT_AppData_Roaming_Cursor_User_workspaceStorage_b3c896b1d8122b3d45650fb8b0168abc_images_eea84c288a2fca38a71146571f979495-40e8cb81-338d-4bb8-b7d1-c4e21c16a2a7.png",
  "olive-pleated-lounge-set":
    "C:\\Users\\ArvinQT\\.cursor\\projects\\c-Users-ArvinQT-Documents-GitHub-Derssilo\\assets\\c__Users_ArvinQT_AppData_Roaming_Cursor_User_workspaceStorage_b3c896b1d8122b3d45650fb8b0168abc_images_8290a099-4f1d-4a1b-8fc8-e77df7dc2925-baaf0c24-e574-4c2c-81fb-ab38c14c32cd.png",
  "floral-summer-halter-set":
    "C:\\Users\\ArvinQT\\.cursor\\projects\\c-Users-ArvinQT-Documents-GitHub-Derssilo\\assets\\c__Users_ArvinQT_AppData_Roaming_Cursor_User_workspaceStorage_b3c896b1d8122b3d45650fb8b0168abc_images_93fea4c4150dfbe28bfe0553ad71ccc0-cb1067c8-8af0-4bad-95e0-7c84499b01c1.png"
};

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const imagePath = imageMap[params.slug];

  if (!imagePath) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const image = await readFile(imagePath);

    return new NextResponse(new Uint8Array(image), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=3600"
      }
    });
  } catch {
    return new NextResponse("Image unavailable", { status: 404 });
  }
}
