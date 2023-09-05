import { useHistory, useParams } from "react-router-dom";

import logoImg from "../assets/images/logo.svg";
import deletedImg from "../assets/images/delete.svg";
import checkedImg from "../assets/images/check.svg";
import answerImg from "../assets/images/answer.svg";

import { Button } from "../components/Button";
import { Questions } from "../components/Questions";
import { RoomCode } from "../components/RoomCode";

import { useRoom } from "../hooks/useRoom";

import "../styles/room.scss";
import { database } from "../services/firebase";

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  // const { user } = useAuth();
  const history = useHistory();
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const { questions, title } = useRoom(roomId);

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    });

    history.push("/");
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm("Tem certeza que você deseja excluir está pergunta?")) {
      const questionRef = await database
        .ref(`rooms/${roomId}/questions/${questionId}`)
        .remove();
    }
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database
      .ref(`rooms/${roomId}/questions/${questionId}`)
      .update({ isAnswered: true });
  }

  async function handleHightLightQuestion(questionId: string) {
    await database
      .ref(`rooms/${roomId}/questions/${questionId}`)
      .update({ isHighLighted: true });
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleEndRoom}>
              Encerrar sala
            </Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && (
            <span className="questions">{questions.length} pergunta(s)</span>
          )}
        </div>

        {/* a unica forma de percorrermos um array e devolvermos cada posição de um array como um componente é com map() */}
        <div className="question-list">
          {questions.map((question) => {
            return (
              <Questions
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighLighted}
              >
                {!question.isAnswered && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCheckQuestionAsAnswered(question.id)}
                    >
                      <img
                        src={checkedImg}
                        alt="Marcar pergunta como respondida"
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleHightLightQuestion(question.id)}
                      style={{ margin: "0 10px" }}
                    >
                      <img src={answerImg} alt="Dar destaque a pergunta" />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deletedImg} alt="Remover pergunta" />
                </button>
              </Questions>
            );
          })}
        </div>
      </main>
    </div>
  );
}
