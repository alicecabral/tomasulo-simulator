# Simulador Tomasulo
O presente trabalho apresenta o desenvolvimento de um simulador de Tomasulo que suporta instruções MIPS, instruções de desvio e descarte de instruções no buffer de reordenamento.

# Equipe
* Alice Cabral
* Ana Carolina Manso
* João Victor Amorim
* Juliana Silvestre

# Implementação: Instruções e Unidades de Execução

| Instruções | Unidades de Execução |
|:----------:|:--------------------:|
|    MULT    |         Mult         |
|     DIV    |         Mult         |
|     ADD    |          Add         |
|     SUB    |          Add         |
|     BNE    |        Branch        |
|     BEQ    |        Branch        |
|    LOAD    |         Load         |
|    STORE   |         Load         |

# Como usar o simulador
Para carregar o exemplo feito pelos desenvolvedores basta clicar em Exemplo e em seguida no botão Enviar, disponíveis no canto esquerdo da tela. Para executar outras instruçôes o usuário deve escolher quantas instruções seu programa terá e em seguida preencher os campos disponiveis.

O resultado do simulador pode ser obtido de forma mais rápida clicando em Resultado Final, ou então é possível acompanhar o passo a passo da execução usando o botão Próximo Ciclo.
