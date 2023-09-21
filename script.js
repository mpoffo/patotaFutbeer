var PESOS_ATAQUE = {    VELOCIDADE: 30,    HABILIDADE: 45,    MARCACAO: 25 };
var PESOS_DEFESA = {    VELOCIDADE: 30,    HABILIDADE: 20,    MARCACAO: 50 };

var jogadores = [
    { nome: "Marcos",   dentro: "true", predomicancia: "GOL",    velocidade: "****",   habilidade: "***",      marcacao: "****"    },
    { nome: "Patrick",  dentro: "true", predomicancia: "GOL",    velocidade: "*",      habilidade: "***",      marcacao: "****"    },
    { nome: "Rodrigo",  dentro: "true", predomicancia: "DEFESA", velocidade: "****",   habilidade: "***",      marcacao: "****"    },  
    { nome: "Poffo",    dentro: "true", predomicancia: "DEFESA", velocidade: "****",   habilidade: "**",       marcacao: "***"     },
    { nome: "Maicon",   dentro: "true", predomicancia: "DEFESA", velocidade: "**",     habilidade: "*",        marcacao: "*****"   },    
    { nome: "Fabio",    dentro: "true", predomicancia: "DEFESA", velocidade: "*",      habilidade: "*",        marcacao: "****"    },
    { nome: "Edelei",   dentro: "true", predomicancia: "DEFESA", velocidade: "**",     habilidade: "**",       marcacao: "**"      },
    { nome: "Chapolin", dentro: "true", predomicancia: "DEFESA", velocidade: "****",   habilidade: "***",      marcacao: "***"     },
    { nome: "Maninho",  dentro: "true", predomicancia: "ATAQUE", velocidade: "*****",  habilidade: "****",     marcacao: "*****"   },
    { nome: "Sergio",   dentro: "true", predomicancia: "ATAQUE", velocidade: "***",    habilidade: "***",      marcacao: "*"       },
    { nome: "Lucas",    dentro: "true", predomicancia: "ATAQUE", velocidade: "***",    habilidade: "***",      marcacao: "***"     },
    { nome: "Duca",     dentro: "true", predomicancia: "ATAQUE", velocidade: "**",     habilidade: "***",      marcacao: "***"     },
    { nome: "Ricardo",  dentro: "true", predomicancia: "ATAQUE", velocidade: "*****",  habilidade: "*****",    marcacao: "*****"   },
    { nome: "Henrique", dentro: "true", predomicancia: "ATAQUE", velocidade: "****",   habilidade: "**",      marcacao: "**" }
];

var goleiros = [...jogadores].filter(function(j) {return j.predomicancia=="GOL"});
var atacantes = [...jogadores].filter(function(j) {return j.predomicancia=="ATAQUE"});
var defensores = [...jogadores].filter(function(j) {return j.predomicancia=="DEFESA"});

//Calcula o score de ataque e defesa
jogadores.forEach(function(jogador) {
    jogador.scoreAtaque = calculaScoreJogador("ATAQUE", jogador);
    jogador.scoreDefesa = calculaScoreJogador("DEFESA", jogador);    
    jogador.score = parseFloat(((jogador.scoreAtaque + jogador.scoreDefesa) / 2).toFixed(2));
});

printClassificacaoJogadores();

// Ordena melhor/pior por score de defesa
ordenaEPrintaLinhaJogador("#rankingDefesa", defensores, "DEFESA");
ordenaEPrintaLinhaJogador("#rankingAtaque", atacantes, "ATAQUE");

$("#sort").click(function() {
    sortear();
});

/*
   ############  Funções ###########
*/

function sortear() {    
    $("#datenow").html(new Date().toLocaleDateString("pt-BR"));
    goleiros = misturaAleatoria(goleiros);
    defensores = misturaAleatoria(defensores);
    atacantes = misturaAleatoria(atacantes);

    var timeA = [];
    var timeB = [];

    goleiros.forEach(function(goleiro, i) {
        if(i % 2 == 0){
            timeA.push(goleiro);
        } else {
            timeB.push(goleiro);
        }
    });

    defensores.forEach(function(defensor, i) {
        if(i%2==0){
            timeA.push(defensor);
        } else {
            timeB.push(defensor);
        }
    });

    atacantes.forEach(function(atacante, i) {        
        if(i%2==0){
            timeA.push(atacante);
        } else {
            timeB.push(atacante);
        }
    });

    var somaScoreA = somaRanking(timeA);
    var somaScoreB = somaRanking(timeB);
    var diff = timeA - timeB
    console.log(diff);
    if(diff < -3) { //Time B mais forte
        alert("Time B muito forte, sorteio será refeito automaticamente (diferença "+(diff*-1)+")");
        sortear();
    } else if(diff > 3) { //Time A mais forte
        alert("Time B muito forte, sorteio será refeito automaticamente (diferença "+(diff*-1)+")");
        sortear();
    }

    ordenaEPrintaLinhaJogador("#sortTimeA", timeA, "SCORE");
    ordenaEPrintaLinhaJogador("#sortTimeB", timeB, "SCORE");

    $("#somaRankingA").html(somaScoreA);
    $("#somaRankingB").html(somaScoreB);
}

function calculaScoreJogador(posicao, jogador) {
    var pesos = null;
    if(posicao == "ATAQUE") {
        pesos = PESOS_ATAQUE;
    } else {
        pesos = PESOS_DEFESA;
    }
    var score = (estrelas(jogador.velocidade) * pesos.VELOCIDADE / 100) +
                (estrelas(jogador.habilidade) * pesos.HABILIDADE / 100) + 
                (estrelas(jogador.marcacao)   * pesos.MARCACAO / 100);
    return parseFloat(parseFloat(score).toFixed(2));
}



function estrelas(caracteristica) {
    return caracteristica.length;
}

function misturaAleatoria(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function somaRanking(time) {
    return parseFloat(time.reduce((totalScore, jogador) => {
        return totalScore + jogador.score;
    }, 0).toFixed(2));
}

function padR20(t) {
    while(t.length<12){
        t = t + " ";
    }
    return t;
}
function padR5(t) {
    while(t.length<5){
        t = t + "_";
    }
    return t;
}
function printClassificacaoJogadores() {
    var tplOri = $(".tpljogador").parent().html();
    var table = $("#classjogadores").first();
    jogadores.forEach(function(jogador) {
        var tpl = tplOri;
        
        tpl = tpl.replace("#JOGADOR", jogador.nome);
        tpl = tpl.replace("#POSICAO", jogador.predomicancia);

        tpl = tpl.replace("#STARVEL", toStars(jogador.velocidade));
        tpl = tpl.replace("#STARHAB", toStars(jogador.habilidade));
        tpl = tpl.replace("#STARMAR", toStars(jogador.marcacao));

        tpl = tpl.replace("#SCORED", jogador.scoreDefesa);
        tpl = tpl.replace("#SCOREA", jogador.scoreAtaque);
        tpl = tpl.replace("#SCORE", jogador.score);

        table.append(tpl);
    });
    $("#classjogadores").children().not(":first-child").show();
}

function toStars(stars) {
    var star = '<span class="fa fa-star checked"></span>';
    var nostar = '<span class="fa fa-star unchecked"></span>';
    r = padR5(stars);
    var r = r.replace(/\*/g, star);
    var r = r.replace(/\_/g, nostar);
    return r;
}

function ordenaEPrintaLinhaJogador(div, lista, scoreType) {
    $(div).html("");
    lista.sort(function(j1,j2) {
        if(scoreType == "DEFESA")
                return j2.scoreDefesa - j1.scoreDefesa;
        else if(scoreType == "ATAQUE") 
            return j2.scoreAtaque - j1.scoreAtaque;
        else return j2.score - j1.score;
    });
    lista.forEach(function(jogador) {
        var score = 0;
        if(scoreType == "DEFESA")
            score = jogador.scoreDefesa;
        else if(scoreType == "ATAQUE") 
            score = jogador.scoreAtaque;
        else score = jogador.score;
        $(div)
        .append('<div class="row"><img src="img/'+jogador.nome+'.png"><span class="nome">'+padR20(jogador.nome) + '</span> <span class="badge">Score: ' + score).append("</span></div>");
    });
}

function printSorteio() {
    var divContents = document.getElementById("divsorteio").innerHTML;
    var a = window.open('', '', 'height=800, width=800');
    a.document.write('<html>');
    a.document.write('<head> \
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"> \
                <link rel="stylesheet" href="style.css"> \
                <script  src="https://code.jquery.com/jquery-3.7.1.min.js"></script> \
                </head>');                
    a.document.write('<body >');
    a.document.write(divContents);
    a.document.write('</body></html>');
    a.document.close();
    setTimeout(function() {a.print(); },100);
    //a.print();
}