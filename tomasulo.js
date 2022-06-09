//instrucao pode ter tipo,texto,operador1,opderador2,opderadorResultado
function mapeiaInstrucao(inst){
  campos = inst["texto"].split(" ");
  inst["inst"] = campo[0]!=null?campo[0]:null ;
  inst["op1"] = campo[1]!=null?campo[1]:null ;
  inst["op2"] = campo[2]!=null?campo[2]:null ;
  inst["opR"] = campo[3]!=null?campo[3]:null ;
  inst["tipo"] = campo[4]!=null?getEstacaoReserva(inst) : null ;

}
function getEstacaoReserva(inst){
  switch(inst['inst']){
    case "add":
      return "ADD";
      break;
    case "sub":
      return "ADD";
      break;
    case "mult":
      return "MULT":

      break;
    case "div":
      return "MULT";
    case "load":
      return "LOAD":
    case "div":
      return "LOAD";
    default:
      console.log("Estação de reseva da instrução " + inst + "não identificada");
      return null;
  }
}
