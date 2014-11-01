console.log("v6");

var game = new Phaser.Game (
  600, 
  400, 
  Phaser.AUTO, 
  "div-jogo",
  {
    preload: MeuPreload,
    create: MeuCreate,
    update: MeuUpdate
  });

var kong;

function MeuPreload ()
{
  kongregateAPI.loadAPI(TerminouDeConectar);
}

function MeuCreate ()
{
  game.input.onDown.add(
    function () 
    {
      console.log("clicou");
      kong.stats.submit("quantos-cliques", 1);
    },
    this
  );
}

function MeuUpdate ()
{
  
}

function TerminouDeConectar () 
{
  kong = kongregateAPI.getAPI();
  console.log(kong.services.getUsername());
}
  
var EstadoAndar = {
  entrar : function () {
    // play na animacao de andar
    
    if (Personagem.anterior == EstadoAgachar)
    {
      // play na animacao de se levantar
    }
  },
  atualizar : function () {
    // se o botao de pular for apertado, 
    // ir para EstadoPular
    
    // se o botao para baixo for apertado,
    // ir para EstadoAgachar
    
    // mudar posicao do personagem 
    // atualizar a animacao (espelhar, se necessario)
  },
  sair : function () {
    // "limpeza"
  }
}

var EstadoAgachar = {
  entrar : function () {
    // play na animacao de agachar
    // ligar o freio
    // mudancas de camera
  },
  atualizar : function () {
    // se a tecla pra baixo for solta,
    // ir para EstadoAndar
    Personagem.trocarEstado(EstadoAndar);
    // atualizar velocidade
  },
  sair : function () {
    // limpeza
  }
}

var Personagem = {
  estado : EstadoAndar,
  anterior : null,
  atualizar : function () {
    estado.atualizar();
  },
  trocarEstado : function (novoEstado) {
    Personagem.estado.sair();
    Personagem.anterior = Personagem.estado;
    Personagem.estado = novoEstado;
    Personagem.estado.entrar();
  }
}









  
  
  
  