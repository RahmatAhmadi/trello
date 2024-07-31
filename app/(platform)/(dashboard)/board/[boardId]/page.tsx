import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ListContainer from "./_components/list-container";

interface BoardIdaPageProps {
  params: {
    boardId: string;
  };
}

export default async function BoardIdPage({ params }: BoardIdaPageProps) {
  const { orgId } = auth();

  if (!orgId) {
    redirect("/select-org");
  }

  const lists = await db.list.findMany({
    where: {
      boardId: params.boardId,
      board: {
        orgId,
      },
    },
    include: {
      cards: {
        orderBy: {
          order: "asc",
        },
      },
    },
    orderBy: {
      order: "asc",
    },
  });

  return (
    <div className="p-4 h-full overflow-x-auto">
      <ListContainer boardId={params.boardId} data={lists} />
    </div>
  );
}
