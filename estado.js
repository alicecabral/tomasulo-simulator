export default class Estado {
    constructor(CONFIG, instrucoes) {
        
        this.configuracao = {
            "numInstrucoes": CONFIG["nInst"], // quantidade de instrucoes
            "ciclos": CONFIG["ciclos"],       // numero de ciclos gastos por cada Unidade Funcional 
            "unidades": CONFIG["unidades"]    // número de unidades funcionais
        };

        // cria o vetor de instrucoes
        this.estadoInstrucoes = [];
        for(let i = 0; i < this.configuracao["numInstrucoes"]; i++) {
            let linha = {}
            linha["instrucao"] = {  // armazena a instrucao
                "id":i,
                "valido":true,
                "aptoCommit":false,
                "operacao": instrucoes[i]["d"],
                "registradorR": instrucoes[i]["r"],
                "registradorS": instrucoes[i]["s"],
                "registradorT": instrucoes[i]["t"],
            };

            linha["posicao"] = i;                      // numero da instrucao
            linha["issue"] = null;                     // ciclo onde ocorreu o issue
            linha["exeCompleta"] = null;               // ciclo onde a execucao terminou
            linha["write"] = null;                     // ciclo onde foi escrito
            linha["commit"] = null; 
            this.estadoInstrucoes[i] = linha;
        
        }
        
        // cria as unidades funcionais
        this.unidadesFuncionais = {};

        for (var tipoUnidade in CONFIG["unidades"]) {

            for (let i = 0; i < CONFIG["unidades"][tipoUnidade]; i++) {
                let unidadeFuncional = {};
                unidadeFuncional["instrucao"] = null;           // armazena a instrucao que esta executando
                unidadeFuncional["estadoInstrucao"] = null;     // armazena todo o estado da instrucao
                unidadeFuncional["tipoUnidade"] = tipoUnidade;  // define o tipo da unidade funcional
                unidadeFuncional["tempo"] = null;               // salva quanto tempo ainda falta para terminar a exeucao

                let nome = tipoUnidade + (i+1);                 // cria o nome da uf
                unidadeFuncional["nome"] = nome;
                unidadeFuncional["ocupado"] = false;            // se a unidade esta ocupada ou nao

                unidadeFuncional["operacao"] = null;            // nome da instrucao que esta executando
                unidadeFuncional["vj"] = null;                  // valor de j
                unidadeFuncional["vk"] = null;                  // valor de k
                unidadeFuncional["qj"] = null;                  // uf que esta gerando j
                unidadeFuncional["qk"] = null;                  // uf que esta gerando k

                this.unidadesFuncionais[nome] = unidadeFuncional;
            }
            
        }

      
        this.clock = 0;       

        this.estacaoRegistradores = {}

        for(let i = 0; i < 10; i++) {
            this.estacaoRegistradores["R" + i] = null;
        }
    }

    BufferReordenamento = [];

    getNovaInstrucao() {
 

        for (let i = 0; i < this.estadoInstrucoes.length; i++) {
            const element = this.estadoInstrucoes[i];
            if(element.issue == null)
                return element;
        }
        return undefined;
    }

    invalidaInstrucoes(indexInicial,indexFinal){
        for(let i = indexInicial;i<indexFinal;i++){
            this.estadoInstrucoes[i].instrucao.valido = false;
        }
    }

    limpaQuadro(element){
        element["issue"] = null;                     // ciclo onde ocorreu o issue
        element["exeCompleta"] = null;               // ciclo onde a execucao terminou
        element["write"] = null;
        element["commit"] = null;
        this.estadoInstrucoes[element.instrucao.id].aptoCommit = false;
    }
    limpaUnidadeFuncional(element){
        console.info(this.unidadesFuncionais);
        for (var uf in this.unidadesFuncionais){
            console.info("Limpando UF:");
            console.info(uf);
            if( this.unidadesFuncionais[uf].instrucao != undefined){
                console.info(" uf id = " + this.unidadesFuncionais[uf].instrucao.id + "        id = " +element.id)
                if(this.unidadesFuncionais[uf].instrucao.id == element.instrucao.id){

                    console.info("entreiii");
                    
                    this.unidadesFuncionais[uf].instrucao = null;
                    this.unidadesFuncionais[uf].estadoInstrucao = null;
                    this.unidadesFuncionais[uf].tempo = null;
                    this.unidadesFuncionais[uf].ocupado = false;
                    this.unidadesFuncionais[uf].operacao = null;
                    this.unidadesFuncionais[uf].vj = null;
                    this.unidadesFuncionais[uf].vk = null;
                    this.unidadesFuncionais[uf].qj = null;
                    this.unidadesFuncionais[uf].qk = null;
                    
                    
                }
            }
        }
        
    }

    PulaParaLabel(index,indexInicial){// BEQ x,x, index
        
                                    
        if(indexInicial>index){
            for(let i = index ;i < indexInicial;i++){
                let element = this.estadoInstrucoes[i];
                
                this.limpaQuadro(element);
                
                
            }
            
            
        }
        for(let i = indexInicial ;i<this.estadoInstrucoes.length;i++){
            
            let element = this.estadoInstrucoes[i];
            console.info(element);
            this.limpaUnidadeFuncional(element);
            this.limpaQuadro(element);
        }
        
        
        
    }

    verificaUFInstrucao(instrucao) {
    switch (instrucao.operacao) {
        case "ADD":
            return "Add";
        case "SUB":
            return "Add";
            
        case "BEQ":
            return "Branch";
        case "BNE":
            return "Branch";

        case "SD":
            return 'Load';
        case "LD":
            return "Load";
        
        case "MULT":
            return "Mult";
        case "DIV":
            return "Mult";

        default:
            return null
    }
    }

    getFUVazia(tipoFU) {
    // Funcao que busca a primeira UF vazia de um determinado tipo

        for(let key in this.unidadesFuncionais) {
            var uf = this.unidadesFuncionais[key];

            // caso seja do tipo que esta buscando e esteja livre, retorna ela
            if (uf.tipoUnidade === tipoFU) {
                if (!uf.ocupado) {
                    return uf;
                }
            }
        }
        // caso nao encontre nenhuma, retorna undefined
        return undefined;
    }

    getCiclos(instrucao) {
        switch (instrucao.operacao) {
            case 'ADD':
                return parseInt(this.configuracao.ciclos['Add']);
            case 'SUB':
                return parseInt(this.configuracao.ciclos['Add']);
            case 'MULT':
                return parseInt(this.configuracao.ciclos['Mult']);
            case 'DIV':
                return parseInt(this.configuracao.ciclos['Mult']);
            case 'LD':
                return parseInt(this.configuracao.ciclos['Load']);
            case 'SD':
                return parseInt(this.configuracao.ciclos['Load']);
            case 'BEQ':
                return parseInt(this.configuracao.ciclos['Branch']);
            case 'BNE':
                return parseInt(this.configuracao.ciclos['Branch']);
        }
    }

    alocaFuMem(uf, instrucao, estadoInstrucao) {
    // Funcao que aloca uma unidade funcional de memória para uma instrucao
        uf.instrucao = instrucao;
        uf.estadoInstrucao = estadoInstrucao;
        uf.tempo = this.getCiclos(instrucao); 
        uf.ocupado = true;
        uf.operacao = instrucao.operacao;
        uf.endereco = instrucao.registradorS + '+' + instrucao.registradorT;
        uf.destino = instrucao.registradorR;
        uf.qi = null;
        uf.qj = null;

        
        if (instrucao.operacao === 'SD') {
        
            let UFQueTemQueEsperar = this.estacaoRegistradores[instrucao.registradorR];

        
            if ((UFQueTemQueEsperar in this.unidadesFuncionais) )
                uf.qi = UFQueTemQueEsperar;
            else
                uf.qi = null;
        }

        let UFintQueTemQueEsperar = this.estacaoRegistradores[instrucao.registradorT];

        if ((UFintQueTemQueEsperar in this.unidadesFuncionais) )
            uf.qj = UFintQueTemQueEsperar;
        else
            uf.qj = null;
    }

    escreveEstacaoRegistrador(instrucao, ufNome) {
        this.estacaoRegistradores[instrucao.registradorR] = ufNome;
    }

    alocaFU(uf, instrucao, estadoInstrucao) {
        uf.instrucao = instrucao;
        uf.estadoInstrucao = estadoInstrucao;
        uf.tempo = this.getCiclos(instrucao) + 1; 
        uf.ocupado = true;
        uf.operacao = instrucao.operacao;

        let reg_j;
        let reg_k;
        let reg_j_inst;
        let reg_k_inst;

        
        if ((instrucao.operacao === 'BNE') || (instrucao.operacao === 'BEQ')) {
            reg_j = this.estacaoRegistradores[instrucao.registradorR];   
            reg_k = this.estacaoRegistradores[instrucao.registradorS];   
            reg_j_inst = instrucao.registradorR;                         
            reg_k_inst = instrucao.registradorS;
        } else {
            reg_j = this.estacaoRegistradores[instrucao.registradorS];   
            reg_k = this.estacaoRegistradores[instrucao.registradorT];   

            reg_j_inst = instrucao.registradorS;                         
            reg_k_inst = instrucao.registradorT;
        }

       
        if (reg_j === null || reg_j === undefined)
            uf.vj = reg_j_inst;
        else {
            
            if ((reg_j in this.unidadesFuncionais) )
                uf.qj = reg_j;
            else
                uf.vj = reg_j;
        }

      
        if (reg_k === null || reg_k === undefined)
            uf.vk = reg_k_inst;
        else {
           
            console.log("UNIDADES FUNCIONAIS");
            console.log(this.unidadesFuncionais)
            if ((reg_k in this.unidadesFuncionais))
                uf.qk = reg_k;
            else
                uf.vk = reg_k;
        }
    }


    liberaUFEsperandoResultado(UF) {
   
        for(let keyUF in this.unidadesFuncionais) {
            const ufOlhando = this.unidadesFuncionais[keyUF];
            
           
            if ((ufOlhando.ocupado === true) && 
               ((ufOlhando.qj === UF.nome) || 
               (ufOlhando.qk === UF.nome))) {

           
                if (ufOlhando.qj === UF.nome) {
                    ufOlhando.vj = 'VAL(' + UF.nome + ')';   
                    ufOlhando.qj = null;                     
                }

                
                if (ufOlhando.qk === UF.nome) {
                    ufOlhando.vk = 'VAL(' + UF.nome + ')';   
                    ufOlhando.qk = null;                     
                }

               
                if ((ufOlhando.qj === null) && (ufOlhando.qk === null)) {
                    ufOlhando.tempo = ufOlhando.tempo - 1; 
                }
            }
        }

       
    }

    desalocaUFMem(ufMem) {
    
        ufMem.instrucao = null;
        ufMem.estadoInstrucao = null;
        ufMem.tempo = null;
        ufMem.ocupado = false;
        ufMem.operacao = null;
        ufMem.endereco = null;
        ufMem.destino = null;
        ufMem.qi = null;
        ufMem.qj = null;
    }

    desalocaUF(uf) {
  
        uf.instrucao = null;
        uf.estadoInstrucao = null;
        uf.tempo = null;
        uf.ocupado = false;
        uf.operacao = null;
        uf.vj = null;
        uf.vk = null;
        uf.qj = null;
        uf.qk = null;
    }

    verificaSeJaTerminou() {
   
        let qtdInstrucaoNaoTerminada = 0;
        for (let i = 0; i < this.estadoInstrucoes.length; i++) {
            const element = this.estadoInstrucoes[i];
            
            if (element.write === null)
                qtdInstrucaoNaoTerminada++;
        }

        return qtdInstrucaoNaoTerminada > 0 ? false : true;
    }

    issueNovaInstrucao() {
  

        let novaInstrucao = this.getNovaInstrucao(); 
        
       
        if (novaInstrucao) {
            let ufInstrucao = this.verificaUFInstrucao(novaInstrucao.instrucao);  
            let UFParaUsar = this.getFUVazia(ufInstrucao);                        
            
            if (UFParaUsar) {
             
                    
                    console.log("============================== nova inst");
                    console.log(novaInstrucao);
                    this.alocaFU(UFParaUsar, novaInstrucao.instrucao, novaInstrucao);
                    this.BufferReordenamento.push(UFParaUsar.estadoInstrucao);
                
                
                novaInstrucao.issue = this.clock;

                
                if ((UFParaUsar.tipoUnidade !== 'Store') && (UFParaUsar.operacao !== 'BEQ') && (UFParaUsar.operacao !== 'BEQ'))
                    this.escreveEstacaoRegistrador(novaInstrucao.instrucao, UFParaUsar.nome);
            }
        }
    }

    executaInstrucao() {

        for(let key in this.unidadesFuncionais) {
            var uf = this.unidadesFuncionais[key];

            
            if ((uf.ocupado === true) && (uf.vj !== null) && (uf.vk !== null)) {
                uf.tempo = uf.tempo - 1;   

   
                if (uf.tempo === 0) {
                    uf.estadoInstrucao.exeCompleta = this.clock;
                }
            }
        }
    }
    commitInstrucao(){//id='i${i}_commit'
        if(this.BufferReordenamento.length >0){

            console.info(this.BufferReordenamento);
            
            if(this.BufferReordenamento[0].aptoCommit){
                if(this.verificaUFInstrucao(this.BufferReordenamento[0].instrucao) =="Branch"){
                    let y = this.BufferReordenamento.shift();
                    while(y!= undefined){
                        this.limpaQuadro(this.estadoInstrucoes[y.instrucao.id] );
                        y = this.BufferReordenamento.shift();
                    }

                }else{
                let x =  this.BufferReordenamento.shift();
                this.estadoInstrucoes[x.instrucao.id].commit = this.clock;
                }
            }

            
        }
    }
    escreveInstrucao() {
    
        for(let key in this.unidadesFuncionais) {
            const uf = this.unidadesFuncionais[key];

            
            if (uf.ocupado === true) {
                if (uf.tempo === -1) {
                    uf.estadoInstrucao.write = this.clock;   

                   
                    let valorReg = this.estacaoRegistradores[uf.instrucao.registradorR];

                   
                    if (valorReg === uf.nome) {
                        this.estacaoRegistradores[uf.instrucao.registradorR] = 'VAL(' + uf.nome + ')';
                    }
                    console.log("UFFFFFFFFFFFFFFFFFFFFFFFFFFFFF");
                    console.log(uf);
                    this.estadoInstrucoes[uf.instrucao.id].aptoCommit = true;
                    if(uf.tipoUnidade == "Branch"){
                        this.PulaParaLabel(uf.instrucao.registradorT,uf.instrucao.id);
                    
                    }
                    
                
                    this.liberaUFEsperandoResultado(uf);
                    this.desalocaUF(uf);
                    
                    
                }
            }
        }
    }

    executa_ciclo() {


        this.clock++;  
       
        this.issueNovaInstrucao();
        this.executaInstrucao();
        this.escreveInstrucao();
        this.commitInstrucao();
   
        console.log('Estado instrução:');
        console.log(JSON.stringify(this.estadoInstrucoes, null, 2));

    

        console.log('\nUnidades Funcionais:');
        console.log(JSON.stringify(this.unidadesFuncionais, null, 2));

        console.log('Estado registradores:');
        console.log(JSON.stringify(this.estacaoRegistradores, null, 2));

   
        return this.verificaSeJaTerminou();
    }

}