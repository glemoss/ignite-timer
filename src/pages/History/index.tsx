import { HistoryContainer, HistoryList, Status } from "./styles"

export function History() {
    return (
        <HistoryContainer>
            <h1>Meu histórico</h1>


            <HistoryList>
                <table>
                    <thead>
                        <tr>
                            <th>Tarefa</th>
                            <th>Duração</th>
                            <th>Início</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Tarefa</td>
                            <td>40 minutos</td>
                            <td>Há 2 horas</td>
                            <td>
                                <Status statusColor="yellow">Em andamento</Status>
                            </td>
                        </tr>
                        <tr>
                            <td>Tarefa</td>
                            <td>55 minutos</td>
                            <td>Há 5 meses</td>
                            <td>
                                <Status statusColor="green">Concluído</Status>
                            </td>
                        </tr>
                        <tr>
                            <td>Tarefa</td>
                            <td>20 minutos</td>
                            <td>Há 1 ano</td>
                            <td>
                                <Status statusColor="red">Interrompido</Status>
                            </td>
                        </tr>
                        <tr>
                            <td>Tarefa</td>
                            <td>20 minutos</td>
                            <td>Há 1 ano</td>
                            <td>
                                <Status statusColor="yellow">Em andamento</Status>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </HistoryList>
        </HistoryContainer>
    )
}