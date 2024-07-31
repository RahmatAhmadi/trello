"use client";

import { ListWithCards } from "@/types";
import ListForm from "./list-form";
import { useEffect, useState } from "react";
import ListItem from "./list-item";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { updateListOrder } from "@/actions/update-list-order";
import { updateCardOrder } from "@/actions/update-card-order";
import { useAction } from "@/hooks/useAction";
import { toast } from "sonner";

interface ListContainerProps {
  data: ListWithCards[];
  boardId: string;
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

export default function ListContainer({ data, boardId }: ListContainerProps) {
  const [orderedData, setOrderedData] = useState(data);
  const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
    onSuccess: () => {
      toast.success("List reordered");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
    onSuccess: () => {
      toast.success("Card reordered");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  const onDragEnd = (result: any) => {
    const { destination, source, type } = result;

    if (!destination) return;

    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    // User moves a list
    if (type === "list") {
      const items = reorder(orderedData, source.index, destination.index).map(
        (item, index) => ({ ...item, order: index })
      );

      setOrderedData(items);
      executeUpdateListOrder({ items, boardId });
    }

    // User moves a card
    if (type === "card") {
      let newOrderedData = [...orderedData];

      // Source and destination list
      const sourceList = newOrderedData.find(
        (list) => list.id === source.droppableId
      );
      const destinationList = newOrderedData.find(
        (list) => list.id === destination.droppableId
      );

      if (!sourceList || !destinationList) return;

      // Check if cards exist on the sourceList
      if (!sourceList.cards) {
        sourceList.cards = [];
      }

      // Check if cards exist on the destinationList
      if (!destinationList.cards) {
        destinationList.cards = [];
      }

      // Moving the card in the same list
      if (source.droppableId === destination.droppableId) {
        const reorderCards = reorder(
          sourceList.cards,
          source.index,
          destination.index
        );

        reorderCards.forEach((card, index) => {
          card.order = index;
        });

        sourceList.cards = reorderCards;

        setOrderedData(newOrderedData);
        executeUpdateCardOrder({ boardId: boardId, items: reorderCards });

        // User moves the card to another list
      } else {
        // Remove card from the source list
        const [movedCard] = sourceList.cards.splice(source.index, 1);

        // Assign the new listId to the moved card
        movedCard.listId = destination.droppableId;

        // Add card to the destination list
        destinationList.cards.splice(destination.index, 0, movedCard);

        sourceList.cards.forEach((card, index) => {
          card.order = index;
        });

        // Update the order for each card in the destination list
        destinationList.cards.forEach((card, index) => {
          card.order = index;
        });

        setOrderedData(newOrderedData);
        executeUpdateCardOrder({
          boardId: boardId,
          items: destinationList.cards,
        });
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex gap-x-3 h-full"
          >
            {orderedData.map((list, index) => {
              return <ListItem key={list.id} index={index} data={list} />;
            })}
            {provided.placeholder}
            <ListForm />
            <div className="flex-shrink-0 w-1"></div>
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
}
