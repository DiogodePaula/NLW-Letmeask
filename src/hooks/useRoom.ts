import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

type Question = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isAnswered: boolean;
  isHighLighted: boolean;
  likeCount: number;
  likeId: string | undefined;
};

type FirebaseQuestion = Record<
  string,
  {
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    isAnswered: boolean;
    isHighLighted: boolean;
    likes: Record<
      string,
      {
        authorId: string;
      }
    >;
  }
>;

export function useRoom(roomId: string) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [title, setTitle] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    // once vai ouvir o evento "value" uma unica vez, o val() vai trazer todos os dados de room
    roomRef.on("value", (room) => {
      const databaseRoom = room.val();
      const firebaseQuestion: FirebaseQuestion = databaseRoom.questions ?? {};

      const parsedQuestions = Object.entries(firebaseQuestion).map(
        ([key, value]) => {
          return {
            id: key,
            content: value.content,
            author: value.author,
            isHighLighted: value.isHighLighted,
            isAnswered: value.isAnswered,
            likeCount: Object.values(value.likes ?? {}).length,

            likeId: Object.entries(value.likes ?? {}).find(
              ([key, like]) => like.authorId === user?.id
            )?.[0],
          };
        }
      );
      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
    });

    return () => {
      // ele vai remover todos os event listeners para essa referencia de sala
      roomRef.off("value");
    };
  }, [roomId, user?.id]);

  return { questions, title };
}
