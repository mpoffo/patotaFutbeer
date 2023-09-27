futbeerApp = angular.module('futbeerApp', []);

futbeerApp.controller('FutbeerCtrl', ['$scope', '$timeout',
    function FutbeerCtrl($scope, $timeout) {
        $scope.hoje = new Date();
        $scope.DIFMIN = 3;

        $scope.updateStorage = function () {
            localStorage.setItem('jogadores', JSON.stringify($scope.jogadores));
        }

        $scope.addConvidado = function (posicao) {
            $scope.jogadores.push(new Jogador("Nome convidado", true, 3, posicao, 3, 3, 3, true));
            $scope.updateStorage();
        }

        $scope.qtdJogadoresDentro = function () {
            return $scope.jogadores.filter(j => j.dentro).length
        }
        $scope.updateHabilidadeJogador = function (jogador, rating) {
            jogador.updateHabilidade(rating);
            $scope.updateStorage();
        }
        $scope.updateVelocidadeJogador = function (jogador, rating) {
            jogador.updateVelocidade(rating);
            $scope.updateStorage();
        }
        $scope.updateMarcacaoJogador = function (jogador, rating) {
            jogador.updateMarcacao(rating);
            $scope.updateStorage();
        }

        $scope.qtdDefesaDentro = function () {
            return $scope.jogadores.filter(j => j.predominancia == "DEFESA" && j.dentro).length
        }
        $scope.qtdAtaqueDentro = function () {
            return $scope.jogadores.filter(j => j.predominancia == "ATAQUE" && j.dentro).length
        }

        $scope.reset = function () {
            $scope.jogadores = [
                new Jogador("Marcos", true, 0, "GOL", 4, 3, 4),
                new Jogador("Patrick", true, 0, "GOL", 1, 3, 4),
                new Jogador("Rodrigo", true, 1, "DEFESA", 4, 3, 4),
                new Jogador("Poffo", true, 1, "DEFESA", 4, 2, 3),
                new Jogador("Maicon", true, 1, "DEFESA", 2, 1, 5),
                new Jogador("Fabio", true, 1, "DEFESA", 1, 1, 4),
                new Jogador("Edelei", true, 1, "DEFESA", 2, 2, 2),
                new Jogador("Chapolin", true, 1, "DEFESA", 4, 3, 3),
                new Jogador("Maninho", true, 2, "ATAQUE", 5, 4, 5),
                new Jogador("Sergio", true, 2, "ATAQUE", 3, 3, 1),
                new Jogador("Lucas", true, 2, "ATAQUE", 3, 3, 3),
                new Jogador("Duca", true, 2, "ATAQUE", 2, 3, 3),
                new Jogador("Ricardo", true, 2, "ATAQUE", 5, 5, 5),
                new Jogador("Henrique", true, 2, "ATAQUE", 4, 2, 2)
            ];
            window.jogadores = $scope.jogadores;

            $scope.goleiros = [];
            $scope.defensores = [];
            $scope.atacantes = [];

            $scope.timeA = [];
            $scope.timeB = [];

            if ($scope.qtdJogadoresDentro() % 2 != 0) {
                if ($scope.qtdDefesaDentro() > $scope.qtdAtaqueDentro()) {
                    $scope.addConvidado("ATAQUE");
                } else {
                    $scope.addConvidado("DEFESA");
                }
            }
            $scope.populateDefensoresAtacantes();
            localStorage.setItem('jogadores', JSON.stringify($scope.jogadores));
        }

        $scope.populateDefensoresAtacantes = function () {
            $scope.goleiros = [...$scope.jogadores].filter(function (j) { return j.predominancia == "GOL" && j.dentro });
            $scope.defensores = [...$scope.jogadores].filter(function (j) { return j.predominancia == "DEFESA" && j.dentro });
            $scope.atacantes = [...$scope.jogadores].filter(function (j) { return j.predominancia == "ATAQUE" && j.dentro });
        }

        $scope.jogadores = Jogador.fromListJson(localStorage.getItem('jogadores'));
        if (!$scope.jogadores) {
            $scope.reset();
        }
        window.jogadores = $scope.jogadores;
        $scope.populateDefensoresAtacantes();


        $scope.sortear = function sortear(tentativa) {

            if ($scope.qtdJogadoresDentro() % 2 != 0) {
                alert("Sem sorteio com jogadores ímpares! Adicione um convidado.");
                return;
            }

            $scope.goleiros = misturaAleatoria($scope.goleiros);
            $scope.defensores = misturaAleatoria($scope.defensores);
            $scope.atacantes = misturaAleatoria($scope.atacantes);
            $scope.timeA = [];
            $scope.timeB = [];

            if (!tentativa) tentativa = 1;

            if (tentativa % 5 == 0) {
                $scope.DIFMIN = $scope.DIFMIN + 0.5;
                console.log("Foram feitas 5 tentativas, mas não foi possível selecionar um time equilibrado. Diferença mínima elevada para " + $scope.DIFMIN);
            }

            $scope.goleiros.forEach(function (goleiro, i) {
                if (i % 2 == 0) {
                    $scope.timeA.push(goleiro);
                } else {
                    $scope.timeB.push(goleiro);
                }
            });

            $scope.defensores.forEach(function (defensor, i) {
                if (i % 2 == 0) {
                    $scope.timeA.push(defensor);
                } else {
                    $scope.timeB.push(defensor);
                }
            });

            $scope.atacantes.forEach(function (atacante, i) {
                if (i % 2 == 0) {
                    $scope.timeA.push(atacante);
                } else {
                    $scope.timeB.push(atacante);
                }
            });

            $scope.somaScoreA = somaRanking($scope.timeA);
            $scope.somaScoreB = somaRanking($scope.timeB);
            var diff = $scope.somaScoreA - $scope.somaScoreB

            if (diff < ($scope.DIFMIN * -1) || diff > $scope.DIFMIN) {
                console.log("Diff atual", diff, "DIFMIN", $scope.DIFMIN);
                $("#alertsorteio").show(1000);
                $timeout(function () {
                    $("#alertsorteio").hide();
                    $scope.sortear(tentativa++);
                }, 5000);
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
                <script  src="https://code.jquery.com/jquery-3.7.1.min.js"></script> \
                </head>');
    a.document.write('<body >');
    a.document.write(divContents);
    a.document.write('</body></html>');
    a.document.close();
    setTimeout(function () { a.print(); }, 100);
    //a.print();
}

