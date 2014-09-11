// Criamos um objeto `Game`, definindo, em ordem, *largura*, *altura*, *modo de renderização*, *id do html*, *estado inicial*, *transparência* e *antialias*.
var jogo = new Phaser.Game (
    400, 
    600, 
    Phaser.AUTO, 
    'jogo', 
    null, 
    false, 
    false);

// ## Definindo variáveis globais
// Para que variáveis sejam acessíveis ao longo de vários estados ou funções, elas tem que ser declaradas no escopo global, ou seja, fora de funções.
var controleJ1, 
    controleJ2,
    scoreJ1,
    scoreJ2;
// Inicializando algumas variáveis de gameplay.
var gravidade = 100;
var velocidadeAnzolY = 400;
var velocidadeAnzolX = 400;
var arrasto = 10;
var velocidadeMaxX = 100;
var velocidadeMaxY = 100;

// ## Criando estados
// Aqui, estamos criando um `State`. Normalmente, as três funções principais `preload`, `create` e `update` são definidas e associadas a propriedades do objeto `State.prototype`.

// ### Estado: Menu inicial
// Aqui criamos o estado para o menu inicial do jogo. Como esse será o primeiro estado carregado pelo jogo (o que é definido mais a frente no código), vamos aproveitar e já cerrgar todos os arquivos necessários neste `preload`, para não termos que nos preocuparmos mais com isso.

var MenuInicial = function (jogo) {};
MenuInicial.prototype = {
    
    // A função `preload` carrega arquivos externos necessários para o estado rodar corretamente.
    preload: function () {
        // É importante que a referência ao arquivo esteja correta. Para isso, temos que seguir a hierarquia das nossas pastas.
        jogo.load.image('menu_fundo', '../Assets/fundo_menu.jpg');
        jogo.load.image('fundo_papel', '../Assets/fundo_papel.jpg');
        jogo.load.image('J1', '../Assets/J1.png');
        jogo.load.image('J2', '../Assets/J2.png');
        jogo.load.image('agua', '../Assets/agua.png');
        jogo.load.image('anzol_J1', '../Assets/anzol_J1.png');
        jogo.load.image('anzol_J2', '../Assets/anzol_J2.png');
    }, // fim: preload
    
    // A função `create` define operações executadas uma única vez no começo da execução do estado.
    create: function () {
        // Criar um sprite e adicioná-lo ao estado.
        this.add.sprite(0, 0, 'menu_fundo');
        // Também inicializamos os dois objetos globais pra guardar input de jogadores. Assim, podemos usar esses objetos e suas definições em todos os estados do jogo.
        controleJ1 = {
            cima: jogo.input.keyboard.addKey (Phaser.Keyboard.W),
            baixo: jogo.input.keyboard.addKey (Phaser.Keyboard.S),
            esquerda: jogo.input.keyboard.addKey (Phaser.Keyboard.A),
            direita: jogo.input.keyboard.addKey (Phaser.Keyboard.D),
            acao: jogo.input.keyboard.addKey (Phaser.Keyboard.SPACEBAR)
        };
        
        controleJ2 = {
            cima: jogo.input.keyboard.addKey (Phaser.Keyboard.UP),
            baixo: jogo.input.keyboard.addKey (Phaser.Keyboard.DOWN),
            esquerda: jogo.input.keyboard.addKey (Phaser.Keyboard.LEFT),
            direita: jogo.input.keyboard.addKey (Phaser.Keyboard.RIGHT),
            acao: jogo.input.keyboard.addKey (Phaser.Keyboard.ENTER)
        };
    }, // fim: create
    // Durante a função `update`, vamos apenas checar se alguma das teclas de ação foi pressionada.
    update: function () {
        if (controleJ1.acao.justPressed (5) || controleJ2.acao.justPressed (5)) {
            // Então, começamos a partida, indo para o próximo estado.
            jogo.state.start('Pescaria', Pescaria);
        }
    } // fim: update
}

// ### Estado: Pescaria
// Neste estado é que o jogo "acontece". Aqui tratamos de inputs, scores, movimentos.
var Pescaria = function (jogo) {
    var anzolJ1,
        anxolJ2,
        imgJ1,
        imgj2,
        topoAgua;
};

Pescaria.prototype = {
    // #### Create
    // Na função de inicialização criamos a situação inicial do jogo, assim como definimos os objetos já presentes.
    create: function () {
        // Carregamos imagens e criamos variáveis para guardá-las.
        this.add.sprite(0, 0, 'fundo_papel');
        
        // Adiciona a imagem da água, usando um modo de mesclagem chamado `MULTIPLY`, que determina como uma imagem se relaciona com outra. Pense em camadas de Photoshop. 
        var agua1 = this.add.sprite(0, 0, 'agua');
        agua1.blendMode = PIXI.blendModes.MULTIPLY;
        
        // Aqui adicionamos as imagens dos dois jogadores. Também usamos o modo `MULTIPLY`.
        imgJ1 = this.add.sprite(0, 0, 'J1');
        imgJ1.blendMode = PIXI.blendModes.MULTIPLY;
        imgJ2 = this.add.sprite(0, 0, 'J2');
        imgJ2.blendMode = PIXI.blendModes.MULTIPLY;
        
        // Uma segunda camada de água, para que fique mais escura.
        var agua2 = this.add.sprite(0, 0, 'agua');
        agua2.blendMode = PIXI.blendModes.MULTIPLY;
        
        // Criação de um anzol. Esse é um processo em vários passos. Primeiro, criamos um sprite e definimos seu centro.
        anzolJ1 = this.add.sprite(50, 400, 'anzol_J1');
        anzolJ1.anchor.setTo(0.5, 0.5);
        // Depois, o sistema de física é habilitado, e uma série de configurações é feita. Em ordem: 1) mudar o tamanho do objeto físico, 2) criar gravidade, 3) ativar colisões com as bordas do mundo, 4) criar arrasto, 5) definir velocidade máxima.
        jogo.physics.enable(anzolJ1, Phaser.Physics.ARCADE);
        anzolJ1.body.setSize(20, 30, 8, 16);
        anzolJ1.body.gravity.setTo(0, gravidade);
        anzolJ1.body.collideWorldBounds = true;
        anzolJ1.body.drag.setTo(arrasto, arrasto);
        anzolJ1.body.maxVelocity.setTo(velocidadeMaxX, velocidadeMaxY);
        
        // Aqui as mesmas configurações são feitas pro segundo anzol.
        anzolJ2 = this.add.sprite(350, 400, 'anzol_J2');
        anzolJ2.anchor.setTo(0.5, 0.5);
        jogo.physics.enable(anzolJ2, Phaser.Physics.ARCADE);
        anzolJ2.body.setSize(20, 30, 0, 16);
        anzolJ2.body.gravity.setTo(0, gravidade);
        anzolJ2.body.collideWorldBounds = true;
        anzolJ2.body.drag.setTo(arrasto, arrasto);
        anzolJ2.body.maxVelocity.setTo(velocidadeMaxX, velocidadeMaxY);
        
        // Este é um objeto invisível, usado apenas para servir como um *trigger*, ou seja, um sensor para quando os anzóis tentam sair da água. Mais adiante, vamos usar esse objeto para limitar movimentos e para saber quando o pescador acabou de pegar um peixe.
        topoAgua = this.add.sprite (0, 230);
        jogo.physics.enable(topoAgua, Phaser.Physics.ARCADE);
        topoAgua.body.setSize(400, 20, 0, 0);
        topoAgua.body.gravity.setTo(0, 0);
        topoAgua.body.immovable = true;
        
        // Zerando as pontuações.
        scoreJ1 = scoreJ2 = 0;
        
        // Cria um contexto de bitmap para desenhar linhas e adiciona ao jogo
        this.bitmap = this.game.add.bitmapData(this.game.width, this.game.height);
        this.bitmap.context.lineWidth = 3;
        this.game.add.image(0, 0, this.bitmap);
    }, // fim: create
    // #### Update
    // Aqui definimos o fluxo do jogo a cada frame
    update: function () {
        /*jogo.debug.body(topoAgua);*/
        // Tramaento de inputs e movimento. Mais detalhes na última seção.
        TratarInput(controleJ1, anzolJ1);
        TratarInput(controleJ2, anzolJ2);
        // Define colisões entre objetos e grupos de objetos
        jogo.physics.arcade.collide(anzolJ1, topoAgua);
        jogo.physics.arcade.collide(anzolJ2, topoAgua);
    }, // fim: update
    // Na função `render` podemos desenhar coisas depois que a função `update` de todos os objetos foram chamadas. Isso é útil para garantir que as novas posições dos objetos já foram calculadas.
    render: function () {
        // Limpa o contexto de desenho de primitivas.
        this.bitmap.clear();
        DesenharLinha (this.bitmap.context, 'rgb(154, 85, 166)', 184, 65, anzolJ1.x + 2, anzolJ1.y + 2 );
        DesenharLinha (this.bitmap.context, 'rgb(213, 188, 71)', 216, 65, anzolJ2.x + 2, anzolJ2.y + 2);
    } // fim: render
}

// ## Rodando estados
// Agora que criamos alguns estados, podemos dar chaves para eles (`state.add`) e escolher um para executar (`state.start`).
jogo.state.add('MenuInicial', MenuInicial);
jogo.state.add('Pescaria', Pescaria);
jogo.state.start('MenuInicial', MenuInicial);

// ## Funções
// Aqui estão funções utilizadas em outros pontos do código. O objetivo de definir essas funções em separado é poder reutilizá-las sem maiores esforços e repetições.

// ### Desenhar Linha
// Desenha a linha de um jogador, criando um desenho vetorial (*path*) diretamente no elemento canvas.
function DesenharLinha (contexto, cor, origemX, origemY, fimX, fimY) {
    contexto.beginPath();
    contexto.strokeStyle = cor;
    contexto.moveTo(origemX, origemY);
    contexto.lineTo(fimX, fimY);
    contexto.stroke();
    contexto.closePath();
} // fim: DesenharLinha

// ### Tratar Input
// Checa as diferentes possibilidades de input de um jogador e altera o movimento do respectivo anzol.
function TratarInput (jogador, anzol) {
    // A cada frame, zera a aceleração e depois cria novos valores de acordo com as teclas apertadas.
    anzol.body.acceleration.setTo (0,0);
    if(jogador.cima.isDown){
        anzol.body.acceleration.y = -velocidadeAnzolY;
    }
    if(jogador.baixo.isDown){
        anzol.body.acceleration.y = velocidadeAnzolY;
    }
    if(jogador.esquerda.isDown){
        anzol.body.acceleration.x = -velocidadeAnzolX;
    }
    if(jogador.direita.isDown){
        anzol.body.acceleration.x = velocidadeAnzolX;
    }
    // Caso a tecla de ação estiver apertada e o jogador estiver movendo-se para cima, deixamos ele subir mais rápido.
    anzol.body.maxVelocity.y = velocidadeMaxY;
    if(jogador.acao.isDown && anzol.body.velocity.y < 0){
        anzol.body.maxVelocity.y = velocidadeMaxY * 4;
    }
} // fim: TratarInput


