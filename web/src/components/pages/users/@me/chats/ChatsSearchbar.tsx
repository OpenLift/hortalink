import { SearchBarInputRef } from "./Chats";

export default function ChatsSearchbar() {
    return (
        <div className="searchbar_container">
            <div className="input" ref={SearchBarInputRef}>
                <input type="text" placeholder="Procurar por..." />
                <div className="search_icon">
                    <img
                        src="/assets/search.svg"
                        alt="Ícone de lupa. Não é necessário clicar, apenas digite que a pesquisa é feita automaticamente."
                        width="19"
                        height="19"
                    />
                </div>
            </div>
        </div>
    )
}