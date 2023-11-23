futbeerApp = angular.module('futbeerApp', []);

futbeerApp.controller('FutbeerCtrl', ['$scope', '$timeout', '$http', '$filter',
    function FutbeerCtrl($scope, $timeout, $http, $filter) {        
        db = new Database($http);

        $scope.DIFMIN = 3;

        $scope.patotaData = { jogadores: [] };
        $scope.patotaData.dataSorteio = "";

        $scope.updateDatabase = function () {
            db.update($scope.patotaData);
        }

        $scope.addConvidado = function (posicao) {
            $scope.patotaData.jogadores.push(new Jogador("Nome convidado", true, 3, posicao, 3, 3, 3, true));
            $scope.updateDatabase()
        }

        $scope.qtdJogadoresDentro = function () {
            return $scope.patotaData.jogadores.filter(j => j.dentro).length
        }

        $scope.updateHabilidadeJogador = function (jogador, rating) {
            jogador.updateHabilidade(rating);
            $scope.updateDatabase();
        }

        $scope.updateVelocidadeJogador = function (jogador, rating) {
            jogador.updateVelocidade(rating);
            $scope.updateDatabase();
        }

        $scope.updateMarcacaoJogador = function (jogador, rating) {
            jogador.updateMarcacao(rating);
            $scope.updateDatabase();
        }

        $scope.qtdDefesaDentro = function () {
            return $scope.patotaData.jogadores.filter(j => j.predominancia == "DEFESA" && j.dentro).length
        }

        $scope.qtdAtaqueDentro = function () {
            return $scope.patotaData.jogadores.filter(j => j.predominancia == "ATAQUE" && j.dentro).length
        }

        $scope.updatePosicaoJogador = function (jogador, posicao) {
            if (posicao == "GOL") {
                jogador.listPriority = 0;
            } else if (posicao == "DEFESA") {
                jogador.listPriority = 1;
            } else {
                jogador.listPriority = 2;
            }
            $scope.resort()
            $scope.updateDatabase();
        }

        $scope.resort = function(){
            $scope.patotaData.jogadores = $filter('orderBy')($scope.patotaData.jogadores, ['-dentro','listPriority']);
        }

        $scope.reset = function () {
            //                               velocidade, habilidade, marcacao
            $scope.patotaData.jogadores = [
                new Jogador("Patrick", true, 0, "GOL", 1, 3, 4),
                new Jogador("Moises", true, 0, "GOL", 3, 3, 3),
                new Jogador("Rodrigo", true, 1, "DEFESA", 4, 3, 4),
                new Jogador("Poffo", true, 1, "DEFESA", 4, 2, 3),
                new Jogador("Maicon", true, 1, "DEFESA", 2, 1, 5),
                new Jogador("Fabio", true, 1, "DEFESA", 1, 1, 4),
                new Jogador("Edelei", true, 1, "DEFESA", 2, 2, 2),
                new Jogador("Chapolin", true, 1, "DEFESA", 4, 3, 3),
                new Jogador("Elisson", true, 1, "DEFESA", 3, 3, 3),
                new Jogador("Maninho", true, 2, "ATAQUE", 5, 4, 5),
                new Jogador("Sergio", true, 2, "ATAQUE", 3, 3, 1),
                new Jogador("Lucas", true, 2, "ATAQUE", 3, 3, 3),
                new Jogador("Duca", true, 2, "ATAQUE", 2, 3, 3),
                new Jogador("Ricardo", true, 2, "ATAQUE", 5, 5, 5),
                new Jogador("Marlon", true, 2, "ATAQUE", 4, 4, 4),
                new Jogador("Anderson", true, 2, "ATAQUE", 4, 4, 4),
                new Jogador("Henrique", true, 2, "ATAQUE", 2, 3, 2)
            ];
            window.jogadores = $scope.patotaData.jogadores;

            $scope.patotaData.goleiros = [];
            $scope.patotaData.defensores = [];
            $scope.patotaData.atacantes = [];

            $scope.patotaData.timeA = [];
            $scope.patotaData.timeB = [];

            if ($scope.qtdJogadoresDentro() % 2 != 0) {
                if ($scope.qtdDefesaDentro() > $scope.qtdAtaqueDentro()) {
                    $scope.addConvidado("ATAQUE");
                } else {
                    $scope.addConvidado("DEFESA");
                }
            }
            $scope.populateDefensoresAtacantes();
            $scope.updateDatabase();
        }

        $scope.removeJogador = function(id) {
            $scope.patotaData.jogadores.forEach(function(item, i){
                if(item.id == id) {
                    $scope.patotaData.jogadores.splice(i,1);
                    return;
                }
            })
        }

        $scope.populateDefensoresAtacantes = function () {
            $scope.patotaData.goleiros = [...$scope.patotaData.jogadores].filter(function (j) { return j.predominancia == "GOL" && j.dentro });
            $scope.patotaData.defensores = [...$scope.patotaData.jogadores].filter(function (j) { return j.predominancia == "DEFESA" && j.dentro });
            $scope.patotaData.atacantes = [...$scope.patotaData.jogadores].filter(function (j) { return j.predominancia == "ATAQUE" && j.dentro });

            
            $scope.patotaData.defensores = $filter('orderBy')($scope.patotaData.defensores, ['-scoreDefesa']);
            $scope.patotaData.atacantes = $filter('orderBy')($scope.patotaData.atacantes, ['-scoreAtaque']);
        }

        db.load().then(function (patotaData) {
            patotaData.jogadores = Jogador.fromListJson(patotaData.jogadores);
            patotaData.timeA = Jogador.fromListJson(patotaData.timeA);
            patotaData.timeB = Jogador.fromListJson(patotaData.timeB);
            $scope.patotaData = patotaData;
            if (!$scope.patotaData.jogadores) {
                $scope.reset();
            }
            $scope.populateDefensoresAtacantes();
            $scope.patotaData.jogadores = $filter('orderBy')($scope.patotaData.jogadores, ['-dentro','listPriority']);
        });

        $scope.gol = function (jogador, acao, time) {
            gol = acao == "+" ? +1 : -1;
            jogador.gols += gol;
            time == "timeA" ? $scope.patotaData.golsTimeA += gol : $scope.patotaData.golsTimeB += gol
            $scope.updateDatabase();
        }

        $scope.zerarSorteioPlacar = function () {
            $scope.patotaData.dataSorteio = "";
            $scope.patotaData.golsTimeA = $scope.patotaData.golsTimeB = 0;
            $scope.patotaData.jogadores.map(j => j.gols = 0);
            $scope.patotaData.timeA = [];
            $scope.patotaData.timeB = [];
            $scope.updateDatabase();
        }

        $scope.sortear = function sortear(tentativa) {
            $scope.patotaData.dataSorteio = new Date();
            $scope.populateDefensoresAtacantes();

            if ($scope.qtdJogadoresDentro() % 2 != 0) {
                alert("Sem sorteio com jogadores ímpares! Adicione um convidado.");
                return;
            }

            if ($scope.qtdAtaqueDentro() % 2 != 0) {
                alert("Sem sorteio com quantidade e ATACANTES ímpares! Adicione um convidado atacante ou reclassifique os jogadores.");
                return;
            }

            if ($scope.qtdDefesaDentro() % 2 != 0) {
                alert("Sem sorteio com quantidade e DEFENSORES ímpares! Adicione um convidado defensor ou reclassifique os jogadores.");
                return;
            }

            $scope.patotaData.goleiros = misturaAleatoria($scope.patotaData.goleiros);
            $scope.patotaData.defensores = misturaAleatoria($scope.patotaData.defensores);
            $scope.patotaData.atacantes = misturaAleatoria($scope.patotaData.atacantes);
            $scope.patotaData.timeA = [];
            $scope.patotaData.timeB = [];
            $scope.patotaData.golsTimeA = 0;
            $scope.patotaData.golsTimeB = 0;

            if (!tentativa) tentativa = 1;

            if (tentativa % 5 == 0) {
                $scope.DIFMIN = $scope.DIFMIN + 0.5;
                console.log("Foram feitas 5 tentativas, mas não foi possível selecionar um time equilibrado. Diferença mínima elevada para " + $scope.DIFMIN);
            }

            $scope.patotaData.goleiros.forEach(function (goleiro, i) {
                goleiro.gols = 0;
                if (i % 2 == 0) {
                    $scope.patotaData.timeA.push(goleiro);
                } else {
                    $scope.patotaData.timeB.push(goleiro);
                }
            });

            $scope.patotaData.defensores.forEach(function (defensor, i) {
                defensor.gols = 0;
                if (i % 2 == 0) {
                    $scope.patotaData.timeA.push(defensor);
                } else {
                    $scope.patotaData.timeB.push(defensor);
                }
            });

            $scope.patotaData.atacantes.forEach(function (atacante, i) {
                atacante.gols = 0;
                if (i % 2 == 0) {
                    $scope.patotaData.timeA.push(atacante);
                } else {
                    $scope.patotaData.timeB.push(atacante);
                }
            });

            $scope.somaScoreA = somaRanking($scope.patotaData.timeA);
            $scope.somaScoreB = somaRanking($scope.patotaData.timeB);
            var diff = $scope.somaScoreA - $scope.somaScoreB

            if (diff < ($scope.DIFMIN * -1) || diff > $scope.DIFMIN) {
                console.log("Diff atual", diff, "DIFMIN", $scope.DIFMIN);
                $("#alertsorteio").show(1000);
                $timeout(function () {
                    $("#alertsorteio").hide();
                    $scope.sortear(tentativa++);
                }, 5000);
            } else {
                $scope.patotaData.timeA = $filter('orderBy')($scope.patotaData.timeA, 'listPriority');
                $scope.patotaData.timeB = $filter('orderBy')($scope.patotaData.timeB, 'listPriority');
                $scope.updateDatabase();
            }
        }

    }]);


function ratingToStars(rating) {
    var estrelas = "";
    for (let i = 1; i <= rating; i++) {
        estrelas += "*";
    }
    return estrelas;
}

function misturaAleatoria(array) {
    let currentIndex = array.length, randomIndex;

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
    while (t.length < 12) {
        t = t + " ";
    }
    return t;
}
function padR5(t) {
    while (t.length < 5) {
        t = t + "_";
    }
    return t;
}


function printSorteio() {
    var divContents = document.getElementById("divsorteio").innerHTML;
    var a = window.open('', '', 'height=800, width=800');
    a.document.write('<html>');
    a.document.write('<head> \
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"> \
                <link rel="stylesheet" href="style.css"> \
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"> \
                <script  src="https://code.jquery.com/jquery-3.7.1.min.js"></script> \
                </head>');
    a.document.write('<body><div class="container-fluid"><div class="row">');
    a.document.write(divContents);
    a.document.write('</div></div></body></html>');
    a.document.close();
    setTimeout(function () { a.print(); }, 300);
    //a.print();
}

