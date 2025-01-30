"use client";

import { deleteAnswer } from "@/lib/actions/answer.actions";
import { deleteQuestion } from "@/lib/actions/question.actions";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

interface Props {
  type: string;
  itemId: string;
}

const EditDeleteAction = ({ type, itemId }: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/question/edit/${JSON.parse(itemId)}`);
  };

  const handleDelete = async () => {
    if (type === "Question") {
      // Delete question
      await deleteQuestion({
        questionId: JSON.parse(itemId),
        path: pathname,
      });
    } else if (type === "Answer") {
      // Delete answer
      await deleteAnswer({
        answerId: JSON.parse(itemId),
        path: pathname,
      });
    }
  };

  return (
    <div className="flex items-center justify-end gap-3 max-sm:w-full">
      {type === "Question" && (
        <Image
          src="/assets/icons/edit.svg"
          alt="Edit"
          width={14}
          height={14}
          className="cursor-pointer object-contain"
          onClick={handleEdit}
        />
      )}
      <Dialog>
        <DialogTrigger asChild>
          <Image
            src="/assets/icons/trash.svg"
            alt="Delete"
            width={14}
            height={14}
            className="cursor-pointer object-contain"
          />
        </DialogTrigger>

        <DialogContent className="sm:max-w-md background-light800_dark300">
          <DialogHeader>
            <DialogTitle className="text-dark100_light900">
              Delete {type}?
            </DialogTitle>
            <DialogDescription className="text-dark100_light900">
              Please note that this action cannot be reversed
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="sm:justify-start">
            <Button
              className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditDeleteAction;
