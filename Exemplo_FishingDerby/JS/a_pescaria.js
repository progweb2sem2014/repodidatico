// Criamos um objeto `Game`, definindo, em ordem, *largura*, *altura*, *modo de renderização*, *id do html*, *estado inicial*, *transparência* e *antialias*.
var jogo = new Phaser.Game(
    400, 
    600, 
    Phaser.AUTO, 
    'jogo', 
    null, 
    false, 
    false
);

//  Objeto para carregar fontes do Google Fonts. Quando termianr de carregar vai chamar a função de criar textos passando duas mensagens como parâmetros.
var WebFontConfig = {
    active: function() { jogo.time.events.add(Phaser.Timer.SECOND * 0.1, 
        CriarTexto, this, "a pescaria",
        "      pesque 100kg de peixe\n[wasd + espaço | setas + enter]\n\n      música: incompetech"); },
    google: {
      families: ['Homemade Apple']
    }
};

// ## Definindo variáveis globais
// Para que variáveis sejam acessíveis ao longo de vários estados ou funções, elas tem que ser declaradas no escopo global, ou seja, fora de funções.
var controleJ1, 
    controleJ2,
    scoreJ1,
    scoreJ2,
    txtJ1,
    txtJ2,
    musica;

// Inicializando algumas variáveis de gameplay.
var gravidade = 100;
var velocidadeAnzolY = 200;
var velocidadeAnzolX = 400;
var arrasto = 40;
var velocidadeMaxX = 100;
var velocidadeMaxY = 100;
var velPeixe = 50;
var intervaloPeixePequeno = 1;
var intervaloPeixeMedio = 2;
var intervaloPeixeGrande = 7;
var maxPeixes = 100;

// ## Criando estados
// Aqui, estamos criando um `State`. As três funções principais `preload`, `create` e `update` são definidas e associadas às respectivas propriedades do objeto `State.prototype`.

// ### Estado: Menu inicial
// Aqui criamos o estado para o menu inicial do jogo. Como esse será o primeiro estado carregado pelo jogo (o que é definido mais a frente no código), vamos aproveitar e já carregar todos os arquivos necessários neste `preload`, para não termos que nos preocuparmos mais com isso.

var MenuInicial = function (jogo) {};
MenuInicial.prototype = {
    
    // #### MenuInicial.preload()
    // A função `preload` carrega arquivos externos necessários para o estado rodar corretamente.
    preload: function () {
        
        // É importante que a referência ao arquivo esteja correta. Para isso, temos que seguir a hierarquia das nossas pastas. Primeiro, carregamos imagens.
        jogo.load.image('menu_fundo', 'assets/fundo_menu.jpg');
        jogo.load.image('fundo_papel', 'assets/fundo_papel.jpg');
        jogo.load.image('J1', 'assets/J1.png');
        jogo.load.image('J2', 'assets/J2.png');
        jogo.load.image('agua', 'assets/agua.png');
        jogo.load.image('anzol_J1', 'assets/anzol_J1.png');
        jogo.load.image('anzol_J2', 'assets/anzol_J2.png');
        jogo.load.image('peixe_pequeno', 'assets/peixe_pequeno.png');
        jogo.load.image('peixe_medio', 'assets/peixe_medio.png');
        jogo.load.image('peixe_grande', 'assets/peixe_grande.png');
        
        // Depois, carregamos sons.
        jogo.load.audio('trombou', 'assets/trombou.ogg');
        jogo.load.audio('pegou_peixe', 'assets/pegou_peixe.ogg');
        jogo.load.audio('fisgou_peixe', 'assets/fisgou_peixe.ogg');
        jogo.load.audio('musica', 'assets/Mellowtron_Incompetech.mp3');
        
        // Essa última linha carrega a fonte do Google Font.
        jogo.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
    }, // fim: preload
    
    // #### Menu.create()
    // A função `create` define operações executadas uma única vez no começo da execução do estado.
    create: function () {
        
        // Criar um sprite neste estado.
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
        
        if (musica == null) {
            musica = jogo.add.audio('musica');
            musica.play();
        }
    }, // fim: create
    
    // #### MenuInicial.update()
    // Durante a função `update`, vamos apenas checar se alguma das teclas de ação foi pressionada.
    update: function () {
        if (controleJ1.acao.justPressed (5) || controleJ2.acao.justPressed (5)) {
            
            // Então, começamos a partida, indo para o próximo estado.
            jogo.state.start('Pescaria', Pescaria);
        }
    } // fim: update
}

// ### Estado: Pescaria
// Neste estado é que o jogo "acontece". Aqui tratamos de inputs, scores, movimentos. Primeiro, aproveitamso a criação do objeto para definir algumas variáveis que estarão encapsuladas dentro desse objeto.
var Pescaria = function (jogo) {
    var anzolJ1,
        anzolJ2,
        corJ1,
        corJ2,
        imgJ1,
        imgj2,
        topoAgua,
        peixes,
        somFisgou,
        somPegou,
        somTrombou;
};

Pescaria.prototype = {
    
    // #### Pescaria.create()
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
        corJ1 = 0x9a55a6;
        
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
        corJ2 = 0xd5bc47;
        jogo.physics.enable(anzolJ2, Phaser.Physics.ARCADE);
        anzolJ2.body.setSize(20, 30, 0, 16);
        anzolJ2.body.gravity.setTo(0, gravidade);
        anzolJ2.body.collideWorldBounds = true;
        anzolJ2.body.drag.setTo(arrasto, arrasto);
        anzolJ2.body.maxVelocity.setTo(velocidadeMaxX, velocidadeMaxY);
        
        // O objeto `topoAgua` é invisível, usado apenas para servir como um *trigger*, ou seja, um sensor para quando os anzóis tentam sair da água. Mais adiante, vamos usar esse objeto para limitar movimentos e para saber quando o pescador acabou de pegar um peixe.
        topoAgua = this.add.sprite (0, 230);
        jogo.physics.enable(topoAgua, Phaser.Physics.ARCADE);
        topoAgua.body.setSize(400, 20, 0, 0);
        topoAgua.body.gravity.setTo(0, 0);
        topoAgua.body.immovable = true;
        
        // Criação de um grupo para guardar os peixes
        peixes = jogo.add.group();
        peixes.physicsBodyType = Phaser.Physics.ARCADE;
        peixes.enablePhysics = true;
        
        // Para criar peixes periodicamente, defini uma função `CriarPeixe`. Ela é chamada utilizando o sistema de **eventos** do Phaser, de forma que repita sempre, mas em intervalos de tempo regulares.
        jogo.time.events.loop (
            Phaser.Timer.SECOND * intervaloPeixePequeno, 
            CriarPeixe, this, peixes, 'peixe_pequeno', 280, 500);
        jogo.time.events.loop (
            Phaser.Timer.SECOND * intervaloPeixeMedio, 
            CriarPeixe, this, peixes, 'peixe_medio', 300, 580);
        jogo.time.events.loop (
            Phaser.Timer.SECOND * intervaloPeixeGrande, 
            CriarPeixe, this, peixes, 'peixe_grande', 480, 580);
        
        // Zerando as pontuações.
        scoreJ1 = scoreJ2 = 0;
        
        // Cria um contexto de bitmap para desenhar linhas e adiciona ao jogo
        this.bitmap = this.game.add.bitmapData(this.game.width, this.game.height);
        this.bitmap.context.lineWidth = 3;
        this.game.add.image(0, 0, this.bitmap);
        
        // Dois objetos de texto que serão usados para mostrar a pontuação de cada jogador.
        txtJ1 = jogo.add.text(20, 135, "0 kg");
        txtJ1.setStyle({font: '32px Homemade Apple', fill: '#ffffff', stroke: '#ffffff'});
        
        txtJ2 = jogo.add.text(300, 135, "0 kg");
        txtJ2.setStyle({font: '32px Homemade Apple', fill: '#ffffff', stroke: '#ffffff'});
        
        // Inicializando os diferentes sons
        somPegou = jogo.add.audio('pegou_peixe');
        somFisgou = jogo.add.audio('fisgou_peixe');
        somTrombou = jogo.add.audio('trombou');
        
    }, // fim: create
    
    // #### Pescaria.update()
    // Aqui definimos o fluxo do jogo a cada frame
    update: function () {
        // Tratamento de inputs e movimento. Mais detalhes na última seção.
        TratarInput(controleJ1, anzolJ1);
        TratarInput(controleJ2, anzolJ2);
        // Define colisões entre objetos e grupos de objetos
        jogo.physics.arcade.collide (anzolJ1, peixes, QuandoColidirPeixeAnzol);
        jogo.physics.arcade.collide (anzolJ2, peixes, QuandoColidirPeixeAnzol);
        jogo.physics.arcade.collide (anzolJ1, topoAgua, QuandoColidirAnzolTopo);
        jogo.physics.arcade.collide (anzolJ2, topoAgua, QuandoColidirAnzolTopo);
        
        // Depois de definidos os comportamentos mais recorrentes, é hora de criar instruções que controlam o fluxo de jogo a cada frame. Aqui, vamos ver se algum dos jogadores já alcançou 100kg de peixe. Se esse for o caso, vamos carregar o próximo estado do jogo.
        if (scoreJ1 >= maxPeixes || scoreJ2 >= maxPeixes) {
            jogo.state.start('MenuFinal', MenuFinal);
        }
    }, // fim: update
    
    // #### Pescaria.render()
    // Na função `render` podemos desenhar coisas depois que a função `update` de todos os objetos foram chamadas. Isso é útil para garantir que as novas posições dos objetos já foram calculadas.
    render: function () {
        // Limpa o contexto de desenho de primitivas.
        this.bitmap.clear();
        DesenharLinha (this.bitmap.context, 'rgb(154, 85, 166)', 184, 65, anzolJ1.x + 2, anzolJ1.y + 2 );
        DesenharLinha (this.bitmap.context, 'rgb(213, 188, 71)', 216, 65, anzolJ2.x + 2, anzolJ2.y + 2);
    } // fim: render
}

var MenuFinal = function (jogo) {};
MenuFinal.prototype = {
    // #### MenuFinal.create()
    create : function () {
        // Carregamos imagens parecidas com a do primeiro menu, com a diferença que apenas carregamos a imagem se o jogador conseguiu mais de 100kg de peixe.
        this.add.sprite(0, 0, 'fundo_papel');
        var agua1 = this.add.sprite(0, 0, 'agua');
        agua1.blendMode = PIXI.blendModes.MULTIPLY;
        if (scoreJ1 >= maxPeixes) {
            imgJ1 = this.add.sprite(0, 0, 'J1');
            imgJ1.blendMode = PIXI.blendModes.MULTIPLY;
        }
        if (scoreJ2 >= maxPeixes) {
            imgJ2 = this.add.sprite(0, 0, 'J2');
            imgJ2.blendMode = PIXI.blendModes.MULTIPLY;
        }
        var agua2 = this.add.sprite(0, 0, 'agua');
        agua2.blendMode = PIXI.blendModes.MULTIPLY;
        
        // Aqui vai a mensagem final
        CriarTexto ('a pescaria', 'aqui só fica quem produz!\n      [enter + espaço]');
    
    },
    // #### MenuFinal.update()
    // Durante a função `update`, vamos apenas checar se alguma das teclas de ação foi pressionada, para então trocar para o `MenuInicial` novamente.
    update: function () {
        if (controleJ1.acao.isDown && controleJ2.acao.isDown) {
            jogo.state.start('MenuInicial', MenuInicial);
        }
    } // fim: update
}

// ## Rodando estados
// Agora que criamos alguns estados, podemos dar chaves para eles (`state.add`) e escolher um para executar (`state.start`).
jogo.state.add('MenuInicial', MenuInicial);
jogo.state.add('Pescaria', Pescaria);
jogo.state.add('MenuFinal', MenuFinal);
jogo.state.start('MenuInicial', MenuInicial);

// ## Funções
// Aqui estão funções utilizadas em outros pontos do código. O objetivo de definir essas funções em separado é poder reutilizá-las sem maiores esforços e repetições.

// ### DesenharLinha()
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
    if(jogador.acao.isDown){
        anzol.body.maxVelocity.y = velocidadeMaxY * 4;
        anzol.body.acceleration.y = -velocidadeAnzolY * 4;
    }
} // fim: TratarInput

// ### QuandoColidirPeixeAnzol()
// Processa o momento em que o anzol pega um peixe.
function QuandoColidirPeixeAnzol (anzol, peixe) {
    if (anzol.children.length == 0) {
        peixe.tint = (anzol == anzolJ1) ? corJ1 : corJ2;
        peixe.body.velocity.setTo(0,0);
        peixe.body.enable = false;
        anzol.addChild (peixe);
        peixe.x = 0;
        peixe.y = 15;
        if (!somFisgou.isPlaying) somFisgou.play();
    }
    else {
        if (!somTrombou.isPlaying) somTrombou.play();
    }
} // fim: QuandoColidirPeixeAnzol

// ### QuandoColidirAnzolTopo()
// Processa o momento em que o anzol está com um peixe e encosta no topo da água.
function QuandoColidirAnzolTopo (anzol, topo) {
    console.log("tocou topo");
    if (anzol.children.length > 0) {
        p = anzol.children[0];
        if (anzol == anzolJ1) {
            scoreJ1 += p.health;
        }
        else {
            scoreJ2 += p.health;
        }
        anzol.removeChild(p);
        p.destroy();
        txtJ1.text = scoreJ1 + ' kg';
        txtJ2.text = scoreJ2 + ' kg';
        if (!somPegou.isPlaying) somPegou.play();
    } 
} // fim: QuandoColidirAnzolTopo

// ### CriarPeixe()
// Cria e adiciona peixes ao grupos.
function CriarPeixe (grupo, tipo, minY, maxY) {

    grupo.forEach (function (p) {
        if (p.inWorld) {
            p.outOfBoundsKill = true;
        }
    });
    
    var lixo = grupo.getFirstDead();
    if (lixo != null) {
        grupo.remove(lixo, true);
    }

    var peixe = grupo.create (0, 0, tipo);
    peixe.x = (grupo.game.rnd.between(0, 1) > 0.5)? 450 : -50;
    peixe.y = grupo.game.rnd.between(minY, maxY);
    peixe.checkWorldBounds = true;
    grupo.game.physics.enable(peixe, Phaser.Physics.ARCADE);
    if (peixe.x < 0) {
        peixe.body.velocity.x = velPeixe * grupo.game.rnd.between(1, 1.5);
        peixe.scale.x = -1;
    }
    else {
        peixe.body.velocity.x = -velPeixe * grupo.game.rnd.between(1, 1.5);
        peixe.scale.x = 1;
    } 
    peixe.body.immovable = true;
    peixe.anchor.setTo(0.5, 0.5);
    // Para definir o peso de cada peixe, vamos usar a sua saúde. Quando ele for pego, esse valor será somado aos pontos do jogador que o pegou.
    switch(tipo) {
        case 'peixe_pequeno' : peixe.health = 3; break;
        case 'peixe_medio' : peixe.health = 8; break;
        case 'peixe_grande' : peixe.health = 20; break;
    }
} // fim: CriarPeixe

// ### CriarTexto()
// Função que cria textos com duas partes: um título e uma série de instruções.
function CriarTexto (msg1, msg2) {
    console.log("texto");
    var txtTitulo = jogo.add.text(jogo.world.centerX, jogo.world.centerY, msg1);
    // Queremos o texto centralizado e em branco.
    txtTitulo.anchor.setTo(0.5);
    txtTitulo.setStyle({font: '64px Homemade Apple', fill: '#ffffff', stroke: '#ffffff'});
    // Criamos mais um objeto para as instruções iniciais.
    var txtInstrucoes = jogo.add.text(jogo.world.centerX, jogo.world.centerY+100, msg2);
    txtInstrucoes.anchor.setTo(0.5, 0);
    txtInstrucoes.setStyle({font: '22px Homemade Apple', fill: '#888888', stroke: '#ffffff'});
}// fim: CriarTexto

    

