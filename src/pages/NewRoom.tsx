import { FormEvent, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import illustration from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";
import { Button } from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import { database } from "../services/firebase";

import "../styles/auth.scss";

export function NewRoom() {
  const history = useHistory();
  const [newRoom, setNewRoom] = useState("");
  const { user } = useAuth();

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();

    // trim() remove os espaços tanto a esquerda quanto a direita
    if (newRoom.trim() === "") {
      return;
    }

    // estou dizendo que dentro do banco de dados eu vou ter uma categoria
    // que se chama rooms, dentro de rooms eu posso incluir dados como o nome da sala,
    // dados que são iterativos como um array de perguntas, posso salvar qualquer coisa
    const roomRef = database.ref("rooms");

    // aqui estou jogando uma nova sala dentro de rooms
    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
    });

    // redireciona para a sala criada
    history.push(`/rooms/${firebaseRoom.key}`);
  }

  return (
    <div id="page-auth">
      <aside>
        <img
          src={illustration}
          alt="ilustração simbolizando perguntas e respostas"
        />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />

          <h2>Crie uma nova sala</h2>

          <form onSubmit={handleCreateRoom}>
            <input
              type="text"
              placeholder="Nome da sala"
              value={newRoom}
              onChange={(event) => setNewRoom(event.target.value)}
            />
            <Button type="submit">Criar sala</Button>
          </form>
          <p>
            Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
