//tomasulo.js
import Estado from "./estado.js"

var exemplo = {
    "config": {
        "ciclos": {
            "ciclosInt": 3,
            "ciclosFPAdd": 8,
            "ciclosFPMul": 10,
            "ciclosFPDiv": 15
        },
        "unidades": {
            "fuLoad": 6,
            "fuStore": 3,
            "fuInt": 3,
            "fuFPAdd": 3,
            "fuFPMul": 2
        }
    },

    "insts": [
        {
            "D": "ADD",
            "R": "R2",
            "S": "R0",
            "T": "R1"
        },
        {
            "D": "LD",
            "R": "R2",
            "S": "0",
            "T": "R2"
        },
        {
            "D": "MULT",
            "R": "R0",
            "S": "R2",
            "T": "R2"
        },
        {
            "D": "SUB",
            "R": "R0",
            "S": "R4",
            "T": "R2"
        },
        {
            "D": "DIV",
            "R": "R10",
            "S": "R4",
            "T": "R6"
        },
        {
            "D": "SD",
            "R": "R6",
            "S": "0",
            "T": "R2"
        },
        {
            "D": "DIV",
            "R": "R2",
            "S": "R4",
            "T": "R5"
        }
    ]
}





function getConfig() {
    var conf = {};

    conf["nInst"] = $("#nInst").val();
    if(conf["nInst"] < 1) {
        alert("O número de instruções deve ser no mínimo 1!");
        return null;
    }

    var ciclos = {}//4 tipos de ciclos para as instrucoes

    ciclos["Branch"] = $("#ciclosInt").val();//trocar Branch por branch, BEQ e BNEZ
    ciclos["Add"] = $("#ciclosFPAdd").val();//ADD e SUB
    ciclos["Mult"] = $("#ciclosFPMul").val();// MULT e DIV
    ciclos["Load"] = $("#ciclosLoad").val();// LOAD STORE


    if ((ciclos["Branch"] < 1) || (ciclos["Add"] < 1) || (ciclos["Mult"] < 1) || (ciclos["Load"] < 1)) {
        alert("A quantidade de ciclos por instrução, para todas as unidades, deve ser de no mínimo 1 ciclo!");
        return null;
    }

    conf["ciclos"] = ciclos

    var unidades = {}//3 unidades de execução
    unidades["Branch"] = $("#fuInt").val();
    unidades["Add"] = $("#fuFPAdd").val();
    unidades["Mult"] = $("#fuFPMul").val();
    unidades["Load"] = $("#fuLoad").val();
    if ((unidades["Branch"] < 1) || (unidades["Add"] < 1) ||
    (unidades["Mult"] < 1) || (unidades["Load"] < 1)) {
        alert("A quantidade de unidades funcionais deve ser no mínimo 1!");
        return;
    }
    
    // var unidadesMem = {}
    // unidadesMem["Load"] = $("#fuLoad").val();
    // unidadesMem["Store"] = $("#fuStore").val();


    // if(unidades["Load"] < 1 || unidadesMem["Store"] < 1) {
    //     alert("A quantidade de unidades funcionais de memória deve ser no mínimo 1!");
    //     return;
    // }


    conf["unidades"] = unidades;
    // conf["unidadesMem"] = unidadesMem;
    return conf;
}

function getInst(i) {
    var inst = {};
    inst["indice"] = i;
    inst["d"] = $(`#D${i}`).val();//nome
    inst["r"] = $(`#R${i}`).val();//1 reg
    inst["s"] = $(`#S${i}`).val();//1 op
    inst["t"] = $(`#T${i}`).val();//ultimo op

    return inst;
}

//Alerta padrão para entradas inválidas das instruções
function alertValidaInstrucao(instrucao) {
    let saida = "A instrução \n";
    saida += instrucao["d"] + " " + instrucao["r"] + ", ";
    saida += instrucao["s"] + ", " + instrucao["t"];
    saida += " não atende os paramêtros do comando " + instrucao["d"];
    alert(saida);
}

function numeroEhInteiro(numero) {
    var valor = parseInt(numero);
    if (valor != numero){
        return false;
    }
    return true;
}

function registradorInvalidoR(registrador) {
	 return (registrador[0] != 'R' || registrador.replace("R", "") == "" || isNaN(registrador.replace("R", "")))
            || !(numeroEhInteiro(registrador.replace("R", "")));
}

function registradorInvalidoF(registrador) {
    return (registrador[0] != 'F' || registrador.replace("F", "") == "" ||
        registrador.replace("F", "") % 2 != 0 || registrador.replace("F", "") > 30) ||
        !numeroEhInteiro(registrador.replace("F", ""));
}

function validaInstrucao(instrucao) {
    var unidade = getUnidadeInstrucao(instrucao["d"]);
    if(!unidade) {
        alert("O comando da instrução é inváilido" + unidade + " " + instrucao) ;
        console.log(instrucao);
        return false;
    }
    var comando = instrucao["d"]
    if(unidade == "Load") {
        

        if(comando == "LD" || comando == "SD") {
            if(registradorInvalidoR(instrucao["r"]) || isNaN(parseInt(instrucao["s"])) || registradorInvalidoR(instrucao["t"])) {
                alertValidaInstrucao(instrucao);
                return false;
            }
            return true;
        }
    }

    if(unidade == "Branch") {
        

        if(comando == "BEQ" || comando =="BNE") {//beq r1,r2,ini
            if(registradorInvalidoR(instrucao["r"]) || registradorInvalidoR(instrucao["s"]) || (instrucao["t"].replace(" ", "") == "")) {
                alertValidaInstrucao(instrucao);
                return false;
            }
            return true;
        }
    }
    if(unidade =="Add"){//add r1,r2,r3
        
        if(comando == "ADD" || comando =="SUB") {
            if(registradorInvalidoR(instrucao["r"]) || registradorInvalidoR(instrucao["s"]) || registradorInvalidoR(instrucao["t"])) {
                alertValidaInstrucao(instrucao);
                return false;
            }
            return true;
        }
    }
    if(unidade=="Mult"){
        
        if(comando == "MULT" || comando =="DIV") {//mult r1,r2
            if(registradorInvalidoR(instrucao["r"]) || registradorInvalidoR(instrucao["s"]) ) {
                alertValidaInstrucao(instrucao);
                return false;
            }
            return true;
        }

    }
    

}

function getAllInst(nInst) {
    var insts = []

    for (var i = 0; i < nInst; i++) {
        var instrucao = getInst(i);
        if(!validaInstrucao(instrucao)) {
            return null;
        }
        insts.push(instrucao);
    }

    return insts;
}

function getUnidadeInstrucao(instrucao) {
    switch (instrucao) {
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

// -----------------------------------------------------------------------------

function atualizaTabelaEstadoInstrucaoHTML(tabelaInsts) {
    for(let i in tabelaInsts) {
        const inst = tabelaInsts[i];
        $(`#i${inst["posicao"]}_is`).text(inst["issue"] ? inst["issue"] : "");
        $(`#i${inst["posicao"]}_ec`).text(inst["exeCompleta"] ? inst["exeCompleta"] : "");
        $(`#i${inst["posicao"]}_wr`).text(inst["write"] ? inst["write"] : "");
        $(`#i${inst["posicao"]}_commit`).text(inst["commit"] ? inst["commit"] : "");
    }
}

function atualizaTabelaEstadoUFHTML(ufs) {
    for(let i in ufs) {
        const uf = ufs[i];
        $(`#${uf["nome"]}_tempo`).text((uf["tempo"] !== null) ? uf["tempo"] : "");
        $(`#${uf["nome"]}_ocupado`).text((uf["ocupado"]) ? "sim" : "não");
        $(`#${uf["nome"]}_operacao`).text(uf["operacao"] ? uf["operacao"] : "");
        $(`#${uf["nome"]}_vj`).text(uf["vj"] ? uf["vj"] : "");
        $(`#${uf["nome"]}_vk`).text(uf["vk"] ? uf["vk"] : "");
        $(`#${uf["nome"]}_qj`).text(((uf["qj"]) && (uf["qj"] !== 1)) ? uf["qj"] : "");
        $(`#${uf["nome"]}_qk`).text(((uf["qk"]) && (uf["qk"] !== 1)) ? uf["qk"] : "");
    }
}

function atualizaTabelaEstadoMenHTML(men) {
    for (var reg in men) {
        var teste = reg.charAt(1)//R0
        if(men[reg] !=null){
            console.log("entreiiii  " + `#F${teste}`);
            console.log(men[reg]);
            
            $(`#F${teste}`).html(men[reg]);

        }else{
            $(`#F${teste}`).html("&nbsp;");
        }
        
    }
}

function atualizaClock(clock) {
    $("#clock").html("<h3>Clock: <small id='clock'>" + clock + "</small></h3>");

}

// -----------------------------------------------------------------------------

function gerarTabelaEstadoInstrucaoHTML(diagrama) {
    var s = (
        "<h3>Status das Instruções</h3><table class='result'>"
        + "<tr><th></th><th>Instrução</th><th>i</th><th>j</th>"
        + "<th>k</th><th>Issue</th><th>Exec.<br>Completa</th><th>Enable to Write</th><th>Commit</th></tr>"
    );

    for (let i = 0 ; i < diagrama.configuracao["numInstrucoes"]; ++i) {
        let instrucao = diagrama.estadoInstrucoes[i].instrucao;
        s += (
            `<tr> <td>I${i}</td> <td>${instrucao["operacao"]}</td>
            <td>${instrucao["registradorR"]}</td> <td>${instrucao["registradorS"]}</td> <td>${instrucao["registradorT"]}</td>
            <td id='i${i}_is'></td></td> <td id='i${i}_ec'></td>
            <td id='i${i}_wr'></td> <td id='i${i}_commit'></td> </tr>`
        );
    }

    s += "</table>";
    $("#estadoInst").html(s);
}

function gerarTabelaEstadoUFHTML(diagrama) {
    var s = (
        "<h3>Estações de Reserva</h3><table class='result'><tr> <th>Tempo</th> <th>UF</th> <th>Ocupado</th>"
        + "<th>Op</th> <th>Vj</th> <th>Vk</th> <th>Qj</th> <th>Qk</th>"
    );

    console.log(diagrama.unidadesFuncionais);
    let unidadesFuncionais = diagrama.unidadesFuncionais;
    for(let key in unidadesFuncionais) {
        var uf = unidadesFuncionais[key];

        s += `<tr><td id="${uf["nome"]}_tempo"></td>
             <td>${uf["nome"]}</td> <td id="${uf["nome"]}_ocupado"></td>
             <td id="${uf["nome"]}_operacao"></td>
             <td id="${uf["nome"]}_vj"></td> <td id="${uf["nome"]}_vk"></td>
             <td id="${uf["nome"]}_qj"></td> <td id="${uf["nome"]}_qk"></td>
             `
    }

    s += "</table>"
    $("#estadoUF").html(s);
}

function gerarTabelaEstadoMenHTML(diagrama) {
    var s = `<h3>Status dos Registradores</h3> <table class="result">`;

      for(var i = 0; i < 1; i++) {
        s += `<tr>`
        for(var j = 0; j < 10; j++) {
            s += `<th>R${j+i}</th>`
        }
        s += `</tr><tr>`
        for(var j = 0; j < 10; j ++) {
            s += `<td id="F${j+i}">&nbsp;</td>`
        }
        s += `</tr>`
      }

    s += "</table><br>"
    $("#estadoMem").html(s);
}

function gerarTabelaEstadoUFMem(diagrama) {
    var s = (
        "<h3>Reservations Stations Load/Store</h3><table class='result'>"
        + "<tr><th>Tempo</th><th>Instrução</th><th>Ocupado</th><th>Endereço</th>"
        + "<th>Destino</th>"
    );
    for(let key in diagrama.unidadesFuncionaisMemoria) {
        var ufMem = diagrama.unidadesFuncionaisMemoria[key];

        s += `<tr><td id="${ufMem["nome"]}_tempo"></td>
             <td>${ufMem["nome"]}</td> <td id="${ufMem["nome"]}_ocupado"></td>
             <td id="${ufMem["nome"]}_endereco"></td><td id="${ufMem["nome"]}_destino"></td>
             `
    }
    s += "</table>"
    $("#estadoMemUF").html(s);
}

function atualizaTabelaEstadoUFMemHTML(ufsMem) {
    for(let key in ufsMem) {
        const ufMem = ufsMem[key];
        console.log('QQQQ', ufMem);
        $(`#${ufMem["nome"]}_tempo`).text((ufMem["tempo"] !== null) ? ufMem["tempo"] : "");
        $(`#${ufMem["nome"]}_ocupado`).text((ufMem["ocupado"]) ? "sim" : "não");
        $(`#${ufMem["nome"]}_operacao`).text(ufMem["operacao"] ? ufMem["operacao"] : "");
        $(`#${ufMem["nome"]}_endereco`).text(ufMem["endereco"] ? ufMem["endereco"] : "");
        $(`#${ufMem["nome"]}_destino`).text(ufMem["destino"] ? ufMem["destino"] : "");
    }
}

function geraTabelaParaInserirInstrucoes(nInst) {
    var tabela = "<table id='tabelaInst'>"
        for(var i = 0; i < nInst; i++) {
            var d = "D" + i;
            var r = "R" + i;
            var s = "S" + i;
            var t = "T" + i;
            tabela += (
                "<tr>" +
                    "<td>" +
                        "<select size=\"1\" name=\"" + d + "\" id=\"" + d + "\">" +
                        "<option selected value = \"\">None</option>" +
                        "<option value=\"LD\">LD</option>" +
                        "<option value=\"SD\">SD</option>" +
                        "<option value=\"MULT\">MULT</option>" +
                        "<option value=\"DIV\">DIV</option>" +
                        
                        "<option value=\"SUB\">SUB</option>" +
                        "<option value=\"ADD\">ADD</option>" +
                        
                        "<option value=\"BEQ\">BEQ</option>" +
                        "<option value=\"BNE\">BNE</option>" +
                    "</td>" +
                    "<td><input type=\"text\" name=\""+ r + "\" id=\""+ r + "\" size=\"3\" maxlength=\"3\" /></td>" +
                    "<td><input type=\"text\" name=\""+ s + "\" id=\""+ s + "\" size=\"3\" maxlength=\"5\" /></td>" +
                    "<td><input type=\"text\" name=\""+ t + "\" id=\""+ t + "\" size=\"3\" maxlength=\"3\" /></td>" +
                "</tr>"
            );
        }
        tabela += "</table>";
        $("#listaInstrucoes").html(tabela);
}

// -----------------------------------------------------------------------------

function carregaExemplo() {
    //var exN = $("#exemploSelect").val();

   
    var data = exemplo;
        $("#nInst").val(data["insts"].length);
        var confirmou = confirmarNInst();

        for (var i = 0; i < data["insts"].length; i++) {
           $(`#D${i}`).val(data["insts"][i]["D"]);
           $(`#R${i}`).val(data["insts"][i]["R"]);
           $(`#S${i}`).val(data["insts"][i]["S"]);
           $(`#T${i}`).val(data["insts"][i]["T"]);
        }

        for (var key in data["config"]["ciclos"]) {
           $(`#${key}`).val(parseInt(data["config"]["ciclos"][key]));
        }

        for (var key in data["config"]["unidades"]) {
            $(`#${key}`).val(parseInt(data["config"]["unidades"][key]));
        }


    };


function confirmarNInst() {
    var nInst = $("#nInst").val();
    if(nInst < 1) {
        alert("O número de instruções deve ser no mínimo 1");
        return false;
    }
    geraTabelaParaInserirInstrucoes(nInst);
    return true;
}


function limparCampos() {
    $("#exemploSelect").val("---");

    $("#nInst").val(1);
    $("#listaInstrucoes").html("");

    $("#ciclosInt").val(1);
    $("#ciclosFPAdd").val(1);
    $("#ciclosFPMul").val(1);
    $("#ciclosFPDiv").val(1);

    $("#fuStore").val(1);
    $("#fuLoad").val(1);
    $("#fuInt").val(1);
    $("#fuFPAdd").val(1);
    $("#fuFPMul").val(1);

    $("#clock").html("");
    $("#estadoInst").html("");
    $("#estadoMemUF").html("");
    $("#estadoUF").html("");
    $("#estadoMem").html("");
}


function verificaNInst() {
    var tds = $("#tabelaInst").children('tbody').children('tr').length;
    $("#nInst").val(tds);
}

$(document).ready(function() {
    var confirmou = false;
    var diagrama = null;
    var terminou = false;

    $("#limpar").click(function() {
        limparCampos();
    })

    $("#carregaExemplo").click(function() {
        carregaExemplo();
        confirmou = true;
    });

    $("#confirmarNInst").click(function() {
        confirmou = confirmarNInst();
    });

    $("#enviar").click(function() {
        if(!confirmou) {
            alert("Confirme o número de instruções!");
            return;
        }
        
        console.log("aqui");
        verificaNInst();
        
        const CONFIG = getConfig();
        if(!CONFIG) {
            return;
        }
        var insts = getAllInst(CONFIG["nInst"]);
        if(!insts) {
            alert("insts é null, deu erro");
            return;
        }
        diagrama = new Estado(CONFIG, insts);
        gerarTabelaEstadoInstrucaoHTML(diagrama);
        atualizaTabelaEstadoInstrucaoHTML(diagrama["tabela"])
        gerarTabelaEstadoUFHTML(diagrama);
        atualizaTabelaEstadoUFHTML(diagrama["uf"]);
        gerarTabelaEstadoMenHTML(diagrama);
        terminou = false;
        $("#clock").html("<h3>Clock: <small id='clock'>0</small></h3>");
    });

    $("#proximo").click(function() {
        
        if(!diagrama) {
            alert("Envie primeiro");
            return;
        }
        if(terminou) {
            alert("Todas as instruções foram finalizadas");
            return;
        }
        // terminou = avancaCiclo(diagrama);
        terminou = diagrama.executa_ciclo();
        atualizaTabelaEstadoInstrucaoHTML(diagrama.estadoInstrucoes);
        atualizaTabelaEstadoUFMemHTML(diagrama.unidadesFuncionaisMemoria);
        atualizaTabelaEstadoUFHTML(diagrama.unidadesFuncionais);
        atualizaTabelaEstadoMenHTML(diagrama.estacaoRegistradores);
        atualizaClock(diagrama.clock);

    });
    $("#resultado").click(function() {
        if(!diagrama) {
            alert("Envie primeiro");
            return;
        }
        while(!terminou) {
            terminou = diagrama.executa_ciclo();
            atualizaTabelaEstadoInstrucaoHTML(diagrama.estadoInstrucoes);
            atualizaTabelaEstadoUFMemHTML(diagrama.unidadesFuncionaisMemoria);
            atualizaTabelaEstadoUFHTML(diagrama.unidadesFuncionais);
            atualizaTabelaEstadoMenHTML(diagrama.estacaoRegistradores);
            atualizaClock(diagrama.clock);
        }
    });
});
