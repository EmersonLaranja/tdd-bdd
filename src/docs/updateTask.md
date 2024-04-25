**UpdateTaskController**

[X] Deve retornar 204 em caso de sucesso
[X] Deve retornar 500 se UpdateTask for lançado
[X] Deve retornar 400 se a validação falhar
[X] Deve chamar UpdateTask com os valores corretos quando apenas parte da solicitação for enviada
[X] Deve chamar UpdateTask com os valores corretos quando a solicitação completa for enviada

**DbUpdateTask.**

[] Deve chamar UpdateTaskRepository com os valores corretos
[] Deve lançar exceção se UpdateTaskRepository lançar exceção

**TaskMongoRepository**

[] Deve atualizar tarefa com sucesso
[] Deve retornar InvalidParamError se o ID da tarefa for inválido
[] Deve retornar NotFoundError se nenhuma tarefa for encontrada para atualização

**TaskRoutes**
[] Deve retornar 204 ao chamar a rota para atualizar a tarefa
